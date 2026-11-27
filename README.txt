AlgoMind frontend (React 18 + HTM + Tailwind via CDN, no build step)

Run (from the project folder, PowerShell):
  Backend\venv\Scripts\python.exe Backend\app.py
then open http://127.0.0.1:5000  (needs Backend\.env with MONGO_URI and
GEMINI_API_KEY, and internet for CDN scripts and fonts).

index.html          page shell (loads CDN libraries and the files below)
styles.css          design tokens, surfaces, buttons, inputs, 3D hero scene
tailwind.config.js  AlgoMind palette (midnight navy, violet, electric blue, lavender), fonts, shadows
data.js             all mock data (SAMPLE, ROLES, customRole), unchanged
app.js              React components and app logic

Flow: Landing -> Sign in / Create account (or demo) -> Workspace (upload, edit
profile, pick roles or paste a job description) -> simulated analysis -> Results
(KPIs, charts, job matches, skill gaps, roadmap, compare, recent analyses, report download).

Upload and analysis call the Flask backend (/api/upload, /api/analyze).
data.js is only used for the sample/demo screens.
