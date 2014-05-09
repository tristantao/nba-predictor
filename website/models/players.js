module.exports = function(sequelize, DataTypes) {
  var Players = sequelize.define('box_scores', {
  	game_id: DataTypes.INTEGER,
    player_name: DataTypes.STRING,
    team: DataTypes.INTEGER
  },{
  	timestamps:false,
  	underscore:true,
  	freezeTableName:true
  }
  );

  return Players
}