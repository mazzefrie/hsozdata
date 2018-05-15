#!/usr/bin/env python3

import AbstractConnector
import AbstractExtractor
from AbstractExtractor import NoHTML
from bs4 import BeautifulSoup
import re
import pandas as pd
import logging

from nltk.tokenize import RegexpTokenizer
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer
from gensim import corpora, models
import gensim
from bs4 import BeautifulSoup
from wordcloud import WordCloud
import matplotlib.pyplot as plt

class ConnectorCSV(AbstractConnector.AbstractConnector):

    dict_conferences = []

    def __init__(self):
        print("Save TextData to CSV")

    def addConference(self,c):
        self.dict_conferences.append(c)

    def saveData(self):
        print(self.dict_conferences)
        pass



class TopicModelExtractor(AbstractExtractor.AbstractExtractor):

    def __init__(self, destination, globals_):
        self.destination = destination
        self.globals_ = globals_

        self.tokenizer = RegexpTokenizer(r'\w+')

        # create English stop words list
        self.stop = get_stop_words('de')

        with open("data/german_stopwords_full.txt") as f:
             stopwords = f.readlines()

        self.stop = [x.strip() for x in stopwords] 


        # Create p_stemmer of class PorterStemmer
        self.p_stemmer = PorterStemmer()

        logging.getLogger("gensim").setLevel(logging.WARNING)

    def generateTM(self, text):

        texts = []

        # clean and tokenize document string
        raw = text.lower()
        tokens = self.tokenizer.tokenize(raw)

        # remove stop words from tokens
        stopped_tokens = [text for text in tokens if not text in self.stop]
    
        # stem tokens
        stemmed_tokens = [self.p_stemmer.stem(text) for text in stopped_tokens]
    
        # add tokens to list
        texts.append(stopped_tokens)

        # Städte Namen sind im weg
        # Hilfsverben?! sei, wurde
        # "etwa"

        dictionary = corpora.Dictionary(texts)
        corpus = [dictionary.doc2bow(text) for text in texts]
        ldamodel = gensim.models.ldamodel.LdaModel(corpus, num_topics=2, id2word = dictionary, passes=50)

        print(ldamode)

        return ldamodel.print_topics(num_topics=2, num_words=10)


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

        return self.generateTM(report_text)