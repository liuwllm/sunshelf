def jpWordExtract(text):
    words = nagisa.wakati(text)
    wordDict = {}

    for word in filter(
        checkWord,
        words):
        if word not in wordDict:
            wordDict[word] = 0
        else:
            wordDict[word] += 1

        
def checkWord(word):
    return (
        not re.match(r'^s*$', word)
        and not re.match(r'\W', word)
        and re.match(r'\p{Hiragana}|\p{Katakana}|\p{Han}', word)
    )