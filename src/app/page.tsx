import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoginPopover } from "@/components/landing/LoginPopover";
import { SectionDrawer } from "@/components/landing/SectionDrawer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* NAVBAR */}
      <nav
        className="sticky top-0 z-50 h-16 flex items-center justify-between px-12 border-b"
        style={{ background: "#0d1b2e", borderColor: "rgba(212,160,23,0.2)" }}
      >
        {/* Left — logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-base"
            style={{ background: "linear-gradient(135deg, #f0c040, #d4a017)" }}
          >
            🐝
          </div>
          <span
            className="text-[17px] font-bold tracking-wide"
            style={{ color: "#f0c040" }}
          >
            BEE Smart Campaigns
          </span>
        </Link>

        {/* Right — tagline + sign in */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-light tracking-widest text-white/50">
            Intelligent Connectivity
          </span>
          <LoginPopover />
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative grid grid-cols-2 items-center min-h-[480px] px-16 py-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0d1b2e 0%, #152338 50%, #1a2d4a 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52'%3E%3Cpath d='M15 2l15 8.66v17.32L15 36.64 0 27.98V10.66z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3Cpath d='M45 2l15 8.66v17.32L45 36.64 30 27.98V10.66z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(212,160,23,0.08), transparent 60%)",
          }}
        />

        <div className="z-10 max-w-lg space-y-6">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
            Don&apos;t Just Send Emails. Start Conversations That Stick.
          </h1>
          <p
            className="text-sm font-light leading-relaxed max-w-sm"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            The all-in-one email and campaign management ecosystem designed to
            turn your data into high-converting relationships.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button
              asChild
              size="lg"
              className="font-bold hover:opacity-90 transition-opacity"
              style={{
                background: "#d4a017",
                color: "#0d1b2e",
                border: "2px solid #d4a017",
              }}
            >
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="default"
              className="bg-transparent text-white border border-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login/client">Explore </Link>
            </Button>
          </div>
        </div>

        <div className="z-10 flex items-center justify-center relative">
          {[
            { top: "10px", right: "70px", delay: "0s" },
            { top: "20px", right: "15px", delay: "0.6s" },
            { top: "-5px", left: "40px", delay: "1.2s" },
          ].map((pos, i) => (
            <svg
              key={i}
              className="absolute w-11 h-8"
              style={{
                top: pos.top,
                right: pos.right,
                left: pos.left,
                animation: `float 3s ease-in-out ${pos.delay} infinite`,
              }}
              viewBox="0 0 44 34"
              fill="none"
            >
              <rect
                width="44"
                height="34"
                rx="4"
                fill="#d4a017"
                fillOpacity="0.85"
              />
              <path
                d="M4 6l18 14L40 6"
                stroke="#0d1b2e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ))}
          <svg
            className="w-[340px] h-[280px]"
            style={{ filter: "drop-shadow(0 20px 60px rgba(212,160,23,0.35))" }}
            viewBox="0 0 340 280"
            fill="none"
          >
            <ellipse
              cx="170"
              cy="248"
              rx="140"
              ry="20"
              fill="rgba(212,160,23,0.15)"
            />
            <path
              d="M30 200 L170 240 L310 200 L170 160 Z"
              fill="#8a6010"
              opacity="0.6"
            />
            <path
              d="M30 200 L170 240 L170 250 L30 210 Z"
              fill="#5a4008"
              opacity="0.8"
            />
            <path
              d="M310 200 L170 240 L170 250 L310 210 Z"
              fill="#7a5810"
              opacity="0.8"
            />
            <path
              d="M30 200 L170 160 L310 200 L170 240 Z"
              fill="url(#pg)"
              opacity="0.95"
            />
            <path
              d="M170 130 L190 141.5 L190 164.5 L170 176 L150 164.5 L150 141.5 Z"
              fill="url(#h1)"
              stroke="#f0c040"
              strokeWidth="0.8"
            />
            <path
              d="M130 107 L150 118.5 L150 141.5 L130 153 L110 141.5 L110 118.5 Z"
              fill="url(#h2)"
              stroke="#d4a017"
              strokeWidth="0.6"
              opacity="0.85"
            />
            <path
              d="M210 107 L230 118.5 L230 141.5 L210 153 L190 141.5 L190 118.5 Z"
              fill="url(#h2)"
              stroke="#d4a017"
              strokeWidth="0.6"
              opacity="0.85"
            />
            <path
              d="M170 83 L190 94.5 L190 117.5 L170 129 L150 117.5 L150 94.5 Z"
              fill="url(#h3)"
              stroke="#d4a017"
              strokeWidth="0.6"
              opacity="0.7"
            />
            <path
              d="M130 153 L150 164.5 L150 187.5 L130 199 L110 187.5 L110 164.5 Z"
              fill="url(#h2)"
              stroke="#c49010"
              strokeWidth="0.6"
              opacity="0.7"
            />
            <path
              d="M210 153 L230 164.5 L230 187.5 L210 199 L190 187.5 L190 164.5 Z"
              fill="url(#h2)"
              stroke="#c49010"
              strokeWidth="0.6"
              opacity="0.7"
            />
            <g stroke="#f0c040" strokeWidth="1" opacity="0.4">
              <line x1="170" y1="176" x2="170" y2="200" />
              <line x1="150" y1="164.5" x2="130" y2="153" />
              <line x1="190" y1="164.5" x2="210" y2="153" />
              <circle cx="170" cy="200" r="2.5" fill="#f0c040" />
              <circle cx="130" cy="153" r="2" fill="#d4a017" />
              <circle cx="210" cy="153" r="2" fill="#d4a017" />
            </g>
            <rect
              x="157"
              y="144"
              width="26"
              height="20"
              rx="2"
              fill="#0d1b2e"
            />
            <path
              d="M159 146 L170 154 L181 146"
              stroke="#f0c040"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="170"
              y1="130"
              x2="185"
              y2="60"
              stroke="#f0c040"
              strokeWidth="1.5"
              strokeDasharray="3,3"
              opacity="0.6"
            />
            <line
              x1="170"
              y1="130"
              x2="155"
              y2="50"
              stroke="#d4a017"
              strokeWidth="1"
              strokeDasharray="3,3"
              opacity="0.4"
            />
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c49010" />
                <stop offset="50%" stopColor="#d4a017" />
                <stop offset="100%" stopColor="#8a6010" />
              </linearGradient>
              <radialGradient id="h1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#c49010" />
              </radialGradient>
              <radialGradient id="h2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#d4a017" />
                <stop offset="100%" stopColor="#8a6010" />
              </radialGradient>
              <radialGradient id="h3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#b48010" />
                <stop offset="100%" stopColor="#704808" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* BELOW-HERO CARD */}
      <div className="px-10 py-10" style={{ background: "#0d1b2e" }}>
        <div className="rounded-2xl bg-[#f4f5f7] overflow-hidden shadow-2xl">
          <div className="px-12 pt-12 pb-10 border-b border-black/[0.06]">
            <h2 className="text-xl font-bold text-[#1a2740] mb-8">
              Core Features
            </h2>
            <div className="flex gap-10">
              {[
                {
                  label: "Smart Segmentation",
                  Icon: () => (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                    </svg>
                  ),
                },
                {
                  label: "Drag-and-Drop Builder",
                  Icon: () => (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 9l4-4 4 4M9 5v14M19 15l-4 4-4-4M15 19V5" />
                    </svg>
                  ),
                },
                {
                  label: "Automated Workflows",
                  Icon: () => (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 3" />
                    </svg>
                  ),
                },
                {
                  label: "Real-Time Analytics",
                  Icon: () => (
                    <svg
                      viewBox="0 0 24 24"
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 20h18M5 20V14M9 20V8M13 20V4M17 20V11" />
                      <polyline points="17 7 19 5 21 7" />
                    </svg>
                  ),
                },
              ].map(({ label, Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div
                    className="w-[68px] h-[68px] rounded-full bg-white border-2 flex items-center justify-center text-[#1a2740] transition-all duration-200 group-hover:border-[#d4a017] group-hover:shadow-[0_0_0_4px_rgba(212,160,23,0.12)]"
                    style={{ borderColor: "rgba(26,39,64,0.14)" }}
                  >
                    <Icon />
                  </div>
                  <span className="text-[12.5px] font-medium text-center text-[#1a2740] leading-snug max-w-[80px]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="px-12 py-10 border-r border-black/[0.06]">
              <h2 className="text-[26px] font-extrabold text-[#1a2740] leading-tight mb-7">
                Over 4 Million
                <br />
                Emails Sent Monthly.
              </h2>
              <div className="flex items-center gap-3 mb-5">
                {[
                  { initials: "CA", name: "Company Alpha" },
                  { initials: "CB", name: "Company Beta" },
                ].map(({ initials, name }) => (
                  <div key={initials} className="flex items-center gap-1.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-white font-bold shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #8a9ab0, #5a6a80)",
                      }}
                    >
                      {initials}
                    </div>
                    <span className="text-[12px] text-[#8a9ab0] font-medium">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-black/[0.06] p-4 relative mb-8 shadow-sm">
                <p className="text-[12.5px] text-[#5a6a80] leading-relaxed pr-4">
                  &ldquo;Their next-gen platform completely reimagined how we
                  run email workflows and supercharged our campaign
                  performance.&rdquo;
                </p>
                <span
                  className="absolute bottom-2.5 right-3.5 text-lg"
                  style={{ color: "#d4a017", opacity: 0.45 }}
                >
                  ❝
                </span>
              </div>
              <Button
                asChild
                size="lg"
                className="w-full font-bold text-[14px] py-5 hover:opacity-90 rounded-lg"
                style={{ background: "#d4a017", color: "#0d1b2e" }}
              >
                <Link href="/register">Join the Hive Now</Link>
              </Button>
            </div>

            <div className="px-10 py-10">
              <h2 className="text-xl font-bold text-[#1a2740] mb-6">
                Choose Your Path
              </h2>
              <div className="grid grid-cols-2 gap-4 h-[calc(100%-52px)]">
                <div
                  className="rounded-xl border-2 p-5 flex flex-col"
                  style={{
                    background: "linear-gradient(145deg, #0d1b2e, #152338)",
                    borderColor: "#d4a017",
                  }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "#d4a017" }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d1b2e"
                        strokeWidth="2.4"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20v-2a6 6 0 0112 0v2" />
                      </svg>
                    </div>
                    <span
                      className="text-[14px] font-semibold"
                      style={{ color: "#f0c040" }}
                    >
                      For Administrators
                    </span>
                  </div>
                  <p
                    className="text-[12.5px] font-semibold mb-1"
                    style={{ color: "rgba(255,255,255,0.85)" }}
                  >
                    Manage Your Platform
                  </p>
                  <p
                    className="text-[11.5px] leading-relaxed flex-1 mb-5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Full control over client accounts, campaign analytics, user
                    management, and system configuration.
                  </p>
                  <Link
                    href="/login/admin"
                    className="w-full py-2 rounded-lg text-[12.5px] font-semibold border-2 text-center block transition-colors duration-200 hover:bg-[#d4a017] hover:text-[#0d1b2e]"
                    style={{ borderColor: "#d4a017", color: "#f0c040" }}
                  >
                    Explore Admin Tools
                  </Link>
                </div>
                <div
                  className="rounded-xl border-2 border-transparent p-5 flex flex-col bg-white hover:border-[#d4a017] hover:-translate-y-0.5 transition-all duration-200"
                  style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#f0f2f5] flex items-center justify-center shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#1a2740"
                        strokeWidth="2.4"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20v-2a6 6 0 0112 0v2" />
                      </svg>
                    </div>
                    <span className="text-[14px] font-semibold text-[#1a2740]">
                      For Clients
                    </span>
                  </div>
                  <p className="text-[12.5px] font-semibold text-[#4a5a70] mb-1">
                    Create Your Campaign
                  </p>
                  <p className="text-[11.5px] text-[#8a9ab0] leading-relaxed flex-1 mb-5">
                    We power what you&apos;ve already envisioned. Build, launch,
                    and track your campaigns with ease.
                  </p>
                  <Button
                    asChild
                    className="w-full font-bold text-[12.5px] hover:opacity-90 rounded-lg"
                    style={{ background: "#d4a017", color: "#0d1b2e" }}
                  >
                    <Link href="/login/client">Create Your Campaign</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER — SectionDrawer renders expanded panel + nav links together */}
      <footer style={{ background: "#0d1b2e" }}>
        {/* <SectionDrawer /> */}
        <div
          className="px-16 py-5 flex items-center justify-between border-t"
          style={{ borderColor: "rgba(212,160,23,0.15)" }}
        >
          <span
            className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            © 2025 BEE Smart Campaigns. All rights reserved.
          </span>
          <LoginPopover />
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50%       { transform: translateY(-12px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
