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
        microsoft: {
          blue: '#0078D4',
          green: '#107C10',
          orange: '#D83B01',
          purple: '#5C2D91',
        },
      },
    },
  },
  plugins: [],
}
