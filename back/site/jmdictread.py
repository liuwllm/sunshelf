import json
import xml.etree.ElementTree as ET

tree = ET.parse('./site/JMdict_e.xml')
root = tree.getroot()

dictEntries = []

for child in root:
    
    entry = {
        "id" : 'null', 
        "keb" : [],
        "reb" : [],
        "gloss" : []
    }

    for element in child:
        if element.tag == 'ent_seq':
            entry['id'] = int(element.text)
        elif element.tag == 'k_ele':
            for reading in element:
                if reading.tag == 'keb':
                    entry['keb'].append(reading.text)
        elif element.tag == 'r_ele':
            for reading in element:
                if reading.tag == 'reb':
                    entry['reb'].append(reading.text)
        elif element.tag == 'sense':
            for definition in element:
                if definition.tag == 'gloss':
                    entry['gloss'].append(definition.text)
    
    dictEntries.append(entry)

jsonEntries = json.dumps(dictEntries, indent=2)

with open("jmdict.json", "w") as outfile:
    outfile.write(jsonEntries)