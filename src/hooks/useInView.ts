"use client";

import { useEffect, useRef, useState } from "react";

type Options = IntersectionObserverInit & { once?: boolean };

export function useInView<T extends HTMLElement = HTMLDivElement>(options: Options = {}) {
  const { once = true, threshold = 0.2, rootMargin = "0px 0px -10% 0px", root = null } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin, root },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [once, threshold, rootMargin, root]);

  return { ref, inView };
}
