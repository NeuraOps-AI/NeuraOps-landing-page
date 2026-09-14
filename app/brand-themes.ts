export type RGB = readonly [number, number, number];

export interface BrandTheme {
  name: string;
  accent: string;
  accentDark: string;
  secondary: string;
  soft: string;
  tint: string;
  strong: string;
  closing: string;
  neurons: readonly [RGB, RGB, RGB];
}

// Logo, page surfaces, controls, and canvas signals share this single palette.
export const BRAND_THEMES: readonly BrandTheme[] = [
  {
    name: "Cyan & blue", accent: "#1468cb", accentDark: "#174b8b",
    secondary: "#16bbd6", soft: "#e9f4fc", tint: "#edf6fb",
    strong: "#d6e9f5", closing: "#132d4b",
    neurons: [[0, 182, 216], [0, 116, 239], [0, 56, 163]],
  },
  {
    name: "Magenta & electric blue", accent: "#8850c5", accentDark: "#634095",
    secondary: "#ed0d99", soft: "#f3eafa", tint: "#f6f0fa",
    strong: "#e8dcf6", closing: "#2e203f",
    neurons: [[232, 0, 161], [146, 37, 225], [0, 133, 246]],
  },
  {
    name: "Steel blue & navy", accent: "#50739e", accentDark: "#294c76",
    secondary: "#82a6d0", soft: "#edf2f7", tint: "#eff3f8",
    strong: "#dce5f1", closing: "#1d304a",
    neurons: [[117, 158, 212], [58, 101, 161], [15, 47, 99]],
  },
  {
    name: "Cyan & violet", accent: "#7452d3", accentDark: "#563e9b",
    secondary: "#12b7e7", soft: "#eeebfc", tint: "#f1f0fb",
    strong: "#e3def7", closing: "#292044",
    neurons: [[0, 177, 233], [66, 107, 239], [131, 43, 235]],
  },
  {
    name: "Emerald & sapphire", accent: "#087f6f", accentDark: "#115b50",
    secondary: "#4776ed", soft: "#e6f6ef", tint: "#eff9f3",
    strong: "#ccebdd", closing: "#112f2a",
    neurons: [[0, 193, 129], [0, 157, 189], [52, 89, 224]],
  },
  {
    name: "Coral & violet", accent: "#b64562", accentDark: "#803347",
    secondary: "#8661e8", soft: "#fcecef", tint: "#fff3f1",
    strong: "#f6d5dc", closing: "#38222c",
    neurons: [[246, 118, 78], [224, 66, 144], [109, 63, 214]],
  },
  {
    name: "Amber & teal", accent: "#94601e", accentDark: "#704319",
    secondary: "#078ca4", soft: "#fbf2e3", tint: "#fcf7ee",
    strong: "#f0dfbf", closing: "#332a20",
    neurons: [[239, 176, 53], [124, 174, 93], [0, 134, 158]],
  },
];

export function themeForLogo(logo: number): BrandTheme {
  return BRAND_THEMES[logo - 1] ?? BRAND_THEMES[0];
}
