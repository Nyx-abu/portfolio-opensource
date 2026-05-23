import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const display = localFont({
  src: [
    {
      path: "../../public/fonts/DxPlayhigh-Expanded.otf",
      style: "normal",
      weight: "500",
    },
    {
      path: "../../public/fonts/DxPlayhigh-ExtraExpandedBack.otf",
      style: "normal",
      weight: "700",
    },
    {
      path: "../../public/fonts/DxPlayhigh-CondensedItalic.otf",
      style: "italic",
      weight: "500",
    },
  ],
  variable: "--font-display",
  display: "swap",
  preload: true,
  fallback: ["ui-serif", "Georgia", "serif"],
});

export const script = localFont({
  src: [
    {
      path: "../../public/fonts/KiyaHandwrite.woff2",
      style: "normal",
      weight: "400",
    },
  ],
  variable: "--font-script",
  display: "swap",
  preload: false,
  fallback: ["cursive"],
});
