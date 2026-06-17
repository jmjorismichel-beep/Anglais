export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { blue: '#185FA5', 'blue-light': '#E6F1FB', 'blue-mid': '#378ADD',
          teal: '#1D9E75', 'teal-light': '#E1F5EE', amber: '#BA7517', 'amber-light': '#FAEEDA',
          coral: '#D85A30', 'coral-light': '#FAECE7', purple: '#534AB7', 'purple-light': '#EEEDFE',
          green: '#639922', 'green-light': '#EAF3DE' }
      }
    }
  },
  plugins: []
}
