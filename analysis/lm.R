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

subset_by_trailing = function(data, days) {
  "
  given a dataset, only returns the data that occured within the last days.
  @expects a $Date column
  "
  if (days > 0) {
    most_recent_date = max(data$Date)
    print (most_recent_date)
    print (dim(data))
    data = data[(data$Date + days) > most_recent_date,] #get the dates up to last days, no bound on future
    print (dim(data))
  }
  return (data)
}

days_win_percentage = function(data, team, days=-1, away=FALSE) {
  #calculates the win percentage of a team over the last few days
  if (away) { data = data[data$Team2==team,] } #only calculate away data
  data = subset_by_trailing(data, days)
  game_days = unique(data$Date)

  wins = 0
  for (day in game_days) {
    day_game_data = data[data$Date == day,]
    if (day_game_data$Team1[1] == team) { #first team
      if (score(day_game_data, team) > score(day_game_data, day_game_data$Team2[1])) { wins = wins + 1}
    } else if (day_game_data$Team2[1] == team) { #second team
      if (score(day_game_data, team) > score(day_game_data, day_game_data$Team1[1])) { wins = wins + 1}
    } else {
      print ("Unknown Game in days_win_percentage()")
    }
  }
  return (wins/length(game_days))
}

top_x_players = function(data, team, top_x, stats=c('Points.Scored') ,days=-1) {
  # Returns the stats from the top x players from the specified team
  # players are ranked by the points scored.
  data = subset_by_trailing(data, days)
  game_days = unique(data$Date)
  total_games = length(game_days)
  
  cum_sum_stats = unlist(lapply(stats, function(x){0})) #weird way to keep a running average

  for (day in game_days) {
    day_game_data = data[data$Date == day & data$Team == team,] #single game data for the team
    sorted_player_stat = day_game_data[with(sub_table, order(Points.Scored, decreasing=TRUE)), ]
    for (index in 1:length(stats)) {
      stats_name = stats[index]
      cum_sum_stats[index] = cum_sum_stats[index] + sum(sorted_player_stat$stat_name[1:top_x])
    }
    cum_sum_stats = cum_sum_stats/top_x 
    return (cum_sum_stats)
  }
}

last_days_games = function(data, days, team, game_date) {
  #Given x and data, it'll return data from up to x days ago, regardless of data.
  #Data needs a $Team1, $Team2, and $Date column.
  #Usage: last_days_games(simpleAggr, 10, 'Utah', as.Date('2013-04-17'))
  sub_table = data[((data$Team1 == team |
                     data$Team2 == team) &
                     (data$Date + days) >= game_date  & data$Date < game_date) #date bound, [days ago, today)
                   ,]
    #  data[(data$Date + days) > most_recent_date,]
    #(data$Date + days) > most_recent_date
  sub_table = sub_table[with(sub_table, order(Date, decreasing=TRUE)), ]
  return (sub_table)
}

for (simple_index in 1:nrow(simpleAggr)){
  simple_index = 1000
  team1 = simpleAggr[simple_index,]$Team1
  team2 = simpleAggr[simple_index,]$Team2
  game_date = simpleAggr[simple_index,]$Date
  
  team1_sub_hist = last_days_games(allNBA,
                                70,
                                team1,
                                game_date)
  team2_sub_hist = last_days_games(allNBA,
                                70,
                                team2,
                                game_date)

  #CURRENT ONLY 10 WEEKS
  team1_percentage = days_win_percentage(team1_sub_hist, team1, days=70)
  team2_percentage = days_win_percentage(team2_sub_hist, team2, days=70)

  team1_away_percentage = days_win_percentage(team1_sub_hist, team1, days=70, away=TRUE)
  team2_away_percentage = days_win_percentage(team2_sub_hist, team2, days=70, away=TRUE)

  appendFrame = data.frame(Team1 = dataframe$Team1[1],
                           Team2 = dataframe$Team2[1],
                           Date = dataframe$Date[1],
                           Team1_Score = sum(dataframe$Points.Scored[dataframe$Team1 == dataframe$Team]),
                           Team2_Score = sum(dataframe$Points.Scored[dataframe$Team2 == dataframe$Team]),
                           feature_vectors$Team1_win_last_6 = team1_percentage,
                           feature_vectors$Team2_win_last_6 = team2_percentage,
                           feature_vectors$Team1_away_win_percentage_10 = team1_away_percentage,
                           feature_vectors$Team2_away_win_percentage_10 = team2_away_percentage,
                           feature_vectors$Team1_avg_pnt_top_3_players_6 = NA,
                           feature_vectors$Team2_avg_pnt_top_3_players_6 = NA
  )

  feature_vectors = rbind(feature_vectors, appendFrame)
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
