"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

function getSessionId() {
  if (typeof window === "undefined") return null;
  const KEY = "__pf_sid";
  let id = window.sessionStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    window.sessionStorage.setItem(KEY, id);
  }
  return id;
}

function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  if (typeof window === "undefined" || window.posthog) return;
  // Lightweight loader avoiding a runtime dependency
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const script = document.createElement("script");
  script.async = true;
  script.src = `${host}/static/array.js`;
  document.head.appendChild(script);
  const w = window as unknown as { posthog?: { init?: (k: string, opts: object) => void } };
  // Init is queued by array.js; replay below applies when array script lands.
  script.onload = () => {
    w.posthog?.init?.(key, { api_host: host, capture_pageview: false, persistence: "memory" });
  };
}

export function Analytics() {
  const path = usePathname();
  const lastPath = useRef<string | null>(null);
  const reportedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    if (!path) return;
    if (lastPath.current === path) return;
    lastPath.current = path;
    reportedDepths.current = new Set();
    const sid = getSessionId();
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "page_view", path, sessionId: sid }),
      keepalive: true,
    }).catch(() => {});
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture("page_view", { path });
    }
  }, [path]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max <= 0) return;
      const ratio = h.scrollTop / max;
      [25, 50, 75, 100].forEach((d) => {
        if (ratio * 100 >= d && !reportedDepths.current.has(d)) {
          reportedDepths.current.add(d);
          void track({ type: "scroll_depth", depth: d as 25 | 50 | 75 | 100, path: path ?? "/" });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  return null;
}
