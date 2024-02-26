import os
import subprocess

def convert_doc_to_md(doc_file, md_file):
    try:
        subprocess.run(['C:/Users/Butterfly/AppData/Local/Pandoc/pandoc', doc_file, '-o', md_file])
        print(f"Converted {doc_file} to {md_file}")
    except FileNotFoundError:
        print("Error: pandoc not found. Please install pandoc first.")

def batch_convert_doc_to_md():
    current_folder = os.getcwd()
    for filename in os.listdir(current_folder):
        if filename.endswith('.docx'):
            doc_file = os.path.join(current_folder, filename)
            md_file = os.path.splitext(doc_file)[0] + '.md'
            convert_doc_to_md(doc_file, md_file)

if __name__ == "__main__":
    batch_convert_doc_to_md()
