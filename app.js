const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ============ ICONS & ATOMS ============ */
const P = { upload: "M12 15V3m0 0L7 8m5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4", file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6", check: "M20 6 9 17l-5-5", x: "M18 6 6 18M6 6l12 12",
 alert: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01", back: "m12 19-7-7 7-7M19 12H5", zap: "M13 2 3 14h9l-1 8 10-12h-9z", download: "M12 3v12m0 0 5-5m-5 5-5-5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4",
 route: "M6 19h8.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H18", bars: "M3 3v18h18M8 17v-5M13 17V8M18 17v-9", cols: "M12 3v18M4 6h5v12H4zM15 9h5v9h-5z", plus: "M5 12h14M12 5v14", out: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" };
const Ic = ({ n, s = 16, c = "" }) => html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class=${"shrink-0 " + c} aria-hidden="true"><path d=${P[n]}/></svg>`;
const Card = ({ c = "", children }) => html`<div class=${"bg-white border border-bd rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] " + c}>${children}</div>`;
const Btn = ({ v, c = "", ...p }) => html`<button ...${p} class=${"inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none " + (v === "p" ? "bg-em text-white hover:bg-em-d" : "border border-bd bg-white hover:bg-slate-50") + " " + c}/>`;
const TK = { n: "bg-slate-50 border-bd text-ink", ok: "bg-em-l border-emerald-200 text-emerald-800", am: "bg-am-l border-amber-200 text-amber-800" };
const Tag = ({ t, k = "n", x }) => html`<span class=${"inline-flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded border " + TK[k]}>${k === "ok" && html`<${Ic} n="check" s=${12}/>`}${t}${x && html`<button onClick=${x} aria-label=${"Remove " + t} class="hover:text-red-600"><${Ic} n="x" s=${12}/></button>`}</span>`;
const Bar = ({ v, c = "bg-em", h = "h-1.5" }) => { const [w, setW] = useState(0); useEffect(() => { const t = setTimeout(() => setW(v), 30); return () => clearTimeout(t); }, [v]);
  return html`<div class=${"bg-slate-200 rounded-sm overflow-hidden " + h}><div class=${"h-full transition-[width] duration-500 " + c} style=${{ width: w + "%" }}/></div>`; };
const Brand = () => html`<div class="flex items-center gap-2.5 font-extrabold text-lg tracking-tight"><span class="w-6 h-6 rounded bg-em grid place-items-center text-white"><${Ic} n="zap" s=${14}/></span>AlgoMind</div>`;
const Radar = ({ d }) => { const k = Object.keys(d), p = (v, i) => { const a = (i * 90 - 90) * Math.PI / 180, r = v * .6; return [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; };
  return html`<svg viewBox="0 0 200 200" class="w-full max-w-[210px] mx-auto" role="img" aria-label="Score breakdown radar">${[100, 66, 33].map(r => html`<polygon key=${r} points=${k.map((_, i) => p(r, i).join(",")).join(" ")} fill="none" stroke="#E2E8F0"/>`)}
  <polygon points=${k.map((x, i) => p(d[x], i).join(",")).join(" ")} fill="rgba(5,150,105,.14)" stroke="#059669" stroke-width="1.5"/>
  ${k.map((x, i) => { const [a, b] = p(120, i); return html`<text key=${x} x=${a} y=${b} font-size="8.5" text-anchor="middle" dominant-baseline="middle" fill="#475569">${x.split(" ")[0]}</text>`; })}</svg>`; };
const pri = d => d >= 50 ? "High priority" : d >= 30 ? "Medium priority" : "Low priority";

/* ============ ROLE PANELS ============ */
const Overview = ({ r }) => html`<div class="grid gap-5 fade">
  <${Card} c="p-6"><div class="flex justify-between gap-4"><div><h2 class="text-2xl font-bold tracking-tight">${r.title}</h2><p class="text-sm text-mu">Overall alignment score</p></div><div class="font-mono text-4xl font-semibold text-em">${r.score}%</div></div>
    <div class="grid sm:grid-cols-[1fr_200px] gap-6 mt-6 pt-5 border-t border-bd items-center"><div class="grid gap-4">${Object.entries(r.b).map(([k, v]) => html`<div key=${k}><div class="flex justify-between text-sm text-mu mb-1.5"><span>${k}</span><b class="font-mono font-medium text-ink">${v}%</b></div><${Bar} v=${v}/></div>`)}</div><${Radar} d=${r.b}/></div><//>
  <${Card} c="p-6"><h3 class="font-bold">Why this role fits you</h3><p class="text-mu mt-2 leading-relaxed">${r.why}</p><//>
  <div class="grid md:grid-cols-2 gap-5">
    <${Card} c="p-6"><h3 class="font-bold text-em">Matched skills and projects</h3><div class="flex flex-wrap gap-1.5 mt-3">${r.matched.map(s => html`<${Tag} key=${s} t=${s} k="ok"/>`)}</div>
      ${r.proj.map(([t, d]) => html`<div key=${t} class="mt-4 text-sm"><b>${t}</b><p class="text-mu">${d}</p></div>`)}<//>
    <${Card} c="p-6"><h3 class="font-bold text-am">Missing and weakly matched</h3><div class="flex flex-wrap gap-1.5 mt-3">${r.missing.map(s => html`<${Tag} key=${s} t=${s} k="am"/>`)}</div>
      ${r.weak.map(([t, d]) => html`<div key=${t} class="mt-4 text-sm flex gap-2"><${Ic} n="alert" c="text-am mt-0.5"/><div><b>${t}</b> <span class="text-xs text-mu">weak match</span><p class="text-mu">${d}</p></div></div>`)}<//></div>
  <${Card} c="p-6"><h3 class="font-bold">Recommended improvements</h3><ol class="mt-3 grid gap-3">${r.recs.map((t, i) => html`<li key=${i} class="flex gap-3 text-sm"><span class="font-mono text-em">${i + 1}</span><span class="text-mu">${t}</span></li>`)}</ol><//></div>`;
const Gaps = ({ r }) => html`<${Card} c="p-6 fade"><h3 class="font-bold">Skill gap analysis: ${r.title}</h3><p class="text-sm text-mu mt-1">The filled bar is your current level. The amber marker is what the role expects.</p>
  ${r.gaps.map(([s, c, q]) => html`<div key=${s} class="mt-5"><div class="flex justify-between text-sm"><span class="font-mono font-medium">${s}</span><span class="font-mono text-mu">${c}% of ${q}%</span></div>
    <div class="relative mt-2"><${Bar} v=${c} c="bg-slate-500" h="h-2.5"/><span class="absolute -top-1 w-0.5 h-[18px] bg-am" style=${{ left: q + "%" }}/></div><p class="text-xs text-am mt-1.5">${pri(q - c)}</p></div>`)}<//>`;
const Road = ({ r }) => html`<div class="fade"><h3 class="font-bold mb-1">Career improvement roadmap: ${r.title}</h3><p class="text-sm text-mu mb-4">A phased plan built from your skill gaps.</p>
  <div class="grid gap-4">${r.road.map(([w, t, it], i) => html`<${Card} key=${t} c="p-5 flex gap-4"><span class="font-mono text-sm w-8 h-8 border border-em text-em rounded grid place-items-center shrink-0">${i + 1}</span>
    <div><span class="text-xs font-mono text-mu">${w}</span><h4 class="font-bold">${t}</h4><ul class="mt-2 grid gap-1 text-sm text-mu list-disc pl-4">${it.map(x => html`<li key=${x}>${x}</li>`)}</ul></div><//>`)}</div></div>`;
const DOT = ["bg-emerald-600", "bg-emerald-400", "bg-slate-500", "bg-slate-300"];
const Compare = ({ res }) => { const [sel, setSel] = useState(res.map(r => r.id));
  if (res.length < 2) return html`<${Card} c="p-6 text-mu">Select at least two roles in the workspace to compare them.<//>`;
  const rs = res.filter(r => sel.includes(r.id)), ms = ["Overall", ...Object.keys(res[0].b)], fq = {};
  rs.forEach(r => r.missing.forEach(s => fq[s] = (fq[s] || 0) + 1));
  return html`<div class="grid gap-5 fade"><${Card} c="p-6"><h3 class="font-bold">Compare roles</h3><div class="flex flex-wrap gap-2 mt-3">${res.map((r, i) => html`<button key=${r.id} aria-pressed=${sel.includes(r.id)} onClick=${() => setSel(s => s.includes(r.id) ? (s.length > 1 ? s.filter(x => x !== r.id) : s) : [...s, r.id])}
      class=${"flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border transition-colors " + (sel.includes(r.id) ? "border-em bg-em-l" : "border-bd bg-white text-mu")}><span class=${"w-2.5 h-2.5 rounded-sm " + DOT[i % 4]}/>${r.title}</button>`)}</div>
    ${ms.map(m => html`<div key=${m} class="mt-6"><div class="text-sm font-semibold mb-2">${m}</div><div class="grid gap-2">${rs.map(r => { const v = m === "Overall" ? r.score : r.b[m]; return html`<div key=${r.id} class="grid grid-cols-[110px_1fr_40px] sm:grid-cols-[190px_1fr_44px] gap-3 items-center text-xs sm:text-sm"><span class="text-mu truncate">${r.title}</span><${Bar} v=${v} c=${DOT[res.indexOf(r) % 4]} h="h-2.5"/><span class="font-mono text-right">${v}%</span></div>`; })}</div></div>`)}<//>
    <${Card} c="p-6"><h3 class="font-bold">Skills missing across the selected roles</h3><div class="grid gap-2 mt-3">${Object.entries(fq).sort((a, b) => b[1] - a[1]).map(([s, n]) => html`<div key=${s} class="flex justify-between items-center text-sm"><${Tag} t=${s} k="am"/><span class="text-mu font-mono text-xs">${n} of ${rs.length} roles</span></div>`)}</div><//></div>`; };

/* ============ SCREENS ============ */
const Auth = ({ onIn }) => { const [m, setM] = useState("in"), [e, setE] = useState("");
  const go = ev => { ev && ev.preventDefault(); onIn({ name: "Aarav Mehta", email: e || "demo@algomind.app" }); };
  const inp = "w-full border border-bd rounded-md px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-em";
  return html`<div class="min-h-screen grid lg:grid-cols-2 fade">
    <div class="hidden lg:flex flex-col justify-center px-16 xl:px-24"><${Brand}/><h1 class="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] mt-10">See how closely your resume matches <span class="text-em">target industry roles.</span></h1>
      <p class="text-mu mt-5 max-w-md">Semantic matching ranks several roles at once, explains each score and shows the skills to build next.</p>
      <ul class="mt-8 grid gap-3 text-sm text-mu">${["Multi-role ranking with alignment scores", "Explainable results, not just a number", "Skill gaps and an improvement roadmap"].map(t => html`<li key=${t} class="flex gap-2.5"><${Ic} n="check" c="text-em mt-0.5"/>${t}</li>`)}</ul></div>
    <div class="flex items-center justify-center p-5"><${Card} c="w-full max-w-md p-8"><div class="lg:hidden mb-6"><${Brand}/></div>
      <h2 class="text-xl font-bold">${m === "in" ? "Sign in to AlgoMind" : "Create your account"}</h2><p class="text-sm text-mu mt-1">Access your role rankings, resume analytics and skill-gap roadmaps.</p>
      <div class="grid grid-cols-2 mt-6 border border-bd rounded-md p-1 text-sm font-semibold">${[["in", "Sign in"], ["up", "Create account"]].map(([k, l]) => html`<button key=${k} onClick=${() => setM(k)} class=${"py-1.5 rounded transition-colors " + (m === k ? "bg-ink text-white" : "text-mu")}>${l}</button>`)}</div>
      <div class="grid grid-cols-2 gap-3 mt-5"><${Btn} onClick=${() => go()}>Google<//><${Btn} onClick=${() => go()}>GitHub<//></div>
      <div class="flex items-center gap-3 my-5 text-xs text-mu"><span class="flex-1 h-px bg-bd"/>or continue with email<span class="flex-1 h-px bg-bd"/></div>
      <form onSubmit=${go} class="grid gap-3">${m === "up" && html`<input class=${inp} placeholder="Full name" aria-label="Full name"/>`}<input class=${inp} type="email" placeholder="Email address" aria-label="Email address" value=${e} onChange=${ev => setE(ev.target.value)}/><input class=${inp} type="password" placeholder="Password" aria-label="Password"/>
        <${Btn} v="p" type="submit" c="w-full">${m === "in" ? "Sign in to dashboard" : "Create account"}<//></form>
      <button onClick=${() => go()} class="mt-4 w-full text-sm font-semibold text-em hover:underline">Explore with demo account</button>
      <p class="text-xs text-mu mt-4 text-center">Frontend prototype. No data is sent anywhere.</p><//></div></div>`; };

const Section = ({ k, l, items, set }) => { const [v, setV] = useState("");
  return html`<div class="mt-5"><div class="text-sm font-semibold">${l}</div><div class="flex flex-wrap gap-1.5 mt-2">${items.map((t, i) => html`<${Tag} key=${t + i} t=${t} x=${() => set(k, a => a.filter((_, j) => j !== i))}/>`)}</div>
    <input value=${v} onChange=${e => setV(e.target.value)} onKeyDown=${e => { if (e.key === "Enter" && v.trim()) { set(k, a => [...a, v.trim()]); setV(""); } }} placeholder=${"Add to " + l.toLowerCase() + ", press Enter"} aria-label=${"Add to " + l} class="mt-2 w-full max-w-xs border border-bd rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:border-em"/></div>`; };

function reportHtml(res, prof) { const e = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>AlgoMind analysis report</title><style>body{font:14px/1.6 system-ui,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;color:#0F172A}h1{font-size:24px}h2{margin-top:30px;border-bottom:1px solid #E2E8F0;padding-bottom:4px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #E2E8F0;padding:6px 10px;text-align:left}</style></head><body><h1>AlgoMind: resume-to-role analysis</h1><p>Candidate: ${e(prof.name)}<br>Generated: ${new Date().toLocaleDateString()}<br>Note: values in this report are demonstration data.</p>
<h2>Role ranking</h2><table><tr><th>Rank</th><th>Role</th><th>Alignment</th></tr>${res.map((r, i) => `<tr><td>${i + 1}</td><td>${e(r.title)}</td><td>${r.score}%</td></tr>`).join("")}</table>
${res.map(r => `<h2>${e(r.title)} (${r.score}%)</h2><p>${e(r.why)}</p><p><b>Matched:</b> ${e(r.matched.join(", "))}</p><p><b>Missing:</b> ${e(r.missing.join(", "))}</p><p><b>Recommendations:</b></p><ul>${r.recs.map(x => `<li>${e(x)}</li>`).join("")}</ul><p><b>Roadmap:</b></p><ul>${r.road.map(p => `<li>${e(p[0])}: ${e(p[1])}</li>`).join("")}</ul>`).join("")}</body></html>`; }
async function saveFile(name, data) { try { if (window.claude) { const d = await claude.use("downloads"); await d.save({ filename: name, data }); return true; } } catch (e) { if (e && e.code === "declined") return false; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([data], { type: "text/html" })); a.download = name; a.click(); return true; }

/* ============ APP ============ */
const App = () => {
  const [user, setUser] = useState(null), [view, setView] = useState("work"), [prof, setProf] = useState(null), [picked, setPicked] = useState(["ml", "da", "ds", "sd"]),
    [cust, setCust] = useState([]), [res, setRes] = useState(null), [act, setAct] = useState(null), [tab, setTab] = useState("ov"), [step, setStep] = useState(0),
    [msg, setMsg] = useState(""), [menu, setMenu] = useState(false), [drawer, setDrawer] = useState(false), [jd, setJd] = useState(""), [err, setErr] = useState(""), [over, setOver] = useState(false);
  const fileRef = useRef();
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(""), 2600); return () => clearTimeout(t); }, [msg]);
  const rank = (ids, c) => [...ROLES.filter(r => ids.includes(r.id)), ...c].sort((a, b) => b.score - a.score);
  const show = r => { setRes(r); setAct(r[0].id); setTab("ov"); setView("dash"); scrollTo(0, 0); };
  const setSec = (k, fn) => setProf(p => ({ ...p, [k]: fn(p[k]) }));
  const onFile = f => { setErr(""); if (!f) return;
    if (!/\.(pdf|docx)$/i.test(f.name)) return setErr("Unsupported file. Upload a PDF or DOCX resume.");
    if (f.size > 10 * 1024 * 1024) return setErr("This file is larger than 10 MB. Upload a smaller one.");
    setProf({ ...structuredClone(SAMPLE), src: f.name }); setMsg("Sample extraction loaded for " + f.name); };
  const sample = () => { setProf(structuredClone(SAMPLE)); setPicked(ROLES.map(r => r.id)); setCust([]); show(rank(ROLES.map(r => r.id), [])); };
  const run = async () => { setView("run"); scrollTo(0, 0); for (let i = 0; i < STEPS.length; i++) { setStep(i); await sleep(520); } setStep(STEPS.length); await sleep(350); show(rank(picked, cust)); };
  const addJd = () => { const t = jd.trim(); if (t.length < 30) return setMsg("Paste a fuller job description (at least a few lines)."); const title = t.split("\n")[0].slice(0, 36);
    setCust(c => [...c, customRole(title, c.length)]); setJd(""); setDrawer(false); };
  const download = async () => { if (await saveFile("algomind-analysis-report.html", reportHtml(res, prof))) setMsg("Report saved."); };
  const toggle = id => setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const total = picked.length + cust.length, r = res && (res.find(x => x.id === act) || res[0]);
  if (!user) return html`<div class="font-sans text-ink"><${Auth} onIn=${setUser}/></div>`;
  const ini = user.name.split(" ").map(w => w[0]).join("");
  return html`<div class="min-h-screen font-sans text-ink antialiased">
  <header class="sticky top-[env(safe-area-inset-top,0px)] z-40 bg-white border-b border-bd"><div class="max-w-6xl mx-auto px-5 min-h-14 flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
    <${Brand}/><span class="hidden sm:inline font-mono text-[11px] border border-bd bg-bg text-mu px-2 py-0.5 rounded">Semantic Engine v1.0</span>
    <nav class="order-last w-full md:order-none md:w-auto md:ml-4 flex gap-1 text-sm font-medium">${[["work", "Workspace"], ["dash", "Results"]].map(([k, l]) => html`<button key=${k} disabled=${k === "dash" && !res} onClick=${() => setView(k)} class=${"px-3 py-1.5 rounded-md transition-colors disabled:opacity-40 " + ((view === k || (view === "run" && k === "work")) ? "bg-slate-100 text-ink" : "text-mu hover:text-ink")}>${l}</button>`)}</nav>
    <div class="ml-auto flex items-center gap-2"><${Btn} onClick=${sample}><${Ic} n="zap"/><span class="hidden sm:inline">Load Sample Analysis</span><span class="sm:hidden">Sample</span><//>
      <div class="relative"><button onClick=${() => setMenu(!menu)} aria-label="Account menu" aria-expanded=${menu} class="w-9 h-9 rounded-full bg-em-l border border-emerald-200 text-em text-sm font-bold">${ini}</button>
        ${menu && html`<div class="fixed inset-0 z-40" onClick=${() => setMenu(false)}/><div class="absolute right-0 mt-2 w-60 z-50 bg-white border border-bd rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-1.5 text-sm fade"><div class="px-3 py-2 border-b border-bd mb-1"><b>${user.name}</b><div class="text-xs text-mu truncate">${user.email}</div></div>
          ${["My Profile", "My Resumes", "Saved Roles", "Analysis History", "Settings"].map(t => html`<button key=${t} onClick=${() => { setMenu(false); setMsg(t + " is a placeholder in this prototype."); }} class="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50">${t}</button>`)}
          <button onClick=${() => { setMenu(false); setUser(null); setView("work"); setRes(null); setProf(null); }} class="w-full text-left px-3 py-2 rounded-md hover:bg-slate-50 flex items-center gap-2 text-red-700 border-t border-bd mt-1"><${Ic} n="out"/>Log out</button></div>`}</div></div></div></header>

  ${view === "work" && html`<main class="max-w-6xl mx-auto px-5 pb-14 fade"><div class="py-10 md:py-14"><h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.1] max-w-3xl">See which roles your resume truly speaks to.</h1>
    <p class="text-mu mt-4 max-w-2xl">AlgoMind compares the meaning of your projects and skills with each job description, ranks every role and explains each score.</p></div>
    <div class="grid lg:grid-cols-2 gap-5 items-start">
      <${Card} c="p-6"><h2 class="font-bold text-lg"><span class="font-mono text-em mr-2">1</span>Candidate profile</h2><p class="text-sm text-mu mb-4">Upload a resume and review what was extracted.</p>
        <div role="button" tabindex="0" onClick=${() => fileRef.current.click()} onKeyDown=${e => (e.key === "Enter" || e.key === " ") && fileRef.current.click()} onDragOver=${e => { e.preventDefault(); setOver(true); }} onDragLeave=${() => setOver(false)} onDrop=${e => { e.preventDefault(); setOver(false); onFile(e.dataTransfer.files[0]); }}
          class=${"border-[1.5px] border-dashed rounded-lg px-4 py-8 text-center cursor-pointer transition-colors " + (over ? "border-em bg-em-l" : "border-slate-300 hover:border-em hover:bg-em-l")}>
          <${Ic} n="upload" s=${26} c="text-em mx-auto mb-2"/><div class="font-semibold">Drop your resume here</div><div class="text-sm text-mu">PDF or DOCX, up to 10 MB. Or click to browse.</div></div>
        <input ref=${fileRef} type="file" hidden accept=".pdf,.docx" onChange=${e => onFile(e.target.files[0])}/><div class="text-sm text-red-700 mt-2 min-h-[1.2em]" role="alert">${err}</div>
        ${prof ? html`<div class="mt-2"><div class="text-sm text-mu flex items-center gap-2"><${Ic} n="file"/>${prof.src ? "Preview for " + prof.src + " (sample extraction)" : "Sample resume loaded"}. Edit anything that looks wrong.</div>${SEC.map(([k, l]) => html`<${Section} key=${k} k=${k} l=${l} items=${prof[k]} set=${setSec}/>`)}</div>`
          : html`<div class="border border-dashed border-bd rounded-lg p-5 text-center text-sm text-mu">Your parsed skills, education, projects, certifications, experience, internships and achievements will appear here.<div class="mt-3"><${Btn} onClick=${() => setProf(structuredClone(SAMPLE))}>Use sample resume<//></div></div>`}<//>
      <${Card} c="p-6"><h2 class="font-bold text-lg"><span class="font-mono text-em mr-2">2</span>Target roles</h2><p class="text-sm text-mu mb-4">Select roles to rank, or paste your own job description.</p>
        <div class="grid gap-2">${ROLES.map(x => { const on = picked.includes(x.id); return html`<button key=${x.id} role="checkbox" aria-checked=${on} onClick=${() => toggle(x.id)} class=${"flex items-center gap-3 text-left px-4 py-3 rounded-md border transition-colors " + (on ? "border-em bg-em-l" : "border-bd bg-white hover:bg-slate-50")}>
          <span class=${"w-[18px] h-[18px] rounded border grid place-items-center " + (on ? "bg-em border-em text-white" : "border-slate-300")}>${on && html`<${Ic} n="check" s=${12}/>`}</span><span class="font-semibold text-sm">${x.title}</span></button>`; })}
          ${cust.map((x, i) => html`<div key=${x.id} class="flex items-center justify-between px-4 py-3 rounded-md border border-em bg-em-l text-sm"><span class="font-semibold">${x.title}</span><button aria-label=${"Remove " + x.title} onClick=${() => setCust(c => c.filter((_, j) => j !== i))}><${Ic} n="x"/></button></div>`)}</div>
        <button onClick=${() => setDrawer(!drawer)} aria-expanded=${drawer} class="mt-4 text-sm font-semibold text-em flex items-center gap-1.5"><${Ic} n="plus"/>Paste a job description</button>
        ${drawer && html`<div class="mt-3 fade"><textarea value=${jd} onChange=${e => setJd(e.target.value)} placeholder="Paste the full job description here" class="w-full min-h-[120px] border border-bd rounded-md p-3 text-sm focus:outline-none focus:border-em"/><${Btn} c="mt-2" onClick=${addJd}>Add as a role<//></div>`}
        <${Btn} v="p" c="w-full mt-6 py-3" disabled=${!prof || !total} onClick=${run}>Run Semantic Alignment<//>
        <p class="text-xs text-mu text-center mt-2">${prof && total ? total + " role(s) will be compared." : "Add a resume and select at least one role to continue."}</p><//></div></main>`}

  ${view === "run" && html`<main class="max-w-xl mx-auto px-5 py-16 fade"><${Card} c="p-8"><div class="flex justify-between items-baseline"><h2 class="font-bold text-lg">Running semantic alignment</h2><span class="font-mono text-em">${Math.round(step / STEPS.length * 100)}%</span></div>
    <div class="mt-3"><${Bar} v=${step / STEPS.length * 100}/></div><ul class="grid gap-3.5 mt-6">${STEPS.map((s, i) => html`<li key=${s} class=${"flex items-center gap-3 text-sm transition-colors " + (i <= step ? "text-ink" : "text-slate-400")}>
      <span class=${"w-5 h-5 rounded-full border grid place-items-center " + (i < step ? "bg-em border-em text-white" : i === step ? "border-em" : "border-bd")}>${i < step && html`<${Ic} n="check" s=${11}/>`}</span>${s}</li>`)}</ul>
    <p class="text-xs text-mu mt-6">Demonstration only: each stage is simulated with mock data.</p><//></main>`}

  ${view === "dash" && res && html`<main class="max-w-6xl mx-auto px-5 pb-14 fade"><div class="flex flex-wrap justify-between items-center gap-3 pt-8 pb-5"><div><h2 class="text-xl font-bold">${prof.name}</h2><p class="text-sm text-mu">${prof.summary}</p></div>
    <div class="flex flex-wrap gap-2"><${Btn} onClick=${() => setView("work")}><${Ic} n="back"/>Modify Resume / Roles<//><${Btn} v="p" onClick=${download}><${Ic} n="download"/>Download report<//></div></div>
    <div class="text-xs text-mu bg-am-l border border-amber-200 rounded-md px-3 py-2 mb-5">Demo data: scores and explanations are mock values for this frontend prototype.</div>
    <div class="grid lg:grid-cols-[35%_1fr] gap-5 items-start">
      <${Card} c="p-5 lg:sticky lg:top-[88px]"><h3 class="font-bold">Role ranking</h3><p class="text-sm text-mu">Highest alignment first. Select a role.</p><div class="grid gap-2 mt-4">${res.map((x, i) => html`<button key=${x.id} onClick=${() => setAct(x.id)} aria-pressed=${x.id === r.id}
        class=${"text-left rounded-md border px-3.5 py-3 transition-colors " + (x.id === r.id ? "border-em bg-em-l" : "border-bd bg-white hover:bg-slate-50")}><div class="flex justify-between gap-3 text-sm font-semibold"><span><span class="font-mono text-mu mr-2">#${i + 1}</span>${x.title}</span><span class="font-mono text-em">${x.score}%</span></div><div class="mt-2.5"><${Bar} v=${x.score}/></div></button>`)}</div><//>
      <div class="grid gap-5 min-w-0"><div class="flex gap-1 overflow-x-auto border-b border-bd" role="tablist">${[["ov", "Overview", "bars"], ["gap", "Skill gaps", "alert"], ["rm", "Roadmap", "route"], ["cmp", "Compare roles", "cols"]].map(([k, l, ic]) => html`<button key=${k} role="tab" aria-selected=${tab === k} onClick=${() => setTab(k)}
        class=${"flex items-center gap-2 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors " + (tab === k ? "border-em text-ink" : "border-transparent text-mu hover:text-ink")}><${Ic} n=${ic}/>${l}</button>`)}</div>
        ${tab === "ov" && html`<${Overview} key=${r.id} r=${r}/>`}${tab === "gap" && html`<${Gaps} key=${r.id} r=${r}/>`}${tab === "rm" && html`<${Road} key=${r.id} r=${r}/>`}${tab === "cmp" && html`<${Compare} res=${res}/>`}</div></div></main>`}
  <div role="status" class=${"fixed left-1/2 -translate-x-1/2 bottom-[calc(24px+env(safe-area-inset-bottom,0px))] z-50 bg-ink text-white text-sm px-4 py-2.5 rounded-md transition-opacity " + (msg ? "opacity-100" : "opacity-0 pointer-events-none")}>${msg}</div></div>`;
};
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
