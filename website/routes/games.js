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