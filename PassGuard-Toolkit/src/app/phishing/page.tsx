"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  analyzePhishingEmail,
  PhishingAnalysisResult,
  PhishingFlag,
} from "../../utils/phishingAnalyzer";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  FileWarning,
  ExternalLink,
  Mail,
  Flame,
  Copy,
  Trash2,
  HelpCircle,
} from "lucide-react";

/**
 * Pre-configured realistic phishing and legitimate email templates for quick 1-click testing.
 */
const SAMPLE_EMAILS = [
  {
    name: "PayPal Phishing Scam",
    text: `From: Security Team <service-update@paypa1-security-alert.xyz>
Subject: URGENT: Account Suspended within 24 hours!

Dear Customer,

We detected unauthorized activity on your PayPal account from an unknown IP address (194.26.29.112).
Your account has been temporarily suspended to protect your funds.

Immediate action required! You must verify your account and confirm your identity within 24 hours, or your account will be permanently terminated.

Click here to restore access:
http://paypa1-security-login.xyz/verify-account

Do not ignore this final notice.
PayPal Security Operations`,
  },
  {
    name: "Malicious Invoice with Attachment",
    text: `From: Billing Dept <accounts@gmail.com>
Subject: Final Notice: Overdue Invoice #INV-9821

Dear Account Holder,

Please find attached your overdue remittance statement invoice_9821.zip.
Immediate action required to avoid legal action and penalty charges.

Kindly download the invoice_9821.zip archive and review the details.
Password to open zip file: 12345

Best Regards,
Corporate Billing Desk`,
  },
  {
    name: "Legitimate Newsletter",
    text: `From: GitHub Team <notifications@github.com>
Subject: Summary of your weekly pull request activity

Hi Alex,

Here is your weekly digest for the repositories you follow.
3 pull requests were merged into main this week.

You can view the full activity on your GitHub dashboard:
https://github.com/dashboard

Thanks,
The GitHub Team`,
  },
];

/**
 * Returns color classes and badges for severity levels.
 */
function getSeverityBadge(severity: PhishingFlag["severity"]) {
  switch (severity) {
    case "HIGH":
      return "bg-rose-500/20 text-rose-300 border-rose-500/40";
    case "MEDIUM":
      return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    case "LOW":
      return "bg-blue-500/20 text-blue-300 border-blue-500/40";
  }
}

/**
 * Clean Top Navigation Header with the live green warrior logo and 3 tabs.
 */
