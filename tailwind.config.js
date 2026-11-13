tailwind.config = { theme: { extend: {
  colors: {
    ink: "#0A0E2A", mu: "#5B6288", bd: "#E3E1F5", bg: "#F6F5FF",
    navy: { 950: "#060924", 900: "#0A0E2A", 800: "#111741", 700: "#1A2260" },
    lav: { 50: "#F8F7FF", 100: "#EFEDFF", 200: "#E0DBFF", 300: "#C9BEFF" },
    vio: { DEFAULT: "#6C4BFF", d: "#5334E6", l: "#EFEBFF", m: "#C9BEFF" },
    blu: { DEFAULT: "#2F7BFF", d: "#1D63E0", l: "#EAF2FF" },
    am: { DEFAULT: "#B45F06", l: "#FFF4E0" },
    ok: { DEFAULT: "#0F8F68", l: "#E6F7F1" }
  },
  fontFamily: {
    sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
    serif: ['"Instrument Serif"', "Georgia", "serif"],
    mono: ['"JetBrains Mono"', "ui-monospace", "monospace"]
  },
  boxShadow: {
    card: "0 1px 2px rgba(18,23,70,.06), 0 6px 20px -8px rgba(18,23,70,.12)",
    lift: "0 2px 4px rgba(18,23,70,.05), 0 22px 44px -18px rgba(70,55,190,.32)",
    glow: "0 10px 30px -8px rgba(108,75,255,.55)"
  } } } };
