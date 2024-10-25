/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // --primary-100:#5BC7B3;
        // --primary-200:#39a996;
        // --primary-300:#006757;
        // --accent-100:#A52B6E;
        // --accent-200:#ffc2ff;
        // --text-100:#FFFFFF;
        // --text-200:#e0e0e0;
        // dark: #1A1A1A;
        // light: #292929;
        // border-light: #404040;

        primary: {
          green: '#5bc7b3',
          red: '#a52b6e',
          purple: '#5734e4',
          blue: '#3b82f6',
        },

        // background
        dark: '#1A1A1A',
        light: '#292929',
        lighter: '#404040',

        // text
        white: '#FFFFFF',
        muted: '#e0e0e0',

        // shadow
        glow: '#db4bff7c',

        // border
        'border-light': ' #404040',
        'border-best': '#4DFFBF',

        // text
        'text-disabled': '#9D9D9D',

        // div
        'div-disabled': '#32343E',

        // unusual
        'text-route': '#4CFFBF',
        'border-route': '#25C189',
        'bg-route': '#134332',
      },

      fontSize: {
        'token-select': '24px',
      },

      keyframes: {
        'fade-in': {
          '0%': {
            opacity: 0,
          },
          '50%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        'fade-out': {
          '0%': {
            opacity: 1,
          },
          '50%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
        'rotate-in': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },

      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
        'fade-out': 'fade-out 0.3s ease-in-out',
        'rotate-in': 'rotate-in 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
