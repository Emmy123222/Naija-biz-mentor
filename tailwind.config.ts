import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefdf6',
          100: '#d6f6e6',
          200: '#b0ebcf',
          300: '#7fdcb3',
          400: '#47c68f',
          500: '#24a873',
          600: '#17865c',
          700: '#146a4b',
          800: '#12543e',
          900: '#0f4534'
        }
      }
    }
  },
  plugins: []
} satisfies Config
