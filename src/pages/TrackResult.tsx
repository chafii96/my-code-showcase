import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import TrackingProgress from "@/components/TrackingProgress";
import ReportIssue from "@/components/ReportIssue";
import { Package, MapPin, Calendar, Scale, Truck, ArrowLeft, Copy, Check, Info, Clock, Shield, ChevronRight, Navigation, Radar, Search, AlertTriangle, WifiOff, ExternalLink, Box, Zap, CircleCheckBig, RotateCcw } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { isSearchBot, injectCloakedContent } from "@/lib/cloaking";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import InternalLinkingHub from "@/components/InternalLinkingHub";

function getServiceInfo(trackingNumber: string) {
  const prefix = trackingNumber.slice(0, 4);
  if (prefix.startsWith("9400")) return { service: "Priority Mail", keyword: "USPS Priority Mail tracking", tip: "Priority Mail typically delivers in 1-3 business days within the US. Includes USPS Tracking and up to $100 insurance coverage.", icon: "🟦" };
  if (prefix.startsWith("9270")) return { service: "Priority Mail Express", keyword: "USPS Priority Mail Express tracking", tip: "Priority Mail Express offers overnight to 2-day guaranteed delivery with up to $100 insurance and free tracking.", icon: "🟥" };
  if (prefix.startsWith("9205")) return { service: "USPS Retail Ground", keyword: "USPS Retail Ground tracking", tip: "Retail Ground delivers in 2-8 business days. Affordable option for large or heavy packages.", icon: "🟫" };
  if (prefix.startsWith("9407")) return { service: "Certified Mail", keyword: "USPS Certified Mail tracking", tip: "Certified Mail provides proof of mailing and electronic delivery confirmation.", icon: "🟩" };
  if (prefix.startsWith("9303")) return { service: "Collect on Delivery", keyword: "USPS COD tracking", tip: "Collect on Delivery allows the sender to collect the price of goods from the recipient.", icon: "🟨" };
  if (prefix.startsWith("9202")) return { service: "Signature Confirmation", keyword: "USPS Signature Confirmation tracking", tip: "Signature Confirmation records the recipient's signature at delivery.", icon: "🟪" };
  if (/^[A-Z]{2}\d{9}US$/i.test(trackingNumber)) return { service: "International", keyword: "USPS international package tracking", tip: "International tracking may have gaps between postal systems.", icon: "🌍" };
  return { service: "USPS Package", keyword: "USPS package tracking", tip: "Enter your 20-22 digit tracking number for the most accurate results.", icon: "📦" };
}

interface TrackingEvent {
  status: string;
  detail: string;
  location: string;
  date: string;
  time: string;
}

interface TrackingData {
  trackingNumber: string;
  status: string;
  statusLabel: string;
  shippingClass: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  weight: string;
  events: TrackingEvent[];
}

type ErrorType = 'invalid' | 'not-found' | 'connection' | 'rate-limit' | 'server' | 'generic';

function getErrorInfo(error: string, trackingNumber: string): { type: ErrorType; title: string; message: string; icon: typeof AlertTriangle; color: string } {
  const num = trackingNumber || '';
  if (!/^[A-Z0-9]{10,34}$/i.test(num) || num.length < 10) {
    return { type: 'invalid', title: 'Invalid Tracking Number', message: `"${num}" doesn't match any known USPS tracking format. USPS tracking numbers are typically 20-22 digits starting with 9, or 13 characters for international (e.g., EA123456789US).`, icon: AlertTriangle, color: 'destructive' };
  }
  if (error.toLowerCase().includes('too many') || error.toLowerCase().includes('rate limit')) {
    return { type: 'rate-limit', title: 'Too Many Requests', message: 'You\'ve made too many tracking requests. Please wait a minute and try again.', icon: Clock, color: 'warning' };
  }
  if (error.toLowerCase().includes('unable to connect') || error.toLowerCase().includes('failed') || error.toLowerCase().includes('timeout')) {
    return { type: 'connection', title: 'Connection Error', message: 'Unable to reach the USPS tracking service. This could be a temporary issue — please check your connection and try again in a few moments.', icon: WifiOff, color: 'destructive' };
  }
  if (error.toLowerCase().includes('not found') || error.toLowerCase().includes('no tracking') || error.toLowerCase().includes('no record') || error.toLowerCase().includes('no information')) {
    return { type: 'not-found', title: 'No Tracking Info Found', message: 'USPS has no record for this tracking number yet. If you just shipped, tracking details usually appear within 24 hours after the first USPS scan.', icon: Search, color: 'muted-foreground' };
  }
  if (error.toLowerCase().includes('credentials') || error.toLowerCase().includes('configured') || error.toLowerCase().includes('500')) {
    return { type: 'server', title: 'Service Temporarily Unavailable', message: 'Our tracking service is experiencing an issue. Our team has been notified. Please try again shortly.', icon: AlertTriangle, color: 'destructive' };
  }
  return { type: 'generic', title: 'Tracking Not Available', message: error, icon: AlertTriangle, color: 'destructive' };
}

