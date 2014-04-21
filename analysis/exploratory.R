setwd('/Users/t-rex-Box/Desktop/work/nba-predictor/')
source('analysis/util.R')

allNBA <- read.csv("analysis/joined.csv", header = TRUE, stringsAsFactors = FALSE)
allNBA$Date = as.Date(allNBA$Date)

template = data.frame(Team1 = character(),
                         Team2 = character(),
                         Date = as.Date(character()),
                         Team1_Score = numeric(),
                         Team2_Score = numeric())

aggrBasic = function(dataframe, outputData) {
  #given a df we'll do a simple aggr
  #modifies the given outputData
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

simpleAggr = getPerGameData(allNBA, template, aggrBasic)
