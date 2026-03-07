import { cn } from "@/lib/utils";

interface CarrierLogoProps {
  className?: string;
  size?: number;
}

export const USPSLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="USPS logo">
    <rect width="200" height="80" rx="6" fill="#004B87"/>
    <rect x="0" y="52" width="200" height="28" rx="0" fill="#CC0000"/>
    <rect x="0" y="52" width="200" height="4" fill="#FFFFFF"/>
    <text x="100" y="40" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="24" letterSpacing="3">USPS</text>
    <text x="100" y="70" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="10" letterSpacing="1">UNITED STATES POSTAL SERVICE</text>
  </svg>
);

export const FedExLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="FedEx logo">
    <rect width="200" height="80" rx="6" fill="#FFFFFF"/>
    <text x="15" y="55" fill="#4D148C" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="50" letterSpacing="-2">Fed</text>
    <text x="100" y="55" fill="#FF6200" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="50" letterSpacing="-2">Ex</text>
  </svg>
);

export const UPSLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="UPS logo">
    <rect width="200" height="80" rx="6" fill="#351C15"/>
    <g transform="translate(20, 8) scale(0.7)">
      <path d="M45 0 C20 0 0 20 0 45 L0 65 C0 75 8 85 20 88 L45 95 L70 88 C82 85 90 75 90 65 L90 45 C90 20 70 0 45 0Z" fill="#FFB500"/>
      <path d="M45 8 C24 8 8 24 8 45 L8 65 C8 72 14 79 22 82 L45 88 L68 82 C76 79 82 72 82 65 L82 45 C82 24 66 8 45 8Z" fill="#351C15"/>
      <text x="45" y="62" textAnchor="middle" fill="#FFB500" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="28">UPS</text>
    </g>
    <text x="115" y="50" fill="#FFB500" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="26" letterSpacing="1">UPS</text>
  </svg>
);

export const DHLLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="DHL logo">
    <rect width="200" height="80" rx="6" fill="#FFCC00"/>
    <text x="100" y="54" textAnchor="middle" fill="#CC0000" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="48" letterSpacing="4">DHL</text>
  </svg>
);

export const AmazonLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="Amazon logo">
    <rect width="200" height="80" rx="6" fill="#FFFFFF"/>
    <text x="100" y="45" textAnchor="middle" fill="#232F3E" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="34" letterSpacing="-1">amazon</text>
    <path d="M55 58 Q100 72 145 58" stroke="#FF9900" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M140 53 L147 60 L138 61" fill="#FF9900"/>
  </svg>
);

export const OnTracLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="OnTrac logo">
    <rect width="200" height="80" rx="6" fill="#003087"/>
    <text x="100" y="50" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="36" letterSpacing="2">OnTrac</text>
  </svg>
);

export const DHLExpressLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="DHL Express logo">
    <rect width="200" height="80" rx="6" fill="#FFCC00"/>
    <text x="100" y="46" textAnchor="middle" fill="#CC0000" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="36" letterSpacing="4">DHL</text>
    <text x="100" y="68" textAnchor="middle" fill="#CC0000" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" letterSpacing="6">EXPRESS</text>
  </svg>
);

export const LaserShipLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="LaserShip logo">
    <rect width="200" height="80" rx="6" fill="#E31837"/>
    <text x="100" y="50" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" letterSpacing="1">LaserShip</text>
  </svg>
);

export const EasyPostLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="EasyPost logo">
    <rect width="200" height="80" rx="6" fill="#6C3CF6"/>
    <text x="100" y="50" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="24" letterSpacing="0">EasyPost</text>
  </svg>
);

export const DeutschePostLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="Deutsche Post logo">
    <rect width="200" height="80" rx="6" fill="#FFCC00"/>
    <circle cx="30" cy="40" r="24" fill="#CC0000"/>
    <path d="M18 40 L30 28 L42 40 L30 52Z" fill="white"/>
    <text x="115" y="36" textAnchor="middle" fill="#CC0000" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="14">DEUTSCHE</text>
    <text x="115" y="55" textAnchor="middle" fill="#CC0000" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18">POST</text>
  </svg>
);

export const ColissimoLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="Colissimo logo">
    <rect width="200" height="80" rx="6" fill="#003189"/>
    <text x="100" y="50" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" letterSpacing="0">Colissimo</text>
  </svg>
);

export const IndiaPostLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="India Post logo">
    <rect width="200" height="80" rx="6" fill="#FF6200"/>
    <text x="100" y="38" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="18">INDIA</text>
    <text x="100" y="62" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22">POST</text>
  </svg>
);

export const SFExpressLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="SF Express logo">
    <rect width="200" height="80" rx="6" fill="#E60012"/>
    <text x="100" y="50" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="30" letterSpacing="4">SF</text>
    <text x="100" y="68" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="11" letterSpacing="4">EXPRESS</text>
  </svg>
);

export const SpeedexLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="Speedex logo">
    <rect width="200" height="80" rx="6" fill="#1B2A8E"/>
    <text x="100" y="50" textAnchor="middle" fill="#F7C948" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="26" letterSpacing="2">SPEEDEX</text>
  </svg>
);

export const RoadieLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="Roadie logo">
    <rect width="200" height="80" rx="6" fill="#00A86B"/>
    <text x="100" y="52" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="32" letterSpacing="2">Roadie</text>
  </svg>
);

