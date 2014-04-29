simple_aggr_template = data.frame(Team1 = character(),
                                  Team2 = character(),
                                  Date = as.Date(character()),
                                  Team1_Score = numeric(),
                                  Team2_Score = numeric())

score = function(data, team) {
  #given a subset data of allNBA, return the score in a game
  return (sum(data$Points.Scored[data$Team == team]))
}


aggrBasic = function(dataframe, outputData) {
  #given a df we'll do a simple aggr
  #modifies the given outputData
  if (nrow(dataframe) > 0) { #this should reflect template
    appendFrame = data.frame(Team1 = dataframe$Team1[1],
                             Team2 = dataframe$Team2[1],
                             Date = dataframe$Date[1],
                             Team1_Score = sum(dataframe$Points.Scored[dataframe$Team1 == dataframe$Team]),
                             Team2_Score = sum(dataframe$Points.Scored[dataframe$Team2 == dataframe$Team])
    )
    outputData = rbind(outputData, appendFrame)
  }
  return (outputData)
}


getPerGameData = function(mainData, outputData, customFunc, lookback=1) {
  #Given a team1 and team2, it'll pull all team level data.
  #customFunc should take in a dataframe and return an aggregated data.
  #outputData should have the same col names as what customFunc() outputs.
  team1 = ""
  team2 = ""
  date = "01-01-1900"
  last_index = 1
  master_index = 1
  current_lookback = 1
  while(master_index < nrow(allNBA)) {
    currentRow = allNBA[master_index,]
    if ((currentRow$Team1 != team1) ||
          (currentRow$Team2 != team2) ||
          (currentRow$Date) != date) {
      if (current_lookback <= lookback) { #not yet
        current_lookback = current_lookback + 1
        next
      }
      current_lookback = 1 #reset lookback since we're doing stuff
      team1 = currentRow$Team1
      team2 = currentRow$Team2
      date = currentRow$Date
      #Get the chunk of data
      small_table = mainData[last_index:master_index-1,]
      outputData = customFunc(small_table, outputData)
      #Update Index
      last_index = master_index
      master_index = master_index + 1
    } else{ #Same data as before
      master_index = master_index + 1
    }
  }
  return (outputData)
}
###############################
########Feature Functions######
###############################

subset_by_trailing = function(data, days) {
  "
  given a dataset, only returns the data that occured within the last days.
  @expects a $Date column
  "
  if (days > 0 && length(data) > 0) {
    most_recent_date = max(data$Date)
    #print (most_recent_date)
    #print (dim(data))
    data = data[(data$Date + days) > most_recent_date,] #get the dates up to last days, no bound on future
    #print (dim(data))
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

top_x_players_stats = function(data, team, top_x, stats=c('Points.Scored') ,days=-1) {
  # Returns the stats from the top x players from the specified team
  # players are ranked by the points scored.
  data = subset_by_trailing(data, days)
  game_days = unique(data$Date)
  total_games = length(game_days)
  
  cum_sum_stats = unlist(lapply(stats, function(x){0})) #weird way to keep a running average
  for (day in game_days) {
    day_game_data = data[data$Date == day & data$Team == team,] #single game data for the team
    sorted_player_stat = day_game_data[with(day_game_data, order(Points.Scored, decreasing=TRUE)), ]
    #print (sorted_player_stat)
    for (index in 1:length(stats)) {
      stats_name = stats[index]
      cum_sum_stats[index] = cum_sum_stats[index] + sum(sorted_player_stat[1:top_x, stats_name])
    }
  }
  cum_sum_stats = cum_sum_stats/top_x/total_games
  return (cum_sum_stats)
}
#team1_top_players_stats = top_x_players_stats(team1_sub_hist, team1, top_x=3, stats=c('Points.Scored'), days=-1)
#team1_top_players_stats

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

get_feature_vectors = function(simpleAggr, feature_vectors, score_look_back=c(70,70,70,-1)) {
  print ("Generating Features")
  ptm <- proc.time()
  for (simple_index in 1:nrow(simpleAggr)){
    team1 = simpleAggr[simple_index,]$Team1
    team2 = simpleAggr[simple_index,]$Team2
    game_date = simpleAggr[simple_index,]$Date
    team1_sub_hist = last_days_games(allNBA,
                                     score_look_back[1],
                                     team1,
                                     game_date)
    team2_sub_hist = last_days_games(allNBA,
                                     score_look_back[1],
                                     team2,
                                     game_date)
    team1_percentage = days_win_percentage(team1_sub_hist, team1, days=score_look_back[2])
    team2_percentage = days_win_percentage(team2_sub_hist, team2, days=score_look_back[2])
    
    team1_away_percentage = days_win_percentage(team1_sub_hist, team1, days=score_look_back[3], away=TRUE)
    team2_away_percentage = days_win_percentage(team2_sub_hist, team2, days=score_look_back[3], away=TRUE)
    
    team1_top_players_stats = top_x_players_stats(team1_sub_hist, team1, top_x=3, stats=c('Points.Scored'),
                                                  days=score_look_back[4])
    team2_top_players_stats = top_x_players_stats(team2_sub_hist, team2, top_x=3, stats=c('Points.Scored'),
                                                  days=score_look_back[4])
    feature_vectors$Team1_win_last_6[simple_index] = team1_percentage
    feature_vectors$Team2_win_last_6[simple_index] = team2_percentage
    feature_vectors$Team1_away_win_percentage_10[simple_index] = team1_away_percentage
    feature_vectors$Team2_away_win_percentage_10[simple_index] = team2_away_percentage
    feature_vectors$Team1_avg_pnt_top_3_players_6[simple_index] = team1_top_players_stats
    feature_vectors$Team2_avg_pnt_top_3_players_6[simple_index] = team2_top_players_stats
  }
  proc.time() - ptm
  return (feature_vectors)
}