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
      },
      fontFamily: {
        heading: ["Bricolage Grotesque", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      keyframes: {
        // Define keyframes for a single bouncing/fading dot
        "dot-pulse-bounce": {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" }, // Start and end slightly faded and smaller
          "50%": { opacity: "1", transform: "scale(1.2)" }, // Midpoint is fully visible and slightly larger (the "bounce")
        },
      },
      animation: {
        // 'saving-dot-bounce' is the utility class name you'll use for each dot
        "saving-dot-bounce": "dot-pulse-bounce 1.5s ease-in-out infinite", // 1.5s duration, ease-in-out for smoothness, infinite loop
      },
    },
  },
  plugins: [],
};
