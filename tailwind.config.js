/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      // .claude/skills/dogadanpack-design/SKILL.md token'lari
      colors: {
        green: { DEFAULT: "#1F3B13", soft: "#2E5220" },   // Pantone 5535 C
        leaf: "#4C8A2E",
        moss: "#7BA05B",
        bone: "#F7F5EE",
        fiber: "#EDE9DC",
        cream: "#FBFAF5",
        line: "#DDD8C8",
        ink: "#171D12",
        ongreen: { DEFAULT: "#F2EFE4", muted: "#AEC49A" },
        terra: "#A63D2F", // uyari — toprak kizili
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(2.4rem,5vw,3.8rem)", { lineHeight: "1.15" }],
        h2: ["clamp(1.8rem,3.4vw,2.6rem)", { lineHeight: "1.15" }],
        lead: ["1.08rem", { lineHeight: "1.6" }],
      },
      spacing: { 18: "4.5rem" }, // 8px grid disina cikma
      borderRadius: { organic: "18px 22px 16px 24px", card: "20px" },
      boxShadow: {
        cta: "0 8px 24px rgba(31,59,19,.25)",
        card: "0 18px 40px rgba(31,59,19,.12)",
      },
      maxWidth: { wrap: "1180px" },
    },
  },
  plugins: [],
};
