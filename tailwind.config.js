import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.jsx',
        './resources/js/**/*.ts',
        './resources/js/**/*.js',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                'slide-in-down': {
                    '0%': {
                        transform: 'translateY(-100%)',
                        opacity: '0'
                    },
                    '100%': {
                        transform: 'translateY(0)',
                        opacity: '1'
                    },
                }
            },
            animation: {
                'slide-in-down': 'slide-in-down 0.3s ease-out forwards'
            }
        },
    },

    plugins: [
        require('@tailwindcss/forms'),
        require('tailwindcss-animate'),
    ],
};
