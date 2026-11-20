export interface PhishingFlag {
  id: string;
  category: "URGENCY" | "SENDER_DOMAIN" | "SUSPICIOUS_LINK" | "ATTACHMENT" | "GENERIC_GREETING" | "FINANCIAL_DEMAND";
  severity: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  reason: string;
  matchedItems: string[];
  points: number;
}

export interface PhishingAnalysisResult {
  score: number; // 0 to 100
  riskLevel: "SAFE" | "MODERATE" | "HIGH";
  badgeColor: string;
  summary: string;
  flags: PhishingFlag[];
  senderEmail: string | null;
  extractedLinks: string[];
}

/**
 * Checks for high-urgency and panic-inducing language designed to bypass critical thinking.
 */
function checkUrgencyWords(text: string): PhishingFlag | null {
  const urgencyPatterns = [
    /\b(immediate(ly)? action required)\b/i,
    /\b(account (has been )?suspended)\b/i,
    /\b(within 24 hours?|within 48 hours?|within 12 hours?)\b/i,
    /\b(verify your account|confirm your identity)\b/i,
    /\b(unauthorized (login|activity|access))\b/i,
    /\b(security alert|threat detected|compromised)\b/i,
    /\b(final notice|last warning|legal action)\b/i,
    /\b(password (will expire|has expired))\b/i,
    /\b(failure to respond will result in)\b/i,
    /\b(urgent action|act now|limited time)\b/i
  ];

  const matched: string[] = [];
  urgencyPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) matched.push(match[0]);
  });

  if (matched.length === 0) return null;

  const severity = matched.length >= 3 ? "HIGH" : matched.length >= 2 ? "MEDIUM" : "LOW";
  const points = matched.length >= 3 ? 25 : matched.length >= 2 ? 18 : 10;

  return {
    id: "urgency-language",
    category: "URGENCY",
    severity,
    title: "Urgent / Fear-Inducing Language Detected",
    reason: `Phishers create panic or false deadlines to trick victims into acting quickly without verifying. Found ${matched.length} urgency trigger phrase(s).`,
    matchedItems: matched,
    points
  };
}

/**
 * Analyzes sender headers and flags domain spoofing, mismatch, or untrusted free email senders.
 */
function checkSenderMismatch(text: string): PhishingFlag | null {
  const fromMatch = text.match(/from:\s*([^<\n]+<)?([a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))>?/i);
  const senderEmail = fromMatch ? fromMatch[2].toLowerCase() : null;
  const senderDomain = fromMatch ? fromMatch[3].toLowerCase() : null;

  const majorBrands = [
    { name: "PayPal", legitimate: ["paypal.com", "paypal.co.uk"] },
    { name: "Netflix", legitimate: ["netflix.com"] },
    { name: "Google", legitimate: ["google.com", "accounts.google.com"] },
    { name: "Apple", legitimate: ["apple.com", "icloud.com"] },
    { name: "Amazon", legitimate: ["amazon.com", "amazon.co.uk", "amazon.in"] },
    { name: "Microsoft", legitimate: ["microsoft.com", "outlook.com", "office.com"] },
    { name: "Bank / Financial", legitimate: [] }
  ];

  const matchedReasons: string[] = [];
  let points = 0;
  let severity: "HIGH" | "MEDIUM" | "LOW" = "LOW";

  if (senderEmail && senderDomain) {
    // Check if free email provider is sending corporate security alerts
    const freeDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "mail.com"];
    const claimsCorporate = /\b(security team|billing department|support desk|customer care|account security|fraud alert)\b/i.test(text);

    if (freeDomains.includes(senderDomain) && claimsCorporate) {
      matchedReasons.push(`Sender uses free domain (@${senderDomain}) while claiming to be an official corporate department.`);
      points += 30;
      severity = "HIGH";
    }

    // Check brand impersonation
    for (const brand of majorBrands) {
      if (brand.legitimate.length > 0) {
        const mentionsBrand = new RegExp(`\\b${brand.name}\\b`, "i").test(text);
        const matchesOfficial = brand.legitimate.some(d => senderDomain === d || senderDomain.endsWith("." + d));

        if (mentionsBrand && !matchesOfficial) {
          matchedReasons.push(`Email claims to be from ${brand.name}, but sender domain is '@${senderDomain}' instead of '${brand.legitimate[0]}'.`);
          points += 35;
          severity = "HIGH";
          break;
        }
      }
    }

    // Check for suspicious hyphenated / deceptive domain names
    if (/(-security|-verify|-support|-auth|-alert|-login)\./i.test(senderDomain)) {
      matchedReasons.push(`Domain '@${senderDomain}' uses deceptive security-themed keywords frequently found in phishing infrastructure.`);
      points += 20;
      if (severity !== "HIGH") severity = "MEDIUM";
    }
  }

  if (matchedReasons.length === 0) return null;

  return {
    id: "domain-mismatch",
    category: "SENDER_DOMAIN",
    severity,
    title: "Sender Identity & Domain Discrepancy",
    reason: matchedReasons.join(" "),
    matchedItems: senderEmail ? [senderEmail] : [],
    points
  };
}

