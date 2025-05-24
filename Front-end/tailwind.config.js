module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust if your source folder is different
  ],
  theme: {
    extend: {
      keyframes: {
        flyCircle: {
          '0%': { transform: 'rotate(0deg) translateX(50px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(50px) rotate(-360deg)' },
        },
      },
      animation: {
        'fly-loop': 'flyCircle 4s linear infinite',
      },
      colors: {
        gold: '#e6c47a', // Needed for text-gold, bg-gold, border-gold, etc.
      },
    },
  },
  plugins: [],
};
