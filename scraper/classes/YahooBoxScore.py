"""
This class represents box score objects obtained from Yahoo.com
Example: http://sports.yahoo.com/nba/san-antonio-spurs-dallas-mavericks-2014041006/

Class stores information about date, teams involved, and player statistics
"""

import sys
sys.path.insert(0, '../lib') # Add our common library folder

from bs4 import BeautifulSoup
import lib

class YahooBoxScore(object):

	def __init__(self, raw_html, src):
		bs_html = BeautifulSoup(raw_html)
		self.src = src
		self.game_date = self.parseDate(bs_html)
		self.home_team = self.parseTeams(bs_html,side='home')
		self.away_team = self.parseTeams(bs_html,side='away')
		self.players = self.parsePlayers(bs_html)

	def parseDate(self, bs_html):

		game_year = self.src[-11:-7] # this is really hacky, basically stripping the url for the year

		nav = bs_html.find('ul',{'class':'nav-list final'})
		game_date = nav.find('li',{'class':'left'}).text
		return ' '.join([game_date,game_year])

	def parseTeams(self, bs_html, side='home'):
		team_html = bs_html.find('div',{'class':'team '+side})

		if team_html == None: # we mush change the div we look for based on winner
			team_html = bs_html.find('div',{'class':'team '+side+' winner'})
		
		team_name = team_html.find('div',{'class':'name'}).text
		return team_name

	def parsePlayers(self, bs_html):
		# caution: there might be more than one 'yom-app full' div
		app_html = bs_html.find('div',{'class':'yom-app full'})
		score_data = app_html.findAll('div',{'class':'data-container'})

		away_team_stats = score_data[0].find('tbody')
		home_team_stats = score_data[1].find('tbody')

		players = []
		for player in away_team_stats.findAll('tr'):
			player_name_html = player.find('th').find('a')
			
			if player_name_html == None:
				continue

			player_name = player_name_html.text
			
			stats = {'status':'active'}
			for stat in player.findAll('td'):
				if 'dnp' in stat['class']:
					stats['status'] = stat['title']
					continue
				stats[stat['title']] = stat.text

			player_stats = {'name':player_name,'stats':stats}
			players.append(player_stats)
		return players