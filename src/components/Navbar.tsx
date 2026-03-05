import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Package, Truck, Globe, Building2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logoImg from "@/assets/logo.webp";

const popularCarriers = [
  { id: "usps", name: "USPS", icon: "🇺🇸" },
  { id: "fedex", name: "FedEx", icon: "📦" },
  { id: "ups", name: "UPS", icon: "📦" },
  { id: "dhl", name: "DHL", icon: "🟡" },
  { id: "china-post", name: "China Post", icon: "🇨🇳" },
  { id: "royal-mail", name: "Royal Mail", icon: "🇬🇧" },
  { id: "canada-post", name: "Canada Post", icon: "🇨🇦" },
  { id: "japan-post", name: "Japan Post", icon: "🇯🇵" },
  { id: "australia-post", name: "Australia Post", icon: "🇦🇺" },
  { id: "deutsche-post", name: "Deutsche Post", icon: "🇩🇪" },
  { id: "la-poste", name: "La Poste", icon: "🇫🇷" },
  { id: "correos-spain", name: "Correos", icon: "🇪🇸" },
  { id: "india-post", name: "India Post", icon: "🇮🇳" },
  { id: "korea-post", name: "Korea Post", icon: "🇰🇷" },
  { id: "singapore-post", name: "SingPost", icon: "🇸🇬" },
  { id: "postnl", name: "PostNL", icon: "🇳🇱" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCarriersOpen, setMobileCarriersOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Track" },
    { to: "/#faq", label: "FAQ" },
    { to: "/status/in-transit-to-next-facility", label: "Statuses" },
    { to: "/locations/new-york-ny", label: "Locations" },
    { to: "/guides", label: "Guides" },
    { to: "/knowledge-center", label: "Knowledge Center" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass-dark shadow-lg shadow-black/10" : "bg-primary"} border-b border-white/[0.06]`}>
      <div className="container flex items-center justify-between h-16 px-3 sm:px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center -mr-1">
            <img src={logoImg} alt="US Postal Tracking" className="w-11 h-11 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[15px] tracking-tight text-white leading-tight">
              US Postal <span className="text-accent">Tracking</span>
            </span>
            <span className="text-[10px] text-white/40 font-medium tracking-wider uppercase">Package & Mail Tracker</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {links.slice(0, 2).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}

          {/* Carriers Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200 flex items-center gap-1.5"
            >
              Carriers <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[360px] bg-popover text-popover-foreground rounded-2xl border shadow-2xl shadow-black/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b bg-accent/5">
                  <Link
                    to="/tracking"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 text-sm font-bold text-accent hover:text-accent/80 transition-colors"
                  >
                    <Globe className="h-4.5 w-4.5" /> Browse All 200+ Carriers →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-0.5 p-2 max-h-80 overflow-y-auto">
                  {popularCarriers.map((c) => (
                    <Link
                      key={c.id}
                      to={`/tracking/${c.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-sm rounded-xl hover:bg-accent/8 transition-all duration-150 group/item"
                    >
                      <span className="text-lg">{c.icon}</span>
                      <span className="font-medium text-foreground group-hover/item:text-accent transition-colors">{c.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {links.slice(2).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3.5 py-2 rounded-lg text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-xl text-white/80 hover:bg-white/[0.06] transition-colors" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <nav className="lg:hidden bg-primary/95 backdrop-blur-xl border-t border-white/[0.06] pb-4 animate-in slide-in-from-top-2 duration-200">
          {links.slice(0, 2).map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all">
              {l.label}
            </Link>
          ))}

          {/* Mobile Carriers Accordion */}
          <button
            onClick={() => setMobileCarriersOpen(!mobileCarriersOpen)}
            className="w-full flex items-center justify-between px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Carriers
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileCarriersOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileCarriersOpen && (
            <div className="bg-white/[0.03] px-4 py-2 space-y-0.5">
              <Link to="/tracking" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm text-accent font-bold">
                All 200+ Carriers →
              </Link>
              {popularCarriers.slice(0, 10).map((c) => (
                <Link
                  key={c.id}
                  to={`/tracking/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
                >
                  <span>{c.icon}</span> {c.name}
                </Link>
              ))}
            </div>
          )}

          {links.slice(2).map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
