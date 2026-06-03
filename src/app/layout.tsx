import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { sans, mono, display, script } from "@/lib/fonts";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/cn";
import { Analytics } from "@/components/providers/Analytics";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { Preloader } from "@/components/motion/Preloader";

export const metadata: Metadata = buildMetadata();
export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(sans.variable, mono.variable, display.variable, script.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-dvh overflow-x-hidden selection:bg-accent-500/60 selection:text-paper">
        <Preloader />
        <CustomCursor />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-paper focus:px-3 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
        <div className="noise-overlay" aria-hidden />
      </body>
    </html>
  );
}
