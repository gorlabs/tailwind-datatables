import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
// import tailwindcss from "@tailwindcss/vite"; // BU SATIRI SİL!

// Tailwind CSS v3 için PostCSS pluginlerini import et
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        // tailwindcss(), // BU SATIRI SİL!
    ],
    build: {
        minify: false, // Minification'ı kapatıyoruz
        sourcemap: true, // Hata ayıklama için sourcemap oluştur
    },
    css: { // Yeni css bloğunu buraya ekle
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer,
            ],
        },
    },
    server: {
        cors: true,
    },
});
