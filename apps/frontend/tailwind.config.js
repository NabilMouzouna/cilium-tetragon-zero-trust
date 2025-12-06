/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8f9fa',
        'surface-100': '#ffffff',
        'surface-200': '#f1f3f4',
        primary: '#1a73e8',
        'on-primary': '#ffffff',
        'on-surface': '#202124',
        'on-surface-variant': '#5f6368',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
