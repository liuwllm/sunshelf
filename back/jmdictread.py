import json
import xml.etree.ElementTree as ET

tree = ET.parse('./JMdict_e.xml')
root = tree.getroot()

dictEntries = []

for child in root:
    
    entry = {
        "id" : 'null', 
        "keb" : [],
        "reb" : [],
        "sense" : []
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
            sense = []
            for definition in element:
                if definition.tag == 'gloss':
                    sense.append(definition.text)
            entry['sense'].append(sense)
    
    dictEntries.append(entry)

kebLookup = {}

for entry in dictEntries:
    for keb in entry['keb']:
        if keb in kebLookup:
            kebLookup[keb].append(entry['id'])
        else:
            kebLookup[keb] = [entry['id']]

idLookup = {}

for entry in dictEntries:
    idLookup[entry['id']] = {
        "keb": entry['keb'],
        "reb": entry['reb'],
        "sense": entry['sense']
    }

idJson = json.dumps(idLookup, indent=2)

with open("idLookup.json", "w") as outfile:
    outfile.write(idJson)

jsonEntries = json.dumps(dictEntries, indent=2)

with open("jmdict.json", "w") as outfile:
    outfile.write(jsonEntries)