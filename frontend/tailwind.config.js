/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        certgreen: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          600: '#059669',
          700: '#047857',
        },
        certamber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#D97706',
          700: '#B45309',
        },
        certred: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
          700: '#B91C1C',
        },
        surface: {
          light: '#FFFFFF',
          muted: '#F8FAFC',
          dark: '#0F172A',
          'dark-elevated': '#1E293B',
          'dark-muted': '#334155',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', '"IBM Plex Sans Arabic"', 'sans-serif'],
        body: ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
        'card-dark': '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
        seal: '0 4px 20px rgba(79, 70, 229, 0.15)',
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(2.4) rotate(-18deg)', opacity: '0' },
          '55%': { transform: 'scale(0.92) rotate(-8deg)', opacity: '1' },
          '75%': { transform: 'scale(1.06) rotate(-10deg)' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        sweep: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        stamp: 'stamp 0.6s cubic-bezier(.2,.8,.2,1) both',
        riseIn: 'riseIn 0.4s cubic-bezier(.16,1,.3,1) both',
        fadeIn: 'fadeIn 0.3s ease both',
        scaleIn: 'scaleIn 0.3s cubic-bezier(.16,1,.3,1) both',
        sweep: 'sweep 0.8s cubic-bezier(.16,1,.3,1) both',
        slideUp: 'slideUp 0.35s cubic-bezier(.16,1,.3,1) both',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
