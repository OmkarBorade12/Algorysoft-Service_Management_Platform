import sys
import mimetypes
import mailbox

def parse_mhtml(filepath, outfile):
    outfile.write("--- Parsing MHTML ---\n")
    outfile.write(f"Reading {filepath}...\n")
    try:
        from email import message_from_file
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            msg = message_from_file(f)
            
        for part in msg.walk():
            if part.get_content_type() == 'text/html' or part.get_content_type() == 'text/plain':
                content = part.get_payload(decode=True).decode('utf-8', errors='ignore')
                import re
                text = re.sub('<[^<]+>', ' ', content)
                text = re.sub(r'\s+', ' ', text)
                outfile.write(text[:5000] + "\n")
                break
    except Exception as e:
        outfile.write(f"Error reading MHTML: {e}\n")

def parse_pdf(filepath, outfile):
    outfile.write("--- Parsing PDF ---\n")
    outfile.write(f"Reading {filepath}...\n")
    try:
        import PyPDF2
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            outfile.write(f"Number of pages: {len(reader.pages)}\n")
            for i in range(len(reader.pages)):
                text = reader.pages[i].extract_text()
                outfile.write(f"--- Page {i+1} ---\n")
                outfile.write(text + "\n")
    except Exception as e:
        outfile.write(f"Error reading PDF: {e}\n")

with open(r"C:\Users\borad\OneDrive\Desktop\AlgorySoft\parsed_output_utf8.txt", 'w', encoding='utf-8') as out:
    parse_mhtml(r"C:\Users\borad\OneDrive\Desktop\AlgorySoft\System Documentation and Flow (1).mhtml", out)
    parse_pdf(r"C:\Users\borad\OneDrive\Desktop\AlgorySoft\Project Documentation.pdf", out)
