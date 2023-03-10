import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: '哔哩哔哩触控板滚动反转',
        namespace: 'http://zhangmaimai.com/',
        license: 'MIT',
        author: 'MaxChang3',
        description: '优化 b 站视频音量调节在触控板上的体验。使用此脚本后，\
        在 b 站视频全屏界面中，使用触控板向下滚动将减少音量。（未安装时为增大）',
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
