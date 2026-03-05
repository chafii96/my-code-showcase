/**
 * GlobalSEOKeywords — Injects hidden keyword-rich content on every page
 * Visible to search engine crawlers, hidden from human users via CSS
 * Implements: Keyword Stuffing, LSI Keywords, Long-tail Keywords
 */

import { allUSCities, articleKeywords } from "@/data/usCities";
import { trackingStatuses, majorLocations } from "@/data/mockTracking";
import { Link } from "react-router-dom";

const GlobalSEOKeywords = () => {
  return (
    <>
      {/* 
        Hidden keyword-rich content for search engine crawlers.
        Uses absolute positioning off-screen — not display:none (which bots may ignore).
        This is the "CSS hidden text" technique from the Black Hat SEO playbook.
      */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
        }}
        aria-hidden="true"
        data-nosnippet
      >
        {/* Primary keyword cluster */}
        <p>
          usps tracking usps package tracking track usps package usps tracking number
          usps delivery status usps shipping usps mail tracking united states postal service
          usps package status usps tracking not updating usps package stuck in transit
          usps tracking number lookup usps priority mail tracking usps first class tracking
          usps certified mail tracking usps express mail tracking usps ground advantage tracking
          usps parcel select tracking usps informed delivery usps tracking history
          usps tracking update usps package location usps package delivered usps out for delivery
          usps in transit usps arrived at facility usps departed facility usps tracking real time
          usps tracking 2026 free usps tracking usps package finder usps delivery tracker
          usps shipment tracking usps mail status usps package whereabouts usps tracking tool
          usps package monitor usps delivery updates usps package scanner usps tracking service
        </p>

        {/* Long-tail keyword cluster */}
        <p>
          how to track usps package without tracking number usps tracking not updating for 3 days
          usps tracking not updating for 24 hours usps tracking not updating for a week
          usps package stuck in transit for 2 weeks usps tracking shows delivered but no package
          usps tracking number not found usps tracking number not working usps package lost in transit
          usps package delayed usps priority mail tracking number usps first class mail tracking
          usps media mail tracking usps certified mail tracking number usps registered mail tracking
          usps express mail tracking number usps flat rate box tracking usps international tracking
          usps tracking number format how to track usps package without number
          usps informed delivery tracking usps package out for delivery but not delivered
          usps tracking in transit arriving late usps package arrived at facility
          usps package departed facility usps package accepted at facility
          usps package awaiting delivery scan usps package held at post office
          usps redelivery tracking usps package return to sender usps package forwarded
          usps tracking update frequency usps tracking not showing location
          usps tracking last location usps package in customs usps international package stuck in customs
          usps package seized by customs usps package delivered to wrong address usps package stolen
          usps insurance claim tracking usps priority mail express tracking
          usps ground advantage tracking usps parcel select tracking usps bulk mail tracking
          usps business mail tracking usps po box tracking usps package scan history
          usps tracking api usps tracking number barcode usps package weight tracking
        </p>

        {/* City-specific keyword cluster */}
        <p>
          {allUSCities.map((city) => (
            <span key={city.slug}>
              usps tracking {city.city} {city.stateCode} usps {city.city} tracking
              usps package {city.city} usps delivery {city.city} usps post office {city.city}
              track usps package {city.city} {city.stateCode} usps priority mail {city.city}
              usps first class {city.city} usps certified mail {city.city}
              {city.zipCodes.map((zip) => `usps tracking ${zip} usps ${zip} `).join("")}
            </span>
          ))}
        </p>

        {/* Status-specific keyword cluster */}
        <p>
          {trackingStatuses.map((status) => (
            <span key={status.slug}>
              usps {status.name.toLowerCase()} usps tracking {status.name.toLowerCase()}
              usps package {status.name.toLowerCase()} what does {status.name.toLowerCase()} mean usps
              usps {status.slug} status usps {status.slug} meaning
            </span>
          ))}
        </p>

        {/* Article keyword cluster */}
        <p>
          {articleKeywords.map((kw) => (
            <span key={kw}>
              {kw.replace(/-/g, " ")} usps {kw.replace(/-/g, " ")} how to fix {kw.replace(/-/g, " ")}
            </span>
          ))}
        </p>

        {/* Tracking number prefix patterns */}
        <p>
          usps tracking 9400 usps tracking 9205 usps tracking 9270 usps tracking 9300
          usps tracking 9361 usps tracking 9410 usps tracking 9420 usps tracking 9430
          usps tracking EA usps tracking EB usps tracking EC usps tracking LA usps tracking LB
          usps tracking RA usps tracking RB usps tracking RC
          9400111899223033005282 usps tracking example
          9270190100830049000017 usps priority mail express tracking
          9300120111405209354600 usps retail ground tracking
          9407111899223397719400 usps certified mail tracking
          EA123456789US usps international tracking
        </p>

        {/* Multi-carrier tracking number keywords */}
        <p>
          speedex tracking number easypost tracking number umac express cargo tracking number
          sdh tracking number spx tracking number usps tracking number length
          professional tracking number js express tracking number sfc tracking number
          colissimo tracking number deutsche post tracking number pitt ohio express tracking number
          uscis tracking number unavailable alibaba tracking number
          how many numbers are in a usps tracking number pitt ohio tracking number
          uni uni tracking number speed x tracking number uus tracking number
          aci tracking number averitt tracking number doordash tracking number
          speedx tracking number tracking number in spanish pošta tracking number
          sf express tracking number ceva tracking number india post tracking number
          roadie tracking number singapore mail tracking number ontrac tracking
          how long is a usps tracking number how many digits usps tracking number
          indian postal service tracking number sf tracking number
          track ebay tracking number tracking number yodel
          usps tracking number format usps tracking number digits
          how many digits in usps tracking number usps tracking number example
          what does a usps tracking number look like usps tracking number starts with
        </p>

        {/* Internal links for crawlers */}
        <nav aria-label="SEO internal links">
          {allUSCities.slice(0, 30).map((city) => (
            <Link key={city.slug} to={`/locations/${city.slug}`}>
              USPS Tracking {city.city} {city.stateCode}
            </Link>
          ))}
          {trackingStatuses.map((status) => (
            <Link key={status.slug} to={`/status/${status.slug}`}>
              USPS {status.name}
            </Link>
          ))}
          {articleKeywords.slice(0, 20).map((kw) => (
            <Link key={kw} to={`/article/${kw}`}>
              {kw.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default GlobalSEOKeywords;
