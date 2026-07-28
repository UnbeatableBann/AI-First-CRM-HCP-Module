/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Google Sans"', '"DM Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-secondary': 'var(--surface-secondary)',
        foreground: 'var(--foreground)',
        'foreground-secondary': 'var(--foreground-secondary)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        ai: 'var(--ai)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        info: 'var(--info)',
        sidebar: {
          bg: 'var(--sidebar-bg)',
          text: 'var(--sidebar-text)',
          active: 'var(--sidebar-active)',
          'active-text': 'var(--sidebar-active-text)',
          border: 'var(--sidebar-border)'
        },
        card: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--foreground)',
        },
      },
      borderRadius: {
        '2xl': '24px',
        xl: '18px',
        lg: '12px',
        md: '8px',
        sm: '4px',
        full: '9999px',
      },
      boxShadow: {
        'minimal': '0 6px 20px rgba(15,23,42,0.05)',
      },
      spacing: {
        'tiny': '8px',
        'small': '16px',
        'internal': '24px',
        'component': '32px',
        'section': '48px',
        'page': '64px',
      }
    },
  },
  plugins: [],
}
