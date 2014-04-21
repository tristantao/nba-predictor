"""
This file takes scrapes all the box scores for a given day

"""

import sys
sys.path.insert(0, 'lib') # Add our common library folder

import lib, time, csv,dataset
from lib import requests
from bs4 import BeautifulSoup
from classes.YahooBoxScore import *
from datetime import date,timedelta


from yahoo_box_score_scraper import scrapeGameLink

target_date = date(2013,4,8) # default is to scrape today's link
DAYS_BACK = 365


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

for i in range(DAYS_BACK): # loop back and scrape X day's worth of box scores
	TARGET_LINK = 'http://sports.yahoo.com/nba/scoreboard/?date={0}-{1}-{2}&conf='.format(target_date.strftime("%Y"),target_date.strftime("%m"),target_date.strftime("%d"))
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
		try:
			scrapeGameLink(game, SAVE_DIR, target_date)
		except AttributeError as e:
			print e
			print "Could no scrape link {0}".format(game)
			continue
	target_date = target_date-timedelta(days=1)