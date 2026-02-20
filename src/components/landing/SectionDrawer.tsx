"use client";

import { JSX, useEffect, useRef, useState } from "react";
import {
  X, Mail, BarChart2, Zap, Clock, Users, ShieldCheck,
  MessageSquare, BookOpen, Phone, ChevronUp,
} from "lucide-react";

type Section = "features" | "pricing" | "api-documentation" | "contact";

const NAV: { key: Section; label: string }[] = [
  { key: "features", label: "Features" },
  { key: "pricing", label: "Pricing" },
  { key: "api-documentation", label: "API Documentation" },
  { key: "contact", label: "Contact Support" },
];

// ── section contents ─────────────────────────────────────────────────────────

function Features() {
  return (
    <div className="grid grid-cols-3 gap-5">
      {[
        { icon: Mail, title: "Email Campaigns", desc: "Design, schedule and send campaigns to thousands of contacts. Rich templates included." },
        { icon: Zap, title: "Smart Segmentation", desc: "Slice your audience by behaviour, location, engagement or any custom field you define." },
        { icon: Clock, title: "Automated Workflows", desc: "Set triggers once — let the platform nurture leads and re-engage dormant contacts automatically." },
        { icon: BarChart2, title: "Real-Time Analytics", desc: "Live open rates, click maps and conversion tracking updated every second." },
        { icon: Users, title: "Contact Management", desc: "Centralised CRM-lite with custom fields, tagging, import/export and full activity history." },
        { icon: ShieldCheck, title: "Role-Based Access", desc: "Separate admin and client portals with granular permissions so every user sees only what they need." },
      ].map(({ icon: Icon, title, desc }, i) => (
        <div
          key={title}
          className="rounded-xl p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-200"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(212,160,23,0.12)",
            animationDelay: `${i * 60}ms`,
          }}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.2)" }}>
            <Icon size={16} style={{ color: "#d4a017" }} />
          </div>
          <p className="text-[13.5px] font-semibold text-white">{title}</p>
          <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
        </div>
      ))}
    </div>
  );
}

function Pricing() {
  return (
    <div className="grid grid-cols-3 gap-5 max-w-4xl mx-auto">
      {[
        { name: "Starter", tagline: "Small teams", features: ["Up to 5,000 contacts", "3 active campaigns", "Basic analytics", "Email support"], highlight: false },
        { name: "Growth", tagline: "Most popular", features: ["Up to 50,000 contacts", "Unlimited campaigns", "Advanced analytics", "Automated workflows", "Priority support"], highlight: true },
        { name: "Enterprise", tagline: "Large organisations", features: ["Unlimited contacts", "Custom integrations", "Dedicated account manager", "SLA guarantee", "White-label option"], highlight: false },
      ].map(({ name, tagline, features, highlight }) => (
        <div key={name} className="rounded-2xl p-6 flex flex-col gap-4 relative"
          style={{
            background: highlight ? "linear-gradient(145deg,#0a1628,#152338)" : "rgba(255,255,255,0.04)",
            border: highlight ? "2px solid #d4a017" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: highlight ? "0 8px 32px rgba(212,160,23,0.12)" : "none",
          }}>
          {highlight && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[11px] font-bold"
              style={{ background: "#d4a017", color: "#0d1b2e" }}>Most Popular</div>
          )}
          <div>
            <p className="text-[15px] font-bold" style={{ color: highlight ? "#f0c040" : "white" }}>{name}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{tagline}</p>
          </div>
          <p className="text-[26px] font-extrabold text-white">Custom
            <span className="text-[12px] font-normal ml-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>/ contact us</span>
          </p>
          <ul className="space-y-2 flex-1">
            {features.map(f => (
              <li key={f} className="flex items-center gap-2 text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(212,160,23,0.15)" }}>
                  <svg width="7" height="7" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#d4a017" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {f}
              </li>
            ))}
          </ul>
          <button
            className="w-full py-2.5 rounded-lg text-[12.5px] font-bold transition-opacity hover:opacity-90 mt-2"
            style={highlight ? { background: "#d4a017", color: "#0d1b2e" } : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}
          >
            Get a Quote
          </button>
        </div>
      ))}
    </div>
  );
}

