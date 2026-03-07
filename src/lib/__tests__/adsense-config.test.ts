import { describe, it, expect, beforeEach } from "vitest";
import {
  getAdSenseConfig,
  saveAdSenseConfig,
  isAdSenseReady,
  isPlacementEnabled,
  getAdUnit,
  invalidateConfigCache,
  type AdSenseConfig,
} from "@/lib/adsense-config";

describe("adsense-config", () => {
  beforeEach(() => {
    localStorage.clear();
    invalidateConfigCache();
  });

  it("returns default config when nothing saved", () => {
    const config = getAdSenseConfig();
    expect(config.publisherId).toBe("");
    expect(config.enabled).toBe(false);
    expect(config.autoAds).toBe(false);
    expect(config.adUnits.length).toBeGreaterThan(0);
    expect(config.applicationStatus).toBe("not_applied");
  });

  it("saves and retrieves config from localStorage", () => {
    const config = getAdSenseConfig();
    config.publisherId = "ca-pub-1234567890123456";
    config.enabled = true;
    saveAdSenseConfig(config);
    invalidateConfigCache();

    const loaded = getAdSenseConfig();
    expect(loaded.publisherId).toBe("ca-pub-1234567890123456");
    expect(loaded.enabled).toBe(true);
  });

  it("isAdSenseReady returns false when not configured", () => {
    expect(isAdSenseReady()).toBe(false);
  });

  it("isAdSenseReady returns true when properly configured", () => {
    const config = getAdSenseConfig();
    config.publisherId = "ca-pub-1234567890123456";
    config.enabled = true;
    saveAdSenseConfig(config);

    expect(isAdSenseReady()).toBe(true);
  });

  it("isAdSenseReady returns false with invalid publisher ID", () => {
    const config = getAdSenseConfig();
    config.publisherId = "invalid-id";
    config.enabled = true;
    saveAdSenseConfig(config);

    expect(isAdSenseReady()).toBe(false);
  });

  it("isPlacementEnabled respects config", () => {
    expect(isPlacementEnabled("header")).toBe(false); // not enabled globally

    const config = getAdSenseConfig();
    config.publisherId = "ca-pub-1234567890123456";
    config.enabled = true;
    config.placements.header = true;
    config.placements.sidebar = false;
    saveAdSenseConfig(config);

    expect(isPlacementEnabled("header")).toBe(true);
    expect(isPlacementEnabled("sidebar")).toBe(false);
  });

  it("getAdUnit finds enabled unit by placement", () => {
    const config = getAdSenseConfig();
    const unit = config.adUnits.find(u => u.placement === "header");
    expect(unit).toBeDefined();
    expect(unit!.enabled).toBe(true);
  });

  it("getAdUnit returns undefined for non-existent placement", () => {
    expect(getAdUnit("nonexistent")).toBeUndefined();
  });

  it("default placements are set correctly", () => {
    const config = getAdSenseConfig();
    expect(config.placements.header).toBe(true);
    expect(config.placements.afterResults).toBe(true);
    expect(config.placements.sidebar).toBe(false);
    expect(config.placements.footer).toBe(true);
    expect(config.placements.inArticle).toBe(true);
  });

  it("stats default to zero", () => {
    const config = getAdSenseConfig();
    expect(config.stats.todayEarnings).toBe(0);
    expect(config.stats.monthEarnings).toBe(0);
    expect(config.stats.clicks).toBe(0);
    expect(config.stats.impressions).toBe(0);
    expect(config.stats.ctr).toBe(0);
    expect(config.stats.lastUpdated).toBeNull();
  });
});
