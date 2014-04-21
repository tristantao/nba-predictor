getPerGameData = function(mainData, outputData, customFunc) {
  #Given a team1 and team2, it'll pull all team level data.
  #customFunc should take in a dataframe and return an aggregated data.
  #outputData should have the same col names as what customFunc() outputs.
  team1 = ""
  team2 = ""
  date = "01-01-1900"
  last_index = 1
  master_index = 1
  while(master_index < nrow(allNBA)) {
    currentRow = allNBA[master_index,]
    if ((currentRow$Team1 != team1) ||
          (currentRow$Team2 != team2) ||
          (currentRow$Date) != date) {
      team1 = currentRow$Team1
      team2 = currentRow$Team2
      date = currentRow$Date
      #Get the chunk of data
      small_table = mainData[last_index:master_index-1,]
      outputData = customFunc(small_table, outputData)
      #Update Index
      last_index = master_index
      master_index = master_index + 1
    } else{ #Same data as before
      master_index = master_index + 1
    }
  }
  return (outputData)
}