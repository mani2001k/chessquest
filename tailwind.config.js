export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#101126',
        panel: '#16172f',
        accent: '#e94560',
        glow: '#7c3aed',
        muted: '#8b96b0',
      },
      boxShadow: {
        glow: '0 0 30px rgba(233, 69, 96, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};
