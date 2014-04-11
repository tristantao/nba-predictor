// Grid Formatter Functions
//Current grid configuration to use in formatter function

var currentGridConfig = {
        "subCategory" : "Base",
        "PerMode" : "Totals",
        "PaceAdjust" : "N",
		"Rank" : "N",
};

//Current Page Status in String format to pass the information as a query String in ShotChart Link
var currentGridShotChartParams = "";

/*** Grid Configuration ***/
var gameDetailBoxscoreStat = {
		"mainCategory" : {
			"default": {"total": 2, "items": ["Home","Visit"]}
		},
		"dataParts": ["htm","vtm"],
		"subCategory" : {
			"default" :  ["MIN","FGM","FGA","FG_PCT","FG3M","FG3A","FG3_PCT","FTM","FTA","FT_PCT","OREB","DREB","REB","AST","TO","STL","BLK","PF","PTS","PLUS_MINUS"],
			"playerTracking" :      ["MIN","DIST","SPD","TCHS","PASS","AST","SAST","FTAST",/*"DFGM","DFGA","DFG_PCT",*/"ORBC","DRBC","RBC","FG_PCT","CFGM","CFGA","CFG_PCT","UFGM","UFGA","UFG_PCT"],
			"playerTrackingFull" :  ["MIN","DIST","SPD","TCHS","PASS","AST","SAST","FTAST","DFGM","DFGA","DFG_PCT","ORBC","DRBC","RBC","FG_PCT","CFGM","CFGA","CFG_PCT","UFGM","UFGA","UFG_PCT"]		
		},
		"currentGrids" :{
			"category" : "default",
			"subCategory" : "default",
			"activeGrids" : [],
			"loadedGrids" : [],
			"response": {}
		},
		"layoutConfig": {
			"default" : {
				"Home" : 	{ label: 'Players', name: 'PLAYER_NAME', dataFormatType:"text", linkAs: window.formatterLinkFunctions.playerProfileLinkPlusPosition, width:"120px"},
				"Visit" : 	{ label: 'Players', name: 'PLAYER_NAME', dataFormatType:"text", linkAs: window.formatterLinkFunctions.playerProfileLinkPlusPosition, width:"120px"},
				"MIN": 		{ name: 'MIN_SORT', dataFormatType: "number", dataAs: window.formatterDataFunctions.boxscoreMIN, linkAs: window.formatterLinkFunctions.MINSort },
				"FGM": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_shotChart},
				"FGA": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_shotChart},
				"FG_PCT": 	{ linkAs: window.formatterLinkFunctions.boxscoreToPercentageOneDecimal_shotChart},
				"FG3M": 	{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_shotChart},
				"FG3A": 	{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_shotChart},
				"FG3_PCT": 	{ linkAs: window.formatterLinkFunctions.boxscoreToPercentageOneDecimal_shotChart},
				"FTM": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"FTA": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"FT_PCT": 	{ linkAs: window.formatterLinkFunctions.boxscoreFT_PCT_formatter_video},
				"OREB": 	{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"DREB": 	{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"REB": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"AST": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"TO": 		{ label: 'TOV', linkAs: window.formatterLinkFunctions.boxscoreTO_formatter_video},
				"STL": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"BLK": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video},
				"PF": 		{ },
				"PTS": 		{ linkAs: window.formatterLinkFunctions.boxscoreFGTMA_formatter_video },
				"PLUS_MINUS": { }
			},
			"playerTracking" : {
				"Home" : 	{ label: 'Players', name: 'PLAYER_NAME', dataFormatType:"text", linkAs: window.formatterLinkFunctions.playerProfileLinkPlusPosition, width:"120px"},
				"Visit" : 	{ label: 'Players', name: 'PLAYER_NAME', dataFormatType:"text", linkAs: window.formatterLinkFunctions.playerProfileLinkPlusPosition, width:"120px"},
				"MIN": 		{ name: 'MIN_SORT', dataFormatType: "number", dataAs: window.formatterDataFunctions.boxscoreMIN, linkAs: window.formatterLinkFunctions.MINSort },
				"AST": 		{ linkAs: window.formatterLinkFunctions.FGTMA_formatter},
				"FG_PCT": 	{ linkAs: window.formatterLinkFunctions.toPercentageOneDecimal}
			}
		}
};
/*** Grid Configuration ***/

