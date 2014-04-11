"""
This file takes a link to a box score and parses it for date information,
team information, and player statistics. It also saves this information to
a csv file. 

"""

import sys
sys.path.insert(0, 'lib') # Add our common library folder

import lib
from lib import requests
from bs4 import BeautifulSoup
from classes.YahooBoxScore import *

TARGET_LINK = 'http://sports.yahoo.com/nba/san-antonio-spurs-dallas-mavericks-2014041006/'

r = requests.get(TARGET_LINK)

if(r.status_code != requests.codes.ok):
	print "ERROR: Request did not come back with OK status code"
	exit()

raw_html = r.text

box_score = YahooBoxScore(raw_html, TARGET_LINK)
print "Game Date: {0}".format(box_score.game_date)

print "{0} @ {1}".format(box_score.away_team, box_score.home_team)

print box_score.players
lib.interact()