"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Sparkles, Mail, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export default function ComingSoon({
  title = "Coming Soon",
  description = "This feature is currently under development. Stay tuned!",
  backHref = "/",
  backLabel = "Back to Home",
}: ComingSoonProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [particles, setParticles] = useState<
    { x: number; y: number; size: number; delay: number; duration: number }[]
  >([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Generate floating hex particles
    setParticles(
      Array.from({ length: 18 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 24 + 10,
        delay: Math.random() * 6,
        duration: Math.random() * 6 + 8,
      })),
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center overflow-hidden px-4 py-16"
      style={{
        background:
          "linear-gradient(160deg, #0a1525 0%, #0d1b2e 40%, #111f35 100%)",
      }}
    >
      {/* ── Hex grid background ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='52'%3E%3Cpath d='M15 2l15 8.66v17.32L15 36.64 0 27.98V10.66z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3Cpath d='M45 2l15 8.66v17.32L45 36.64 30 27.98V10.66z' fill='none' stroke='%23d4a017' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 52px",
        }}
      />

      {/* ── Radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,160,23,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Floating hex particles ── */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.12,
            animation: `floatHex ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        >
          <svg
            viewBox="0 0 24 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1L18 1L24 11L18 21L6 21L0 11Z"
              stroke="#d4a017"
              strokeWidth="1.2"
              fill="rgba(212,160,23,0.08)"
            />
          </svg>
        </div>
      ))}

      {/* ── Back link ── */}
      <Link
        href={backHref}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-white/50 hover:text-[#f0c040] transition-colors duration-200 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        {backLabel}
      </Link>

      {/* ── Main card ── */}
      <div
        className="relative z-10 w-full max-w-xl"
        style={{ animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Running border — conic gradient rotating behind the card */}
        <div
          className="absolute -inset-[2px] rounded-2xl pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{ animation: "rotateBorder 3s linear infinite" }}
          >
            <div
              className="absolute"
              style={{
                inset: "-100%",
                background:
                  "conic-gradient(from 0deg, transparent 0%, transparent 55%, #f0c040 65%, #d4a017 70%, #f0c040 75%, transparent 85%, transparent 100%)",
              }}
            />
          </div>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden p-8 sm:p-10"
          style={{
            background:
              "linear-gradient(145deg, rgba(21,35,56,0.97) 0%, rgba(13,27,46,0.99) 100%)",
            margin: "2px",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,160,23,0.1)",
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, #d4a017, transparent)",
            }}
          />

          {/* Icon cluster */}
          <div className="flex justify-center mb-7">
            <div className="relative">
              {/* Outer pulse ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(212,160,23,0.12)",
                  animation: "pulse 2.5s ease-in-out infinite",
                  transform: "scale(1.6)",
                }}
              />
              {/* Inner ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(212,160,23,0.08)",
                  animation: "pulse 2.5s ease-in-out 0.4s infinite",
                  transform: "scale(1.3)",
                }}
              />
              {/* <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(212,160,23,0.2), rgba(212,160,23,0.08))",
                  border: "1px solid rgba(212,160,23,0.35)",
                  boxShadow: "0 0 30px rgba(212,160,23,0.2)",
                }}
              > */}
                {/* <span className="text-3xl">🐝</span> */}
                <img
                  src="/images/main-log-bg.png"
                  alt="Bee"
                  className="w-8 h-8 object-contain"
                />
              {/* </div> */}
            </div>
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-5">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.25)",
                color: "#d4a017",
              }}
            >
              <Zap className="w-3 h-3" />
              Comming Soon
            </div>
          </div>

          {/* Title */}
          <h1
            className="text-center text-2xl sm:text-3xl font-extrabold mb-3 leading-tight"
            style={{ color: "#f5f5f5" }}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className="text-center text-sm leading-relaxed mb-8 max-w-sm mx-auto"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {description}
          </p>

          {/* Divider */}
          <div
            className="w-full h-px mb-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.15), transparent)",
            }}
          />

          {/* Notify form */}
          {!submitted ? (
            <div>
              <p
                className="text-center text-xs font-medium tracking-wider uppercase mb-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Get notified when it's ready
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(212,160,23,0.2)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(212,160,23,0.5)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(212,160,23,0.2)")
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95 shrink-0"
                  style={{ background: "#d4a017", color: "#0d1b2e" }}
                >
                  Notify Me
                </button>
              </form>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2 py-4 rounded-xl"
              style={{
                background: "rgba(212,160,23,0.08)",
                border: "1px solid rgba(212,160,23,0.2)",
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: "#d4a017" }} />
              <p className="text-sm font-semibold" style={{ color: "#f0c040" }}>
                You're on the list!
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                We'll notify you the moment this goes live.
              </p>
            </div>
          )}

          {/* Footer pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {[
              "Smart Segmentation",
              "Automated Workflows",
              "Real-Time Analytics",
            ].map((feat) => (
              <span
                key={feat}
                className="text-[11px] px-3 py-1 rounded-full font-medium"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                {feat}
              </span>
            ))}
          </div>

          {/* Bottom accent */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(212,160,23,0.1), transparent)",
            }}
          />
        </div>
      </div>

      {/* Footer note */}
      <p
        className="relative z-10 mt-8 text-xs"
        style={{
          color: "rgba(255,255,255,0.2)",
          animation: "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both",
        }}
      >
        🐝 BEE Smart Campaigns — Intelligent Connectivity
      </p>

      <style>{`
        @keyframes rotateBorder {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes floatHex {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.12; }
          50%       { transform: translateY(-20px) rotate(15deg); opacity: 0.22; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1.3); }
          50%       { opacity: 1;   transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}
