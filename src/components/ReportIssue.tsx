import { useState } from "react";
import { AlertTriangle, Send, X } from "lucide-react";

const ReportIssue = ({ trackingNumber }: { trackingNumber: string }) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-success">Issue reported successfully. We'll look into it.</p>
      </div>
    );
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          Report an Issue
        </button>
      ) : (
        <div className="bg-card border rounded-lg p-4 fade-up">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              Report Issue for {trackingNumber.slice(0, 8)}...
            </h3>
            <button onClick={() => setOpen(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <select className="w-full border rounded-md p-2 text-sm bg-background mb-3">
            <option>Package not received</option>
            <option>Tracking not updating</option>
            <option>Incorrect delivery status</option>
            <option>Package damaged</option>
            <option>Other</option>
          </select>
          <textarea
            placeholder="Describe the issue..."
            className="w-full border rounded-md p-2 text-sm bg-background resize-none h-20 mb-3"
          />
          <button
            onClick={() => setSubmitted(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:brightness-110 transition-all"
          >
            <Send className="h-3 w-3" /> Submit Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportIssue;
