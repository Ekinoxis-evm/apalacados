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
        'cyber-green': '#00ff41',
        'neon-purple': '#bc13fe',
        'true-black': '#050505',
        'panel': '#0a0a0a',
        'border-dark': '#1A1A1A',
        'cyber-blue': '#00d4ff',
        'cyber-teal': '#00fff0',
        'neon-pink': '#ff006e',
      },
      fontFamily: {
        'chakra': ['var(--font-chakra)', 'monospace'],
        'dm-mono': ['var(--font-dm-mono)', 'monospace'],
        'outfit': ['var(--font-outfit)', 'sans-serif'],
      },
      animation: {
        'live-pulse': 'live-pulse 1.5s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite alternate',
        'flicker': 'flicker 4s linear infinite',
      },
      keyframes: {
        'live-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        'border-glow': {
          'from': { boxShadow: '0 0 5px rgba(0,255,65,0.2), 0 0 10px rgba(0,255,65,0.1)' },
          'to': { boxShadow: '0 0 20px rgba(0,255,65,0.4), 0 0 40px rgba(0,255,65,0.15)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.8' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.9' },
          '97%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
