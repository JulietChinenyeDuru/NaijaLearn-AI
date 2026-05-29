// google-analytics.js
// Loads and initializes Google Analytics (GA4).

export function initGoogleAnalytics(measurementId) {
  if (!measurementId) {
    console.warn("[analytics] No GA measurement ID provided; skipping.");
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", measurementId);
}
