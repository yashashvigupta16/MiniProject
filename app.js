const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const cx = (...a) => a.filter(Boolean).join(" ");
const fmtSize = b => b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";
const goTo = id => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
const COLS = ["#6C4BFF", "#2F7BFF", "#A99BFF", "#1A2260"];

/* ============ ICONS & ATOMS ============ */
const P = { upload: "M12 15V3m0 0L7 8m5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4", file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6", check: "M20 6 9 17l-5-5", x: "M18 6 6 18M6 6l12 12",
 alert: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01", back: "m12 19-7-7 7-7M19 12H5", zap: "M13 2 3 14h9l-1 8 10-12h-9z", download: "M12 3v12m0 0 5-5m-5 5-5-5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4",
 route: "M6 19h8.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H18", bars: "M3 3v18h18M8 17v-5M13 17V8M18 17v-9", cols: "M12 3v18M4 6h5v12H4zM15 9h5v9h-5z", plus: "M5 12h14M12 5v14", out: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
 arrow: "M5 12h14m-6-6 6 6-6 6", eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", eyeoff: "M9.9 4.2A10 10 0 0 1 12 4c6.5 0 10 8 10 8a17 17 0 0 1-2.2 3.2M6.6 6.6A16 16 0 0 0 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2",
 clock: "M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z", trash: "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6", refresh: "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5",
 target: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", layers: "m12 2 10 5-10 5L2 7zM2 17l10 5 10-5M2 12l10 5 10-5",
 spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z", menu: "M4 7h16M4 12h16M4 17h16", trend: "m22 7-8.5 8.5-5-5L2 17M16 7h6v6",
 user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4", mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
 info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01", okc: "M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4 12 14l-3-3", grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z", list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01", loader: "M21 12a9 9 0 1 1-6.2-8.55" };
const Ic = ({ n, s = 16, c = "", w = 1.8 }) => html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=${w} stroke-linecap="round" stroke-linejoin="round" class=${cx("shrink-0", c)} aria-hidden="true"><path d=${P[n]}/></svg>`;
const Card = ({ c = "", children }) => html`<div class=${cx("surface", c)}>${children}</div>`;
const Btn = ({ v, c = "", ...p }) => html`<button ...${p} class=${cx("btn", v === "p" ? "btn-p" : v === "w" ? "btn-w" : "btn-g", c)}/>`;
const TK = { n: "", ok: "tag-ok", am: "tag-am" };
const Tag = ({ t, k = "n", x }) => html`<span class=${cx("tag", TK[k])}>${k === "ok" && html`<${Ic} n="check" s=${12} w=${2.4}/>`}${t}${x && html`<button type="button" onClick=${x} aria-label=${"Remove " + t}><${Ic} n="x" s=${12}/></button>`}</span>`;
const Bar = ({ v, c = "fill-brand", h = "h-2", col }) => { const [w, setW] = useState(0); useEffect(() => { const t = setTimeout(() => setW(v), 40); return () => clearTimeout(t); }, [v]);
  return html`<div class=${cx("track", h)}><i class=${col ? "" : c} style=${{ width: w + "%", background: col || undefined }}/></div>`; };
const Mark = ({ s = 32 }) => html`<span class="grid place-items-center rounded-[10px] fill-brand shadow-glow" style=${{ width: s, height: s }}><svg width=${s * .6} height=${s * .6} viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19 12 5l7 14M8.5 14h7"/><circle cx="12" cy="5" r="1.6" fill="#fff"/></svg></span>`;
const Brand = ({ dark }) => html`<div class=${cx("flex items-center gap-2.5 font-extrabold text-[19px] tracking-tight", dark ? "text-white" : "text-ink")}><${Mark}/>AlgoMind</div>`;
const Defs = () => html`<svg width="0" height="0" style=${{ position: "absolute" }} aria-hidden="true"><defs><linearGradient id="gv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6C4BFF"/><stop offset="1" stop-color="#2F7BFF"/></linearGradient><linearGradient id="gw" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9BEFF"/><stop offset="1" stop-color="#7FB0FF"/></linearGradient></defs></svg>`;
const Ring = ({ v, s = 64, w = 7, dark, txt = true }) => { const [o, setO] = useState(0); useEffect(() => { const t = setTimeout(() => setO(v), 60); return () => clearTimeout(t); }, [v]);
  const r = (s - w) / 2, C = 2 * Math.PI * r;
  return html`<div class="relative shrink-0" style=${{ width: s, height: s }} role="img" aria-label=${"Score " + Math.round(v) + " percent"}><svg width=${s} height=${s} viewBox=${"0 0 " + s + " " + s} style=${{ transform: "rotate(-90deg)" }}>
    <circle cx=${s / 2} cy=${s / 2} r=${r} fill="none" stroke=${dark ? "rgba(255,255,255,.14)" : "#EAE7FB"} stroke-width=${w}/>
    <circle class="ring-arc" cx=${s / 2} cy=${s / 2} r=${r} fill="none" stroke=${dark ? "url(#gw)" : "url(#gv)"} stroke-width=${w} stroke-linecap="round" stroke-dasharray=${C} stroke-dashoffset=${C * (1 - o / 100)}/></svg>
    ${txt && html`<div class=${cx("absolute inset-0 grid place-items-center font-bold tnum", dark ? "text-white" : "text-ink")} style=${{ fontSize: s * .27 }}><span>${Math.round(v)}<span style=${{ fontSize: s * .15, marginLeft: 1, opacity: .6 }}>%</span></span></div>`}</div>`; };
const Radar = ({ d, dark }) => { const k = Object.keys(d), cxn = 130, cy = 118, R = 78, p = (v, i, m = 1) => { const a = (i * 90 - 90) * Math.PI / 180, r = v / 100 * R * m; return [cxn + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const pts = k.map((x, i) => p(d[x], i).join(",")).join(" ");
  return html`<svg viewBox="0 0 260 236" class="w-full max-w-[280px] mx-auto" role="img" aria-label=${"Score breakdown radar: " + k.map(x => x + " " + d[x] + "%").join(", ")}>
  ${[25, 50, 75, 100].map(r => html`<polygon key=${r} points=${k.map((_, i) => p(r, i).join(",")).join(" ")} fill=${r === 100 ? "rgba(108,75,255,.04)" : "none"} stroke="#DAD5F5" stroke-dasharray=${r === 100 ? "" : "2 3"}/>`)}
  ${k.map((_, i) => html`<line key=${i} x1=${cxn} y1=${cy} x2=${p(100, i)[0]} y2=${p(100, i)[1]} stroke="#E3E0F6"/>`)}
  <polygon points=${pts} fill="rgba(108,75,255,.2)" stroke="url(#gv)" stroke-width="2.2" stroke-linejoin="round"/>
  ${k.map((x, i) => { const [a, b] = p(d[x], i); return html`<circle key=${x} cx=${a} cy=${b} r="4" fill="#fff" stroke="#6C4BFF" stroke-width="2"/>`; })}
  ${k.map((x, i) => { const [a, b] = p(100, i, 1.3); return html`<text key=${x} x=${a} y=${b} font-size="10.5" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="#5B6288">${x.split(" ")[0]}</text>`; })}</svg>`; };
const pri = d => d >= 50 ? "High" : d >= 30 ? "Medium" : "Low";
const PRI = { High: "bg-rose-50 text-rose-700 border-rose-200", Medium: "bg-am-l text-am border-amber-200", Low: "bg-blu-l text-blu-d border-blue-200" };
const Spinner = ({ s = 16 }) => html`<${Ic} n="loader" s=${s} c="spin"/>`;

/* ============ LANDING ============ */
const HeroScene = () => { const ref = useRef(); const R0 = ROLES[0];
  const move = e => { const el = ref.current; if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return; const b = el.getBoundingClientRect(); const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5; el.style.setProperty("--ry", (x * 10).toFixed(2) + "deg"); el.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg"); };
  const leave = () => { const el = ref.current; if (el) { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); } };
  const lines = [[92, 0], [78, 1], [86, 0], [64, 0]];
  return html`<div class="scene-enter"><div ref=${ref} class="scene" onMouseMove=${move} onMouseLeave=${leave} role="img" aria-label="Illustration: a resume being analysed and matched to roles, using sample data">
    <div class="scene-in">
      <div class="plate plate-a"/><div class="plate plate-b"/>
      <div class="resume" style=${{ "--h": "430px" }}>
        <div class="flex items-center gap-3"><span class="w-11 h-11 rounded-full fill-brand grid place-items-center text-white font-bold text-sm">AM</span><div><div class="font-bold text-[15px] leading-tight">${SAMPLE.name}</div><div class="text-[11px] text-mu">B.Tech Computer Science, 2027</div></div></div>
        <div class="mt-5 grid gap-2">${lines.map(([w, h], i) => html`<div key=${i} class=${cx("sk", h && "hl")} style=${{ width: w + "%" }}/>`)}</div>
        <div class="mt-5 text-[11px] font-bold text-mu">Skills</div>
        <div class="flex flex-wrap gap-1.5 mt-2">${SAMPLE.skills.slice(0, 10).map(s => html`<span key=${s} class=${cx("chip-s", R0.matched.includes(s) && "on")}>${s}</span>`)}</div>
        <div class="mt-5 text-[11px] font-bold text-mu">Projects</div>
        <div class="mt-2 grid gap-2">${[[88, 1], [70, 0], [80, 1], [52, 0]].map(([w, h], i) => html`<div key=${i} class=${cx("sk", h && "hl")} style=${{ width: w + "%" }}/>`)}</div>
        <div class="beam"/></div>
      <div class="float f1 glass-dark p-3.5 flex items-center gap-3" style=${{ top: "-1%", right: "-6%", width: "62%" }}><${Ring} v=${R0.score} s=${58} w=${6} dark/><div class="min-w-0"><div class="text-[10.5px] text-white/60">Top match</div><div class="text-[13px] font-bold leading-tight">${R0.title}</div></div></div>
      <div class="float f2 glass p-3.5" style=${{ left: "-9%", bottom: "9%", width: "58%" }}><div class="text-[10.5px] font-semibold text-mu mb-2">Matched skills</div><div class="flex flex-wrap gap-1.5">${R0.matched.slice(0, 4).map(s => html`<span key=${s} class="chip-s on">${s}</span>`)}</div></div>
      <div class="float f3 glass p-3.5" style=${{ right: "-7%", bottom: "26%", width: "50%" }}><div class="flex justify-between text-[11px] font-semibold"><span>${R0.gaps[0][0]}</span><span class="text-mu tnum">${R0.gaps[0][1]} / ${R0.gaps[0][2]}</span></div><div class="relative mt-2"><div class="track h-2"><i class="fill-brand" style=${{ width: R0.gaps[0][1] + "%" }}/></div><span class="absolute -top-1 w-0.5 h-4 bg-am rounded" style=${{ left: R0.gaps[0][2] + "%" }}/></div></div>
    </div></div></div>`; };

const FEATURES = [
  ["Rank several roles at once", "Select the roles you care about, or paste a job description. Every role gets its own alignment score, ordered highest first.", "layers"],
  ["Explainable scores", "Each score breaks into skills, projects, education and experience, with a written reason you can check against your resume.", "target"],
  ["Skill-gap analysis", "See your current level against what the role expects, ranked by how much work each gap needs.", "bars"],
  ["Learning roadmap", "A phased plan built from your gaps, with tasks you can tick off as you go.", "route"],
  ["Side-by-side comparison", "Put any roles next to each other and see which missing skills show up again and again.", "cols"]];
const FeatVisual = ({ i }) => { const R0 = ROLES[0];
  if (i === 0) return html`<div class="grid gap-2.5 mt-5">${ROLES.map((r, j) => html`<div key=${r.id} class="grid grid-cols-[1fr_44px] items-center gap-3 text-[13px]"><div><div class="flex justify-between mb-1.5 font-semibold"><span>${r.title}</span></div><${Bar} v=${r.score} col=${COLS[j]}/></div><span class="font-bold tnum text-right">${r.score}%</span></div>`)}</div>`;
  if (i === 1) return html`<div class="mt-2"><${Radar} d=${R0.b}/></div>`;
  if (i === 2) return html`<div class="grid gap-3 mt-5">${R0.gaps.slice(0, 3).map(([s, c, q]) => html`<div key=${s}><div class="flex justify-between text-xs font-semibold mb-1.5"><span>${s}</span><span class="text-mu tnum">${c}% of ${q}%</span></div><div class="relative"><div class="track h-2"><i class="fill-brand" style=${{ width: c + "%" }}/></div><span class="absolute -top-1 w-0.5 h-4 bg-am rounded" style=${{ left: q + "%" }}/></div></div>`)}</div>`;
  if (i === 3) return html`<ul class="mt-5 grid gap-3">${R0.road.map(([w, t], j) => html`<li key=${t} class="flex items-center gap-3 text-[13px]"><span class="w-6 h-6 rounded-full bg-vio-l text-vio font-bold grid place-items-center text-xs shrink-0">${j + 1}</span><span><b>${t}</b> <span class="text-mu">${w}</span></span></li>`)}</ul>`;
  return html`<div class="flex flex-wrap gap-2 mt-5">${ROLES.map((r, j) => html`<span key=${r.id} class="tag"><span class="w-2 h-2 rounded-sm" style=${{ background: COLS[j] }}/>${r.title}</span>`)}</div>`; };
const HOW = [["Upload your resume", "Drop in a PDF or DOCX up to 10 MB. We check the file before anything else happens.", "upload"], ["Review and choose roles", "Fix anything that was extracted wrongly, then pick roles or paste a job description.", "target"], ["Run the alignment", "Watch each analysis stage complete, from text extraction to skill-gap analysis.", "zap"], ["Act on the results", "Read the ranking, close your gaps with the roadmap, and download a report.", "trend"]];

const Landing = ({ onStart, onDemo }) => { const [m, setM] = useState(false), [sc, setSc] = useState(false);
  useEffect(() => { const f = () => setSc(window.scrollY > 12); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  const nav = id => { setM(false); goTo(id); };
  return html`<div class="font-sans text-ink">
  <header class=${cx("fixed top-0 inset-x-0 z-40 transition-colors duration-300", sc || m ? "bg-navy-900/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent border-b border-transparent")}><div class="max-w-6xl mx-auto px-5 h-16 flex items-center gap-6">
    <${Brand} dark/><nav class="hidden md:flex gap-1 ml-6 text-sm font-medium text-white/70">${[["features", "Features"], ["how", "How it works"], ["pipeline", "Analysis stages"]].map(([id, l]) => html`<button key=${id} onClick=${() => nav(id)} class="px-3 py-2 rounded-lg hover:text-white hover:bg-white/10 transition-colors">${l}</button>`)}</nav>
    <div class="ml-auto hidden sm:flex items-center gap-2"><${Btn} v="w" c="btn-sm" onClick=${() => onStart("in")}>Sign in<//><${Btn} v="p" c="btn-sm" onClick=${() => onStart("up")}>Get started<//></div>
    <button class="ml-auto sm:hidden text-white p-2 rounded-lg hover:bg-white/10" aria-label=${m ? "Close menu" : "Open menu"} aria-expanded=${m} onClick=${() => setM(!m)}><${Ic} n=${m ? "x" : "menu"} s=${22}/></button></div>
    ${m && html`<div class="sm:hidden px-5 pb-5 grid gap-1 text-white/80 fade">${[["features", "Features"], ["how", "How it works"], ["pipeline", "Analysis stages"]].map(([id, l]) => html`<button key=${id} onClick=${() => nav(id)} class="text-left px-3 py-3 rounded-lg hover:bg-white/10">${l}</button>`)}<div class="grid grid-cols-2 gap-2 mt-2"><${Btn} v="w" onClick=${() => onStart("in")}>Sign in<//><${Btn} v="p" onClick=${() => onStart("up")}>Get started<//></div></div>`}</header>

  <section class="navy-bg overflow-hidden text-white"><div class="grid-lines"/><div class="orb w-72 h-72 bg-vio/40 -top-10 right-10"/><div class="orb w-64 h-64 bg-blu/30 bottom-0 -left-10"/>
    <div class="relative max-w-6xl mx-auto px-5 pt-32 pb-20 md:pt-40 md:pb-28 grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
      <div class="hero-in">
        <div class="inline-flex items-center gap-2 text-xs font-semibold text-white/80 border border-white/15 bg-white/5 rounded-full pl-2 pr-3.5 py-1.5"><span class="w-5 h-5 rounded-full fill-brand grid place-items-center"><${Ic} n="spark" s=${11} w=${2.2}/></span>Resume-to-role alignment</div>
        <h1 class="font-serif font-normal mt-6 text-[clamp(2.7rem,6.2vw,4.9rem)] leading-[1.02] tracking-[-0.02em]">See which roles your resume truly speaks to.</h1>
        <p class="mt-6 text-[17px] leading-relaxed text-white/70 max-w-lg">AlgoMind compares the meaning of your projects and skills with each job description, ranks every role, and shows exactly which skills to build next.</p>
        <div class="flex flex-wrap gap-3 mt-9"><${Btn} v="p" c="btn-lg" onClick=${() => onStart("up")}>Create free account<${Ic} n="arrow" s=${18}/><//><${Btn} v="w" c="btn-lg" onClick=${onDemo}>Try the demo<//></div>
        <div class="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-[13px] text-white/60">${[["file", "PDF and DOCX resumes"], ["layers", "Four alignment dimensions"], ["route", "Roadmap for every role"]].map(([ic, t]) => html`<span key=${t} class="inline-flex items-center gap-2"><${Ic} n=${ic} s=${15} c="text-vio-m"/>${t}</span>`)}</div>
        <p class="mt-6 text-xs text-white/40 max-w-md">Frontend prototype: analysis values shown here are demonstration data, and nothing you enter is sent anywhere.</p></div>
      <${HeroScene}/></div></section>

  <section id="features" class="app-bg py-24"><div class="max-w-6xl mx-auto px-5">
    <div class="max-w-2xl"><h2 class="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-[1.1]">Everything between your resume and the right role</h2><p class="mt-4 text-mu text-[17px] leading-relaxed">One workspace takes you from an uploaded file to a ranked list of roles and a plan for closing the gaps.</p></div>
    <div class="grid md:grid-cols-3 gap-5 mt-12">${FEATURES.map(([t, d, ic], i) => html`<div key=${t} class=${cx("surface lift p-6 flex flex-col overflow-hidden", i === 0 && "md:col-span-2")}><span class="w-10 h-10 rounded-xl bg-vio-l text-vio grid place-items-center"><${Ic} n=${ic} s=${19}/></span><h3 class="font-bold text-lg mt-4">${t}</h3><p class="text-mu text-sm leading-relaxed mt-1.5 max-w-md">${d}</p><${FeatVisual} i=${i}/></div>`)}
      <div class="md:col-span-3 navy-bg rounded-[20px] p-7 md:p-9 flex flex-wrap items-center justify-between gap-5 text-white overflow-hidden"><div class="relative max-w-xl"><h3 class="font-bold text-xl">Edit what was extracted, then download your report</h3><p class="text-white/65 text-sm mt-1.5 leading-relaxed">Add, remove or correct skills, projects and certifications before you run the analysis. Save the full results as a report to keep or share.</p></div><${Btn} v="p" c="relative" onClick=${onDemo}>Open the demo<${Ic} n="arrow" s=${16}/><//></div></div></div></section>

  <section id="how" class="bg-white py-24 border-y border-bd"><div class="max-w-6xl mx-auto px-5">
    <div class="max-w-2xl"><h2 class="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-[1.1]">From file to roadmap in four steps</h2></div>
    <ol class="grid md:grid-cols-4 gap-x-6 gap-y-10 mt-14 relative">${HOW.map(([t, d, ic], i) => html`<li key=${t} class="relative"><div class="flex items-center gap-3"><span class="w-12 h-12 rounded-2xl fill-brand text-white grid place-items-center shadow-glow relative z-10"><${Ic} n=${ic} s=${21}/></span>${i < 3 && html`<span class="hidden md:block flex-1 h-px bg-gradient-to-r from-vio-m to-transparent"/>`}</div><div class="text-xs font-bold text-vio mt-5">Step ${i + 1}</div><h3 class="font-bold text-lg mt-1">${t}</h3><p class="text-mu text-sm leading-relaxed mt-1.5">${d}</p></li>`)}</ol></div></section>

  <section id="pipeline" class="app-bg py-24"><div class="max-w-6xl mx-auto px-5 grid lg:grid-cols-[.9fr_1.1fr] gap-12 items-center">
    <div><h2 class="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-[1.1]">Nine stages, visible while they run</h2><p class="mt-4 text-mu text-[17px] leading-relaxed max-w-md">You see each stage of the analysis as it completes, so the result never arrives as a black box.</p><p class="mt-4 text-xs text-mu max-w-md">This prototype simulates the stages and returns sample results. Connect your own engine to the same screens to get real ones.</p></div>
    <div class="surface p-6 md:p-7"><ul class="grid sm:grid-cols-2 gap-x-6 gap-y-3.5">${STEPS.map((s, i) => html`<li key=${s} class="flex items-center gap-3 text-sm font-medium"><span class="w-6 h-6 rounded-full bg-vio-l text-vio grid place-items-center text-[11px] font-bold shrink-0">${i + 1}</span>${s}</li>`)}</ul></div></div></section>

  <section class="navy-bg text-white overflow-hidden"><div class="grid-lines"/><div class="relative max-w-3xl mx-auto px-5 py-24 text-center"><h2 class="font-serif text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] tracking-[-0.02em]">Find out where your resume stands.</h2><p class="mt-4 text-white/65 text-[17px]">Start with the sample resume, or upload your own.</p><div class="flex flex-wrap justify-center gap-3 mt-8"><${Btn} v="p" c="btn-lg" onClick=${() => onStart("up")}>Create free account<//><${Btn} v="w" c="btn-lg" onClick=${onDemo}>Try the demo<//></div></div></section>

  <footer class="bg-navy-950 text-white/60"><div class="max-w-6xl mx-auto px-5 py-12 grid md:grid-cols-[1.2fr_1fr] gap-8 items-start"><div><${Brand} dark/><p class="text-sm mt-4 max-w-sm leading-relaxed">Autonomous resume-to-job matching that explains every score and turns gaps into a plan.</p></div>
    <div class="flex flex-wrap gap-x-10 gap-y-3 text-sm md:justify-end">${[["features", "Features"], ["how", "How it works"], ["pipeline", "Analysis stages"]].map(([id, l]) => html`<button key=${id} onClick=${() => goTo(id)} class="hover:text-white transition-colors">${l}</button>`)}<button onClick=${() => onStart("in")} class="hover:text-white transition-colors">Sign in</button></div></div>
    <div class="border-t border-white/10"><div class="max-w-6xl mx-auto px-5 py-5 text-xs flex flex-wrap justify-between gap-2"><span>${"© " + new Date().getFullYear() + " AlgoMind"}</span><span>Frontend prototype. No data is sent anywhere.</span></div></div></footer></div>`; };

/* ============ AUTH ============ */
const Field = ({ id, label, icon, error, ok, right, ...rest }) => html`<div><label htmlFor=${id} class="text-[13px] font-semibold">${label}</label>
  <div class=${cx("field-wrap mt-1.5", error && "is-err", ok && !error && "is-ok")}><${Ic} n=${icon} s=${17} c="field-ic"/><input id=${id} aria-invalid=${!!error} aria-describedby=${error ? id + "-e" : undefined} class="field" ...${rest}/>${right}</div>
  ${error && html`<p id=${id + "-e"} role="alert" class="flex items-center gap-1.5 text-[12.5px] text-rose-600 mt-1.5 fade"><${Ic} n="alert" s=${13}/>${error}</p>`}</div>`;
const validate = (m, f) => { const e = {}, em = f.email.trim();
  if (m === "up" && f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!em) e.email = "Enter your email address."; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) e.email = "Enter a valid email, like name@company.com.";
  if (!f.pw) e.pw = "Enter your password."; else if (m === "up" && f.pw.length < 8) e.pw = "Use at least 8 characters."; else if (m === "up" && !(/\d/.test(f.pw) && /[a-zA-Z]/.test(f.pw))) e.pw = "Mix letters and numbers.";
  return e; };
const strength = p => { let s = 0; if (p.length >= 8) s++; if (p.length >= 12) s++; if (/[a-z]/.test(p) && /[A-Z]/.test(p)) s++; if (/\d/.test(p)) s++; if (/[^\w\s]/.test(p)) s++; return Math.min(s, 4); };
const SL = ["Too short", "Weak", "Fair", "Good", "Strong"];

const Auth = ({ onIn, mode, onBack }) => { const [m, setM] = useState(mode || "in"), [f, setF] = useState({ name: "", email: "", pw: "" }), [t, setT] = useState({}), [show, setShow] = useState(false), [busy, setBusy] = useState(false), [shake, setShake] = useState(0);
  const er = validate(m, f), set = k => ev => setF(s => ({ ...s, [k]: ev.target.value })), blur = k => () => setT(s => ({ ...s, [k]: true })), vis = k => t[k] && er[k];
  const demo = () => onIn({ name: "Aarav Mehta", email: "demo@algomind.app" });
  const go = async ev => { ev && ev.preventDefault(); setT({ name: true, email: true, pw: true });
    if (Object.keys(er).length) { setShake(n => n + 1); const k = ["name", "email", "pw"].find(x => er[x]); const el = document.getElementById("f-" + k); if (el) el.focus(); return; }
    setBusy(true); await sleep(650);
    const nm = m === "up" ? f.name.trim() : f.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    onIn({ name: nm || "Aarav Mehta", email: f.email.trim() }); };
  const sw = k => { setM(k); setT({}); };
  const st = strength(f.pw);
  return html`<div class="min-h-screen grid lg:grid-cols-[1fr_1.05fr] font-sans text-ink fade">
    <div class="navy-bg hidden lg:flex flex-col justify-between p-12 xl:p-16 text-white overflow-hidden"><div class="grid-lines"/><div class="relative"><button onClick=${onBack} aria-label="Back to home"><${Brand} dark/></button></div>
      <div class="relative"><h1 class="font-serif text-[3.4rem] xl:text-6xl leading-[1.04] tracking-[-0.02em] max-w-md">Know where you stand before you apply.</h1>
        <ul class="mt-8 grid gap-3.5 text-[15px] text-white/75">${["Multi-role ranking with alignment scores", "Explainable results, not just a number", "Skill gaps and an improvement roadmap"].map(x => html`<li key=${x} class="flex gap-3"><span class="w-5 h-5 rounded-full bg-white/10 border border-white/20 grid place-items-center mt-0.5"><${Ic} n="check" s=${12} w=${2.5}/></span>${x}</li>`)}</ul></div>
      <div class="relative glass-dark rounded-2xl p-5 flex items-center gap-4 max-w-sm"><${Ring} v=${ROLES[0].score} s=${64} w=${7} dark/><div><div class="text-xs text-white/55">Sample result</div><div class="font-bold">${ROLES[0].title}</div><div class="text-xs text-white/55 mt-0.5">Matched ${ROLES[0].matched.length} skills, ${ROLES[0].missing.length} to build</div></div></div></div>
    <div class="app-bg flex items-center justify-center p-5 py-10 relative"><button onClick=${onBack} class="absolute top-5 left-5 btn btn-g btn-sm"><${Ic} n="back" s=${14}/>Home</button>
      <div key=${shake} class=${cx("glass rounded-[24px] w-full max-w-[440px] p-7 sm:p-9", shake && "shake")}><div class="lg:hidden mb-6"><${Brand}/></div>
        <h2 class="text-2xl font-extrabold tracking-tight">${m === "in" ? "Welcome back" : "Create your account"}</h2><p class="text-sm text-mu mt-1.5">${m === "in" ? "Sign in to see your role rankings and roadmaps." : "Start ranking roles against your resume."}</p>
        <div class="grid grid-cols-2 mt-6 bg-lav-100 rounded-xl p-1 text-sm font-semibold" role="tablist">${[["in", "Sign in"], ["up", "Create account"]].map(([k, l]) => html`<button key=${k} role="tab" aria-selected=${m === k} onClick=${() => sw(k)} class=${cx("py-2 rounded-[9px] transition-all", m === k ? "bg-white text-ink shadow-card" : "text-mu hover:text-ink")}>${l}</button>`)}</div>
        <div class="grid grid-cols-2 gap-3 mt-5"><${Btn} onClick=${demo}>Google<//><${Btn} onClick=${demo}>GitHub<//></div>
        <div class="flex items-center gap-3 my-5 text-xs text-mu"><span class="flex-1 h-px bg-bd"/>or continue with email<span class="flex-1 h-px bg-bd"/></div>
        <form onSubmit=${go} noValidate class="grid gap-4">
          ${m === "up" && html`<${Field} id="f-name" label="Full name" icon="user" placeholder="Aarav Mehta" autoComplete="name" value=${f.name} onChange=${set("name")} onBlur=${blur("name")} error=${vis("name")} ok=${t.name && !er.name}/>`}
          <${Field} id="f-email" label="Email address" icon="mail" type="email" placeholder="name@company.com" autoComplete="email" value=${f.email} onChange=${set("email")} onBlur=${blur("email")} error=${vis("email")} ok=${t.email && !er.email}/>
          <div><${Field} id="f-pw" label="Password" icon="lock" type=${show ? "text" : "password"} placeholder=${m === "up" ? "At least 8 characters" : "Your password"} autoComplete=${m === "up" ? "new-password" : "current-password"} value=${f.pw} onChange=${set("pw")} onBlur=${blur("pw")} error=${vis("pw")} ok=${t.pw && !er.pw}
            right=${html`<button type="button" class="field-btn" onClick=${() => setShow(!show)} aria-label=${show ? "Hide password" : "Show password"}><${Ic} n=${show ? "eyeoff" : "eye"} s=${17}/></button>`}/>
            ${m === "up" && f.pw && html`<div class="mt-2.5 fade"><div class="grid grid-cols-4 gap-1.5">${[0, 1, 2, 3].map(i => html`<span key=${i} class="h-1.5 rounded-full transition-colors" style=${{ background: i < st ? (st < 2 ? "#E5484D" : st < 3 ? "#E8A317" : "#6C4BFF") : "#EAE7FB" }}/>`)}</div><p class="text-xs text-mu mt-1.5">Password strength: <b class="text-ink">${SL[st]}</b></p></div>`}</div>
          <${Btn} v="p" type="submit" c="w-full mt-1 py-3" disabled=${busy}>${busy ? html`<${Spinner}/>` : null}${busy ? "Please wait" : m === "in" ? "Sign in to dashboard" : "Create account"}<//></form>
        <button onClick=${demo} class="link mt-5 w-full text-sm text-center">Explore with the demo account</button>
        <p class="text-xs text-mu mt-4 text-center">Frontend prototype. No data is sent anywhere.</p></div></div></div>`; };

/* ============ WORKSPACE ============ */
const Section = ({ k, l, items, set }) => { const [v, setV] = useState("");
  return html`<div class="py-4 border-t border-bd first:border-t-0"><div class="flex items-center justify-between"><div class="text-sm font-bold">${l}</div><span class="text-xs text-mu tnum">${items.length}</span></div>
    <div class="flex flex-wrap gap-1.5 mt-2.5">${items.length ? items.map((t, i) => html`<${Tag} key=${t + i} t=${t} x=${() => set(k, a => a.filter((_, j) => j !== i))}/>`) : html`<span class="text-xs text-mu">Nothing here yet.</span>`}</div>
    <input value=${v} onChange=${e => setV(e.target.value)} onKeyDown=${e => { if (e.key === "Enter" && v.trim()) { set(k, a => [...a, v.trim()]); setV(""); } }} placeholder=${"Add to " + l.toLowerCase() + ", press Enter"} aria-label=${"Add to " + l} class="mini-input mt-2.5"/></div>`; };

const Stepper = ({ s }) => html`<ol class="flex flex-wrap gap-2.5 mt-7">${[["Add your resume", s[0]], ["Choose roles", s[1]], ["Run the analysis", s[2]]].map(([l, d], i) => html`<li key=${l} class=${cx("flex items-center gap-2.5 text-[13px] font-semibold pl-1.5 pr-4 py-1.5 rounded-full border transition-colors", d ? "bg-vio-l border-vio-m text-vio-d" : "bg-white border-bd text-mu")}><span class=${cx("w-6 h-6 rounded-full grid place-items-center text-xs", d ? "fill-brand text-white" : "bg-lav-100 text-mu")}>${d ? html`<${Ic} n="check" s=${13} w=${2.6}/>` : i + 1}</span>${l}</li>`)}</ol>`;

const Workspace = ({ a }) => { const { prof, file, err, onFile, removeFile, fileRef, picked, toggle, cust, setCust, drawer, setDrawer, jd, setJd, addJd, run, total, setSec, over, setOver, useSampleResume } = a;
  const has = file || prof, ext = file ? (file.name.split(".").pop() || "").toUpperCase() : "";
  return html`<main class="max-w-6xl mx-auto px-5 pb-16 fade"><div class="pt-10 md:pt-14 pb-2"><h1 class="text-3xl md:text-[2.8rem] font-extrabold tracking-tight leading-[1.08] max-w-3xl">See which roles your resume truly speaks to.</h1>
    <p class="text-mu mt-4 max-w-2xl text-[17px] leading-relaxed">AlgoMind compares the meaning of your projects and skills with each job description, ranks every role and explains each score.</p>
    <${Stepper} s=${[!!prof, total > 0, !!prof && total > 0]}/></div>
    <div class="grid lg:grid-cols-2 gap-6 items-start mt-8">
      <${Card} c="p-6 md:p-7"><div class="flex items-start justify-between gap-3"><div><h2 class="font-bold text-lg">Candidate profile</h2><p class="text-sm text-mu mt-0.5">Upload a resume and review what was extracted.</p></div>
        ${has && html`<div class="flex gap-2 shrink-0"><${Btn} c="btn-sm" onClick=${() => fileRef.current.click()}><${Ic} n="refresh" s=${14}/>Replace<//><${Btn} c="btn-sm hover:!text-rose-600" onClick=${removeFile} aria-label="Remove resume"><${Ic} n="trash" s=${14}/>Remove<//></div>`}</div>
        <div class="mt-5" onDragOver=${e => { e.preventDefault(); setOver(true); }} onDragLeave=${() => setOver(false)} onDrop=${e => { e.preventDefault(); setOver(false); onFile(e.dataTransfer.files[0]); }}>
          ${!has ? html`<div role="button" tabIndex="0" onClick=${() => fileRef.current.click()} onKeyDown=${e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), fileRef.current.click())} class=${cx("drop px-5 py-10 text-center cursor-pointer", over && "over")}>
              <span class="w-14 h-14 rounded-2xl fill-brand text-white grid place-items-center mx-auto shadow-glow"><${Ic} n="upload" s=${24}/></span><div class="font-bold mt-4">Drop your resume here</div><div class="text-sm text-mu mt-1">PDF or DOCX, up to 10 MB. Or <span class="text-vio font-semibold">browse files</span>.</div></div>`
          : html`<div class=${cx("inset p-4 transition-shadow", over && "ring-2 ring-vio")}>
              <div class="flex items-center gap-3.5"><span class=${cx("w-12 h-12 rounded-xl grid place-items-center shrink-0 font-bold text-[11px]", ext === "PDF" ? "bg-vio-l text-vio" : "bg-blu-l text-blu-d")}>${file ? ext : html`<${Ic} n="file" s=${20}/>`}</span>
                <div class="min-w-0 flex-1"><div class="font-semibold text-sm truncate">${file ? file.name : "Sample resume"}</div>
                  <div class="text-xs text-mu mt-0.5">${file ? fmtSize(file.size) + " · " : ""}${file && file.status === "reading" ? "Reading file" : file ? "Ready" : "Built-in example profile"}</div></div>
                ${file && file.status === "reading" ? html`<${Spinner} s=${18}/>` : html`<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-ok bg-ok-l rounded-full px-2.5 py-1"><${Ic} n="okc" s=${14}/>Ready</span>`}</div>
              ${file && file.status === "reading" && html`<div class="mt-3.5"><${Bar} v=${file.progress} h="h-1.5"/><div class="flex justify-between text-xs text-mu mt-1.5 tnum"><span>Reading file on your device</span><span>${file.progress}%</span></div></div>`}</div>`}</div>
        <input ref=${fileRef} type="file" hidden accept=".pdf,.docx" onChange=${e => { onFile(e.target.files[0]); e.target.value = ""; }}/>
        <div class="min-h-[1.4em] mt-2" aria-live="polite">${err && html`<div role="alert" class="flex items-start gap-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3.5 py-2.5 fade"><${Ic} n="alert" s=${15} c="mt-0.5"/>${err}</div>`}</div>
        ${prof ? html`<div class="mt-3 fade"><div class="text-[13px] text-mu flex items-start gap-2 bg-lav-50 border border-bd rounded-xl px-3.5 py-2.5"><${Ic} n="info" s=${15} c="text-vio mt-0.5"/><span>${prof.src ? "Preview for " + prof.src + " (sample extraction). " : "Sample resume loaded. "}Edit anything that looks wrong.</span></div><div class="mt-2">${SEC.map(([k, l]) => html`<${Section} key=${k} k=${k} l=${l} items=${prof[k]} set=${setSec}/>`)}</div></div>`
          : html`<div class="border border-dashed border-bd rounded-2xl p-5 text-center text-sm text-mu mt-1">Your parsed skills, education, projects, certifications, experience, internships and achievements will appear here.<div class="mt-3"><${Btn} onClick=${useSampleResume}>Use sample resume<//></div></div>`}<//>
      <${Card} c="p-6 md:p-7"><h2 class="font-bold text-lg">Target roles</h2><p class="text-sm text-mu mt-0.5 mb-5">Select roles to rank, or paste your own job description.</p>
        <div class="grid gap-2.5">${ROLES.map(x => { const on = picked.includes(x.id); return html`<button key=${x.id} role="checkbox" aria-checked=${on} onClick=${() => toggle(x.id)} class=${cx("flex items-center gap-3.5 text-left px-4 py-3.5 rounded-xl border transition-all", on ? "border-vio bg-vio-l shadow-[0_0_0_3px_rgba(108,75,255,.1)]" : "border-bd bg-white hover:border-vio-m hover:bg-lav-50")}>
          <span class=${cx("w-5 h-5 rounded-md border grid place-items-center transition-colors", on ? "fill-brand border-transparent text-white" : "border-slate-300 bg-white")}>${on && html`<${Ic} n="check" s=${13} w=${2.8}/>`}</span><span class="font-semibold text-sm">${x.title}</span></button>`; })}
          ${cust.map((x, i) => html`<div key=${x.id} class="flex items-center justify-between px-4 py-3.5 rounded-xl border border-vio bg-vio-l text-sm"><span class="font-semibold flex items-center gap-2.5"><${Ic} n="file" s=${16} c="text-vio"/>${x.title}</span><button aria-label=${"Remove " + x.title} class="text-mu hover:text-rose-600 p-1" onClick=${() => setCust(c => c.filter((_, j) => j !== i))}><${Ic} n="x"/></button></div>`)}</div>
        <button onClick=${() => setDrawer(!drawer)} aria-expanded=${drawer} class="mt-4 text-sm font-semibold text-vio flex items-center gap-1.5 hover:text-vio-d"><${Ic} n="plus" s=${15}/>Paste a job description</button>
        ${drawer && html`<div class="mt-3 fade"><textarea value=${jd} onChange=${e => setJd(e.target.value)} placeholder="Paste the full job description here. The first line becomes the role name." class="field-area"/><div class="flex items-center justify-between mt-2"><${Btn} c="btn-sm" onClick=${addJd}>Add as a role<//><span class=${cx("text-xs tnum", jd.trim().length >= 30 ? "text-ok" : "text-mu")}>${jd.trim().length} characters, 30 minimum</span></div></div>`}
        <div class="hair mt-6"/>
        <${Btn} v="p" c="w-full mt-6 btn-lg" disabled=${!prof || !total} onClick=${run}><${Ic} n="spark" s=${17}/>Run semantic alignment<//>
        <p class="text-xs text-mu text-center mt-3">${prof && total ? total + " role" + (total > 1 ? "s" : "") + " will be compared." : "Add a resume and select at least one role to continue."}</p><//></div></main>`; };

const Running = ({ step }) => { const pct = Math.round(step / STEPS.length * 100);
  return html`<main class="max-w-xl mx-auto px-5 py-14 md:py-20 fade"><${Card} c="p-7 md:p-9"><div class="flex items-center gap-5"><${Ring} v=${pct} s=${84} w=${8}/><div><h2 class="font-bold text-xl">Running semantic alignment</h2><p class="text-sm text-mu mt-1">${step >= STEPS.length ? "Preparing your results" : STEPS[step]}</p></div></div>
    <div class="mt-6"><${Bar} v=${pct}/></div>
    <ul class="grid gap-3 mt-7">${STEPS.map((s, i) => html`<li key=${s} class=${cx("flex items-center gap-3 text-sm transition-colors", i <= step ? "text-ink font-medium" : "text-slate-400")}>
      <span class=${cx("w-6 h-6 rounded-full grid place-items-center", i < step ? "fill-brand text-white" : i === step ? "border-2 border-vio text-vio" : "border border-bd")}>${i < step ? html`<${Ic} n="check" s=${13} w=${2.8}/>` : i === step && step < STEPS.length ? html`<span class="w-1.5 h-1.5 rounded-full bg-vio pulse-dot"/>` : null}</span>${s}</li>`)}</ul>
    <p class="text-xs text-mu mt-7 pt-5 border-t border-bd">Demonstration only: each stage is simulated with mock data.</p><//></main>`; };

/* ============ RESULTS ============ */
const SH = { skills: "Skills", education: "Edu.", projects: "Proj.", certifications: "Certs", experience: "Exp.", internships: "Intern.", achievements: "Awards" };
const Kpi = ({ ic, l, v, sub, grad }) => html`<div class="surface lift p-5"><div class="flex items-center justify-between"><span class="text-[13px] font-semibold text-mu">${l}</span><span class=${cx("w-9 h-9 rounded-xl grid place-items-center", grad ? "fill-brand text-white shadow-glow" : "bg-vio-l text-vio")}><${Ic} n=${ic} s=${17}/></span></div><div class="text-[1.9rem] font-extrabold tracking-tight mt-3 tnum leading-none">${v}</div><div class="text-xs text-mu mt-2 truncate">${sub}</div></div>`;
const Panel = ({ t, sub, c = "", children, right }) => html`<${Card} c=${cx("p-5 md:p-6", c)}><div class="flex items-start justify-between gap-3"><div><h3 class="font-bold">${t}</h3>${sub && html`<p class="text-[13px] text-mu mt-0.5">${sub}</p>`}</div>${right}</div><div class="mt-5">${children}</div><//>`;

const Overview = ({ r }) => html`<div class="grid gap-5 fade">
  <div class="inset p-5 md:p-6"><div class="grid sm:grid-cols-[1fr_270px] gap-6 items-center"><div><h4 class="font-bold">Score breakdown</h4><div class="grid gap-4 mt-4">${Object.entries(r.b).map(([k, v]) => html`<div key=${k}><div class="flex justify-between text-sm text-mu mb-1.5"><span>${k}</span><b class="font-bold text-ink tnum">${v}%</b></div><${Bar} v=${v}/></div>`)}</div></div><${Radar} d=${r.b}/></div></div>
  <div class="inset p-5 md:p-6 flex gap-4"><span class="w-9 h-9 rounded-xl bg-vio-l text-vio grid place-items-center shrink-0"><${Ic} n="spark" s=${17}/></span><div><h4 class="font-bold">Why this role fits you</h4><p class="text-mu mt-1.5 leading-relaxed text-[15px] max-w-3xl">${r.why}</p></div></div>
  <div class="grid md:grid-cols-2 gap-5">
    <div class="inset p-5 md:p-6"><h4 class="font-bold flex items-center gap-2 text-vio-d"><${Ic} n="okc" s=${17}/>Matched skills and projects</h4><div class="flex flex-wrap gap-1.5 mt-3.5">${r.matched.map(s => html`<${Tag} key=${s} t=${s} k="ok"/>`)}</div>
      ${r.proj.map(([t, d]) => html`<div key=${t} class="mt-4 text-sm pl-3 border-l-2 border-vio-m"><b>${t}</b><p class="text-mu mt-0.5">${d}</p></div>`)}</div>
    <div class="inset p-5 md:p-6"><h4 class="font-bold flex items-center gap-2 text-am"><${Ic} n="alert" s=${17}/>Missing and weakly matched</h4><div class="flex flex-wrap gap-1.5 mt-3.5">${r.missing.map(s => html`<${Tag} key=${s} t=${s} k="am"/>`)}</div>
      ${r.weak.map(([t, d]) => html`<div key=${t} class="mt-4 text-sm pl-3 border-l-2 border-amber-300"><b>${t}</b> <span class="text-xs text-am font-semibold">weak match</span><p class="text-mu mt-0.5">${d}</p></div>`)}</div></div>
  <div class="inset p-5 md:p-6"><h4 class="font-bold">Recommended improvements</h4><ol class="mt-4 grid gap-3.5">${r.recs.map((t, i) => html`<li key=${i} class="flex gap-3.5 text-sm items-start"><span class="w-6 h-6 rounded-full fill-brand text-white grid place-items-center text-xs font-bold shrink-0">${i + 1}</span><span class="text-mu leading-relaxed pt-0.5">${t}</span></li>`)}</ol></div></div>`;

const Gaps = ({ r }) => { const cnt = { High: 0, Medium: 0, Low: 0 }; r.gaps.forEach(([, c, q]) => cnt[pri(q - c)]++);
  return html`<div class="grid gap-5 fade"><div class="grid grid-cols-3 gap-3">${Object.entries(cnt).map(([k, n]) => html`<div key=${k} class="inset p-4"><div class="text-2xl font-extrabold tnum">${n}</div><div class="text-xs text-mu mt-0.5">${k} priority</div></div>`)}</div>
  <div class="inset p-5 md:p-6"><h4 class="font-bold">Skill gap analysis: ${r.title}</h4><p class="text-[13px] text-mu mt-1">The filled bar is your current level. The amber marker is what the role expects, and the hatched area is the gap.</p>
  ${r.gaps.map(([s, c, q]) => { const p = pri(q - c); return html`<div key=${s} class="mt-6"><div class="flex justify-between items-center gap-3 text-sm"><span class="font-semibold">${s}</span><span class="flex items-center gap-2.5"><span class="text-mu text-xs tnum">${c}% of ${q}% needed</span><span class=${cx("text-[11px] font-bold px-2 py-0.5 rounded-full border", PRI[p])}>${p}</span></span></div>
    <div class="relative mt-2.5"><div class="track h-3"/><div class="absolute inset-y-0 left-0 w-full"><div class="absolute inset-y-0 gap-seg rounded-full" style=${{ left: c + "%", width: (q - c) + "%" }}/></div><div class="absolute inset-y-0 left-0 w-full"><${Bar} v=${c} h="h-3"/></div><span class="absolute -top-1.5 w-[3px] h-[24px] bg-am rounded" style=${{ left: "calc(" + q + "% - 1px)" }}/></div></div>`; })}</div></div>`; };

const Road = ({ r, done, tog }) => { const keys = r.road.flatMap(([, , it], i) => it.map((_, j) => r.id + ":" + i + ":" + j)), n = keys.filter(k => done[k]).length, pct = Math.round(n / keys.length * 100);
  return html`<div class="fade grid gap-5"><div class="inset p-5 flex items-center gap-5"><${Ring} v=${pct} s=${64} w=${7}/><div class="flex-1 min-w-0"><h4 class="font-bold">Career improvement roadmap: ${r.title}</h4><p class="text-[13px] text-mu mt-0.5">A phased plan built from your skill gaps. Tick tasks as you finish them.</p><div class="text-xs text-mu mt-2 tnum">${n} of ${keys.length} tasks done</div></div></div>
  <ol class="relative grid gap-4 pl-0">${r.road.map(([w, t, it], i) => { const dn = it.filter((_, j) => done[r.id + ":" + i + ":" + j]).length;
    return html`<li key=${t} class="relative flex gap-4">${i < r.road.length - 1 && html`<span class="absolute left-[19px] top-11 bottom-[-16px] w-px bg-gradient-to-b from-vio-m to-bd"/>`}<span class=${cx("w-10 h-10 rounded-full grid place-items-center font-bold text-sm shrink-0 relative z-10 transition-colors", dn === it.length ? "fill-brand text-white shadow-glow" : "bg-white border-2 border-vio-m text-vio")}>${dn === it.length ? html`<${Ic} n="check" s=${17} w=${2.6}/>` : i + 1}</span>
      <div class="inset p-5 flex-1 min-w-0"><div class="flex flex-wrap justify-between gap-2"><div><span class="text-xs font-semibold text-vio">${w}</span><h4 class="font-bold">${t}</h4></div><span class="text-xs text-mu tnum self-start">${dn}/${it.length}</span></div>
        <ul class="mt-3 grid gap-2">${it.map((x, j) => { const k = r.id + ":" + i + ":" + j, on = !!done[k]; return html`<li key=${k}><button role="checkbox" aria-checked=${on} onClick=${() => tog(k)} class="w-full flex items-start gap-3 text-left text-sm rounded-lg px-2.5 py-2 -mx-2.5 hover:bg-lav-50 transition-colors"><span class=${cx("w-5 h-5 mt-px rounded-md border grid place-items-center shrink-0 transition-colors", on ? "fill-brand border-transparent text-white" : "border-slate-300 bg-white")}>${on && html`<${Ic} n="check" s=${12} w=${3}/>`}</span><span class=${cx("transition-colors", on ? "text-slate-400 line-through" : "text-mu")}>${x}</span></button></li>`; })}</ul></div></li>`; })}</ol></div>`; };

const Compare = ({ res }) => { const [sel, setSel] = useState(res.map(r => r.id));
  if (res.length < 2) return html`<div class="inset p-6 text-mu text-sm">Select at least two roles in the workspace to compare them.</div>`;
  const rs = res.filter(r => sel.includes(r.id)), ms = ["Overall", ...Object.keys(res[0].b)], fq = {};
  rs.forEach(r => r.missing.forEach(s => fq[s] = (fq[s] || 0) + 1));
  return html`<div class="grid gap-5 fade"><div class="inset p-5 md:p-6"><h4 class="font-bold">Compare roles</h4><p class="text-[13px] text-mu mt-0.5">Toggle roles on or off. At least one stays selected.</p><div class="flex flex-wrap gap-2 mt-4">${res.map((r, i) => html`<button key=${r.id} aria-pressed=${sel.includes(r.id)} onClick=${() => setSel(s => s.includes(r.id) ? (s.length > 1 ? s.filter(x => x !== r.id) : s) : [...s, r.id])}
      class=${cx("flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl border transition-all", sel.includes(r.id) ? "border-vio bg-vio-l text-ink" : "border-bd bg-white text-mu hover:border-vio-m")}><span class="w-2.5 h-2.5 rounded-sm" style=${{ background: COLS[i % 4] }}/>${r.title}</button>`)}</div>
    ${ms.map(m => html`<div key=${m} class="mt-6"><div class="text-sm font-bold mb-2.5">${m}</div><div class="grid gap-2.5">${rs.map(r => { const v = m === "Overall" ? r.score : r.b[m]; return html`<div key=${r.id} class="grid grid-cols-[104px_1fr_42px] sm:grid-cols-[200px_1fr_46px] gap-3 items-center text-xs sm:text-sm"><span class="text-mu truncate">${r.title}</span><${Bar} v=${v} col=${COLS[res.indexOf(r) % 4]} h="h-2.5"/><span class="font-bold text-right tnum">${v}%</span></div>`; })}</div></div>`)}</div>
    <div class="inset p-5 md:p-6"><h4 class="font-bold">Skills missing across the selected roles</h4><div class="grid gap-2.5 mt-4">${Object.entries(fq).sort((a, b) => b[1] - a[1]).map(([s, n]) => html`<div key=${s} class="flex justify-between items-center text-sm"><${Tag} t=${s} k="am"/><span class="text-mu text-xs tnum">${n} of ${rs.length} role${rs.length > 1 ? "s" : ""}</span></div>`)}</div></div></div>`; };

const JobCard = ({ x, i, active, onPick }) => html`<button onClick=${onPick} aria-pressed=${active} class=${cx("surface lift text-left p-5 flex flex-col gap-4 w-full", active && "!border-vio shadow-[0_0_0_4px_rgba(108,75,255,.12),var(--sh-2)]")}>
  <div class="flex items-start justify-between gap-3"><div class="min-w-0"><div class="flex items-center gap-2 mb-1.5"><span class="text-xs font-bold text-vio bg-vio-l rounded-full px-2 py-0.5">#${i + 1}</span>${i === 0 && html`<span class="text-xs font-semibold text-ok bg-ok-l rounded-full px-2 py-0.5">Best fit</span>`}</div><h4 class="font-bold text-[17px] leading-snug">${x.title}</h4></div><${Ring} v=${x.score} s=${62} w=${6}/></div>
  <div><div class="text-xs font-semibold text-mu mb-1.5">Matched</div><div class="flex flex-wrap gap-1.5">${x.matched.slice(0, 4).map(s => html`<${Tag} key=${s} t=${s} k="ok"/>`)}${x.matched.length > 4 && html`<span class="tag">+${x.matched.length - 4}</span>`}</div></div>
  <div><div class="text-xs font-semibold text-mu mb-1.5">Missing</div><div class="flex flex-wrap gap-1.5">${x.missing.slice(0, 3).map(s => html`<${Tag} key=${s} t=${s} k="am"/>`)}${x.missing.length > 3 && html`<span class="tag">+${x.missing.length - 3}</span>`}</div></div>
  <span class="text-sm font-semibold text-vio flex items-center gap-1.5 mt-auto">${active ? "Viewing analysis" : "View analysis"}<${Ic} n="arrow" s=${15}/></span></button>`;

const Results = ({ a }) => { const { res, prof, r, act, setAct, tab, setTab, hist, openHist, done, tog, setView, download } = a; const detail = useRef();
  const top = res[0], avg = Math.round(res.reduce((s, x) => s + x.score, 0) / res.length), uniq = [...new Set(res.flatMap(x => x.missing))], dims = Object.keys(res[0].b), avgD = {}; dims.forEach(k => avgD[k] = Math.round(res.reduce((s, x) => s + x.b[k], 0) / res.length));
  const total = SEC.reduce((s, [k]) => s + prof[k].length, 0), idx = res.findIndex(x => x.id === r.id);
  const pick = id => { setAct(id); setTab("ov"); setTimeout(() => detail.current && detail.current.scrollIntoView({ behavior: "smooth", block: "start" }), 60); };
  return html`<main class="max-w-6xl mx-auto px-5 pb-16 fade">
    <div class="flex flex-wrap justify-between items-end gap-4 pt-9 pb-5"><div class="min-w-0"><div class="text-[13px] font-semibold text-vio">Analysis results</div><h1 class="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">${prof.name}</h1><p class="text-sm text-mu mt-1 max-w-2xl">${prof.summary}</p></div>
      <div class="flex flex-wrap gap-2"><${Btn} onClick=${() => setView("work")}><${Ic} n="back"/>Modify resume or roles<//><${Btn} v="p" onClick=${download}><${Ic} n="download"/>Download report<//></div></div>
    <div class="flex items-start gap-2.5 text-[13px] text-am bg-am-l border border-amber-200 rounded-xl px-4 py-2.5 mb-6"><${Ic} n="info" s=${16} c="mt-0.5"/><span>Demo data: scores and explanations are mock values for this frontend prototype.</span></div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4"><${Kpi} grad ic="trend" l="Best match" v=${top.score + "%"} sub=${top.title}/><${Kpi} ic="target" l="Average alignment" v=${avg + "%"} sub=${"Across " + res.length + " role" + (res.length > 1 ? "s" : "")}/><${Kpi} ic="layers" l="Resume items" v=${total} sub=${prof.skills.length + " skills in " + SEC.length + " sections"}/><${Kpi} ic="alert" l="Skills to build" v=${uniq.length} sub="Unique gaps across all roles"/></div>

    <div class="grid lg:grid-cols-5 gap-5 mt-5">
      <${Panel} c="lg:col-span-3" t="Job match scores" sub="Alignment for each role, highest first.">
        <div class="grid gap-4">${res.map((x, i) => html`<div key=${x.id} class="grid grid-cols-[1fr_46px] items-center gap-4"><div><div class="flex justify-between text-sm mb-1.5"><span class="font-semibold truncate pr-3">${x.title}</span></div><${Bar} v=${x.score} col=${COLS[i % 4]} h="h-3"/></div><span class="text-right font-extrabold tnum">${x.score}%</span></div>`)}</div><//>
      <${Panel} c="lg:col-span-2" t="Alignment profile" sub="Average across all ranked roles."><${Radar} d=${avgD}/><//></div>

    <div class="grid lg:grid-cols-3 gap-5 mt-5">
      <${Panel} t="Skills analysis" sub="Matched skills against skills to build.">
        <div class="grid gap-4">${res.map(x => { const m = x.matched.length, g = x.missing.length, t = m + g; return html`<div key=${x.id}><div class="flex justify-between text-[13px] mb-1.5"><span class="font-semibold truncate pr-2">${x.title}</span><span class="text-mu tnum shrink-0">${m} / ${g}</span></div><div class="flex h-2.5 rounded-full overflow-hidden gap-0.5"><span class="fill-brand" style=${{ width: m / t * 100 + "%" }}/><span class="bg-amber-300" style=${{ width: g / t * 100 + "%" }}/></div></div>`; })}</div>
        <div class="flex gap-4 text-xs text-mu mt-5"><span class="flex items-center gap-1.5"><i class="w-2.5 h-2.5 rounded-sm fill-brand"/>Matched</span><span class="flex items-center gap-1.5"><i class="w-2.5 h-2.5 rounded-sm bg-amber-300"/>Missing</span></div><//>
      <${Panel} t="Resume summary" sub="Items extracted from your resume.">
        <div class="flex items-end gap-2.5 h-[150px]">${SEC.map(([k, l]) => { const n = prof[k].length, mx = Math.max(1, ...SEC.map(([q]) => prof[q].length)); return html`<div key=${k} class="flex-1 flex flex-col items-center justify-end h-full gap-1.5" title=${l + ": " + n}><span class="text-xs font-bold tnum">${n}</span><div class="w-full rounded-t-lg fill-brand min-h-[4px] transition-[height] duration-700" style=${{ height: n / mx * 100 + "px", opacity: n ? 1 : .25 }}/></div>`; })}</div>
        <div class="flex gap-2.5 mt-2">${SEC.map(([k, l]) => html`<span key=${k} class="flex-1 text-center text-[10px] text-mu leading-tight truncate" title=${l}>${SH[k]}</span>`)}</div><//>
      <${Panel} t="Recent analyses" sub="From this session.">
        <ul class="grid gap-2.5">${hist.slice(0, 4).map(h => html`<li key=${h.id}><button onClick=${() => openHist(h)} class=${cx("w-full text-left inset px-3.5 py-3 flex items-center gap-3 hover:border-vio-m transition-colors", h.res === res && "!border-vio bg-vio-l")}><span class="w-9 h-9 rounded-lg bg-lav-100 text-vio grid place-items-center shrink-0"><${Ic} n="clock" s=${16}/></span><span class="min-w-0 flex-1"><span class="block text-sm font-semibold truncate">${h.top}</span><span class="block text-xs text-mu truncate">${h.src + " · " + h.n + " role" + (h.n > 1 ? "s" : "") + " · " + h.time}</span></span><span class="font-bold tnum text-sm">${h.score}%</span></button></li>`)}</ul><//></div>

    <div class="mt-12 mb-5"><h2 class="text-xl md:text-2xl font-extrabold tracking-tight">Job matches</h2><p class="text-sm text-mu mt-1">Select a role to open its full analysis, skill gaps and roadmap.</p></div>
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">${res.map((x, i) => html`<${JobCard} key=${x.id} x=${x} i=${i} active=${x.id === r.id} onPick=${() => pick(x.id)}/>`)}</div>

    <section ref=${detail} class="surface overflow-hidden mt-8 scroll-mt-24"><div class="navy-bg p-6 md:p-8 flex items-center gap-5 text-white overflow-hidden"><${Ring} v=${r.score} s=${78} w=${8} dark/><div class="relative min-w-0"><div class="text-xs text-white/60 font-medium">Rank ${idx + 1} of ${res.length}</div><h2 class="text-xl md:text-2xl font-extrabold tracking-tight">${r.title}</h2><p class="text-sm text-white/60 mt-0.5">Overall alignment score</p></div></div>
      <div class="flex gap-1 overflow-x-auto hide-sb border-b border-bd bg-white px-3 md:px-5" role="tablist">${[["ov", "Overview", "bars"], ["gap", "Skill gaps", "alert"], ["rm", "Roadmap", "route"], ["cmp", "Compare roles", "cols"]].map(([k, l, ic]) => html`<button key=${k} role="tab" aria-selected=${tab === k} onClick=${() => setTab(k)}
        class=${cx("flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors", tab === k ? "border-vio text-ink" : "border-transparent text-mu hover:text-ink")}><${Ic} n=${ic} s=${16} c=${tab === k ? "text-vio" : ""}/>${l}</button>`)}</div>
      <div class="p-4 md:p-6 bg-lav-50 min-w-0">${tab === "ov" && html`<${Overview} key=${r.id} r=${r}/>`}${tab === "gap" && html`<${Gaps} key=${r.id} r=${r}/>`}${tab === "rm" && html`<${Road} key=${r.id} r=${r} done=${done} tog=${tog}/>`}${tab === "cmp" && html`<${Compare} res=${res}/>`}</div></section></main>`; };

/* ============ REPORT & DOWNLOAD ============ */
function reportHtml(res, prof) { const e = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>AlgoMind analysis report</title><style>body{font:14px/1.6 system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;color:#0A0E2A}h1{font-size:26px;letter-spacing:-.02em}h2{margin-top:30px;border-bottom:2px solid #E0DBFF;padding-bottom:4px;color:#3B26B8}table{border-collapse:collapse;width:100%}td,th{border:1px solid #E3E1F5;padding:6px 10px;text-align:left}th{background:#F6F5FF}</style></head><body><h1>AlgoMind: resume-to-role analysis</h1><p>Candidate: ${e(prof.name)}<br>Generated: ${new Date().toLocaleDateString()}<br>Note: values in this report are demonstration data.</p>
<h2>Role ranking</h2><table><tr><th>Rank</th><th>Role</th><th>Alignment</th></tr>${res.map((r, i) => `<tr><td>${i + 1}</td><td>${e(r.title)}</td><td>${r.score}%</td></tr>`).join("")}</table>
${res.map(r => `<h2>${e(r.title)} (${r.score}%)</h2><p>${e(r.why)}</p><p><b>Matched:</b> ${e(r.matched.join(", "))}</p><p><b>Missing:</b> ${e(r.missing.join(", "))}</p><p><b>Recommendations:</b></p><ul>${r.recs.map(x => `<li>${e(x)}</li>`).join("")}</ul><p><b>Roadmap:</b></p><ul>${r.road.map(p => `<li>${e(p[0])}: ${e(p[1])}</li>`).join("")}</ul>`).join("")}</body></html>`; }
async function saveFile(name, data) { try { if (window.claude) { const d = await claude.use("downloads"); await d.save({ filename: name, data }); return true; } } catch (e) { if (e && e.code === "declined") return false; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], { type: "text/html" })); a.download = name; a.click(); return true; }

/* ============ APP ============ */
const App = () => {
  const [user, setUser] = useState(null), [gate, setGate] = useState("landing"), [view, setView] = useState("work"), [prof, setProf] = useState(null), [picked, setPicked] = useState(["ml", "da", "ds", "sd"]),
    [cust, setCust] = useState([]), [res, setRes] = useState(null), [act, setAct] = useState(null), [tab, setTab] = useState("ov"), [step, setStep] = useState(0),
    [msg, setMsg] = useState(""), [menu, setMenu] = useState(false), [drawer, setDrawer] = useState(false), [jd, setJd] = useState(""), [err, setErr] = useState(""), [over, setOver] = useState(false),
    [file, setFile] = useState(null), [hist, setHist] = useState([]), [done, setDone] = useState({});
  const fileRef = useRef(), tok = useRef(0);
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(""), 2600); return () => clearTimeout(t); }, [msg]);
  const rank = (ids, c) => [...ROLES.filter(r => ids.includes(r.id)), ...c].sort((a, b) => b.score - a.score);
  const show = (r, src, push = true) => { setRes(r); setAct(r[0].id); setTab("ov"); setView("dash"); scrollTo(0, 0);
    if (push) setHist(h => [{ id: Date.now() + Math.random(), res: r, top: r[0].title, score: r[0].score, n: r.length, src: src || "Sample resume", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, ...h].slice(0, 8)); };
  const openHist = h => { setRes(h.res); setAct(h.res[0].id); setTab("ov"); scrollTo(0, 0); };
  const setSec = (k, fn) => setProf(p => ({ ...p, [k]: fn(p[k]) }));
  const removeFile = () => { tok.current++; setFile(null); setProf(null); setErr(""); };
  const useSampleResume = () => { tok.current++; setFile(null); setErr(""); setProf(structuredClone(SAMPLE)); };
  const onFile = async f => { setErr(""); if (!f) return;
    if (!/\.(pdf|docx)$/i.test(f.name)) return setErr("Unsupported file type. Upload a PDF or DOCX resume.");
    if (f.size === 0) return setErr("This file is empty. Choose a resume that has content.");
    if (f.size > 10 * 1024 * 1024) return setErr("This file is larger than 10 MB. Upload a smaller one.");
    const my = ++tok.current; setProf(null); setFile({ name: f.name, size: f.size, progress: 0, status: "reading" });
    try { await new Promise((ok, no) => { const rd = new FileReader(); rd.onprogress = e => { if (e.lengthComputable && my === tok.current) setFile(x => x && { ...x, progress: Math.min(99, Math.round(e.loaded / e.total * 100)) }); }; rd.onload = ok; rd.onerror = () => no(rd.error); rd.readAsArrayBuffer(f); });
      for (const p of [35, 70, 100]) { if (my !== tok.current) return; setFile(x => x && { ...x, progress: p }); await sleep(240); } }
    catch (e) { if (my === tok.current) { setFile(null); setErr("We could not read this file. Try saving it again and re-uploading."); } return; }
    if (my !== tok.current) return;
    setFile(x => x && { ...x, status: "ready", progress: 100 }); setProf({ ...structuredClone(SAMPLE), src: f.name }); setMsg("Sample extraction loaded for " + f.name); };
  const sample = () => { tok.current++; setFile(null); setErr(""); setProf(structuredClone(SAMPLE)); setPicked(ROLES.map(r => r.id)); setCust([]); show(rank(ROLES.map(r => r.id), []), "Sample resume"); };
  const run = async () => { const src = file ? file.name : "Sample resume"; setView("run"); scrollTo(0, 0); for (let i = 0; i < STEPS.length; i++) { setStep(i); await sleep(520); } setStep(STEPS.length); await sleep(350); show(rank(picked, cust), src); };
  const addJd = () => { const t = jd.trim(); if (t.length < 30) return setMsg("Paste a fuller job description (at least a few lines)."); const title = t.split("\n")[0].slice(0, 36);
    setCust(c => [...c, customRole(title, c.length)]); setJd(""); setDrawer(false); };
  const download = async () => { if (await saveFile("algomind-analysis-report.html", reportHtml(res, prof))) setMsg("Report saved."); };
  const toggle = id => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const tog = k => setDone(d => ({ ...d, [k]: !d[k] }));
  const total = picked.length + cust.length, r = res && (res.find(x => x.id === act) || res[0]);
  const login = u => { setUser(u); setView("work"); scrollTo(0, 0); };
  const logout = () => { setMenu(false); setUser(null); setGate("landing"); setView("work"); setRes(null); setProf(null); setFile(null); setHist([]); setDone({}); setErr(""); scrollTo(0, 0); };
  if (!user) return html`<${React.Fragment}><${Defs}/>${gate === "landing" ? html`<${Landing} onStart=${m => { setGate(m); scrollTo(0, 0); }} onDemo=${() => login({ name: "Aarav Mehta", email: "demo@algomind.app" })}/>` : html`<${Auth} key=${gate} mode=${gate} onIn=${login} onBack=${() => { setGate("landing"); scrollTo(0, 0); }}/>`}<//>`;
  const ini = user.name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "U";
  const A = { prof, file, err, onFile, removeFile, fileRef, picked, toggle, cust, setCust, drawer, setDrawer, jd, setJd, addJd, run, total, setSec, over, setOver, useSampleResume, res, r, act, setAct, tab, setTab, hist, openHist, done, tog, setView, download };
  return html`<${React.Fragment}><${Defs}/><div class="app-bg min-h-screen font-sans text-ink antialiased flex flex-col">
  <header class="sticky top-[env(safe-area-inset-top,0px)] z-40 glass !rounded-none !border-x-0 !border-t-0 border-b border-bd/80"><div class="max-w-6xl mx-auto px-5 min-h-16 flex flex-wrap items-center gap-x-4 gap-y-1 py-2.5">
    <button onClick=${() => setView(res && view === "dash" ? "dash" : "work")} aria-label="AlgoMind home"><${Brand}/></button><span class="hidden lg:inline text-[11px] font-semibold border border-vio-m bg-vio-l text-vio-d px-2.5 py-1 rounded-full">Semantic Engine v1.0</span>
    <nav class="order-last w-full md:order-none md:w-auto md:ml-4 flex gap-1 text-sm font-semibold">${[["work", "Workspace", "grid"], ["dash", "Results", "bars"]].map(([k, l, ic]) => html`<button key=${k} disabled=${k === "dash" && !res} onClick=${() => setView(k)} class=${cx("flex items-center gap-2 px-3.5 py-2 rounded-xl transition-colors disabled:opacity-40", (view === k || (view === "run" && k === "work")) ? "bg-vio-l text-vio-d" : "text-mu hover:text-ink hover:bg-lav-100")}><${Ic} n=${ic} s=${16}/>${l}</button>`)}</nav>
    <div class="ml-auto flex items-center gap-2.5"><${Btn} c="btn-sm" onClick=${sample}><${Ic} n="zap" s=${15} c="text-vio"/><span class="hidden sm:inline">Load sample analysis</span><span class="sm:hidden">Sample</span><//>
      <div class="relative"><button onClick=${() => setMenu(!menu)} aria-label="Account menu" aria-expanded=${menu} class="w-10 h-10 rounded-full fill-brand text-white text-sm font-bold shadow-glow ring-2 ring-white">${ini}</button>
        ${menu && html`<div class="fixed inset-0 z-40" onClick=${() => setMenu(false)}/><div class="absolute right-0 mt-2.5 w-64 z-50 surface p-1.5 text-sm fade !shadow-lift"><div class="px-3 py-2.5 border-b border-bd mb-1"><b>${user.name}</b><div class="text-xs text-mu truncate">${user.email}</div></div>
          ${["My Profile", "My Resumes", "Saved Roles", "Analysis History", "Settings"].map(t => html`<button key=${t} onClick=${() => { setMenu(false); setMsg(t + " is a placeholder in this prototype."); }} class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-lav-50">${t}</button>`)}
          <button onClick=${logout} class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-rose-50 flex items-center gap-2 text-rose-700 border-t border-bd mt-1"><${Ic} n="out"/>Log out</button></div>`}</div></div></div></header>

  <div class="flex-1">${view === "work" && html`<${Workspace} a=${A}/>`}${view === "run" && html`<${Running} step=${step}/>`}${view === "dash" && res && html`<${Results} a=${A}/>`}</div>
  <footer class="border-t border-bd/70 mt-6"><div class="max-w-6xl mx-auto px-5 py-6 text-xs text-mu flex flex-wrap justify-between gap-2"><span>AlgoMind, resume-to-role semantic alignment</span><span>Frontend prototype. No data is sent anywhere.</span></div></footer>
  <div role="status" aria-live="polite" class=${cx("fixed left-1/2 -translate-x-1/2 bottom-[calc(24px+env(safe-area-inset-bottom,0px))] z-50 glass-dark text-sm font-medium px-5 py-3 rounded-2xl transition-all duration-300 max-w-[90vw]", msg ? "opacity-100" : "opacity-0 translate-y-2 pointer-events-none")}>${msg}</div></div><//>`;
};
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
