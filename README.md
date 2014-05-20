NBA Predictor
======================================
Final project for CS194 (Intro to Data Science). Model for predicting NBA team performance.

Instructions For Scraping Data
-------
Run the command with a link to a Yahoo NBA Box Score, such as http://sports.yahoo.com/nba/philadelphia-76ers-toronto-raptors-2014040928/

	python yahoo_box_score_scraper.py <url>
	
	
	
Instructions for Setting Up Models
-------
In analysis/ folder, set up the yhat config file as follows:
```R
setwd('path to root dir of this repo')
source('analysis/yhatConfig.R')
yhat.config  <- c(
    username="your username",
    apikey="your api key here",
    env="http://sandbox.yhathq.com/"
)
```
To setup the Linear Model, in R, run lm.R by sourcing it.<br>
Afterwards, go to deploy.R and run the segment on lm.

Similarly for SVM, source svm.R <br>
To deploy run the relevant segment in deploy.R

Similarly for NaiveBayes, source naive_bayes.R <br> 
To deploy use the relevant segment in deploy.R


Python Wrapper (in _candie\_py\_wrapper/_)
-------

The python wrapper is in the aforementioned folder. 

You can call it via terminal:
```bash
python predict_game.py "New York" "Toronto" "2014-05-06" "lm"
#param: team1 team2 date model_used
#team1 is the expected home team.
```
You can also import _predict_game.py_ and call the predict\_game.run\_model(...) to use it to better interate.








