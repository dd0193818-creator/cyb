import { isCommonPassword } from "./commonPasswords";

export interface PasswordCriteria {
  minLength: boolean;      // 8+ characters
  hasUppercase: boolean;   // A-Z
  hasLowercase: boolean;   // a-z
  hasNumber: boolean;      // 0-9
  hasSymbol: boolean;      // Special characters
  notCommon: boolean;      // Not in common dictionary list
}

export type StrengthTier = "VERY_WEAK" | "WEAK" | "MEDIUM" | "STRONG" | "VERY_STRONG";

export interface AttackVectorEstimate {
  name: string;
  speedLabel: string;
  guessesPerSec: number;
  timeFormatted: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE";
}

export interface AnalysisResult {
  password: string;
  length: number;
  criteria: PasswordCriteria;
  passedCount: number;
  charsetPoolSize: number;
  entropyBits: number;
  tier: StrengthTier;
  scorePercent: number;
  primaryCrackTime: string;
  attackVectors: AttackVectorEstimate[];
  suggestions: string[];
}

/**
 * Calculates the character pool size based on character variety present in the password.
 */
export function calculateCharsetPoolSize(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(password)) pool += 33;
  return pool;
}

/**
 * Computes Shannon information entropy in bits for the provided string.
 */
export function calculateEntropy(password: string, poolSize: number): number {
  if (!password || poolSize === 0) return 0;
  // Entropy E = Length * log2(PoolSize)
  const bits = password.length * (Math.log(poolSize) / Math.log(2));
  return Math.round(bits * 10) / 10;
}

/**
 * Formats seconds into human-readable duration strings like "3 hours" or "Centuries".
 */
export function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds > 3.154e15) return "Centuries (Millions of years)";
  if (seconds < 1) return "Instant (< 1 sec)";
  if (seconds < 60) return `~${Math.round(seconds)} seconds`;

  const minutes = seconds / 60;
  if (minutes < 60) return `~${Math.round(minutes)} minutes`;

  const hours = minutes / 60;
  if (hours < 24) return `~${Math.round(hours)} hours`;

  const days = hours / 24;
  if (days < 30) return `~${Math.round(days)} days`;

  const months = days / 30.44;
  if (months < 12) return `~${Math.round(months)} months`;

  const years = days / 365.25;
  if (years < 100) return `~${Math.round(years)} years`;
  if (years < 1000) return `~${Math.round(years)} years`;
  if (years < 1000000) return `~${Math.round(years).toLocaleString()} years`;
  return "Centuries (1M+ years)";
}

/**
 * Evaluates cracking time across different attacker scenarios (Online vs Offline GPU clusters).
 */
export function estimateCrackTimes(combinations: number, isCommon: boolean): AttackVectorEstimate[] {
  // If password is in the common blacklist, it is cracked instantly in dictionary lookups
  if (isCommon) {
    return [
      {
        name: "Offline Fast Hash (GPU Rig)",
        speedLabel: "100 Billion guesses/sec",
        guessesPerSec: 1e11,
        timeFormatted: "Instant (Dictionary lookup)",
        riskLevel: "CRITICAL",
      },
      {
        name: "Offline Slow Hash (bcrypt)",
        speedLabel: "10,000 guesses/sec",
        guessesPerSec: 1e4,
        timeFormatted: "Instant (Dictionary lookup)",
        riskLevel: "CRITICAL",
      },
      {
        name: "Online Unthrottled API",
        speedLabel: "1,000 guesses/sec",
        guessesPerSec: 1e3,
        timeFormatted: "< 1 second",
        riskLevel: "CRITICAL",
      },
      {
        name: "Online Throttled Login",
        speedLabel: "10 guesses/sec",
        guessesPerSec: 10,
        timeFormatted: "Few seconds",
        riskLevel: "HIGH",
      },
    ];
  }

  // Average time to crack is combinations / 2 / guessesPerSecond
  const avgGuesses = combinations / 2;

  const vectors: Array<{ name: string; speedLabel: string; rate: number; defaultRisk: AttackVectorEstimate["riskLevel"] }> = [
    { name: "Offline Fast Hash (GPU Rig)", speedLabel: "100 Billion / sec", rate: 1e11, defaultRisk: "CRITICAL" },
    { name: "Offline Slow Hash (bcrypt)", speedLabel: "10,000 / sec", rate: 1e4, defaultRisk: "MEDIUM" },
    { name: "Online Unthrottled API", speedLabel: "1,000 / sec", rate: 1e3, defaultRisk: "HIGH" },
    { name: "Online Throttled Login", speedLabel: "10 / sec", rate: 10, defaultRisk: "LOW" },
  ];

  return vectors.map((v) => {
    const secs = avgGuesses / v.rate;
    const formatted = formatDuration(secs);
    let risk = v.defaultRisk;

    if (secs > 3.154e9) {
      risk = "SAFE"; // > 100 years
    } else if (secs > 86400 * 30) {
      risk = "LOW";
    } else if (secs > 3600) {
      risk = "MEDIUM";
    } else if (secs > 60) {
      risk = "HIGH";
    } else {
      risk = "CRITICAL";
    }

    return {
      name: v.name,
      speedLabel: v.speedLabel,
      guessesPerSec: v.rate,
      timeFormatted: formatted,
      riskLevel: risk,
    };
  });
}

