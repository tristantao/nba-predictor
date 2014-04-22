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


last_x_games = function(data, x, team, game_date) {
  #Given x and data, it'll return data from up to x games ago, regardless of data.
  #Data needs a $Team1, $Team2, and $Date column
  sub_table = data[data$Team1 == team |
                     data$Team2 == team &
                     (data$Date > game_date + 100) #look back 100 days
    ,]
  sub_table = sub_table[with(sub_table, order(Date, decreasing=TRUE)), ]
  return (sub_table[1:x,])
}

last_x_games(simpleAggr, 10, 'Utah', as.Date('2013-04-17'))

for (simple_index in 1:nrow(simpleAggr)){ 
    
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

