import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // <--- 强制使用 3000 端口
    strictPort: true, // 如果3000被占用，就直接报错，不要自动换端口
  }
})