import Link from "next/link";
import { LoginPopover } from "@/components/landing/LoginPopover";

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#0d1b2e" }}>
      <nav
        className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8 md:px-12 border-b"
        style={{ background: "#0d1b2e", borderColor: "rgba(212,160,23,0.2)" }}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {/* <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
            style={{ background: "linear-gradient(135deg, #f0c040, #d4a017)" }}
          > */}
            <img
            src="/images/main-log-bg.png"
            alt="Bee"
            className="w-8 h-8 object-contain"
          />
          {/* </div> */}
          <div className="flex flex-col leading-none">
            <span className="text-[14px] sm:text-[17px] font-bold tracking-wide" style={{ color: "#f0c040" }}>
              BEE Smart Campaigns
            </span>
            <span className="text-[10px] text-white/50 font-light tracking-widest sm:hidden">
              Intelligent Connectivity
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4 sm:gap-8">
          <span className="hidden sm:block text-sm font-light tracking-widest text-white/70">
            Intelligent Connectivity
          </span>
          <LoginPopover />
        </div>
      </nav>

      {children}
    </div>
  );
}