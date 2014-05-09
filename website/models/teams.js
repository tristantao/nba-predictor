module.exports = function(sequelize, DataTypes) {
  var Teams = sequelize.define('teams', {
  	team_id: DataTypes.INTEGER,
    team_city: DataTypes.STRING,
    team_name: DataTypes.STRING,
    logo: DataTypes.STRING,
    team_key: DataTypes.STRING,
    conference: DataTypes.STRING,
    division: DataTypes.STRING
  },{
  	timestamps:false,
  	underscore:true,
  	freezeTableName:true
  }
  );

  return Teams
}