import textract
import MeCab
import regex as re

def textExtract(path):
    extractedBytes = textract.process(path)
    decodedText = extractedBytes.decode("utf-8")
    return decodedText

def jpWordExtract(text):
    # Uses Wakati to parse text and segment
    wakati = MeCab.Tagger("-Owakati")
    wordList = wakati.parse(text).split()
    wordDict = {}

    # Counts frequency of each word and collects info to dictionary
    for word in filter(
        checkWord,
        wordList):
        if word not in wordDict:
            wordDict[word] = 1
        else:
            wordDict[word] += 1
    
    wordDict = {k: v for k, v in sorted(wordDict.items(), key = lambda item: item[1], reverse=True)}

    return wordDict
      
# Regex for Japanese words
def checkWord(word):
    return (
        not re.match(r'^s*$', word)
        and not re.match(r'\W', word)
        and re.match(r'\p{Hiragana}|\p{Katakana}|\p{Han}', word)
    )