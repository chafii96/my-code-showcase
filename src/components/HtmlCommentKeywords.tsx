/**
 * HtmlCommentKeywords Component
 * Injects HTML comments with keyword-rich content that search engine crawlers can read
 * but is invisible to regular users. Used for keyword density optimization.
 */

import { useEffect } from "react";

interface HtmlCommentKeywordsProps {
  keywords?: string[];
  page?: string;
}

const DEFAULT_KEYWORDS = [
  "usps tracking", "usps package tracking", "usps tracking number", "track usps package",
  "usps delivery status", "usps shipment tracking", "usps mail tracking", "usps tracking not updating",
  "usps package stuck in transit", "usps out for delivery", "usps in transit", "usps delivered",
  "usps priority mail tracking", "usps first class tracking", "usps certified mail tracking",
  "usps ground advantage tracking", "usps express mail tracking", "usps media mail tracking",
  "usps flat rate tracking", "usps return to sender", "usps held at post office",
  "usps attempted delivery", "usps available for pickup", "usps customs delay",
  "usps tracking number format", "usps informed delivery", "usps missing package",
  "usps lost package", "usps damaged package", "usps insurance claim",
  "usps shipping calculator", "usps click n ship", "usps estimated delivery",
  "usps sunday delivery", "usps holiday schedule", "usps post office hours",
  "usps change of address", "usps forward mail", "usps po box tracking",
  "usps business shipping", "usps commercial base pricing", "usps cubic pricing",
  "usps tracking api", "usps web tools api", "usps address verification",
  "usps zip code lookup", "usps service alerts", "usps delays today",
  "usps tracking 2025", "usps tracking 2026", "united states postal service tracking",
  "postal service tracking number", "post office tracking", "mail tracking usps",
  "package tracking usps", "usps parcel tracking", "usps shipment status",
  "usps delivery confirmation", "usps signature confirmation", "usps registered mail",
  "usps international tracking", "usps global express guaranteed", "usps priority mail international",
  "usps first class international", "usps customs form", "usps harmonized tariff code",
];

export const HtmlCommentKeywords = ({ keywords = [], page = "default" }: HtmlCommentKeywordsProps) => {
  useEffect(() => {
    // Inject HTML comment with keywords into the document
    const allKeywords = [...DEFAULT_KEYWORDS, ...keywords];
    const commentText = `
      USPS Tracking - ${page}
      Keywords: ${allKeywords.join(", ")}
      Description: Free USPS package tracking tool. Track any USPS shipment with your tracking number.
      Updated: ${new Date().toISOString().split("T")[0]}
      Service: US Postal Service Tracking
      Coverage: All 50 US States + Territories + International
    `;
    
    // Insert comment node at start of body
    if (typeof document !== "undefined") {
      const comment = document.createComment(commentText);
      if (document.body.firstChild) {
        document.body.insertBefore(comment, document.body.firstChild);
      } else {
        document.body.appendChild(comment);
      }
    }

    return () => {
      // Cleanup on unmount
      if (typeof document !== "undefined") {
        document.body.childNodes.forEach((node) => {
          if (node.nodeType === Node.COMMENT_NODE) {
            document.body.removeChild(node);
          }
        });
      }
    };
  }, [page, keywords.join(",")]);

  return null;
};

export default HtmlCommentKeywords;
