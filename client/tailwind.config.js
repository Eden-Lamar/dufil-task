/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui"
import { heroui } from "@heroui/theme";


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // "./node_modules/@heroui/theme/dist/components/tooltip.js",
    "./node_modules/@heroui/theme/dist/components/popover.js",
    "./node_modules/@heroui/theme/dist/components/button.js",
    "./node_modules/@heroui/theme/dist/components/alert.js",
  ],
  darkMode: "class", // Ensures dark mode is toggled by class
  theme: {
    extend: {
      backgroundImage: {
        'hero-img': "url('/assets/Photo by Joyston Judah on Pexels.jfif')",
        'signup-img': "url('/assets/Debbie Balboa _ Photo.gif')",
        'login-img': "url('/assets/Artista cria ilustrações e as transforma em gifs calmos e hipnotizantes.gif')",
      }
    },
  },
  plugins: [
    daisyui,
    heroui()
  ],
  daisyui: {
    themes: ["light", "dark"], // Forces light mode on daisyUI elements by default
  },
}

