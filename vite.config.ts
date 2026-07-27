import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                '/api/github': {
                    target: 'https://api.github.com',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/github/, ''),
                    headers: {
                        Authentication: `Bearer ${env.VITE_GITHUB_API_TOKEN}`,
                        Accept: 'application/vnd.github+json',
                    },
                },
            },
        },
    };
});
