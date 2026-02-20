import Link from "next/link";
import { ShieldCheck, User, Mail, BarChart2, Users, Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,160,23,0.2)" }}
    >
      {/* Header */}
      <div className="px-8 pt-8 pb-5">
        <h1 className="text-[22px] font-bold text-white leading-tight">
          Welcome to<br />
          <span style={{ color: "#f0c040" }}>BEE Smart Campaigns</span>
        </h1>
        <p className="text-[13px] mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          The all-in-one email & campaign management platform
        </p>
      </div>

      {/* Stats strip */}
      <div
        className="mx-8 rounded-xl px-5 py-3 mb-5 grid grid-cols-3 gap-2"
        style={{ background: "rgba(212,160,23,0.07)", border: "1px solid rgba(212,160,23,0.15)" }}
      >
        {[
          { icon: Mail, value: "4M+", label: "Emails / mo" },
          { icon: Users, value: "12K+", label: "Active clients" },
          { icon: BarChart2, value: "98%", label: "Delivery rate" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <Icon size={13} style={{ color: "#d4a017" }} />
            <span className="text-[14px] font-bold" style={{ color: "#f0c040" }}>{value}</span>
            <span className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Divider label */}
      <div className="px-8 mb-3">
        <p className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: "rgba(255,255,255,0.25)" }}>
          Continue as
        </p>
      </div>

      {/* Login options */}
      <div className="px-8 pb-6 space-y-3">

        {/* Admin */}
        <Link
          href="/login/admin"
          className="flex items-center gap-4 rounded-xl px-5 py-4 group transition-all duration-200 hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, rgba(212,160,23,0.14), rgba(212,160,23,0.06))",
            border: "1.5px solid rgba(212,160,23,0.4)",
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#d4a017" }}>
            <ShieldCheck size={18} color="#0d1b2e" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold" style={{ color: "#f0c040" }}>Administrator</p>
            <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.38)" }}>Manage platform, users &amp; analytics</p>
          </div>
          <div
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: "rgba(212,160,23,0.2)", color: "#d4a017" }}
          >
            Admin
          </div>
        </Link>

        {/* Client */}
        <Link
          href="/login/client"
          className="flex items-center gap-4 rounded-xl px-5 py-4 group transition-all duration-200 hover:brightness-125"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1.5px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(212,160,23,0.1)", border: "1.5px solid rgba(212,160,23,0.3)" }}
          >
            <User size={18} style={{ color: "#d4a017" }} />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-white">Client</p>
            <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.38)" }}>Launch campaigns &amp; track performance</p>
          </div>
          <div
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}
          >
            Client
          </div>
        </Link>

      </div>

      {/* Feature pills */}
      {/* <div
        className="px-8 py-4 border-t flex flex-wrap gap-2"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {[
          { icon: Zap, text: "Smart Segmentation" },
          { icon: Mail, text: "Automated Workflows" },
          { icon: BarChart2, text: "Real-Time Analytics" },
        ].map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.35)" }}
          >
            <Icon size={11} style={{ color: "#d4a017" }} />
            {text}
          </div>
        ))}
      </div> */}

      {/* Footer */}
      <div className="px-8 pb-5 pt-1">
        <p className="text-center text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          By signing in you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:opacity-60 transition-opacity" style={{ color: "rgba(255,255,255,0.35)" }}>
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:opacity-60 transition-opacity" style={{ color: "rgba(255,255,255,0.35)" }}>
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

// // Login Page
// export default function LoginPage() {
//   return (
//     <div className="rounded-lg bg-white dark:bg-gray-800 p-8 shadow-lg">
//       <div className="mb-6 text-center">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Sign In to BEE Smart Campaigns
//         </h1>
//         <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
//           Choose your login type
//         </p>
//       </div>
      
//       <div className="space-y-4">
//         <a
//           href="/login/admin"
//           className="block rounded-md bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
//         >
//           Admin Login
//         </a>
        
//         <a
//           href="/login/client"
//           className="block rounded-md border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition"
//         >
//           Client Login
//         </a>
//       </div>
      
//       <div className="mt-6 text-center">
//         {/* <p className="text-sm text-gray-600 dark:text-gray-400">
//           Don't have an account?{' '}
//           <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
//             Register your company
//           </a>
//         </p> */}
//       </div>
//     </div>
//   );
// }