/*** Grid Methods ***/
//Standard function to init grid
//Pass the required parameters to init a Dojo Grid
var createGrid = function(gridId,store,layout,gridContainerId,subCat){

	   //Do not enable ToPNG plugin in older browser like IE8 and 9
	   var toPNGFlag = $.getPNGFlagBasedOnBrowseer();

       //Cross hair effect on hover disabled on mobile
       var crossHoverOffVar = true;
       if(IS_MOBILE){
			crossHoverOffVar = true;
       }

	   var $grid = $("#"+gridContainerId);
	   $grid.jsgrid({
	      	datatype: "json",
	   		datastr: store,
	      	gridName: gridId,
	   		columns: layout.cells,
	   		rowsPerPage: store.length,
	   		freezeColumnCount: layout.freezeColumnCount,  
	      	footername: gridContainerId+"-footer",
	      	colArrangeMode: true,
	      	toPNG : toPNGFlag,
	      	minCellWidth: "45px",
	      	disableCallback : true,
	      	crossHoverOff: crossHoverOffVar,
	      	hideFooter: true,
	   });

        //Init Slider for Mobile.
        if(IS_MOBILE){
            window.initMobileSlider(gridContainerId);   
        }

		//Loaded Grids
		if (subCat == "default") 
			gameDetailBoxscoreStat.currentGrids.loadedGrids.push(gridContainerId);

		// crosshover is turned off, but still change row bg on hover
		$grid.find('tr').hover(
			function(){
				$(this).find('td').addClass('crosshover');
			}, 
			function(){
				$(this).find('td').removeClass('crosshover');
			}
		);
};

//Destroy the grid
var destroyGrid = function(gridId){
   var $grid = $("#"+gridId);
   $grid.jsgrid("destroyGrid");

    //Destroy Slider in Mobile
    if(IS_MOBILE){
        window.destroyMobileSlider(gridId);
    }

};

//Calculate the layout to create a Grid
//Pass the Category and SubCategory of the Stat Tab configuration
var calcLayout = function(subCat, view, playerTrackinFlag){
	var cells = [];
	var newLayout = {
		freezeColumnCount: 1,
		cells: cells
	};

	if(subCat == "playerTracking" && playerTrackinFlag == 1){
		playerTrackinFlag = "Full"
	}
	
	var layoutConfig = gameDetailBoxscoreStat.layoutConfig[subCat];
	if(layoutConfig[view+"_"+subCat])
		cells.push( layoutConfig[view+"_"+subCat] );
	else
		cells.push( layoutConfig[view] );
	
	var commonColumns;
	if(gameDetailBoxscoreStat.subCategory[subCat+"_"+view])
		commonColumns = gameDetailBoxscoreStat.subCategory[subCat+"_"+view];
	else if(gameDetailBoxscoreStat.subCategory[subCat+playerTrackinFlag])
		commonColumns = gameDetailBoxscoreStat.subCategory[subCat+playerTrackinFlag];
	else
		commonColumns = gameDetailBoxscoreStat.subCategory[subCat];
		
	var colCount;
	for(colCount=0; colCount<commonColumns.length;colCount++){
		var cell = commonColumns[colCount];
		var cellInfo = {};
		$.extend(cellInfo, window.masterLayoutConfigNBA[cell], layoutConfig[cell]);
		cells.push(cellInfo);
	}

	newLayout.cells = cells;
    return newLayout;
};

