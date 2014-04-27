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
  #first, get data from last x games. @TODO make sure enough data.
  team1_sub_hist = last_days_games(allNBA,
                                100,
                                simpleAggr[simple_index,]$Team1,
                                simpleAggr[simple_index,]$Date)
  team2_sub_hist = last_days_games(allNBA,
                                200,
                                simpleAggr[simple_index,]$Team2,
                                simpleAggr[simple_index,]$Date)
  
  #CANT GET DATA FROM BOTH TEAM -____- Gotta manually attach it.
  team1_custom_consolidated = NA
    #getPerGameData(team1_sub_hist, lm_generic_template, lm_feature_aggr, lookback=1) #6? hmm
  team2_custom_consolidated = NA
    #getPerGameData(team2_sub_hist, lm_generic_template, lm_feature_aggr, lookback=1) #6? hmm
  #feature_vectors = 
  #simpleAggr = getPerGameData(allNBA, template, aggrBasic)
  print (head(team1_sub_hist))
  print (head(team2_sub_hist))
  break
}


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
