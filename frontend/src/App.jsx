import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ─── Icons (inline SVG components) ────────────────────────────────────────────
const Icon = ({ d, size = 16, strokeWidth = 1.8, fill = "none", className = "", viewBox = "0 0 24 24" }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const Icons = {
  Globe: (p) => <Icon {...p} d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />,
  Sparkles: (p) => <Icon {...p} d={["M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z", "M19 3l.8 2.2L22 6l-2.2.8L19 9l-.8-2.2L16 6l2.2-.8z", "M5 17l.8 2.2L8 20l-2.2.8L5 23l-.8-2.2L2 20l2.2-.8z"]} />,
  Map: (p) => <Icon {...p} d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z M9 3v15 M15 6v15" />,
  Compass: (p) => <Icon {...p} d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"]} />,
  MapPin: (p) => <Icon {...p} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" stroke="none" />,
  Calendar: (p) => <Icon {...p} d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18" />,
  Clock: (p) => <Icon {...p} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />,
  Sun: (p) => <Icon {...p} d={["M12 17c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z", "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"]} />,
  Moon: (p) => <Icon {...p} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" stroke="none" />,
  Coffee: (p) => <Icon {...p} d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />,
  Sunset: (p) => <Icon {...p} d={["M17 18a5 5 0 0 0-10 0", "M12 9V2", "M4.22 10.22l1.42 1.42", "M1 18h2", "M21 18h2", "M18.36 11.64l1.42-1.42", "M23 22H1", "M16 5l-4 4-4-4"]} />,
  Plane: (p) => <Icon {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  Search: (p) => <Icon {...p} d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />,
  ChevronDown: (p) => <Icon {...p} d="M6 9l6 6 6-6" />,
  ChevronUp: (p) => <Icon {...p} d="M18 15l-6-6-6 6" />,
  ArrowLeft: (p) => <Icon {...p} d="M19 12H5M12 19l-7-7 7-7" />,
  ArrowRight: (p) => <Icon {...p} d="M5 12h14M12 5l7 7-7 7" />,
  DollarSign: (p) => <Icon {...p} d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  BookOpen: (p) => <Icon {...p} d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />,
  AlertTriangle: (p) => <Icon {...p} d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />,
  CheckCircle: (p) => <Icon {...p} d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />,
  Info: (p) => <Icon {...p} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" />,
  Bell: (p) => <Icon {...p} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />,
  WifiOff: (p) => <Icon {...p} d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />,
  Loader: (p) => <Icon {...p} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />,
  Menu: (p) => <Icon {...p} d="M3 12h18M3 6h18M3 18h18" />,
  X: (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12" />,
  Send: (p) => <Icon {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  Shield: (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  Star: (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" fill="currentColor" stroke="none" />,
  Twitter: (p) => <Icon {...p} d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />,
  Instagram: (p) => <Icon {...p} d={["M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z", "M17.5 6.5h.01"]} viewBox="0 0 24 24" />,
  Github: (p) => <Icon {...p} d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  Briefcase: (p) => <Icon {...p} d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />,
  BarChart: (p) => <Icon {...p} d="M18 20V10M12 20V4M6 20v-6" />,
  Newspaper: (p) => <Icon {...p} d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8z" />,
  LifeBuoy: (p) => <Icon {...p} d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M14.83 9.17l3.53-3.53M4.93 19.07l4.24-4.24"]} />,
  Smartphone: (p) => <Icon {...p} d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01" />,
};

// ─── Static data ──────────────────────────────────────────────────────────────
const STYLE_OPTIONS = [
  { value: "cultural", label: "Cultural", icon: "🏛️", desc: "Museums & heritage" },
  { value: "adventure", label: "Adventure", icon: "🏕️", desc: "Hiking & outdoors" },
  { value: "relaxation", label: "Relaxation", icon: "🧘", desc: "Spas & leisure" },
  { value: "food", label: "Food & Drink", icon: "🍽️", desc: "Markets & tastings" },
];

const BUDGET_OPTIONS = [
  { value: "budget", label: "Budget", icon: "💵", desc: "Free & low-cost" },
  { value: "moderate", label: "Moderate", icon: "💳", desc: "Mid-range comfort" },
  { value: "luxury", label: "Luxury", icon: "💎", desc: "Premium everything" },
];

const SLOT_CONFIG = {
  morning: { Icon: Icons.Coffee, label: "Morning", bg: "#FFF8ED", border: "#F59E0B33", badge: "#FEF3C7", badgeText: "#92400E", title: "#B45309" },
  afternoon: { Icon: Icons.Sunset, label: "Afternoon", bg: "#FFF5ED", border: "#FB923C33", badge: "#FED7AA", badgeText: "#9A3412", title: "#C2410C" },
  evening: { Icon: Icons.Moon, label: "Evening", bg: "#F5F3FF", border: "#8B5CF633", badge: "#EDE9FE", badgeText: "#4C1D95", title: "#7C3AED" },
};

const NAV_LINKS = [
  { label: "Explore", Icon: Icons.Globe },
  { label: "My Trips", Icon: Icons.Map },
  { label: "Destinations", Icon: Icons.Compass },
  { label: "AI Planner", Icon: Icons.Sparkles, badge: "New" },
  { label: "Guides", Icon: Icons.BookOpen },
];

const FOOTER_COLS = [
  { title: "Product", links: [{ label: "AI Planner", Icon: Icons.Sparkles }, { label: "Destinations", Icon: Icons.Map }, { label: "Trip Calendar", Icon: Icons.Calendar }, { label: "Weather", Icon: Icons.Sun }, { label: "Mobile App", Icon: Icons.Smartphone, badge: "Soon" }] },
  { title: "Resources", links: [{ label: "Travel Guides", Icon: Icons.BookOpen }, { label: "Community", Icon: Icons.Globe }, { label: "Changelog", Icon: Icons.BarChart }, { label: "Help Center", Icon: Icons.LifeBuoy }] },
  { title: "Company", links: [{ label: "About", Icon: Icons.Info }, { label: "Careers", Icon: Icons.Briefcase }, { label: "Blog", Icon: Icons.Newspaper }, { label: "Contact", Icon: Icons.Send }, { label: "Privacy", Icon: Icons.Shield }] },
];

const SAMPLE_RESULT = {
  itinerary: {
    destination: "Paris, France",
    duration: 3,
    travel_style: "cultural",
    budget: "moderate",
    tips: [
      "Buy a carnet of 10 metro tickets to save money on public transport.",
      "Most museums are free on the first Sunday of each month.",
      "Book restaurants at least a week in advance for popular spots.",
      "Carry a reusable water bottle — Paris tap water is excellent and free.",
    ],
    days: [
      {
        day_number: 1, theme: "Historic Heart of Paris", date: "2026-06-01",
        morning: { activity_name: "Eiffel Tower & Champ de Mars", description: "Arrive early to beat crowds at the iconic tower. Explore the surrounding park and enjoy views of the Seine from Trocadéro.", is_indoor: false, source: "Wikivoyage Paris" },
        afternoon: { activity_name: "Louvre Museum", description: "Spend the afternoon in the world's largest art museum. Focus on the highlights: the Winged Victory, Venus de Milo, and of course the Mona Lisa.", is_indoor: true, source: "Wikivoyage Paris" },
        evening: { activity_name: "Dinner in Le Marais", description: "Explore the vibrant Le Marais district. Try traditional French bistro cuisine at one of many excellent restaurants lining the cobblestone streets.", is_indoor: true, source: "Wikivoyage Paris" },
      },
      {
        day_number: 2, theme: "Montmartre & Bohemian Paris", date: "2026-06-02",
        morning: { activity_name: "Sacré-Cœur & Montmartre Village", description: "Wander the bohemian hilltop neighbourhood of Montmartre, visiting the stunning basilica and exploring Place du Tertre with its street artists.", is_indoor: false, source: "Wikivoyage Paris" },
        afternoon: { activity_name: "Musée d'Orsay", description: "Home to the world's greatest Impressionist collection, housed in a magnificent former railway station. Monet, Renoir, and Degas await.", is_indoor: true, source: "Wikivoyage Paris" },
        evening: { activity_name: "Seine River Cruise", description: "End the day with a romantic evening cruise along the Seine, watching the city's monuments illuminate as dusk falls over Paris.", is_indoor: false, source: "Wikivoyage Paris" },
      },
      {
        day_number: 3, theme: "Royal Versailles & Local Markets", date: "2026-06-03",
        morning: { activity_name: "Palace of Versailles", description: "Day trip to the opulent Palace of Versailles. The Hall of Mirrors and the sprawling French formal gardens are unmissable.", is_indoor: false, source: "Wikivoyage Versailles" },
        afternoon: { activity_name: "Marché d'Aligre", description: "Return to Paris and browse the vibrant Marché d'Aligre, one of the city's most authentic covered markets with fresh produce and local cheese.", is_indoor: true, source: "Wikivoyage Paris" },
        evening: { activity_name: "Farewell Dinner at Brasserie Lipp", description: "Enjoy a classic French brasserie dinner at one of Saint-Germain-des-Prés' most historic establishments.", is_indoor: true, source: "Wikivoyage Paris" },
      },
    ],
  },
  weather: [
    { date: "2026-06-01", emoji: "☀️", temp_max: 24, temp_min: 15, is_rainy: false },
    { date: "2026-06-02", emoji: "⛅", temp_max: 21, temp_min: 13, is_rainy: false },
    { date: "2026-06-03", emoji: "🌧️", temp_max: 17, temp_min: 11, is_rainy: true },
  ],
  context_sources: ["Wikivoyage Paris", "Wikivoyage Versailles", "Lonely Planet France"],
  has_indexed_docs: true,
};

function fmtDate(dateStr, opts) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en", opts);
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ apiStatus = "ok" }) {
  const [active, setActive] = useState("AI Planner");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(248,245,240,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", gap: 28 }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "#1C1917", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.Globe size={16} style={{ color: "white" }} />
          </div>
          <span style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 700, color: "#1C1917", letterSpacing: -0.5 }}>
            Voyage<span style={{ color: "#F59E0B" }}>.</span>
          </span>
        </a>

        <div style={{ width: 1, height: 24, background: "rgba(28,25,23,0.1)", flexShrink: 0, display: window.innerWidth < 768 ? "none" : "block" }} className="hidden-mobile" />

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }} className="desktop-nav">
          {NAV_LINKS.map(({ label, Icon, badge }) => (
            <button key={label} onClick={() => setActive(label)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, background: active === label ? "rgba(28,25,23,0.07)" : "transparent", color: active === label ? "#1C1917" : "#65605A", transition: "all 0.15s" }}>
              <Icon size={13} />
              {label}
              {badge && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A" }}>{badge}</span>}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginLeft: "auto" }} className="desktop-right">
          {/* Status */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500 }}>
            {apiStatus === "ok" && <><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", display: "inline-block" }} /><span style={{ color: "#10B981" }}>Live</span></>}
            {apiStatus === "error" && <><Icons.WifiOff size={11} style={{ color: "#F43F5E" }} /><span style={{ color: "#F43F5E" }}>Offline</span></>}
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(28,25,23,0.1)" }} />
          <button aria-label="Notifications" style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(28,25,23,0.1)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", color: "#65605A" }}>
            <Icons.Bell size={14} />
            <span style={{ position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", border: "1.5px solid #F8F5F0" }} />
          </button>
          <button aria-label="Search" style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(28,25,23,0.1)", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#65605A" }}>
            <Icons.Search size={14} />
          </button>
          <div style={{ width: 1, height: 20, background: "rgba(28,25,23,0.1)" }} />
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1C1917", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, cursor: "pointer", userSelect: "none" }}>JD</div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, border: "none", background: "#1C1917", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            <Icons.Plane size={13} /> Plan trip
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(o => !o)} style={{ display: "none", width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(28,25,23,0.1)", background: "white", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#65605A", marginLeft: "auto" }} className="mobile-menu-btn">
          {mobileOpen ? <Icons.X size={15} /> : <Icons.Menu size={15} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ borderTop: "1px solid rgba(28,25,23,0.07)", background: "#F8F5F0", padding: "12px 16px" }}>
          {NAV_LINKS.map(({ label, Icon, badge }) => (
            <button key={label} onClick={() => { setActive(label); setMobileOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, marginBottom: 4, background: active === label ? "rgba(28,25,23,0.07)" : "transparent", color: active === label ? "#1C1917" : "#65605A", textAlign: "left" }}>
              <Icon size={15} />{label}
              {badge && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: "#FEF3C7", color: "#92400E" }}>{badge}</span>}
            </button>
          ))}
          <div style={{ borderTop: "1px solid rgba(28,25,23,0.07)", paddingTop: 12, marginTop: 8 }}>
            <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 10, border: "none", background: "#1C1917", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Icons.Plane size={14} /> Plan a trip
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── WeatherStrip ─────────────────────────────────────────────────────────────
function WeatherStrip({ weather }) {
  if (!weather?.length) return null;
  return (
    <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "24px 28px", marginBottom: 16 }}>
      <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E", marginBottom: 20 }}>
        <Icons.Sun size={11} style={{ color: "#FBBF24" }} /> 7-Day Forecast
      </p>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(weather.length, 7)}, 1fr)`, gap: 8 }}>
        {weather.map((day, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderRadius: 14, padding: "12px 8px", border: `1px solid ${day.is_rainy ? "#BAE6FD" : "rgba(28,25,23,0.06)"}`, background: day.is_rainy ? "#F0F9FF" : "#F8F5F0" }}>
            <span style={{ fontSize: 10, color: "#A89A8E", fontWeight: 500 }}>{fmtDate(day.date, { weekday: "short" })}</span>
            <span style={{ fontSize: 22 }}>{day.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917" }}>{day.temp_max}°</span>
            <span style={{ fontSize: 10, color: "#A89A8E" }}>{day.temp_min}°</span>
            {day.is_rainy && <span style={{ fontSize: 9, background: "#E0F2FE", color: "#0284C7", padding: "2px 6px", borderRadius: 99, fontWeight: 600 }}>Rain</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ActivitySlot ─────────────────────────────────────────────────────────────
function ActivitySlot({ slot, data, isRainy }) {
  const [open, setOpen] = useState(true);
  if (!data) return null;
  const cfg = SLOT_CONFIG[slot];

  return (
    <div style={{ borderRadius: 14, border: `1px solid ${cfg.border}`, background: cfg.bg, overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: cfg.badge, color: cfg.badgeText }}>
            <cfg.Icon size={10} /> {cfg.label}
          </span>
          {data.is_indoor && <span style={{ fontSize: 10, background: "#F0EBE3", color: "#6B5D52", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>🏠 Indoor</span>}
          {isRainy && !data.is_indoor && <span style={{ fontSize: 10, background: "#F0F9FF", color: "#0284C7", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>🌧 Rain alert</span>}
        </div>
        <span style={{ color: "#A89A8E", flexShrink: 0 }}>{open ? <Icons.ChevronUp size={13} /> : <Icons.ChevronDown size={13} />}</span>
      </button>
      <div style={{ padding: "0 16px 4px" }}>
        <h4 style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.4, color: cfg.title, margin: "0 0 8px" }}>{data.activity_name}</h4>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px" }}>
          <p style={{ fontSize: 13, color: "#65605A", lineHeight: 1.6, margin: 0 }}>{data.description}</p>
          {data.source && data.source !== "Unknown" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <Icons.BookOpen size={10} style={{ color: "#A89A8E", flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: "#A89A8E" }}>Source: {data.source}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DayCard ─────────────────────────────────────────────────────────────────
function DayCard({ day, weatherDay, index }) {
  const [expanded, setExpanded] = useState(index === 0);
  const isRainy = weatherDay?.is_rainy || false;

  return (
    <div style={{ background: "white", borderRadius: 20, border: `1px solid ${isRainy ? "#BAE6FD" : "rgba(28,25,23,0.07)"}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(28,25,23,0.04), 0 4px 16px rgba(28,25,23,0.04)", transition: "all 0.3s" }}>
      <button onClick={() => setExpanded(e => !e)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", textAlign: "left", background: isRainy ? "#F0F9FF" : "white", border: "none", cursor: "pointer" }}>
        <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, rgba(28,25,23,0.1), rgba(28,25,23,0.2))", border: "1px solid rgba(28,25,23,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1C1917" }}>{day.day_number}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: "#1C1917", margin: 0, letterSpacing: -0.3 }}>{day.theme}</h3>
            {isRainy && <span style={{ fontSize: 11, color: "#0284C7", fontWeight: 500 }}>🌧️ Rain expected</span>}
          </div>
          <p style={{ fontSize: 12, color: "#A89A8E", margin: "3px 0 0", fontWeight: 400 }}>
            {day.date ? fmtDate(day.date, { weekday: "long", month: "long", day: "numeric" }) : `Day ${day.day_number}`}
          </p>
        </div>
        {weatherDay && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#A89A8E", flexShrink: 0 }}>
            <span style={{ fontSize: 18 }}>{weatherDay.emoji}</span>
            <span style={{ fontWeight: 600 }}>{weatherDay.temp_max}°</span>
            <span style={{ color: "#C9BFB5" }}>/</span>
            <span>{weatherDay.temp_min}°</span>
          </div>
        )}
        <span style={{ color: "#C9BFB5", flexShrink: 0 }}>{expanded ? <Icons.ChevronUp size={16} /> : <Icons.ChevronDown size={16} />}</span>
      </button>
      {expanded && (
        <div style={{ padding: "4px 20px 20px", borderTop: "1px solid rgba(28,25,23,0.05)", display: "flex", flexDirection: "column", gap: 10 }}>
          <ActivitySlot slot="morning" data={day.morning} isRainy={isRainy} />
          <ActivitySlot slot="afternoon" data={day.afternoon} isRainy={isRainy} />
          <ActivitySlot slot="evening" data={day.evening} isRainy={isRainy} />
        </div>
      )}
    </div>
  );
}

