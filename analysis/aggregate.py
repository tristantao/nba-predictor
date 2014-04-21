import os
import sys
import csv

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


def join_boxscores(catalog_dir, output_dir_path):
	'''
	Given a directory, this function will recursively find all boxscores.
	It will then join the data into a single csv (while adding 3 more columans, team1, team2 and date)
	to output to output_dir,
	'''
	box_catalog = get_catalog_dict(catalog_dir)
	static_header = None
	entries = 0
	with open(output_dir_path, 'w') as fp:
		out_csv = csv.writer(fp, delimiter=',')
		#Now go through the files that are in boxscore file and go through it.
		for catalog_path, catalog_name in box_catalog.items():
			team1, team2, date =parse_boxscore_names(catalog_name)
			with open(catalog_path, 'rb') as curent_f:
				reader = csv.reader(curent_f)
				header = reader.next()
				if static_header == None:  #just grab the first one
					static_header = ['Team1','Team2','Date'] + header
					out_csv.writerow(static_header)
				for row in reader:
					new_row = [team1, team2, date] + row
					out_csv.writerow(new_row)
					entries += 1
	print "Joined %s Entries at %s" % (entries, output_dir_path)


join_boxscores(os.path.join(os.environ['ROOT'], 'data/box_scores/'),
	os.path.join(os.environ['ROOT'], 'analysis/', 'joined.csv'))


















