import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060a",
          900: "#0a0c14",
          800: "#10131d",
          700: "#161a27",
          600: "#1d2233",
        },
        accent: {
          DEFAULT: "#7c5cff",
          soft: "#9b8bff",
          glow: "#5b3df0",
        },
        cyan: {
          neon: "#00e0ff",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: ["var(--font-display)", "var(--font-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,92,255,0.25), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 0%, rgba(0,224,255,0.15), transparent 60%)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.6 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.25), 0 12px 60px -10px rgba(124,92,255,0.45)",
        soft: "0 10px 40px -10px rgba(0,0,0,0.6)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gridmove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3.5s linear infinite",
        gridmove: "gridmove 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
