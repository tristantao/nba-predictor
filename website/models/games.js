module.exports = function(sequelize, DataTypes) {
  var Games = sequelize.define('box_scores', {
  	game_id: DataTypes.INTEGER,
    team: DataTypes.STRING,
    points: DataTypes.INTEGER,
    game_date: DataTypes.DATE
  },{
  	timestamps:false,
  	underscore:true,
  	freezeTableName:true
  }
  );

  return Games
}