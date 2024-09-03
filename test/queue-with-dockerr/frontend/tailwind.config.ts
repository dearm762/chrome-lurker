import type { Config } from "tailwindcss"
import daisyui from "daisyui"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'custom': '0px 0px 9.6px 0px rgba(0, 0, 0, 0.25)',
      },
      colors: {
        main: '#d50032',
        faded: '#FEF2F2',
        secondary: '#008742',
        grayer: '#8A8A8A',
        yellow: '#FFCC00',
        header: {
          bg: '#EEE'
        },
        ticket: {
          text: '#383F45'
        }
      }
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: ["bumblebee"]
  }
}

export default config