function PhishingHeader() {
  return (
    <header className="border-b border-slate-800/80 bg-[#090D16]/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Live Fighting Logo */}
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

        {/* 3 Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#0D1322] border border-slate-800 p-1 rounded-xl text-xs">
  <Link
    href="/"
    className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
  >
    Password
  </Link>
  <Link
    href="/breach"
    className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
  >
    Breach
  </Link>
  <span className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 text-[11px] sm:text-xs">
    Phishing Check
  </span>
  <Link
    href="/chat"
    className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
  >
    Chat Bot
  </Link>
</div>
          <Link
            href="/"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
          >
            Password
          </Link>
          <Link
            href="/breach"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-colors text-[11px] sm:text-xs"
          >
            Breach
          </Link>
          <span className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 text-[11px] sm:text-xs">
            Phishing Check
          </span>
        </div>
      </div>
    </header>
  );
}

/**
 * Minimalist Footer with Zero-Storage Privacy Guarantee.
 */
function PhishingFooter() {
  return (
    <footer className="border-t border-slate-800/80 py-5 text-center text-xs text-slate-400">
      <p>100% Client-Side Evaluation: Email ka koi bhi hissa server par save ya transmit nahi hota.</p>
    </footer>
  );
}

/**
 * Main Phishing Detector Page Component.
 */
export default function PhishingPage() {
  const [emailText, setEmailText] = useState("");
  const [analysis, setAnalysis] = useState<PhishingAnalysisResult | null>(null);
  const [highlightHTML, setHighlightHTML] = useState<string>("");
  const [customTerm, setCustomTerm] = useState<string>("");

  /**
   * Wraps matched terms in the text with a <mark> using the .highlight CSS class.
   * Simple HTML escaping is performed to avoid XSS.
   */
  const highlightMatches = (text: string, terms: string[]): string => {
    // Escape HTML entities
    const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let escaped = escapeHtml(text);
    // Sort terms by length descending to avoid partial overlapping replacements
    const sorted = [...terms].sort((a, b) => b.length - a.length);
    sorted.forEach((term) => {
      if (!term) return;
      const escapedTerm = escapeHtml(term);
      // Create a global case‑insensitive regex, escape special characters
      const regex = new RegExp(escapedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      escaped = escaped.replace(regex, `<mark class="highlight">${escapedTerm}</mark>`);
    });
    return escaped;
  };

  /**
   * Executes client‑side rule‑based analysis on the pasted email text.
   */
  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = analyzePhishingEmail(emailText);
    setAnalysis(result);
    // Gather terms from analysis flags and optional custom term
    const flagTerms = result.flags.flatMap((f) => f.matchedItems);
    const allTerms = customTerm ? [...flagTerms, customTerm] : flagTerms;
    setHighlightHTML(highlightMatches(emailText, allTerms));
  };

  /**
   * Loads pre‑defined email samples for instant testing.
   */
  const handleLoadSample = (sampleText: string) => {
    setEmailText(sampleText);
    const result = analyzePhishingEmail(sampleText);
    setAnalysis(result);
    const flagTerms = result.flags.flatMap((f) => f.matchedItems);
    const allTerms = customTerm ? [...flagTerms, customTerm] : flagTerms;
    setHighlightHTML(highlightMatches(sampleText, allTerms));
  };

  /**
   * Clears the textarea and reset analysis results.
   */
  const handleClear = () => {
    setEmailText("");
    setAnalysis(null);
    setHighlightHTML("");
  };

  // Update highlights when custom term changes (if analysis already present)
  React.useEffect(() => {
    if (analysis && emailText) {
      const flagTerms = analysis.flags.flatMap((f) => f.matchedItems);
      const allTerms = customTerm ? [...flagTerms, customTerm] : flagTerms;
      setHighlightHTML(highlightMatches(emailText, allTerms));
    }
  }, [customTerm]);

  return (
  const [emailText, setEmailText] = useState("");
  const [analysis, setAnalysis] = useState<PhishingAnalysisResult | null>(null);

  /**
   * Executes client-side rule-based analysis on the pasted email text.
   */
  const handleAnalyze = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const result = analyzePhishingEmail(emailText);
    setAnalysis(result);
  };

  /**
   * Loads pre-defined email samples for instant testing.
   */
  const handleLoadSample = (sampleText: string) => {
    setEmailText(sampleText);
    const result = analyzePhishingEmail(sampleText);
    setAnalysis(result);
  };

  /**
   * Clears the textarea and reset analysis results.
   */
  const handleClear = () => {
    setEmailText("");
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      <div>
        <PhishingHeader />

        <div className="max-w-3xl mx-auto px-4 pt-8 pb-4 text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-1">
            <Flame className="w-3.5 h-3.5 text-blue-400" />
            Rule-Based Phishing & Scam Engine
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Phishing Email Analyzer
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Raw email paste karein aur urgent words, fake domains, suspicious links, aur attachments ka live risk score dekhein.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="max-w-3xl mx-auto px-3.5 sm:px-4 pb-12 relative z-10 space-y-6">
          
          {/* Input Card */}
          <div className="bg-[#0D1322]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 sm:p-7 shadow-2xl space-y-4">
            
            {/* Quick Sample Selector */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-400" />
                Raw Email Content Paste Karein:
              </span>

              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-slate-400">Samples:</span>
                {SAMPLE_EMAILS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadSample(s.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                rows={9}
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="From: Security <alert@domain.com>&#10;Subject: Urgent Action Required!&#10;&#10;Paste full email body or headers here..."
                spellCheck="false"
                className="w-full rounded-xl bg-[#090D16] border border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-white placeholder-slate-500 p-4 font-mono text-xs sm:text-sm outline-none transition-all leading-relaxed"
              />

              {emailText && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={!emailText.trim()}
                className="flex items-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20"
              >
                <ShieldAlert className="w-4 h-4" />
                Phishing Check Karein
              </button>

              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Server Storage • 100% Client-Side Privacy
              </span>
            </div>
          </div>

          {/* Analysis Results Display */}
          {analysis && emailText.trim() && (
            <div className="space-y-6">
              
              {/* Risk Score Card */}
              <div className="bg-[#0D1322]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                      Phishing Risk Score
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl sm:text-5xl font-extrabold text-white">
                        {analysis.score}
                        <span className="text-lg text-slate-400 font-normal"> / 100</span>
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${analysis.badgeColor}`}
                      >
                        {analysis.riskLevel === "HIGH"
                          ? "CRITICAL PHISHING RISK"
                          : analysis.riskLevel === "MODERATE"
                          ? "SUSPICIOUS / MODERATE"
                          : "SAFE / LOW RISK"}
                      </span>
                    </div>
                  </div>

                  {/* Visual Gauge Bar */}
                  <div className="w-full sm:w-48 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>0 Safe</span>
                      <span>50 Sus</span>
                      <span>100 Danger</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          analysis.score >= 65
                            ? "bg-rose-500"
                            : analysis.score >= 25
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.max(analysis.score, 5)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Flags & Reasons Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                  <span>Detected Threat Indicators & Flags ({analysis.flags.length})</span>
                  <span>Rule Severity</span>
                </div>

                {analysis.flags.length === 0 ? (
                  <div className="bg-[#0D1322] border border-emerald-500/30 rounded-xl p-5 text-center text-xs text-emerald-300 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Koi bhi phishing ya spoofing flag detect nahi hua. Email safe lag raha hai.</span>
                  </div>
                ) : (
                  analysis.flags.map((flag) => (
                    <div
                      key={flag.id}
                      className="bg-[#0D1322]/90 border border-slate-700/60 rounded-xl p-4 sm:p-5 space-y-2.5 hover:border-slate-600 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <h4 className="text-sm font-bold text-white tracking-tight">
                            {flag.title}
                          </h4>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(
                            flag.severity
                          )}`}
                        >
                          {flag.severity} (+{flag.points} pts)
                        </span>
                      </div>

                      {/* Flag Reason */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {flag.reason}
                      </p>

                      {/* Matched Keywords / Items */}
                      {flag.matchedItems.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {flag.matchedItems.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-[11px] font-mono text-slate-300"
                            >
                              "{item}"
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Highlight Term Input */}
<div className="max-w-3xl mx-auto px-4 sm:px-6 mt-2">
  <div className="flex items-center gap-2">
    <input
      type="text"
      placeholder="Custom highlight term"
      value={customTerm}
      onChange={(e) => setCustomTerm(e.target.value)}
      className="flex-1 px-3 py-2 rounded bg-[#090D16] border border-slate-700/80 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500"
    />
    <button
      type="button"
      onClick={handleAnalyze}
      disabled={!emailText.trim()}
      className="px-4 py-2 rounded bg-amber-500/20 border border-amber-400 text-amber-300 hover:bg-amber-500/30"
    >
      Highlight
    </button>
  </div>
</div>
{/* Highlighted Email Preview */}
{highlightHTML && (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4">
    <h2 className="text-sm font-medium text-slate-300 mb-2">Highlighted Email Preview</h2>
    <pre
      className="whitespace-pre-wrap bg-[#0D1322]/90 backdrop-blur-xl border border-slate-700/60 rounded-xl p-4 font-mono text-xs sm:text-sm text-white overflow-auto"
      dangerouslySetInnerHTML={{ __html: highlightHTML }}
    />
  </div>
)}
<PhishingFooter />
    </div>
  );
}
