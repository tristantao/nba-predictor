var db = require('../models')
var _ = require('underscore')
var moment = require('moment')

/*
 * GET teams listing.
 */

exports.index = function(req, res){
	db.sequelize.query("SELECT DISTINCT player_name, team,AVG(points) as avg_points, AVG(assists) as avg_assists,AVG(total_rebounds) as avg_rebounds,logo FROM box_scores, teams WHERE teams.team_city = box_scores.team GROUP BY player_name ORDER BY avg_points DESC;")
	.success(function(result) {
		console.log(result)
		res.render('players', {
		  title: "NBA Players",
		  players: result
		})
	});
};

exports.single = function(req, res){	
	name_param = req.params.player_id
	db.sequelize.query("SELECT * FROM box_scores, teams WHERE box_scores.player_name = '"+name_param+"' AND box_scores.team = teams.team_city ORDER BY game_date DESC LIMIT 100;")
	.success(function(result) {

		result = _.map(result, function(entry){
			var gameDate = moment(entry.game_date)

			return _.extend(entry, {'formattedGameDate':gameDate.format("MMM D, YYYY")})
		})
		console.log(result[0])
		res.render('players_single', {
		  title: "NBA Players",
		  player_name: result[0].player_name,
		  conference: result[0].conference,
		  division: result[0].division,
		  team_city: result[0].team_city,
		  team_name: result[0].team_name,
		  team_logo: result[0].logo,
		  player_info: result
		})
	});
};