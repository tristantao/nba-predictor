/**
* NBA Stats Grids formatters
* @author Jenn Schiffer
*/
var formatterDataFunctions = {
	//NR
	//Using in Boxscore MIN
	boxscoreMIN: function(cellValue){
		var inValue = cellValue;
		return inValue;
	},

	//Proxy function
	blanktoZeroValue: function(cellValue){
		return Number(cellValue);
	},

	//NR
	//Convert to Integer number XXX
	toInteger : function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
		    retVal = parseInt(inValue);
		}
		return retVal;
	},

	//Without checking any condition just convert to one decimal place number
	toOneDecimalInteger: function(cellValue){
		var inValue = Number(cellValue);
		return inValue.toFixed(1);
	},

	//NR
	//Convert number to percentage one decimal place XXX.X%
	toPercentageOneDecimal : function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
			var retVal = (inValue*100).toFixed(1)+"%";
			var rank = window.currentGridConfig.Rank;
			var perMode = window.currentGridConfig.PerMode;
			if(perMode == "PerPossession") { retVal = inValue.toFixed(3); }
			if(rank == "Y") { retVal = parseInt(inValue); }
			if(inValue*100 == 100) { 
				retVal = (inValue*100).toFixed(0) + "%"
			}
		}
		return retVal;
	},

	//Convert to One decimal place
	toOneDecimalPlaces: function(cellValue, index, cell){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
			var retVal = (inValue).toFixed(1);
			var rank = window.currentGridConfig.Rank;
			var perMode = window.currentGridConfig.PerMode;
			if(perMode == "PerPossession") { retVal = inValue.toFixed(3); }
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
		return retVal;
	},
	
	//Convert to One decimal place
	toOneDecimalPlacesDash: function(cellValue, index, cell){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = "-";
		}
		else{
			var retVal = (inValue).toFixed(1);
			var rank = window.currentGridConfig.Rank;
			var perMode = window.currentGridConfig.PerMode;
			if(perMode == "PerPossession") { retVal = inValue.toFixed(3); }
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
		return retVal;
	},

	//Convert to Two decimal place  XXX.XX
	toTwoDecimalPlaces : function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
			var retVal = (inValue).toFixed(2);
			var rank = window.currentGridConfig.Rank;
			var perMode = window.currentGridConfig.PerMode;
			if(perMode == "PerPossession") { retVal = inValue.toFixed(3); }
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
	    return retVal;
	},

	//NR
	//Convert to Three decimal place X.XXX
	toThreeDecimalPlaces : function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
			var retVal = (inValue).toFixed(3);
			var rank = window.currentGridConfig.Rank;
			var perMode = window.currentGridConfig.PerMode;
			if(perMode == "PerPossession") { retVal = inValue.toFixed(3); }
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
	    return retVal;
	},

	//NR
	//MIN field formatter function
	//Whole integer number XXXX
	//"Totals","PerMinute","Per36","Per40","Per48",
	//One decimal place number XXX.X
	//"PerGame","MinutesPer","Per100Plays","Per100Possessions"
	//Three decimal place number X.XXX
	//"PerPossession","PerPlay"
	MIN_formatter : function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
	        var perMode = window.currentGridConfig.PerMode;
			var retVal = inValue;
			switch(perMode){
				case "Totals":
				case "PerMinute":
				case "Per36" :
				case "Per40" :
				case "Per48" :
				case "MinutesPer":			
					retVal = parseInt(inValue);
					break;
				case "PerGame":
				case "Per100Plays" :
				case "Per100Possessions" :
					retVal = (inValue).toFixed(1);
					break;
				case "PerPossession": 			
				case "PerPlay":
					retVal = inValue.toFixed(3);
					break;
				default:
					break;
			}
			var rank = window.currentGridConfig.Rank;
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
		return retVal;
	},

	// returns value in MM:SS
	MINSEC_formatter : function(cellValue) {
		var inValue = Number(cellValue);
		if (isNaN(inValue) || inValue == null) {
			retVal = inValue;
		}
		retVal = inValue.toFixed(2) + "";
		console.log("MIN time: " + retVal);
		var decimal = retVal.indexOf('.');

		var MM = retVal.substr( 0, decimal);
		var SS = retVal.substr( decimal+1, 2);
		SS = (Number(SS)/100 * 60).toFixed(0);
		
		if ( MM.length == 1 ) {
			MM = "0" + MM;
		}
		else if ( MM.length == 0 ) {
			MM = "00";
		}
		if ( SS.length == 1 ) {
			SS = "0" + SS;
		}
		else if ( SS.length == 0 ) {
			SS = "00";
		}
		retVal = MM + ":" + SS;
		console.log("MM:SS time: " + retVal + "\n ---");
		return retVal;
	},


	//NR
	//FGM, FGA, FG3M, FG3A, FTM, FTA  field formatter function
	//OREB,DREB,REB,AST,TOV,STL,BLK,BLKA,PF,PFD,PTS,PLUS_MINUS field formatter function
	//Total Pace Adjust Off whole integer 									XXXX
	//Total Pace Adjust On one decimal point value							XXX.X
	//Minutes Per mode Pace Adjust Off two decimal point value				XXX.XX
	//Minutes Per mode Pace Adjust On one decimal point value				XXX.X
	//In rest of the cases one decimal point value							XXX.X
	FGTMA_formatter : function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
	        var perMode = window.currentGridConfig.PerMode;
			var paceAdjust = window.currentGridConfig.PaceAdjust;

			var retVal = inValue;
			switch(perMode){
				case "Totals":
					if(paceAdjust == "Y") retVal = (inValue).toFixed(1);
					else  retVal = parseInt(inValue);
					break;
				case "PerMinute":
					if(paceAdjust == "N") retVal = (inValue).toFixed(2);
					else retVal = (inValue).toFixed(2);
					break;
				case "PerPossession": 			
					retVal = inValue.toFixed(3);
					break;
				case "PerPlay": 			
					retVal = inValue.toFixed(3);
					break;
				default:
					retVal = (inValue).toFixed(1);
					break;
			}

			var rank = window.currentGridConfig.Rank;
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
		return retVal;
	},

	//NR
	//For MISC MeasureType
	//"PTS_OFF_TOV","PTS_2ND_CHANCE","PTS_FB","PTS_PAINT","OPP_PTS_OFF_TOV","OPP_PTS_2ND_CHANCE","OPP_PTS_FB","OPP_PTS_PAINT" fields
	//Total whole integer 													XXXX
	//Minutes Per mode														XXX.XX
	//In rest of the cases one decimal point value							XXX.X
	MISC_formatter: function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{

	        var perMode = window.currentGridConfig.PerMode;
			var retVal = inValue;
			switch(perMode){
				case "Totals":
					retVal = parseInt(inValue);
					break;
				case "PerMinute":
					retVal = (inValue).toFixed(2);
					break;
				case "PerPossession": 			
					retVal = inValue.toFixed(3);
					break;
				case "PerPlay": 			
					retVal = inValue.toFixed(3);
					break;
				default:
					retVal = (inValue).toFixed(1);
					break;
			}

			var rank = window.currentGridConfig.Rank;
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
		return retVal;
	},

	//Convert to one decimal place after multipling by 100
	//If number becomes grater than 100 after multiplying by 100 cancle that return the same number with one decimal place format
	TM_TOV_PCT_Formatter : function(cellValue){
		var inValue = Number(cellValue);
		if(isNaN(inValue) || inValue == null){
			retVal = inValue;
		}
		else{
			var retVal = (inValue*100).toFixed(1);
			if(retVal > 100){ retVal = inValue; }

			var rank = window.currentGridConfig.Rank;
			var perMode = window.currentGridConfig.PerMode;
			if(perMode == "PerPossession") { retVal = inValue.toFixed(3); }
			if(rank == "Y") { retVal = parseInt(inValue); }
		}
		return retVal;
	},
};



