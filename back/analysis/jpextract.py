import textract
import MeCab
import regex as re

def textExtract(path):
    text = textract.process(path)
    return text

def jpWordExtract(text):
    wakati = MeCab.Tagger("-Owakati")
    wordList = wakati.parse(text).split()
    wordDict = {}

    for word in filter(
        checkWord,
        wordList):
        if word not in wordDict:
            wordDict[word] = 0
        else:
            wordDict[word] += 1
    
    return wordDict
      
def checkWord(word):
    return (
        not re.match(r'^s*$', word)
        and not re.match(r'\W', word)
        and re.match(r'\p{Hiragana}|\p{Katakana}|\p{Han}', word)
    )

extractedBytes = textExtract('./sample.txt')
finalText = extractedBytes.decode("utf-8")

print(jpWordExtract(finalText))