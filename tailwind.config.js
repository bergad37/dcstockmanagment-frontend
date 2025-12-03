export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#073c56',
        secondary: '#E5E7EB', // Teal
        accent: '#F59E0B', // Amber for warnings
        background: '#F9FAFB', // Almost white
        text: '#111827' // Deep black-gray
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },

      fontFamily: {
        sans: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: []
};
