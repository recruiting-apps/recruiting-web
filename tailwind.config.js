/** @type {import('tailwindcss').Config} */

const Color = require('color');
const lighten = (color, amount) => Color(color).lighten(amount).rgb().string();
const darken = (color, amount) => Color(color).darken(amount).rgb().string();

const colors = require('tailwindcss/colors')

export default {
  content: [
    './src/index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#6ea8fe',
          DEFAULT: '#0d6efd',
          footer: '#001d3d',
          era: '#10466a',
          hover: darken('#0d6efd', 0.2),
          'era-light': lighten('#10466a', 0.6)
        },
        red: {
          DEFAULT: '#94010f',
          dark: '#70151e',
          hover: darken('#94010f', 0.2)
        },
        gray: {
          DEFAULT: colors.gray,
          light: 'rgba(0, 0, 0, 0.2)'
        },
        black: {
          DEFAULT: colors.black,
          hover: lighten('black', 0.2)
        },
        success: {
          DEFAULT: '#198754',
          dark: darken('#198754', 0.5),
          hover: darken('#198754', 0.2)
        },
        info: {
          DEFAULT: '#17a2b8',
          dark: darken('#17a2b8', 0.5),
          hover: darken('#17a2b8', 0.2)
        },
        warning: {
          DEFAULT: '#ffc107',
          dark: darken('#ffc107', 0.5),
          hover: darken('#ffc107', 0.2)
        },
        cyan: '#0dcaf0'
      },
      gridTemplateColumns: {
        table: '1fr 2fr',
        responsive: 'repeat(auto-fit, minmax(200px, 1fr))',
        cards: 'repeat(auto-fit, minmax(500px, 1fr))'
      },
      boxShadow: {
        card: '0px 1px 10px 0px rgba(0,0,0,0.2)',
        'card-bold': '0px 1px 10px 0px rgba(0,0,0,0.4)',
        'input-focus': '0px 0px 4px 0px rgba(0,0,0,0.5)'
      }
    },
  },
  plugins: [],
}

