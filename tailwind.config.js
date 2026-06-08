/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        navy: {
          50: "#eef2f9",
          100: "#d6e0f0",
          200: "#adc1e1",
          300: "#84a2d2",
          400: "#5b83c3",
          500: "#3264b4",
          600: "#284f8f",
          700: "#1e3a6a",
          800: "#142545",
          900: "#0B1F3A",
          950: "#060f1d",
        },
        orange: {
          50: "#fdf3ee",
          100: "#fbe7dc",
          200: "#f7cfb9",
          300: "#f3b796",
          400: "#ef9f73",
          500: "#E8743C",
          600: "#d4622a",
          700: "#aa4e22",
          800: "#803a19",
          900: "#562611",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(32px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern":
          "linear-gradient(135deg, #0B1F3A 0%, #1e3a6a 50%, #0B1F3A 100%)",
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(11,31,58,0.12), 0 1px 4px -1px rgba(11,31,58,0.08)",
        "card-hover":
          "0 12px 40px -8px rgba(11,31,58,0.2), 0 4px 12px -2px rgba(11,31,58,0.1)",
        "orange-glow": "0 0 24px rgba(249,115,22,0.40)",
        "nav-blur": "0 2px 20px rgba(11,31,58,0.08)",
      },
    },
  },
  plugins: [require("tailwindcss/plugin")(({ addUtilities }) => {
    addUtilities({
      ".text-balance": { "text-wrap": "balance" },
      ".scrollbar-hide": {
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        "&::-webkit-scrollbar": { display: "none" },
      },
    });
  })],
};
