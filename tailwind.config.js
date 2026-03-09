/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#0c8ee6',
          600: '#006fc4',
          700: '#00589f',
          800: '#034a83',
          900: '#093f6d',
          950: '#062849',
        },
        sand: {
          50: '#fdf8f0',
          100: '#faeeda',
          200: '#f4dab4',
          300: '#ecc083',
          400: '#e39f50',
          500: '#dc832e',
          600: '#cd6a23',
          700: '#aa521f',
          800: '#884221',
          900: '#6e371e',
        },
        reef: {
          50: '#f0fdf6',
          100: '#dcfceb',
          200: '#bbf7d7',
          300: '#86efb8',
          400: '#4ade8a',
          500: '#22c564',
          600: '#15a34a',
          700: '#148040',
          800: '#156535',
          900: '#14532d',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        ocean: '0 4px 24px -4px rgba(6, 40, 73, 0.15)',
        'ocean-lg': '0 8px 40px -8px rgba(6, 40, 73, 0.2)',
      },
    },
  },
  plugins: [],
};
