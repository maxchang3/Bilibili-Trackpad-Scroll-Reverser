import { fileURLToPath } from 'node:url'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'
import pkg from './package.json' with { type: 'json' }

// Minified build config
export default defineConfig({
    resolve: {
        alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
    },
    plugins: [
        svelte(),
        monkey({
            entry: 'src/main.ts',
            build: {
                fileName: `${pkg.name}.min.user.js`,
            },
            userscript: {
                name: 'BiliScrollReverser - 哔哩哔哩触控板滚动反转',
                namespace: 'http://zhangmaimai.com/',
                license: 'MIT',
                author: 'MaxChang3',
                description:
                    '优化 b 站视频音量调节在触控板上的体验。使用此脚本后，在 b 站视频全屏界面中，使用触控板向下滚动将减少音量。（未安装时为增大）',
                match: [
                    'https://www.bilibili.com/bangumi/play/*',
                    'https://www.bilibili.com/video/*',
                    'https://www.bilibili.com/list/*',
                    'https://www.bilibili.com/festival/*',
                    'https://www.bilibili.com/cheese/play/*',
                ],
                icon: 'https://www.bilibili.com/favicon.ico',
                'run-at': 'document-start',
            },
        }),
    ],
    build: {
        minify: true,
        emptyOutDir: false,
    },
})
