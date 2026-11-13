/* ============ DATA (mock only, no analysis is computed) ============ */
const SAMPLE = { name: "Aarav Mehta", summary: "B.Tech Computer Science student with Python, SQL and machine learning projects.",
  skills: ["Python", "SQL", "scikit-learn", "Pandas", "NumPy", "NLP", "SBERT", "Git", "Flask", "Power BI", "Excel", "Statistics"],
  education: ["B.Tech Computer Science, GLA University (2023 to 2027)"],
  projects: ["Resume Role Matcher (SBERT)", "Sales Dashboard (Power BI)", "Student Result Predictor (scikit-learn)"],
  certifications: ["Google Data Analytics Certificate", "Machine Learning Specialization"],
  experience: ["Student developer, college tech society (1 year)"], internships: ["Data analytics intern (2 months)"],
  achievements: ["Finalist, college hackathon 2025", "Top 10% in machine learning course"] };
const SEC = [["skills", "Skills"], ["education", "Education"], ["projects", "Projects"], ["certifications", "Certifications"], ["experience", "Experience"], ["internships", "Internships"], ["achievements", "Achievements"]];
const STEPS = ["Resume processing", "Text extraction", "Information extraction", "Job description analysis", "SBERT embeddings", "Cosine similarity", "Alignment calculation", "Role ranking", "Skill gap analysis"];
const MK = (a, b, c, d) => ({ "Skill alignment": a, "Project relevance": b, "Education compatibility": c, "Experience relevance": d });
const ROLES = [
 { id: "ml", title: "Machine Learning Engineer", score: 87, b: MK(90, 88, 85, 72),
   why: "Your Resume Role Matcher embeds text and compares it by meaning, the same family of techniques this role uses daily. Student Result Predictor shows end-to-end model training and evaluation. What is missing is production work: no deep learning framework or deployment appears on your resume yet.",
   matched: ["Python", "scikit-learn", "NumPy", "Pandas", "NLP", "SBERT", "Git"], proj: [["Resume Role Matcher (SBERT)", "Sentence embeddings and similarity ranking match the NLP responsibilities."], ["Student Result Predictor (scikit-learn)", "Covers model training, validation and evaluation."]],
   missing: ["PyTorch", "Docker", "MLOps"], weak: [["Cloud deployment", "Mentioned only in passing. State where one of your models was hosted."]],
   recs: ["Rebuild one project in PyTorch and list it under Projects.", "Containerize your Flask service with Docker and link the repository.", "Add a resume line on how you evaluated and versioned models."],
   gaps: [["PyTorch", 25, 80], ["Docker", 15, 70], ["MLOps", 10, 65], ["Cloud deployment", 30, 65]],
   road: [["Weeks 1 to 3", "Deep learning foundations", ["Finish a PyTorch fundamentals course", "Rebuild Student Result Predictor in PyTorch"]], ["Weeks 4 to 6", "Package and serve", ["Containerize the project with Docker", "Expose predictions through a REST endpoint"]], ["Weeks 7 to 10", "Production habits", ["Track experiments and model versions", "Deploy a demo to a free cloud tier"]]] },
 { id: "da", title: "Data Analyst", score: 81, b: MK(85, 78, 82, 70),
   why: "Sales Dashboard shows you can turn raw data into charts a business reader can act on, and your SQL, Excel and Power BI skills cover the daily toolset. The Google Data Analytics Certificate and your analytics internship support this. Statistical testing appears only lightly.",
   matched: ["SQL", "Python", "Pandas", "Excel", "Power BI", "Statistics"], proj: [["Sales Dashboard (Power BI)", "Matches dashboard and reporting duties."], ["Data analytics internship", "Hands-on reporting experience."]],
   missing: ["Tableau", "A/B testing"], weak: [["Statistics", "Listed as a skill but no analysis demonstrates it."]],
   recs: ["Recreate your dashboard in Tableau Public and link it.", "Add one analysis that compares two groups and states the result.", "Quantify the impact of your internship reports."],
   gaps: [["A/B testing", 20, 70], ["Statistics", 45, 75], ["Tableau", 15, 55]],
   road: [["Weeks 1 to 2", "Strengthen statistics", ["Review hypothesis testing and confidence intervals"]], ["Weeks 3 to 5", "Experiment analysis", ["Analyze a public A/B test dataset", "Write up the findings"]], ["Weeks 6 to 7", "Broaden BI tools", ["Recreate a Power BI dashboard in Tableau"]]] },
 { id: "ds", title: "Data Scientist", score: 76, b: MK(78, 80, 80, 62),
   why: "Student Result Predictor and the NLP matcher show modelling skill on real questions, which fits the core of this role. The role expects deeper statistics, experiment design and work on larger datasets than your resume currently shows.",
   matched: ["Python", "Pandas", "NumPy", "scikit-learn", "NLP", "Statistics"], proj: [["Student Result Predictor (scikit-learn)", "Predictive modelling with evaluation."], ["Machine Learning Specialization", "Supports your modelling foundations."]],
   missing: ["Deep learning", "Spark"], weak: [["Experiment design", "Describe how you validated a model or compared approaches."]],
   recs: ["Add feature engineering details to your predictor project.", "Complete one PySpark project on a large public dataset.", "Describe a controlled comparison between two models."],
   gaps: [["Deep learning", 30, 75], ["Experiment design", 25, 70], ["Spark", 10, 60]],
   road: [["Weeks 1 to 4", "Deepen modelling", ["Study feature engineering patterns", "Learn neural network basics"]], ["Weeks 5 to 7", "Design experiments", ["Plan and analyze a controlled experiment"]], ["Weeks 8 to 10", "Work at scale", ["Complete a PySpark project"]]] },
 { id: "sd", title: "Software Developer", score: 68, b: MK(66, 70, 78, 55),
   why: "You can build working services: Flask and REST appear in your matcher project. Your resume leans toward data work, so engineering practice such as testing, automation and architecture is thin compared with what this role lists.",
   matched: ["Python", "Git", "Flask", "SQL"], proj: [["Resume Role Matcher (SBERT)", "A working application built on a web framework."]],
   missing: ["Testing", "CI/CD", "System design"], weak: [["Data structures", "Add problems solved or a project that depends on algorithmic choices."]],
   recs: ["Add unit tests to an existing project and mention coverage.", "Set up a GitHub Actions workflow on one repository.", "Describe the architecture of your largest project."],
   gaps: [["System design", 20, 70], ["Testing", 25, 70], ["CI/CD", 10, 60], ["Data structures", 40, 70]],
   road: [["Weeks 1 to 3", "Engineering practice", ["Add unit tests to a project", "Set up a CI pipeline"]], ["Weeks 4 to 7", "Core fundamentals", ["Practice data structures problems", "Read a system design primer"]], ["Weeks 8 to 10", "Show it", ["Build one full-stack app and document it"]]] }];
const customRole = (t, n) => ({ id: "jd" + n, title: t, score: 72, b: MK(74, 70, 80, 60),
  why: "This is a mock result for your pasted description. A real engine would compare its requirements with your profile; here the values are illustrative.",
  matched: ["Python", "SQL", "Pandas", "Git"], proj: [["Resume Role Matcher (SBERT)", "Closest project to the pasted requirements."]], missing: ["Docker", "CI/CD"], weak: [["Communication", "Add evidence of presenting or documenting your work."]],
  recs: ["Mirror the description’s key terms where they honestly apply.", "Add one project that uses the missing tools."], gaps: [["Docker", 15, 65], ["CI/CD", 10, 60]],
  road: [["Weeks 1 to 3", "Close the main gaps", ["Learn Docker basics", "Add a CI workflow to one repository"]]] });

