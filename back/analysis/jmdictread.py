import xml.etree.ElementTree as ET
tree = ET.parse('JMdict_e.xml')
root = tree.getroot()

for child in root:
    print(child[1][0].text)