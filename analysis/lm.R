setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')

allNBA <- read.csv("analysis/joined.csv", header = TRUE, stringsAsFactors = FALSE)
allNBA$Date = as.Date(allNBA$Date, "%d-%m-%Y") #format: 17-04-2013

simpleAggr = getPerGameData(allNBA, simple_aggr_template, aggrBasic)
simpleAggr$Team1 = as.character(simpleAggr$Team1)
simpleAggr$Team2 = as.character(simpleAggr$Team2)

feature_vectors = simpleAggr #we'll be apending to this, so we'll make a copy

feature_vectors$Team1_win_last_6 = NA
feature_vectors$Team2_win_last_6 = NA

feature_vectors$Team1_away_win_percentage_10 = NA
feature_vectors$Team2_away_win_percentage_10 = NA

feature_vectors$Team1_avg_pnt_top_3_players_6 = NA
feature_vectors$Team2_avg_pnt_top_3_players_6 = NA

days_win_percentage = function(data, team, away=FALSE) {
  #calculates the win percentage of a team over the last few days
  game_days = unique(data$Date)
  wins = 0
  for (day in game_days) {
    day_game_data = data[data$Date == day,]
    if (day_game_data$Team1[1] == team) { #first team
      if (score(day_game_data, team) > score(day_game_data, day_game_data$Team2[1])) {
        wins = wins + 1
      }
    } else if (day_game_data$Team2[1] == team) { #second team
      if (score(day_game_data, team) > score(day_game_data, day_game_data$Team1[1])) {
        wins = wins + 1
      }
    } else {
      print ("Unknown Game in days_win_percentage()")
    }
  }
  return (wins/length(game_days))
}

last_days_games = function(data, days, team, game_date) {
  #Given x and data, it'll return data from up to x days ago, regardless of data.
  #Data needs a $Team1, $Team2, and $Date column.
  #Usage: last_x_games(simpleAggr, 10, 'Utah', as.Date('2013-04-17'))
  sub_table = data[(data$Team1 == team |
                     data$Team2 == team) &
                     (data$Date - days) < game_date #look back 100 days
                   ,]
  sub_table = sub_table[with(sub_table, order(Date, decreasing=TRUE)), ]
  return (sub_table)
}

for (simple_index in 1:nrow(simpleAggr)){
  team1 = simpleAggr[simple_index,]$Team1
  team2 = simpleAggr[simple_index,]$Team1
  
  team1_sub_hist = last_days_games(allNBA,
                                70,
                                team1,
                                simpleAggr[simple_index,]$Date)
  team2_sub_hist = last_days_games(allNBA,
                                70,
                                team2,
                                simpleAggr[simple_index,]$Date)
  
  #CANT GET DATA FROM BOTH TEAM -____- Gotta manually attach it.
  
  team = days_win_percentage(team1_sub_hist, team1)
  days_win_percentage = days_win_percentage(team2_sub_hist, team2)
  
  days_win_percentage(team1_sub_hist, 'Utah'
                      )
  team1_custom_consolidated = NA
   
  team2_custom_consolidated = NA
  #feature_vectors = 
  
  print (head(team1_sub_hist))
  print (head(team2_sub_hist))
  break
}
"
feature_vectors$Team1_win_last_6 = NA
feature_vectors$Team2_win_last_6 = NA
feature_vectors$Team1_away_win_percentage_10 = NA
feature_vectors$Team2_away_win_percentage_10 = NA
feature_vectors$Team1_avg_pnt_top_3_players_6 = NA
feature_vectors$Team2_avg_pnt_top_3_players_6 = NA
"
#Do this after
#flip = runif(nrow(feature_vectors))
#train = feature_vectors[flip > .85,]
#test = feature_vectors[flip <= .85,]



"
Team1_win_withint_last_6
Team1_away_win_percentage
Team1_average_point_top_3_players


ins against teams against the tournament
away wins scaled by total number of away games

"


lm_generic_template = data.frame(Team1 = character(), #This will be used by both team1 and team2, so generic data points
                                 Team2 = character(),
                                 Team_Score = numeric(),
                                 Date = as.Date(character()),
                                 Team_win_last_6 = numeric(),
                                 Team_away_win_percentage_10 = numeric(),
                                 Team_avg_pnt_top_3_players_6 = numeric())


lm_feature_aggr = function(dataframe, outputData) {
  #Given a dataframe for a single game, returns the aggregated data that includes the features.
  if (nrow(dataframe) > 0) { #this should reflect template
    appendFrame = data.frame(Team1 = dataframe$Team1[1],
                             Team2 = dataframe$Team2[1],
                             Date = dataframe$Date[1],
                             Team1_Score = sum(dataframe$Points.Scored[dataframe$Team1 == dataframe$Team]),
                             Team2_Score = sum(dataframe$Points.Scored[dataframe$Team2 == dataframe$Team]),
                             Team_win_last_6 = sum(dataframe$Points.Scored[dataframe$Team1 == dataframe$Team]),
                             Team_away_win_percentage_10 = sum(dataframe$Points.Scored[dataframe$Team1 == dataframe$Team]),
                             Team_avg_pnt_top_3_players_6 = sum(dataframe$Points.Scored[dataframe$Team1 == dataframe$Team]))
    outputData = rbind(outputData, appendFrame)
  }
  return (outputData)
}
