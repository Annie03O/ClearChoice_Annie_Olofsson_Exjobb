import type { Config } from 'tailwindcss';
// tailwind.config.js
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {
    screens: {
      xs: "480px",
      pc: "1536px",  
      desktop: "1920px",
  } },
  plugins: [],
},
} satisfies Config;
