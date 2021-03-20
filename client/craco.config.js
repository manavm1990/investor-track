module.exports = {
  purge: ['./src/**/*.{js}', './public/index.html'],
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
};
