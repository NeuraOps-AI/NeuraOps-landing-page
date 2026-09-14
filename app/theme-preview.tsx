"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { BRAND_THEMES, themeForLogo } from "./brand-themes";
import styles from "./theme-preview.module.css";

export function ThemePreview({ scheduledLogo, previewLogo, onSelect }: {
  scheduledLogo: number;
  previewLogo: number | null;
  onSelect: (logo: number | null) => void;
}) {
  const panel = useRef<HTMLDetailsElement>(null);
  const activeLogo = previewLogo ?? scheduledLogo;

  useEffect(() => {
    const details = panel.current;
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && details?.open) {
        details.open = false;
        details.querySelector("summary")?.focus();
        event.stopPropagation();
      }
    }
    details?.addEventListener("keydown", closeWithEscape);
    return () => details?.removeEventListener("keydown", closeWithEscape);
  }, []);

  return <details
    ref={panel}
    className={styles.preview}
  >
    <summary className={styles.toggle}>
      <span className={styles.dot} aria-hidden="true" />
      Theme preview
      <span className={styles.badge}>Local</span>
      <span className={styles.chevron} aria-hidden="true">⌃</span>
    </summary>
    <div className={styles.panel}>
      <p className={styles.intro}>Seven days, seven identities. Try each logo with its page colours and neural animation.</p>
      <div className={styles.options} role="group" aria-label="Preview a logo and colour theme">
        {BRAND_THEMES.map((theme, index) => <button
          key={theme.name}
          type="button"
          aria-pressed={previewLogo === index + 1}
          onClick={() => onSelect(index + 1)}
          style={{ "--preview-accent": theme.accent, "--preview-secondary": theme.secondary } as CSSProperties}
        >
          <span className={styles.swatch} aria-hidden="true" />
          <span><strong>Logo {index + 1}</strong><small>{theme.name}</small></span>
        </button>)}
      </div>
      <button
        className={styles.auto}
        type="button"
        aria-pressed={previewLogo === null}
        onClick={() => onSelect(null)}
      >Auto · Today’s logo {scheduledLogo}</button>
      <p className={styles.status} role="status">
        {previewLogo === null ? "Automatic" : "Previewing"} · Logo {activeLogo}<br />
        {themeForLogo(activeLogo).name}
      </p>
      <p className={styles.note}>Automatic rotation runs at midnight IST. Preview resets on refresh. This panel appears only in local development.</p>
    </div>
  </details>;
}
