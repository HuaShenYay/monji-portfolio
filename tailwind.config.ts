import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 将 Inter 放在首位
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      // 针对你截图中的大标题进行字间距微调
      letterSpacing: {
        tightest: "-.04em",
      }
    },
  },
} as Config;