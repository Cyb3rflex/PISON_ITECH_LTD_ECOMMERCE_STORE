/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}





// export default {
//     content: [
//         "./index.html",
//         "./src/**/*.{js,jsx,ts,tsx}"
//     ],
//     darkMode: "class",
//     theme: {
//         // container: {
//         //     center: true,
//         //     padding: {
//         //         DEFAULT: "1rem",
//         //         sm: "1.5rem",
//         //         lg: "2rem",
//         //         xl: "4rem"
//         //     }
//         },
//         extend: {
//             colors: {
//                 primary: {
//                     50: "#f0fdfa",
//                     100: "#ccfbf1",
//                     200: "#99f6e4",
//                     300: "#5eead4",
//                     400: "#2dd4bf",
//                     500: "#14b8a6",
//                     600: "#0d9488",
//                     700: "#0f766e",
//                     800: "#115e59",
//                     900: "#134e4a"
//                 },
//                 accent: {
//                     DEFAULT: "#ff7a59",
//                     50: "#fff3ef",
//                     100: "#ffe6dc",
//                     200: "#ffc9b5",
//                     300: "#ffa088",
//                     400: "#ff7a59",
//                     500: "#ff5f3f",
//                     600: "#e54f37",
//                     700: "#b43c2a",
//                     800: "#8f2f21",
//                     900: "#6d2419"
//                 },
//                 neutral: {
//                     50: "#fafafa",
//                     100: "#f5f5f5",
//                     200: "#e5e7eb",
//                     300: "#d1d5db",
//                     400: "#9ca3af",
//                     500: "#6b7280",
//                     600: "#4b5563",
//                     700: "#374151",
//                     800: "#1f2937",
//                     900: "#111827"
//                 }
//             },
//             boxShadow: {
//                 card: "0 6px 20px rgba(16,24,40,0.08)",
//                 "card-lg": "0 10px 30px rgba(16,24,40,0.12)",
//                 "outline-primary": "0 0 0 3px rgba(20,184,166,0.12)"
//             },
//             borderRadius: {
//                 xl: "1rem"
//             },
//             fontFamily: {
//                 sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"]
//             },
//             transitionTimingFunction: {
//                 "in-expo": "cubic-bezier(0.16, 1, 0.3, 1)"
//             }
//         }
//     },
//     plugins: [
//         // require("@tailwindcss/forms"),
//         // require("@tailwindcss/typography"),
//         // require("@tailwindcss/aspect-ratio")
//     ]
// };