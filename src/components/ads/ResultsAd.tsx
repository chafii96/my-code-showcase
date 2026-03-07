import { isPlacementEnabled, getAdUnit } from "@/lib/adsense-config";
import AdSenseUnit from "./AdSenseUnit";

export default function ResultsAd() {
  if (!isPlacementEnabled('afterResults')) return null;
  const unit = getAdUnit('afterResults');
  return (
    <div className="flex justify-center my-4">
      <AdSenseUnit
        adSlot={unit?.slotId}
        adFormat="rectangle"
        style={{ width: '300px', height: '250px', maxWidth: '100%' }}
      />
    </div>
  );
}
