import { ReactNode } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

interface LayoutProps {
  children: ReactNode;
  showAds?: boolean;
}

const Layout = ({ children, showAds = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header Ad Slot */}
      {showAds && <AdSlot slotId="header-ad" />}

      <main id="main-content" className="flex-1 relative" role="main">{children}</main>

      {/* Footer Ad Slot */}
      {showAds && (
        <div className="w-full flex justify-center py-4 bg-muted/20 border-t border-border/20">
          <AdSlot slotId="footer-ad" />
        </div>
      )}

      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
