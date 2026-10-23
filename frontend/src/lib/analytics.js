/**
 * Privacy-First Athletic Analytics Engine
 * Complies with GDPR / ePrivacy. Respects user cookie consent status.
 */

const STORAGE_KEY = 'opengym_cookie_consent';

export function hasUserConsent() {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === 'accepted';
  } catch {
    return false;
  }
}

export function trackEvent(eventName, properties = {}) {
  // If user declined or hasn't accepted, do not emit analytics
  if (!hasUserConsent()) {
    // In dev, log quiet hint
    if (process.env.NODE_ENV === 'development') {
      console.debug('[openGym Analytics: Consent Not Granted]', eventName, properties);
    }
    return;
  }

  const payload = {
    event: eventName,
    ...properties,
    ts: Date.now(),
    path: window.location.hash || window.location.pathname
  };

  // If Umami is configured on window
  if (typeof window !== 'undefined' && window.umami && typeof window.umami.track === 'function') {
    try {
      window.umami.track(eventName, properties);
    } catch {}
  }

  // Internal dispatch for telemetry or plugins
  window.dispatchEvent(new CustomEvent('opengym:telemetry', { detail: payload }));
}

export function trackPageView(pageName) {
  trackEvent('pageview', { page: pageName });
}