/**
 * Generates security recommendations based on failed criteria and entropy score.
 */
export function generateSuggestions(criteria: PasswordCriteria, length: number): string[] {
  const tips: string[] = [];
  if (!criteria.notCommon) {
    tips.push("ALERT: This is a frequently breached dictionary password. Change it immediately.");
  }
  if (!criteria.minLength) {
    tips.push("Increase password length to at least 12-16 characters for exponentially higher entropy.");
  }
  if (!criteria.hasUppercase) {
    tips.push("Add uppercase letters (A-Z) to expand the search space.");
  }
  if (!criteria.hasLowercase) {
    tips.push("Include lowercase characters (a-z).");
  }
  if (!criteria.hasNumber) {
    tips.push("Incorporate numbers (0-9) non-sequentially.");
  }
  if (!criteria.hasSymbol) {
    tips.push("Insert special symbols (!, @, #, $, %, etc.) to thwart dictionary attacks.");
  }
  if (tips.length === 0 && length < 16) {
    tips.push("Good security hygiene! Consider making it 16+ chars to withstand quantum or future GPU clusters.");
  }
  return tips;
}

/**
 * Main analysis function that runs 100% locally in the browser with zero network calls.
 */
export function analyzePassword(password: string): AnalysisResult {
  const length = password.length;
  const common = isCommonPassword(password);

  const criteria: PasswordCriteria = {
    minLength: length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^a-zA-Z0-9]/.test(password),
    notCommon: !common && length > 0,
  };

  const poolSize = calculateCharsetPoolSize(password);
  const entropyBits = calculateEntropy(password, poolSize);

  // Number of permutations: poolSize ^ length
  // We cap exponents to avoid Infinity overflow in JavaScript numbers
  const combinations = poolSize > 0 && length > 0 ? Math.pow(poolSize, Math.min(length, 40)) : 0;

  const passedCount = Object.values(criteria).filter(Boolean).length;
  const attackVectors = estimateCrackTimes(combinations, common);

  // Primary crack time represents offline fast hash (conservative worst-case threat scenario)
  const primaryVector = attackVectors.find((v) => v.name.includes("Offline Fast Hash"));
  const primaryCrackTime = length === 0 ? "0 seconds" : primaryVector?.timeFormatted || "Instant";

  // Determine strength tier
  let tier: StrengthTier = "VERY_WEAK";
  let scorePercent = 0;

  if (length === 0) {
    tier = "VERY_WEAK";
    scorePercent = 0;
  } else if (common) {
    tier = "VERY_WEAK";
    scorePercent = 10;
  } else if (entropyBits < 30 || length < 7) {
    tier = "WEAK";
    scorePercent = 25;
  } else if (entropyBits < 55 || passedCount < 4) {
    tier = "MEDIUM";
    scorePercent = 55;
  } else if (entropyBits < 75 || length < 14) {
    tier = "STRONG";
    scorePercent = 80;
  } else {
    tier = "VERY_STRONG";
    scorePercent = 100;
  }

  const suggestions = generateSuggestions(criteria, length);

  return {
    password,
    length,
    criteria,
    passedCount,
    charsetPoolSize: poolSize,
    entropyBits,
    tier,
    scorePercent,
    primaryCrackTime,
    attackVectors,
    suggestions,
  };
}
