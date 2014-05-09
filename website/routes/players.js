var db = require('../models')
var _ = require('underscore')

/*
 * GET teams listing.
 */

exports.index = function(req, res){
	db.sequelize.query("SELECT DISTINCT player_name, team,AVG(points) as avg_points, AVG(assists) as avg_assists,AVG(total_rebounds) as avg_rebounds,logo FROM box_scores, teams WHERE teams.team_city = box_scores.team GROUP BY player_name ORDER BY avg_points DESC LIMIT 100;")
	.success(function(result) {
		console.log(result)
		res.render('players', {
		  title: "NBA Players",
		  players: result
		})
	});
};