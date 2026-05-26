"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname, useSearchParams } from "next/navigation";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle hash scroll on mount or route change
  useEffect(() => {
    if (!lenisRef.current) return;
    const hash = window.location.hash;
    
    if (hash) {
      // Poll for the element in case it is inside a Suspense boundary
      let attempts = 0;
      const checkAndScroll = () => {
        try {
          const target = document.querySelector(hash);
          if (target) {
            lenisRef.current?.scrollTo(target, { immediate: true });
          } else if (attempts < 50) { // Try for up to 5 seconds
            attempts++;
            setTimeout(checkAndScroll, 100);
          }
        } catch (_e) {
          // Ignore invalid selectors
        }
      };
      checkAndScroll();
    } else {
       // if navigating back to root without hash, scroll top
       if (window.scrollY > 0) {
          lenisRef.current?.scrollTo(0, { immediate: true });
       }
    }
  }, [pathname, searchParams]);

  // Intercept anchor clicks on the same page for smooth scrolling
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.href && target.href.includes('#')) {
        const url = new URL(target.href);
        if (url.pathname === window.location.pathname) {
          e.preventDefault();
          const el = document.querySelector(url.hash);
          if (el) {
            lenisRef.current?.scrollTo(el);
            window.history.pushState(null, '', url.hash);
          }
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return <>{children}</>;
}
