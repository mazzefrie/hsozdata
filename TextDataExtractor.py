#!/usr/bin/env python3

import AbstractConnector
import AbstractExtractor


class ConnectorMongoDB(AbstractConnector.AbstractConnector):

    def __init__(self):
        print("Save TextData to MongoDB")

    def addParticipant(p):
        pass

    def addConference(c):
        pass

    def saveData():
        pass


class ConnectorCSV(AbstractConnector.AbstractConnector):

    def __init__(self):
        print("Save TextData to CSV")

    def addParticipant(self,p):
        pass

    def addConference(self,c):
        pass

    def saveData(self):
        pass


class TextDataExtractor(AbstractExtractor.AbstractExtractor):

    def __init__(self, destination, globals_):
        self.destination = destination
        self.globals_ = globals_

    def extract_file(self, file_, ofile):
        pass