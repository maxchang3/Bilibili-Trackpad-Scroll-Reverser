import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '哔哩哔哩反转触控板',
        namespace: 'http://zhangmaimai.com/',
        license: 'MIT',
        author: 'MaxChang3',
        match: [
          'https://www.bilibili.com/bangumi/play/*',
          'https://www.bilibili.com/video/*'
        ],
        icon: 'https://www.bilibili.com/favicon.ico',
        "run-at": "document-start"
      },
    }),
  ],
})