const TrackResult = () => {
  const { number } = useParams<{ number: string }>();
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const serviceInfo = useMemo(() => getServiceInfo(number || ""), [number]);

  useEffect(() => {
    setIsScanning(true);
    setApiError(null);
    setTracking(null);
    let cancelled = false;
    
    const fetchTracking = async () => {
      try {
        const res = await fetch(`/api/usps-track/${encodeURIComponent(number || '')}`);
        const data = await res.json();
        if (cancelled) return;
        
        if (data.ok && data.events?.length > 0) {
          setTracking({
            trackingNumber: data.trackingNumber || number || '',
            status: data.status || 'in-transit',
            statusLabel: data.statusLabel || 'In Transit',
            shippingClass: data.service || serviceInfo.service,
            origin: data.origin || '',
            destination: data.destination || '',
            estimatedDelivery: data.estimatedDelivery || 'Check back for updates',
            weight: data.weight || '—',
            events: data.events.map((e: any) => ({
              status: e.status || '',
              detail: e.detail || e.status || '',
              location: e.location || '',
              date: e.date || '',
              time: e.time || '',
            })),
          });
        } else {
          setApiError(data.error || 'No tracking information found for this number. Please verify and try again.');
        }
      } catch {
        setApiError('Unable to connect to USPS tracking service. Please try again later.');
      }
      if (!cancelled) {
        setTimeout(() => setIsScanning(false), 1500);
      }
    };
    
    fetchTracking();

    const isBot = isSearchBot();
    if (!isBot) {
      initDwellTimeMaximizer();
    }
    injectCloakedContent({ trackingNumber: number });
    initSpeedOptimizations(window.location.pathname);

    return () => { cancelled = true; };
  }, [number]);

  const copyNumber = () => {
    if (!tracking) return;
    navigator.clipboard.writeText(tracking.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progressStatus = tracking ? (
    tracking.status === "delivered" ? "delivered" as const
    : tracking.status === "out-for-delivery" ? "out-for-delivery" as const
    : tracking.status === "label-created" ? "shipped" as const
    : "in-transit" as const
  ) : "in-transit" as const;

  const statusColor = (tracking?.status || '') === "delivered"
    ? { bg: "bg-success/10", text: "text-success", dot: "bg-success", border: "border-success/20", glow: "shadow-[0_0_30px_hsl(160_84%_39%/0.12)]", gradient: "from-success/80 via-success to-emerald-400/80" }
    : (tracking?.status || '') === "out-for-delivery"
    ? { bg: "bg-warning/10", text: "text-warning", dot: "bg-warning", border: "border-warning/20", glow: "shadow-[0_0_30px_hsl(38_92%_50%/0.12)]", gradient: "from-warning/80 via-amber-400 to-warning/80" }
    : { bg: "bg-info/10", text: "text-info", dot: "bg-info", border: "border-info/20", glow: "shadow-[0_0_30px_hsl(200_90%_50%/0.12)]", gradient: "from-info/80 via-sky-400 to-info/80" };

  /* ═══════════ SCANNING STATE ═══════════ */
  if (isScanning) {
    return (
      <Layout>
        <SEOHead title={`Tracking ${number} - Scanning...`} description={`Scanning USPS tracking number ${number}`} canonical={`/track/${number}`} />

        {/* Premium scanning hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient opacity-[0.97]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          <div className="absolute top-10 left-[20%] w-[300px] h-[300px] bg-accent/8 rounded-full blur-[120px]" />

          <div className="relative min-h-[70vh] flex items-center justify-center">
            <div className="max-w-sm w-full mx-auto px-6">
              <div className="text-center">
                {/* Radar rings */}
                <div className="relative w-32 h-32 mx-auto mb-10">
                  <div className="absolute inset-0 rounded-full border-2 border-accent/15 animate-ping" style={{ animationDuration: "2.5s" }} />
                  <div className="absolute inset-4 rounded-full border-2 border-accent/25 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
                  <div className="absolute inset-8 rounded-full border-2 border-accent/40 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "1s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center backdrop-blur-sm">
                      <Radar className="h-8 w-8 text-accent animate-pulse" />
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white mb-2">Scanning Package</h2>
                <p className="text-sm text-white/40 mb-8">Connecting to USPS servers...</p>

                {/* Tracking number pill */}
                <div className="relative bg-white/[0.06] backdrop-blur-xl rounded-2xl px-6 py-4 overflow-hidden border border-white/[0.08]">
                  <p className="font-mono text-sm text-white/80 relative z-10 tracking-wider">{number}</p>
                  <div className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-accent/20 to-transparent scan-line" />
                </div>

                {/* Progress */}
                <div className="mt-8 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full progress-fill" style={{ width: "85%" }} />
                </div>
                <p className="text-[11px] text-white/25 mt-3">Retrieving real-time tracking data...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ═══════════ ERROR STATE ═══════════ */
  if (!tracking || apiError) {
    const errorInfo = getErrorInfo(apiError || '', number || '');
    const ErrorIcon = errorInfo.icon;
    
    return (
      <Layout>
        <SEOHead title={`Track ${number} - USPS Tracking`} description={`Track USPS package ${number}`} canonical={`/track/${number}`} />
        <div className="container py-12 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group">
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Track Another Package
          </Link>
          
          <div className="relative bg-card border border-border/40 rounded-3xl overflow-hidden">
            <div className={`h-1 w-full bg-gradient-to-r ${
              errorInfo.type === 'not-found' ? 'from-muted-foreground/20 via-muted-foreground/30 to-muted-foreground/20' :
              errorInfo.type === 'rate-limit' ? 'from-warning/60 via-warning to-warning/60' :
              'from-destructive/60 via-destructive to-destructive/60'
            }`} />
            
            <div className="p-8 text-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 ${
                errorInfo.type === 'not-found' ? 'bg-muted' : errorInfo.type === 'rate-limit' ? 'bg-warning/10' : 'bg-destructive/10'
              }`}>
                <ErrorIcon className={`h-9 w-9 ${
                  errorInfo.type === 'not-found' ? 'text-muted-foreground' : errorInfo.type === 'rate-limit' ? 'text-warning' : 'text-destructive'
                }`} />
              </div>
              
              <h2 className="text-xl font-black text-foreground mb-2">{errorInfo.title}</h2>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{errorInfo.message}</p>
              
              <div className="bg-muted/40 rounded-2xl px-5 py-3.5 mb-6 border border-border/40">
                <p className="font-mono text-sm text-foreground tracking-wider">{number}</p>
              </div>
              
              {errorInfo.type === 'not-found' && (
                <div className="bg-muted/20 rounded-2xl p-5 mb-5 text-left border border-border/30">
                  <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2"><Info size={14} className="text-accent" /> Helpful Tips</p>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Double-check the tracking number for typos</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> New shipments may take up to 24h to appear</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Pre-shipment labels show info only after first scan</li>
                  </ul>
                </div>
              )}
              {errorInfo.type === 'invalid' && (
                <div className="bg-muted/20 rounded-2xl p-5 mb-5 text-left border border-border/30">
                  <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2"><Info size={14} className="text-accent" /> Valid USPS Formats</p>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /><span><span className="font-mono text-foreground/80">9400 1118 9922 3033 0052 82</span> — Priority Mail</span></li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /><span><span className="font-mono text-foreground/80">9270 1900 0000 0000 0000 00</span> — Express</span></li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /><span><span className="font-mono text-foreground/80">EA 123456789 US</span> — International</span></li>
                  </ul>
                </div>
              )}
              {errorInfo.type === 'connection' && (
                <div className="bg-muted/20 rounded-2xl p-5 mb-5 text-left border border-border/30">
                  <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2"><Info size={14} className="text-accent" /> What to do</p>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Check your internet connection</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> USPS servers may be under maintenance</li>
                    <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" /> Try again in a few minutes</li>
                  </ul>
                </div>
              )}
              
              <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 rounded-2xl text-sm font-bold hover:shadow-[0_0_25px_hsl(160_84%_39%/0.3)] transition-all w-full justify-center active:scale-[0.98]">
                <Search className="h-4 w-4" /> Try Another Number
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  /* ═══════════ SUCCESS — TRACKING RESULTS ═══════════ */
  return (
    <Layout>
      <SEOHead
        title={`Track ${tracking.trackingNumber} - ${tracking.statusLabel}`}
        description={`Real-time tracking for USPS ${serviceInfo.service} shipment ${tracking.trackingNumber}. Current status: ${tracking.statusLabel}. ${serviceInfo.tip}`}
        canonical={`/track/${number}`}
      />

      {/* ═══ Premium Status Hero ═══ */}
      <div className="relative overflow-hidden border-b border-border/20">
        <div className="absolute inset-0 hero-gradient opacity-[0.97]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39%) 1px, transparent 1px), linear-gradient(90deg, hsl(160 84% 39%) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className={`absolute top-0 right-[10%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-[0.06] ${tracking.status === "delivered" ? "bg-success" : tracking.status === "out-for-delivery" ? "bg-warning" : "bg-info"}`} />

        <div className="relative container py-8 md:py-12 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-white/25 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/50">Track: {tracking.trackingNumber.slice(0, 10)}...</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              {/* Service badge */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                  <Box className="h-4 w-4 text-accent" />
                </div>
                <span className="text-[11px] font-bold text-white/40 uppercase tracking-[0.12em]">{serviceInfo.service} · USPS</span>
              </div>
              {/* Tracking number */}
              <div className="flex items-center gap-3">
                <h1 className="text-lg md:text-2xl font-black font-mono text-white tracking-tight">{tracking.trackingNumber}</h1>
                <button onClick={copyNumber} className="p-2 rounded-xl hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-all active:scale-95" aria-label="Copy">
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Status badge */}
            <div className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold ${statusColor.bg} ${statusColor.text} border ${statusColor.border} backdrop-blur-sm self-start`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusColor.dot}`} />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColor.dot}`} />
              </span>
              {tracking.statusLabel}
            </div>
          </div>

          {/* Delivery estimate */}
          <div className="mt-6 flex items-center gap-3 bg-white/[0.04] backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/[0.06] max-w-md">
            <div className="w-10 h-10 rounded-xl bg-accent/12 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Expected Delivery</p>
              <p className="font-bold text-white text-lg">{tracking.estimatedDelivery}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-5xl">
        {/* Progress Steps */}
        <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8 mb-6 fade-up">
          <TrackingProgress status={progressStatus} />
        </div>

        {/* ═══ Two-Column Layout ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipment Details */}
            <div className="bg-card border border-border/40 rounded-3xl overflow-hidden fade-up" style={{ animationDelay: "80ms" }}>
              <div className="px-6 py-4 border-b border-border/30 bg-muted/15">
                <h2 className="font-bold text-foreground text-sm flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-accent/8 flex items-center justify-center">
                    <Package className="h-3.5 w-3.5 text-accent" />
                  </div>
                  Shipment Details
                </h2>
              </div>
              <div className="p-6">
                {/* Route */}
                <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl bg-muted/20 border border-border/30">
                  <div className="text-center flex-1">
                    <div className="w-10 h-10 rounded-xl bg-info/8 flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-5 w-5 text-info" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Origin</p>
                    <p className="font-bold text-sm text-foreground mt-0.5">{tracking.origin}</p>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground/30 shrink-0">
                    <div className="w-3 h-px bg-border" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                    <div className="w-3 h-px bg-border" />
                    <Navigation className="h-4 w-4 text-accent/60 rotate-90" />
                    <div className="w-3 h-px bg-border" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                    <div className="w-3 h-px bg-border" />
                  </div>
                  <div className="text-center flex-1">
                    <div className="w-10 h-10 rounded-xl bg-success/8 flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-5 w-5 text-success" />
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Destination</p>
                    <p className="font-bold text-sm text-foreground mt-0.5">{tracking.destination}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Truck, label: "Service", value: tracking.shippingClass },
                    { icon: Scale, label: "Weight", value: tracking.weight },
                    { icon: Shield, label: "Insurance", value: "Up to $100" },
                  ].map((d, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-muted/20 border border-border/30 hover:border-accent/15 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                        <d.icon className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{d.label}</p>
                        <p className="font-bold text-sm text-foreground mt-0.5">{d.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border/40 rounded-3xl overflow-hidden fade-up" style={{ animationDelay: "160ms" }}>
              <div className="px-6 py-4 border-b border-border/30 bg-muted/15 flex items-center justify-between">
                <h2 className="font-bold text-foreground text-sm flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-accent/8 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-accent" />
                  </div>
                  Tracking History
                </h2>
                <span className="text-[10px] font-bold text-accent bg-accent/8 px-3 py-1 rounded-full uppercase tracking-wider">{tracking.events.length} updates</span>
              </div>
              <div className="p-6">
                <div className="space-y-0">
                  {tracking.events.map((event, i) => (
                    <div key={i} className="flex gap-4 relative group">
                      <div className="flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-2.5 transition-all ${
                          i === 0
                            ? "bg-accent ring-[5px] ring-accent/10"
                            : "bg-border group-hover:bg-muted-foreground/40"
                        }`} />
                        {i < tracking.events.length - 1 && (
                          <div className="w-px flex-1 bg-border/50 my-1.5" />
                        )}
                      </div>
                      <div className="pb-5 flex-1">
                        <div className={`rounded-2xl p-4 transition-all duration-200 ${i === 0 ? "bg-accent/5 border border-accent/10" : "hover:bg-muted/20 border border-transparent hover:border-border/30"}`}>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={`font-bold text-sm ${i === 0 ? "text-accent" : "text-foreground"}`}>
                              {event.status}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 font-mono whitespace-nowrap bg-muted/40 px-2 py-0.5 rounded-md">
                              {event.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{event.detail}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground/50">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                            <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-card border border-border/40 rounded-3xl p-6 fade-up" style={{ animationDelay: "240ms" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/8 flex items-center justify-center shrink-0">
                  <Info className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1.5">About {serviceInfo.service}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{serviceInfo.tip}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[
                      { to: "/guides/tracking-number-format", label: "Tracking Formats" },
                      { to: "/guides/informed-delivery", label: "Informed Delivery" },
                      { to: "/guides/tracking-not-updating", label: "Not Updating?" },
                    ].map((link) => (
                      <Link key={link.to} to={link.to} className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 bg-accent/5 px-3 py-1.5 rounded-lg transition-colors">
                        {link.label} <ChevronRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ReportIssue trackingNumber={tracking.trackingNumber} />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="bg-card border border-border/40 rounded-3xl p-5">
              <h3 className="font-bold text-sm text-foreground mb-4 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent/8 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-accent" />
                </div>
                Quick Actions
              </h3>
              <div className="space-y-1">
                {[
                  { to: "/guides/tracking-not-updating", label: "Tracking Not Updating?", icon: RotateCcw },
                  { to: "/status/in-transit-to-next-facility", label: 'Understanding "In Transit"', icon: Truck },
                  { to: "/#faq", label: "Tracking FAQ", icon: Info },
                ].map((item) => (
                  <Link key={item.to} to={item.to} className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-muted/40 transition-all group">
                    <item.icon className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-accent transition-colors" />
                  </Link>
                ))}
                <a href="https://www.usps.com/help/missing-mail.htm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-muted/40 transition-all group">
                  <ExternalLink className="h-4 w-4 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex-1">Report Missing Mail</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-accent transition-colors" />
                </a>
              </div>
            </div>

            {/* Track Another */}
            <div className="relative rounded-3xl border border-accent/15 bg-accent/5 p-6 text-center overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4 relative">
                <Package className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-bold text-foreground mb-1 relative">Track Another Package</h3>
              <p className="text-xs text-muted-foreground mb-5 relative">Enter a new USPS tracking number</p>
              <Link to="/" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-2xl text-sm font-bold hover:shadow-[0_0_25px_hsl(160_84%_39%/0.3)] transition-all active:scale-[0.98] relative">
                New Tracking <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>

        <InternalLinkingHub currentPath={`/track/${number}`} variant="compact" />
      </div>
    </Layout>
  );
};

export default TrackResult;