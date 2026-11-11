/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#FDF3F3',
          100: '#FBE4E4',
          200: '#F6C6C7',
          300: '#EE9C9E',
          400: '#E26A6E',
          500: '#CF4449',
          600: '#B5303A',
          700: '#942630',
          800: '#741E27',
          900: '#52161C',
        },
        success: {
          50: '#EFF8F2',
          100: '#DCF0E3',
          300: '#9ED8B2',
          500: '#3C9B63',
          700: '#2A7248',
          900: '#17492C',
        },
        warning: {
          50: '#FDF8EC',
          100: '#FAEFD0',
          300: '#E9CB7A',
          500: '#B98A1E',
          700: '#7E5C0E',
          900: '#4A3407',
        },
        danger: {
          50: '#FDF2F2',
          100: '#FADFDF',
          300: '#EBA3A3',
          500: '#C23B3B',
          700: '#9A2424',
          900: '#5C1414',
        },
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 8px 24px -12px rgba(28, 25, 23, 0.12)',
        glow: '0 1px 2px rgba(181, 48, 58, 0.2), 0 10px 28px -10px rgba(181, 48, 58, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'splash-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        'splash-out': 'splash-out 0.5s ease-in forwards',
      },
    },
  },
  plugins: [],
};
