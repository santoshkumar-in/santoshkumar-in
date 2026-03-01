// Google Tag Manager event tracking utilities

declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Push event to GTM dataLayer
 */
export function gtmEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === "undefined") return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventData,
  });
  
  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("GTM Event:", eventName, eventData);
  }
}

/**
 * Track page view
 */
export function gtmPageView(pagePath: string, pageTitle?: string) {
  gtmEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  });
}

/**
 * Track contact form submission
 */
export function gtmContactSubmit(version: string, success: boolean) {
  gtmEvent("contact_form_submit", {
    form_name: "contact",
    form_location: "/contact",
    user_version: version,
    success: success,
  });
}

/**
 * Track version switch
 */
export function gtmVersionSwitch(fromVersion: string, toVersion: string) {
  gtmEvent("version_switch", {
    from_version: fromVersion,
    to_version: toVersion,
  });
}

/**
 * Track outbound link click
 */
export function gtmOutboundClick(url: string, linkText: string) {
  gtmEvent("outbound_click", {
    link_url: url,
    link_text: linkText,
    link_domain: new URL(url).hostname,
  });
}

/**
 * Track button/CTA click
 */
export function gtmCtaClick(ctaName: string, ctaLocation: string) {
  gtmEvent("cta_click", {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
}

/**
 * Track project view
 */
export function gtmProjectView(projectId: string, projectName: string, version: string) {
  gtmEvent("project_view", {
    project_id: projectId,
    project_name: projectName,
    user_version: version,
  });
}

/**
 * Track file download
 */
export function gtmFileDownload(fileName: string, fileType: string) {
  gtmEvent("file_download", {
    file_name: fileName,
    file_type: fileType,
  });
}

/**
 * Track error
 */
export function gtmError(errorType: string, errorMessage: string, errorLocation: string) {
  gtmEvent("error", {
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation,
  });
}

/**
 * Track search
 */
export function gtmSearch(searchTerm: string, searchResults: number) {
  gtmEvent("search", {
    search_term: searchTerm,
    search_results: searchResults,
  });
}

/**
 * Track scroll depth
 */
export function gtmScrollDepth(depth: number) {
  gtmEvent("scroll", {
    scroll_depth: depth,
    page_path: window.location.pathname,
  });
}

/**
 * Track time on page
 */
export function gtmTimeOnPage(seconds: number, pagePath: string) {
  gtmEvent("time_on_page", {
    time_seconds: seconds,
    page_path: pagePath,
  });
}

/**
 * Track custom conversion
 */
export function gtmConversion(conversionName: string, conversionValue?: number) {
  gtmEvent("conversion", {
    conversion_name: conversionName,
    conversion_value: conversionValue,
  });
}
