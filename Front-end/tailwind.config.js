module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  
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
        gold: '#e6c47a', 
      },
    },
  },
  plugins: [],
};
