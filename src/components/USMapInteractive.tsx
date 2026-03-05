import { Link } from "react-router-dom";
import { useState } from "react";
import { allUSCities } from "@/data/usCities";
import { MapPin, ArrowRight, Map } from "lucide-react";

// US state paths for SVG map (simplified boundaries)
const STATE_PATHS: Record<string, { path: string; labelX: number; labelY: number }> = {
  AL: { path: "M628,396 L628,440 L620,460 L632,462 L634,448 L650,396Z", labelX: 635, labelY: 425 },
  AK: { path: "M120,462 L170,462 L170,510 L120,510Z", labelX: 145, labelY: 486 },
  AZ: { path: "M190,370 L240,370 L248,430 L185,430Z", labelX: 215, labelY: 400 },
  AR: { path: "M555,385 L610,385 L610,425 L555,425Z", labelX: 582, labelY: 405 },
  CA: { path: "M115,260 L155,250 L170,320 L155,400 L120,400 L105,340Z", labelX: 135, labelY: 330 },
  CO: { path: "M280,290 L350,290 L350,340 L280,340Z", labelX: 315, labelY: 315 },
  CT: { path: "M790,220 L810,215 L815,230 L795,235Z", labelX: 802, labelY: 225 },
  DE: { path: "M760,280 L770,275 L772,295 L762,295Z", labelX: 766, labelY: 285 },
  FL: { path: "M640,440 L700,430 L720,480 L690,520 L660,500 L640,460Z", labelX: 680, labelY: 470 },
  GA: { path: "M660,380 L700,380 L710,430 L660,440Z", labelX: 680, labelY: 410 },
  HI: { path: "M260,480 L300,475 L305,495 L265,500Z", labelX: 282, labelY: 488 },
  ID: { path: "M210,160 L245,155 L250,240 L215,250Z", labelX: 230, labelY: 200 },
  IL: { path: "M570,260 L600,255 L605,340 L565,345Z", labelX: 585, labelY: 300 },
  IN: { path: "M605,260 L635,260 L635,335 L605,340Z", labelX: 620, labelY: 300 },
  IA: { path: "M500,235 L565,235 L565,280 L500,280Z", labelX: 532, labelY: 258 },
  KS: { path: "M400,310 L500,310 L500,355 L400,355Z", labelX: 450, labelY: 332 },
  KY: { path: "M610,330 L690,320 L695,350 L615,355Z", labelX: 652, labelY: 340 },
  LA: { path: "M555,430 L610,425 L615,470 L570,475Z", labelX: 582, labelY: 450 },
  ME: { path: "M810,130 L835,120 L840,175 L815,180Z", labelX: 825, labelY: 150 },
  MD: { path: "M720,275 L760,270 L762,295 L722,295Z", labelX: 740, labelY: 283 },
  MA: { path: "M795,200 L825,195 L828,210 L798,215Z", labelX: 812, labelY: 205 },
  MI: { path: "M590,175 L640,170 L645,250 L595,255Z", labelX: 618, labelY: 215 },
  MN: { path: "M470,140 L535,140 L535,210 L470,210Z", labelX: 502, labelY: 175 },
  MS: { path: "M590,385 L625,385 L625,445 L590,445Z", labelX: 607, labelY: 415 },
  MO: { path: "M510,300 L570,295 L575,365 L515,370Z", labelX: 542, labelY: 332 },
  MT: { path: "M250,115 L365,115 L365,175 L250,175Z", labelX: 307, labelY: 145 },
  NE: { path: "M370,260 L480,258 L480,300 L370,305Z", labelX: 425, labelY: 280 },
  NV: { path: "M170,240 L210,235 L220,340 L175,350Z", labelX: 192, labelY: 290 },
  NH: { path: "M800,165 L815,160 L818,195 L803,200Z", labelX: 808, labelY: 180 },
  NJ: { path: "M770,250 L785,245 L788,285 L772,290Z", labelX: 780, labelY: 268 },
  NM: { path: "M250,370 L320,365 L325,435 L255,440Z", labelX: 287, labelY: 400 },
  NY: { path: "M720,175 L795,170 L800,230 L725,235Z", labelX: 757, labelY: 205 },
  NC: { path: "M660,340 L750,330 L755,365 L665,375Z", labelX: 707, labelY: 352 },
  ND: { path: "M380,125 L465,125 L465,175 L380,175Z", labelX: 422, labelY: 150 },
  OH: { path: "M640,250 L690,245 L695,310 L645,315Z", labelX: 667, labelY: 280 },
  OK: { path: "M390,360 L500,355 L505,400 L395,405Z", labelX: 447, labelY: 378 },
  OR: { path: "M130,145 L210,140 L215,205 L135,210Z", labelX: 170, labelY: 175 },
  PA: { path: "M690,235 L770,228 L772,270 L692,275Z", labelX: 730, labelY: 252 },
  RI: { path: "M808,218 L818,215 L820,228 L810,230Z", labelX: 814, labelY: 222 },
  SC: { path: "M680,370 L720,365 L725,400 L685,405Z", labelX: 702, labelY: 385 },
  SD: { path: "M380,180 L470,180 L470,230 L380,230Z", labelX: 425, labelY: 205 },
  TN: { path: "M590,350 L690,340 L695,370 L595,380Z", labelX: 642, labelY: 360 },
  TX: { path: "M340,390 L480,385 L490,490 L380,500 L340,440Z", labelX: 415, labelY: 440 },
  UT: { path: "M225,250 L280,248 L282,330 L228,335Z", labelX: 253, labelY: 290 },
  VT: { path: "M790,155 L805,150 L808,185 L793,190Z", labelX: 798, labelY: 170 },
  VA: { path: "M680,300 L755,290 L760,330 L685,340Z", labelX: 718, labelY: 315 },
  WA: { path: "M135,100 L215,95 L218,155 L140,160Z", labelX: 175, labelY: 128 },
  WV: { path: "M680,285 L710,280 L715,325 L685,330Z", labelX: 697, labelY: 305 },
  WI: { path: "M530,155 L585,150 L590,230 L535,235Z", labelX: 560, labelY: 192 },
  WY: { path: "M265,195 L350,192 L352,250 L268,255Z", labelX: 308, labelY: 222 },
  DC: { path: "M745,288 L750,286 L751,292 L746,293Z", labelX: 748, labelY: 290 },
};

