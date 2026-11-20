# 🛡️ SOC Password Defense Guard (Next.js + Tailwind CSS)

An Enterprise SOC (Security Operations Center) themed Password Strength & Brute-Force Cracking Estimator built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

---

## ⚡ Key Highlights & Requirements Fulfilled

1. **Dark Theme & SOC Dashboard Aesthetic**:
   - Deep cyber palette (`#070B12`, `#0D131F`), neon cyan, matrix emerald, amber alerts, and critical crimson warnings.
   - Cyber grid pattern, subtle CRT scanline effect, and glowing telemetry LED status bars.

2. **Password Input Field with Show/Hide Toggle**:
   - Integrated eye toggle for visibility.
   - Clipboard copy button with temporary feedback.
   - Clear and "Generate High-Entropy Secret" button for 16-character cryptographically secure passwords.

3. **Live Real-Time Evaluation**:
   - Updates immediately on every keystroke.
   - Segmented 5-tier LED strength bar (Critical, Weak, Moderate, Strong, Military-Grade).
   - Shannon Entropy calculation in bits ($E = L \times \log_2(R)$).

4. **Realistic Cracking Time Estimations**:
   - Prominent header displaying crack time for worst-case scenarios ("Instant", "3 hours", "42 years", "Centuries").
   - Detailed threat matrix breakdown:
     - **Offline Fast Hash (GPU Rig)**: 100 Billion hashes/sec (MD5 / SHA-256).
     - **Offline Slow Hash (bcrypt)**: 10,000 hashes/sec (Key stretching).
     - **Online Unthrottled API**: 1,000 requests/sec.
     - **Online Throttled Login**: 10 requests/sec.

5. **Heuristic Security Checklist**:
   - 8+ characters (with 12+ / 16+ recommendations)
   - Uppercase letters (A-Z)
   - Lowercase letters (a-z)
   - Numeric digits (0-9)
   - Special symbols (!@#$%^&*...)
   - Common Passwords / Breach Check (in-memory lookup of top leaked passwords)

6. **100% Client-Side Privacy Guarantee**:
   - Zero API routes or network requests. Passwords exist only in ephemeral browser memory.

7. **Fully Mobile-Responsive**:
   - Mobile-first flexible layout, responsive grid cards, and touch-friendly controls.

---

## 🚀 How to Run the Next.js App

### Prerequisites
Make sure **Node.js** (v18.17+ or v20+) and **npm** are installed on your machine.
- If not installed, you can install Node.js via [nodejs.org](https://nodejs.org) or in Windows PowerShell:
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```

### Development Server
```bash
# 1. Navigate to the project directory
cd "C:\Users\acer\.gemini\antigravity\scratch\soc-password-guard"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🖥️ Instant Browser Preview (`preview.html`)
To test the interface immediately without needing Node.js installed, open `preview.html` located in this directory directly in Chrome, Edge, or Brave!
