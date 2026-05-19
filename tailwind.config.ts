import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Brand palette
        navy: "#071B34",
        "deep-blue": "#0F2D52",
        mint: "#20D6B5",
        "cyan-glow": "#6FFFE9",
        "light-bg": "#F7FAFC",
        "dark-bg": "#081120",
        "neutral-text": "#D6E2F0",
        // Semantic tokens
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 80px -10px rgba(32, 214, 181, 0.45)",
        "glow-sm": "0 0 32px -8px rgba(32, 214, 181, 0.4)",
        "soft": "0 8px 30px rgba(7, 27, 52, 0.08)",
        "soft-dark": "0 8px 30px rgba(0, 0, 0, 0.4)",
        "card": "0 1px 2px rgba(7, 27, 52, 0.06), 0 8px 24px rgba(7, 27, 52, 0.06)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(15,45,82,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,45,82,0.06) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(214,226,240,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(214,226,240,0.06) 1px, transparent 1px)",
        "mesh-mint":
          "radial-gradient(at 20% 20%, rgba(32,214,181,0.35) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(111,255,233,0.25) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(15,45,82,0.5) 0px, transparent 50%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "marquee": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "marquee": "marquee 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
