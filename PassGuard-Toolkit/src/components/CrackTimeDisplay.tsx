import React from "react";
import { Clock } from "lucide-react";
import { StrengthTier } from "../utils/passwordAnalyzer";

interface CrackTimeDisplayProps {
  crackTime: string;
  tier: StrengthTier;
  hasInput: boolean;
}

/**
 * Returns a brief explanation in simple language based on strength level.
 */
function getExplanation(tier: StrengthTier, hasInput: boolean): string {
  if (!hasInput) return "Password daalne par estimate calculate hoga.";
  switch (tier) {
    case "VERY_WEAK":
      return "Ye password public leak dictionary mein maujood hai.";
    case "WEAK":
      return "Aam computer se bhi asaani se crack ho sakta hai.";
    case "MEDIUM":
      return "Basic attacks se safe hai, lekin aur lamba hona chahiye.";
    case "STRONG":
      return "Kaafi mazboot password hai. Brute force impossible hai.";
    case "VERY_STRONG":
      return "Supercomputer se bhi crack karne me sadiyan lag jayengi.";
  }
}

/**
 * Renders the clean cracking time estimation stat card.
 */
export const CrackTimeDisplay: React.FC<CrackTimeDisplayProps> = ({
  crackTime,
  tier,
  hasInput,
}) => {
  const explanation = getExplanation(tier, hasInput);

  return (
    <div className="rounded-xl bg-[#090D16]/90 border border-slate-800 p-3.5 sm:p-5 flex items-center justify-between gap-3 sm:gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          Crack karne me lagne wala time
        </div>
        <div className="text-lg sm:text-2xl font-bold text-white">
          {hasInput ? crackTime : "—"}
        </div>
        <p className="text-[11px] sm:text-xs text-slate-400">
          {explanation}
        </p>
      </div>

      {hasInput && (
        <span
          className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
            tier === "VERY_STRONG" || tier === "STRONG"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : tier === "MEDIUM"
              ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
          }`}
        >
          {tier === "VERY_STRONG" ? "Very Strong" : tier === "STRONG" ? "Strong" : tier === "MEDIUM" ? "Medium" : "Weak"}
        </span>
      )}
    </div>
  );
};
