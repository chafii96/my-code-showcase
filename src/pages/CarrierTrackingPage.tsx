import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import InternalLinkingHub from "@/components/InternalLinkingHub";
import { Search, Package, Truck, Clock, Shield, CheckCircle, AlertTriangle, Globe, FileText, DollarSign, MapPin, Phone, ArrowRight } from "lucide-react";

const CARRIER_TRUCK_IMAGES: Record<string, string> = {
  fedex: "/images/carriers/fedex-van.png",
  ups: "/images/carriers/ups-truck.png",
  dhl: "/images/carriers/dhl-truck.png",
  amazon: "/images/carriers/amazon-van.png",
  usps: "/images/carriers/usps-truck.png",
};

interface CarrierData {
  id: string;
  name: string;
  fullName: string;
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
}

const carriersData: Record<string, CarrierData> = {
  fedex: {
    id: "fedex",
    name: "FedEx",
    fullName: "Federal Express",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    website: "https://www.fedex.com",
    phone: "1-800-463-3339",
    trackingUrl: "https://www.fedex.com/fedextrack/?trknbr=",
    trackingFormats: [
      { format: "12 digits", example: "123456789012", service: "FedEx Express / Ground" },
      { format: "15 digits", example: "123456789012345", service: "FedEx Ground" },
      { format: "20 digits", example: "12345678901234567890", service: "FedEx SmartPost" },
      { format: "22 digits", example: "1234567890123456789012", service: "FedEx Ground / Home Delivery" },
      { format: "Door Tag (DT + 12 digits)", example: "DT123456789012", service: "Door Tag Number" },
    ],
    services: [
      { name: "FedEx First Overnight", delivery: "Next business day by 8 AM", price: "From $65", tracking: "Full real-time" },
      { name: "FedEx Priority Overnight", delivery: "Next business day by 10:30 AM", price: "From $45", tracking: "Full real-time" },
      { name: "FedEx Standard Overnight", delivery: "Next business day by 3 PM", price: "From $35", tracking: "Full real-time" },
      { name: "FedEx 2Day", delivery: "2 business days", price: "From $20", tracking: "Full real-time" },
      { name: "FedEx Express Saver", delivery: "3 business days", price: "From $15", tracking: "Full real-time" },
      { name: "FedEx Ground", delivery: "1-5 business days", price: "From $9", tracking: "Full real-time" },
      { name: "FedEx Home Delivery", delivery: "1-5 business days (residential)", price: "From $10", tracking: "Full real-time" },
      { name: "FedEx SmartPost", delivery: "2-7 business days", price: "From $5", tracking: "Limited (last mile USPS)" },
    ],
    statuses: [
      { status: "Picked Up", meaning: "FedEx has picked up the package from the sender." },
      { status: "In Transit", meaning: "Package is moving through the FedEx network toward its destination." },
      { status: "At FedEx Facility", meaning: "Package has arrived at a FedEx sorting or distribution center." },
      { status: "On FedEx Vehicle for Delivery", meaning: "Package is on the delivery truck and will be delivered today." },
      { status: "Delivered", meaning: "Package has been successfully delivered to the recipient." },
      { status: "Delivery Exception", meaning: "An issue has occurred that may delay delivery (weather, access, address)." },
      { status: "Pending", meaning: "Package information has been sent to FedEx but hasn't been picked up yet." },
      { status: "Clearance Delay", meaning: "International shipment is being held at customs for additional clearance." },
    ],
    faq: [
      { q: "How do I track a FedEx package?", a: "Enter your FedEx tracking number (12-22 digits) in the search bar above. You can find this number on your shipping receipt, confirmation email, or the FedEx website." },
      { q: "What does FedEx 'Delivery Exception' mean?", a: "A Delivery Exception means something prevented normal delivery — weather delays, incorrect address, no one available to sign, or a security issue. FedEx will usually attempt delivery again the next business day." },
      { q: "How long does FedEx Ground take?", a: "FedEx Ground delivers within 1-5 business days depending on distance. Shipments within the same region may arrive in 1-2 days, while coast-to-coast shipments typically take 4-5 days." },
      { q: "Does FedEx deliver on weekends?", a: "FedEx Home Delivery delivers Tuesday through Saturday. FedEx Ground delivers Monday through Friday. FedEx Express services are available on Saturday for an additional fee." },
    ],
    content: {
      intro: "FedEx (Federal Express) is one of the largest package delivery companies in the world, handling over 16 million packages daily. Founded in 1971, FedEx offers a wide range of shipping services from overnight express to economical ground shipping.",
      about: "FedEx operates through several business segments: FedEx Express (air), FedEx Ground (ground), FedEx Freight (LTL), and FedEx Services. The company serves over 220 countries and territories worldwide with a fleet of over 700 aircraft and 200,000+ vehicles.",
      howToTrack: [
        "Find your FedEx tracking number on your receipt or confirmation email",
        "Enter the tracking number in the search bar above",
        "View real-time status updates including location and estimated delivery",
        "Sign up for FedEx Delivery Manager for proactive notifications",
      ],
    },
  },
  ups: {
    id: "ups",
    name: "UPS",
    fullName: "United Parcel Service",
    color: "text-amber-700",
    bgColor: "bg-amber-700/10",
    website: "https://www.ups.com",
    phone: "1-800-742-5877",
    trackingUrl: "https://www.ups.com/track?tracknum=",
    trackingFormats: [
      { format: "1Z + 16 alphanumeric", example: "1Z999AA10123456784", service: "All UPS services" },
      { format: "T + 10 digits", example: "T1234567890", service: "UPS Mail Innovations" },
      { format: "9 digits", example: "123456789", service: "UPS Freight" },
    ],
    services: [
      { name: "UPS Next Day Air Early", delivery: "Next business day by 8 AM", price: "From $75", tracking: "Full real-time" },
      { name: "UPS Next Day Air", delivery: "Next business day by 10:30 AM", price: "From $50", tracking: "Full real-time" },
      { name: "UPS Next Day Air Saver", delivery: "Next business day by end of day", price: "From $40", tracking: "Full real-time" },
      { name: "UPS 2nd Day Air", delivery: "2 business days", price: "From $25", tracking: "Full real-time" },
      { name: "UPS 3 Day Select", delivery: "3 business days", price: "From $18", tracking: "Full real-time" },
      { name: "UPS Ground", delivery: "1-5 business days", price: "From $10", tracking: "Full real-time" },
      { name: "UPS SurePost", delivery: "2-7 business days", price: "From $5", tracking: "Limited (last mile USPS)" },
    ],
    statuses: [
      { status: "Order Processed: Ready for UPS", meaning: "Shipping label created, awaiting UPS pickup." },
      { status: "Picked Up", meaning: "UPS has received the package." },
      { status: "In Transit", meaning: "Package is moving through the UPS network." },
      { status: "Out for Delivery", meaning: "Package is on the delivery vehicle for today's delivery." },
      { status: "Delivered", meaning: "Package has been delivered." },
      { status: "Exception", meaning: "An unexpected event may cause a delay." },
      { status: "Returned to Sender", meaning: "Package is being sent back to the shipper." },
    ],
    faq: [
      { q: "How do I track a UPS package?", a: "Enter your UPS tracking number (starts with 1Z followed by 16 characters) in the search bar above. Find it on your shipping receipt or confirmation email." },
      { q: "What does UPS 'Exception' mean?", a: "An Exception status means something unexpected happened — address issues, weather delays, or delivery attempt failures. UPS will usually resolve it within 1-2 business days." },
      { q: "How long does UPS Ground shipping take?", a: "UPS Ground takes 1-5 business days depending on origin and destination. You can estimate transit time on ups.com using the Time and Cost calculator." },
      { q: "Does UPS deliver on Saturday?", a: "UPS delivers on Saturdays in many areas. Saturday delivery is available for UPS Next Day Air, Next Day Air Saver, and 2nd Day Air services." },
    ],
    content: {
      intro: "UPS (United Parcel Service) is the world's largest package delivery company, delivering over 25 million packages daily across 220+ countries. Founded in 1907, UPS is known for its reliable ground and air delivery services.",
      about: "UPS operates one of the world's largest airlines (UPS Airlines) and maintains a fleet of over 125,000 delivery vehicles. The company's integrated logistics solutions serve businesses of all sizes with package delivery, freight, and supply chain management.",
      howToTrack: [
        "Locate your UPS tracking number (starts with 1Z) on your receipt or email",
        "Enter the tracking number in the search bar above",
        "View detailed tracking history with timestamps and locations",
        "Use UPS My Choice for delivery alerts and rescheduling options",
      ],
    },
  },
  dhl: {
    id: "dhl",
    name: "DHL",
    fullName: "DHL Express",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    website: "https://www.dhl.com",
    phone: "1-800-225-5345",
    trackingUrl: "https://www.dhl.com/us-en/home/tracking.html?tracking-id=",
    trackingFormats: [
      { format: "10 digits", example: "1234567890", service: "DHL Express" },
      { format: "JD + 18 digits", example: "JD014600003944032948", service: "DHL eCommerce" },
      { format: "GM + 18 digits", example: "GM123456789012345678", service: "DHL Global Mail" },
      { format: "LX + 9 digits + DE", example: "LX123456789DE", service: "DHL Parcel (Germany)" },
    ],
    services: [
      { name: "DHL Express Worldwide", delivery: "1-3 business days", price: "From $50", tracking: "Full real-time" },
      { name: "DHL Express 9:00", delivery: "Next day by 9 AM", price: "From $90", tracking: "Full + time-definite" },
      { name: "DHL Express 10:30", delivery: "Next day by 10:30 AM", price: "From $75", tracking: "Full + time-definite" },
      { name: "DHL Express 12:00", delivery: "Next day by 12 PM", price: "From $65", tracking: "Full + time-definite" },
      { name: "DHL Economy Select", delivery: "3-7 business days", price: "From $25", tracking: "Full" },
      { name: "DHL eCommerce", delivery: "5-10 business days", price: "From $10", tracking: "Basic" },
    ],
    statuses: [
      { status: "Shipment Information Received", meaning: "DHL has received electronic shipment data but doesn't have the package yet." },
      { status: "Picked Up", meaning: "Package has been collected from the sender." },
      { status: "In Transit", meaning: "Package is moving through the DHL network." },
      { status: "Arrived at DHL Facility", meaning: "Package has reached a DHL sorting center." },
      { status: "Customs Status Updated", meaning: "Package is being processed by customs." },
      { status: "With Delivery Courier", meaning: "Package is on the delivery vehicle." },
      { status: "Delivered", meaning: "Package has been delivered to the recipient." },
      { status: "Shipment on Hold", meaning: "Package is temporarily held — may need additional information or customs action." },
    ],
    faq: [
      { q: "How do I track a DHL package?", a: "Enter your DHL tracking number (typically 10 digits for Express, or JD/GM prefix for eCommerce) in the search bar above." },
      { q: "What does 'Shipment on Hold' mean?", a: "This means your DHL package is temporarily held. Common reasons include customs clearance issues, incomplete documentation, or recipient unavailability. Contact DHL for resolution." },
      { q: "How long does DHL Express take?", a: "DHL Express Worldwide typically delivers in 1-3 business days to most countries. Time-definite services guarantee delivery by specific times (9 AM, 10:30 AM, or 12 PM)." },
      { q: "Does DHL deliver on weekends?", a: "DHL Express delivers on Saturdays in many areas. DHL eCommerce packages delivered by local postal services follow their weekend schedule." },
    ],
    content: {
      intro: "DHL is the global leader in international express shipping, operating in over 220 countries and territories. With the world's most international logistics network, DHL processes over 2 billion parcels annually.",
      about: "DHL is a division of Deutsche Post DHL Group, the world's largest logistics company. Known for its yellow and red branding, DHL specializes in international express deliveries and has the fastest customs clearance times among major carriers.",
      howToTrack: [
        "Find your DHL tracking number on your shipping receipt or email confirmation",
        "Enter the tracking number in the search bar above",
        "View shipment progress including customs status updates",
        "Sign up for DHL On Demand Delivery for flexible delivery options",
      ],
    },
  },
  "china-post": {
    id: "china-post",
    name: "China Post",
    fullName: "China Post Group Corporation",
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    website: "https://www.ems.com.cn",
    phone: "+86-11185",
    trackingUrl: "https://track.4px.com/#/result/0/",
    trackingFormats: [
      { format: "R + 9 digits + CN", example: "RR123456789CN", service: "Registered Mail" },
      { format: "E + 9 digits + CN", example: "EE123456789CN", service: "EMS Express" },
      { format: "C + 9 digits + CN", example: "CP123456789CN", service: "China Post Parcel" },
      { format: "L + 9 digits + CN", example: "LN123456789CN", service: "ePacket / Yanwen" },
    ],
    services: [
      { name: "EMS Express", delivery: "5-10 business days", price: "From $25", tracking: "Full real-time" },
      { name: "ePacket", delivery: "7-20 business days", price: "From $5", tracking: "Full tracking to US" },
      { name: "China Post Registered Air Mail", delivery: "15-30 business days", price: "From $3", tracking: "Basic (limited updates)" },
      { name: "China Post Ordinary Small Packet", delivery: "20-60 business days", price: "From $1", tracking: "No tracking" },
    ],
    statuses: [
      { status: "Posting/Collection", meaning: "Package has been accepted by China Post." },
      { status: "Dispatch from Outward Office of Exchange", meaning: "Package has left the Chinese sorting facility." },
      { status: "Arrival at Destination", meaning: "Package has arrived in the destination country." },
      { status: "Held by Customs", meaning: "Package is being inspected by customs." },
      { status: "Final Delivery", meaning: "Package has been delivered." },
    ],
    faq: [
      { q: "How long does China Post take to the US?", a: "EMS takes 5-10 days, ePacket 7-20 days, and Registered Air Mail 15-30 days. Ordinary packets may take up to 60 days." },
      { q: "What is ePacket?", a: "ePacket is an affordable shipping option for lightweight packages from China to the US, offering full tracking and delivery within 7-20 business days." },
      { q: "Why is my China Post tracking not updating?", a: "Economy services have limited tracking. Updates may pause for 1-2 weeks during international transit. USPS provides domestic updates once the package enters the US." },
    ],
    content: {
      intro: "China Post is the official postal service of the People's Republic of China, handling over 50 billion pieces of mail annually. It is a key logistics provider for international e-commerce.",
      about: "China Post Group Corporation operates over 80,000 post offices across China, providing postal, express delivery, logistics, and e-commerce services worldwide.",
      howToTrack: [
        "Find your China Post tracking number (ends with CN) from your seller",
        "Enter the tracking number in the search bar above",
        "View international transit and customs updates",
        "USPS provides domestic delivery updates once in the US",
      ],
    },
  },
  "royal-mail": {
    id: "royal-mail",
    name: "Royal Mail",
    fullName: "Royal Mail Group Ltd",
    color: "text-red-600",
    bgColor: "bg-red-600/10",
    website: "https://www.royalmail.com",
    phone: "+44-03457-740-740",
    trackingUrl: "https://www.royalmail.com/track-your-item#/tracking-results/",
    trackingFormats: [
      { format: "2 letters + 9 digits + GB", example: "RR123456789GB", service: "Tracked / Signed For" },
      { format: "2 letters + 9 digits + GB", example: "EE123456789GB", service: "International Tracked" },
    ],
    services: [
      { name: "Royal Mail Tracked 24", delivery: "Next day (UK)", price: "From £4.50", tracking: "Full real-time" },
      { name: "Royal Mail Special Delivery", delivery: "Next day by 1 PM", price: "From £7.65", tracking: "Full + signature" },
      { name: "International Tracked", delivery: "5-7 days (US)", price: "From £10", tracking: "Full international" },
      { name: "Parcelforce Global Express", delivery: "1-3 days worldwide", price: "From £40", tracking: "Full real-time" },
    ],
    statuses: [
      { status: "Sender Preparing Item", meaning: "Label created, awaiting collection." },
      { status: "Item Leaving the UK", meaning: "Package has departed the UK." },
      { status: "Item Received in Country of Destination", meaning: "Package arrived in the destination country." },
      { status: "Delivered", meaning: "Package has been delivered." },
    ],
    faq: [
      { q: "How long does Royal Mail take to the US?", a: "International Tracked takes 5-7 business days. Parcelforce Global Express delivers in 1-3 days." },
      { q: "How do I track Royal Mail packages?", a: "Enter your tracking number (ends with GB) in the search bar above." },
    ],
    content: {
      intro: "Royal Mail is the United Kingdom's national postal service, delivering to over 31 million addresses daily. With a history dating back to 1516, it is one of the oldest postal services in the world.",
      about: "Royal Mail Group includes Royal Mail (letters and parcels) and Parcelforce Worldwide (express). It delivers to every address in the UK six days a week and ships internationally to over 200 countries.",
      howToTrack: [
        "Find your Royal Mail tracking number (ends with GB) on your receipt",
        "Enter the tracking number in the search bar above",
        "View delivery status including international transit",
        "USPS handles final delivery for shipments to the US",
      ],
    },
  },
  "canada-post": {
    id: "canada-post",
    name: "Canada Post",
    fullName: "Canada Post Corporation",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    website: "https://www.canadapost-postescanada.ca",
    phone: "1-866-607-6301",
    trackingUrl: "https://www.canadapost-postescanada.ca/track-reperage/en#/search?searchFor=",
    trackingFormats: [
      { format: "16 digits", example: "1234567890123456", service: "Domestic Parcels" },
      { format: "2 letters + 9 digits + CA", example: "RR123456789CA", service: "International Registered" },
    ],
    services: [
      { name: "Priority", delivery: "Next business day", price: "From $26 CAD", tracking: "Full real-time" },
      { name: "Xpresspost", delivery: "2 business days", price: "From $15 CAD", tracking: "Full real-time" },
      { name: "Xpresspost USA", delivery: "2-3 days to US", price: "From $20 CAD", tracking: "Full real-time" },
      { name: "Regular Parcel", delivery: "4-9 business days", price: "From $10 CAD", tracking: "Full" },
    ],
    statuses: [
      { status: "Electronic Information Submitted", meaning: "Label created, not yet received." },
      { status: "Item Accepted at Post Office", meaning: "Package received by Canada Post." },
      { status: "Item in Transit", meaning: "Package is moving through the network." },
      { status: "Item Delivered", meaning: "Package has been delivered." },
      { status: "Notice Card Left", meaning: "Delivery attempted — notice left for pickup." },
    ],
    faq: [
      { q: "How long does Canada Post take to the US?", a: "Xpresspost USA takes 2-3 business days. Small Packet takes 5-8 days." },
      { q: "What does 'Notice Card Left' mean?", a: "The carrier attempted delivery but no one was available. A notice tells you where to pick up your package." },
    ],
    content: {
      intro: "Canada Post is Canada's primary postal operator, delivering to over 16 million addresses. It handles over 8 billion pieces of mail and parcels annually.",
      about: "Canada Post Corporation provides postal services throughout Canada and international shipping to over 190 countries through a network of over 6,200 post offices.",
      howToTrack: [
        "Find your Canada Post tracking number on your receipt or email",
        "Enter the tracking number in the search bar above",
        "View status updates including customs clearance",
        "USPS provides domestic tracking for US-bound packages",
      ],
    },
  },
  "japan-post": {
    id: "japan-post",
    name: "Japan Post",
    fullName: "Japan Post Co., Ltd.",
    color: "text-red-700",
    bgColor: "bg-red-700/10",
    website: "https://www.post.japanpost.jp/english",
    phone: "+81-570-046-111",
    trackingUrl: "https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=",
    trackingFormats: [
      { format: "E + 9 digits + JP", example: "EJ123456789JP", service: "EMS" },
      { format: "R + 9 digits + JP", example: "RR123456789JP", service: "Registered Mail" },
      { format: "C + 9 digits + JP", example: "CP123456789JP", service: "International Parcel" },
    ],
    services: [
      { name: "EMS (Express Mail Service)", delivery: "2-4 business days", price: "From ¥2,000", tracking: "Full real-time" },
      { name: "International ePacket", delivery: "7-14 business days", price: "From ¥600", tracking: "Full tracking" },
      { name: "SAL Parcel", delivery: "2-4 weeks", price: "From ¥1,500", tracking: "Basic" },
      { name: "Airmail Parcel", delivery: "1-2 weeks", price: "From ¥2,500", tracking: "Full" },
    ],
    statuses: [
      { status: "Posting/Collection", meaning: "Package accepted by Japan Post." },
      { status: "Dispatch from Outward Office", meaning: "Package has departed Japan." },
      { status: "Arrival at Destination Post", meaning: "Package arrived in the destination country." },
      { status: "Final Delivery", meaning: "Package has been delivered." },
    ],
    faq: [
      { q: "How long does Japan Post take to the US?", a: "EMS takes 2-4 days, ePacket 7-14 days, Airmail 1-2 weeks, SAL 2-4 weeks." },
      { q: "What is Japan Post ePacket?", a: "ePacket is an affordable tracked shipping method for lightweight packages (up to 2kg) from Japan, arriving in 7-14 business days." },
    ],
    content: {
      intro: "Japan Post is Japan's national postal service, renowned for its reliability and efficiency. It offers a range of international shipping services popular with e-commerce sellers and collectors.",
      about: "Japan Post Co., Ltd. operates over 24,000 post offices across Japan. Known for punctuality and careful handling, it's a preferred choice for shipping fragile and valuable items internationally.",
      howToTrack: [
        "Find your Japan Post tracking number (ends with JP) from your seller",
        "Enter the tracking number in the search bar above",
        "View international transit and customs updates",
        "USPS provides final delivery tracking once in the US",
      ],
    },
  },
  "australia-post": {
    id: "australia-post",
    name: "Australia Post",
    fullName: "Australian Postal Corporation",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    website: "https://auspost.com.au",
    phone: "+61-13-13-18",
    trackingUrl: "https://auspost.com.au/mypost/track/#/search?tracking=",
    trackingFormats: [
      { format: "R/E + 9 digits + AU", example: "RR123456789AU", service: "International Tracked" },
      { format: "10 digits", example: "1234567890", service: "Domestic Parcel" },
    ],
    services: [
      { name: "International Express (EMS)", delivery: "3-5 business days", price: "From $40 AUD", tracking: "Full real-time" },
      { name: "International Tracked", delivery: "6-10 business days", price: "From $20 AUD", tracking: "Full" },
      { name: "International Economy", delivery: "10-20+ business days", price: "From $10 AUD", tracking: "Limited" },
    ],
    statuses: [
      { status: "Item Lodged", meaning: "Package received by Australia Post." },
      { status: "In Transit", meaning: "Package is moving through the network." },
      { status: "Cleared Customs", meaning: "Package has passed customs." },
      { status: "Delivered", meaning: "Package has been delivered." },
    ],
    faq: [
      { q: "How long does Australia Post take to the US?", a: "Express takes 3-5 days, Tracked 6-10 days, Economy 10-20+ days." },
      { q: "How do I track an Australia Post package?", a: "Enter your tracking number (ends with AU for international) in the search bar above." },
    ],
    content: {
      intro: "Australia Post is Australia's government-owned postal service, delivering to over 12 million addresses. It is the largest delivery and logistics provider in Australia.",
      about: "Australian Postal Corporation operates over 4,300 retail outlets and handles billions of items annually. Through its StarTrack subsidiary, it provides express logistics for businesses.",
      howToTrack: [
        "Find your Australia Post tracking number on your receipt",
        "Enter the tracking number in the search bar above",
        "View transit and customs updates",
        "USPS handles final delivery once in the US",
      ],
    },
  },
  "korea-post": {
    id: "korea-post",
    name: "Korea Post",
    fullName: "Korea Post (우체국)",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    website: "https://www.epost.go.kr",
    phone: "+82-1588-1300",
    trackingUrl: "https://service.epost.go.kr/trace.RetrieveEmsRi498TraceList.comm?POST_CODE=",
    trackingFormats: [
      { format: "E + 9 digits + KR", example: "EE123456789KR", service: "EMS" },
      { format: "R + 9 digits + KR", example: "RR123456789KR", service: "Registered Mail" },
    ],
    services: [
      { name: "EMS", delivery: "3-5 business days", price: "From ₩18,000", tracking: "Full real-time" },
      { name: "K-Packet", delivery: "7-14 business days", price: "From ₩5,000", tracking: "Full tracking" },
      { name: "International Registered Mail", delivery: "7-14 business days", price: "From ₩3,500", tracking: "Basic" },
    ],
    statuses: [
      { status: "Acceptance", meaning: "Package accepted by Korea Post." },
      { status: "Departure from Outward Office", meaning: "Package has left Korea." },
      { status: "Arrival at Inward Office", meaning: "Package arrived in the destination country." },
      { status: "Delivery", meaning: "Package has been delivered." },
    ],
    faq: [
      { q: "How long does Korea Post take to the US?", a: "EMS takes 3-5 days, K-Packet 7-14 days." },
      { q: "What is K-Packet?", a: "K-Packet is Korea Post's tracked economy shipping for items under 2kg, popular for K-beauty and K-pop merchandise." },
    ],
    content: {
      intro: "Korea Post is the official postal service of South Korea, known for reliable international shipping. It's popular for K-beauty products, electronics, and K-pop merchandise.",
      about: "Korea Post operates over 3,600 post offices throughout South Korea. Its EMS service is one of the fastest in Asia, and K-Packet provides affordable tracked shipping for e-commerce.",
      howToTrack: [
        "Find your Korea Post tracking number (ends with KR) from your seller",
        "Enter the tracking number in the search bar above",
        "View real-time transit updates",
        "USPS handles delivery once the package arrives in the US",
      ],
    },
  },
};

