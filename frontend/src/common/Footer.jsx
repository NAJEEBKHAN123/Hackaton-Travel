import { useState } from 'react';
import {
    Globe, Sparkles, Map, Calendar, Sun, Smartphone,
    BookOpen, Code, MessageSquare, BarChart2, LifeBuoy,
    Info, Briefcase, Newspaper, Mail, Shield,
    CheckCircle2, Send, ArrowRight,
} from 'lucide-react';

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const FOOTER_COLS = [
    {
        title: 'Product',
        links: [
            { label: 'AI Planner', icon: Sparkles },
            { label: 'Destinations', icon: Map },
            { label: 'Trip Calendar', icon: Calendar },
            { label: 'Weather Forecast', icon: Sun },
            { label: 'Mobile App', icon: Smartphone, badge: 'Soon' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Travel Guides', icon: BookOpen },
            { label: 'API Docs', icon: Code },
            { label: 'Community', icon: MessageSquare },
            { label: 'Changelog', icon: BarChart2 },
            { label: 'Help Center', icon: LifeBuoy },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', icon: Info },
            { label: 'Careers', icon: Briefcase },
            { label: 'Blog', icon: Newspaper },
            { label: 'Contact', icon: Mail },
            { label: 'Privacy', icon: Shield },
        ],
    },
];

const SOCIAL = [
    { icon: TwitterIcon, label: 'Twitter / X' },
    { icon: InstagramIcon, label: 'Instagram' },
    { icon: YoutubeIcon, label: 'YouTube' },
    { icon: GithubIcon, label: 'GitHub' },
];

const LEGAL = ['Terms', 'Privacy', 'Cookies', 'Sitemap'];

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (!email.includes('@')) return;
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
    };

    return (
        <footer className="bg-[#100E0B] border-t border-white/[0.05]">

            {/* ── Top grid: brand + columns ── */}
            <div className="max-w-5xl mx-auto px-6 pt-14 pb-12
                      grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12">

                {/* Brand block */}
                <div>
                    {/* Logo */}
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.07] border border-white/[0.10]
                            flex items-center justify-center">
                            <Globe size={16} className="text-amber-400" />
                        </div>
                        <span
                            className="text-[21px] font-semibold text-white tracking-tight leading-none"
                            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                        >
                            Voyage<span className="text-amber-400">.</span>
                        </span>
                    </div>

                    <p className="text-[13px] text-[#65605A] leading-relaxed max-w-[230px] mb-7 font-light">
                        AI-powered itineraries grounded in real travel guides,
                        with live weather forecasts built in.
                    </p>

                    {/* Social */}
                    <div className="flex gap-2" aria-label="Social links">
                        {SOCIAL.map(({ icon: Icon, label }) => (
                            <button
                                key={label}
                                aria-label={label}
                                className="w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.04]
                           flex items-center justify-center text-[#65605A]
                           hover:text-white hover:border-white/[0.15] hover:bg-white/[0.08]
                           transition-all duration-150"
                            >
                                <Icon size={13} strokeWidth={1.8} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                {FOOTER_COLS.map(col => (
                    <div key={col.title}>
                        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase
                          text-[#47433E] mb-5">
                            {col.title}
                        </p>
                        <ul className="space-y-2.5">
                            {col.links.map(({ label, icon: Icon, badge }) => (
                                <li key={label}>
                                    <a
                                        href="#"
                                        className="flex items-center gap-2 text-[13px] text-[#65605A]
                               hover:text-[#D3D1C7] transition-colors duration-150 group"
                                    >
                                        <Icon
                                            size={12}
                                            strokeWidth={1.8}
                                            className="opacity-40 group-hover:opacity-70 transition-opacity flex-shrink-0"
                                        />
                                        {label}
                                        {badge && (
                                            <span className="ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                                       bg-emerald-900/40 text-emerald-400 border border-emerald-800/40">
                                                {badge}
                                            </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* ── Newsletter strip ── */}
            <div className="max-w-5xl mx-auto px-6 pb-10">
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6
                        flex flex-col sm:flex-row items-start sm:items-center
                        justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] uppercase
                          text-amber-400/90 mb-1.5">
                            Stay in the loop
                        </p>
                        <p className="text-[15px] font-semibold text-white leading-snug">
                            Get destination ideas &amp; travel tips weekly
                        </p>
                        <p className="text-[12px] text-[#47433E] mt-0.5 font-light">
                            No spam. Unsubscribe anytime.
                        </p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                            placeholder="your@email.com"
                            aria-label="Email address"
                            className="flex-1 sm:w-52 bg-white/[0.06] border border-white/[0.09]
                         rounded-xl px-4 py-2.5 text-[13px] text-white
                         placeholder-[#47433E] outline-none
                         focus:border-amber-400/40 focus:bg-white/[0.09]
                         transition-all duration-150"
                        />
                        <button
                            onClick={handleSubscribe}
                            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl
                          text-[13px] font-semibold transition-all duration-200
                          whitespace-nowrap
                          ${subscribed
                                    ? 'bg-emerald-700 text-white border border-emerald-600/30'
                                    : 'bg-amber-500 hover:bg-amber-400 text-[#1C1917] shadow-[0_1px_2px_rgba(28,25,23,0.15)]'
                                }`}
                        >
                            {subscribed
                                ? <><CheckCircle2 size={13} strokeWidth={2} /> Subscribed!</>
                                : <><Send size={13} strokeWidth={1.8} /> Subscribe</>
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div className="border-t border-white/[0.05]">
                <div className="max-w-5xl mx-auto px-6 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">

                    {/* Left: copyright + legal */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                        <span className="text-[12px] text-[#47433E]">© 2026 Voyage, Inc.</span>
                        <nav className="flex items-center gap-4" aria-label="Legal">
                            {LEGAL.map(l => (
                                <a
                                    key={l}
                                    href="#"
                                    className="text-[12px] text-[#47433E] hover:text-[#A8A29E] transition-colors"
                                >
                                    {l}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Right: status badges */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                            border border-white/[0.06] text-[11px] text-[#47433E]">
                            <CheckCircle2 size={11} className="text-emerald-500" strokeWidth={2} />
                            All systems operational
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                            border border-white/[0.06] text-[11px] text-[#47433E]">
                            <Sparkles size={11} className="text-amber-400" strokeWidth={1.8} />
                            Powered by Claude
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
}