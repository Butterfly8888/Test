import os
from win32com import client as wc
import time

def convert_doc_to_docx(doc_file, docx_file):
    # 启动Word应用程序
    word = wc.Dispatch('Word.Application')
    # 打开.doc文件
    doc = word.Documents.Open(doc_file)
    # 另存为.docx文件
    doc.SaveAs(docx_file, 12)  # 12表示保存为.docx格式
    # 关闭Word应用程序
    word.Quit()
    time.sleep(4)
    if os.path.exists(doc_file):
    # 删除文件
        os.remove(doc_file)

def batch_convert_doc_to_docx(input_folder, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.endswith('.doc'):
            doc_file = os.path.join(input_folder, filename)
            docx_file = os.path.join(output_folder, os.path.splitext(filename)[0] + '.docx')
            convert_doc_to_docx(doc_file, docx_file)

if __name__ == "__main__":
    input_folder = r"D:/HuaweiMoveData/Users/Butterfly/Desktop/文书网网安类案件判决书/"
    output_folder = r"D:/HuaweiMoveData/Users/Butterfly/Desktop/文书网网安类案件判决书/"
    batch_convert_doc_to_docx(input_folder, output_folder)
