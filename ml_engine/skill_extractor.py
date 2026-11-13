
import re

# Skills that our system can recognize
SKILL_DICTIONARY = {

    # Programming languages
    "Python": ["python"],
    "Java": ["java"],
    "C++": ["c++"],
    "C": ["c language", "c programming"],
    "JavaScript": ["javascript", "js"],

    # Web development
    "HTML": ["html", "hypertext markup language"],
    "CSS": ["css", "cascading style sheets"],
    "React": ["react", "react.js"],
    "Node.js": ["node.js", "nodejs"],

    # Data and databases
    "SQL": ["sql", "structured query language"],
    "MySQL": ["mysql"],
    "MongoDB": ["mongodb", "mongo db"],
    "Database Management": ["database management", "database administration"],
    "Data Analysis": ["data analysis", "data analytics", "analyzing data"],
    "Data Visualization": ["data visualization", "data viz"],
    "Excel": ["excel", "microsoft excel"],
    "Power BI": ["power bi"],
    "Tableau": ["tableau"],

    # AI and machine learning
    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning", "dl"],
    "Natural Language Processing": ["natural language processing", "nlp"],
    "Computer Vision": ["computer vision"],
    "Artificial Intelligence": ["artificial intelligence", "ai"],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "Scikit-learn": ["scikit-learn", "sklearn"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "OpenCV": ["opencv"],

    # Tools and technologies
    "Git": ["git", "version control"],
    "GitHub": ["github"],
    "Docker": ["docker"],
    "Linux": ["linux"],
    "Flask": ["flask"],
    "FastAPI": ["fastapi"],

    # Professional skills
    "Communication": ["communication", "client contact", "verbal communication"],
    "Leadership": ["leadership", "led", "supervised"],
    "Team Management": ["team management", "managed workers"],
    "Coordination": ["coordination", "coordinated"],
    "Research": ["research", "researching"],
    "Problem Solving": ["problem solving", "analytical thinking"],
    "Teaching": ["teaching", "assisted teachers"],
    "Client Management": ["client management", "client records"],
    "Activity Planning": ["activity planning", "outing planning"]
}


def extract_skills(text):

    extracted_skills = []

    # Convert text to lowercase
    text = text.lower()

    # Check every skill in our dictionary
    for skill, keywords in SKILL_DICTIONARY.items():

        for keyword in keywords:

            # Match complete words or phrases
            pattern = r"(?<!\w)" + re.escape(keyword) + r"(?!\w)"

            if re.search(pattern, text):

                extracted_skills.append(skill)
                break

    return extracted_skills
