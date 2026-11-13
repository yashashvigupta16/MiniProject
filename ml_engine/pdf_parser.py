
import pymupdf


def extract_text_from_pdf(pdf_path):

    extracted_text = ""

    # Open the PDF file
    with pymupdf.open(pdf_path) as pdf:

        # Read every page
        for page in pdf:

            page_text = page.get_text()

            extracted_text += page_text + "\n"

    return extracted_text.strip()

