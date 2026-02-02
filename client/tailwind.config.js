/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#E56E0C',        // Orange - Primary/CTA
                'soft-green': '#D4EAA8',   // Soft Green
                lavender: '#CDADE6',       // Lavender Purple
                'sky-blue': '#C8DCE3',     // Sky Blue
                secondary: '#1A202C',      // Dark slate (kept from original)
                accent: '#EDF2F7',         // Off-white/Gray (kept from original)
                'text-dark': '#1A202C',
                'text-light': '#718096',
            },
            fontFamily: {
                sans: ['Laila', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
