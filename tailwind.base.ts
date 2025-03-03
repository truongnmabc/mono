import type { Config } from 'tailwindcss';

export default {
  content: ['./libs/shared-uis/src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--text-color-primary)',
      },
      backgroundColor: {
        'theme-white': 'var(--main-background-color)',
        'theme-dark': 'var(--main-background-color)',
        'primary-16': 'rgba(252,167,45, 0.16)',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        vampiro: ['var(--font-vampiro)'],
      },
      boxShadow: {
        custom: '-4px 4px 8px 0px rgba(33, 33, 33, 0.16)',
        bottom: '0px -4px 8px 0px #21212129',
        close: '0px 0px 8px 0px #21212129',
      },
      width: {
        slider: 'calc((100% / 3) - 16px)',
        'silder_2/3': 'calc((100% / 2) - 24px)',
      },

      animation: {
        typing: 'typing 1.5s steps(40, end)',
        'progress-slide': 'progressSlide 0.7s ease-out',
        'progress-width': 'progressWidth 0.7s ease-out',
      },
      keyframes: {
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        progressSlide: {
          '0%': {
            transform: 'scaleX(0)',
            transformOrigin: 'left',
          },
          '100%': {
            transform: 'scaleX(1)',
            transformOrigin: 'left',
          },
        },
        progressWidth: {
          '0%': {
            transform: 'scaleX(0)',
          },
          '100%': {
            transform: 'scaleX(1)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
