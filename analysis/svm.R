setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')
source('analysis/prepare_features.R')

library(e1071)

########################
###Classify on Scores###
########################


train.svm.1 <- svm(ScoreDiff ~ Team1_win_last_6 + Team2_win_last_6 + Team1_away_win_percentage_10
                 + Team2_away_win_percentage_10 + Team1_avg_pnt_top_3_players_6 + Team2_avg_pnt_top_3_players_6,
                 data = train, type="C-classification", cross=10)

summary(train.svm.1)

p.hats.1 = predict(train.svm.1, newdata=test)
converted_p.hats = as.numeric(levels(p.hats.1)[p.hats.1])
mean ((converted_p.hats > 0) == test$Result, na.rm=TRUE)

########################
##Classify on Win/Loss##
########################

train.svm.2 <- svm(Result ~ Team1_win_last_6 + Team2_win_last_6 + Team1_away_win_percentage_10
                   + Team2_away_win_percentage_10 + Team1_avg_pnt_top_3_players_6 + Team2_avg_pnt_top_3_players_6,
                   data = train, type="C-classification", cross=10)

summary(train.svm.2)

p.hats.2 = predict(train.svm.2, newdata=test)
mean (p.hats.2 == test$Result, na.rm=TRUE)

