/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#63b3ed', // Light blue
          DEFAULT: '#3182ce', // Blue
          dark: '#2b6cb0', // Dark blue
        },
        secondary: {
          light: '#a0aec0', // Light gray
          DEFAULT: '#718096', // Gray
          dark: '#2d3748', // Dark gray
        },
        background: '#f7fafc', // Very light gray/off-white
        surface: '#ffffff', // White
        error: '#e53e3e', // Red
        success: '#48bb78', // Green
        warning: '#ed8936', // Orange
      },
    },
  },
  plugins: [],
}

