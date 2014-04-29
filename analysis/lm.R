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

feature_vectors = get_feature_vectors(simpleAggr, feature_vectors)


#Do this after
feature_vectors$ScoreDiff = feature_vectors$Team1_Score - feature_vectors$Team2_Score
feature_vectors$Result = feature_vectors$ScoreDiff > 0

flip = runif(nrow(feature_vectors))
train = feature_vectors[flip <= .85,]
test = feature_vectors[flip > .85,]

train.glm <- glm(ScoreDiff ~ Team1_win_last_6 + Team2_win_last_6 + Team1_away_win_percentage_10
                 + Team2_away_win_percentage_10 + Team1_avg_pnt_top_3_players_6 + Team2_avg_pnt_top_3_players_6,
                data = train)

summary(train.glm)

p.hats <- predict.glm(train.glm, newdata = test, type = "response")

win_loss <- vector()
ScoreDiff
mean ((p.hats > 0) == test$Result, na.rm=TRUE)

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