const CarrierTrackingPage = ({ carrierId }: { carrierId: string }) => {
  const carrier = carriersData[carrierId];
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  if (!carrier) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      window.open(`${carrier.trackingUrl}${trackingNumber.trim()}`, '_blank');
    }
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${carrier.name} Package Tracking — Track Your ${carrier.name} Shipment`,
    author: { "@type": "Organization", name: "US Postal Tracking" },
    datePublished: "2026-01-01",
    dateModified: "2026-03-01",
  };

  // ❌ FAQPage schema removed - not eligible for commercial sites (Google policy Aug 2023)

  return (
    <Layout>
      <SEOHead
        title={`${carrier.name} Tracking — Track ${carrier.name} Packages Free | Real-Time Status`}
        description={`Track ${carrier.name} packages with real-time status updates. Enter your ${carrier.name} tracking number for instant delivery status, location, and estimated delivery date.`}
        keywords={`${carrier.name.toLowerCase()} tracking, ${carrier.name.toLowerCase()} package tracking, track ${carrier.name.toLowerCase()} package, ${carrier.name.toLowerCase()} tracking number, ${carrier.name.toLowerCase()} delivery status, ${carrier.name.toLowerCase()} shipping tracking`}
        canonical={`https://uspostaltracking.com/tracking/${carrierId}`}
        structuredData={[articleSchema]}
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: `${carrier.name} Tracking`, url: `/tracking/${carrierId}` },
      ]} />

      <div className="container py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link><span>/</span>
          <span className="text-foreground">{carrier.name} Tracking</span>
        </nav>

        {/* Hero + Tracking Tool */}
        <div className={`rounded-2xl border ${carrier.bgColor} p-6 sm:p-8 mb-8 relative overflow-hidden`}>
          {/* Carrier truck photo background */}
          {CARRIER_TRUCK_IMAGES[carrierId || ""] && (
            <img
              src={CARRIER_TRUCK_IMAGES[carrierId || ""]}
              alt={`${carrier.name} delivery vehicle`}
              className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-multiply pointer-events-none"
              loading="eager"
              aria-hidden="true"
            />
          )}
          <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl ${carrier.bgColor} border flex items-center justify-center`}>
              <Package className={`h-6 w-6 ${carrier.color}`} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{carrier.name} Package Tracking</h1>
              <p className="text-sm text-muted-foreground">Track any {carrier.name} shipment in real-time</p>
            </div>
          </div>

          <form onSubmit={handleTrack} className="mt-5 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder={`Enter ${carrier.name} tracking number...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Truck className="h-4 w-4" /> Track Package
            </button>
          </form>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {carrier.phone}</span>
            <a href={carrier.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
              <Globe className="h-3 w-3" /> {carrier.website.replace('https://www.', '')}
            </a>
          </div>
          </div>
        </div>

        {/* About */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Globe className={`h-5 w-5 ${carrier.color}`} /> About {carrier.name}</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">{carrier.content.intro}</p>
          <p className="text-muted-foreground leading-relaxed">{carrier.content.about}</p>
        </section>

        {/* How to Track */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Search className="h-5 w-5 text-primary" /> How to Track a {carrier.name} Package</h2>
          <div className="space-y-2">
            {carrier.content.howToTrack.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-card border rounded-lg">
                <span className="bg-primary/10 text-primary text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tracking Number Formats */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><FileText className={`h-5 w-5 ${carrier.color}`} /> {carrier.name} Tracking Number Formats</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Format</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Example</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Service</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {carrier.trackingFormats.map(f => (
                  <tr key={f.format} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">{f.format}</td>
                    <td className="py-2 px-3 font-mono text-xs">{f.example}</td>
                    <td className="py-2 px-3">{f.service}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Services */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> {carrier.name} Shipping Services</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Service</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Delivery Time</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Starting Price</th>
                  <th className="text-left py-2 px-3 text-foreground font-semibold">Tracking</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {carrier.services.map(s => (
                  <tr key={s.name} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium text-foreground">{s.name}</td>
                    <td className="py-2 px-3">{s.delivery}</td>
                    <td className="py-2 px-3">{s.price}</td>
                    <td className="py-2 px-3">{s.tracking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tracking Statuses */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2"><AlertTriangle className={`h-5 w-5 ${carrier.color}`} /> {carrier.name} Tracking Status Meanings</h2>
          <div className="space-y-2">
            {carrier.statuses.map(s => (
              <div key={s.status} className="p-3 bg-card border rounded-lg">
                <h3 className="text-sm font-semibold text-foreground">{s.status}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{s.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {carrier.faq.map(item => (
              <details key={item.q} className="group bg-card border rounded-lg">
                <summary className="p-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                  {item.q}<span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related */}
        <div className="bg-card border rounded-xl p-5 mb-8">
          <h2 className="font-bold text-foreground mb-3">Track Other Carriers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.values(carriersData).filter(c => c.id !== carrierId).map(c => (
              <Link key={c.id} to={`/tracking/${c.id}`} className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5">
                <Package className="h-4 w-4" /> {c.name} Tracking
              </Link>
            ))}
            <Link to="/" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded hover:bg-primary/5">
              <Package className="h-4 w-4" /> USPS Tracking
            </Link>
          </div>
        </div>

        <InternalLinkingHub currentPath={`/tracking/${carrierId}`} variant="compact" />
      </div>
    </Layout>
  );
};

export const FedExTrackingPage = () => <CarrierTrackingPage carrierId="fedex" />;
export const UPSTrackingPage = () => <CarrierTrackingPage carrierId="ups" />;
export const DHLTrackingPage = () => <CarrierTrackingPage carrierId="dhl" />;
export const ChinaPostTrackingPage = () => <CarrierTrackingPage carrierId="china-post" />;
export const RoyalMailTrackingPage = () => <CarrierTrackingPage carrierId="royal-mail" />;
export const CanadaPostTrackingPage = () => <CarrierTrackingPage carrierId="canada-post" />;
export const JapanPostTrackingPage = () => <CarrierTrackingPage carrierId="japan-post" />;
export const AustraliaPostTrackingPage = () => <CarrierTrackingPage carrierId="australia-post" />;
export const DeutschePostTrackingPage = () => <CarrierTrackingPage carrierId="deutsche-post" />;
export const LaPosteTrackingPage = () => <CarrierTrackingPage carrierId="la-poste" />;
export const KoreaPostTrackingPage = () => <CarrierTrackingPage carrierId="korea-post" />;
