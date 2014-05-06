library(yhatr)

#print (path.expand("~/Desktop/work/nba-preditor/"))

setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')

############
## TO DO  ##
############
source('analysis/yhatConfig.R') #This must be set with your own credential
############################
############################

args<-commandArgs(TRUE)
#USAGE Rscript model_new.R team1 team2 date model

team1 = args[1]
team2 = args[2]
today = as.Date(args[3])
model_option = args[4]

print (team1)
print (team2)
print (today)
print (model_option)
  
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

if (model_option == 'lm') {
  result = yhat.predict(model_name="nbaGLM", test[1,])
} else if(model_option == 'svm') {
  result = yhat.predict(model_name="nbaSVM", test)
} else if(model_option == 'nb') {
  yhat.nb.result = yhat.predict(model_name="nbaNaiveBayes", nb_test)
  result <- subset(yhat.nb.result, select = -c(1,length(yhat.nb.result)) )
} else {
  print ("Invalid Model Selection")
}

load("mem_content.RData")
#############
#########
################
