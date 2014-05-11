var db = require('../models')
var _ = require('underscore')
var moment = require('moment')
/*
 * GET teams listing.
 */

exports.index = function(req, res){
	db.box_scores.findAll({
		limit: 100,
		group: 'game_id, team',
		order: 'game_date DESC'
	})
	.success(function(result) {
		// console.log(_.groupBy(result,'game_id'))
		result = _.map(result, function(entry){
			var gameDate = moment(entry.dataValues.game_date)

			return _.extend(entry, {'formattedGameDate':gameDate.format("MM-DD-YYYY")})
		})
		// console.log(result)
		res.render('games', {
		  title: "Games",
		  games: _.groupBy(result,'game_id')
		})
	});
};

exports.single = function(req, res){
	var gameId = req.params.game_id
	db.box_scores.findAll({
		where: "game_id = "+gameId
	})
	.success(function(result) {
		// console.log(_.groupBy(result,'game_id'))
		result = _.map(result, function(entry){
			var gameDate = moment(entry.dataValues.game_date)

			return _.extend(entry, {'formattedGameDate':gameDate.format("MM-DD-YYYY")})
		})

		var homeTeam = _.pluck(result,'team')[0];

		var homeData = _.filter(result, function(entry){

			return entry.team == homeTeam
		})
		var awayData = _.filter(result, function(entry){

			return entry.team != homeTeam
		})
		console.log(homeData[0].dataValues['steals'])
		res.render('games_single', {
		  title: "Game",
		  home_team: homeData[0].dataValues['team'],
		  away_team: awayData[0].dataValues['team'],
		  homeData: homeData,
		  awayData: awayData
		})
	});
};