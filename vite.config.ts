import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// GitHub Pages 배포를 위한 base 경로
// 리포지토리 이름이 'v0-monthly-schedule-app'인 경우 '/v0-monthly-schedule-app/'로 설정
// 루트 도메인으로 배포하는 경우 '/'로 설정
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'v0-monthly-schedule-app'
const base = process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