var formatterLinkFunctions = {
	//Using in Team Roster Pages
	heightSort: function(cellValue, row, data){
		return data[0].HEIGHT;
	},
	//Using in Team Roster Pages
	expSort: function(cellValue, row, data){
		return data[0].EXP;
	},
	//Using in Team Roster Pages
	birthDateSort: function(cellValue, row, data){
		return data[0].BIRTH_DATE;
	},
	//Using in Boxscore page
	MINSort: function(cellValue, row, data){
		return data[0].MIN;
	},
	
	playerSeasonLink : function (cellValue, row, data) {
		return '<a href="/playerStats.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue + '</a>';
		// link: formatterFunctions.playerSeasonLink,
	},
	//Using in teamProfile, teamStats -- Shooting Assisted By Grid, teamPlayers, 
	playerProfileLink: function(cellValue, row, data){
		return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue + '</a>';
	},

	//Using in Boxscore
	playerProfileLinkPlusPosition: function(cellValue, row, data){
		if(data[0].START_POSITION){
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue + ' - ' + data[0].START_POSITION +'</a>';
		}
		else if(data[0].PLAYER_ID){
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue +'</a>';
		}
		else{
			return cellValue;
		}
	},

	//Using in teamOnOffDetails
	vsplayerProfileLink: function(cellValue, row, data){
		return '<a href="/playerProfile.html?PlayerID=' + data[0].VS_PLAYER_ID +'">' + cellValue + '</a>';
	},

	//Using in leadersGrid
	playerProfileLinkPlusTeam: function(cellValue, row, data){
		if(data[0].TEAM){
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue +" ("+data[0].TEAM+")"+ '</a>';	
		}else{
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue + '</a>';	
		}
	},

	//Using in leadersGrid
	playerProfileLinkPlusTeamRank: function(cellValue, row, data){
		if(data[0].TEAM && data[0].RANK){
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + data[0].RANK + ". " + cellValue +" ("+data[0].TEAM+")"+ '</a>';	
		}else{
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue + '</a>';	
		}
	},

	//Using in leadersGrid
	playerProfileLinkPlusTeamAbbr: function(cellValue, row, data){
		if(data[0].TEAM_ABBREVIATION){
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue +" ("+data[0].TEAM_ABBREVIATION+")"+ '</a>';	
		}else{
			return '<a href="/playerProfile.html?PlayerID=' + data[0].PLAYER_ID +'">' + cellValue + '</a>';	
		}
	},


	//Using in teamGameLogs
	matchupLink: function(cellValue, row, data){
		return '<a style="text-decoration:  none;" href="/gameDetail.html?GameID='+data[0].Game_ID+ '">'+data[0].GAME_DATE+" - "+data[0].MATCHUP+'</a>';
	},

	//Using in pages: League Team General, Clutch 
	teamProfileLink: function(cellValue, row, data){
		return '<a style="text-decoration:  none;" href="/teamProfile.html?TeamID='+data[0].TEAM_ID+'">'+cellValue+'</a>';
	},

	//Using in pages: League Team General, Clutch 
	teamProfileLinkAllStar: function(cellValue, row, data){
		return '<a style="text-decoration:  none;" href="/teamProfile.html?TeamID='+data[0].TEAM_ID+'&SeasonType=All Star">'+cellValue+'</a>';
	},

	//Using in pages: teamSeasons, teamYoYStats
	teamProfileLinkPlusSeason: function(cellValue, row, data){
		return '<a style="text-decoration:  none;" href="/teamProfile.html?TeamID='+data[0].TEAM_ID+'&Season='+data[0].YEAR+'">'+data[0].TEAM_CITY+' '+cellValue+'</a>';
	},

	//Frenchise name column format function
	//Using in page history
	frenchiseFormat: function(cellValue, row, data){
		var retVal = cellValue;
		if(data[0].TEAM_NAME){
			retVal += " " + data[0].TEAM_NAME;
		}

		if(data[0].highlight){
			retVal = '<a style="text-decoration: none;" href="/teamSeasons.html?TeamID='+data[0].TEAM_ID+'">'+retVal+'</a>';
		}
		return retVal;
	},

	//For mobile just generate normal shotchart link
	//For desktop generate shotchart/video option link
	createLinkBasedOnDevice: function(qString,data){
		var retValue = "";
    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(qString); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
    	result = new RegExp("SeasonType" + "=([^&]*)", "i").exec(qString); 
		seasonTypeValue = result && unescape(result[1]) || "";

		//Disabled Video -- NR
		//For mobile versiona and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || seasonValue < 2012 || isNaN(seasonValue) || seasonTypeValue == "All Star") {
			if(IS_NOT_DESKTOP == true){
				retValue = '<a rel="shotchart" href="/shotchartPopup.html?'+qString+'">'+data+'</a>';
			}
			else{
				retValue = '<a class="shotchartOrVideo" href="#" shotchart="/shotchartIframe.html?'+qString+'" video="">'+data+'</a>';	
			}
		}
		else{
			if(window.globalGameVideoNotAvailableFlag == false){
				retValue = '<a class="shotchartOrVideo" href="#" shotchart="/shotchartIframe.html?'+qString+'" video="">'+data+'</a>';	
			}
			else{
				retValue = '<a class="shotchartOrVideo" href="#" shotchart="/shotchartIframe.html?'+qString+'" video="/cvp.html?'+qString+'">'+data+'</a>';	
			}
		}
		//retValue = '<a rel="shotchart" href="/shotchartPopup.html?'+qString+'">'+data+'</a>';
		return retValue;
	},

	//For mobile just generate normal shotchart link
	//For desktop generate shotchart/video option link
	createVideoLinkBasedOnDevice: function(qString,data){
		var retValue = "";
		retValue = '<a class="shotchartOrVideo" href="#" video="/cvp.html?'+qString+'">'+data+'</a>';
		return retValue;
	},

	//Shot Chart Links
	//Assume Percentage One decimal formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	toPercentageOneDecimal_shotChart : function(inValue, row, thisRow){
		var data = inValue;
		var retVal = inValue;

		var rank = window.currentGridConfig.Rank;
		var perMode = window.currentGridConfig.PerMode;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			//var rowdata = this.grid.getItem(index);
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{
		}
		return retVal;
	},

	//Shot Chart Links
	//Assume data formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	FGTMA_formatter_shotChart : function(inValue, row, thisRow){
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{

		}
		return retVal;
	},


	//Shot Chart Links
	//Assume data formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	FGTMA_formatter_video : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));

    	result = new RegExp("SeasonType" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		seasonTypeValue = result && unescape(result[1]) || "";

		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue) || seasonTypeValue == "All Star"){
			return inValue; 
		}
		//Need to add that logic here
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
			}
		}
		else{

		}
		return retVal;
	},


	FT_PCT_formatter_video : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));

    	result = new RegExp("SeasonType" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		seasonTypeValue = result && unescape(result[1]) || "";

		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue) || seasonTypeValue == "All Star"){
			return inValue; 
		}
		//Need to add that logic here
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=FTA"; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
			}
		}
		else{

		}
		return retVal;
	},


	//Team and Player Gamelogs Page.
	FGTMA_formatter_video_Custom : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));

    	var resultseasonType = new RegExp("SeasonType" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonTypeValue = result && unescape(resultseasonType[1]) || "";

		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue) || seasonTypeValue == "Pre Season" || seasonTypeValue == "All Star"){
			return inValue; 
		}
		
		//Need to add that logic here
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			//Chek video flag if information avialble.
			if(rowdata.VIDEO_AVAILABLE != "undefined" && rowdata.VIDEO_AVAILABLE != null){
				if(!window.enableVideoBasedOnFlag(rowdata.VIDEO_AVAILABLE)){
					return retVal;
				}
			}
			var QString = "";
			if(rowdata.Game_ID != null && rowdata.Game_ID != ""){ QString += "GameID=" + rowdata.Game_ID; }
			if(rowdata.PLAYER_ID != null && rowdata.PLAYER_ID != ""){ QString += "PlayerID=" + rowdata.PLAYER_ID; }
			if(rowdata.TEAM_ID != null && rowdata.TEAM_ID != ""){ QString += "TeamID=" + rowdata.TEAM_ID; }
			if(rowdata.CFID != null && rowdata.CFID != ""){ QString += "CFID=" + rowdata.CFID; }
			if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
			if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
			QString += "&"+ window.currentGridShotChartParams;
			retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
		}
		else{
		}
		return retVal;
	},

	//Team and Player Gamelogs Page.
	FT_PCT_formatter_video_Custom : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));

    	var resultseasonType = new RegExp("SeasonType" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonTypeValue = result && unescape(resultseasonType[1]) || "";

		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue) || seasonTypeValue == "Pre Season" || seasonTypeValue == "All Star"){
			return inValue; 
		}
		
		//Need to add that logic here
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			//Chek video flag if information avialble.
			if(rowdata.VIDEO_AVAILABLE != "undefined" && rowdata.VIDEO_AVAILABLE != null){
				if(!window.enableVideoBasedOnFlag(rowdata.VIDEO_AVAILABLE)){
					return retVal;
				}
			}
			var QString = "";
			if(rowdata.Game_ID != null && rowdata.Game_ID != ""){ QString += "GameID=" + rowdata.Game_ID; }
			if(rowdata.PLAYER_ID != null && rowdata.PLAYER_ID != ""){ QString += "PlayerID=" + rowdata.PLAYER_ID; }
			if(rowdata.TEAM_ID != null && rowdata.TEAM_ID != ""){ QString += "TeamID=" + rowdata.TEAM_ID; }
			if(rowdata.CFID != null && rowdata.CFID != ""){ QString += "CFID=" + rowdata.CFID; }
			if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
			if(this.name != "") 			{ QString += "&ContextMeasure=FTA"; }
			QString += "&"+ window.currentGridShotChartParams;
			retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
		}
		else{
		}
		return retVal;
	},

	//Shot Chart Links
	//Assume data formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	MISC_formatter_shotChart: function(inValue, row, thisRow){
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
		var perMode = window.currentGridConfig.PerMode;
		
		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			//var rowdata = this.grid.getItem(index);
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
			else{
				retVal = data;
			}
			
		}
		else{

		}
		return retVal;
	},


	MISC_formatter_video: function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
		var perMode = window.currentGridConfig.PerMode;
		
		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			//var rowdata = this.grid.getItem(index);
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
			else{
				retVal = data;
			}
		}
		else{

		}
		return retVal;
	},



	//Shot Chart Links
	//Assume Percentage One decimal formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	toPercentageOneDecimal_shotChart_LeaguePlayer : function(inValue, row, thisRow){
		var data = inValue;
		var retVal = inValue;

		var rank = window.currentGridConfig.Rank;
		var perMode = window.currentGridConfig.PerMode;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			//var rowdata = this.grid.getItem(index);
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { 
					//QString += "&CFPARAMS=" + rowdata.CFPARAMS; 
					var PlayerTeamID = rowdata.CFPARAMS.split(",");
					QString += "PlayerID=" + PlayerTeamID[0]; 
					QString += "&TeamID=" + PlayerTeamID[1]; 
				}
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{
		}
		return retVal;
	},

	//Shot Chart Links
	//Assume data formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	FGTMA_formatter_shotChart_LeaguePlayer : function(inValue, row, thisRow){
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { 
					//QString += "&CFPARAMS=" + rowdata.CFPARAMS; 
					var PlayerTeamID = rowdata.CFPARAMS.split(",");
					QString += "PlayerID=" + PlayerTeamID[0]; 
					QString += "&TeamID=" + PlayerTeamID[1]; 
				}
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{

		}
		return retVal;
	},


	FGTMA_formatter_video_LeaguePlayer : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}

		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { 
					//QString += "&CFPARAMS=" + rowdata.CFPARAMS; 
					var PlayerTeamID = rowdata.CFPARAMS.split(",");
					QString += "PlayerID=" + PlayerTeamID[0]; 
					QString += "&TeamID=" + PlayerTeamID[1]; 
				}
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{

		}
		return retVal;
	},


	FT_PCT_formatter_video_LeaguePlayer : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}

		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { 
					//QString += "&CFPARAMS=" + rowdata.CFPARAMS; 
					var PlayerTeamID = rowdata.CFPARAMS.split(",");
					QString += "PlayerID=" + PlayerTeamID[0]; 
					QString += "&TeamID=" + PlayerTeamID[1]; 
				}
				if(this.name != "") 			{ QString += "&ContextMeasure=FTA"; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{

		}
		return retVal;
	},


	MISC_formatter_video_LeaguePlayer: function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
		var perMode = window.currentGridConfig.PerMode;
		
		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			//var rowdata = this.grid.getItem(index);
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { 
					//QString += "&CFPARAMS=" + rowdata.CFPARAMS; 
					var PlayerTeamID = rowdata.CFPARAMS.split(",");
					QString += "PlayerID=" + PlayerTeamID[0]; 
					QString += "&TeamID=" + PlayerTeamID[1]; 
				}
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
			else{
				retVal = data;
			}
		}
		else{

		}
		return retVal;
	},
	



	//Shot Chart Links
	//Assume Percentage One decimal formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	toPercentageOneDecimal_shotChart_LeagueTeam : function(inValue, row, thisRow){
		var data = inValue;
		var retVal = inValue;

		var rank = window.currentGridConfig.Rank;
		var perMode = window.currentGridConfig.PerMode;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			//var rowdata = this.grid.getItem(index);
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				QString += "TeamID=" + rowdata.TEAM_ID;
				//if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{
		}
		return retVal;
	},

	//Shot Chart Links
	//Assume data formatting already done 
	//Just adding shotchart link here
	//Using in teamStats,
	FGTMA_formatter_shotChart_LeagueTeam : function(inValue, row, thisRow){
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				QString += "TeamID=" + rowdata.TEAM_ID;
				//if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{

		}
		return retVal;
	},

	FGTMA_formatter_video_LeagueTeam : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}

		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				QString += "TeamID=" + rowdata.TEAM_ID;
				//if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{

		}
		return retVal;
	},

	FT_PCT_formatter_video_LeagueTeam : function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}

		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
	    var perMode = window.currentGridConfig.PerMode;
		var paceAdjust = window.currentGridConfig.PaceAdjust;

		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				//QString += "CFID=" + rowdata.CFID;
				QString += "TeamID=" + rowdata.TEAM_ID;
				//if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=FTA"; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
		}
		else{

		}
		return retVal;
	},


	MISC_formatter_video_LeagueTeam: function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}
		var retVal = inValue;
		var data = inValue;

		var rank = window.currentGridConfig.Rank;
		var perMode = window.currentGridConfig.PerMode;
		
		if(rank == "Y") { 
		}
		//Limited to Base Measuretype -- Remove when Enable for all the Measuretype
		//else if((perMode == "Totals" || perMode == "PerGame") && subCat == "Base"  && split != "clutch"){
		else if(perMode == "Totals" || perMode == "PerGame"){
			//Get row data
			//var rowdata = this.grid.getItem(index);
			var rowdata = thisRow[0];
			if(rowdata.CFID){
				var QString = "";
				QString += "TeamID=" + rowdata.TEAM_ID;
				//QString += "CFID=" + rowdata.CFID;
				//if(rowdata.CFPARAMS != null && rowdata.CFPARAMS != "") { QString += "&CFPARAMS=" + rowdata.CFPARAMS; }
				if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
				QString += "&"+ window.currentGridShotChartParams;
				retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,data);
				//retVal = '<a rel="shotchart" href="/shotchartPopup.html?'+QString+'">'+data+'</a>';
			}
			else{
				retVal = data;
			}
		}
		else{

		}
		return retVal;
	},


	//Boxscore Shotchart link formatter function
	boxscoreToPercentageOneDecimal_shotChart: function(inValue, row, thisRow){
		var retVal = inValue;
		var rowdata = thisRow[0];
		if (rowdata.SeasonCalYear >= 1996 && inValue != null){
			var SeasonType = ["Preseason","Regular Season","All Star","Playoffs"];
			var SeasonTypeItem = SeasonType[Number(rowdata.GAME_ID.charAt(2))-1];
			var QString = "";		
			QString += "SeasonType=" + SeasonTypeItem; 
			if(rowdata.SeasonYear != "") 		{ QString += "&Season=" + rowdata.SeasonYear; }
			if(rowdata.TEAM_ID) 		{ QString += "&TeamID=" + String(rowdata.TEAM_ID); }
			if(rowdata.PLAYER_ID) 		{ QString += "&PlayerID=" + String(rowdata.PLAYER_ID); }
			if(rowdata.GAME_ID) 		{ QString += "&GameID=" + String(rowdata.GAME_ID); }
			if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
			if(rowdata.Location != "") 		{ QString += "&ContextFilter=TEAM_GAME_LOCATION%3D'" + rowdata.Location + "'"; }
			retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,inValue);
			//retVal = '<a rel="shotchart" style="text-decoration: none;" href="/shotchartPopup.html?'+QString+'">'+inValue+'</a>';
		}		
		return retVal;
	},

	//Boxscore Shotchart link formatter function
	boxscoreFGTMA_formatter_shotChart : function(inValue, row, thisRow){
		var retVal = inValue;
		var rowdata = thisRow[0];

		if (rowdata.SeasonCalYear >= 1996  && inValue != null){
			var SeasonType = ["Preseason","Regular Season","All Star","Playoffs"];
			var SeasonTypeItem = SeasonType[Number(rowdata.GAME_ID.charAt(2))-1];
			var QString = "";		
			QString += "SeasonType=" + SeasonTypeItem; 
			if(rowdata.SeasonYear != "") 		{ QString += "&Season=" + rowdata.SeasonYear; }
			if(rowdata.TEAM_ID) 		{ QString += "&TeamID=" + String(rowdata.TEAM_ID); }
			if(rowdata.PLAYER_ID) 		{ QString += "&PlayerID=" + String(rowdata.PLAYER_ID); }
			if(rowdata.GAME_ID) 		{ QString += "&GameID=" + String(rowdata.GAME_ID); }
			if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
			if(rowdata.Location != "") 		{ QString += "&ContextFilter=TEAM_GAME_LOCATION%3D'" + rowdata.Location + "'"; }
			retVal = window.formatterLinkFunctions.createLinkBasedOnDevice(QString,inValue);
			//retVal = '<a rel="shotchart" style="text-decoration: none;" href="/shotchartPopup.html?'+QString+'">'+inValue+'</a>';
		}
		return retVal;
	},

	boxscoreFGTMA_formatter_video: function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}
		
		var retVal = inValue;
		var rowdata = thisRow[0];
		if (rowdata.SeasonCalYear >= 1996  && inValue != null){
			var SeasonType = ["Preseason","Regular Season","All Star","Playoffs"];
			var SeasonTypeItem = SeasonType[Number(rowdata.GAME_ID.charAt(2))-1];
			var QString = "";		
			QString += "SeasonType=" + SeasonTypeItem; 
			if(rowdata.SeasonYear != "") 		{ QString += "&Season=" + rowdata.SeasonYear; }
			if(rowdata.TEAM_ID) 		{ QString += "&TeamID=" + String(rowdata.TEAM_ID); }
			if(rowdata.PLAYER_ID) 		{ QString += "&PlayerID=" + String(rowdata.PLAYER_ID); }
			if(rowdata.GAME_ID) 		{ QString += "&GameID=" + String(rowdata.GAME_ID); }
			if(this.name != "") 			{ QString += "&ContextMeasure=" + this.name; }
			if(rowdata.Location != "") 		{ QString += "&ContextFilter=TEAM_GAME_LOCATION%3D'" + rowdata.Location + "'"; }
			retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,inValue);
			//retVal = '<a rel="shotchart" style="text-decoration: none;" href="/shotchartPopup.html?'+QString+'">'+inValue+'</a>';
		}
		return retVal;
	},

	boxscoreFT_PCT_formatter_video: function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}
		
		var retVal = inValue;
		var rowdata = thisRow[0];
		if (rowdata.SeasonCalYear >= 1996  && inValue != null){
			var SeasonType = ["Preseason","Regular Season","All Star","Playoffs"];
			var SeasonTypeItem = SeasonType[Number(rowdata.GAME_ID.charAt(2))-1];
			var QString = "";		
			QString += "SeasonType=" + SeasonTypeItem; 
			if(rowdata.SeasonYear != "") 		{ QString += "&Season=" + rowdata.SeasonYear; }
			if(rowdata.TEAM_ID) 		{ QString += "&TeamID=" + String(rowdata.TEAM_ID); }
			if(rowdata.PLAYER_ID) 		{ QString += "&PlayerID=" + String(rowdata.PLAYER_ID); }
			if(rowdata.GAME_ID) 		{ QString += "&GameID=" + String(rowdata.GAME_ID); }
			if(this.name != "") 			{ QString += "&ContextMeasure=FTA";}
			if(rowdata.Location != "") 		{ QString += "&ContextFilter=TEAM_GAME_LOCATION%3D'" + rowdata.Location + "'"; }
			retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,inValue);
			//retVal = '<a rel="shotchart" style="text-decoration: none;" href="/shotchartPopup.html?'+QString+'">'+inValue+'</a>';
		}
		return retVal;
	},



	boxscoreTO_formatter_video: function(inValue, row, thisRow){
		//Disabled Video -- NR
		//return inValue;

    	var result = new RegExp("Season" + "=([^&]*)", "i").exec(window.currentGridShotChartParams); 
		var seasonValue = result && unescape(result[1]) || "";
		seasonValue = Number(seasonValue.substr(0,4));
		//IF not desktop return from here and Season Prior to 2012
		if( IS_NOT_DESKTOP == true || window.globalGameVideoNotAvailableFlag == false
			|| seasonValue < 2012 || isNaN(seasonValue)){
			return inValue; 
		}
		
		var retVal = inValue;
		var rowdata = thisRow[0];
		if (rowdata.SeasonCalYear >= 1996  && inValue != null){
			var SeasonType = ["Preseason","Regular Season","All Star","Playoffs"];
			var SeasonTypeItem = SeasonType[Number(rowdata.GAME_ID.charAt(2))-1];
			var QString = "";		
			QString += "SeasonType=" + SeasonTypeItem; 
			if(rowdata.SeasonYear != "") 		{ QString += "&Season=" + rowdata.SeasonYear; }
			if(rowdata.TEAM_ID) 		{ QString += "&TeamID=" + String(rowdata.TEAM_ID); }
			if(rowdata.PLAYER_ID) 		{ QString += "&PlayerID=" + String(rowdata.PLAYER_ID); }
			if(rowdata.GAME_ID) 		{ QString += "&GameID=" + String(rowdata.GAME_ID); }
			if(this.name != "") 			{ QString += "&ContextMeasure=" + "TOV"; }
			if(rowdata.Location != "") 		{ QString += "&ContextFilter=TEAM_GAME_LOCATION%3D'" + rowdata.Location + "'"; }
			retVal = window.formatterLinkFunctions.createVideoLinkBasedOnDevice(QString,inValue);
			//retVal = '<a rel="shotchart" style="text-decoration: none;" href="/shotchartPopup.html?'+QString+'">'+inValue+'</a>';
		}
		return retVal;
	},
};




var graphFunctions = {
   graphPlayer : function( tableName, xAxisName, yAxisName, data ) {
      //console.log( tableName + ' ' + xAxisName + ' ' + yAxisName);
      //console.log(data);
   },
}
