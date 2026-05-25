/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#E8B931',
          goldDark: '#B8901E',
          buttonText: '#1a1410',
        },
      },
    },
  },
  plugins: [],
}
