import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(
        {
            jsxRuntime: 'automatic'
        }
    )],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8190',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src',
        },
    },
})