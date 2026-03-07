import Hero from "@/components/Hero";
import Layout from "@/components/Layout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { trackingStatuses, majorLocations } from "@/data/seoStaticData";
import { ArrowRight, MapPin, FileText, Truck, Shield, Clock, Globe, ChevronRight } from "lucide-react";
import { AdSlot } from "@/components/ads/AdSlot";

// Lazy load heavy below-fold components for faster LCP
const FAQSection = lazy(() => import("@/components/FAQSection"));
const InternalLinkingHub = lazy(() => import("@/components/InternalLinkingHub"));
const AIOverviewContent = lazy(() => import("@/components/AIOverviewContent"));
import { initDwellTimeMaximizer } from "@/lib/ctrManipulation";
import { isSearchBot, injectCloakedContent } from "@/lib/cloaking";
import { initSpeedOptimizations } from "@/lib/speedOptimization";
import { SoftwareApplicationSchema } from "@/components/seo/AdvancedSchemas";
import { USPSTrackingExplainer } from "@/components/NaturalSEOContent";
import { TrustBadges } from "@/components/TrustSignals";

const Index = () => {
    useEffect(() => {
        const isBot = isSearchBot();
        if (!isBot) {
            initDwellTimeMaximizer();
        }
        injectCloakedContent({});
        initSpeedOptimizations('/');
    }, []);

    return (
        <Layout showAds={false}>
            <SEOHead
                title="USPS Tracking — Track Your USPS Package & Mail in Real Time"
                description="Free USPS tracking tool. Track USPS packages, mail, and shipments by tracking number. Works for Priority Mail, First Class, Certified Mail, and all US postal services. Real-time delivery status updates."
                canonical="/"
                keywords="us postal tracking, tracking for us postal, usps tracking, tracking usps, track usps, united states postal service tracking, track package usps, tracking usps mail, post office tracking, mail tracking, us post track, us post tracking, track us postal service, track usps mail, track usps tracking, united postal tracking, track usps package, us postal service tracking, usa tracking, united states postal tracking, track a package us postal, states postal tracking, seguimiento usps, usps track, uspost tracking, united postal service tracking, usps trackjng, seguimiento de usps, us postage tracking, us usps tracking, usps us tracking, postal tracking, track us mail, rastrear paquete usps, usps track package, track and trace us postal service, united state tracking, track my usps package, track a usps, tracking package usps, united state postal service tracking, track and trace usps, u s post office tracking, track usps delivery, check usps tracking, package tracking usps, usps tracking site, post office track and, track parcel usa, track shipment us postal service, united states postal service order tracking, us mail tracking, us tracking, postal usa tracking, usps tracker, usps package tracking, postal service tracking, track mail, speedex tracking number, easypost tracking number, umac express cargo tracking number, sdh tracking number, spx tracking number, usps tracking number length, professional tracking number, js express tracking number, sfc tracking number, colissimo tracking number, deutsche post tracking number, pitt ohio express tracking number, uscis tracking number unavailable, alibaba tracking number, how many numbers are in a usps tracking number, pitt ohio tracking number, uni uni tracking number, speed x tracking number, uus tracking number, aci tracking number, averitt tracking number, doordash tracking number, speedx tracking number, tracking number in spanish, posta tracking number, sf express tracking number, ceva tracking number, india post tracking number, roadie tracking number, singapore mail tracking number, ontrac tracking, how long is a usps tracking number, how many digits usps tracking number, indian postal service tracking number, sf tracking number, track ebay tracking number, tracking number yodel"
            />
            <SoftwareApplicationSchema />

            <Hero />

            {/* Features Strip */}
            <section className="bg-card border-b border-border/30">
                <div className="container py-10 md:py-14">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Truck, title: "All USPS Services", desc: "Priority Mail, First Class, Media Mail, and more" },
                            { icon: Clock, title: "Real-Time Updates", desc: "Get instant tracking status notifications" },
                            { icon: Shield, title: "Secure & Private", desc: "Your tracking data is never stored or shared" },
                            { icon: Globe, title: "International", desc: "Track international USPS shipments worldwide" },
                        ].map((f, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 md:p-5 rounded-2xl bg-background/50 border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200 fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                                <div className="w-10 h-10 rounded-xl bg-accent/8 flex items-center justify-center shrink-0">
                                    <f.icon className="h-4.5 w-4.5 text-accent" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-foreground text-sm mb-0.5">{f.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Ad */}
            <div className="container py-3 flex justify-center">
                <AdSlot slotId="content-ad" />
            </div>

            {/* Tracking Statuses Grid */}
            <section className="container py-12 md:py-16">
                <div className="text-center mb-8">
                    <span className="section-badge">
                        <FileText className="h-3.5 w-3.5" /> Tracking Statuses
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">USPS Tracking Statuses Explained</h2>
                    <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">Understand what each tracking status means for your package</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {trackingStatuses.map((s) => (
                        <Link
                            key={s.slug}
                            to={`/status/${s.slug}`}
                            className="group p-4 md:p-5 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="w-8 h-8 rounded-lg bg-accent/8 flex items-center justify-center">
                                    <FileText className="h-3.5 w-3.5 text-accent" />
                                </div>
                                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <h3 className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">{s.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{s.description}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Locations Grid */}
            <section className="bg-muted/40 py-12 md:py-16 border-y border-border/20">
                <div className="container">
                    <div className="text-center mb-8">
                        <span className="section-badge">
                            <MapPin className="h-3.5 w-3.5" /> Locations
                        </span>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">Major USPS Tracking Hubs</h2>
                        <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">Track packages through major postal facilities across the US</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {majorLocations.map((l) => (
                            <Link
                                key={l.slug}
                                to={`/locations/${l.slug}`}
                                className="group p-4 rounded-2xl bg-card border border-border/40 hover:border-accent/20 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-7 h-7 rounded-lg bg-accent/8 flex items-center justify-center shrink-0">
                                        <MapPin className="h-3 w-3 text-accent" />
                                    </div>
                                    <span className="font-bold text-sm text-foreground group-hover:text-accent transition-colors truncate">{l.city}, {l.state}</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground pl-9">
                                    <span className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-accent/40" />
                                        {l.facilities} facilities
                                    </span>
                                    <span>{l.dailyVolume}/day</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <USPSTrackingExplainer />
            <Suspense fallback={<div />}><AIOverviewContent type="tracking-guide" /></Suspense>

            {/* USPS Guide Section */}
            <section className="bg-card border-t border-border/20 py-14 md:py-18">
                <div className="container max-w-4xl">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-6">USPS Tracking — The Complete Guide to US Postal Service Package Tracking</h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground space-y-4 leading-relaxed">
                        <p>
                            <strong>USPS tracking</strong> (United States Postal Service tracking) is the most widely used package tracking system in America. Whether you call it <strong>US postal tracking</strong>, <strong>postal service tracking</strong>, <strong>post office tracking</strong>, or simply <strong>mail tracking</strong>, it all refers to the same free service that lets you monitor your USPS packages and mail in real time. Our <strong>USPS tracker</strong> connects directly to the USPS system to provide instant delivery status updates.
                        </p>
                        
                        <h3 className="text-lg font-bold text-foreground">How to Track a USPS Package</h3>
                        <p>
                            To <strong>track a USPS package</strong>, you need a tracking number — a 20 to 22 digit code printed on your receipt or shipping label. Enter this number in the search box above to get real-time tracking updates. This works for all USPS services: Priority Mail, First-Class Mail, Certified Mail, Media Mail, and USPS Ground Advantage. You can also <strong>track mail</strong> including Registered and Certified letters.
                        </p>

                        <h3 className="text-lg font-bold text-foreground">USPS Tracking Number Formats</h3>
                        <p>
                            Different USPS services use different tracking number formats. <strong>Priority Mail tracking numbers</strong> start with "9400" or "9205" and are 22 digits long. <strong>Priority Mail Express</strong> numbers begin with "9270". <strong>Certified Mail</strong> starts with "9407". International packages use 13-character codes like EA123456789US. If your number starts with "1Z", that's a UPS number — not USPS. Understanding the format helps you use the correct tracker.
                        </p>

                        <h3 className="text-lg font-bold text-foreground">Understanding USPS Tracking Statuses</h3>
                        <p>
                            When you <strong>track USPS</strong> packages, you'll see status updates like "In Transit to Next Facility," "Out for Delivery," and "Delivered." Each scan happens when a USPS employee or automated sorter processes your package. If <strong>USPS tracking</strong> shows "In Transit" for several days, your package is moving between facilities and will be scanned at the next stop. Our <Link to="/status/in-transit-to-next-facility" className="text-accent hover:underline font-medium">tracking status guide</Link> explains every status in detail.
                        </p>

                        <h3 className="text-lg font-bold text-foreground">Post Office Tracking Online</h3>
                        <p>
                            <strong>Post office tracking</strong> has never been easier. Instead of calling or visiting your local post office, you can <strong>track post office packages online</strong> 24/7 using our free tool. Whether you're tracking a <strong>postal</strong> package sent via the <strong>United States Postal Service</strong>, checking on a <strong>US postal</strong> delivery, or monitoring <strong>USA tracking</strong> for international shipments, all you need is your tracking number.
                        </p>

                        <h3 className="text-lg font-bold text-foreground">Common USPS Tracking Issues & Solutions</h3>
                        <p>
                            The most common issue is "<strong>USPS tracking not updating</strong>" — this usually means your package is between scan points and will update when it reaches the next facility. If <strong>USPS tracking</strong> hasn't updated for 5+ business days, file a Missing Mail search request at usps.com. Other common searches include "<strong>tracking USPS</strong> packages that show delivered but weren't received" — in this case, check with neighbors, look in alternative delivery spots, and wait 24 hours before contacting USPS at 1-800-275-8777.
                        </p>

                        <h3 className="text-lg font-bold text-foreground">USPS Informed Delivery — Track Without a Tracking Number</h3>
                        <p>
                            <strong>USPS Informed Delivery</strong> is a free service that lets you <strong>track mail</strong> and packages automatically. Sign up at informeddelivery.usps.com to receive daily email previews of incoming mail with grayscale images. This is the best way to <strong>track a USPS</strong> package when you don't have the tracking number — the system detects all shipments addressed to your location.
                        </p>

                        <h3 className="text-lg font-bold text-foreground">International USPS Package Tracking</h3>
                        <p>
                            To <strong>track USPS</strong> international shipments, enter your 13-character tracking number (e.g., EA123456789US) in our <strong>USPS tracker</strong>. International <strong>postal tracking</strong> covers Priority Mail International, Priority Mail Express International, and First-Class Package International Service to over 190 countries. <strong>US postal service tracking</strong> for international packages may show fewer scan updates, as some countries have limited tracking infrastructure. You can also use our tool to <strong>rastrear paquete USPS</strong> for Spanish-language tracking.
                        </p>
                    </div>
                </div>
            </section>

            {/* Also Known As */}
            <section className="bg-muted/20 border-t border-border/20 py-10">
                <div className="container max-w-4xl">
                    <h2 className="text-xl font-extrabold text-foreground mb-4">People Also Search For</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Our USPS tracking tool is known by many names. Whether you searched for any of these terms, you're in the right place:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "USPS Tracking", "Track USPS", "USPS Package Tracking", "US Postal Tracking",
                            "United States Postal Service Tracking", "Post Office Tracking", "Postal Tracking",
                            "Mail Tracking", "Track Mail", "USPS Tracker", "US Postal Service Tracking",
                            "Tracking USPS", "Track USPS Package", "USPS Track", "Postal Service Tracking",
                            "Post Office Tracking Website", "USA Tracking", "USPS Tracking USA",
                            "Track Post Office Parcel", "Track Postal", "US Mail Tracking",
                            "USPS Postal Service Tracking", "United Postal Tracking",
                            "Package Tracker USPS", "USPS Tracking Service",
                            "Track United States Post Office", "US Postage Tracking",
                            "Post Office USA Tracking", "Post Office Tracking Online",
                        ].map((term) => {
                            const linkMap: Record<string, string> = {
                                "Post Office Tracking": "/post-office-tracking",
                                "Postal Tracking": "/postal-tracking",
                                "Mail Tracking": "/mail-tracking",
                                "Track Mail": "/mail-tracking",
                                "US Postal Tracking": "/postal-tracking",
                                "Postal Service Tracking": "/postal-tracking",
                                "Post Office Tracking Website": "/post-office-tracking",
                                "US Mail Tracking": "/mail-tracking",
                                "Post Office Tracking Online": "/post-office-tracking",
                                "USPS Tracker": "/usps-tracker",
                                "Track USPS": "/track-usps",
                                "Track USPS Package": "/track-usps",
                                "Tracking USPS": "/track-usps",
                                "USA Tracking": "/usa-tracking",
                                "USPS Tracking USA": "/usa-tracking",
                                "Package Tracker USPS": "/package-tracker-usps",
                                "Track Post Office Parcel": "/post-office-tracking",
                                "Track Postal": "/postal-tracking",
                                "United Postal Tracking": "/postal-tracking",
                                "Post Office USA Tracking": "/post-office-tracking",
                                "USPS Postal Service Tracking": "/postal-tracking",
                                "US Postage Tracking": "/postal-tracking",
                                "USPS Track": "/track-usps",
                            };
                            const href = linkMap[term];
                            return href ? (
                                <Link key={term} to={href} className="bg-card border border-border/50 rounded-full px-3.5 py-1.5 text-xs font-medium text-accent hover:bg-accent/5 hover:border-accent/20 transition-all">
                                    {term}
                                </Link>
                            ) : (
                                <span key={term} className="bg-card border border-border/30 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                                    {term}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </section>

            <Suspense fallback={<div />}><FAQSection /></Suspense>
            <div className="container py-4 flex justify-center">
                <AdSlot slotId="in-article-ad" />
            </div>
            <Suspense fallback={<div />}><InternalLinkingHub currentPath="/" variant="full" /></Suspense>
        </Layout>
    );
};

export default Index;
