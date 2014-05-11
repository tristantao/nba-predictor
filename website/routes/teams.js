var db = require('../models')
var _ = require('underscore')
/*
 * GET teams listing.
 */

exports.index = function(req, res){
	db.teams.findAll({
		where: 'division is not NULL',
		order: 'division ASC'
	})
	.success(function(result) {
		res.render('teams', {
		  title: "Teams",
		  teams: result
		})
	});
};
exports.single = function(req, res){
	team_city = req.params.team_id
	db.sequelize.query("SELECT *,COUNT(*) as gp, AVG(points) as ppg,AVG(total_rebounds) as rpg,AVG(assists) as apg,AVG(steals) as spg,AVG(blocked_shots) as bpg,AVG(turnovers) as tos,AVG(fg_made) as fgm, AVG(fg_attempted) as fga, AVG(ft_made) as ftm, AVG(ft_attempted) as fta, AVG(3pt_made) as _3ptm, SUM(3pt_made) as fg3_total, AVG(3pt_attempted) as _3pta FROM teams, box_scores where box_scores.team = teams.team_city and game_date > '2013-10-20' and teams.team_city = '"+team_city+"' GROUP BY player_name ORDER BY ppg DESC;")
	.success(function(result) {
		console.log(result[0].logo)
		res.render('team_single', {
		  title: "Teams",
		  conference: result[0].conference,
		  division: result[0].division,
		  team_city: result[0].team_city,
		  team_name: result[0].team_name,
		  logo: result[0].logo,
		  ppg_totals: _.pluck(result,'ppg').reverse(),
		  apg_totals: _.pluck(result,'apg').reverse(),
		  player_names: _.pluck(result,'player_name').reverse(),
		  roster: result
		})
	});
};