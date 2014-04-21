import os
import sys

os.environ['ROOT'] = '/Users/t-rex-Box/Desktop/work/nba-predictor/'

def parse_boxscore_names(name):
	'''
	given the name of the box score in format: team1_vs_team2_day_mon_year.csv
	e.g: Washington_vs_Utah_25-01-2014.csv
	it'll return a series of parsed variables:
	team1, team2, date
	'''
	return name.replace("_vs","").replace(".csv", "").split("_")

def get_catalog_dict(catalog_dir):
	'''
	Given a directory, dict of  *.catalog in the directory.
	Includes RELATIVE location of the file, as well as the name.
	dict <K,V> format of <relative_path_dir+file_name, file_name>
	Will traverse sub-directories.
	example:
	{"~/path-to/data/box_scores/Indiana_vs_New York_19-03-2014.csv': 'Indiana_vs_New York_19-03-2014.csv"}
	'''
	catalogs = {}
	for curdir, dirs, files in os.walk(catalog_dir):
		for check_file in files:
			if '.csv' in check_file:
				catalogs[os.path.join(curdir,check_file)] = check_file
	print "Grabbed catalog_dict, found %s items" % len(catalogs)

	return catalogs


def join_boxscores(catalog_dir, output_dir):
	'''
	Given a directory, this function will recursively find all boxscores.
	It will then join the data into a single csv (while adding 3 more columans, team1, team2 and date)
	to output to output_dir,
	'''
	box_catalog = get_catalog_dict(catalog_dir)





print join_boxscores(os.path.join(os.environ['ROOT'], 'data/box_scores/'), 'pass.csv')



