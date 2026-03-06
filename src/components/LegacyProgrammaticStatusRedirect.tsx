import { Navigate, useParams } from "react-router-dom";
import { allUSCities } from "@/data/usCities";

const LEGACY_STATUS_SLUGS = [
  "in-transit",
  "out-for-delivery",
  "delivered",
  "attempted-delivery",
  "available-for-pickup",
  "return-to-sender",
  "forwarded",
  "pre-shipment",
  "accepted",
  "alert",
  "in-transit-arriving-late",
  "delivery-exception",
  "held-at-post-office",
  "missent",
  "undeliverable",
] as const;

function stripHtmlExtension(value: string) {
  return value.replace(/\.html$/i, "");
}

export default function LegacyProgrammaticStatusRedirect() {
  const { legacySlug } = useParams<{ legacySlug: string }>();

  if (!legacySlug) {
    return <Navigate to="/" replace />;
  }

  const cleanSlug = stripHtmlExtension(legacySlug.toLowerCase());

  const matchedStatus = [...LEGACY_STATUS_SLUGS]
    .sort((a, b) => b.length - a.length)
    .find((status) => cleanSlug.endsWith(`-${status}`));

  if (!matchedStatus) {
    return <Navigate to="/" replace />;
  }

  const citySlug = cleanSlug.slice(0, -(matchedStatus.length + 1));
  const cityExists = allUSCities.some((city) => city.slug === citySlug);

  if (!citySlug || !cityExists) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/city/${citySlug}/status/${matchedStatus}`} replace />;
}
