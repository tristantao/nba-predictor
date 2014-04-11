/*
 * stat-hierarchy.js
 */
	
	var setOmnitureHierarchy = function (splits, filters) {

		var qp = $.getQueryParameters();
		var plID = qp.PlayerID;
		var tID = qp.TeamID;
		var fltr = filters;
		var splt = splits;
		var filterSplit = "";
		
		
		
		//Player and Team ID
		if (plID === undefined){
			plID = "none";
		}
		
		if (tID === undefined){
			tID = "none";
		}
		
		//Filters and Splits
		
		if (fltr == "" && splt === undefined){
			filterSplit = "notapplicable";
		}
		
		if (fltr == "" && splt == ""){
			filterSplit = "notapplicable";
		}
		
		if (fltr === undefined && splt == ""){
			filterSplit = "notapplicable";
		}
		
		if (fltr && splt === undefined){
			filterSplit = "Filter=Yes";
		}
		
		if (splt && fltr === undefined){
			filterSplit = "Splits=Yes";
		}
		if (splt && fltr == ""){
			filterSplit = "Splits=Yes";
		}
		if (fltr && splt == ""){
			filterSplit = "Filter=Yes";
		}
		if (splt && fltr){
			filterSplit = "Splits=Yes|Filter=Yes";
		}
		if (splt === undefined && fltr === undefined){
			filterSplit = "notapplicable";
		}
		
		//Set Omniture Object Params
		var obj = {
			playerid : "PlayerID=" + plID,
			teamid : "TeamID=" + tID,
			splitsFilters : filterSplit,
			hier : ""
		};
		
		
		if (qp.hasOwnProperty("groupFeedtype")) { 
			// set first heir level to groupfeedtype
			obj.hier += qp.groupFeedtype;
		} else {
			// get default groupfeedtype from page
			var $gft = $("#groupFeedtype");
			
			if ($gft.length==0) {
				// if groupFeedtype is not on the page
				obj.hier += "nogroupFeedtype";
			} else {
				var value = $gft.find(".ui-active").attr("value");
				if (!value) {
					//if ui-active state is not set
					obj.hier += $gft.find('a').eq(0).attr("value");
				} else {
					// if ui-active element is specified
					obj.hier += value;
				}
			}
		}

		obj.hier += "|";
		
		
		if (qp.hasOwnProperty("MeasureType")) { 
			// set first heir level to measureType
			obj.hier += qp.MeasureType;
		} else if (qp.hasOwnProperty("DistanceRange")) {
			//set first heir level to DistanceRange
			obj.hier += qp.DistanceRange;
		} else {
			if ($("#measureType").length != 0) {
				var $gft = $("#measureType");

				var value = $gft.find(".ui-active").attr("value");
				if (!value) {
					//if ui-active state is not set
					obj.hier += $gft.find('a').eq(0).attr("value");
				} else {
					// if ui-active element is specified
					obj.hier += value;
				}
			}
			else {
				obj.hier += "nomeasureType";
				
			}
			if ($("#distanceRange").length != 0) {
				var $gft = $("#distanceRange");
				var value = $gft.find(".ui-active").attr("value");
				if (!value) {
					//if ui-active state is not set
					obj.hier += $gft.find('a').eq(0).attr("value");
				} else {
					// if ui-active element is specified
					obj.hier += value;
				}
				
			}
			else {
				//do nothing
			}
			
		}
		
		return obj;
		
	};
	
	nbaOmCurrentLeague='nba';
	nbaOmAccountIds='nbag-n-league'; 
	
	var callOmniture = function (split, filter) {

		var hier = document.location.pathname.replace(/^\/(.*)\/$/, "$1").replace(/\//g, "|");
		if ((hier=="|")||(hier=="")) { hier = "home"; }
		if (hier.indexOf("|") == 0) { hier = hier.substr(1); }
		hier = hier.replace(".html","");
		
		nbaOmCurrentLeague='nba';
		nbaOmAccountIds='nbag-n-league'; 

		nbaOmChannel=hier;
		nbaOmChannelPrefix='stats.nba.com';
		nbaOmHier='nba|nba.com|nba.com|stats';
		
		// Omniture Measure & Group Hierarchy
		var obj = setOmnitureHierarchy(split, filter);

		hier += "|" + obj.hier;

		nbaOmStatsCustom1=obj.playerid;
		nbaOmStatsCustom2=obj.teamid;
		nbaOmStatsCustom3=obj.splitsFilters;

		nbaOmAppendHier=hier;
		nbaOmTeamCustom1=window.location + "";
		
		_nba.analytics.setGlobal("experience", "responsive");
		_nba.analytics.setOverride("league",nbaOmCurrentLeague);
		_nba.analytics.setOverride("accountIds", nbaOmAccountIds);
		_nba.analytics.setOverride('hier', nbaOmHier);
		_nba.analytics.setOverride('appendHier', nbaOmAppendHier);
		_nba.analytics.setOverride("statsCustom1",nbaOmStatsCustom1);
		_nba.analytics.setOverride("statsCustom2",nbaOmStatsCustom2);
		_nba.analytics.setOverride("statsCustom3",nbaOmStatsCustom3);
		_nba.analytics.setOverride("teamCustom1",nbaOmTeamCustom1);		
		_nba.analytics.page();
	};

	var initOmniture = function () {

		var hier = document.location.pathname.replace(/^\/(.*)\/$/, "$1").replace(/\//g, "|");
		if ((hier=="|")||(hier=="")) { hier = "home"; }
		if (hier.indexOf("|") == 0) { hier = hier.substr(1); }
		hier = hier.replace(".html","");
		
		nbaOmCurrentLeague='nba';
		nbaOmAccountIds='nbag-n-league'; 

		nbaOmChannel=hier;
		nbaOmChannelPrefix='stats.nba.com';
		nbaOmHier='nba|nba.com|nba.com|stats';
		
		// Omniture Measure & Group Hierarchy
		var obj = setOmnitureHierarchy();

		hier += "|" + obj.hier;

		nbaOmStatsCustom1=obj.playerid;
		nbaOmStatsCustom2=obj.teamid;
		nbaOmStatsCustom3=obj.splitsFilters;

		nbaOmAppendHier=hier;
		nbaOmTeamCustom1=window.location + "";

		_nba.analytics.setGlobal("experience", "responsive");
		_nba.analytics.setOverride("league",nbaOmCurrentLeague);
		_nba.analytics.setOverride("accountIds", nbaOmAccountIds);
		_nba.analytics.setOverride('hier', nbaOmHier);
		_nba.analytics.setOverride('appendHier', nbaOmAppendHier);
		_nba.analytics.setOverride("statsCustom1",nbaOmStatsCustom1);
		_nba.analytics.setOverride("statsCustom2",nbaOmStatsCustom2);
		_nba.analytics.setOverride("statsCustom3",nbaOmStatsCustom3);
		_nba.analytics.setOverride("teamCustom1",nbaOmTeamCustom1);	
		_nba.analytics.page();

	};
