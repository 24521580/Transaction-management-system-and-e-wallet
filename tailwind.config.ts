import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        success: '#34C759',
        warning: '#FF9F0A',
        danger: '#FF3B30',
        background: '#F2F2F7',
      },
      borderRadius: {
        ios: '24px',
        input: '14px',
      },
      fontFamily: {
        sans: ['SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ios: '0 8px 30px rgba(15, 23, 42, 0.08)',
        soft: '0 8px 24px rgba(15, 23, 42, 0.06)',
      },
      transitionDuration: {
        ios: '250ms',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
