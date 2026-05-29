// engagement-tracker.js
// Tracks engagement signals: scroll depth and time on page.

import { trackEvent } from "./user-events.js";

export function initEngagementTracker() {
  const milestones = [25, 50, 75, 100];
  const reached = new Set();

  function onScroll() {
    const scrolled =
      (window.scrollY + window.innerHeight) /
      document.documentElement.scrollHeight;
    const pct = Math.round(scrolled * 100);

    for (const m of milestones) {
      if (pct >= m && !reached.has(m)) {
        reached.add(m);
        trackEvent("scroll_depth", { percent: m });
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  const startedAt = performance.now();
  window.addEventListener("beforeunload", () => {
    const seconds = Math.round((performance.now() - startedAt) / 1000);
    trackEvent("time_on_page", { seconds });
  });
}
