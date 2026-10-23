/**
 * Enterprise Client-Side Error Monitoring Suite
 * Captures unhandled runtime errors, maintains debug breadcrumbs, and safeguards UI stability
 */

const MAX_BREADCRUMBS = 25;
const errorLog = [];

export function recordBreadcrumb(category, message, data = {}) {
  const entry = {
    ts: new Date().toISOString(),
    category,
    message,
    data
  };
  errorLog.push(entry);
  if (errorLog.length > MAX_BREADCRUMBS) {
    errorLog.shift();
  }
}

export function getRecentErrors() {
  return [...errorLog];
}

export function initErrorMonitoring() {
  if (typeof window === 'undefined') return;

  // Global window error listener
  window.addEventListener('error', (event) => {
    const errorObj = {
      message: event.message || 'Unknown runtime error',
      source: event.filename || 'anonymous',
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || null
    };

    recordBreadcrumb('runtime_error', errorObj.message, errorObj);
    console.error('[openGym Error Monitor Captured Exception]', errorObj);
  });

  // Global unhandled promise rejection listener
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const errorObj = {
      message: reason?.message || String(reason) || 'Unhandled Promise Rejection',
      stack: reason?.stack || null
    };

    recordBreadcrumb('unhandled_rejection', errorObj.message, errorObj);
    console.error('[openGym Error Monitor Captured Rejection]', errorObj);
  });

  recordBreadcrumb('lifecycle', 'Error monitoring initialized successfully.');
}

