// performance-monitor.js
// Collects navigation timing and reports basic performance metrics.

export function initPerformanceMonitor({
  onMetrics = (metrics) => console.log("[performance]", metrics),
} = {}) {
  window.addEventListener("load", () => {
    // Defer so the load event fully settles before reading timings.
    setTimeout(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      if (!nav) return;

      onMetrics({
        type: "navigation",
        ttfbMs: Math.round(nav.responseStart),
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
        loadCompleteMs: Math.round(nav.loadEventEnd),
      });
    }, 0);
  });
}
