"""
This file takes scrapes all the box scores for a given day

"""

import sys
sys.path.insert(0, 'lib') # Add our common library folder

import lib, time, csv
from lib import requests
from bs4 import BeautifulSoup
from classes.YahooBoxScore import *

from yahoo_box_score_scraper import scrapeGameLink
def findAllGames(html):
	"""
	Input: raw html of a daily nba page on yahoo.
	Example: 'http://sports.yahoo.com/nba/scoreboard/?date=2014-04-09&conf='

	Output: list of urls for individual box scores
	"""
	bs = BeautifulSoup(html)
	main_div = bs.find('div',{'id':'mediasportsscoreboardgrandslam'})

	games = main_div.findAll('tr',{'class':'game link'})

	yahoo_prefix = "http://sports.yahoo.com"

	game_links = [yahoo_prefix + g.find('a')['href'] for g in games]
	return game_links

TARGET_LINK = 'http://sports.yahoo.com/nba/scoreboard/?date=2014-04-09&conf='
SAVE_DIR = '../data/box_scores/'

print "[STATUS] Downloading {0}".format(TARGET_LINK)
r = requests.get(TARGET_LINK)

if(r.status_code != requests.codes.ok):
	print "ERROR: Request did not come back with OK status code"
	exit()

raw_html = r.text

game_links = findAllGames(raw_html)
print "[Status] Found {0} games to scrape".format(len(game_links))

for game in game_links:
	scrapeGameLink(game, SAVE_DIR)