"use client";

import React, { createContext, useContext } from "react";
import AnalyticsScripts, { GA_MEASUREMENT_ID } from "./analytics-scripts";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendEvent(name: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined" || process.env.NODE_ENV !== "production") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    // The Google tag queue uses Arguments objects for its command API.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("event", name, properties);
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

export interface AnalyticsContextType {
  trackEvent: (name: string, properties?: Record<string, unknown>) => void;
  trackPageView: (url: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: () => {},
  trackPageView: () => {},
});

/**
 * Google Analytics event helpers and site-wide GA4 / Clarity installation.
 */
export function AnalyticsProvider({
  children,
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || GA_MEASUREMENT_ID,
}: {
  children: React.ReactNode;
  measurementId?: string;
}) {
  const trackEvent = (name: string, properties?: Record<string, unknown>) => {
    sendEvent(name, properties);
    if (typeof window !== "undefined") {
      // Dispatches analytics event or logs in development
      if (process.env.NODE_ENV === "development") {
        console.debug(`[Analytics Event] ${name}:`, properties);
      }
    }
  };

  const trackPageView = (url: string) => {
    sendEvent("page_view", { page_location: url });
    if (typeof window !== "undefined") {
      if (process.env.NODE_ENV === "development") {
        console.debug(`[Analytics PageView]: ${url}`);
      }
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
      <AnalyticsScripts measurementId={measurementId} />
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsContextType {
  return useContext(AnalyticsContext);
}
