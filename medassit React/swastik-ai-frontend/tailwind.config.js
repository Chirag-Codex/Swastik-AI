/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-page': '#0F0F0F',
        'bg-surface': '#1C1C1C',
        'bg-surface-raised': '#2A2A2A',
        'bg-accent-soft': '#3A331A',
        'accent': '#FFD23F',
        'accent-text-on': '#0F0F0F',
        'success': '#2E7D32',
        'danger': '#E24B4A',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8A8A8A',
        'border-default': '#2A2A2A',
        'border-accent': '#FFD23F',
      },
      fontFamily: {
        'heading': ['Sora', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      minHeight: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}