/** @type {import('tailwindcss').Config} */

// Tailwind's color opacity modifier (e.g. bg-white/8) only resolves against
// keys present in the `opacity` theme scale. The default scale only defines
// a handful of values (5, 10, 20, 25...), so any other number used in the
// app (8, 15, 45, 6, 12...) would silently be dropped. Generating a full
// 0-100 scale here guarantees every slash-opacity utility actually compiles.
const fullOpacityScale = Object.fromEntries(
  Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)]),
)

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      opacity: fullOpacityScale,
      colors: {
        black: '#000000',
        surface: {
          DEFAULT: '#0A0A0C',
          raised: '#121214',
          glass: 'rgba(255,255,255,0.045)',
          border: 'rgba(255,255,255,0.08)',
        },
        ink: {
          primary: '#F5F5F7',
          secondary: '#A1A1A6',
          tertiary: '#6E6E73',
        },
        accent: {
          50: '#FFF0F6',
          200: '#FFB4D6',
          300: '#FF8FC2',
          400: '#FF6FAE',
          500: '#FF3E8A',
          600: '#E91E76',
          700: '#C81E5C',
          900: '#5A0E30',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '26px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,62,138,0.25), 0 8px 40px -8px rgba(255,62,138,0.35)',
        'glow-lg': '0 0 60px -10px rgba(255,62,138,0.45)',
        card: '0 1px 1px rgba(0,0,0,0.4), 0 8px 24px -8px rgba(0,0,0,0.6)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
}
