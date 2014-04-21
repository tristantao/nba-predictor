setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')

allNBA <- read.csv("analysis/joined.csv", header = TRUE, stringsAsFactors = FALSE)
allNBA$Date = as.Date(allNBA$Date, "%d-%m-%Y") #format: 17-04-2013

template = data.frame(Team1 = character(),
                      Team2 = character(),
                      Date = as.Date(character()),
                      Team1_Score = numeric(),
                      Team2_Score = numeric())
#Last month's histroy for both side
"
Team1_win_withint_last_6
Team1_away_win_percentage
Team1_average_point_top_3_players


ins against teams against the tournament
away wins scaled by total number of away games

"

