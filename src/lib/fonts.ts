import { Space_Grotesk, JetBrains_Mono, Syne } from "next/font/google";
import localFont from "next/font/local";

export const sans = Space_Grotesk({
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

export const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
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
