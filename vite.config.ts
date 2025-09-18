import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            // ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
