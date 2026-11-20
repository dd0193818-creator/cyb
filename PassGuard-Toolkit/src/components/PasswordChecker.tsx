"use client";

import React, { useState, useMemo } from "react";
import { analyzePassword } from "../utils/passwordAnalyzer";
import { StrengthBar } from "./StrengthBar";
import { CriteriaChecklist } from "./CriteriaChecklist";
import { CrackTimeDisplay } from "./CrackTimeDisplay";
import { Eye, EyeOff, Copy, Check, Sparkles, X } from "lucide-react";

/**
 * Generates a 16-character strong random password inside the browser.
 */
function generateRandomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*()_+~";
  const array = new Uint32Array(16);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
    return Array.from(array, (num) => chars[num % chars.length]).join("");
  }
  return Array.from({ length: 16 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/**
 * Main interactive Password Strength Checker component with clean UI.
 */
export const PasswordChecker: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live client-side evaluation on every keystroke
  const analysis = useMemo(() => {
    return analyzePassword(password);
  }, [password]);

  const hasInput = password.length > 0;

  /**
   * Copies current password to clipboard with temporary visual feedback.
   */
  const handleCopy = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  /**
   * Clears the password input.
   */
  const handleClear = () => {
    setPassword("");
  };

  /**
   * Generates and fills a high-security random password.
   */
  const handleGenerate = () => {
    setPassword(generateRandomPassword());
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0D1322]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 sm:p-7 shadow-2xl space-y-5 sm:space-y-6">
      {/* Input Box Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="pwd-input" className="font-medium text-slate-300">
            Password daalein
          </label>
          <span className="text-slate-400">
            {password.length} character{password.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            id="pwd-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Yahan type karein..."
            autoComplete="off"
            spellCheck="false"
            className="w-full rounded-xl bg-[#090D16] border border-slate-700/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-white placeholder-slate-500 px-4 py-3.5 pr-28 text-base outline-none transition-all"
          />

          {/* Action buttons inside input */}
          <div className="absolute right-2.5 flex items-center gap-1">
            {/* Show/Hide Toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Copy Button */}
            {hasInput && (
              <button
                type="button"
                onClick={handleCopy}
                title="Copy password"
                className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                aria-label="Copy password"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}

            {/* Clear Button */}
            {hasInput && (
              <button
                type="button"
                onClick={handleClear}
                title="Clear field"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                aria-label="Clear field"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Generate Button & Privacy Note */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Strong Password Suggest Karein
          </button>
          <span className="text-[11px] text-slate-400">Browser se bahar koi data nahi jaata</span>
        </div>
      </div>

      {/* Strength Bar */}
      <StrengthBar
        scorePercent={analysis.scorePercent}
        tier={analysis.tier}
        hasInput={hasInput}
      />

      {/* Cracking Time Estimation Card */}
      <CrackTimeDisplay
        crackTime={analysis.primaryCrackTime}
        tier={analysis.tier}
        hasInput={hasInput}
      />

      {/* Heuristic Checklist */}
      <CriteriaChecklist criteria={analysis.criteria} hasInput={hasInput} />
    </div>
  );
};
