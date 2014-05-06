setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')

allNBA <- read.csv("analysis/joined.csv", header = TRUE, stringsAsFactors = FALSE)
allNBA$Date = as.Date(allNBA$Date, "%d-%m-%Y") #format: 17-04-2013

simpleAggr = getPerGameData(allNBA, simple_aggr_template, aggrBasic)
simpleAggr$Team1 = as.character(simpleAggr$Team1)
simpleAggr$Team2 = as.character(simpleAggr$Team2)

feature_vectors_template = simpleAggr #we'll be apending to this, so we'll make a copy

feature_vectors_template$Team1_win_last_6 = NA
feature_vectors_template$Team2_win_last_6 = NA

feature_vectors_template$Team1_away_win_percentage_10 = NA
feature_vectors_template$Team2_away_win_percentage_10 = NA

feature_vectors_template$Team1_avg_pnt_top_3_players_6 = NA
feature_vectors_template$Team2_avg_pnt_top_3_players_6 = NA

ptm <- proc.time()
feature_vectors = get_feature_vectors(feature_vectors_template)
proc.time() - ptm

feature_vectors$ScoreDiff = feature_vectors$Team1_Score - feature_vectors$Team2_Score
feature_vectors$Result = feature_vectors$ScoreDiff > 0

for (int_vector in names(feature_vectors)[-(c(1,2,3))]) {
  feature_vectors[[int_vector]] = as.numeric(feature_vectors[[int_vector]], na.rm=TRUE)
}
flip = runif(nrow(feature_vectors))
train = feature_vectors[flip <= .85,]
test = feature_vectors[flip > .85,]


