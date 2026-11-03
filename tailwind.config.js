/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    bg: '#000E23',
                    primary: '#FE0E33',
                    secondary: '#00EBD4',
                    text: '#FDFFFC',
                    card: 'rgba(0, 14, 35, 0.75)',
                }
            },
            fontFamily: {
                main: ['Gohan', 'sans-serif'],
                secondary: ['Gabriola', 'serif'],
            }
        },
    },
    plugins: [],
}