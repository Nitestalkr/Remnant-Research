/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          subtle: '#111111',
          elevated: '#161616',
        },
        fg: {
          DEFAULT: '#fafafa',
          muted: '#a1a1aa',
          subtle: '#71717a',
        },
        border: {
          DEFAULT: '#262626',
          subtle: '#1c1c1c',
        },
        accent: {
          DEFAULT: '#67e8f9',
          muted: '#22d3ee',
          dim: '#0e7490',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        '2xs': '0.6875rem',
      },
      maxWidth: {
        prose: '68ch',
        content: '72rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
