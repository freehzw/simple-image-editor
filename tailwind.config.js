/** @type {import('tailwindcss').Config} */
export default {
  // 修改 content 配置，确保包含组件库源文件
  content: [
    "./index.html",
    "./src/**/*.{js,vue,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}