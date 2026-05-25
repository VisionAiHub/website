import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Yellow brand accent
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f5b80a',
          600: '#eaa800',
          700: '#c08800',
          800: '#8a6300',
          900: '#5b4200',
        },
        // Dark navy / ink scale
        ink: {
          50:  '#f3f5f9',
          100: '#e1e6ef',
          200: '#c2cbdc',
          300: '#9aa6bf',
          400: '#6b7898',
          500: '#48557a',
          600: '#2f3b5d',
          700: '#1d2745',
          800: '#131c36',
          900: '#0c1429',
          950: '#070c1d',
        },
      },
      fontFamily: {
        sans: ['var(--font-questrial)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        container: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
