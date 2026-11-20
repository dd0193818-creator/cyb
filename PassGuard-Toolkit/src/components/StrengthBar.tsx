import React from "react";
import { StrengthTier } from "../utils/passwordAnalyzer";

interface StrengthBarProps {
  scorePercent: number;
  tier: StrengthTier;
  hasInput: boolean;
}

/**
 * Returns human-friendly text label and clean colors for each strength tier.
 */
function getTierStyle(tier: StrengthTier, hasInput: boolean) {
  if (!hasInput) {
    return {
      label: "Kuch type karein",
      textColor: "text-slate-400",
      barColor: "bg-slate-600",
      width: "0%",
    };
  }

  switch (tier) {
    case "VERY_WEAK":
      return {
        label: "Weak (Common password)",
        textColor: "text-rose-400",
        barColor: "bg-rose-500",
        width: "15%",
      };
    case "WEAK":
      return {
        label: "Weak",
        textColor: "text-rose-400",
        barColor: "bg-rose-500",
        width: "30%",
      };
    case "MEDIUM":
      return {
        label: "Medium",
        textColor: "text-amber-400",
        barColor: "bg-amber-500",
        width: "60%",
      };
    case "STRONG":
      return {
        label: "Strong",
        textColor: "text-emerald-400",
        barColor: "bg-emerald-500",
        width: "85%",
      };
    case "VERY_STRONG":
      return {
        label: "Very Strong",
        textColor: "text-emerald-300",
        barColor: "bg-emerald-400",
        width: "100%",
      };
  }
}

/**
 * Renders a clean modern strength indicator with animated bar.
 */
export const StrengthBar: React.FC<StrengthBarProps> = ({ tier, hasInput }) => {
  const style = getTierStyle(tier, hasInput);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">Strength:</span>
        <span className={`font-semibold ${style.textColor}`}>
          {style.label}
        </span>
      </div>

      <div className="w-full bg-slate-800/60 rounded-full h-2.5 overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-300 ${style.barColor}`}
          style={{ width: style.width }}
        />
      </div>
    </div>
  );
};
