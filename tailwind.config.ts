import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        'app-bg': '#f8fafc',
        'card-bg': '#ffffff',
      },
      backgroundImage: {
        'ai-gradient': 'linear-gradient(to right, #8b5cf6, #3b82f6)',
      },
    },
  },
  plugins: [],
};
export default config;
