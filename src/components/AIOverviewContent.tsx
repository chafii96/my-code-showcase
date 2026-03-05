/**
 * AI Overview & Featured Snippet Optimization Component
 * Structured to appear in Google AI Overviews, Featured Snippets, and People Also Ask
 * Implements: Answer boxes, definition blocks, step-by-step lists, comparison tables
 */

import { CheckCircle, Clock, Package, MapPin, AlertCircle, Info } from "lucide-react";

interface AIOverviewContentProps {
  type: "tracking-guide" | "status-meaning" | "location-info" | "problem-solution";
  data?: {
    statusName?: string;
    statusDescription?: string;
    city?: string;
    state?: string;
    problem?: string;
    solution?: string;
  };
}

const AIOverviewContent = ({ type, data = {} }: AIOverviewContentProps) => {
  if (type === "tracking-guide") {
    return (
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
        {/* Quick Answer Box — targets Featured Snippet */}
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-foreground mb-2">Quick Answer: How to Track a USPS Package</h2>
            <p className="text-sm text-muted-foreground">
              To track a USPS package, enter your 20–22 digit tracking number at uspostaltracking.com or tools.usps.com. 
              USPS tracking numbers starting with <strong>9400</strong> are Priority Mail, <strong>9270</strong> are Priority Mail Express, 
              and <strong>9300</strong> are USPS Retail Ground. International packages use 13-character codes like EA123456789US.
            </p>
          </div>
        </div>

        {/* Step-by-step list — targets "How to" featured snippets */}
        <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Steps to Track Your USPS Package:</h3>
          <ol className="space-y-2">
            {[
              "Find your tracking number on your receipt, email confirmation, or package label",
              "Enter the tracking number in the search box above",
              "Click 'Track Now' to see real-time status",
              "Sign up for USPS Informed Delivery for automatic notifications",
              "If tracking hasn't updated in 5+ days, file a Missing Mail request at usps.com",
            ].map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  if (type === "status-meaning" && data.statusName) {
    return (
      <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            {/* Definition box — targets "What does X mean" featured snippets */}
            <h2 className="font-bold text-foreground mb-2">
              What Does "{data.statusName}" Mean?
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>"{data.statusName}"</strong> is a USPS tracking status that means: {data.statusDescription}
            </p>
            <div className="bg-white dark:bg-card border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>What to do:</strong> This is a normal part of the USPS delivery process. 
                No action is required unless the status hasn't changed in more than 5 business days.
                If your package is delayed, contact USPS at 1-800-275-8777 or file a Missing Mail 
                request at usps.com/help/missing-mail.htm.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "location-info" && data.city && data.state) {
    return (
      <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            {/* Local info box — targets local featured snippets */}
            <h2 className="font-bold text-foreground mb-2">
              USPS Tracking in {data.city}, {data.state}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              The USPS serves {data.city}, {data.state} with multiple postal facilities. 
              If your tracking shows your package is in {data.city}, it is being processed 
              at a local USPS facility and will typically be delivered within 1–2 business days.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white dark:bg-card border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground">USPS Customer Service</p>
                <p className="text-xs text-muted-foreground">1-800-275-8777</p>
                <p className="text-xs text-muted-foreground">Mon–Fri 8AM–8:30PM ET</p>
              </div>
              <div className="bg-white dark:bg-card border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground">Missing Mail</p>
                <p className="text-xs text-muted-foreground">usps.com/help/missing-mail.htm</p>
                <p className="text-xs text-muted-foreground">File after 7 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "problem-solution" && data.problem) {
    return (
      <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            {/* Problem-solution box — targets "how to fix" featured snippets */}
            <h2 className="font-bold text-foreground mb-2">
              {data.problem?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h2>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Quick Fix:</strong> {data.solution || "Wait 24–48 hours for tracking to update, then contact USPS at 1-800-275-8777 if the issue persists."}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-orange-500" />
                <span>Most tracking issues resolve within 24–48 hours</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Package className="h-3.5 w-3.5 text-orange-500" />
                <span>File Missing Mail after 7 business days: usps.com/help/missing-mail.htm</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-orange-500" />
                <span>Call USPS: 1-800-275-8777 (Mon–Fri 8AM–8:30PM ET)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AIOverviewContent;
