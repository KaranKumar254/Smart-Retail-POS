/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5ff',
          100: '#d9e9ff',
          200: '#bcd8ff',
          300: '#8dbfff',
          400: '#589bff',
          500: '#3478f6',
          600: '#245fe8',
          700: '#214ed5',
          800: '#2241ad',
          900: '#213b89',
        },
        accent: {
          50: '#effef8',
          100: '#dafced',
          200: '#b9f7db',
          300: '#84efc2',
          400: '#49dfa2',
          500: '#22c885',
          600: '#16a36b',
          700: '#168258',
          800: '#166748',
          900: '#15553e',
        },
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)',
        glass: '0 12px 50px rgba(52, 120, 246, 0.08)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)',
        'soft-gradient': 'linear-gradient(135deg, rgba(52,120,246,0.14), rgba(34,200,133,0.12))',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
