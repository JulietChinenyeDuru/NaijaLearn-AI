// uptime-monitor.js
// Periodically checks the chat function and reports availability.

const DEFAULT_INTERVAL_MS = 60_000;

export function startUptimeMonitor({
  url = "/.netlify/functions/chat",
  intervalMs = DEFAULT_INTERVAL_MS,
  onStatus = (status) => console.log("[uptime]", status),
} = {}) {
  async function check() {
    const startedAt = performance.now();
    try {
      // A bare GET should be rejected by the function (405), which still
      // proves it is reachable and responding.
      const res = await fetch(url, { method: "GET" });
      const latencyMs = Math.round(performance.now() - startedAt);
      onStatus({ up: true, status: res.status, latencyMs });
    } catch (err) {
      onStatus({ up: false, status: 0, error: String(err) });
    }
  }

  check();
  const id = setInterval(check, intervalMs);
  return () => clearInterval(id); // call to stop monitoring
}
