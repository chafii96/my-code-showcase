import { isPlacementEnabled, getAdUnit } from "@/lib/adsense-config";
import AdSenseUnit from "./AdSenseUnit";

export default function InArticleAd() {
  if (!isPlacementEnabled('inArticle')) return null;
  const unit = getAdUnit('inArticle');
  return (
    <div className="flex justify-center my-6">
      <AdSenseUnit
        adSlot={unit?.slotId}
        adFormat="auto"
        adLayout="in-article"
        style={{ textAlign: 'center' }}
        className="w-full max-w-2xl"
      />
    </div>
  );
}
