setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')

allNBA <- read.csv("analysis/joined.csv", header = TRUE, stringsAsFactors = FALSE)
allNBA$Date = as.Date(allNBA$Date, "%d-%m-%Y") #format: 17-04-2013

prepLM = function(dataframe, outputData) { #LM PREP?
  if (nrow(dataframe) > 0) { #this should reflect template
    appendFrame = data.frame(Team1 = dataframe$Team1[1],
                             Team2 = dataframe$Team2[1],
                             Date = dataframe$Date[1],
                             Team1_Score = sum(dataframe$Points.Scored[dataframe$Team1 == dataframe$Team]),
                             Team2_Score = sum(dataframe$Points.Scored[dataframe$Team2 == dataframe$Team])
    )
    outputData = rbind(outputData, appendFrame)
  }
  return (outputData)
}

simpleAggr = getPerGameData(allNBA, simple_aggr_template, aggrBasic)

for (simple_index in 1:nrow(simpleAggr)){ 
  
}

simpleAggr$Team1 = as.character(simpleAggr$Team1)
simpleAggr$Team2 = as.character(simpleAggr$Team2)


"
Team1_win_withint_last_6
Team1_away_win_percentage
Team1_average_point_top_3_players


ins against teams against the tournament
away wins scaled by total number of away games

"

