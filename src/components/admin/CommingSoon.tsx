/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Mail, Sparkles } from "lucide-react";

type ComingSoonProps = {
  title?: string;
  description?: string;
};

export default function ComingSoon({
  title = "Something remarkable is on its way.",
  description = "We’re putting the finishing touches on something amazing.",
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; delay: number; duration: number }[]
  >([]);
  const [mounted, setMounted] = useState(false);

  const TARGET = new Date("2025-10-01T00:00:00");
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    setMounted(true);
    setParticles(
      Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 8,
        delay: Math.random() * 8,
        duration: Math.random() * 8 + 10,
      }))
    );

    const tick = () => {
      const diff = TARGET.getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
      setTimeLeft({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor((diff % 86_400_000) / 3_600_000),
        m: Math.floor((diff % 3_600_000) / 60_000),
        s: Math.floor((diff % 60_000) / 1_000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #070e1a 0%, #0b1825 50%, #0f1e30 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52'%3E%3Cpath d='M15 2l15 8.66v17.32L15 36.64 0 27.98V10.66z' fill='none' stroke='%23c8991a' stroke-width='0.7'/%3E%3Cpath d='M45 2l15 8.66v17.32L45 36.64 30 27.98V10.66z' fill='none' stroke='%23c8991a' stroke-width='0.7'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 52px",
          opacity: 0.03,
        }}
      />

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,160,23,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Particles */}
      {mounted &&
        particles.map((p, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: 0,
              animation: `floatHex ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          >
            <svg viewBox="0 0 24 22" fill="none">
              <path
                d="M6 1L18 1L24 11L18 21L6 21L0 11Z"
                stroke="#d4a017"
                strokeWidth="1"
                fill="rgba(212,160,23,0.05)"
              />
            </svg>
          </div>
        ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-2xl w-full">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto border border-yellow-600/30">
            <img
              src="/images/main-log-bg.png"
              alt="logo"
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>

        {/* Badge */}
        <span className="mb-5 text-xs uppercase tracking-widest text-yellow-500">
          Launching Soon
        </span>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-bold text-white">{title}</h1>

        {/* Description */}
        <p className="mb-10 text-gray-400 max-w-md">{description}</p>

        {/* Email Form */}
        <div className="w-full max-w-sm">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 border border-yellow-500/20 text-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3 rounded-xl bg-yellow-600 text-black font-semibold"
              >
                Notify
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="text-yellow-500" />
              <p className="text-yellow-400 font-semibold">
                You&apos;re on the list!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatHex {
          0%,100% { transform: translateY(0); opacity: 0.1 }
          50% { transform: translateY(-20px); opacity: 0.2 }
        }
      `}</style>
    </div>
  );
}

// /* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import { useEffect, useState } from "react";
// import { Mail, Sparkles } from "lucide-react";

// type ComingSoonProps = {
//   title?: string;
//   description?: string;
// };

// export default function ComingSoonPage({ title = "Something remarkable is on its way.",
//   description = "We’re putting the finishing touches on something amazing.",}) {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [particles, setParticles] = useState<
//     { x: number; y: number; size: number; delay: number; duration: number }[]
//   >([]);
//   const [mounted, setMounted] = useState(false);

//   // Countdown target — adjust as needed
//   const TARGET = new Date("2025-10-01T00:00:00");
//   const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

//   useEffect(() => {
//     setMounted(true);
//     setParticles(
//       Array.from({ length: 20 }, () => ({
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: Math.random() * 20 + 8,
//         delay: Math.random() * 8,
//         duration: Math.random() * 8 + 10,
//       }))
//     );

//     const tick = () => {
//       const diff = TARGET.getTime() - Date.now();
//       if (diff <= 0) return setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
//       setTimeLeft({
//         d: Math.floor(diff / 86_400_000),
//         h: Math.floor((diff % 86_400_000) / 3_600_000),
//         m: Math.floor((diff % 3_600_000) / 60_000),
//         s: Math.floor((diff % 60_000) / 1_000),
//       });
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, []);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (email) setSubmitted(true);
//   };

//   const pad = (n: number) => String(n).padStart(2, "0");

//   return (
//     <div
//       className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
//       style={{
//         background: "linear-gradient(160deg, #070e1a 0%, #0b1825 50%, #0f1e30 100%)",
//         fontFamily: "'Georgia', 'Times New Roman', serif",
//       }}
//     >
//       {/* ── Hex grid ── */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52'%3E%3Cpath d='M15 2l15 8.66v17.32L15 36.64 0 27.98V10.66z' fill='none' stroke='%23c8991a' stroke-width='0.7'/%3E%3Cpath d='M45 2l15 8.66v17.32L45 36.64 30 27.98V10.66z' fill='none' stroke='%23c8991a' stroke-width='0.7'/%3E%3C/svg%3E")`,
//           backgroundSize: "60px 52px",
//           opacity: 0.03,
//         }}
//       />

