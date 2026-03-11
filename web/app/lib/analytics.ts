type GTag = (command: string, ...args: unknown[]) => void;

function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  try {
    const gtag = (window as unknown as { gtag?: GTag }).gtag;
    if (typeof window !== "undefined" && typeof gtag === "function") {
      gtag("event", eventName, params);
    }
  } catch {
    // never throw analytics errors
  }
}

export const analytics = {
  originPanelViewed: (panelId: string) =>
    trackEvent("origin_panel_viewed", { panel: panelId }),

  originJourneyComplete: () =>
    trackEvent("origin_journey_complete"),

  reserveButtonClicked: (chili: string) =>
    trackEvent("reserve_button_clicked", { chili }),

  waitlistSubmitted: (source: string) =>
    trackEvent("waitlist_submitted", { source }),

  newsletterSubmitted: () =>
    trackEvent("newsletter_submitted"),

  collectionCardClicked: (chili: string) =>
    trackEvent("collection_card_clicked", { chili }),
};
