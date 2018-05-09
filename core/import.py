#!/usr/bin/env python3

'''
Kopiere als CSV-Dateien in eine MongoDB-Datenbank
'''

from pymongo import MongoClient
import pandas as pd
import sys
import glob
import json
import os

class global_:

    config = {
    	'db' : {
    		'login':'',
    		'pw':'',
    		'database':''
    	}
    }

def toDB(filename,db):

	with open(filename,'r') as f:
		first_line = f.readline()

		data_meta = first_line.replace("#",'').replace("\n",'').split(",")
		data_type = data_meta[0]
		data_full = data_meta[1]
		# Check: Is full or partial?

		data = pd.read_csv(filename,comment="#")
		records = json.loads(data.T.to_json()).values()

		if 'Full' in data_full:
			print("Full Dataset")

			if data_type in db.collection_names():
				print("Dropping old data")
				db[ data_type ].drop()

			print("Adding " + data_type)
			db[ data_type ].insert(records)


if __name__ == '__main__':

	arguments = sys.argv[1:]

	data = arguments[0]

	if not arguments[0]:
		print("No directory or file specified")

	client = MongoClient('mongodb://localhost:27017/')

	if os.path.isfile(arguments[0]):
		
		if not arguments[1]:
			print("When importing a single file, you must specifiy a collection name")
			sys.exit(0)

		db = client["out-0205"]

		print("Import Single File")
		toDB(data,db)
	else:	
		
		db = client[ 
					data.split("/")[-1] \
						.replace(".csv",'') 
		]

		for filename in glob.glob( data +"/*.csv" ):
			toDB(filename,db)
			

		