//       {/* ── Central glow ── */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212,160,23,0.09) 0%, transparent 65%)",
//         }}
//       />

//       {/* ── Floating hex particles ── */}
//       {mounted &&
//         particles.map((p, i) => (
//           <div
//             key={i}
//             className="absolute pointer-events-none"
//             style={{
//               left: `${p.x}%`,
//               top: `${p.y}%`,
//               width: p.size,
//               height: p.size,
//               opacity: 0,
//               animation: `floatHex ${p.duration}s ease-in-out ${p.delay}s infinite`,
//             }}
//           >
//             <svg viewBox="0 0 24 22" fill="none">
//               <path
//                 d="M6 1L18 1L24 11L18 21L6 21L0 11Z"
//                 stroke="#d4a017"
//                 strokeWidth="1"
//                 fill="rgba(212,160,23,0.05)"
//               />
//             </svg>
//           </div>
//         ))}

//       {/* ══════════════════════════
//           CONTENT
//       ══════════════════════════ */}
//       <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-2xl w-full">

//         {/* Logo */}
//         <div
//           className="mb-10"
//           style={{ animation: "fadeDown 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
//         >
//           <div
//             className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto"
//             style={{
//               background: "linear-gradient(135deg, rgba(212,160,23,0.18), rgba(212,160,23,0.06))",
//               border: "1px solid rgba(212,160,23,0.28)",
//               boxShadow: "0 0 40px rgba(212,160,23,0.15), inset 0 1px 0 rgba(212,160,23,0.2)",
//             }}
//           >
//             <img
//               src="/images/main-log-bg.png"
//               alt="BEE"
//               className="w-10 h-10 object-contain"
//               onError={(e) => {
//                 const el = e.target as HTMLImageElement;
//                 el.style.display = "none";
//                 el.parentElement!.innerHTML = '<span style="font-size:28px">🐝</span>';
//               }}
//             />
//           </div>
//         </div>

//         {/* Eyebrow */}
//         <div
//           className="mb-5"
//           style={{ animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both" }}
//         >
//           <span
//             className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase px-4 py-1.5 rounded-full"
//             style={{
//               background: "rgba(212,160,23,0.08)",
//               border: "1px solid rgba(212,160,23,0.2)",
//               color: "#c8991a",
//               fontFamily: "system-ui, sans-serif",
//               fontWeight: 600,
//             }}
//           >
//             <span
//               className="w-1.5 h-1.5 rounded-full inline-block"
//               style={{ background: "#d4a017", animation: "blink 1.6s ease-in-out infinite" }}
//             />
//             Launching Soon
//           </span>
//         </div>

//         {/* Main heading */}
//         <h1
//           className="mb-4 leading-[1.08]"
//           style={{
//             fontSize: "clamp(2.6rem, 7vw, 4.5rem)",
//             fontWeight: 800,
//             color: "#f5f0e8",
//             letterSpacing: "-0.02em",
//             animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both",
//           }}
//         >
//           Something{" "}
//           <span
//             style={{
//               background: "linear-gradient(90deg, #d4a017, #f0c040, #d4a017)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               backgroundSize: "200% 100%",
//               animation: "shimmerText 3s ease-in-out infinite",
//             }}
//           >
//             remarkable
//           </span>
//           <br />
//           is on its way.
//         </h1>

//         {/* Sub */}
//         <p
//           className="mb-12 text-base leading-relaxed max-w-md"
//           style={{
//             color: "rgba(255,255,255,0.42)",
//             fontFamily: "system-ui, sans-serif",
//             fontWeight: 400,
//             animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both",
//           }}
//         >
//           BEE Smart Campaigns is being polished to perfection.
//           We&apos;re putting the finishing touches on an intelligent
//           campaign platform built for modern teams.
//         </p>