export const DoorDashLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="DoorDash logo">
    <rect width="200" height="80" rx="6" fill="#FF3008"/>
    <text x="100" y="50" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" letterSpacing="0">DoorDash</text>
  </svg>
);

export const AlibabaLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="Alibaba logo">
    <rect width="200" height="80" rx="6" fill="#FF6000"/>
    <text x="100" y="52" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="28" letterSpacing="1">Alibaba</text>
  </svg>
);

export const SingaporePostLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="Singapore Post logo">
    <rect width="200" height="80" rx="6" fill="#E60028"/>
    <text x="100" y="36" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="13" letterSpacing="1">SINGAPORE</text>
    <text x="100" y="60" textAnchor="middle" fill="white" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="22" letterSpacing="2">POST</text>
  </svg>
);

export const CevaLogo = ({ className, size = 40 }: CarrierLogoProps) => (
  <svg viewBox="0 0 200 80" width={size * 2.5} height={size} className={className} role="img" aria-label="CEVA Logistics logo">
    <rect width="200" height="80" rx="6" fill="#002A6C"/>
    <text x="100" y="46" textAnchor="middle" fill="#F7A600" fontFamily="Arial Black,sans-serif" fontWeight="900" fontSize="36" letterSpacing="4">CEVA</text>
    <text x="100" y="66" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="11" letterSpacing="3">LOGISTICS</text>
  </svg>
);

const CARRIER_LOGOS: Record<string, React.FC<CarrierLogoProps>> = {
  usps: USPSLogo,
  fedex: FedExLogo,
  ups: UPSLogo,
  dhl: DHLLogo,
  amazon: AmazonLogo,
  ontrac: OnTracLogo,
  lasership: LaserShipLogo,
  easypost: EasyPostLogo,
  "deutsche-post": DeutschePostLogo,
  colissimo: ColissimoLogo,
  "india-post": IndiaPostLogo,
  "sf-express": SFExpressLogo,
  speedex: SpeedexLogo,
  roadie: RoadieLogo,
  doordash: DoorDashLogo,
  alibaba: AlibabaLogo,
  "singapore-mail": SingaporePostLogo,
  ceva: CevaLogo,
};

interface CarrierLogoByNameProps {
  carrier: string;
  className?: string;
  size?: number;
}

export const CarrierLogoByName = ({ carrier, className, size = 40 }: CarrierLogoByNameProps) => {
  const key = carrier.toLowerCase().replace(/\s+/g, "-");
  const Logo = CARRIER_LOGOS[key];
  if (!Logo) {
    return (
      <div
        className={cn("flex items-center justify-center rounded-md bg-muted text-muted-foreground font-bold text-sm", className)}
        style={{ width: size * 2.5, height: size }}
        aria-label={carrier}
      >
        {carrier.slice(0, 3).toUpperCase()}
      </div>
    );
  }
  return <Logo className={className} size={size} />;
};

export const ALL_CARRIERS = [
  { id: "usps", name: "USPS", description: "United States Postal Service", slug: "/", color: "#004B87" },
  { id: "fedex", name: "FedEx", description: "Federal Express", slug: "/fedex-tracking", color: "#4D148C" },
  { id: "ups", name: "UPS", description: "United Parcel Service", slug: "/ups-tracking", color: "#351C15" },
  { id: "dhl", name: "DHL", description: "DHL Express", slug: "/dhl-tracking", color: "#FFCC00" },
  { id: "amazon", name: "Amazon", description: "Amazon Logistics", slug: "/amazon-tracking", color: "#FF9900" },
  { id: "ontrac", name: "OnTrac", description: "OnTrac Courier", slug: "/ontrac-tracking", color: "#003087" },
  { id: "lasership", name: "LaserShip", description: "LaserShip Delivery", slug: "/lasership-tracking", color: "#E31837" },
  { id: "easypost", name: "EasyPost", description: "EasyPost Shipping", slug: "/easypost-tracking", color: "#6C3CF6" },
  { id: "deutsche-post", name: "Deutsche Post", description: "German Postal Service", slug: "/deutsche-post-tracking", color: "#FFCC00" },
  { id: "colissimo", name: "Colissimo", description: "French Postal Tracking", slug: "/colissimo-tracking", color: "#003189" },
  { id: "india-post", name: "India Post", description: "India Postal Service", slug: "/india-post-tracking", color: "#FF6200" },
  { id: "sf-express", name: "SF Express", description: "SF Express China", slug: "/sf-express-tracking", color: "#E60012" },
  { id: "speedex", name: "Speedex", description: "Speedex Courier", slug: "/speedex-tracking", color: "#1B2A8E" },
  { id: "roadie", name: "Roadie", description: "Roadie Same-Day", slug: "/roadie-tracking", color: "#00A86B" },
  { id: "doordash", name: "DoorDash", description: "DoorDash Delivery", slug: "/doordash-tracking", color: "#FF3008" },
  { id: "alibaba", name: "Alibaba", description: "Alibaba Global Tracking", slug: "/alibaba-tracking", color: "#FF6000" },
  { id: "singapore-mail", name: "Singapore Post", description: "Singapore Mail", slug: "/singapore-mail-tracking", color: "#E60028" },
  { id: "ceva", name: "CEVA", description: "CEVA Logistics", slug: "/ceva-tracking", color: "#002A6C" },
];

export default CarrierLogoByName;
