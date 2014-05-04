setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')
source('analysis/prepare_features.R')

library(e1071)

nb_train = train
nb_test = test

nb_train$Team1_win_last_6 = round(nb_train$Team1_win_last_6, 1)
nb_train$Team2_win_last_6 = round(nb_train$Team2_win_last_6, 1)
nb_train$Team1_away_win_percentage_10 = round(nb_train$Team1_away_win_percentage_10, 1)
nb_train$Team2_away_win_percentage_10 = round(nb_train$Team2_away_win_percentage_10, 1)
nb_train$Team1_avg_pnt_top_3_players_6 = round(nb_train$Team1_avg_pnt_top_3_players_6, 2)
nb_train$Team2_avg_pnt_top_3_players_6 = round(nb_train$Team2_avg_pnt_top_3_players_6, 2)

nb_test$Team1_win_last_6 = round(nb_test$Team1_win_last_6, 1)
nb_test$Team2_win_last_6 = round(nb_test$Team2_win_last_6, 1)
nb_test$Team1_away_win_percentage_10 = round(nb_test$Team1_away_win_percentage_10, 1)
nb_test$Team2_away_win_percentage_10 = round(nb_test$Team2_away_win_percentage_10, 1)
nb_test$Team1_avg_pnt_top_3_players_6 = round(nb_test$Team1_avg_pnt_top_3_players_6, 2)
nb_test$Team2_avg_pnt_top_3_players_6 = round(nb_test$Team2_avg_pnt_top_3_players_6, 2)

train.nb.1 <- naiveBayes(Result ~ Team1_win_last_6 + Team2_win_last_6 + Team1_away_win_percentage_10
                   + Team2_away_win_percentage_10 + Team1_avg_pnt_top_3_players_6
                   + Team2_avg_pnt_top_3_players_6, data = nb_test)

summary(train.nb.1)

p.hats.nb = predict(train.nb.1, nb_test, na.rm=TRUE)
mean (p.hats.nb == nb_test$Result, na.rm=TRUE)


