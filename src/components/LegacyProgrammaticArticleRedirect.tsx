import { Navigate, useParams } from "react-router-dom";
import { allUSCities } from "@/data/usCities";

function stripHtmlExtension(value: string) {
  return value.replace(/\.html$/i, "");
}

export default function LegacyProgrammaticArticleRedirect() {
  const { legacySlug } = useParams<{ legacySlug: string }>();

  if (!legacySlug) {
    return <Navigate to="/" replace />;
  }

  const cleanSlug = stripHtmlExtension(legacySlug.toLowerCase());

  const citySlug = [...allUSCities]
    .map((city) => city.slug)
    .sort((a, b) => b.length - a.length)
    .find((slug) => cleanSlug.startsWith(`${slug}-`));

  if (!citySlug) {
    return <Navigate to="/" replace />;
  }

  const topicSlug = cleanSlug.slice(citySlug.length + 1);

  if (!topicSlug) {
    return <Navigate to="/" replace />;
  }

  // يحول إلى مسار legacy الموجود مسبقًا ليستخدم CityTopicRedirect
  return <Navigate to={`/city/${citySlug}/${topicSlug}`} replace />;
}
