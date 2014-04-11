"""
This file takes a link to a box score and parses it for date information,
team information, and player statistics. It also saves this information to
a csv file. 

"""

import sys
sys.path.insert(0, 'lib') # Add our common library folder

import lib, time, csv
from lib import requests
from bs4 import BeautifulSoup
from classes.YahooBoxScore import *

def flushStatsToCSV(player_stats, path):
	"""
	Arg stats has to be in the following format:
	Example: [{name: 'Tony Parker', team:'San Antonio',stats:{'Points':20, etc...}},..]
	"""

	with open(path, 'w') as csvfile:
		wr = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)


		csv_header = ['Player Name','Team']+sorted(player_stats[0]['stats'].keys(), key=lambda x: x[0])

		rows = [csv_header]
		for player in player_stats:
			row = sorted(player['stats'].items(), key=lambda x: x[0])

			sorted_values = [player['name'],player['team']]+[r[1] for r in row]
			rows.append(sorted_values)

		wr.writerows(rows)

TARGET_LINK = 'http://sports.yahoo.com/nba/san-antonio-spurs-dallas-mavericks-2014041006/'
SAVE_DIR = '../data/box_scores/'

print "[STATUS] Downloading {0}".format(TARGET_LINK)
r = requests.get(TARGET_LINK)

if(r.status_code != requests.codes.ok):
	print "ERROR: Request did not come back with OK status code"
	exit()

raw_html = r.text

box_score = YahooBoxScore(raw_html, TARGET_LINK)
home_team = box_score.home_team
away_team = box_score.away_team
game_date = box_score.game_date

print "Game Date: {0}".format(game_date.strftime('%c'))
print "{1} vs. {0}".format(away_team, home_team)


FILENAME = "{0}_vs_{1}_{2}.csv".format(away_team, home_team, game_date.strftime('%d-%m-%Y'))

RELATIVE_PATH = SAVE_DIR+FILENAME



print "[STATUS] Saving {0}".format(RELATIVE_PATH)

flushStatsToCSV(box_score.player_stats, RELATIVE_PATH)