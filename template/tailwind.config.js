/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '90': '22.5rem',
        '100': '25rem',
        '120': '30rem',
      },
      colors: {
        'source': '#D9D9D9',
        'source-ppt': '#99D6EA',
        'source-tapd': '#3975C6',
        'source-workbench': '#FF6F6C',
      },
      boxShadow: {
        'eq': '0 0 6px 0 rgba(0, 0, 0,.3)',
        'eq-lg': '0 0 12px 0 rgba(0, 0, 0,.3)',
      },
    },
  },
  plugins: [],
}
