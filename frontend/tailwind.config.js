/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      borderRadius: {
        'DEFAULT': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '0px'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Bebas Neue"', 'sans-serif'],
        headline: ['"Public Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        label: ['"Public Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sandy: '#EAE7DC',
        crimson: '#D90429',
        'surface-var': '#D8D4C7',
        hint: '#8E8D8A',
        // Stitch template aliases
        'brand-crimson': '#D90429',
        'brand-beige': '#EAE7DC',
        'brand-black': '#000000',
        primary: '#D90429',
        bgBase: '#EAE7DC',
        ink: '#000000',
        'jurist-bg': '#EAE7DC',
        'jurist-red': '#D90429',
        'jurist-black': '#000000',
        'jurist-white': '#FFFFFF',
        'jurist-primary': '#D90429',
        'jurist-text': '#000000',
      },
      boxShadow: {
        'brutalist-sm': '2px 2px 0px 0px #000000',
        'brutalist-md': '3px 3px 0px 0px #000000',
        'brutalist-lg': '4px 4px 0px 0px #000000',
        'brutalist-xl': '6px 6px 0px 0px #000000',
        'brutalist-xxl': '8px 8px 0px 0px #000000',
        // Stitch specific
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-hover': '2px 2px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
