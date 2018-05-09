#!/usr/bin/env python3

import pandas as pd
import urllib3
import time
import re
import os
import argparse, sys
import logging

from multiprocessing import Queue
from threading import Thread

class global_:

    tagger = None

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

    parser = None
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

    global_.parser = argparse.ArgumentParser(description='Extract information from HSK-HTML-File.')
    global_.parser.add_argument("-d", '--dummy',default=global_.config['dummy'], action="store_true", help='auto output')
    global_.parser.add_argument("-v",'--verbose',help='verbose output',action="store_true")
    global_.parser.add_argument('--connector', help='verbose output', default="CSV")
    global_.parser.add_argument('--extractor', help='verbose output', default="MetaPerson")
    global_.parser.add_argument('--threads',type=int,default=global_.config['num_threads'],help='number of threads output')
    global_.parser.add_argument('id', metavar='N', nargs="*", type=int ,help='ID of conference file')
    args,extra = global_.parser.parse_known_args()

    global_.args = args
    global_.config["dummy"] = args.dummy
    global_.config['verbose'] = args.verbose

    logging.basicConfig(datefmt='%I:%M:%S', format='[%(asctime)s] %(levelname)s in %(name)s: %(message)s',level=logging.INFO)

    # TODO: Extractor/Connector to add arguments

    # Get Extractor and his Connector
    module = __import__(args.extractor+"Extractor")
    extractor_class = getattr(module, args.extractor+"Extractor")
    
    #module_connector =  __import__(args.connector+"Connector")
    #connector_class = getattr(module, args.connector+"Connector")

    try:
        connector_class = getattr(module, "Connector"+args.connector)

        # Connector muss ich von Extractor-Klasse lösen
        # Beim Connector geht es um das speicher
        connector = connector_class()
        extractor =  extractor_class( connector, global_ )
    except AttributeError as e:
        print("Connector missing.")
        sys.exit()

    # Check for "Auto"-Argument
    if not args.id:

        threads = []
        files = Queue(maxsize=0)
        global_.config['num_threads'] = args.threads

        # TODO: Gegenstück "Reader" zum Connector einfügen: eine andere Datenquelle
        # 
        for filename in os.listdir( global_.config['indir'] ):
            files.put(filename)

        global_.todo += len(os.listdir( global_.config['indir']) )

        logging.info("Auto Mode")
        logging.info(str(global_.config['num_threads']) + " Threads")

        for i in range(1,global_.config['num_threads']):
            t = Thread(target=extractor.extract_information_thread, args=(files,i,))
            threads.append(t)

        [t.start() for t in threads]
        [t.join() for t in threads]

    else:
        logging.info("Normal Mode")

        global_.todo = len(args.id)

        for arg in args.id:
            extractor.extract_information(sys.argv[1]+".html")

    # Hier bräuchte ich einen Mechanismus, der die Daten der einzelnen Extractoren zusammenfügt
    # Pandas Join auf CID?
    # Jeder Extractor muss ein pandas-DataFrame zurückgeben
    if not global_.config['dummy']:
        connector.saveData()
