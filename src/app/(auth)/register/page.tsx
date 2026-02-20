import Link from "next/link";
import { ArrowLeft, Mail, Sparkles, Clock, ShieldCheck, BarChart2, Zap } from "lucide-react";

export default function RegisterPage() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.2)" }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #d4a017, #f0c040, #d4a017)" }} />

      {/* Header */}
      <div className="px-8 pt-7 pb-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5"
          style={{ background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.3)" }}>
          <Clock size={11} style={{ color: "#d4a017" }} />
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#d4a017" }}>
            Coming Soon
          </span>
        </div>

        <h1 className="text-[22px] font-bold text-white leading-tight mb-2">
          Registration is<br />
          <span style={{ color: "#f0c040" }}>Opening Soon</span>
        </h1>
        <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          We&apos;re putting the finishing touches on our onboarding experience.
          Be the first to know when it&apos;s ready.
        </p>
      </div>

      {/* Divider */}
      <div className="mx-8 mb-6" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* What's coming */}
      <div className="px-8 mb-6">
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
          What you&apos;ll get
        </p>
        <div className="space-y-2.5">
          {[
            { icon: Zap, text: "Smart email segmentation & targeting" },
            { icon: BarChart2, text: "Real-time campaign analytics dashboard" },
            { icon: ShieldCheck, text: "Multi-user admin & client management" },
            { icon: Sparkles, text: "AI-powered campaign recommendations" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)" }}
              >
                <Icon size={13} style={{ color: "#d4a017" }} />
              </div>
              <span className="text-[12.5px]" style={{ color: "rgba(255,255,255,0.55)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notify me form */}
      {/* <div className="px-8 mb-6">
        <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
          Get notified
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "rgba(255,255,255,0.25)" }}
            />
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full h-10 pl-9 pr-3 rounded-lg text-[13px] text-white outline-none transition-all
                         placeholder:text-white/20 focus:border-[#d4a017]"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </div>
          <button
            className="h-10 px-4 rounded-lg text-[13px] font-bold shrink-0 transition-opacity hover:opacity-90"
            style={{ background: "#d4a017", color: "#0d1b2e" }}
          >
            Notify Me
          </button>
        </div>
        <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          No spam. We&apos;ll only reach out when registration opens.
        </p>
      </div> */}

      {/* Footer */}
      <div
        className="px-8 py-4 border-t flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-1.5 text-[12.5px] transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          <ArrowLeft size={13} />
          Back to home
        </Link>
        <Link
          href="/login"
          className="text-[12.5px] font-semibold transition-opacity hover:opacity-80"
          style={{ color: "#d4a017" }}
        >
          Already have an account?
        </Link>
      </div>
    </div>
  );
}