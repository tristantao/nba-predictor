import sys
import os
from subprocess import Popen, PIPE
from flask import Flask, request, jsonify

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

app = Flask(__name__)

@app.route('/')
def index():
	return 'Index Page'

@app.route('/api',methods=['GET'])
def hello():
	team1 = request.args.get('team1')
	team2 = request.args.get('team2')
	gamedate = request.args.get('date')
	model = request.args.get('model')

	results = run_model(team1, team2, gamedate, model)
	return jsonify(result=int(results))
	
if __name__ == '__main__':
	app.run()