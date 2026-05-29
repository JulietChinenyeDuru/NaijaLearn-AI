// user-events.js
// Helpers for tracking discrete user events.

export function trackEvent(name, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  } else {
    console.debug("[analytics] event", name, params);
  }
}

// Convenience wrappers
export const trackClick = (label) => trackEvent("click", { label });
export const trackSubmit = (formName) => trackEvent("submit", { form: formName });
export const trackQuestion = (topic) => trackEvent("ask_question", { topic });
