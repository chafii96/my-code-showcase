export interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  detail: string;
}

export interface TrackingData {
  trackingNumber: string;
  status: "shipped" | "in-transit" | "out-for-delivery" | "delivered";
  statusLabel: string;
  estimatedDelivery: string;
  shippingClass: string;
  origin: string;
  destination: string;
  weight: string;
  events: TrackingEvent[];
}

export const trackingStatuses = [
  { slug: "in-transit-to-next-facility", name: "In Transit to Next Facility", description: "Your package is moving between USPS processing facilities. This status means your item has left one location and is en route to the next sorting center or distribution hub.", faq: "This usually takes 1-3 business days depending on distance." },
  { slug: "departed-shipping-partner-facility", name: "Departed Shipping Partner Facility", description: "Your package has left a third-party shipping partner's facility and is now in the USPS network. USPS partners with companies like UPS and FedEx for certain deliveries.", faq: "Updates may be delayed 24-48 hours as the package transfers between systems." },
  { slug: "out-for-delivery", name: "Out for Delivery", description: "Your package is on a delivery vehicle and will be delivered today. The mail carrier has your item and is making deliveries along their route.", faq: "Delivery typically occurs between 9 AM and 5 PM local time." },
  { slug: "delivered", name: "Delivered", description: "Your package has been delivered to the address on the label. It may have been left at your door, in your mailbox, or with a household member.", faq: "If you can't find your package, check with neighbors and wait 24 hours before filing a claim." },
  { slug: "shipping-label-created", name: "Shipping Label Created", description: "A shipping label has been created but USPS has not yet received the package. The sender has prepared the shipment.", faq: "USPS will update the tracking once they physically scan your item." },
  { slug: "arrived-at-hub", name: "Arrived at USPS Hub", description: "Your package has arrived at a USPS regional hub for sorting. From here it will be routed to the facility closest to the delivery address.", faq: "Packages typically spend a few hours at sorting hubs." },
  { slug: "alert-notice-left", name: "Alert - Notice Left", description: "A delivery was attempted but no one was available. A notice was left with instructions for redelivery or pickup.", faq: "You can schedule a redelivery online or pick up from your local post office." },
  { slug: "held-at-post-office", name: "Held at Post Office", description: "Your package is being held at the local post office. This may be at your request or because delivery could not be completed.", faq: "Bring a valid photo ID to claim your package within 15 days." },
];

export const majorLocations = [
  { slug: "new-york-ny", city: "New York", state: "NY", facilities: 12, dailyVolume: "2.4M" },
  { slug: "los-angeles-ca", city: "Los Angeles", state: "CA", facilities: 8, dailyVolume: "1.8M" },
  { slug: "chicago-il", city: "Chicago", state: "IL", facilities: 6, dailyVolume: "1.2M" },
  { slug: "houston-tx", city: "Houston", state: "TX", facilities: 5, dailyVolume: "980K" },
  { slug: "phoenix-az", city: "Phoenix", state: "AZ", facilities: 4, dailyVolume: "720K" },
  { slug: "philadelphia-pa", city: "Philadelphia", state: "PA", facilities: 5, dailyVolume: "850K" },
  { slug: "dallas-tx", city: "Dallas", state: "TX", facilities: 5, dailyVolume: "910K" },
  { slug: "atlanta-ga", city: "Atlanta", state: "GA", facilities: 6, dailyVolume: "1.1M" },
  { slug: "miami-fl", city: "Miami", state: "FL", facilities: 4, dailyVolume: "780K" },
  { slug: "seattle-wa", city: "Seattle", state: "WA", facilities: 3, dailyVolume: "650K" },
  { slug: "denver-co", city: "Denver", state: "CO", facilities: 3, dailyVolume: "520K" },
  { slug: "boston-ma", city: "Boston", state: "MA", facilities: 4, dailyVolume: "690K" },
];

export const faqData = [
  { question: "How do I track a USPS package?", answer: "Enter your USPS tracking number in the search box above. You can find it on your receipt, shipping confirmation email, or package label. USPS tracking numbers are typically 20-22 digits long. Our free USPS tracking tool gives you real-time status updates for all United States Postal Service shipments." },
  { question: "What is USPS tracking and how does it work?", answer: "USPS tracking (also called US postal tracking or postal service tracking) is a free service from the United States Postal Service that lets you monitor your package's journey from sender to recipient. Every trackable package gets scanned at multiple USPS facilities, creating a tracking history you can view online by entering your tracking number." },
  { question: "How to track a package without a tracking number?", answer: "If you don't have a tracking number, sign up for USPS Informed Delivery — a free service that previews your incoming mail and packages. You can also contact the sender to request the number, check your email for shipping confirmations, or visit your local post office with your ID." },
  { question: "Can I track USPS mail and letters, not just packages?", answer: "Yes! USPS mail tracking is available for Certified Mail, Registered Mail, and Priority Mail letters. Regular First-Class letters don't include tracking, but USPS Informed Delivery provides grayscale previews of all letter-sized mail coming to your address. For packages, all USPS services include free tracking." },
  { question: "Why is my USPS tracking not updating?", answer: "USPS tracking may not update because: the package hasn't been scanned yet, it's moving between facilities without scan points, or there's a system delay. During peak seasons, 24-48 hour delays in tracking updates are common. If tracking hasn't updated for 5+ business days, file a Missing Mail request at usps.com." },
  { question: "What does 'In Transit to Next Facility' mean?", answer: "This USPS tracking status means your package is being transported between postal processing facilities. It's a normal part of the shipping process. Your package is moving through the USPS network toward its destination and will be scanned at the next sorting center or distribution hub." },
  { question: "How long does USPS Priority Mail take?", answer: "USPS Priority Mail typically takes 1-3 business days for delivery within the contiguous United States. Priority Mail Express offers overnight to 2-day guaranteed delivery. First-Class Package Service takes 1-5 days, and USPS Ground Advantage takes 2-5 business days." },
  { question: "What is USPS Informed Delivery?", answer: "USPS Informed Delivery is a free service that gives you digital previews of incoming mail and package tracking notifications. Sign up at informeddelivery.usps.com to receive daily emails showing grayscale images of letter-sized mail and automatic tracking updates for packages addressed to you." },
  { question: "How do I track a post office package online?", answer: "To track a post office package online, enter your USPS tracking number in the search box on this page. You can also track at tools.usps.com. Post office tracking works for all USPS services including Priority Mail, First Class, Certified Mail, Media Mail, and international packages." },
  { question: "Is USPS tracking the same as postal tracking?", answer: "Yes — USPS tracking, US postal tracking, postal service tracking, and post office tracking all refer to the same service. The United States Postal Service (USPS) provides free package tracking for all domestic and international trackable shipments. You can use any of these terms to find tracking information." },
  { question: "How do I track a USPS package from USA internationally?", answer: "International USPS tracking works the same way — enter your 13-character tracking number (like EA123456789US) in the search box. International tracking numbers start with two letters, followed by nine digits, and end with 'US'. You can track packages to and from over 190 countries." },
  { question: "What USPS tracking number formats exist?", answer: "USPS uses several tracking number formats: 20-22 digit numbers for domestic packages (starting with 9400 for Priority Mail, 9270 for Express, 9300 for Retail Ground), 13-character alphanumeric codes for international (like EA/EB/EC followed by 9 digits and US), and 34-digit codes for certain bulk shipments." },
];
