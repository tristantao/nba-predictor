setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')

allNBA <- read.csv("analysis/joined.csv", header = TRUE, stringsAsFactors = FALSE)
allNBA$Date = as.Date(allNBA$Date, "%d-%m-%Y") #format: 17-04-2013

template = data.frame(Team1 = character(),
                      Team2 = character(),
                      Date = as.Date(character()),
                      Team1_Score = numeric(),
                      Team2_Score = numeric())

simpleAggr = getPerGameData(allNBA, template, aggrBasic)
simpleAggr$Team1 = as.character(simpleAggr$Team1)
simpleAggr$Team2 = as.character(simpleAggr$Team2)

lakers_score = c()
teamName = "LA Lakers"
lakers_subset = simpleAggr[simpleAggr$Team1==teamName | simpleAggr$Team2==teamName,]

for(i in 1:nrow(lakers_subset)) {
  row = lakers_subset[i,]
  if (row$Team1 == teamName) {
    lakers_score = c(lakers_score, row$Team1_Score)
  } else if(row$Team2 == teamName){
    lakers_score = c(lakers_score, row$Team2_Score)
  }
}

plot(lakers_score ~ lakers_subset$Date, type = 'h', main="Laker's points over time", lwd=10)


