"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Mail, Search, AlertTriangle, CheckCircle2, Calendar, Database, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { BreachData, BreachResponse } from "../api/breach/route";

/**
 * Validates whether the given string is in valid email syntax.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Top Navigation Header with navigation between Password Checker and Breach Checker.
 */
function BreachHeader() {
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#0D1322] border border-slate-800 p-1 rounded-xl text-xs">
          <Link
            href="/"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
          >
            Password
          </Link>
          <span className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 text-[11px] sm:text-xs">
            Breach
          </span>
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
 * Clean Footer with Privacy Guarantee.
 */
function BreachFooter() {
  return (
    <footer className="border-t border-slate-800/80 py-5 text-center text-xs text-slate-400">
      <p>Zero-Storage Guarantee: Email kahin bhi save ya store nahi hota, sirf HIBP API se live check hota hai.</p>
    </footer>
  );
}

/**
 * Main Email Breach Checker Page Component.
 */
export default function BreachCheckerPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BreachResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchedEmail, setSearchedEmail] = useState("");

  /**
   * Handles email form submission and calls the Next.js /api/breach route.
   */
  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMsg("Kripya apna email address enter karein.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMsg("Kripya ek valid email format enter karein (jaise example@domain.com).");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    setSearchedEmail(cleanEmail);

    try {
      const response = await fetch("/api/breach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data: BreachResponse = await response.json();

      if (!response.ok && !data.success) {
        setErrorMsg(data.message || "Breach check karte waqt koi problem aayi.");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setErrorMsg("Network error: Server se connect nahi ho paya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      <div>
        <BreachHeader />

        <div className="max-w-2xl mx-auto px-4 pt-8 pb-4 text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Have I Been Pwned Integration
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Email Data Breach Checker
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Check karein ki aapka email kisi public data breach ya security leak me shamil toh nahi hua.
          </p>
        </div>

        {/* Input & Search Form */}
        <div className="max-w-2xl mx-auto px-4 pb-12 relative z-10 space-y-6">
          <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
            <form onSubmit={handleCheck} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-input" className="block text-xs font-medium text-slate-300">
                  Email Address Daalein
                </label>

                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="name@example.com"
                    autoComplete="off"
                    spellCheck="false"
                    className="w-full rounded-xl bg-[#090D16] border border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-white placeholder-slate-500 pl-10 pr-4 py-3.5 text-base outline-none transition-all"
                  />
                </div>
              </div>

              {/* Error Message if validation fails */}
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking Breaches...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Breach Check Karein
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Email store nahi hota</span>
              <span>HIBP v3 Database</span>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="space-y-4">
              {/* CLEAN STATE */}
              {result.clean ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-emerald-300">
                      Clean! Koi Breach Nahi Mila
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
                      Badhai ho! <strong className="text-white">{searchedEmail}</strong> kisi bhi known public data breach mein nahi mila.
                    </p>
                  </div>
                </div>
              ) : (
                /* BREACHED STATE */
                <div className="space-y-4">
                  {/* Summary Alert Banner */}
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-rose-300">
                        Pwned! {result.count} Data Breach{result.count > 1 ? "es" : ""} Me Mila
                      </h3>
                      <p className="text-slate-300 text-xs">
                        Email <strong className="text-white">{searchedEmail}</strong> niche diye gaye leaks mein expose hua hai.
                      </p>
                    </div>
                  </div>

                  {/* List of Breaches */}
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                      Exposed Breaches List:
                    </div>

                    {result.breaches.map((breach, idx) => (
                      <div
                        key={idx}
                        className="bg-[#0D1322] border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-colors"
                      >
                        {/* Title and Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <h4 className="text-base font-bold text-white flex items-center gap-2">
                            <span>{breach.title || breach.name}</span>
                          </h4>
                          <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#090D16] border border-slate-800 px-2.5 py-1 rounded-md">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            Breach Date: <span className="text-slate-200 font-medium">{breach.breachDate}</span>
                          </span>
                        </div>

                        {/* Compromised Data Classes */}
                        <div className="space-y-1.5">
                          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                            <Database className="w-3.5 h-3.5 text-rose-400" />
                            Compromised Data Types:
                          </span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {breach.dataClasses.map((item, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-rose-500/10 border border-rose-500/20 text-rose-300"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BreachFooter />
    </div>
  );
}