// ─── Tips & Sources ───────────────────────────────────────────────────────────
function TipsCard({ tips }) {
  if (!tips?.length) return null;
  return (
    <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "24px 28px" }}>
      <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E", marginBottom: 20 }}>
        <Icons.Sparkles size={11} style={{ color: "#FBBF24" }} /> Travel Tips
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
        {tips.map((tip, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "#65605A", lineHeight: 1.6 }}>
            <Icons.CheckCircle size={14} style={{ color: "#10B981", flexShrink: 0, marginTop: 2 }} />{tip}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourcesCard({ sources }) {
  if (!sources?.length) return null;
  return (
    <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "24px 28px" }}>
      <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E", marginBottom: 20 }}>
        <Icons.BookOpen size={11} /> Knowledge Sources
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {sources.map((s, i) => (
          <span key={i} style={{ padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 500, background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8" }}>📄 {s}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────
function LoadingOverlay() {
  const steps = ["Searching travel guides…", "Checking live weather…", "Crafting your itinerary…", "Almost there…"];
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t1 = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 1800);
    const t2 = setInterval(() => setDots(d => (d + 1) % 4), 400);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 32 }}>
      <div style={{ position: "relative" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", border: "2px solid #E4DDD4", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icons.Plane size={32} style={{ color: "#1C1917" }} />
        </div>
        <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2px solid rgba(251,191,36,0.3)", animation: "ping 1.5s infinite" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: "#1C1917", marginBottom: 8, letterSpacing: -1 }}>Crafting Your Trip</h3>
        <p style={{ fontSize: 14, color: "#A89A8E", fontWeight: 400 }}>{steps[step]}</p>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#FBBF24", animation: `bounce 0.8s ${i * 0.15}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = () => {
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer style={{ background: "#100E0B", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px 40px" }}>
        {/* Top grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.Globe size={15} style={{ color: "#FBBF24" }} />
              </div>
              <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "white" }}>Voyage<span style={{ color: "#FBBF24" }}>.</span></span>
            </div>
            <p style={{ fontSize: 13, color: "#65605A", lineHeight: 1.7, maxWidth: 220, marginBottom: 24, fontWeight: 400 }}>AI-powered itineraries grounded in real travel guides, with live weather built in.</p>
            <div style={{ display: "flex", gap: 8 }}>
              {[Icons.Twitter, Icons.Instagram, Icons.Github].map((SIcon, i) => (
                <button key={i} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#65605A" }}>
                  <SIcon size={13} />
                </button>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#47433E", marginBottom: 20 }}>{col.title}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map(({ label, Icon, badge }) => (
                  <li key={label}>
                    <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#65605A", textDecoration: "none", transition: "color 0.15s" }}>
                      <Icon size={12} style={{ opacity: 0.4 }} />{label}
                      {badge && <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99, background: "rgba(16,185,129,0.15)", color: "#34D399", border: "1px solid rgba(16,185,129,0.2)" }}>{badge}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div style={{ borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(251,191,36,0.8)", marginBottom: 6 }}>Stay in the loop</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 4 }}>Get destination ideas & travel tips weekly</p>
            <p style={{ fontSize: 12, color: "#47433E" }}>No spam. Unsubscribe anytime.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flex: "0 0 auto" }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubscribe()} placeholder="your@email.com" style={{ width: 220, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "white", outline: "none" }} />
            <button onClick={handleSubscribe} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: subscribed ? "#065F46" : "#F59E0B", color: subscribed ? "white" : "#1C1917", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              {subscribed ? <><Icons.CheckCircle size={13} /> Subscribed!</> : <><Icons.Send size={13} /> Subscribe</>}
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "#47433E" }}>© 2026 Voyage, Inc.</span>
            {["Terms", "Privacy", "Cookies", "Sitemap"].map(l => (
              <a key={l} href="#" style={{ fontSize: 12, color: "#47433E", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#47433E" }}>
              <Icons.CheckCircle size={11} style={{ color: "#10B981" }} /> All systems operational
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#47433E" }}>
              <Icons.Sparkles size={11} style={{ color: "#FBBF24" }} /> Powered by Claude
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Stats Strip ──────────────────────────────────────────────────────────────
function StatsStrip() {
  const stats = [{ value: "180+", label: "Destinations" }, { value: "4.9★", label: "Avg Rating" }, { value: "50k+", label: "Trips Planned" }, { value: "Live", label: "Weather Data" }];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: "white", borderRadius: 16, border: "1px solid rgba(28,25,23,0.07)", padding: "20px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1C1917", letterSpacing: -1, fontFamily: "Georgia, serif" }}>{s.value}</div>
          <div style={{ fontSize: 11, color: "#A89A8E", fontWeight: 500, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Featured Destinations ────────────────────────────────────────────────────
function FeaturedDestinations({ onSelect }) {
  const dests = [
    { name: "Paris", country: "France", emoji: "🗼", tag: "Romantic", color: "#FEF3C7" },
    { name: "Tokyo", country: "Japan", emoji: "⛩️", tag: "Cultural", color: "#E0F2FE" },
    { name: "New York", country: "USA", emoji: "🗽", tag: "Urban", color: "#F0FDF4" },
    { name: "Bali", country: "Indonesia", emoji: "🌴", tag: "Relax", color: "#FEF9C3" },
    { name: "Rome", country: "Italy", emoji: "🏛️", tag: "Historic", color: "#FEF2F2" },
    { name: "Dubai", country: "UAE", emoji: "🏙️", tag: "Luxury", color: "#F5F3FF" },
  ];
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E", marginBottom: 16 }}>Popular Destinations</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {dests.map(d => (
          <button key={d.name} onClick={() => onSelect(d.name + ", " + d.country)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(28,25,23,0.07)", background: d.color, cursor: "pointer", textAlign: "left", transition: "transform 0.15s, box-shadow 0.15s" }}>
            <span style={{ fontSize: 22 }}>{d.emoji}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917" }}>{d.name}</div>
              <div style={{ fontSize: 10, color: "#A89A8E" }}>{d.tag}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ destination: "", start_date: today, duration: 3, travel_style: "cultural", budget: "moderate" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    axios.get(`${API_BASE}/api/health`, { timeout: 4000 })
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("error"));
    axios.get(`${API_BASE}/api/destinations`, { timeout: 4000 })
      .then(r => setDestinations(r.data.destinations || []))
      .catch(() => { });
  }, []);

  const sliderPct = ((form.duration - 1) / 6) * 100;
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) { setError("Please enter a destination."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await axios.post(
        `${API_BASE}/api/itinerary`,
        { ...form, duration: parseInt(form.duration) },
        { timeout: 120000 }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8F5F0; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes ping { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.5);opacity:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input[type=range] { -webkit-appearance: none; height: 5px; border-radius: 99px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #1C1917; border: 3px solid white; box-shadow: 0 2px 8px rgba(28,25,23,0.28); cursor: pointer; }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .desktop-right { display: none !important; }
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .dest-grid { grid-template-columns: repeat(2,1fr) !important; }
          .style-grid { grid-template-columns: repeat(2,1fr) !important; }
          .tips-sources-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 38px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .footer-subscribe-row { flex-direction: column !important; }
          .footer-subscribe-inputs { width: 100% !important; }
          .footer-subscribe-inputs input { flex: 1 !important; }
        }
        @media (min-width: 768px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#F8F5F0", display: "flex", flexDirection: "column", fontFamily: "'system-ui', sans-serif" }}>
        {/* Ambient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -160, left: -160, width: 600, height: 600, borderRadius: "50%", background: "rgba(251,191,36,0.12)", filter: "blur(80px)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: 500, height: 500, borderRadius: "50%", background: "rgba(139,92,246,0.08)", filter: "blur(80px)" }} />
        </div>

        <Navbar apiStatus={apiStatus} />

        <main style={{ position: "relative", zIndex: 1, flex: 1 }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 80px" }}>

            {/* ── Hero ── */}
            {!result && !loading && (
              <section style={{ textAlign: "center", padding: "60px 0 48px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 99, background: "#FEF3C7", border: "1px solid #FDE68A", color: "#92400E", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 24 }}>
                  <Icons.Sparkles size={10} /> AI-Powered Travel Planner
                </div>
                <h1 className="hero-title" style={{ fontFamily: "Georgia, serif", fontSize: 58, fontWeight: 800, lineHeight: 1.05, color: "#1C1917", letterSpacing: -2, marginBottom: 20 }}>
                  Plan your perfect<br /><em style={{ color: "#D97706", fontStyle: "normal" }}>adventure</em>
                </h1>
                <p style={{ fontSize: 17, color: "#65605A", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7, fontWeight: 400 }}>
                  Personalised day-by-day itineraries grounded in real travel guides, with live weather forecasts to keep you prepared.
                </p>
                {/* Trust badges */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
                  {["🌍 180+ Destinations", "⚡ Generated in seconds", "🌤️ Live weather data", "✈️ 50k+ trips planned"].map(b => (
                    <span key={b} style={{ fontSize: 13, color: "#A89A8E", fontWeight: 500 }}>{b}</span>
                  ))}
                </div>
              </section>
            )}

            {/* ── Two-column layout when form showing ── */}
            {!result && !loading && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>
                {/* LEFT: Stats + Featured + Form */}
                <div>
                  <StatsStrip />
                  <FeaturedDestinations onSelect={dest => set("destination", dest)} />

                  {/* Form */}
                  <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Where & When */}
                    <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "28px 28px", boxShadow: "0 1px 3px rgba(28,25,23,0.04), 0 8px 32px rgba(28,25,23,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icons.MapPin size={13} style={{ color: "#3B82F6" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E" }}>Where & When</span>
                      </div>

                      <div className="form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#65605A", marginBottom: 8 }}>Destination</label>
                          <div style={{ position: "relative" }}>
                            <input type="text" list="dests" placeholder="Paris, Tokyo, New York…" value={form.destination} onChange={e => set("destination", e.target.value)} style={{ width: "100%", background: "#F8F5F0", border: "1px solid rgba(28,25,23,0.1)", borderRadius: 12, padding: "12px 40px 12px 16px", fontSize: 14, color: "#1C1917", outline: "none" }} />
                            <Icons.Search size={13} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#C9BFB5" }} />
                            {destinations.length > 0 && (
                              <datalist id="dests">
                                {destinations.map(d => <option key={d} value={d} />)}
                              </datalist>
                            )}
                            {destinations.length > 0 && (
                              <p style={{ fontSize: 10, color: "#A89A8E", marginTop: 6, margin: "6px 0 0" }}>
                                📚 Guides: {destinations.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#65605A", marginBottom: 8 }}>Start Date</label>
                          <input type="date" min={today} value={form.start_date} onChange={e => set("start_date", e.target.value)} style={{ width: "100%", background: "#F8F5F0", border: "1px solid rgba(28,25,23,0.1)", borderRadius: 12, padding: "12px 16px", fontSize: 14, color: "#1C1917", outline: "none", colorScheme: "light" }} />
                        </div>
                      </div>

                      {/* Duration slider */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                          <label style={{ fontSize: 12, fontWeight: 600, color: "#65605A", display: "flex", alignItems: "center", gap: 6 }}>
                            <Icons.Clock size={11} style={{ color: "#A89A8E" }} /> Duration
                          </label>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", background: "#F8F5F0", border: "1px solid rgba(28,25,23,0.08)", borderRadius: 8, padding: "4px 12px" }}>
                            {form.duration} {form.duration === 1 ? "Day" : "Days"}
                          </span>
                        </div>
                        <input type="range" min="1" max="7" step="1" value={form.duration} onChange={e => set("duration", parseInt(e.target.value))} style={{ width: "100%", background: `linear-gradient(to right, #1C1917 0%, #1C1917 ${sliderPct}%, #E4DDD4 ${sliderPct}%, #E4DDD4 100%)` }} />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                          {[1, 2, 3, 4, 5, 6, 7].map(n => (
                            <span key={n} style={{ fontSize: 10, color: n === form.duration ? "#1C1917" : "#C9BFB5", fontWeight: n === form.duration ? 700 : 400 }}>{n}d</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Travel Style */}
                    <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "28px 28px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icons.Compass size={13} style={{ color: "#F59E0B" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E" }}>Travel Style</span>
                      </div>
                      <div className="style-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                        {STYLE_OPTIONS.map(opt => {
                          const sel = form.travel_style === opt.value;
                          return (
                            <button key={opt.value} type="button" onClick={() => set("travel_style", opt.value)} style={{ position: "relative", borderRadius: 14, padding: "16px 12px", textAlign: "left", border: sel ? "2px solid #F59E0B" : "2px solid transparent", background: sel ? "#FFFBEB" : "#F8F5F0", cursor: "pointer", transition: "all 0.2s" }}>
                              {sel && <span style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.CheckCircle size={9} style={{ color: "white" }} /></span>}
                              <span style={{ fontSize: 22, display: "block", marginBottom: 8 }}>{opt.icon}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 2 }}>{opt.label}</span>
                              <span style={{ fontSize: 10, color: "#A89A8E" }}>{opt.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Budget */}
                    <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "28px 28px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icons.DollarSign size={13} style={{ color: "#8B5CF6" }} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E" }}>Budget Level</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                        {BUDGET_OPTIONS.map(opt => {
                          const sel = form.budget === opt.value;
                          return (
                            <button key={opt.value} type="button" onClick={() => set("budget", opt.value)} style={{ position: "relative", borderRadius: 14, padding: "16px 12px", textAlign: "center", border: sel ? "2px solid #8B5CF6" : "2px solid transparent", background: sel ? "#F5F3FF" : "#F8F5F0", cursor: "pointer", transition: "all 0.2s" }}>
                              {sel && <span style={{ position: "absolute", top: 8, right: 8, width: 16, height: 16, borderRadius: "50%", background: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center" }}><Icons.CheckCircle size={9} style={{ color: "white" }} /></span>}
                              <span style={{ fontSize: 22, display: "block", marginBottom: 8 }}>{opt.icon}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#1C1917", display: "block", marginBottom: 2 }}>{opt.label}</span>
                              <span style={{ fontSize: 10, color: "#A89A8E" }}>{opt.desc}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", borderRadius: 14, background: "#FFF1F2", border: "1px solid #FECDD3", color: "#E11D48", fontSize: 13, fontWeight: 500 }}>
                        <Icons.AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />{error}
                      </div>
                    )}

                    {/* Submit */}
                    <button type="submit" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "18px 24px", borderRadius: 16, border: "none", background: "#1C1917", color: "white", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, letterSpacing: -0.3, boxShadow: "0 4px 20px rgba(28,25,23,0.25)", transition: "all 0.2s" }}>
                      <Icons.Sparkles size={18} /> Generate My Itinerary <Icons.Plane size={18} />
                    </button>
                  </form>
                </div>

                {/* RIGHT: Info sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 88 }}>
                  {/* How it works */}
                  <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "24px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E", marginBottom: 20 }}>How It Works</p>
                    {[{ step: "1", title: "Enter your destination", desc: "Choose anywhere in the world", color: "#EFF6FF", tc: "#3B82F6" }, { step: "2", title: "Set your preferences", desc: "Style, budget, and duration", color: "#FFFBEB", tc: "#F59E0B" }, { step: "3", title: "Get your itinerary", desc: "AI-crafted day-by-day plan", color: "#F0FDF4", tc: "#10B981" }].map(s => (
                      <div key={s.step} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: s.tc, flexShrink: 0 }}>{s.step}</div>
                        <div><div style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", marginBottom: 2 }}>{s.title}</div><div style={{ fontSize: 12, color: "#A89A8E" }}>{s.desc}</div></div>
                      </div>
                    ))}
                  </div>

                  {/* Testimonial */}
                  <div style={{ background: "linear-gradient(135deg, #1C1917, #302D29)", borderRadius: 20, padding: "24px", color: "white" }}>
                    <div style={{ display: "flex", marginBottom: 14 }}>{[1, 2, 3, 4, 5].map(i => <Icons.Star key={i} size={13} style={{ color: "#FBBF24", marginRight: 2 }} />)}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.7)", marginBottom: 16 }}>"Voyage planned our entire Paris trip in under a minute. The itinerary was better than anything we could have done ourselves!"</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1C1917" }}>SM</div>
                      <div><div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>Sarah M.</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Paris trip, May 2026</div></div>
                    </div>
                  </div>

                  {/* Features */}
                  <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "24px" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#A89A8E", marginBottom: 16 }}>What's Included</p>
                    {[["🌤️", "Live weather forecasts"], ["📚", "Real travel guide data"], ["🏛️", "Curated local activities"], ["💡", "Pro travel tips"], ["🌧️", "Rain-proof alternatives"], ["📍", "Source attribution"]].map(([emoji, label]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 13, color: "#65605A" }}>
                        <span style={{ fontSize: 16 }}>{emoji}</span>{label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Loading ── */}
            {loading && <LoadingOverlay />}

            {/* ── Results ── */}
            {result && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 8 }}>
                {/* Trip header */}
                <div style={{ background: "white", borderRadius: 20, border: "1px solid rgba(28,25,23,0.07)", padding: "28px 32px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                    <div>
                      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 800, color: "#1C1917", letterSpacing: -1.5, marginBottom: 6 }}>{result.itinerary?.destination}</h2>
                      <p style={{ fontSize: 14, color: "#A89A8E", fontWeight: 400 }}>
                        {result.itinerary?.duration}-day{" "}
                        <span style={{ textTransform: "capitalize" }}>{result.itinerary?.travel_style}</span> trip ·{" "}
                        <span style={{ textTransform: "capitalize" }}>{result.itinerary?.budget}</span> budget
                      </p>
                    </div>
                    <button onClick={() => { setResult(null); setError(""); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, border: "1px solid rgba(28,25,23,0.1)", background: "#F8F5F0", color: "#65605A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      <Icons.ArrowLeft size={13} /> New Trip
                    </button>
                  </div>
                  {!result.has_indexed_docs && (
                    <div style={{ marginTop: 16, display: "flex", gap: 10, padding: "12px 16px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", fontSize: 12, fontWeight: 500 }}>
                      <Icons.Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                      No indexed travel guides found — itinerary generated from model knowledge.
                    </div>
                  )}
                </div>

                <WeatherStrip weather={result.weather} />

                {/* Day cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {(result.itinerary?.days || []).map((day, i) => (
                    <DayCard key={i} day={day} weatherDay={result.weather?.[i]} index={i} />
                  ))}
                </div>

                {/* Tips + Sources */}
                <div className="tips-sources-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <TipsCard tips={result.itinerary?.tips} />
                  <SourcesCard sources={result.context_sources} />
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}