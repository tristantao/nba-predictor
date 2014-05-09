setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/yhatConfig.R') ####This needs to be configured by the user
###############
###LM #########
###############
#source('analysis/lm.R')
model.require <- function() {
}
model.transform  <- function(df) {
  df$Team1_win_last_6 = as.numeric(df$Team1_win_last_6)
  df$Team2_win_last_6 = as.numeric(df$Team2_win_last_6)
  df$Team1_away_win_percentage_10 = as.numeric(df$Team1_away_win_percentage_10)
  df$Team2_away_win_percentage_10 = as.numeric(df$Team2_away_win_percentage_10)
  df$Team1_avg_pnt_top_3_players_6 = as.numeric(df$Team1_avg_pnt_top_3_players_6)
  df$Team2_avg_pnt_top_3_players_6 = as.numeric(df$Team2_avg_pnt_top_3_players_6)
  df
}
model.predict <- function(df) {
  p.hats = predict(train.glm, newdata=df)
  return (data.frame("result"=p.hats))
}

yhat.deploy ("nbaGLM")

yhat.predict(model_name="nbaGLM", test[1,])

predict.glm(train.glm, newdata = test[1,], type = "response")

############
#####SVM####
############
#source('analysis/svm.R')
model.require <- function() {
  library(e1071)
}
model.transform  <- function(df) {
  df$Team1_win_last_6 = as.numeric(df$Team1_win_last_6)
  df$Team2_win_last_6 = as.numeric(df$Team2_win_last_6)
  df$Team1_away_win_percentage_10 = as.numeric(df$Team1_away_win_percentage_10)
  df$Team2_away_win_percentage_10 = as.numeric(df$Team2_away_win_percentage_10)
  df$Team1_avg_pnt_top_3_players_6 = as.numeric(df$Team1_avg_pnt_top_3_players_6)
  df$Team2_avg_pnt_top_3_players_6 = as.numeric(df$Team2_avg_pnt_top_3_players_6)
  df
}
model.predict <- function(df) {
  p.hats = predict(train.svm.1, newdata=df)
  return (data.frame("result"=p.hats))
}
yhat.deploy ("nbaSVM")

yhat.svm.result = yhat.predict(model_name="nbaSVM", test)
yhat.svm.result
mean (yhat.svm.result == test$Result, na.rm=TRUE)
yhat.svm.result


############
#####NaiveBayes####
############
#source('analysis/naive_bayes.R')
model.require <- function() {
  library(e1071)
}
model.transform  <- function(df) {
  df$Team1_win_last_6 = as.numeric(df$Team1_win_last_6)
  df$Team2_win_last_6 = as.numeric(df$Team2_win_last_6)
  df$Team1_away_win_percentage_10 = as.numeric(df$Team1_away_win_percentage_10)
  df$Team2_away_win_percentage_10 = as.numeric(df$Team2_away_win_percentage_10)
  df$Team1_avg_pnt_top_3_players_6 = as.numeric(df$Team1_avg_pnt_top_3_players_6)
  df$Team2_avg_pnt_top_3_players_6 = as.numeric(df$Team2_avg_pnt_top_3_players_6)
  df
}
model.predict <- function(df) {
  p.hats = predict(train.nb.1, newdata=df)
  return (data.frame("result"=p.hats))
}
yhat.deploy ("nbaNaiveBayes")
nb_test = test #shouldn't be
yhat.nb.result = yhat.predict(model_name="nbaNaiveBayes", nb_test[18,])
yhat.nb.result.cleaned <- subset(yhat.nb.result, select = -c(1,length(yhat.nb.result)) )
mean (unlist(yhat.nb.result.cleaned) == nb_test$Result, na.rm=TRUE)
