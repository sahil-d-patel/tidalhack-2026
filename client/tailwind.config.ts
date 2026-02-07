import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0f172a',
          DEFAULT: '#1e293b',
          light: '#334155',
        },
        accent: {
          warm: '#f59e0b',
          heat: '#f97316',
          glow: '#fbbf24',
        },
        frost: {
          DEFAULT: '#e2e8f0',
          light: '#f1f5f9',
          blue: '#bfdbfe',
        },
      },
      fontFamily: {
        heading: ['Fredoka', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      zIndex: {
        background: '0',
        canvas: '10',
        particles: '20',
        overlay: '30',
        hud: '40',
      },
    },
  },
  plugins: [],
} satisfies Config
