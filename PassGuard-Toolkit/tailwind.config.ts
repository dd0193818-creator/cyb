import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        soc: {
          bg: "#070B12",
          card: "#0D131F",
          cardBorder: "#1B283D",
          radar: "#00FF66",
          cyan: "#00F0FF",
          amber: "#FFB000",
          crimson: "#FF2A55",
          muted: "#64748B",
          highlight: "#1E293B",
        },
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      boxShadow: {
        "soc-glow-green": "0 0 20px -2px rgba(0, 255, 102, 0.4)",
        "soc-glow-cyan": "0 0 20px -2px rgba(0, 240, 255, 0.4)",
        "soc-glow-amber": "0 0 20px -2px rgba(255, 176, 0, 0.4)",
        "soc-glow-crimson": "0 0 20px -2px rgba(255, 42, 85, 0.4)",
      },
      animation: {
        "pulse-fast": "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
