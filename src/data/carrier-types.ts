export interface CarrierInfo {
  id: string;
  name: string;
  fullName: string;
  country: string;
  countryCode: string;
  region: "north-america" | "europe" | "asia" | "oceania" | "africa" | "south-america" | "middle-east" | "global";
  type: "postal" | "private" | "courier" | "logistics";
  color: string;
  bgColor: string;
  website: string;
  phone: string;
  trackingUrl: string;
  trackingFormats: { format: string; example: string; service: string }[];
  services: { name: string; delivery: string; price: string; tracking: string }[];
  statuses: { status: string; meaning: string }[];
  faq: { q: string; a: string }[];
  content: {
    intro: string;
    about: string;
    howToTrack: string[];
  };
  keywords: string[];
}
