#!/usr/bin/env python3

import AbstractConnector
import AbstractExtractor
from AbstractExtractor import NoHTML
from bs4 import BeautifulSoup
import re
import pandas as pd
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer

class ConnectorMongoDB(AbstractConnector.AbstractConnector):

    db = None

    def __init__(self):
        client = MongoClient('mongodb://localhost:27017/')
        self.db = client[ "out-0205" ]


    def addTFIDF(self, tmd, conf_name):

        collection = self.db["ConferenceTFIDF"]
        if collection.find({'cid':conf_name}).count(with_limit_and_skip=True) == 0:

            convert = [list(item) for item in list(tmd)]
            dic = [{'id':item[0],'model':item[1]} for item in convert]
            dic_cid = {'cid':conf_name,'ftfidf_model':dic}

            collection.insert( dic_cid )
        else:
            print(conf_name + " already in database")

    def saveData(self):
        pass

class TFIDFExtractor(AbstractExtractor.AbstractExtractor):

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

        with open("data/german_stopwords_full.txt") as f:
             stopwords = f.readlines()

        stopwords = [x.strip() for x in stopwords] 

        tf = TfidfVectorizer(analyzer='word', ngram_range=(1,3), min_df = 0, stop_words = stopwords)

        corpus = []
        corpus.append(report_text)

        tfidf_matrix =  tf.fit_transform(corpus)
        feature_names = tf.get_feature_names() 
        dense = tfidf_matrix.todense()

        episode = dense[0].tolist()[0]
        phrase_scores = [pair for pair in zip(range(0, len(episode)), episode) if pair[1] > 0]
        sorted_phrase_scores = sorted(phrase_scores, key=lambda t: t[1] * -1)
        
        tfidf = []
        for phrase, score in [(feature_names[word_id], score) for (word_id, score) in sorted_phrase_scores][:50]:
                tfidf.append([phrase, score])

        self.destination.addTFIDF(tfidf,"conf"+file_.split(".")[0])
