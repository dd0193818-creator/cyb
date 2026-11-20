import React from "react";
import { PasswordCriteria } from "../utils/passwordAnalyzer";

interface CriteriaChecklistProps {
  criteria: PasswordCriteria;
  hasInput: boolean;
}

/**
 * Renders the clean requirement pills for length, upper, lower, numbers, symbols, and breach checks.
 */
export const CriteriaChecklist: React.FC<CriteriaChecklistProps> = ({ criteria, hasInput }) => {
  const items = [
    {
      id: "length",
      label: "Kam se kam 8 characters",
      met: criteria.minLength,
    },
    {
      id: "uppercase",
      label: "Uppercase letter (A-Z)",
      met: criteria.hasUppercase,
    },
    {
      id: "lowercase",
      label: "Lowercase letter (a-z)",
      met: criteria.hasLowercase,
    },
    {
      id: "number",
      label: "Number (0-9)",
      met: criteria.hasNumber,
    },
    {
      id: "symbol",
      label: "Special symbol (!@#$%^&*)",
      met: criteria.hasSymbol,
    },
    {
      id: "common",
      label: hasInput && !criteria.notCommon ? "Breached / Common password hai!" : "Common password nahi hona chahiye",
      met: criteria.notCommon,
      isBreached: hasInput && !criteria.notCommon,
    },
  ];

  return (
    <div className="space-y-3 pt-2 border-t border-slate-800/80">
      <div className="text-xs font-semibold text-slate-300">
        Password Requirements:
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors ${
              item.met
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : item.isBreached
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-[#090D16]/60 border-slate-800/60 text-slate-400"
            }`}
          >
            <span
              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                item.met
                  ? "bg-emerald-500 text-[#090D16]"
                  : item.isBreached
                  ? "bg-rose-500 text-white"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {item.met ? "✓" : item.isBreached ? "✕" : "●"}
            </span>
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
