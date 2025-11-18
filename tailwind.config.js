/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'primary': '#2563eb', // A nice, modern blue
        'primary-focus': '#1d4ed8', // A darker blue for hover/focus
        'secondary': '#9ca3af', // A neutral gray
        'secondary-focus': '#6b7280', // Darker gray for hover/focus
        'accent': '#f59e0b', // The existing accent color is good
        'accent-focus': '#d97706', // Darker accent for hover/focus
        'neutral': '#1f2937', // A dark gray for text
        'base-100': '#ffffff', // White background
        'base-200': '#f3f4f6', // A light gray for alternative backgrounds
        'base-300': '#e5e7eb', // A slightly darker gray
        'info': '#3b82f6',
        'success': '#22c55e',
        'warning': '#facc15',
        'error': '#ef4444',
      },
    },
  },
  plugins: [],
};