function ApiDocs() {
  return (
    <div className="grid grid-cols-2 gap-14 items-start max-w-4xl mx-auto">
      <div>
        <p className="text-[20px] font-bold text-white mb-3">Built for Developers</p>
        <p className="text-[13px] leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.45)" }}>
          Our RESTful API gives you full programmatic access to contacts, campaigns,
          analytics and more. Integrate BEE Smart into any stack in minutes.
        </p>
        <div className="space-y-3 mb-7">
          {["REST API with JSON responses", "Webhook support for real-time events", "SDKs for Node.js, Python & PHP", "Sandbox environment for testing"].map(item => (
            <div key={item} className="flex items-center gap-2.5 text-[13px]" style={{ color: "rgba(255,255,255,0.55)" }}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#d4a017" }} />
              {item}
            </div>
          ))}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[12.5px] font-semibold"
          style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.25)", color: "#d4a017" }}>
          <BookOpen size={13} /> Full docs coming soon
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(212,160,23,0.2)" }}>
        <div className="flex items-center gap-2 px-4 py-3"
          style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <span className="ml-2 text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>POST /api/v1/campaigns</span>
        </div>
        <div className="p-5 font-mono text-[12px] leading-[1.9]" style={{ background: "#070f1c" }}>
          <p style={{ color: "#5a7a9a" }}>{"// Create a campaign"}</p>
          <p><span style={{ color: "#d4a017" }}>const </span><span style={{ color: "white" }}>res = </span><span style={{ color: "#f0c040" }}>await </span><span style={{ color: "white" }}>fetch(</span></p>
          <p><span style={{ color: "rgba(255,255,255,0.4)" }}>{"  'https://"}</span><span style={{ color: "#d4a017" }}>api.beesmart.io</span><span style={{ color: "rgba(255,255,255,0.4)" }}>{"/v1/campaigns',"}</span></p>
          <p><span style={{ color: "white" }}>{"  { "}</span><span style={{ color: "rgba(255,255,255,0.4)" }}>method: </span><span style={{ color: "#d4a017" }}>'POST'</span><span style={{ color: "white" }}>{","}</span></p>
          <p><span style={{ color: "rgba(255,255,255,0.4)" }}>{"    headers: { Authorization: 'Bearer "}</span><span style={{ color: "#f0c040" }}>KEY</span><span style={{ color: "rgba(255,255,255,0.4)" }}>{"' },"}</span></p>
          <p><span style={{ color: "rgba(255,255,255,0.4)" }}>{"    body: JSON.stringify({ name: "}</span><span style={{ color: "#d4a017" }}>'Q1 Outreach'</span><span style={{ color: "rgba(255,255,255,0.4)" }}>{" })"}</span></p>
          <p><span style={{ color: "white" }}>{"  }"}</span></p>
          <p><span style={{ color: "white" }}>);</span></p>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="grid grid-cols-[1fr_1.8fr] gap-12 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div>
          <p className="text-[20px] font-bold text-white mb-2">We&apos;re Here to Help</p>
          <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
            Have a question or need a custom demo? We&apos;ll get back to you within one business day.
          </p>
        </div>
        {[
          { icon: Mail, label: "Email Us", value: "hello@beesmart.io", sub: "Reply within 24 hours" },
          { icon: MessageSquare, label: "Live Chat", value: "Available in-app", sub: "For active account holders" },
          { icon: Phone, label: "Sales", value: "Book a call", sub: "Custom plans & enterprise" },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)" }}>
              <Icon size={15} style={{ color: "#d4a017" }} />
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-white">{label}</p>
              <p className="text-[12px]" style={{ color: "#d4a017" }}>{value}</p>
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.15)" }}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[{ label: "Name", placeholder: "John Smith" }, { label: "Company", placeholder: "Acme Inc." }].map(({ label, placeholder }) => (
              <div key={label}>
                <label className="text-[11.5px] font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</label>
                <input type="text" placeholder={placeholder}
                  className="w-full h-9 px-3 rounded-lg text-[12.5px] text-white outline-none placeholder:text-white/20"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[11.5px] font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Email</label>
            <input type="email" placeholder="you@company.com"
              className="w-full h-9 px-3 rounded-lg text-[12.5px] text-white outline-none placeholder:text-white/20"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
          <div>
            <label className="text-[11.5px] font-medium block mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Message</label>
            <textarea rows={3} placeholder="Tell us how we can help..."
              className="w-full px-3 py-2.5 rounded-lg text-[12.5px] text-white outline-none resize-none placeholder:text-white/20"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          </div>
          <button className="w-full h-9 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90"
            style={{ background: "#d4a017", color: "#0d1b2e" }}>
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}

const CONTENT: Record<Section, () => JSX.Element> = {
  features: Features,
  pricing: Pricing,
  "api-documentation": ApiDocs,
  contact: Contact,
};

// ── main export ───────────────────────────────────────────────────────────────

export function SectionDrawer() {
  const [active, setActive] = useState<Section | null>(null);
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // open/close with animation timing
  const open = (key: Section) => {
    if (active === key) {
      setVisible(false);
      timerRef.current = setTimeout(() => setActive(null), 350);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setActive(key);
      // tiny delay so content mounts before animating in
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }
  };

  // hide on scroll
  useEffect(() => {
    const onScroll = () => {
      if (Math.abs(window.scrollY - lastScrollY.current) > 50) {
        setVisible(false);
        timerRef.current = setTimeout(() => setActive(null), 350);
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const ContentComponent = active ? CONTENT[active] : null;

  return (
    <>
      {/* ── expanded section — rendered ABOVE the footer in the DOM ── */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: visible ? "600px" : "0px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease, transform 0.35s ease",
          background: "#0a1628",
          borderTop: visible ? "1px solid rgba(212,160,23,0.2)" : "none",
        }}
      >
        {ContentComponent && (
          <div className="relative px-16 py-10">
            {/* section label + close */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full" style={{ background: "#d4a017" }} />
                <span className="text-[15px] font-bold text-white">
                  {NAV.find(n => n.key === active)?.label}
                </span>
              </div>
              <button
                onClick={() => { setVisible(false); timerRef.current = setTimeout(() => setActive(null), 350); }}
                className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                <X size={13} /> Close
              </button>
            </div>
            <ContentComponent />
          </div>
        )}
      </div>

      {/* ── footer nav ── */}
      <nav className="flex gap-8">
        {NAV.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => open(key)}
            className="flex items-center gap-1 text-[13px] transition-all duration-200 group"
            style={{ color: active === key ? "#d4a017" : "rgba(255,255,255,0.4)" }}
          >
            {label}
            <ChevronUp
              size={13}
              className="transition-transform duration-300"
              style={{
                transform: active === key && visible ? "rotate(0deg)" : "rotate(180deg)",
                opacity: active === key ? 1 : 0.4,
              }}
            />
          </button>
        ))}
      </nav>
    </>
  );
}