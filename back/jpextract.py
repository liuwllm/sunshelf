import textract
import MeCab
import regex as re

def textExtract(path):
    extractedBytes = textract.process(path)
    decodedText = extractedBytes.decode("utf-8")
    return decodedText

def jpWordExtract(text):
    wakati = MeCab.Tagger("-Owakati")
    wordList = wakati.parse(text).split()
    wordDict = {}

    for word in filter(
        checkWord,
        wordList):
        if word not in wordDict:
            wordDict[word] = 1
        else:
            wordDict[word] += 1
    
    wordDict = {k: v for k, v in sorted(wordDict.items(), key = lambda item: item[1], reverse=True)}

    return wordDict
      
def checkWord(word):
    return (
        not re.match(r'^s*$', word)
        and not re.match(r'\W', word)
        and re.match(r'\p{Hiragana}|\p{Katakana}|\p{Han}', word)
    )