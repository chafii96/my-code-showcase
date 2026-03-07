import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import HeaderAd from "@/components/ads/HeaderAd";
import FooterAd from "@/components/ads/FooterAd";
import ResultsAd from "@/components/ads/ResultsAd";
import SidebarAd from "@/components/ads/SidebarAd";
import InArticleAd from "@/components/ads/InArticleAd";
import { invalidateConfigCache, saveAdSenseConfig, getAdSenseConfig } from "@/lib/adsense-config";

describe("Ad Placement Components", () => {
  beforeEach(() => {
    localStorage.clear();
    invalidateConfigCache();
  });

  it("HeaderAd renders nothing when AdSense disabled", () => {
    const { container } = render(<HeaderAd />);
    expect(container.innerHTML).toBe("");
  });

  it("FooterAd renders nothing when AdSense disabled", () => {
    const { container } = render(<FooterAd />);
    expect(container.innerHTML).toBe("");
  });

  it("ResultsAd renders nothing when AdSense disabled", () => {
    const { container } = render(<ResultsAd />);
    expect(container.innerHTML).toBe("");
  });

  it("SidebarAd renders nothing when AdSense disabled", () => {
    const { container } = render(<SidebarAd />);
    expect(container.innerHTML).toBe("");
  });

  it("InArticleAd renders nothing when AdSense disabled", () => {
    const { container } = render(<InArticleAd />);
    expect(container.innerHTML).toBe("");
  });

  it("HeaderAd renders when AdSense is enabled and placement is on", () => {
    const config = getAdSenseConfig();
    config.publisherId = "ca-pub-1234567890123456";
    config.enabled = true;
    config.placements.header = true;
    saveAdSenseConfig(config);

    const { container } = render(<HeaderAd />);
    expect(container.querySelector(".adsense-unit, div")).toBeTruthy();
  });

  it("SidebarAd renders nothing when placement disabled even if AdSense enabled", () => {
    const config = getAdSenseConfig();
    config.publisherId = "ca-pub-1234567890123456";
    config.enabled = true;
    config.placements.sidebar = false;
    saveAdSenseConfig(config);

    const { container } = render(<SidebarAd />);
    expect(container.innerHTML).toBe("");
  });
});
