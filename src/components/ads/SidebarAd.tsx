import { isPlacementEnabled, getAdUnit } from "@/lib/adsense-config";
import AdSenseUnit from "./AdSenseUnit";

export default function SidebarAd() {
  if (!isPlacementEnabled('sidebar')) return null;
  const unit = getAdUnit('sidebar');
  return (
    <div className="hidden lg:block">
      <AdSenseUnit
        adSlot={unit?.slotId}
        adFormat="vertical"
        style={{ width: '160px', height: '600px' }}
      />
    </div>
  );
}
