/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060D17',
          900: '#0A192F',
          850: '#0D213B',
          800: '#0F2744',
          700: '#16365C',
          600: '#1E4A7D',
          500: '#2A649E',
        },
        slatebg: {
          dark: '#081321',
          panel: '#0C1E33',
          card: '#102640',
          border: '#1A385C',
          hover: '#193B63',
        },
        forensic: {
          teal: '#14B8A6',
          cyan: '#06B6D4',
          cyanLight: '#67E8F9',
          danger: '#EF4444',
          dangerBg: 'rgba(239, 68, 68, 0.15)',
          warning: '#F59E0B',
          warningBg: 'rgba(245, 158, 11, 0.15)',
          success: '#10B981',
          successBg: 'rgba(16, 185, 129, 0.15)',
          muted: '#8497B0',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
