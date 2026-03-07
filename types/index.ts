export type PortfolioVersion = "genai" | "fullstack";
export type TabId = "hello" | "about-me" | "projects" | "contact";
export type FormState = "idle" | "sending" | "sent";

export interface ColorScheme {
  bg: string;
  sidebar: string;
  panel: string;
  surface: string;
  elevated: string;
  border: string;
  borderMd: string;
  borderHi: string;
  text: string;
  textMid: string;
  textDim: string;
  textBright: string;
  accent: string;
  accentDim: string;
  accentMid: string;
  green: string;
  greenDim: string;
  orange: string;
  orangeDim: string;
  purple: string;
  purpleDim: string;
  red: string;
  synKeyword: string;
  synFunc: string;
  synStr: string;
  synType: string;
  synComment: string;
  synProp: string;
  lineNum: string;
}

export interface VersionConfig {
  accent: string;
  accentDim: string;
  accentMid: string;
  brandName: string;
  tagline: string;
  badge: string;
  bottomBar: string;
  ctaText: string;
}

export interface Social {
  key: string;
  label: string;
  href: string;
  Icon: any;
  shortLabel: string;
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}