import React from "react";
import Link from "next/link";
import { PasswordChecker } from "../components/PasswordChecker";
import { ShieldCheck } from "lucide-react";

/**
 * Clean top navigation header with tab switching between features.
 */
function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Live Fighting Logo Arena */}
          <div className="relative flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#0D1322] border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)] overflow-hidden">
            <div className="bug-active w-4 h-4 rounded bg-amber-500/90 border border-amber-300 flex items-center justify-center text-[9px] shadow-[0_0_8px_rgba(245,158,11,0.8)]">
              👾
            </div>

            <div className="clash-active absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs pointer-events-none text-cyan-300">
              ⚡
            </div>

            <img
              src="/logo.png"
              alt="Cyber Defender"
              className="fighter-active w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_10px_rgba(0,255,102,0.6)]"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 text-sm tracking-tight">PassGuard</span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 animate-pulse">
                FIGHTING LIVE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">Mecha Cyber Defense</span>
          </div>
        </Link>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#0D1322] border border-slate-800 p-1 rounded-xl text-xs">
    <span className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 text-[11px] sm:text-xs">
      Password
    </span>
    <Link
      href="/breach"
      className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
    >
      Breach
    </Link>
    <Link
      href="/phishing"
      className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
    >
      Phishing Check
    </Link>
    <Link
      href="/chat"
      className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
    >
      Chat Bot
    </Link>
  </div>
          <span className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 text-[11px] sm:text-xs">
            Password
          </span>
          <Link
            href="/breach"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
          >
            Breach
          </Link>
          <Link
            href="/phishing"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
          >
            Phishing Check
          </Link>
        </div>
      </div>
    </header>
  );
}

/**
 * Minimalist clean footer.
 */
function Footer() {
  return (
    <footer className="border-t border-slate-800/80 py-5 text-center text-xs text-slate-400">
      <p>100% Client-Side Privacy: Password aapke browser se bahar kahin nahi jaata.</p>
    </footer>
  );
}

/**
 * Main Home Page rendering the refreshed Password Strength Checker.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      <div>
        <Header />

        <div className="max-w-2xl mx-auto px-4 pt-8 pb-4 text-center space-y-2 relative z-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Password Strength Checker
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Apne password ki security live check karein aur jaanein use crack karne me kitna time lagega.
          </p>
        </div>

        <div className="max-w-2xl mx-auto px-4 pb-12 relative z-10">
          <PasswordChecker />
        </div>
      </div>

      <Footer />
    </div>
  );
}
