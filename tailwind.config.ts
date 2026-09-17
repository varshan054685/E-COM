import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FBF8F2',
          100: '#F7F1E7',
          200: '#F0E7D8',
          300: '#E6D9C3',
        },
        charcoal: {
          50: '#F5F3F0',
          100: '#E5E0D8',
          200: '#C4BBB0',
          300: '#9A8F81',
          400: '#6E6559',
          500: '#4A443B',
          600: '#39342D',
          700: '#2A2620',
          800: '#1F1B17',
          900: '#161310',
        },
        gold: {
          50: '#FAF5EC',
          100: '#F1E4CC',
          200: '#E3CFA5',
          300: '#D2B67B',
          400: '#C1A05C',
          500: '#AF8D4B',
          600: '#96763C',
          700: '#7A5E31',
          800: '#5F4A28',
          900: '#462F1E',
        },
        clay: {
          50: '#FAF2EE',
          500: '#B3663F',
          700: '#8A4A2C',
        },
        ink: {
          DEFAULT: '#1F1B17',
          muted: '#6E6559',
          faint: '#9A8F81',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widestX: '0.2em',
      },
      maxWidth: {
        shell: '1440px',
      },
      screens: {
        '3xl': '1920px',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(31, 27, 23, 0.12)',
        lift: '0 24px 60px -20px rgba(31, 27, 23, 0.28)',
        line: 'inset 0 0 0 1px rgba(31, 27, 23, 0.08)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease both',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;