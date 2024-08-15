const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
        // sans: ['strawfordregular', ...defaultTheme.fontFamily.sans],
        // serif: ['ff-meta-serif-web-pro', ...defaultTheme.fontFamily.serif],
        // serif: ['IBM Plex Serif', ...defaultTheme.fontFamily.serif],
        // serif: [font, ...defaultTheme.fontFamily.serif],
        // 'serif-bold': [font, ...defaultTheme.fontFamily.serif],
        // serif: ['Begreener Regular', ...defaultTheme.fontFamily.serif],
        // 'serif-bold': ['Begreener Bold', ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [],
}

