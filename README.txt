AlgoMind frontend (React 18 + HTM + Tailwind via CDN, no build step)

Open index.html in Chrome. Needs internet for CDN scripts and fonts.

index.html          page shell (loads CDN libraries and the files below)
styles.css          design tokens, surfaces, buttons, inputs, 3D hero scene
tailwind.config.js  AlgoMind palette (midnight navy, violet, electric blue, lavender), fonts, shadows
data.js             all mock data (SAMPLE, ROLES, customRole), unchanged
app.js              React components and app logic

Flow: Landing -> Sign in / Create account (or demo) -> Workspace (upload, edit
profile, pick roles or paste a job description) -> simulated analysis -> Results
(KPIs, charts, job matches, skill gaps, roadmap, compare, recent analyses, report download).

All analysis values are demonstration data from data.js. No backend is called.
To connect a real engine, replace the ROLES lookup inside run()/show() in app.js.
