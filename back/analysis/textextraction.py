import textract

def textExtract(path):
    text = textract.process(path)
    return text
    

