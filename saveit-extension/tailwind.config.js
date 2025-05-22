/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // For Next.js App Router
    "./src/**/*.{js,ts,jsx,tsx}", // Common 'src' directory
    // Add any other specific folders where you use Tailwind classes
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core brand colors
        "saveit-accent": "#3B82F6", // primary accent blue
        "saveit-dark": "#1a1a1a", // replacement for black
        "saveit-light": "#f9f9f9", // replacement for white

        // Semantic background colors (will dynamically change with dark mode)
        "saveit-background": "var(--color-saveit-background)",
        "saveit-card": "var(--color-saveit-card)", // For distinct content blocks

        // Semantic text colors (will dynamically change with dark mode)
        "saveit-text": "var(--color-saveit-text)",
        "saveit-text-secondary": "var(--color-saveit-text-secondary)", // For less prominent text

        "saveit-success": "rgb(34 197 94)", // green-500
        "saveit-danger": "rgb(239 68 68)", // red-500
        "saveit-warning": "rgb(245 158 11)", // amber-500
      },
      fontFamily: {
        heading: ["Bricolage Grotesque", "sans-serif"],

        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
