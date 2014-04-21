"""
This class represents box score objects obtained from Yahoo.com
Example: http://sports.yahoo.com/nba/san-antonio-spurs-dallas-mavericks-2014041006/

Class stores information about date, teams involved, and player statistics
"""

import sys
sys.path.insert(0, '../lib') # Add our common library folder

from bs4 import BeautifulSoup
import lib, sqlalchemy
from lib.dateutil import parser
from datetime import date,datetime

class YahooBoxScore(object):

	def __init__(self, raw_html, src, target_date=date.today()):
		bs_html = BeautifulSoup(raw_html)
		self.src = src
		self.game_date = target_date
		self.home_team = self.parseTeams(bs_html,side='home')
		self.away_team = self.parseTeams(bs_html,side='away')
		self.player_stats = self.parsePlayers(bs_html)
		self.game_type = self.getGameType(self.game_date)

	def parseTeams(self, bs_html, side='home'):
		team_html = bs_html.find('div',{'class':'team '+side})

		if team_html == None: # we mush change the div we look for based on winner
			team_html = bs_html.find('div',{'class':'team '+side+' winner'})
		
		team_name = team_html.find('div',{'class':'name'}).text
		return team_name

	def parsePlayers(self, bs_html):
		"""
		Input: BeautifulSoup object
		
		Output: List of dictionaries for the players
		Example: [{name: 'Tony Parker', team:'San Antonio',stats:{'Points':20, etc...}},..]
		"""
		# caution: there might be more than one 'yom-app full' div
		app_html = bs_html.find('div',{'class':'yom-app full'})
		score_data = app_html.findAll('div',{'class':'data-container'})

		away_team_stats = score_data[0].find('tbody')
		home_team_stats = score_data[1].find('tbody')

		away_rows = away_team_stats.findAll('tr')
		home_rows = home_team_stats.findAll('tr')

		players = self.handlePlayerRows(away_rows, self.away_team) + self.handlePlayerRows(home_rows, self.home_team)
		return players 
	
	def handlePlayerRows(self, stat_rows, team_name):
		"""
		Input: A list representing rows of player statistics

		Output: A list of dictionaries representing players
		Example: [{name: 'Tony Parker', team:'San Antonio',stats:{'Points':20, etc...}},..]
		"""
		player_list = []
		for player in stat_rows:
			player_name_html = player.find('th').find('a')
			
			if player_name_html == None:
				continue

			player_name = player_name_html.text

			csv_stats = {}

			for stat in player.findAll('td'):
				if len(player.findAll('td')) < 10: # break if we have less columns than needed
					break
				if not stat.has_attr('title'): # if we have a stat without a name
					break
				if 'dnp' in stat['class']:
					continue
				stat_name = stat['title']
				csv_stats[stat_name] = stat.text

			player_csv_stats = {'name':player_name,'team':team_name,'stats':csv_stats}

			if csv_stats != {}: # otherwise only include active players
				player_list.append(player_csv_stats)
		return player_list

	def getGameType(self, game_date):
		game_type = 'regular season'
		if game_date > date(2014,4,18):
			game_type = 'postseason' 
		elif game_date < date(2014,4,18) and game_date >= date(2013,10,28):
			game_type = "regular season"
		elif game_date < date(2013,10,28) and game_date >= date(2013,8,1):
			game_type = "preseason"
		elif game_date < date(2013,8,1) and game_date >= date(2013,4,19):
			game_type = 'postseason'
		elif game_date < date(2013,4,19) and game_date >= date(2013,10,28):
			game_type = "regular season"
		elif game_date < date(2012,10,27) and game_date >= date(2012,8,1):
			game_type = "preseason"
		elif game_date < date(2012,8,1) and game_date >= date(2012,4,25):
			game_type = 'postseason'
		elif game_date < date(2012,4,24) and game_date >= date(2011,11,24):
			game_type = "regular season"
		return game_type
	def uploadToDB(self,db):
		games = db['games']
		box_scores = db['box_scores']
		game_data = {
			'away_team':self.away_team,
			'home_team':self.home_team,
			'game_date':self.game_date
		}
		print "uploading box score record to DB"
		games.upsert(game_data,['away_team','home_team','game_date'],ensure=False)

		game_id = games.find_one(away_team=self.away_team,home_team=self.home_team, game_date=self.game_date)['game_id']
		for player in self.player_stats:
			fgm,fga = player['stats']['Field Goals'].split('-')
			ftm,fta = player['stats']['Free Throws'].split('-')
			three_a,three_m = player['stats']['Three Pointers'].split('-')

			box_data = {
				'game_id':game_id,
				'player_name':player['name'],
				'team':player['team'],
				'points':player['stats']['Points Scored'],
				'steals':player['stats']['Steals'],
				'assists':player['stats']['Assists'],
				'total_rebounds':player['stats']['Total Rebounds'],
				'def_rebounds':player['stats']['Defensive Rebounds'],
				'off_rebounds':player['stats']['Offensive Rebounds'],
				'blocked_shots':player['stats']['Blocked Shots'],
				'blocks_against':player['stats']['Blocks Against'],
				'plus_minus':player['stats']['Plus Minus'],
				'personal_fouls':player['stats']['Personal Fouls'],
				'turnovers':player['stats']['Turnovers'],
				'game_date':self.game_date,
				'fg_made':fgm,
				'fg_attempted':fga,
				'ft_made':ftm,
				'ft_attempted':fta,
				'3pt_made':three_m,
				'minutes_played':player['stats']['Minutes Played'],
				'3pt_attempted':three_a,
				'game_type':self.game_type,
				'last_updated': datetime.utcnow().isoformat()
			}
			box_scores.upsert(box_data,['game_id','player_name','team'],ensure=False)
