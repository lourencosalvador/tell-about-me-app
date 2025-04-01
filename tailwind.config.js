/** @type {import('tailwindcss').Config} */
import { fontFamily }  from "@/../../src/styles/font-family"
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./src/app/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
      extend: {
        colors: {
          'bg-primary': '#9169EA',
          'bg-second': '#8258E5',
          'bg-background-primay': '#121214',
        },
        fontFamily
      },
    },
    plugins: [],
  }