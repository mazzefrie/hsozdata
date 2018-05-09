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


# From: http://blog.alejandronolla.com/2013/05/15/detecting-text-language-with-python-and-nltk/

#----------------------------------------------------------------------
def _calculate_languages_ratios(text):
    """
    Calculate probability of given text to be written in several languages and
    return a dictionary that looks like {'french': 2, 'spanish': 4, 'english': 0}
    
    @param text: Text whose language want to be detected
    @type text: str
    
    @return: Dictionary with languages and unique stopwords seen in analyzed text
    @rtype: dict
    """

    languages_ratios = {}

    '''
    nltk.wordpunct_tokenize() splits all punctuations into separate tokens
    
    >>> wordpunct_tokenize("That's thirty minutes away. I'll be there in ten.")
    ['That', "'", 's', 'thirty', 'minutes', 'away', '.', 'I', "'", 'll', 'be', 'there', 'in', 'ten', '.']
    '''

    tokens = wordpunct_tokenize(text)
    words = [word.lower() for word in tokens]

    # Compute per language included in nltk number of unique stopwords appearing in analyzed text

    try:
        for language in stopwords.fileids():
            stopwords_set = set(stopwords.words(language))
            words_set = set(words)
            common_elements = words_set.intersection(stopwords_set)

            languages_ratios[language] = len(common_elements) # language "score"
    except AttributeError: # Added by mazzefrie for multithreading issues: ¯\_(ツ)_/¯ seems to work...
        return _calculate_languages_ratios(text)

    return languages_ratios



def detect_language(text):
    """
    Calculate probability of given text to be written in several languages and
    return the highest scored.
    
    It uses a stopwords based approach, counting how many unique stopwords
    are seen in analyzed text.
    
    @param text: Text whose language want to be detected
    @type text: str
    
    @return: Most scored language guessed
    @rtype: str
    """

    ratios = _calculate_languages_ratios(text)

    most_rated_language = max(ratios, key=ratios.get)

    return most_rated_language


#----------------------------------------------------------------------

class PersonExtractor(AbstractExtractor.AbstractExtractor):

    def __init__(self, destination,globals_):
        self.destination = destination
        self.globals_ = globals_

        if not self.globals_.config['dummy']:
            print("Loading German Model")
            with open('nltk_german_classifier_data.pickle', 'rb') as f:
                self.globals_.tagger = pickle.load(f)
        else:
            print("Dummy Mode")


    def extract_participants(self, tagged,tid):

        cnt = 0;
        name = [];

        for index, obj in enumerate(tagged):
            try:

                # TODO: Compare with regular expressions
                if (obj[1] == "NE" or obj[1] == "NNP") and obj[0].isupper():
                    name.append(obj[0])
                else:
                    if len(name) > 1:

                        name_ = ' '.join(name)
                        if not "U. S." in name_ and not "D. C." in name_ and not "M. A" in name_:
                        #if not "U." and not "S." in name:
                        # Add Participant
                            self.destination.addParticipant(p={
                                "CID": tid,
                                "Person": name_
                            })

                            cnt += 1

                    name = []

            except (ValueError, IndexError):
                pass

        return cnt


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

                    report_text = full_text.get_text()
                    report_text = report_text.replace("/", " / ")

                    # Workaround: BS lässt keinen Whitespace am Ende von Absätzen.
                    # Beginnt dann ein Absatz mit einem Namen, wird dieser nicht erkannt.
                    report_text = re.sub(r"\.([a-zA-Z])", ". \\1", report_text)

                    # Der Tagger hat zudem Probleme mit Akkzenten
                    report_text = unidecode.unidecode(report_text)

                    tokens = word_tokenize(report_text)
                    text_lang = detect_language(report_text)

                    # Tagger wechseln
                    if "english" in text_lang:
                        tagged =  nltk.pos_tag(tokens) # English tagger
                    else:
                        tagged = self.globals_.tagger.tag(tokens) # german tagger

                    tagged_persons = self.extract_participants(tagged, tid)

                    self.destination.addConference(c={
                        "CID":          tid,
                        "Count":        tagged_persons
                    })
