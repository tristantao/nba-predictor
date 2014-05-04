setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')
source('analysis/prepare_features.R')


train.glm <- glm(ScoreDiff ~ Team1_win_last_6 + Team2_win_last_6 + Team1_away_win_percentage_10
                 + Team2_away_win_percentage_10 + Team1_avg_pnt_top_3_players_6 + Team2_avg_pnt_top_3_players_6,
                data = train)

summary(train.glm)

p.hats <- predict.glm(train.glm, newdata = test, type = "response")

mean ((p.hats > 0) == test$Result, na.rm=TRUE)

