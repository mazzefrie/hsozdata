#!/usr/bin/env python3

import AbstractConnector
import AbstractExtractor
from AbstractExtractor import NoHTML
from bs4 import BeautifulSoup
import re
import pandas as pd



class ConnectorCSV(AbstractConnector.AbstractConnector):

    def __init__(self):
        pass

    def saveData(self):
        pass



class TextExtractor(AbstractExtractor.AbstractExtractor):


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

        with open("../../data-hsk-plain/" + file_, "w") as ofile:
                ofile.write(report_text)
                ofile.close()


