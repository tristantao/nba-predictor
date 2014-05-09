var db = require('../models')
var _ = require('underscore')
var request = require('request')
var moment = require('moment')
/*
 * GET home page.
 */

exports.index = function(req, res){

	var team1 = req.query.team1
	var team2 = req.query.team2
	var model = req.query.model

	if(!(team1 && team2 && model)){
		db.teams.findAll({
			where: 'division is not NULL',
			order: 'team_name ASC'
		})
		.success(function(result) {
			res.render('model', {
			  title: "NBA Prediction Model",
			  teams: result
			})
		});
	} else { // params not empty
		var now = moment().format("YYYY-MM-DD")
		url = "http://54.193.35.49/b/api?team1="+team1+"&team2="+team2+"&date="+now+"&model="+model
		console.log("requesting "+url)
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
		        var info = JSON.parse(body)
		        console.log(info)
				db.teams.findAll({
					where: 'division is not NULL',
					order: 'team_name ASC'
				})
				.success(function(result) {
					res.render('model', {
					  title: "NBA Prediction Model",
					  teams: result,
					  team1: team1,
					  team2: team2,
					  model: model,
					  prediction: info.result
					})
				});
		    } else {
		    	db.teams.findAll({
					where: 'division is not NULL',
					order: 'team_name ASC'
				})
				.success(function(result) {
					res.render('model', {
					  title: "NBA Prediction Model",
					  teams: result,
					  team1: team1,
					  team2: team2,
					  model: model,
					  prediction: "Error"
					})
				});
		    }

		});

	}

};