module.exports = {
  purge: ['./src/**/*.{js,jsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: theme => ({
        'hero-image':
          "url('https://images.unsplash.com/photo-1615948074366-969c6745f492?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80?sat=0')",
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
