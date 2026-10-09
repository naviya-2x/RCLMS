/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#f4f4f5',
          100: '#e4e4e7',
          200: '#d4d4d8',
          300: '#a1a1aa',
          400: '#71717a',
          500: '#52525b',
          600: '#3f3f46',
          700: '#27272a',
          800: '#18181b',
          900: '#0f0f10',
          950: '#050506',
        },
        gold: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        lotus: {
          50: '#fff8fc',
          100: '#fdebf5',
          200: '#f5b5d2',
          300: '#ed8fba',
          400: '#e56aa3',
          500: '#d94b8d',
        },
        institutional: {
          bg: '#F6F7F9',
          card: '#FFFFFF',
          text: '#1F2937',
          subtext: '#6B7280',
          border: '#E5E7EB',
          darkBg: '#0F172A',
          darkCard: '#1E293B',
          darkBorder: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
        sinhala: ['"Noto Sans Sinhala"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elevated': '0 18px 40px -20px rgba(0, 0, 0, 0.8)',
        'crest': '0 0 25px rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
