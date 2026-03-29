import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit','sans-serif'],
        playfair: ['"Playfair Display"','serif'],
      },
      colors: {
        green: {
          50:'#f5fcf8',100:'#e8f8f0',200:'#b3e8cd',300:'#7dd4a8',
          400:'#52bf84',500:'#3a9c67',600:'#2d7a4f',700:'#1f5c38',
          800:'#1a3d28',900:'#0d2818',950:'#071912',
        },
      },
      animation: {
        'float':'float 6s ease-in-out infinite',
        'pulse-slow':'pulse 2.5s ease-in-out infinite',
        'fade-in':'fadeIn 0.4s ease forwards',
        'slide-up':'slideUp 0.35s ease forwards',
      },
      keyframes: {
        float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-10px)'}},
        fadeIn:{from:{opacity:'0'},to:{opacity:'1'}},
        slideUp:{from:{opacity:'0',transform:'translateY(16px)'},to:{opacity:'1',transform:'translateY(0)'}},
      },
    },
  },
  plugins:[],
}
export default config
