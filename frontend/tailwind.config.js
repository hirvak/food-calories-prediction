/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nutrigo: {
          bg: '#F8FAFC',          // background
          lime: '#2563EB',         // primary (blue 600)
          orange: '#3B82F6',       // secondary (blue 500)
          darkorange: '#0EA5E9',   // accent (sky 500)
          border: '#E2E8F0',       // border slate 200
          textPrimary: '#0F172A',  // text primary
          textSecondary: '#475569' // text secondary
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
