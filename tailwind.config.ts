import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#E6EEF5',
          100: '#D4E3ED',
          200: '#A9C7DB',
          300: '#7FABC9',
          400: '#548FB7',
          500: '#2973A5',
          600: '#0A2540',
          700: '#081D33',
          800: '#061626',
          900: '#040E19',
        },
        coral: {
          50: '#FFE9E9',
          100: '#FFD4D4',
          200: '#FFABAB',
          300: '#FF8282',
          400: '#FF6B6B',
          500: '#FF5252',
          600: '#E63946',
          700: '#CC2936',
          800: '#B31F27',
          900: '#99161B',
        },
        mint: {
          50: '#E6F9F7',
          100: '#CCF4EF',
          200: '#99E9DF',
          300: '#66DECF',
          400: '#4ECDC4',
          500: '#3CBDB4',
          600: '#359C95',
          700: '#2E7B76',
          800: '#275A57',
          900: '#203938',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 2s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