// Group cities by state
const citiesByState = allUSCities.reduce((acc, city) => {
  if (!acc[city.stateCode]) acc[city.stateCode] = [];
  acc[city.stateCode].push(city);
  return acc;
}, {} as Record<string, typeof allUSCities>);

export default function USMapInteractive() {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const hoveredCities = hoveredState ? citiesByState[hoveredState] || [] : [];
  const selectedCities = selectedState ? citiesByState[selectedState] || [] : [];
  const displayCities = selectedState ? selectedCities : hoveredCities;
  const displayStateCode = selectedState || hoveredState;

  return (
    <section className="mb-10">
      <div className="section-badge">
        <Map className="h-3.5 w-3.5" /> Interactive Map
      </div>
      <h2 className="text-xl font-bold text-foreground mb-4">Interactive USPS Locations Map</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 premium-card p-5 overflow-hidden relative">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
          <svg viewBox="100 80 760 450" className="w-full h-auto relative z-10" role="img" aria-label="Interactive map of US states with USPS tracking locations">
            {Object.entries(STATE_PATHS).map(([code, { path, labelX, labelY }]) => {
              const hasCities = !!citiesByState[code];
              const isHovered = hoveredState === code;
              const isSelected = selectedState === code;
              const cityCount = citiesByState[code]?.length || 0;

              return (
                <g key={code}>
                  <path
                    d={path}
                    className={`cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'fill-accent/80 stroke-accent stroke-2'
                        : isHovered
                        ? 'fill-accent/40 stroke-accent stroke-[1.5]'
                        : hasCities
                        ? 'fill-accent/15 stroke-border hover:fill-accent/30'
                        : 'fill-muted stroke-border hover:fill-muted-foreground/10'
                    }`}
                    strokeWidth={isSelected ? 2 : 1}
                    onMouseEnter={() => setHoveredState(code)}
                    onMouseLeave={() => { if (!selectedState) setHoveredState(null); }}
                    onClick={() => setSelectedState(selectedState === code ? null : code)}
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={`text-[8px] font-bold pointer-events-none select-none ${
                      isSelected ? 'fill-white' : 'fill-foreground/70'
                    }`}
                  >
                    {code}
                  </text>
                  {hasCities && (
                    <text
                      x={labelX}
                      y={labelY + 10}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[6px] fill-muted-foreground pointer-events-none select-none"
                    >
                      {cityCount}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Click a state to see USPS tracking locations. <span className="text-accent font-semibold">{Object.keys(citiesByState).length} states</span> covered.
          </p>
        </div>

        {/* City List Panel */}
        <div className="premium-card p-4 max-h-[420px] overflow-y-auto">
          {displayStateCode && displayCities.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{displayCities[0]?.state}</h3>
                  <p className="text-xs text-muted-foreground">{displayStateCode} — {displayCities.length} cities</p>
                </div>
              </div>
              <div className="space-y-1">
                {displayCities.map((city) => (
                  <Link
                    key={city.slug}
                    to={`/locations/${city.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-accent/5 transition-colors group"
                  >
                    <div>
                      <span className="font-semibold text-sm text-foreground group-hover:text-accent transition-colors">{city.city}</span>
                      <span className="text-xs text-muted-foreground ml-2">{city.facilities} facilities</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Hover or click a state<br/>to see USPS cities</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
