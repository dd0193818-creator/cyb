import { NextRequest, NextResponse } from "next/server";

export interface BreachData {
  name: string;
  title: string;
  breachDate: string;
  dataClasses: string[];
  description?: string;
  pwnCount?: number;
}

export interface BreachResponse {
  success: boolean;
  clean: boolean;
  count: number;
  breaches: BreachData[];
  message?: string;
}

/**
 * Validates email format using standard RFC 5322 regex.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * API Route Handler: Queries Have I Been Pwned (HIBP) without storing or logging the email.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const email = body?.email?.trim();

    // 1. Client-Side input validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, clean: false, count: 0, breaches: [], message: "Invalid email address format." },
        { status: 400 }
      );
    }

    // 2. Read HIBP API Key from environment
    const apiKey = process.env.HIBP_API_KEY;

    // Check if key is still placeholder or missing
    if (!apiKey || apiKey === "your_hibp_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          clean: false,
          count: 0,
          breaches: [],
          message: "HIBP_API_KEY is not configured in .env.local. Please add a valid Have I Been Pwned API key.",
        },
        { status: 500 }
      );
    }

    // 3. Query HIBP breachedaccount endpoint
    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "hibp-api-key": apiKey,
        "user-agent": "PassGuard-BreachCheck/1.0",
      },
      cache: "no-store", // Do not cache responses
    });

    // 4. Handle 404: Account was not found in any breach (Clean)
    if (response.status === 404) {
      return NextResponse.json({
        success: true,
        clean: true,
        count: 0,
        breaches: [],
        message: "Clean! No known data breaches found for this email address.",
      });
    }

    // 5. Handle Rate Limiting (429)
    if (response.status === 429) {
      return NextResponse.json(
        {
          success: false,
          clean: false,
          count: 0,
          breaches: [],
          message: "Rate limit reached on HIBP API. Please wait a few seconds and try again.",
        },
        { status: 429 }
      );
    }

    // 6. Handle Invalid API Key (401)
    if (response.status === 401) {
      return NextResponse.json(
        {
          success: false,
          clean: false,
          count: 0,
          breaches: [],
          message: "Unauthorized: Invalid HIBP API Key in .env.local.",
        },
        { status: 401 }
      );
    }

    // 7. Handle Unexpected Errors
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          clean: false,
          count: 0,
          breaches: [],
          message: `HIBP API returned status ${response.status}`,
        },
        { status: response.status }
      );
    }

    // 8. Parse Breach Data and extract only necessary fields (Zero storage)
    const rawBreaches = await response.json();
    const formattedBreaches: BreachData[] = rawBreaches.map((b: any) => ({
      name: b.Name,
      title: b.Title || b.Name,
      breachDate: b.BreachDate,
      dataClasses: b.DataClasses || [],
      description: b.Description,
      pwnCount: b.PwnCount,
    }));

    return NextResponse.json({
      success: true,
      clean: false,
      count: formattedBreaches.length,
      breaches: formattedBreaches,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        clean: false,
        count: 0,
        breaches: [],
        message: error.message || "An unexpected error occurred during breach check.",
      },
      { status: 500 }
    );
  }
}
