// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
        './resources/js/*.js',
        './resources/css/*.css',
        './vendor/gorlabs/tailwind-datatables/resources/views/**/*.blade.php',
        './vendor/gorlabs/tailwind-datatables/resources/js/**/*.js',
        './vendor/gorlabs/tailwind-datatables/**/*.{html,js,ts,jsx,tsx,vue,css}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                white: {
                    DEFAULT: 'rgb(var(--color-white) / <alpha-value>)',
                    // ... diğer white tonları ...
                },
                // Her renk için RGB formatında CSS değişkeni referansı
                primary: {
                    DEFAULT: "rgb(var(--color-primary-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-primary-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-primary-dark-light) / <alpha-value>)",
                },
                secondary: {
                    DEFAULT: "rgb(var(--color-secondary-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-secondary-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-secondary-dark-light) / <alpha-value>)",
                },
                success: {
                    DEFAULT: "rgb(var(--color-success-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-success-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-success-dark-light) / <alpha-value>)",
                },
                danger: {
                    DEFAULT: "rgb(var(--color-danger-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-danger-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-danger-dark-light) / <alpha-value>)",
                },
                warning: {
                    DEFAULT: "rgb(var(--color-warning-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-warning-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-warning-dark-light) / <alpha-value>)",
                },
                info: {
                    DEFAULT: "rgb(var(--color-info-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-info-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-info-dark-light) / <alpha-value>)",
                },
                dark: {
                    DEFAULT: "rgb(var(--color-dark-DEFAULT) / <alpha-value>)",
                    light: "rgb(var(--color-dark-light) / <alpha-value>)",
                    "dark-light": "rgb(var(--color-dark-dark-light) / <alpha-value>)",
                },
                black: {
                    DEFAULT: 'rgb(var(--color-black) / <alpha-value>)', // Bu, bg-black'i senin --color-black değişkeninden almasını sağlar
                    // Eğer bg-opacity-50 gibi kullanımların kendi özel black rengin üzerinden olmasını istiyorsan
                    // veya doğrudan black renk paletine kendi değişkenlerini bağlamak istiyorsan:
                    50: 'rgb(var(--color-black-50) / <alpha-value>)', // varsayımsal: --color-black-50 varsa
                    // ... diğer black tonları ...
                },
                // DataTables ile ilişkili özel renkler
                'dt-primary': {
                    DEFAULT: 'rgb(var(--color-dt-primary-DEFAULT) / <alpha-value>)',
                    dark: 'rgb(var(--color-dt-primary-dark) / <alpha-value>)',
                    light: 'rgb(var(--color-dt-primary-light) / <alpha-value>)',
                },
            },
        },
    },

    plugins: [forms],
};
