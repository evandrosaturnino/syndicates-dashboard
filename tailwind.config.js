// tailwind.config.jscconst { fontFamily } = require('tailwindcss/defaultTheme');
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        grey: "#1C1E23",
        grey2: "#33343A",
        grey3: "#999AA4",
        grey4: "#33343A",
        green: "#00ED76"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        ssm: '.8rem'
      },
    },
    fontFamily: {
      sans: ['var(--font-inter)', ...fontFamily.sans],
    },
  },
  plugins: [],
}
