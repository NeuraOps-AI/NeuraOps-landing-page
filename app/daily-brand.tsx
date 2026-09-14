"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useState, type CSSProperties } from "react";
import { logoForDate, millisecondsUntilBrandChange } from "./brand-schedule";
import { themeForLogo } from "./brand-themes";
import { ThemePreview } from "./theme-preview";

const BrandContext = createContext(1);

export function useDailyTheme() {
  return themeForLogo(useContext(BrandContext));
}

export function DailyBrandProvider({ initialLogo, children }: {
  initialLogo: number;
  children: React.ReactNode;
}) {
  const [logo, setLogo] = useState(initialLogo);
  const [previewLogo, setPreviewLogo] = useState<number | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function sync() {
      clearTimeout(timer);
      const now = new Date();
      setLogo(logoForDate(now));
      timer = setTimeout(sync, millisecondsUntilBrandChange(now) + 100);
    }
    function onVisible() { if (!document.hidden) sync(); }
    sync();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const activeLogo = process.env.NODE_ENV === "development" ? previewLogo ?? logo : logo;
  const theme = themeForLogo(activeLogo);
  const style = {
    "--accent": theme.accent,
    "--accent-dark": theme.accentDark,
    "--alt": theme.secondary,
    "--soft": theme.soft,
    "--tint": theme.tint,
    "--strong": theme.strong,
    "--closing": theme.closing,
  } as CSSProperties;

  return <BrandContext.Provider value={activeLogo}>
    <div className="brand-theme" data-theme={activeLogo} style={style}>
      {children}
      {process.env.NODE_ENV === "development" && <ThemePreview
        scheduledLogo={logo}
        previewLogo={previewLogo}
        onSelect={setPreviewLogo}
      />}
    </div>
  </BrandContext.Provider>;
}

export function DailyLogo({ prominent = false, aboveFold = false }: { prominent?: boolean; aboveFold?: boolean }) {
  const logo = useContext(BrandContext);
  // Both placements share one asset. Eager loading also keeps the footer copy
  // from overriding the header's loading mode in Next's URL-keyed LCP check.
  return <span className="original-logo" data-logo={logo}>
    <Image
      src={`/logos/${logo}_neuraops.svg`}
      alt="NeuraOps Technologies"
      width={logo === 2 ? 1050 : 1190}
      height={logo === 2 ? 674 : 725}
      sizes={prominent ? "240px" : "190px"}
      loading="eager"
      fetchPriority={aboveFold ? "high" : "auto"}
      unoptimized
    />
  </span>;
}