/**
 * Inspects all hyperlinks inside the email body for suspicious TLDs, IP URLs, and shorteners.
 */
function checkSuspiciousLinks(text: string): { flag: PhishingFlag | null; links: string[] } {
  const urlRegex = /(https?:\/\/[^\s"'<>]+)/gi;
  const matches = text.match(urlRegex) || [];
  const uniqueLinks = Array.from(new Set(matches));

  const suspiciousItems: string[] = [];
  let points = 0;

  uniqueLinks.forEach(link => {
    try {
      const parsed = new URL(link);
      const host = parsed.hostname.toLowerCase();

      // Check IP address URLs
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
        suspiciousItems.push(`Direct IP address URL: ${link}`);
        points += 25;
      }

      // Check URL Shorteners
      if (["bit.ly", "tinyurl.com", "cutt.ly", "t.co", "is.gd", "rb.gy"].includes(host)) {
        suspiciousItems.push(`Hidden destination via shortener: ${host}`);
        points += 15;
      }

      // Check High-Risk TLDs
      if (/\.(xyz|top|work|click|buzz|tk|ml|ga|cf|gq|su|zip|mov)$/i.test(host)) {
        suspiciousItems.push(`High-risk domain extension: .${host.split('.').pop()} (${host})`);
        points += 20;
      }

      // Check insecure HTTP protocol for login/account links
      if (parsed.protocol === "http:" && /(login|verify|account|banking|secure|signin)/i.test(link)) {
        suspiciousItems.push(`Unencrypted HTTP link for sensitive action: ${link}`);
        points += 15;
      }
    } catch {
      // Ignore malformed URL fragments
    }
  });

  if (suspiciousItems.length === 0) {
    return { flag: null, links: uniqueLinks };
  }

  return {
    flag: {
      id: "suspicious-links",
      category: "SUSPICIOUS_LINK",
      severity: points >= 25 ? "HIGH" : "MEDIUM",
      title: "Deceptive or Suspicious Hyperlinks",
      reason: `Found ${suspiciousItems.length} suspicious link(s) exhibiting phishing characteristics (e.g., deceptive domains, IP hostnames, or URL shorteners).`,
      matchedItems: suspiciousItems,
      points: Math.min(points, 35)
    },
    links: uniqueLinks
  };
}

/**
 * Checks for dangerous file attachments or mentions of executable malware containers.
 */
function checkAttachments(text: string): PhishingFlag | null {
  const dangerousExts = [
    /\b[a-zA-Z0-9_-]+\.(exe|scr|vbs|bat|cmd|pif|iso|wsf|jse|hta)\b/i,
    /\b[a-zA-Z0-9_-]+\.(docm|xlsm|pptm)\b/i, // Macro-enabled documents
    /\b(invoice|receipt|statement|remittance|delivery)\.(zip|rar|7z|gz|tar)\b/i,
    /\b(password-protected (zip|file|attachment))\b/i
  ];

  const matched: string[] = [];
  dangerousExts.forEach(pattern => {
    const match = text.match(pattern);
    if (match) matched.push(match[0]);
  });

  if (matched.length === 0) return null;

  return {
    id: "dangerous-attachments",
    category: "ATTACHMENT",
    severity: "HIGH",
    title: "Potentially Malicious File Attachment Mentioned",
    reason: `Email references executable files, macro-enabled documents, or archived invoices commonly used to deliver ransomware and trojans.`,
    matchedItems: matched,
    points: 30
  };
}

/**
 * Checks for generic depersonalized greetings typically seen in mass-spam phishing campaigns.
 */
function checkGenericSalutation(text: string): PhishingFlag | null {
  const genericPatterns = [
    /\b(dear customer|dear user|dear account holder|dear member|dear client|dear valued customer)\b/i,
    /\b(undisclosed recipients)\b/i
  ];

  const matched: string[] = [];
  genericPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) matched.push(match[0]);
  });

  if (matched.length === 0) return null;

  return {
    id: "generic-salutation",
    category: "GENERIC_GREETING",
    severity: "LOW",
    title: "Impersonal / Generic Greeting",
    reason: "Legitimate organizations usually address you by your verified first and last name rather than generic terms.",
    matchedItems: matched,
    points: 8
  };
}

