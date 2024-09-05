import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'size-5',
    'text-green-500',
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  daisyui: {
    themes: [
      "lofi",
      {
        lofi: {
          ...require("daisyui/src/theming/themes")["lofi"],
          ".btn-primary": {
            "background-color": "#0d0d0d",
            "border-color": "#0d0d0d",
            "color": "#ffffff"
          },
          ".text-primary": {
            "color": "#0d0d0d"
          },
          ".bg-primary-content": {
            "background-color": "#ffffff"
          },
          ".btn.btn-disabled, .btn[disabled], .btn:disabled": {
            "background-color": "#cccccc",
            "color": "#a3a3a3",
            "border-width": 0
          },
          ".progress": {
            "background-color": "#cccccc"
          },
          ".progress:indeterminate": {
            "--progress-color": "#000000",
            "background-image": "#000000"
          },
          ".diff-item-1:after": {
            "background-color": "rgba(255, 255, 255, 0.5)",
            "border-color": "#ffffff",
            "outline-color": "rgba(0, 0, 0, 0.05)"
          },
          ".btn-active": {
            "background": "#c8c7c7",
            "color": "#000000"
          }
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
};
export default config;
