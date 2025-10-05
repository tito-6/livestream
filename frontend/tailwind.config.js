/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          black: '#060918',
          navy: '#0a0e27',
        },
        cosmic: {
          navy: '#0a0e27',
          space: '#141829',
        },
        emerald: {
          energy: '#00FF7F',
          dark: '#00CC66',
        },
        sultan: {
          blue: '#00FFFF',
          dark: '#00CCCC',
        },
        gold: {
          burnished: '#CCAA66',
          shimmer: '#E6C97F',
        },
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-oasis': 'linear-gradient(135deg, #00FF7F 0%, #00FFFF 100%)',
        'gradient-gold': 'linear-gradient(135deg, #CCAA66 0%, #E6C97F 100%)',
        'gradient-cosmic': 'linear-gradient(180deg, #0a0e27 0%, #060918 100%)',
      },
      boxShadow: {
        'glow-emerald': '0 0 20px rgba(0, 255, 127, 0.4)',
        'glow-sultan': '0 0 20px rgba(0, 255, 255, 0.4)',
        'glow-gold': '0 0 15px rgba(204, 170, 102, 0.3)',
        'deep': '0 10px 40px rgba(0, 0, 0, 0.6)',
        'subtle': '0 4px 12px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-live': 'pulse-live 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'spin-glow': 'spin-glow 1s linear infinite',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'spin-glow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

