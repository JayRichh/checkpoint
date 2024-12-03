import type { Config } from "tailwindcss";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  content: ["./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: "hsl(var(--border))",
          secondary: "hsl(var(--border-secondary))",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          secondary: "hsl(var(--background-secondary))",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          secondary: "hsl(var(--foreground-secondary))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        error: {
          DEFAULT: "hsl(var(--error))",
          foreground: "hsl(var(--error-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--surface-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        gradient: "gradient 8s linear infinite",
        "gradient-fast": "gradient 4s linear infinite",
        "gradient-slow": "gradient 12s linear infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    {
      handler: ({ addComponents, addUtilities }: PluginAPI) => {
        addComponents({
          ".container": {
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            "@screen sm": {
              maxWidth: "640px",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
            },
            "@screen md": {
              maxWidth: "768px",
              paddingLeft: "2rem",
              paddingRight: "2rem",
            },
            "@screen lg": {
              maxWidth: "1024px",
            },
            "@screen xl": {
              maxWidth: "1280px",
            },
          },
        });
        addUtilities({
          ".text-balance": {
            "text-wrap": "balance",
          },
          ".text-pretty": {
            "text-wrap": "pretty",
          },
          ".glass": {
            "@apply bg-background/50 backdrop-blur-md backdrop-saturate-150": {},
          },
          ".glass-border": {
            "@apply border border-border/50": {},
          },
          ".glass-hover": {
            "@apply hover:bg-background/80 transition-colors duration-200": {},
          },
        });
      },
    },
  ],
  darkMode: "class",
};

export default config;
