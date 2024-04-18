/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'app-color': '#af0cf2',
        'auxi-color': '#F00F87'
      },
      boxShadow: {
        'card': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      },
      backgroundSize: {
        'full': '100% 100%'
      },
      backgroundPosition: {
        'x-94': '94px',
        'x-240': '240px',
        'x-320': '320px'
      },
      backgroundImage: {
        'body-main': "url('@public/assets/main.jpg')",
        'main-gradient': "linear-gradient(210deg, #00eaff 0%, #0080ff 25%, #8000ff 50%, #e619e6 75%)",
        'body-pattern-light': "url('@public/assets/pattern1.png')",
        'body-pattern-dark': "url('@public/assets/pattern2.png')",        
      },
      transformOrigin: {
        'top-left-1/2': '-50%, -50%'
      }
    },
  },
  plugins: [],
}

