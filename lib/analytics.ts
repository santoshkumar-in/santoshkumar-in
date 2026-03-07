// ─────────────────────────────────────────────────────────────────────────────
// Usage
// ─────────────────────────────────────────────────────────────────────────────
/*
 // Version switch
trackEvent("version_switch", { from_version: version, to_version: newVersion });

// Contact form
trackEvent("contact_form_submit", { version });

// Social link click
trackEvent("social_click", { platform: "github", version });

// CTA button
trackEvent("cta_click", { label: "Get in touch", href: "/contact", version });

// Cookie
trackEvent("cookie_consent_granted", {});
 * 
*/


// ─── Type safety for all events ──────────────────────────────────────────────
type EventMap = {
  // Portfolio
  version_switch:      { from_version: string; to_version: string };
  section_view:        { section: string; version: string };
  page_view:           { page_path: string; version: string };
  project_click:       { project_id: string; project_name: string };

  // Contact
  contact_form_submit: { form_name: 'contact', form_location: '/contact', version: string };
  contact_form_error:  { version: string; error: string };

  // CTA clicks
  cta_click:           { label: string; href: string; version: string };
  social_click:        { platform: string; version: string };

  // Cookie
  cookie_consent_granted:  Record<string, never>;
  cookie_consent_declined: Record<string, never>;
};

type EventName = keyof EventMap;

// ─── Core tracker ─────────────────────────────────────────────────────────────
export function trackEvent<T extends EventName>(
  event: T,
  params: EventMap[T]
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") {
    console.warn(`[analytics] gtag not ready — event dropped: ${event}`);
    return;
  }

  window.gtag("event", event, params);
}