//Init All Grids
var initGameDetailBoxscoreGridsNBA = function(resp,options, subCat, playerTrackingAvalFlag){
		//Category
		var cat = "default";
		//Possible combination for selected category and subcategory
		var perMainCat = gameDetailBoxscoreStat.mainCategory[cat];
		var SeasonCalYear = parseInt(resp.game.SEASON);
		var SeasonYear = $.yearToSeason(parseInt(resp.game.SEASON));

		//Save the current parameter for ShotChart link information
		var gameInfo = { GameID : resp.game.GAME_ID, Season: resp.game.SEASON };
		currentGridShotChartParams = window.makeQueryStringFromObject(gameInfo);

		var contCount;
		//Create or Display required grid container for selected category and subCategory
		var extraIDPart = "";
		if (subCat !== "default") {
			extraIDPart = subCat.substr(0,1).toUpperCase() + subCat.substr(1);
		}
		for(contCount=0;contCount<perMainCat.total;contCount++){
			//Grid Container ID
			var containerId = "gameDetail" + extraIDPart + "Boxscore" + perMainCat.items[contCount] + "GridContainer";
			//Grid ID
			var gridId = "gameDetailPlayer" + extraIDPart + perMainCat.items[contCount] + "Grid";
			
			//set up data store
			var teamIdentifier = gameDetailBoxscoreStat.dataParts[contCount];
			var teamData = resp.teams[teamIdentifier];
			var	data_list = teamData.playerStats;
			if (subCat !== "default") {
				data_list = teamData[subCat + "PlayerStats"];
			}

			var rows = data_list.length;
			var teamGameLocation = (teamIdentifier == "htm" ? "Home" : "Road");

			if(rows > 0){
				for(var i=0; i<rows; i++){
					data_list[i].Location = teamGameLocation;
					data_list[i].SeasonYear = SeasonYear;
					data_list[i].SeasonCalYear = SeasonCalYear;

					if(data_list[i].COMMENT != ""){
						data_list[i]["MIN_SORT"] = 0;
						data_list[i].MIN = data_list[i].COMMENT;
						data_list[i].doNotSort = true;
						//data_list[i].MIN: teamData.MIN,
						//data_list[i].PLUS_MINUS = data_list[i].COMMENT;
					}
					else{
						data_list[i]["MIN_SORT"] = parseInt(Number(String(data_list[i].MIN).replace(":", ".")));
					}
				}

				var totalRow = {};
				$.extend(totalRow,{
					"PLAYER_NAME": "Totals",
					"GAME_ID": teamData.GAME_ID,
					"TEAM_ID": teamData.TEAM_ID,
					"SeasonYear": SeasonYear,
					"SeasonCalYear": SeasonCalYear,
					"COMMENT": "",
					"IncludeInSort": false,
					"Location": teamGameLocation,
					"MIN_SORT": 0,
					"doNotSort": true});
				var totalTeamData = teamData;
				if (subCat !== "default") {
					totalTeamData = teamData[subCat + "TeamStats"];
				}
				var fields = gameDetailBoxscoreStat.subCategory[subCat];
				//Differenciate between Player Tracking Full or limited.
				if(subCat == "playerTracking" && playerTrackingAvalFlag == 1){
					fields = gameDetailBoxscoreStat.subCategory[subCat+"Full"];
				}
				var fieldsLength = fields.length;
				for (var i = 0; i < fieldsLength; ++i) {
					var fieldName = fields[i];
					if(totalTeamData[fieldName] == undefined){
						totalRow[fieldName] = "-";
					}
					else{
						totalRow[fieldName] = totalTeamData[fieldName];
					}
				}

				data_list.push(totalRow);
				var layout = calcLayout( subCat, perMainCat.items[contCount], playerTrackingAvalFlag);

				//Create a dojo Grid
				createGrid(gridId,data_list,layout,containerId,subCat);
				if (subCat == "default") {
					gameDetailBoxscoreStat.currentGrids.activeGrids.push(containerId);
				} else if (subCat == "playerTracking") {
					// add caption into header until Caption property is supported
					$("#" + containerId + "-header").prepend($("<span>").html("Player Tracking provided by SportVU").addClass("grid-caption"));
				}
			}
		}
};
/*** Grid Methods ***/

