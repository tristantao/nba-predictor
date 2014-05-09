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