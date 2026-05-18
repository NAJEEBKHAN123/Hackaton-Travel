import { useState } from 'react';
import {
    Globe, Sparkles, Map, Compass, BookOpen, Bell,
    Search, Plane, Menu, X, Wifi, WifiOff, Loader2,
} from 'lucide-react';

const NAV_LINKS = [
    { label: 'Explore', icon: Globe },
    { label: 'My Trips', icon: Map },
    { label: 'Destinations', icon: Compass },
    { label: 'AI Planner', icon: Sparkles, badge: 'New' },
    { label: 'Guides', icon: BookOpen },
];

export default function Navbar({ apiStatus = 'ok' }) {
    const [active, setActive] = useState('AI Planner');
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-[#F8F5F0]/90 backdrop-blur-2xl border-b border-[#1C1917]/[0.07]">

            {/* ── Main bar ── */}
            <div className="max-w-5xl mx-auto px-6 h-[66px] flex items-center gap-7">

                {/* Logo */}
                <a
                    href="#"
                    aria-label="Voyage home"
                    className="flex items-center gap-2.5 flex-shrink-0 group"
                >
                    <div className="w-9 h-9 rounded-xl bg-[#1C1917] flex items-center justify-center
                          group-hover:scale-95 transition-transform duration-200">
                        <Globe size={16} className="text-white" />
                    </div>
                    <span
                        className="text-[22px] font-semibold text-[#1C1917] tracking-tight leading-none"
                        style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                        Voyage
                        <span className="text-amber-500">.</span>
                    </span>
                </a>

                {/* Divider */}
                <div className="hidden md:block w-px h-5 bg-[#1C1917]/10 flex-shrink-0" />

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-0.5 flex-1">
                    {NAV_LINKS.map(({ label, icon: Icon, badge }) => (
                        <button
                            key={label}
                            onClick={() => setActive(label)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-medium
                          transition-all duration-150 leading-none
                          ${active === label
                                    ? 'text-[#1C1917] bg-[#1C1917]/7'
                                    : 'text-[#65605A] hover:text-[#1C1917] hover:bg-[#1C1917]/5'
                                }`}
                        >
                            <Icon size={13} strokeWidth={1.8} />
                            {label}
                            {badge && (
                                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                                 bg-amber-100 text-amber-800 border border-amber-200 leading-none ml-0.5">
                                    {badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* ── Desktop right side ── */}
                <div className="hidden md:flex items-center gap-2.5 flex-shrink-0 ml-auto">

                    {/* API status */}
                    <div className="flex items-center gap-1.5 text-[12px] font-medium mr-1">
                        {apiStatus === 'checking' && (
                            <span className="text-[#A89A8E] flex items-center gap-1.5">
                                <Loader2 size={11} className="animate-spin" /> Connecting
                            </span>
                        )}
                        {apiStatus === 'ok' && (
                            <span className="text-emerald-600 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live
                            </span>
                        )}
                        {apiStatus === 'error' && (
                            <span className="text-rose-500 flex items-center gap-1.5">
                                <WifiOff size={11} /> Offline
                            </span>
                        )}
                    </div>

                    <div className="w-px h-5 bg-[#1C1917]/10" />

                    {/* Icon buttons */}
                    <button
                        aria-label="Notifications"
                        className="relative w-9 h-9 rounded-xl border border-[#1C1917]/10 bg-white
                       flex items-center justify-center text-[#65605A]
                       hover:text-[#1C1917] hover:border-[#1C1917]/20
                       hover:shadow-[0_2px_8px_rgba(28,25,23,0.1)]
                       transition-all duration-150"
                    >
                        <Bell size={14} strokeWidth={1.8} />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full
                             bg-amber-400 border border-[#F8F5F0]" />
                    </button>

                    <button
                        aria-label="Search"
                        className="w-9 h-9 rounded-xl border border-[#1C1917]/10 bg-white
                       flex items-center justify-center text-[#65605A]
                       hover:text-[#1C1917] hover:border-[#1C1917]/20
                       hover:shadow-[0_2px_8px_rgba(28,25,23,0.1)]
                       transition-all duration-150"
                    >
                        <Search size={14} strokeWidth={1.8} />
                    </button>

                    <div className="w-px h-5 bg-[#1C1917]/10" />

                    {/* Avatar */}
                    <div
                        role="img"
                        aria-label="User profile"
                        className="w-9 h-9 rounded-full bg-[#1C1917] text-white
                       flex items-center justify-center text-[11px] font-semibold
                       cursor-pointer border-2 border-[#1C1917]/10
                       hover:bg-[#302D29] transition-colors select-none"
                    >
                        JD
                    </div>

                    {/* CTA */}
                    <button
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl
                       bg-[#1C1917] text-white text-[13px] font-medium
                       hover:bg-[#302D29]
                       shadow-[0_1px_2px_rgba(28,25,23,0.12)]
                       hover:shadow-[0_4px_12px_rgba(28,25,23,0.2)]
                       transition-all duration-150 active:scale-[0.98]"
                    >
                        <Plane size={13} strokeWidth={1.8} />
                        Plan trip
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(o => !o)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    className="md:hidden ml-auto w-9 h-9 rounded-xl border border-[#1C1917]/10 bg-white
                     flex items-center justify-center text-[#65605A]
                     hover:text-[#1C1917] transition-all"
                >
                    {mobileOpen ? <X size={15} /> : <Menu size={15} />}
                </button>
            </div>

            {/* ── Mobile drawer ── */}
            {mobileOpen && (
                <div className="md:hidden border-t border-[#1C1917]/[0.07] bg-[#F8F5F0] px-4 py-3 space-y-1">
                    {NAV_LINKS.map(({ label, icon: Icon, badge }) => (
                        <button
                            key={label}
                            onClick={() => { setActive(label); setMobileOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium
                          transition-all
                          ${active === label
                                    ? 'text-[#1C1917] bg-[#1C1917]/7'
                                    : 'text-[#65605A] hover:text-[#1C1917] hover:bg-[#1C1917]/5'
                                }`}
                        >
                            <Icon size={14} strokeWidth={1.8} />
                            {label}
                            {badge && (
                                <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                                 bg-amber-100 text-amber-800 border border-amber-200">
                                    {badge}
                                </span>
                            )}
                        </button>
                    ))}

                    <div className="pt-3 pb-1 border-t border-[#1C1917]/[0.07]">
                        <button
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl
                         bg-[#1C1917] text-white text-[13px] font-medium
                         hover:bg-[#302D29] transition-all"
                        >
                            <Plane size={13} strokeWidth={1.8} />
                            Plan a trip
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
