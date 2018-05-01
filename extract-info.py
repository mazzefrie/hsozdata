#!/usr/bin/env python3

import pandas as pd
import urllib3
import time
import re
import requests
import os
import argparse, sys
import pickle
from multiprocessing import Queue
from threading import Thread

class global_:

    tagger = False

    config = {

        "verbose": False,
        "batch": False,
        "dummy": False,
        "num_threads": 6,
        "mongodb": {
            "user": "root",
            "pass": "secret"
        },
        'indir': '../data',
        'outdir': '../out'
    }

    args = False
    todo = False
    done = False
    error = 0

    def file_done(job, success):

        global_.done += 1
        msg = "\033[0;32mDone!\033[0;0m"
        if not success:
            global_.error += 1
            msg = "\033[1;31mError!\033[0;0m"

        str_ = "\033[94m{job_}:\033[0;0m {msg_} ({done_} / {todo_} , \033[1;31mErrors: {error_}\033[0;0m )".format( job_=job, todo_=global_.todo, done_=global_.done, error_=global_.error,msg_=msg )

        if global_.config['batch']:
            print( str_ )
        else:
            sys.stdout.write( "\r"+str_ )


if __name__ == '__main__':

    parser = argparse.ArgumentParser(description='Extract information from HSK-HTML-File.')
    parser.add_argument("-d", '--dummy',default=global_.config['dummy'], action="store_true", help='auto output')
    parser.add_argument("-v",'--verbose',help='verbose output',action="store_true")
    parser.add_argument('--connector', help='verbose output', default="CSV")
    parser.add_argument('--extractor', help='verbose output', default="MetaPerson")
    parser.add_argument('--threads',type=int,default=global_.config['num_threads'],help='number of threads output')
    parser.add_argument('id', metavar='N', nargs="*", type=int ,help='ID of conference file')
    args,extra = parser.parse_known_args()

    global_.args = args
    global_.config["dummy"] = args.dummy
    global_.config['verbose'] = args.verbose

    # TODO: Extractor/Connector to add arguments
    # parser.add_argument('--test',type=int,help='number of threads output')
    # args,extra = parser.parse_known_args()

    # Get Extractor and his Connector
    module = __import__(args.extractor+"Extractor")
    extractor_class = getattr(module, args.extractor+"Extractor")
    connector_class = getattr(module, "Connector"+args.connector)

    connector = connector_class()
    extractor =  extractor_class( connector, global_ )

    # Check for "Auto"-Argument
    if not args.id:

        threads = []
        files = Queue(maxsize=0)
        global_.config['num_threads'] = args.threads

        for filename in os.listdir( global_.config['indir'] ):
            files.put(filename)

        global_.todo += len(os.listdir( global_.config['indir']) )

        print("Auto Mode")
        print(str(global_.config['num_threads']) + " Threads")

        for i in range(1,global_.config['num_threads']):
            t = Thread(target=extractor.extract_information_thread, args=(files,i,))
            threads.append(t)

        [t.start() for t in threads]
        [t.join() for t in threads]

    else:
        print("Normal Mode")

        global_.todo = len(args.id)

        for arg in args.id:
            extractor.extract_information(sys.argv[1]+".html")

    if not global_.config['dummy']:
        connector.saveData()
