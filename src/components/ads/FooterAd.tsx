import { isPlacementEnabled, getAdUnit } from "@/lib/adsense-config";
import AdSenseUnit from "./AdSenseUnit";

export default function FooterAd() {
  if (!isPlacementEnabled('footer')) return null;
  const unit = getAdUnit('footer');
  return (
    <div className="w-full flex justify-center py-3 bg-muted/20 border-t border-border/20">
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
