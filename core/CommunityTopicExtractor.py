#!/usr/bin/env python3

import AbstractConnector
import AbstractExtractor
import TopicModelExtractor
from AbstractExtractor import NoHTML
from bs4 import BeautifulSoup
import re
import pandas as pd
import logging
import json

from pymongo import MongoClient

from nltk.tokenize import RegexpTokenizer
from stop_words import get_stop_words
from nltk.stem.porter import PorterStemmer
from gensim import corpora, models
import gensim
from bs4 import BeautifulSoup
from wordcloud import WordCloud
import matplotlib.pyplot as plt


class ConnectorMongoDB(AbstractConnector.AbstractConnector):

    db = None

    def __init__(self):
        client = MongoClient('mongodb://localhost:27017/')
        self.db = client[ "out-0205" ]

    def addTopicModel(self, tmd, conf_name, class_id):

        collection = self.db["CommunityTopics"]
        if collection.find({'cid':conf_name}).count(with_limit_and_skip=True) == 0:

            convert = [list(item) for item in list(tmd)]
            dic = [{'id':item[0],'model':item[1]} for item in convert]
            dic_cid = {'cid':conf_name,'cid_model':dic,'class_id':int(class_id)}

            collection.insert( dic_cid )
        else:
            print(conf_name + " already in database")

    def saveData(self):
        pass


class CommunityTopicExtractor(AbstractExtractor.AbstractExtractor):

    def __init__(self, destination, globals_):

        globals_.parser.add_argument('--cfile')
        globals_.parser.add_argument('--topics',type=int,default=2)
        globals_.parser.add_argument('--words',type=int,default=2)
        globals_.parser.add_argument('--passes',type=int,default=2)
        args,extra = globals_.parser.parse_known_args()

        self.destination = destination
        self.globals_ = globals_

        self.tm_extractor = TopicModelExtractor.TopicModelExtractor(destination,globals_)

        self.communities = pd.read_csv( args.cfile )

   
    def extract_file(self, file_, ofile):

         conf_name = "conf"+file_.split(".")[0]

         class_index = self.communities.loc[self.communities['PID'] == conf_name].index;
         if class_index.values.size == True:
            tmdata = self.tm_extractor.extract_file(file_,ofile)
            class_id = self.communities.get_value(class_index.values[0],"Class")
            self.destination.addTopicModel( tmdata, conf_name, class_id)






