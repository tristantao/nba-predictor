import sys
import os
from subprocess import Popen, PIPE

def run_model(team1, team2, date, model):
	'''
	runs the predictive model.
	1 means team1 wins, 0 means team1 loses (i.e. team2 wins)
	team1 should be the home team.
	date should be in format: yyyy-mm-dd i.e. 2014-05-06
	model should be either lm, svm, or nb. WARN: currently only lm works through the wrapper (but the others work through the main R code).
	'''
	script_loc = os.path.join(os.getcwd(), "model_new.R")

	command = "Rscript %s \"%s\" \"%s\" \"%s\" \"%s\"" % (script_loc, team1, team2, date, model)

	ret_vals = Popen(command, shell=True, stdout=PIPE).stdout.read().split()
	print "ret Vals: " + str(ret_vals)
	print "expected point spread: " +  ret_vals[-3]

	if len(ret_vals) > 0:
		result = ret_vals[-1]
	else:
		raise "unexpected ret_vals from Popen(Rscript [...])"

	if result not in ['1', '0']:
		raise "expected 1 or 0 from ret_vals"
	else:
		return result

if __name__ == "__main__":
	if len(sys.argv) != 5:
		raise "Need 4 Args"
	team1 = sys.argv[1]
	team2 = sys.argv[2]
	date = sys.argv[3]
	model = sys.argv[4]
	print run_model(team1, team2, date, model)