/**
 * Detects cryptocurrency wallet addresses or wire transfer demands.
 */
function checkFinancialDemand(text: string): PhishingFlag | null {
  const cryptoPatterns = [
    /\b(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/, // Bitcoin
    /\b(send|transfer|deposit) (bitcoin|btc|usdt|crypto|gift cards?|wire transfer)\b/i,
    /\b(western union|moneygram)\b/i
  ];

  const matched: string[] = [];
  cryptoPatterns.forEach(pattern => {
    const match = text.match(pattern);
    if (match) matched.push(match[0]);
  });

  if (matched.length === 0) return null;

  return {
    id: "financial-demand",
    category: "FINANCIAL_DEMAND",
    severity: "HIGH",
    title: "Cryptocurrency / Untraceable Payment Demand",
    reason: "Demanding payment via Bitcoin, crypto wallets, or gift cards is a signature hallmark of extortion and advance-fee fraud.",
    matchedItems: matched,
    points: 25
  };
}

/**
 * Main Rule-Based Phishing Engine: Runs 100% locally in browser memory without storing data.
 */
export function analyzePhishingEmail(rawEmailText: string): PhishingAnalysisResult {
  const text = rawEmailText.trim();

  if (!text) {
    return {
      score: 0,
      riskLevel: "SAFE",
      badgeColor: "bg-slate-800 text-slate-400 border-slate-700",
      summary: "Email paste karein aur 'Phishing Check Karein' par click karein.",
      flags: [],
      senderEmail: null,
      extractedLinks: []
    };
  }

  const flags: PhishingFlag[] = [];

  // 1. Urgency and fear keywords
  const urgencyFlag = checkUrgencyWords(text);
  if (urgencyFlag) flags.push(urgencyFlag);

  // 2. Sender and domain check
  const senderFlag = checkSenderMismatch(text);
  if (senderFlag) flags.push(senderFlag);

  // 3. Link inspection
  const { flag: linkFlag, links } = checkSuspiciousLinks(text);
  if (linkFlag) flags.push(linkFlag);

  // 4. Attachment threats
  const attachFlag = checkAttachments(text);
  if (attachFlag) flags.push(attachFlag);

  // 5. Generic greetings
  const greetingFlag = checkGenericSalutation(text);
  if (greetingFlag) flags.push(greetingFlag);

  // 6. Crypto / Wire transfer demands
  const cryptoFlag = checkFinancialDemand(text);
  if (cryptoFlag) flags.push(cryptoFlag);

  // Calculate Cumulative Score (capped at 100)
  const rawScore = flags.reduce((acc, f) => acc + f.points, 0);
  const score = Math.min(Math.max(rawScore, 0), 100);

  // Extract sender email for display
  const fromMatch = text.match(/from:\s*([^<\n]+<)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>?/i);
  const senderEmail = fromMatch ? fromMatch[2] : null;

  // Determine Risk Category & Color Badge
  let riskLevel: "SAFE" | "MODERATE" | "HIGH" = "SAFE";
  let badgeColor = "bg-emerald-500/15 border-emerald-500/30 text-emerald-300";
  let summary = "Ye email aam lag raha hai. Koi prominent phishing flags trigger nahi hue.";

  if (score >= 65) {
    riskLevel = "HIGH";
    badgeColor = "bg-rose-500/20 border-rose-500/40 text-rose-300";
    summary = "⚠️ High Risk Phishing Email! Is email me multiple dangerous flags mile hain. Kisi bhi link par click na karein.";
  } else if (score >= 25) {
    riskLevel = "MODERATE";
    badgeColor = "bg-amber-500/20 border-amber-500/40 text-amber-300";
    summary = "⚠️ Suspicious / Moderate Risk. Is email me kuch suspicious cheezein hain, dhyan se verify karein.";
  }

  return {
    score,
    riskLevel,
    badgeColor,
    summary,
    flags,
    senderEmail,
    extractedLinks: links
  };
}
