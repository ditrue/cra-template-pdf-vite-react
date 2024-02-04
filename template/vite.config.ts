import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// 确保导入 dotenv 并调用 config 方法
// 这一步在 Vite 项目中通常是可选的，因为 Vite 默认会加载 .env 文件
import dotenv from "dotenv"
dotenv.config()

export default defineConfig({
  base: process.env.BASENAME,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
})
