import { isPlacementEnabled, getAdUnit } from "@/lib/adsense-config";
import AdSenseUnit from "./AdSenseUnit";

export default function HeaderAd() {
  if (!isPlacementEnabled('header')) return null;
  const unit = getAdUnit('header');
  return (
    <div className="w-full flex justify-center py-2 bg-muted/10">
      <div className="container max-w-[728px]">
        <AdSenseUnit
          adSlot={unit?.slotId}
          adFormat="horizontal"
          style={{ width: '728px', height: '90px', maxWidth: '100%' }}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