//         {/* ── Countdown ── */}
//         {/* <div
//           className="flex items-center gap-4 sm:gap-6 mb-12"
//           style={{ animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both" }}
//         >
//           {[
//             { label: "Days", value: timeLeft.d },
//             { label: "Hours", value: timeLeft.h },
//             { label: "Mins", value: timeLeft.m },
//             { label: "Secs", value: timeLeft.s },
//           ].map(({ label, value }, i) => (
//             <div key={label} className="flex items-center gap-4 sm:gap-6">
//               <div className="flex flex-col items-center">
//                 <div
//                   className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center"
//                   style={{
//                     background: "rgba(212,160,23,0.07)",
//                     border: "1px solid rgba(212,160,23,0.2)",
//                     boxShadow: "inset 0 1px 0 rgba(212,160,23,0.12)",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: "clamp(1.4rem, 4vw, 2rem)",
//                       fontWeight: 700,
//                       color: "#f0c040",
//                       fontVariantNumeric: "tabular-nums",
//                       fontFamily: "system-ui, sans-serif",
//                       lineHeight: 1,
//                     }}
//                   >
//                     {pad(value)}
//                   </span>
//                 </div>
//                 <span
//                   className="mt-2 text-[10px] tracking-[0.15em] uppercase"
//                   style={{ color: "rgba(255,255,255,0.28)", fontFamily: "system-ui, sans-serif" }}
//                 >
//                   {label}
//                 </span>
//               </div>
//               {i < 3 && (
//                 <span
//                   style={{
//                     color: "rgba(212,160,23,0.4)",
//                     fontSize: "1.5rem",
//                     fontWeight: 300,
//                     marginTop: "-12px",
//                   }}
//                 >
//                   :
//                 </span>
//               )}
//             </div>
//           ))}
//         </div> */}

//         {/* ── Divider ── */}
//         <div
//           className="w-full max-w-sm h-px mb-8"
//           style={{
//             background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.18), transparent)",
//             animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both",
//           }}
//         />

//         {/* ── Email form ── */}
//         <div
//           className="w-full max-w-sm"
//           style={{ animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both" }}
//         >
//           {!submitted ? (
//             <>
//               <p
//                 className="text-xs tracking-[0.14em] uppercase mb-3"
//                 style={{
//                   color: "rgba(255,255,255,0.28)",
//                   fontFamily: "system-ui, sans-serif",
//                 }}
//               >
//                 Be the first to know
//               </p>
//               <form onSubmit={handleSubmit} className="flex gap-2">
//                 <div className="relative flex-1">
//                   <Mail
//                     className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
//                     style={{ color: "rgba(255,255,255,0.22)" }}
//                   />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="your@email.com"
//                     required
//                     className="w-full pl-10 pr-3 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all duration-200"
//                     style={{
//                       background: "rgba(255,255,255,0.04)",
//                       border: "1px solid rgba(212,160,23,0.18)",
//                       fontFamily: "system-ui, sans-serif",
//                     }}
//                     onFocus={(e) => (e.target.style.borderColor = "rgba(212,160,23,0.55)")}
//                     onBlur={(e) => (e.target.style.borderColor = "rgba(212,160,23,0.18)")}
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="px-5 py-3 rounded-xl text-sm font-bold shrink-0 transition-all duration-200 hover:brightness-110 active:scale-95"
//                   style={{
//                     background: "linear-gradient(135deg, #d4a017, #c08a10)",
//                     color: "#080f1c",
//                     fontFamily: "system-ui, sans-serif",
//                   }}
//                 >
//                   Notify Me
//                 </button>
//               </form>
//             </>
//           ) : (
//             <div
//               className="flex flex-col items-center gap-2 py-5 rounded-2xl"
//               style={{
//                 background: "rgba(212,160,23,0.07)",
//                 border: "1px solid rgba(212,160,23,0.2)",
//                 animation: "fadeUp 0.4s ease both",
//               }}
//             >
//               <Sparkles className="w-5 h-5" style={{ color: "#d4a017" }} />
//               <p
//                 className="text-sm font-bold"
//                 style={{ color: "#f0c040", fontFamily: "system-ui, sans-serif" }}
//               >
//                 You&apos;re on the list!
//               </p>
//               <p
//                 className="text-xs"
//                 style={{
//                   color: "rgba(255,255,255,0.35)",
//                   fontFamily: "system-ui, sans-serif",
//                 }}
//               >
//                 We&apos;ll reach out the moment we launch.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Footer ── */}
//       <p
//         className="absolute bottom-6 text-[11px] tracking-wide"
//         style={{
//           color: "rgba(255,255,255,0.16)",
//           fontFamily: "system-ui, sans-serif",
//           animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both",
//         }}
//       >
//         🐝 BEE Smart Campaigns — Intelligent Connectivity
//       </p>

//       <style>{`
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(18px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes fadeDown {
//           from { opacity: 0; transform: translateY(-16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes floatHex {
//           0%, 100% { transform: translateY(0)   rotate(0deg);  opacity: 0.08; }
//           50%       { transform: translateY(-18px) rotate(12deg); opacity: 0.18; }
//         }
//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50%       { opacity: 0.15; }
//         }
//         @keyframes shimmerText {
//           0%   { background-position: 0%   center; }
//           50%  { background-position: 100% center; }
//           100% { background-position: 0%   center; }
//         }
//       `}</style>
//     </div>
//   );
// }
