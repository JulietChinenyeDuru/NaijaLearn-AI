// error-logger.js
// Captures uncaught errors and unhandled promise rejections.

export function initErrorLogger({ sinkUrl = null } = {}) {
  function report(payload) {
    if (!sinkUrl) {
      console.error("[error-logger]", payload);
      return;
    }
    try {
      navigator.sendBeacon(sinkUrl, JSON.stringify(payload));
    } catch {
      // Logging must never throw.
    }
  }

  window.addEventListener("error", (event) => {
    report({
      type: "error",
      message: event.message,
      source: event.filename,
      line: event.lineno,
      col: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    report({
      type: "unhandledrejection",
      reason: String(event.reason),
    });
  });
}
