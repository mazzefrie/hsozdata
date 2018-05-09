#!/usr/bin/env python3

import time
import pandas as pd
import AbstractExtractor
import AbstractConnector
from pymongo import MongoClient

class MongoDBExtractor(AbstractExtractor.AbstractExtractor):

    def __init__(self, destination,globals_):
        self.destination = destination
        self.globals_ = globals_


    # Do something with the content of a file
    def extract_file(self, file_, ofile):
    	self.destination.addData(file_)
    	pass