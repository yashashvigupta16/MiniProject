# Autonomous Resume to-Role Semantic Alignment Ranking Engine

**Project Team:** AlgoMind (Team-38)  
**Course Code:** BCSJ0010 (Mini-Project)  
**Institution:** GLA University, Mathura  
**GitHub Repository:** [https://github.com/yashashvigupta16/MiniProject.git](https://github.com/yashashvigupta16/MiniProject.git)

---

## 📌 Project Overview

When college students and freshers apply for jobs, they often struggle to identify which specific job roles best match their skills, projects, and coursework. Traditional resume screening software relies strictly on exact keyword matching (e.g., checking if the exact word "Python" appears in both the resume and job post). If a student writes "Data Analysis using Pandas" instead of "Data Analyst", traditional keyword engines often fail to establish the connection.

This project is an **AI-assisted career helper** that processes a student's resume (PDF format), compares it with multiple job descriptions, and calculates a match score based on contextual meaning (semantic similarity). Using **Retrieval-Augmented Generation (RAG)**, the system retrieves relevant job knowledge and context to feed into Google Gemini API, producing grounded, highly tailored resume explanations and upskilling action plans.

---

## ⚙️ Tech Stack

All tools selected for this project are 100% free, open-source, and beginner-friendly.

### 🌐 Frontend (User Interface)
* **HTML5 & CSS3:** Page structure, custom layout, and responsive design.
* **JavaScript (ES6):** Dynamic UI operations, file handling, and API integration (`fetch` / `axios`).
* **React.js:** Modular UI components (Resume Upload Card, Score Card, Skill Badges, RAG Recommendations).

### ⚙️ Backend & Database
* **Python 3.10:** Main backend server implementation language.
* **Flask & Flask-CORS:** Lightweight Python web framework providing REST API endpoints.
* **MongoDB:** NoSQL database storing job roles, candidate profiles, and analysis logs.
* **Google Gemini API (Free Tier):** Generates natural-language feedback and personalized upskilling advice.

### 🧠 Machine Learning, NLP & RAG Pipeline
* **PyMuPDF (`fitz`):** Extracts raw text from uploaded PDF resumes.
* **spaCy (`en_core_web_sm`):** Natural Language Processing library for skill parsing and entity extraction.
* **Sentence-Transformers (`all-MiniLM-L6-v2`):** Pre-trained local embedding model that converts resume and job text into dense vector representations.
* **FAISS / Vector Index:** Vector database engine used for fast similarity retrieval in the Retrieval-Augmented Generation (RAG) pipeline.
* **Scikit-learn:** Computes Cosine Similarity scores between candidate and role vectors.

---

## 🏗️ Project Architecture & Workflow

The system uses a 3-Tier Architecture combining frontend components, backend REST APIs, and a RAG-augmented ML engine.

```
+---------------------------------------------------------------------------------+
|                                  FRONTEND                                       |
|                      (React.js + HTML / CSS / JavaScript)                       |
|                                                                                 |
|   [ Resume Upload (PDF) ] ----> [ Role Selection ] ----> [ Ranked Results Dashboard ]
+----------------------------------------+----------------------------------------+
                                         |
                                         | REST API Requests (Axios / JSON)
                                         v
+---------------------------------------------------------------------------------+
|                                   BACKEND                                       |
|                           (Python / Flask REST API)                             |
|                                                                                 |
|   - POST /api/upload-resume : Parses PDF text                                  |
|   - GET  /api/roles         : Fetches job descriptions                         |
|   - POST /api/analyze       : Triggers SBERT vector matching & RAG pipeline    |
|   - GET  /api/history       : Retrieves previous evaluation logs             |
+-------------------+------------------------------------+------------------------+
                    |                                    |
                    v                                    v
+---------------------------------------+    +------------------------------------+
|               DATABASE                |    |         ML & RAG ENGINE            |
|              (MongoDB)                |    |   (PyMuPDF + spaCy + SBERT + RAG)  |
|                                       |    |                                    |
| - Stored Job Descriptions             |    | 1. Extract PDF text using PyMuPDF   |
| - Extracted Candidate Profiles        |    | 2. Parse skills using spaCy NLP    |
| - Saved Analysis Logs & Gemini Notes  |    | 3. Create SBERT vector embeddings  |
|                                       |    | 4. Cosine Similarity ranking       |
|                                       |    | 5. RAG Vector Retrieval (FAISS)    |
|                                       |    | 6. Gemini API Context Synthesis    |
+---------------------------------------+    +------------------------------------+
```

### Detailed Execution Pipeline

1. **Upload:** User uploads a PDF resume via the React interface.
2. **Text Extraction:** Flask receives the file (`POST /api/upload-resume`) and passes it to `PyMuPDF` to extract clean text.
3. **Skill Parsing:** `spaCy` analyzes the text to group skills, education, and experience projects.
4. **Vector Embeddings:** SBERT (`all-MiniLM-L6-v2`) converts resume and job description text into 384-dimensional dense vectors.
5. **Similarity Calculation:** Cosine Similarity measures the angular distance between vectors to calculate a match score (0% to 100%).
6. **RAG Context Retrieval:** Relevant skill gaps and role requirements are retrieved from a FAISS vector index based on user embeddings.
7. **Gemini Feedback Generation:** The retrieved RAG context is passed to the Google Gemini API to generate accurate, context-aware suggestions without hallucinations.
8. **Output Storage:** Flask saves results into MongoDB and returns ranked roles, match scores, missing skills, and RAG-augmented AI feedback back to the React UI.

---

## 🔌 API Endpoints Summary

| Endpoint | Method | Description | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `/api/upload-resume` | `POST` | Uploads PDF resume and extracts raw text | `file`: PDF File |
| `/api/roles` | `GET` | Fetches available job descriptions from MongoDB | None |
| `/api/analyze` | `POST` | Executes SBERT vector search & RAG-augmented Gemini feedback | `{ resume_id, selected_roles }` |
| `/api/history` | `GET` | Retrieves past user evaluations | None |

---

## 📂 Project Directory Structure

```
MiniProject/
├── README.md                  # Project documentation
├── requirements.txt           # Required Python packages list
│
├── backend/                   # Python Flask backend
│   ├── app.py                 # Main Flask REST API server
│   ├── db.py                  # MongoDB connection setup
│   ├── gemini_helper.py       # Google Gemini API integration module
│   └── uploads/               # Temporary storage for uploaded PDFs
│
├── ml_engine/                 # Machine Learning & RAG pipeline
│   ├── pdf_parser.py          # PDF text extraction logic
│   ├── skill_extractor.py     # Skill extraction using spaCy
│   ├── similarity.py          # SBERT embedding & Cosine calculation
│   └── rag_retriever.py       # RAG pipeline using vector retrieval
│
└── frontend/                  # React + Web frontend
    ├── public/
    │   └── index.html         # Main HTML document
    └── src/
        ├── App.js             # Main React component
        ├── App.css            # Styling rules
        ├── api.js             # API request handlers (Fetch / Axios)
        └── components/        # UI components (Upload, Results, Feedback)
```

---

## 📊 Sample Output Format

| Rank | Job Role | Alignment Score | Matched Skills | Key Missing Skills | AI Explanation (RAG + Gemini API) |
| :---: | :--- | :---: | :--- | :--- | :--- |
| **1** | Machine Learning Engineer | **87%** | Python, SQL, ML, Pandas | Docker, PyTorch | *"Great alignment with Python and ML basics. Based on retrieved role requirements, building a PyTorch project will bridge your major skill gap."* |
| **2** | Data Analyst | **81%** | Python, SQL, Excel, Power BI | Tableau | *"Strong data handling background. Adding Tableau or similar visualization tools will boost your suitability for analyst roles."* |
| **3** | Data Scientist | **76%** | Python, ML, Statistics | R, Deep Learning | *"Solid mathematical foundation. Focus on core deep learning concepts to improve your alignment score."* |
| **4** | Software Developer | **68%** | Python, SQL | Java, Data Structures | *"Needs core computer science fundamentals like Data Structures and Object-Oriented Programming in Java or C++."* |

---

## 🛠️ Step-by-Step Setup Guide

### 1. System Requirements
* Python 3.10+ installed
* Node.js & npm installed (for React)
* MongoDB Community Server running locally (or MongoDB Atlas connection string)
* Google Gemini API Key (Free tier key from Google AI Studio)

### 2. Clone the Repository
```bash
git clone https://github.com/yashashvigupta16/MiniProject.git
cd MiniProject
```

### 3. Setting Up Backend, ML & Environment Variables
```bash
# Create a Python virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Download spaCy English language model
python -m spacy download en_core_web_sm
```

Create a `.env` file inside the `backend/` directory:
```env
MONGO_URI=mongodb://localhost:27017/resumedb
GEMINI_API_KEY=your_free_gemini_api_key_here
```

### 4. Running Backend Server
```bash
python backend/app.py
```
*Backend REST API will run on `http://127.0.0.1:5000`*

### 5. Running Frontend React App
```bash
cd frontend
npm install
npm start
```
*Frontend will open in browser at `http://localhost:3000`*

---

## 👥 Team Members & Roles

| Serial | Member Name | Role | Core Responsibility |
| :---: | :--- | :--- | :--- |
| **1** | **Somya Goyal** | Team Leader | Machine Learning Engine (SBERT Embeddings, spaCy NLP, RAG Pipeline & Vector Similarity) |
| **2** | **Yashashvi Gupta** | Core Member | Backend Development (Flask REST API), Database Management (MongoDB) & Gemini API Integration |
| **3** | **Shivangi Goel** | Core Member | Frontend UI Development (React.js, HTML/CSS, JavaScript & Component Design) |

---

## 📜 References

1. Reimers, N. and Gurevych, I. (2019). *Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks.* EMNLP.
2. spaCy NLP Documentation: [https://spacy.io/](https://spacy.io/)
3. Hugging Face Model: `sentence-transformers/all-MiniLM-L6-v2`
4. Google Gemini API Documentation: [https://ai.google.dev/](https://ai.google.dev/)