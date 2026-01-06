// Google Analytics 4 utilities

// Type declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// GA4 Measurement ID - set this in your environment or replace with your actual ID
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

/**
 * Track a page view (called on route changes).
 */
export function trackPageView(url: string): void {
  if (typeof window.gtag !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}

/**
 * Track a custom event.
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

/**
 * Track an outbound link click.
 */
export function trackLinkClick(linkName: string, linkUrl: string): void {
  trackEvent('click', 'outbound_link', linkName);

  // Also track via custom API
  const sessionId = sessionStorage.getItem('analytics_session_id');
  fetch('/api/analytics/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      linkUrl,
      linkLabel: linkName,
      referrerPath: window.location.pathname,
    }),
  }).catch(console.error);
}

/**
 * Track chat interactions.
 */
export function trackChatInteraction(action: 'open' | 'send' | 'close'): void {
  trackEvent(action, 'chatbot');
}
