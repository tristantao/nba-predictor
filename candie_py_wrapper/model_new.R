source('analysis/util.R')

team1 = "Toronto"
team2 = "New York"
today = as.Date("2014-05-06")
model_option = "lm"
  
allNBA <- read.csv("analysis/joined.csv", header = TRUE, stringsAsFactors = FALSE)
allNBA$Date = as.Date(allNBA$Date, "%d-%m-%Y") #format: 17-04-2013

simpleAggrNewSkeleton = data.frame(Team1 = team1,
                                  Team2 = team2,
                                  Date = today,
                                  Team1_Score = 0,
                                  Team2_Score = 0)

feature_vectors_template = simpleAggrNewSkeleton #we'll be apending to this, so we'll make a copy
feature_vectors_template$Team1_win_last_6 = NA
feature_vectors_template$Team2_win_last_6 = NA
feature_vectors_template$Team1_away_win_percentage_10 = NA
feature_vectors_template$Team2_away_win_percentage_10 = NA
feature_vectors_template$Team1_avg_pnt_top_3_players_6 = NA
feature_vectors_template$Team2_avg_pnt_top_3_players_6 = NA

temp = get_feature_vectors(feature_vectors_template)


load("mem_content.RData")
#############
#########
################
