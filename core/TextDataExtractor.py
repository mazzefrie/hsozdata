#!/usr/bin/env python3

import AbstractConnector
import AbstractExtractor
from AbstractExtractor import NoHTML
from bs4 import BeautifulSoup
import re
import pandas as pd

"""
Ideen:
- Anzahl der Beiträge pro Debatte
- Größe der Beiträge pro Debatte
- Welche Personen?
- Welche Personen seconden?

- Begriffsanalyse siehe Steinmetz
- LDA Topic Modeling + WordCloud

"""
# -------------------------------


class ConnectorCSV(AbstractConnector.AbstractConnector):

    dict_conferences = []

    def __init__(self):
        print("Save TextData to CSV")

    def addConference(self,c):
        self.dict_conferences.append(c)

    def saveData(self):
        print(self.dict_conferences)
        pass


# Autor?
class TextDataExtractor(AbstractExtractor.AbstractExtractor):

    def __init__(self, destination, globals_):
        self.destination = destination
        self.globals_ = globals_

    def extract_file(self, file_, ofile):

        text = ofile.read()
        soup = BeautifulSoup(text, "html.parser")
        full_text = soup.find(class_="hfn-item-fulltext")

        if not full_text:
            raise NoHTML()

        tid = file_.split(".")[0]
        report_text = full_text.get_text(separator="\n")
        report_text = report_text.replace("/", " / ")

        # Workaround: BS lässt keinen Whitespace am Ende von Absätzen.
        # Beginnt dann ein Absatz mit einem Namen, wird dieser nicht erkannt.
        report_text = re.sub(r"\.([a-zA-Z])", ". \\1", report_text)

        self.destination.addConference(c={
                        "CID":          tid,
                        "num_words":    len(report_text.split()),
        })

        pass