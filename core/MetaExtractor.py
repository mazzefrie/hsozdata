#!/usr/bin/env python3

import time
import pandas as pd
import AbstractExtractor
import AbstractConnector
from AbstractExtractor import NoHTML
import re
import unidecode
import nltk
import pickle
from bs4 import BeautifulSoup
from nltk import wordpunct_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from multiprocessing import Queue
from threading import Thread
from ClassifierBasedGermanTagger.ClassifierBasedGermanTagger import ClassifierBasedGermanTagger

class ConnectorCSV(AbstractConnector.AbstractConnector):

    dict_participants = []
    dict_conferences = []

    cols_participants = ['CID','Person']
    cols_conferences = ['CID','Title','StartDate','EndDate',"Epoche","Thema","Count"]

    def __init__(self):
        print("Save to CSV")

    def addParticipant(self,p):
        self.dict_participants.append(p)


    def addConference(self,c):
        self.dict_conferences.append(c)


    def saveData(self):
        pd.DataFrame(self.dict_conferences, columns=self.cols_conferences).to_csv("../out/conferences" + str(time.time()) + ".csv")
        pd.DataFrame(self.dict_participants, columns=self.cols_participants).to_csv("../out/participants" + str(time.time()) + ".csv")

        print(self.dict_participants)
        print(len(self.dict_participants))
        print(self.dict_conferences)

class MetaExtractor(AbstractExtractor.AbstractExtractor):

    def __init__(self, destination,globals_):
        self.destination = destination
        self.globals_ = globals_

    def extract_metainfo(self, soup):

        meta_info = {}

        date = soup.find(class_="hfn-item-key", text="Datum").nextSibling.get_text()
        date = date.replace('\n', "").replace('\t', "").replace(' ', "").split("-")

        meta_info = self.extract_metablock(soup)

        try:
            meta_info['StartDate'] = date[0]
        except IndexError:
            meta_info['StartDate'] = ""

        try:
            meta_info['EndDate'] = date[1]
        except IndexError:
            meta_info['EndDate'] = ""

        return meta_info


    def extract_metablock(self, soup):

        meta_data = soup.find_all(class_="metaBlock")
        meta_string = {}

        for data in meta_data:
            d = self.extract_metablock_information(data)
            meta_string[d[0]] = d[1]

        return meta_string

    def extract_metablock_information(self, data):

            block_name = data.find(class_="metaBlockKey").string
            block_content = ""

            if data.find("div", class_=""):
                signi = data.find("div", class_="")
                if signi.string:
                    block_content = signi.string.strip()
                else:
                    for tag in signi.find_all("a"):
                        block_content +=  tag.string.strip()+", "

            return [block_name, block_content.rstrip().rstrip(",")]


    # Do something with the content of a file
    def extract_file(self, file_, ofile):

                text = ofile.read()
                soup = BeautifulSoup(text, "html.parser")
                full_text = soup.find(class_="hfn-item-fulltext")

                if not full_text:
                    raise NoHTML()


                if not self.globals_.config['dummy']:
                    conf_title, page_title = soup.title.string.split("|")
                    tid = file_.split(".")[0]

                    meta_info = self.extract_metainfo(soup)

                    self.destination.addConference(c={
                        "CID":          tid,
                        "Title":        conf_title.strip(),
                        "StartDate":    meta_info['StartDate'],
                        "EndDate":      meta_info['EndDate'],
                        "Epoche":       meta_info['Epoche'],
                        "Thema":        meta_info['Thema']
                    })
