#!/usr/bin/env python3

from pymongo import MongoClient
import pandas as pd
import csv

conferences = pd.read_csv('../out-0205/conf-0205.csv',comment="#")
communities = pd.read_csv( "../communities.csv" )

for index, row in communities.iterrows():
    if 'conf' in row["PID"]:

    	c_id = int(row["PID"].replace("conf",''))

    	c_id = conferences[ conferences['CID'] == c_id ].index[0]
    	conferences.loc[c_id,'Community'] = row['Class']

conferences.to_csv("comcon.csv")

'''
# client = MongoClient('mongodb://localhost:27017/')
# db = client[ "out-0205" ]
# collection = db["CommunityTopics"]
with open('../comcon.csv', 'w') as csvfile:

    writer = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    writer.writerow(["Class", "CID", "Title"])

    for index, row in communities.iterrows():
        if 'conf' in row["PID"]:

            c_class = row['Class']
            c_id = int(row["PID"].replace("conf",''))
            c_ = conferences[ conferences['CID'] == c_id ]

            c_title = c_['Title'].values[0]
            c_themen = c_['Title'].values[0]
            c_epoche = c_['Title'].values[0]

            writer.writerow([c_class, c_id,c_title])
'''