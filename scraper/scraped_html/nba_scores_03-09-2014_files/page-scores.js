/*
 * page-teams.js
 * nicholas ortenzio
 */

$(function () {

	/*** DEFAULTS ***/

	var options = {
		init : false,
		defaults : {
			LeagueID : globalCurrentSeasonInfo.Site.LeagueID,
			gameDate : '',
			DayOffset : 0
		},
		updateInterval : 10000,
		current : {
			params : {},
			gameline : {}
		},
		dom : {
			$results : $('#scoreboards .items')
		},
	}
	
	var URLS = {
		xhr : "http://data.nba.com/data/tvc/xhr.html",
		hanaScoreboard : "/stats/scoreboard/",
		getBoxScore : function (gamecode, season) {
			return "http://data.nba.com/data/5s/xml/nbacom/" + season +  "/scores/" + gamecode + "/" + "boxscore.xml?q=" + Date.now();
		}
	};
	
	var templates = {
		hanaGameTemplate : [
			'	<div class="span2 score tab game" gamestatus="${GAME_STATUS_ID}" gameid="${GAME_ID}" gamecode="${GAMECODE}">',
			'		<h2 class="gamestatus">',
			'			{{if GAME_STATUS_ID=="1"}}',
			'				${GAME_STATUS_TEXT}',
			'			{{/if}}',
			'			{{if GAME_STATUS_ID=="2"}}',
			'				<span class="gametime">${LIVE_PERIOD_TIME_BCAST}</span>',
			'				<span class="broadcaster">${NATL_TV_BROADCASTER_ABBREVIATION}</span>',
			'				<span class="statustext">LIVE</span>',
			'			{{/if}}',
			'			{{if GAME_STATUS_ID=="3"}}',
			'				FINAL',
			'			{{/if}}',	
			'		</h2>',
			'		<ul class="tab-nav">',
			'			<li><a href="#" class="">Scores</a></li>',
			'			<li><a href="#" class="current">Game Stats</a></li>',
			'		</ul>',
			'		<div class="content">',
			'			<div class="panel">',
			'  				<table class="scoreboard">',
			'					<thead>',
			'						<tr>',
			'							<th class="team"></th>',
			'							<th class="prd q1">1</th>',
			'							<th class="prd q2">2</th>',
			'							<th class="prd q3">3</th>',
			'							<th class="prd q4">4</th>',
			'							<th class="prd q5 ot1   ${hidePeriod(5)}">OT</th>',
			'							<th class="prd q6 ot2   ${hidePeriod(6)}">2OT</th>',
			'							<th class="prd q7 ot3   ${hidePeriod(7)}">3OT</th>',
			'							<th class="prd q8 ot4   ${hidePeriod(8)}">4OT</th>',
			'							<th class="prd q9 ot5   ${hidePeriod(9)}">5OT</th>',
			'							<th class="prd q10 ot6  ${hidePeriod(10)}">6OT</th>',
			'							<th class="prd q11 ot7  ${hidePeriod(11)}">7OT</th>',
			'							<th class="prd q12 ot8  ${hidePeriod(12)}">8OT</th>',
			'							<th class="prd q13 ot9  ${hidePeriod(13)}">9OT</th>',
			'							<th class="prd q14 ot10 ${hidePeriod(14)}">10OT</th>',
			'							<th class="total">T</th>',	
			'						</tr>',
			'					</thead>',
			'					<tbody>',
			'						{{each teams}}',
			'						<tr>',
			'{{if TEAM_ABBREVIATION == "EST" || TEAM_ABBREVIATION == "WST" || TEAM_ABBREVIATION == "SHQ" || TEAM_ABBREVIATION == "CHK" }}' +
			'							<td class="team"><a href="/teamProfile.html?TeamID=${TEAM_ID}&SeasonType=All Star"><div class="logo ${TEAM_ABBREVIATION} sm">${TEAM_ABBREVIATION}</div></a>${TEAM_ABBREVIATION}<br>${TWL}</td>',                     
            '{{else}}' +
			'							<td class="team"><a href="/teamProfile.html?TeamID=${TEAM_ID}"><div class="logo ${TEAM_ABBREVIATION} sm">${TEAM_ABBREVIATION}</div></a>${TEAM_ABBREVIATION}<br>${TWL}</td>',                     
            '{{/if}}' +			
			'							<td class="prd q1">${PTS_QTR1}</td>',
			'							<td class="prd q2">${PTS_QTR2}</td>',
			'							<td class="prd q3">${PTS_QTR3}</td>',
			'							<td class="prd q4">${PTS_QTR4}</td>',
			'							<td class="prd q5 ot1   ${hidePeriod(5)} ">${PTS_OT1}</td>',
			'							<td class="prd q6 ot2   ${hidePeriod(6)} ">${PTS_OT2}</td>',
			'							<td class="prd q7 ot3   ${hidePeriod(7)} ">${PTS_OT3}</td>',
			'							<td class="prd q8 ot4   ${hidePeriod(8)} ">${PTS_OT4}</td>',
			'							<td class="prd q9 ot5   ${hidePeriod(9)} ">${PTS_OT5}</td>',
			'							<td class="prd q10 ot6  ${hidePeriod(10)}">${PTS_OT6}</td>',
			'							<td class="prd q11 ot7  ${hidePeriod(11)}">${PTS_OT7}</td>',
			'							<td class="prd q12 ot8  ${hidePeriod(12)}">${PTS_OT8}</td>',
			'							<td class="prd q13 ot9  ${hidePeriod(13)}">${PTS_OT9}</td>',
			'							<td class="prd q14 ot10 ${hidePeriod(14)}">${PTS_OT10}</td>',
			'							<td class="total">${PTS}</td>',	
			'						</tr>',
			'						{{/each}}',
			'					</tbody>',
			'				</table>',
			'			</div><!--.panel -->',
			'			<div class="panel" style="display: block;">',
			'				 <table class="game-stats">',
			'					<thead>',
			'						<tr><th class="team"></th>',
			'						<th>FT%</th>',
			'						<th>FG%</th>',
			'						<th>3P%</th>',
			'						<th>AST</th>',
			'						<th>REB</th>',
			'						<th>TO</th>',
			'					</tr></thead>',
			'					<tbody>',
			'						{{each teams}}',
			'							<tr>',
			'{{if TEAM_ABBREVIATION == "EST" || TEAM_ABBREVIATION == "WST" || TEAM_ABBREVIATION == "SHQ" || TEAM_ABBREVIATION == "CHK" }}' +
			'								<td class="team"><a href="/teamProfile.html?TeamID=${TEAM_ID}&SeasonType=All Star"><div class="logo ${TEAM_ABBREVIATION} sm">${TEAM_ABBREVIATION}</div></a></td>',			
            '{{else}}' +
			'								<td class="team"><a href="/teamProfile.html?TeamID=${TEAM_ID}"><div class="logo ${TEAM_ABBREVIATION} sm">${TEAM_ABBREVIATION}</div></a></td>',			
            '{{/if}}' +			
			'								<td>${FT_PCT}</td>',
			'								<td>${FG_PCT}</td>',
			'								<td>${FG3_PCT}</td>',
			'								<td>${AST}</td>',
			'								<td>${REB}</td>',
			'								<td>${TOV}</td>	',				
			'							</tr>',
			'						{{/each}}',
			'					</tbody>',
			'				</table> <!-- .stats -->',
			'				<div class="stat-leaders">',
			'					<table>',
			'						<tr>',
			'							<th>${vtm.TEAM_ABBREVIATION} Leaders</th>',
			'							<th>${htm.TEAM_ABBREVIATION} Leaders</th>',
			'						</tr>',
			'						<tr>',
			'							<td>${vtm.leader.PTS.lastname} - ${vtm.leader.PTS.value} PTS</td>',
			'							<td>${htm.leader.PTS.lastname} - ${htm.leader.PTS.value} PTS</td>',
			'						</tr>',
			'						<tr>',
			'							<td>${vtm.leader.REB.lastname} - ${vtm.leader.REB.value} REB</td>',
			'							<td>${htm.leader.REB.lastname} - ${htm.leader.REB.value} REB</td>',
			'						</tr>',
			'						<tr>',
			'							<td>${vtm.leader.AST.lastname} - ${vtm.leader.AST.value} AST</td>',
			'							<td>${htm.leader.AST.lastname} - ${htm.leader.AST.value} AST</td>',
			'						</tr>',
			'					</table>',			
			'				</div> <!-- .stat-leaders -->',			
			'			</div>  <!-- .panel -->',
			'		</div> <!-- .content -->',
			'		<div class="game-details">',
			'			<div class="pregame">',
			'				<a href="http://www.nbatickets.com">Buy Tickets</a> - ',
			'				<a href="${TVC_URL}">TV Companion</a> - ',
			'				<a href="http://www.nba.com/leaguepass/">League Pass</a>',
			'			</div>',
			'			<div class="series">${SERIES_LEADER}</div>',
			'{{if lastMatchup}}' +
			'			<div class="pregame lastmeeting">',
			'				<span class="lm">Last Meeting:</span>',
			'				<span class="gamedate">${lastMatchup.gamedateFormatted}</span>',
			'				<span class="vtm city">${lastMatchup.LAST_GAME_VISITOR_TEAM_CITY1}</span>',
			'				<span class="vtm points">${lastMatchup.LAST_GAME_VISITOR_TEAM_POINTS}</span>',
			'				<span class="at">@</span>',			
			'				<span class="htm city">${lastMatchup.LAST_GAME_HOME_TEAM_CITY}</span>',			
			'				<span class="htm points">${lastMatchup.LAST_GAME_HOME_TEAM_POINTS}</span>',			
			'			</div>',
            '{{/if}}' +
			'			<div class="post-links">',
			'				<a href="${BOXSCORE_LINK}" class="boxscore-link">Box Score</a>',
			'				<span class="pbp-link-separator"> - </span>',
			'				<a href="${PLAYBYPLAY_LINK}" class="pbp-link">Play-by-Play</a>',
			'{{if PLAYERTRACKING_LINK}}' +
			'				<span class="player-tracking-link-separator"> - </span>',
			'				<a href="${PLAYERTRACKING_LINK}" class="player-tracking-link">Player Tracking</a>',
//			'				- <a href="/videoPlaylist.html?gameid=${GAME_ID}">Video Playlist</a>',
//			'				- <a href="/shotcharts.html?gameid=${GAME_ID}">Shot Charts</a>',
            '{{/if}}' +
			'			</div>',
			'			<div class="gamebook"><a href="${GAMEBOOK_URL}">Gamebook (PDF)</a></div>',
			'		</div><!-- .gamedetails -->',
			'	</div>'
		].join(""),
		standingsTemplate : [
			'<div class="standings-result span3">',
			'	<div class="standings-header">${conference} Standings</div>',
			'	<table class="stat-table">',
			'		<thead>',
			'			<tr>',
			'				<th class="team">Team</th>',
			'				<th>W</th>',
			'				<th>L</th>',
			'				<th>PCT</th>',
			'				<th>HOME</th>',
			'				<th>ROAD</th>',		
			'			</tr>',
			'		</thead>',
			'		<tbody>',
			'			{{each items}}',
			'			<tr>',
			'					<td><a href="/teamStats.html?TeamID=${TEAM_ID}">${TEAM}</a></td>',
			'					<td>${W}</td>',
			'					<td>${L}</td>',
			'					<td>${W_PCT}</td>',
			'					<td>${HOME_RECORD}</td>',
			'					<td>${ROAD_RECORD}</td>	',		
			'			</tr>',
			'			{{/each}}',
			'		</tbody>',
			'	</table>',
			'</div>'
		].join("")
	}
	
	var GAMES = {
		all : [],
		live : [],
		upcoming : [],
		notFinal : []
	};
	
	
	
	
	
	
	/*** STAT REQUEST ***/
	
	var initStatRequest = function () {
	
		// wait for page init complete
		if (!options.init) {
			return;
		}
		
		requestHanaStats();
	};

	var requestHanaStats = function () {
	
		// show loader 
		$('.loader').show();
		
		// AJAX request
		$.getStats(URLS.hanaScoreboard, options.current.params, onHanaStatRequestResponse);		
	};
	
	var requestBoxscore = function (gamecode, season) {
		var boxscoreURL = URLS.getBoxScore(gamecode, season);
		var xhrURL = URLS.xhr;
		
		IFrameXDR.init(xhrURL).request("GET", boxscoreURL, null, null, onBoxscoreResponse);
	};
	
	
	/*** AJAX CALLBACKS ***/
	
	var onHanaStatRequestResponse = function (resp) {
		// hide loader
		$('.loader').hide();
		
		// process data
		processHanaData(resp);
		
		// if no games are available
		if (GAMES.all.length == 0) {
			renderNoGames();		
		} else {
			// render scoreboard games
			renderHanaResultSet(GAMES.all);
		}
		
		// render standings
		renderStandings(resp);

		//Hide Play By Play links in case of prior season to 1996
		var resultDate = new Date(resp.parameters.GameDate);
		if(resultDate.getFullYear() < 1996){
			$(".pbp-link").hide();
			$(".pbp-link-separator").hide();
		}
		//Hide Player Tracking in case of prior season to 2013
		if(resultDate.getFullYear() < 2013){
			$(".player-tracking-link").hide();
			$(".player-tracking-link-separator").hide();
		}
	};
	
	var onBoxscoreResponse = function (resp) {
		if (!resp) {
			return;
		}
		
		if (resp.readyState==4 && resp.status==200) {
			$xml = $(resp.responseXML);
			processBoxscoreData($xml);
		}		
	}

	
	
	
	
	/*** INTERVALS ***/
	
	var updateLiveGames = function () {
		$.each(GAMES.notFinal, function(i, n) {
			requestBoxscore(n.GAMECODE, n.SEASON);			
		});		
	};
	
		
	
	
	
	

	/*** PARSE FEED DATA ***/
	var processHanaData = function (data) {	
		var games = data.sets.GameHeader.datatable || [];
		var seriesLeaders = data.sets.SeriesStandings.datatable || [];
		var matchups = data.sets.LastMeeting.datatable || [];
		var linescore = data.sets.LineScore.datatable || [];
		var gameheader = data.sets.GameHeader.datatable || [];
		var available = data.sets.Available.datatable || [];
				
		$.each(games, function (i, n) {
			n.htm = $.grep(linescore, function (t) { return (t.GAME_ID==n.GAME_ID && t.TEAM_ID == n.HOME_TEAM_ID) })[0];
			n.vtm = $.grep(linescore, function (t) { return (t.GAME_ID==n.GAME_ID && t.TEAM_ID == n.VISITOR_TEAM_ID) })[0];	
			n.pta = $.grep(available, function (t) { return (t.GAME_ID==n.GAME_ID) })[0];	
	
			n.seriesInfo = ""; // seriesLeaders[i];
			n.lastMatchup = $.grep(matchups, function (t) { return (t.GAME_ID==n.GAME_ID) })[0];
			
			if (!$.isEmptyObject(n.lastMatchup)) {
				n.lastMatchup.gamedate = new Date(n.lastMatchup.LAST_GAME_DATE_EST);

				try {
					n.lastMatchup.gamedateFormatted = dateFormat(n.lastMatchup.gamedate, "mm/dd");
				} catch (e) {
					n.lastMatchup.gamedateFormatted = "";
				}
			}
			
			var gc = n.GAMECODE.split("/");

			if (n.SEASON) {
				n.GAMEBOOK_URL = "http://www.nba.com/data/html/nbacom/" + n.SEASON + "/gameinfo/" + gc[0] + "/" + n.GAME_ID + "_Book.pdf";
			}
			n.TVC_URL = "http://www.nba.com/tvc/index.html?gamecode=" + n.GAMECODE;
			
			n.teams = [];
			n.teams.push(n.vtm, n.htm);
			
			n.hidePeriod = function(period) {
				return (n.LIVE_PERIOD < period) ? "inactive" : ""; 
			}
			
			if (n.WH_STATUS==0) {
				n.BOXSCORE_LINK = "http://www.nba.com/games/" + n.GAMECODE + "/gameinfo.html";
				n.PLAYBYPLAY_LINK = "http://www.nba.com/games/" + n.GAMECODE + "/gameinfo.html#nbaGIPlay";
				n.PLAYERTRACKING_LINK = "";
			} else {
				n.BOXSCORE_LINK =  "/gameDetail.html?GameID=" + n.GAME_ID + "&tabView=boxscore";
				n.PLAYBYPLAY_LINK = "/gameDetail.html?GameID=" + n.GAME_ID + "&tabView=playbyplay";
				if (n.pta.PT_AVAILABLE == 1) {
					n.PLAYERTRACKING_LINK = "/gameDetail.html?GameID=" + n.GAME_ID + "&tabView=playertracking";
				} else {
					n.PLAYERTRACKING_LINK = "";
				}
			}
			
			n.vtm.TWL = (n.vtm.TEAM_WINS_LOSSES=="0-0") ? "" : "(" + n.vtm.TEAM_WINS_LOSSES + ")";
			n.htm.TWL = (n.htm.TEAM_WINS_LOSSES=="0-0") ? "" : "(" + n.htm.TEAM_WINS_LOSSES + ")";
			
			// this isnt coming from hana yet
			n.vtm.leader = {
				PTS : { name : "", value : "" },
				REB : { name : "", value : "" },
				AST : { name : "", value : "" }				
			};
			n.htm.leader = {
				PTS : { name : "", value : "" },
				REB : { name : "", value : "" },
				AST : { name : "", value : "" }			
			};
		
		});
		
		
		
		GAMES.all = games;
		GAMES.live = $.grep(games, function(game, i) { return (game.GAME_STATUS_ID==2) })
		GAMES.upcoming = $.grep(games, function(game, i) { return (game.GAME_STATUS_ID==1) })
		GAMES.notFinal = $.grep(games, function(game, i) { return (game.GAME_STATUS_ID==1) || (game.GAME_STATUS_ID==2) })
		
	};

	var processBoxscoreData = function ($xml) {
		
		// find game node
		var $game = $xml.find("game");
		
		// no boxscore info for game
		if ($game.length==0) {
			return;
		}
		
		// get actual game from teamcode
		var game = GAMES.all[0];
		var game_data = {};
		
		
		//
		var gamecode = $game.attr('gcd'); 
		var game = $.grep(GAMES.all, function(n) { return (n.GAMECODE == gamecode) });
		if (!game) {
			return; 
		}
		game = game[0];
		
		//
		var status = parseInt($game.attr("gstat"), 10);
		if (status != 2) {
			return;
		}
		
		// get updated game info
		game.GAME_STATUS_ID = status;
		game.GAME_STATUS_TEXT = $game.attr("gstattxt");
		game.LIVE_PERIOD = parseInt($game.attr("prd"), 10);
		game.LIVE_PERIOD_TIME_BCAST = "Q" + game.LIVE_PERIOD + " - " + $game.attr("clk");
		
		// process data for each team
		processBoxscoreDataForTeam("vtm", $game, game);
		processBoxscoreDataForTeam("htm", $game, game);
		
		// process team leaders
		
	
		// if gamestatus == 3 remove from live game array
		
				
		// render game node
		renderSingleGameNode(game);
	}

	var processBoxscoreDataForTeam = function (team, $game, game) {
	
		// find team node from boxscore response
		var $team = $game.find(team);
		
		// get team node for game object
		var team = game[team];	

		// split score attribute
		var score = $team.attr("scr").split("|");
		
		// update team line scores
		team.PTS_QTR1 = score[0];
		team.PTS_QTR2 = score[1];
		team.PTS_QTR3 = score[2];
		team.PTS_QTR4 = score[3];
		team.PTS_OT1  = score[4];
		team.PTS_OT2  = score[5];
		team.PTS_OT3  = score[6];
		team.PTS_OT4  = score[7];
		team.PTS_OT5  = score[8];
		
		// incase of wicked overtime
		if(score.length > 9) {
			team.PTS_OT6  = score[9];
			team.PTS_OT7  = score[10];
			team.PTS_OT8  = score[11];
			team.PTS_OT9  = score[12];
			team.PTS_OT10 = score[13];		
		}
		
		// last item is the total score
		team.PTS = score[score.length - 1];
		
		// split the stats attribute
		var stats = $team.attr("gstat").split("|");
		
		// update team line stats
		team.REB = stats[0];
		team.FG_PCT = Math.round(stats[1] * 100);
		team.FG3_PCT = Math.round(stats[2] * 100);
		team.FT_PCT = Math.round(stats[3] * 100);
		team.TOV = stats[4];
		team.AST = $team.attr("stat").split("|")[7];
		

		
		processBoxscoreDataLeadersAttr(team.leader.PTS, "points", $team.attr("pld"));
		processBoxscoreDataLeadersAttr(team.leader.REB, "rebounds", $team.attr("rld"));
		processBoxscoreDataLeadersAttr(team.leader.AST, "assists", $team.attr("ald"));
	};
	
	var processBoxscoreDataLeadersAttr = function (team, stat, value) {
		if (!value) {
			return;
		}
		
		var	leaders = value.split("^");
		
		if (leaders.lenght == 0) {
			return;
		}
		
		var stat = leaders[0].split("|");
		
		team.PLAYERID = stat[0];
		team.name = stat[2];
		team.value = stat[3];
		team.lastname = team.name.split(", ")[0];
		team.firstname = team.name.split(", ")[1];
	};

		
	/*** RENDERING ***/
	
	var renderNoGames = function () {
		$('<h1 class="nogames">No Scheduled Games Available</h1>').appendTo("#scoreboards");
	};
	
	var renderHanaResultSet = function (data) {
		// clear existing content
		options.dom.$results.empty();
		
		//Hornets To Pelican Conversion
		/*
		$.each(data, function(i, n) {
			//Temporary Hornet to Pelican Conversion
			var props = ["TEAM_ABBREVIATION"];
			var chnageFrom = "NOH";
			var chnageTo = 	"NOP";
			window.hornetsToPelicans(n.teams[0],chnageFrom,chnageTo,props);
			window.hornetsToPelicans(n.teams[1],chnageFrom,chnageTo,props);
			window.hornetsToPelicans(n.htm,chnageFrom,chnageTo,props);
			window.hornetsToPelicans(n.vtm,chnageFrom,chnageTo,props);
		});*/
	
		// render template
		$.tmpl("hanaGameTemplate", data).appendTo(options.dom.$results);

		// init tabs for game items
		$('.score .tab-nav').each(function(){
		   $(this).tabs("div.content > div");
		});
		
		// display active overtime quarters
		
	};

	var renderBoxscoreResultSet = function (data) {
		//$.tmpl("graphTableTemplate", data.datagrid).appendTo("#leaderboard-view-graph table");	
	};
	
	var renderSingleGameNode = function(game) {
		
		// get element from gameid
		var $game = options.dom.$results.find('.score[gameid="' + game.GAME_ID+ '"]')
		
		// render template
		var $new = $.tmpl("hanaGameTemplate", [game]);
		
		// update game status attribute
		$game.attr("gamestatus", game.GAME_STATUS_ID);
		
		//replace old element with new
		$game.find('h2.gamestatus').replaceWith($new.find('h2.gamestatus'));
		$game.find('table.scoreboard').replaceWith($new.find('table.scoreboard'));
		$game.find('table.game-stats').replaceWith($new.find('table.game-stats'));
		$game.find('div.stat-leaders').replaceWith($new.find('div.stat-leaders'));
	};
	
	var renderStandings = function (data) {
		var east = {conference:"EASTERN", items: data.sets.EastConfStandingsByDay.datatable };
		var west = {conference:"WESTERN", items: data.sets.WestConfStandingsByDay.datatable };
		
		//W_PCT format to three decimal places	
		for(var count=0;count<east.items.length;count++){ east.items[count].W_PCT = east.items[count].W_PCT.toFixed(3); }
		for(var count=0;count<west.items.length;count++){ west.items[count].W_PCT = west.items[count].W_PCT.toFixed(3); }
		
		var $elm = $("#standings-area .items");
		
		$.tmpl("standingsTemplate", east).appendTo($elm);
		$.tmpl("standingsTemplate", west).appendTo($elm);
	};

	
	
	var updateGameDateNav = function () {
		var d = new Date(options.current.params.gameDate);
		d.setDate(d.getDate() + options.current.params.DayOffset)
		$("#scores-scroll-nav .current").text(dateFormat(d, "ddd, mmm dS, yyyy"));
	};
	
	
	
	/*** INIT ***/
	
	var initGameDate = function () {

		//Forward page to coming Season October 5th.
		//Remove this on the day of start of Season.
		/*
		if(options.current.params.gameDate == ""){
			options.current.params.gameDate = "10/05/2013";
		}*/

		// create a date value from url param or default to today
		var d = (options.current.params.gameDate) ? new Date(options.current.params.gameDate) : new Date();

		// set various date values
		options.current.params.date = new Date(d);
		options.current.params.gameDate = dateFormat(d, "mm/dd/yyyy");
		options.current.gameline.gamedate = dateFormat(d, "yyyymmdd")
		options.current.gameline.season = "2013";
		
		// set date to TODAY if it is current date for stats call
		var todayDate=dateFormat(new Date(), "mm/dd/yyyy");

		
		if(todayDate==options.current.params.gameDate){
			options.current.params.gameDate="TODAY";
		}
		
		var datenext = d.setDate(d.getDate() + 1);
		var dateprev = d.setDate(d.getDate() - 2);

		// init nav elements
		$("#scoreboard-date-nav .next").attr("href", "/scores.html?gameDate=" +  dateFormat(datenext, "mm/dd/yyyy")); 
		$("#scoreboard-date-nav .prev").attr("href", "/scores.html?gameDate=" +  dateFormat(dateprev, "mm/dd/yyyy")); 
	
	};
	
	var init = (function () {

		// get default page params
		var qp = $.getQueryParameters();
		
		// extend default params with query values
		$.extend(options.current.params, options.defaults, qp);
	
		// init the game date and calendar
		initGameDate();
		
		// compile templates
		$.template("hanaGameTemplate", templates.hanaGameTemplate);
		$.template("boxscoreTemplate", templates.boxscoreTemplate);	
		$.template("standingsTemplate", templates.standingsTemplate);	
		
		// init jquery date picker
		$("#browse-date").datepicker({
			numberOfMonths: 1,
            changeMonth: true,
            changeYear: true,
			showOn: "button",
            buttonImage: "/media/calendar.png",
            buttonImageOnly: false,
			dateFormat: "D, M d, yy",
			yearRange: "1946:2014",
			gotoCurrent: true,
			defaultDate: new Date(options.current.params.gameDate),
			onSelect: function(dateText, inst){
				if (!options.init) {
					return;
				} 
				var seldate = $(this).datepicker("getDate"); 
				document.location = "/scores.html?gameDate=" +  dateFormat(seldate, "mm/dd/yyyy");
			}
        });
		
		$("#browse-date").datepicker('setDate',options.current.params.date);
		
		//Set the title for Standings Section
		var currDate = new Date(options.current.params.date);
		var currDateStr = dateFormat(currDate, "ddd, mmm d, yyyy");
		$("#standings-header").html("Standings - " + currDateStr);
		
		// set init to true to enable stat requests to be made
		options.init = true;
		
		initStatRequest();
		
		// init updater
		var updater = setInterval(updateLiveGames, options.updateInterval);
	}());
		
		
});