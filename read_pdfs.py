import os
import sys
from pypdf import PdfReader

out_path = r"c:\Users\USER\Downloads\barang barang IDP\websiteproject\pdf_output.txt"
with open(out_path, "w", encoding="utf-8") as f:
    pdf_path = r"c:\Users\USER\Downloads\barang barang IDP\websiteproject\pagedesignrequirement\haykaldesignrequirement.pdf"
    f.write(f"\n--- Reading {os.path.basename(pdf_path)} ---\n")
    try:
        reader = PdfReader(pdf_path)
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            f.write(f"Page {i+1}:\n")
            f.write(text + "\n")
            f.write("-" * 20 + "\n")
    except Exception as e:
        f.write(f"Error reading {pdf_path}: {e}\n")
