"use client";

export type AnalyticsEventInput =
  | { type: "page_view"; path: string }
  | { type: "project_click"; projectId: string; projectTitle: string }
  | { type: "cta_click"; label: string }
  | { type: "contact_click" }
  | { type: "scroll_depth"; depth: 25 | 50 | 75 | 100; path: string };

type PostHogLike = { capture: (event: string, props?: Record<string, unknown>) => void };

declare global {
  interface Window {
    posthog?: PostHogLike;
  }
}

export async function track(event: AnalyticsEventInput) {
  try {
    if (typeof window !== "undefined" && window.posthog) {
      const { type, ...rest } = event;
      window.posthog.capture(type, rest);
    }
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // analytics is best-effort
  }
}
