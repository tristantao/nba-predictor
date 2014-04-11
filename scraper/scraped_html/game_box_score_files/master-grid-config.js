//Max number of custom filter 
var maxCustomFilter = 5;

var teamPlayerDisabledSplits = [
	{ name: 'PlayerPosition'},
	{ name: 'StarterBench'},
	{ name: 'PlayerExperience'},	
];

//Video is available or not flag
var globalGameVideoNotAvailableFlag = true;
var byPassRequestForVideo = false;

var tooltipTemplate = {
	shotchartVideoMenu:  [
		'<div class="shotchartOrVideoMenu">',

		'	<div class="mainMenu">',
			'{{if mainMenu.video }}',
		'		<a id="videoMenu" class="statVideo" href="${mainMenu.video.link}" lightboxtitle="${mainMenu.video.title}">Watch Video</a>',
			'{{/if}}',
			'{{if mainMenu.videoshotchart == true }}',
		'		<span class="menuSeperator"> | </span>',
			'{{/if}}',
			'{{if mainMenu.shotchart }}',
		'		<a id="shotchartMenu" class="toggleMenu" href="#">Shotchart</a>',
		'	</div>',
			'{{/if}}',

			'{{if subMenu.shotchart }}',
		'	<div class="shotchartMenu subMenu">',
		'		<a class="statShotchartLightBoxLink" href="${subMenu.shotchart.link}&display-mode=performance&zone-mode=zone&viewShots=false" lightboxtitle="${subMenu.shotchart.title}">Shot Performance</a>',
		'		<a class="statShotchartLightBoxLink"  href="${subMenu.shotchart.link}&display-mode=distribution&zone-mode=zone&viewShots=false" lightboxtitle="${subMenu.shotchart.title}">Shot Distribution</a>',
		'		<a class="statShotchartLightBoxLink"  href="${subMenu.shotchart.link}&display-mode=performance&zone-mode=zone&viewShots=true" lightboxtitle="${subMenu.shotchart.title}">Shot Plot</a>',
		'	</div>',
			'{{/if}}',

		'	<div class="menuInfo">',
		'		<span class="measure">${menuInfo.measure}</span>',
			'{{if menuInfo.description }}',
		'		<span class="menuInfoSeperator"> - </span>',
		'		<span class="description">${menuInfo.description}</span>',
			'{{/if}}',
		'	</div>',

		'</div>',
	].join("")
};	

//Video/SHotchart Dialog
//Init Dialog for Shotchart/Video Option
var initShotchartVideoDialog = function(){
	
	//Complile template
	$.template("shotchartVideoMenu", tooltipTemplate.shotchartVideoMenu);

	$("#shotchartVideodialog").dialog({
      autoOpen: false,
      resizable: false,
      draggable: false,
      modal: true,
      width: 1070,
      height: 710,
      close: function(){
		//Remove old iframe
		var $iframe = $('#lightBoxContentIframe');
		if ( $iframe.length ) {
			$iframe.remove();
		}
	  }
    });	

    $(".shotchartOrVideoMenu .mainMenu  a.toggleMenu").live("click",function(e){
		e.preventDefault();
		e.stopPropagation();

		//Get the clicked Menu Item 
		var $menuItem = $(e.currentTarget);
		var menuId = $menuItem.attr("id");
		//Toggle on click again
		if($menuItem.hasClass("active")){
			$menuItem.removeClass("active");
			$(".shotchartOrVideoMenu ."+menuId+".subMenu").slideUp("slow");
		}
		else{
			//Set to default status
			$(".shotchartOrVideoMenu .mainMenu a").removeClass("active");
			$(".shotchartOrVideoMenu .subMenu").slideUp("slow");
			$menuItem.addClass("active");
			$(".shotchartOrVideoMenu ."+menuId+".subMenu").slideDown("slow");
		}
    });

    
	//Close dialog on some where else click
	$('body').bind('click',function(e){
		var $target = $(e.target);
		var $currTarget = $(e.currentTarget);
		//Check click happened on Menu
		if($currTarget.hasClass("toggleMenu") || $target.hasClass("toggleMenu") 
			|| $currTarget.hasClass("shotchartOrVideo") || $target.hasClass("shotchartOrVideo")
			|| byPassRequestForVideo == true){
				byPassRequestForVideo = false;
				return;
		}

		//Remove old iframe and Close Dialog if Open already
	    if( $('#shotchartVideodialog').dialog('isOpen')
	    	&& !($(e.target).is('.ui-dialog, a') )
	    	&& !($(e.target).closest('.ui-dialog').length)
	    ){
		     $('#shotchartVideodialog').dialog('close');
	   	 var $iframe = $('#lightBoxContentIframe');
	   	 if ( $iframe.length ) {
	   		$iframe.remove();
	   	 }
	    }

	    //If shotchart or video menu exist close it
	    if($(".shotchartOrVideoMenu").length > 0){
			// hide any menus when clicking outside
			$('.shotchartOrVideoMenu').slideUp('slow',function(){
				//Remove Menu
				$(".shotchartOrVideoMenu").remove();
				//Remove tooltip arrow
				$(".shotchart-video-menu-tooltip-arrow").remove();
				//Remove old active cells
		   	$("table.jsgrid td.active").removeClass("active");
			});
	    }
    });

	//ByPass Link for LightBox Iframe
	//TITLE format should be  Player Info | Team Info | description
    $("#lightBoxByPassLink").click(function(e, URL, TITLE, shotchartFlag){
		e.preventDefault();
		e.stopPropagation();

		var dialogWidth =  825;
		var dialogHeight =  420;
		var videoFlag = true;

		if(shotchartFlag == true){
			dialogWidth =  1070;
			dialogHeight =  710;
			videoFlag = false;
		}

		//Enable ByPass flag 
		byPassRequestForVideo = true;

   	//CLose the Dialog
   	$( "#shotchartVideodialog").dialog("close");
			//If already have Title Do not set title
			if($(".ui-dialog .ui-dialog-titlebar .ui-dialog-title").children().length > 0){
				if(TITLE){
					var lightBoxTitleArr = TITLE.split("|");
					var lightboxTitle = titleArrtoDOM(lightBoxTitleArr);
			   	//Setup Dialog for Video
			   	$( "#shotchartVideodialog").dialog({title:lightboxTitle, width: dialogWidth, height: dialogHeight});
				}
				else{
			   	//Setup Dialog for Video
			   	$( "#shotchartVideodialog").dialog({ width: dialogWidth, height: dialogHeight});
		  		 }
			}
			//Add title too here
			else{
				var lightboxTitle = "";
				var lightBoxTitleArr = [];
					if(TITLE){
						lightBoxTitleArr = TITLE.split("|");
						lightboxTitle = titleArrtoDOM(lightBoxTitleArr);
					}
					else{
						var titleInfo = "";
						//Player name if available
						if($(".player-branding .player-name").length > 0){
							titleInfo += $(".player-branding .player-name").html() + "|";
						}else{
							titleInfo += "|";
						}

						//Team name if available
						if($(".team-branding .team-name").length > 0){
							titleInfo += $(".team-branding .team-name").html() + "|";
						}else{
							titleInfo += "|";
						}
						//Title information
						titleInfo += "Field Goal Percentage ";
						if($("#Season .labeltext").length > 0){
							titleInfo += $("#Season").attr("value") + " ";
						}
						if($("#SeasonType .labeltext").length > 0){
							titleInfo += $("#SeasonType").attr("value") + " ";
						}
						lightBoxTitleArr = titleInfo.split("|");
						lightboxTitle = titleArrtoDOM(lightBoxTitleArr);
					}
					
			   	//Setup Dialog for Video
			   	$( "#shotchartVideodialog").dialog({title: lightboxTitle, width: dialogWidth, height: dialogHeight});
			}

	   	//Open LightBox with this URL Video
	   	openShotchartOrVideoDialog(URL, videoFlag);
    });

    var findValueFromURL = function(URL, name){
   	var result = new RegExp(name + "=([^&]*)", "i").exec(URL); 
		return result && unescape(result[1]) || "";
    };

    var setLightBoxTitleBasedOnURL = function(URL,event){
   	var title = "";
   	var playerInfo = "";
   	var teamInfo = "";
   	var titleInfo = "";
   	var titleObj = [];

   	if(URL == undefined || URL == "" || URL == null){
   		return title;
   	}

   	//Find Context Measure from URL
		var cntxMeasure = findValueFromURL(URL,"ContextMeasure")
   	//Based on page create title
   	var currentPath = location.pathname;
   	//Team Stats
   	if(currentPath.search("teamStats.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

   		var $keyGridInfoNode = $(event.target).parent().parent().siblings().filter(":first").children(":first-child");
   		var keyGridInfoNodeText = $keyGridInfoNode.find("span.label-value").html();
   		titleInfo += keyGridInfoNodeText;

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyRowInfoNodeText = $keyRowInfoNode.attr("data-value");
   		if(keyGridInfoNodeText != keyRowInfoNodeText){
   			titleInfo += " (" + keyRowInfoNodeText + ") ";	
   		}

   		teamInfo += $(".team-branding h1.team-name").html();
   	}
   	//Player Stats
   	else if(currentPath.search("playerStats.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

   		var $keyGridInfoNode = $(event.target).parent().parent().siblings().filter(":first").children(":first-child");
   		var keyGridInfoNodeText = $keyGridInfoNode.find("span.label-value").html();
   		titleInfo += keyGridInfoNodeText;

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyRowInfoNodeText = $keyRowInfoNode.attr("data-value");
   		if(keyGridInfoNodeText != keyRowInfoNodeText){
   			titleInfo += " (" + keyRowInfoNodeText + ") ";	
   		}
			playerInfo += $(".player-branding h1.player-name").html();
   	}
   	//BoxscorePage
   	else if(currentPath.search("gameDetail.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
   		titleInfo += $("#matchup-header").html();

   		var $keyInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyInfoNodeText = $keyInfoNode.attr("data-value");
			//Get the Team Name
			var $tableInfo = $(event.target).closest("table.jsgrid");
			if($tableInfo.attr("id").search("Home") != -1){
				teamInfo = $("#homeTeamTitle").html();
			}
			else{
				teamInfo = $("#visitTeamTitle").html();
			}
   		if(keyInfoNodeText != "Totals"){
   			playerInfo += keyInfoNodeText;	
   		}
   	}
   	//League Team Pages
   	else if(currentPath.search("leagueTeamGeneral.html") != -1  
   			|| currentPath.search("leagueTeamClutch.html") != -1
   			|| currentPath.search("leagueTeamGeneralAllStar.html") != -1 
   			|| currentPath.search("leagueTeamClutchAllStar.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyRowInfoNodeText = $keyRowInfoNode.attr("data-value");

   		if(keyRowInfoNodeText){
   			teamInfo += keyRowInfoNodeText;
   		}
   	}
   	//League Player Pages
   	else if(currentPath.search("leaguePlayerGeneral.html") != -1  || currentPath.search("leaguePlayerClutch.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyRowInfoNodeText = $keyRowInfoNode.attr("data-value");
   		if(keyRowInfoNodeText){
   			playerInfo += keyRowInfoNodeText;
   		}
   	}
   	//Team Gamelogs
   	else if(currentPath.search("teamGameLogs.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyRowInfoNodeText = $keyRowInfoNode.children().first().html();
   		if(keyRowInfoNodeText){
   			titleInfo += keyRowInfoNodeText;	
   		}

   		teamInfo += $(".team-branding h1.team-name").html();
   	}

   	//Player Gamelogs
   	else if(currentPath.search("playerGameLogs.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyRowInfoNodeText = $keyRowInfoNode.children().first().html();
   		if(keyRowInfoNodeText){
   			titleInfo += keyRowInfoNodeText;
   		}
			playerInfo += $(".player-branding h1.player-name").html();
   	}

   	//Team Players page
   	else if(currentPath.search("teamPlayers.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":first");
   		var keyRowInfoNodeText = $keyRowInfoNode.children().first().html();
   		if(keyRowInfoNodeText){
   			playerInfo += keyRowInfoNodeText;
   		}

   		teamInfo += $(".team-branding h1.team-name").html();
   	}

   	//Leaders Page
   	else if(currentPath.search("leadersGrid.html") != -1){
	   	if(cntxMeasure){
				titleInfo +=  window.masterLayoutConfigNBA[cntxMeasure].filterLabel + " during ";
	   	}
	   	titleInfo += findValueFromURL(URL,"Season") + " ";
	   	titleInfo += findValueFromURL(URL,"SeasonType")+ " ";

			var $keyRowInfoNode = $(event.target).parent().siblings().filter(":nth-child(2)");
   		var keyRowInfoNodeText = $keyRowInfoNode.attr("data-value");
   		if(keyRowInfoNodeText){
   			playerInfo += keyRowInfoNodeText;
   		}
   	}
   	
		//Combine the title information   	
		titleObj.push(playerInfo);
		titleObj.push(teamInfo);
		titleObj.push(titleInfo);
		titleObj.push(cntxMeasure);
   	return titleObj;
    };

    var titleArrtoDOM = function(titleArr){
   	var titleDOM = '';
   	if(titleArr[0]  && (titleArr[0].length>0) && titleArr[1] && (titleArr[1].length>0) ){
   		titleDOM += '<span class="playerName">'+titleArr[0]+'</span>';
   		titleDOM += '<span class="teamNameSmall">('+titleArr[1]+')</span>';
   	}
   	else{
	   	if(titleArr[0] && (titleArr[0].length>0)){ 
	   		titleDOM += '<span class="playerName">'+titleArr[0]+'</span>';
	   	}
	   	if(titleArr[1] && (titleArr[1].length>0)){
	   		titleDOM += '<span class="teamName">'+titleArr[1]+'</span>';		
	   	}
   	}
   	if(titleArr[2] && (titleArr[2].length>0)){
	  		titleDOM += '<span class="titleString">'+titleArr[2].replace('vs.','@')+'</span>';
	  	}
   	return titleDOM;
    };

	$("a.shotchartOrVideo").live("click", function(e){
		e.preventDefault();
		e.stopPropagation();

		//Base on Sub menu item extra query parameter for shotchart
		var shotchartPerformance = '&display-mode=performance&zone-mode=zone&viewShots=false';
		var shotchartDistribution = '&display-mode=distribution&zone-mode=zone&viewShots=false';
		var shotchartPlot = '&display-mode=performance&zone-mode=zone&viewShots=true';

   	//New active cell
		$(e.currentTarget).parent().addClass("active");

		var cell = $(e.currentTarget.parentElement);
		var cellPosition = cell.offset();
		var cellWidth = Number(cell.width()) / 2;
		var cellHeight = Number(cell.height());
		cellPosition.left += cellWidth;
		cellPosition.top += cellHeight;

		//Get shotchart and video link
		var shotchartLink, videoLink;
		var shotchartLinkTitle, videoLinkTitle;
		shotchartLink = $(e.currentTarget).attr("shotchart");
		videoLink = $(e.currentTarget).attr("video");

		// get urlObject querey parameters
		var currentQP = $.getQueryParametersCustom();
		if(currentQP.StartRange && currentQP.EndRange && currentQP.RangeType){
			var rangeFilterQP = "&StartRange=" + currentQP.StartRange + "&EndRange=" + currentQP.EndRange + "&RangeType=" + currentQP.RangeType;						
			shotchartLink += rangeFilterQP;
			videoLink += rangeFilterQP;
		}


		var shortchartTitleArr = setLightBoxTitleBasedOnURL(shotchartLink,e);
		var videoTitleArr = setLightBoxTitleBasedOnURL(videoLink,e);
		if(shortchartTitleArr.length > 0){ shotchartLinkTitle = shortchartTitleArr.join("|");}
		else{ shotchartLinkTitle = ""; }
		if(videoTitleArr.length > 0){ videoLinkTitle = videoTitleArr.join("|"); }
		else{ videoLinkTitle = ""; }

		//Menu Object to build up tooltip menu
	    var menuObject = {
	   	mainMenu: {
	   		videoshotchart: false,	
	   	},
	   	subMenu: {},
	   	menuInfo:{}
	    };

	    //Make a menu Object for Menu tooltip
	    if(videoLink && shotchartLink){
	   	menuObject.mainMenu.videoshotchart = true;
	    }

	    if(videoLink){
	   	menuObject.mainMenu.video = {};
	   	menuObject.mainMenu.video.link = getHostNameForVideos() + videoLink;
			menuObject.mainMenu.video.title = videoLinkTitle;
	    }
	    if(shotchartLink){
			menuObject.mainMenu.shotchart = {};
			menuObject.mainMenu.shotchart.link = "#";

			menuObject.subMenu.shotchart = {};
			menuObject.subMenu.shotchart.link = shotchartLink;
			menuObject.subMenu.shotchart.title = shotchartLinkTitle;
	    }
	    if(shortchartTitleArr[3]){
			menuObject.menuInfo.measure = shortchartTitleArr[3];
	    }
	    else if(videoTitleArr[3]){
			menuObject.menuInfo.measure = videoTitleArr[3];
	    }

		//tooltip Arrow and Menu
		var $tooltipArrow = $('<div class="shotchart-video-menu-tooltip-arrow"></div>');
		var $menu = $.tmpl("shotchartVideoMenu", [menuObject]);
		$tooltipArrow.css({ 
			'position' : 'absolute',
			'top' : cellPosition.top + 'px',
			'left' : cellPosition.left + 'px',
			'z-index' : 1000,
			'display' : 'none'
		});
		$menu.css({ 
			'position' : 'absolute',
			'top' : (cellPosition.top + 8) + 'px',
			'left' : (cellPosition.left - 10) + 'px',
			'z-index' : 999,
			'display' : 'none'
		});

		if($('.shotchartOrVideoMenu').length > 0){
			// hide any menus when clicking outside
			$('.shotchartOrVideoMenu').slideUp('fast',function(){
				//Remove Menu
				$(".shotchartOrVideoMenu").remove();
				//Remove tooltip arrow
				$(".shotchart-video-menu-tooltip-arrow").remove();
				//Remove old active cells
		   	$("table.jsgrid td.active").removeClass("active");

				$('body').append($tooltipArrow);
				$('body').append($menu);
				$tooltipArrow.slideDown("fast");
				$menu.slideDown("fast");
			});
		}
		else{
			$('body').append($tooltipArrow);
			$('body').append($menu);
			$tooltipArrow.slideDown("fast");
			$menu.slideDown("fast");
		}
	});

	$("a.shotchartExtrenal").live("click", function(e){
		e.preventDefault();
		e.stopPropagation();

		var clickItem = $(e.target);
		var URL = clickItem.attr("shotchart");
		var title = clickItem.attr("title");
		$("#lightBoxByPassLink").trigger("click",[URL,title,true]);
	});

	var openShotchartOrVideoDialog = function( link, isVideo){
		var widthIframe = "1070px";
		var heightIframe = "700px"
		//Set height and width for video lightbox
		if(isVideo == true){
			widthIframe = "820px";
			heightIframe = "400px";
		}

   	//Remove old iframe
   	var $iframe = $('#lightBoxContentIframe');
   	if ( $iframe.length ) {
   		$iframe.remove();
   	}

		// hide any menus when clicking outside
		$('.shotchartOrVideoMenu').fadeOut('fast').remove();
		//Remove tooltip arrow
		$(".shotchart-video-menu-tooltip-arrow").remove();
   	//Remove all active cells
   	$("table.jsgrid td.active").removeClass("active");

   	//New Iframe
   	$('<iframe id="lightBoxContentIframe" frameborder="0" style="border: none;" src="'+ link +'" width="'+widthIframe+'" height="'+heightIframe+' "></iframe>').appendTo('#lightBoxContent');
		
		// add social sharing
		$("#social-icons.modal").remove();
		if ( link.indexOf('cvp.html') != -1 ) {
			addModalSocialSharing(link);			
		}

   	//Open dialog
   	$( "#shotchartVideodialog").dialog("open");
	};


	$('a.statShotchart').live('click', function(e){
		e.preventDefault();
		e.stopPropagation();
	});

	//shotchart link click from tooltip menu 
	$('a.statShotchartLightBoxLink').live('click', function(e){
		e.preventDefault();
		e.stopPropagation();

		var $target = $(e.target);
		var URL = $target.attr("href");
		var lightBoxTitleArr = $target.attr("lightBoxtitle").split("|");
		var lightBoxTitle = titleArrtoDOM(lightBoxTitleArr);

		$( "#shotchartVideodialog").dialog({title: lightBoxTitle, width: 1070, height: 710});
		openShotchartOrVideoDialog(URL, false);
	});

	//Video link click from tooltip menu
	$('a.statVideo').live('click', function(e){
		e.preventDefault();
		e.stopPropagation();

		var $target = $(e.target);
		var URL = $target.attr("href");
		var lightBoxTitleArr = $target.attr("lightBoxtitle").split("|");
		var lightBoxTitle = titleArrtoDOM(lightBoxTitleArr);

		$( "#shotchartVideodialog").dialog({title: lightBoxTitle, width: 825, height: 420});
		openShotchartOrVideoDialog(URL, true);
	});
	//Disabled Video -- NR
};


/*
81: point to dev.stats.nba.com cvp player 
Dev: point to dev.stats.nba.com cvp player
show videos if set to flag 1 or 2

Prod: point to stats.nba.com cvp player
show videos if set to flag 1 only
*/
var getHostNameForVideos = function(){
		var hostName = "http://stats.nba.com/";
		if(location.hostname == "dev.stats.nba.com" || 
		   (location.hostname == "linuxpubstats.nba.com" && location.port == "81")){
			hostName = "http://dev.stats.nba.com/";
		}
		return hostName;
};

/*
81: point to dev.stats.nba.com cvp player 
Dev: point to dev.stats.nba.com cvp player
show videos if set to flag 1 or 2

Prod: point to stats.nba.com cvp player
show videos if set to flag 1 only
*/
var enableVideoBasedOnFlag = function(videoFlag){
	var retFlag = true;
	if(location.hostname == "dev.stats.nba.com" || 
	   (location.hostname == "linuxpubstats.nba.com" && location.port == "81")){
		if(videoFlag <= 0){
			retFlag = false;
		}
	}else {
		if(videoFlag != 1){
			retFlag = false;
		}
	}
	return retFlag;
};



//Update Team links
var teamSeasonChangeLinkUpdate = function(){
	//Get current query parameter
	var currentQpObject = $.getQueryParametersCustom();	
	var qpParams = "TeamID="+currentQpObject.TeamID;
	//Season Parameter
	if(currentQpObject.Season != undefined){
		qpParams += "&Season="+currentQpObject.Season;
	}
	//SeasonType Parameter
	if(currentQpObject.SeasonType != undefined){
		qpParams += "&SeasonType="+currentQpObject.SeasonType;
	}
	//Update the team links
	$("#tab-profile").attr("href", "/teamProfile.html?"+qpParams);
    $("#tab-stats").attr("href", "/teamStats.html?"+qpParams);
    $("#tab-players").attr("href", "/teamPlayers.html?"+qpParams);
    $("#tab-lineups").attr("href", "/teamLineups.html?"+qpParams);
	$("#tab-OnOffPlayers").attr("href", "/teamPlayers.html?"+qpParams);
	$("#tab-OnOffSummary").attr("href", "/teamOnOffSummary.html?"+qpParams);
	$("#tab-OnOffDetails").attr("href", "/teamOnOffDetails.html?"+qpParams);
	$("#tab-shotchart").attr("href", "/teamShotchart.html?"+qpParams);
	$("#tab-History").attr("href", "/teamGameLogs.html?"+qpParams);
	$("#tab-gamelogs").attr("href", "/teamGameLogs.html?"+qpParams);
	$("#tab-teamSeasons").attr("href", "/teamSeasons.html?"+qpParams);
	$("#tab-teamYoYStats").attr("href", "/teamYoYStats.html?"+qpParams);
};

//Update Player links
var playerSeasonChangeLinkUpdate = function(){
};



//Init Mobile Slider
var initMobileSlider = function(gridContainerId){
	//Get the table DOM
	var $grid = $("#"+gridContainerId);
	//Get the Table scroll DOM
	var $outerScroller = $grid.closest('.inner');
	//Get the Scroll Width
	var tableWidth = $grid.width();
	//Get the current screen width
	var screenWidth = $outerScroller.width();
	//Calculate the range of slider
	var maxRange = tableWidth - screenWidth;

	//If scrollbar required
	if(maxRange > 0){
		//Get table header DOM node.
		var $gridHeader = $("#"+gridContainerId + "-header");
		//Create a Slider ID  based on table ID
		var sliderID = gridContainerId +"Slider";
		//Create Slider container and slider before table header
		//<div class="sliderContainer">
		//<div id="gridContainerId+Slider" class="noUiSlider"></div>
		//</div>
		var $sliderContainer = $("<div></div>").attr({ "class": "sliderContainer"});
		$("<div></div>").attr({ id: sliderID,"class": "noUiSlider"}).appendTo($sliderContainer);
		$("<div></div>").attr({ "class": "noUiSliderFiller"}).appendTo($sliderContainer);
		$sliderContainer.insertBefore($gridHeader);

		//Init Slider
		$("#"+sliderID).noUiSlider({
		    range: [0, maxRange],
		    start: 0,
		    handles: 1,
		    orientation: "horizontal",
		    slide: function(){
		   	//Scroll Table on slider scroll
				$outerScroller.scrollLeft(parseInt(this.val()));
		  	},
		});

		//Synch in between Slider and Scrollbar
		$grid.parent().scroll(function(){
			//Scroll slider on table scroll
			$("#"+gridContainerId+"Slider").val($(this).scrollLeft());
		});	
	}
};

//Delete Mobile slider from the page
var destroyMobileSlider = function(gridContainerId){
   //Destroy Slider in Mobile
   if($("#"+gridContainerId +"Slider")){
  	$("#"+gridContainerId +"Slider").parent().remove();
   }
};


//Deep Linking for Grids Sort Order
$.extend({
	// Deep linking for box score event range (j$ 10/22)
	boxScoreRangeChanged : function( startRange, endRange, rangeType) {
		if(window.urlObject) {
			var href= window.urlObject.href;
			var hrefPlayByPlay = href.indexOf("?playbyplay");
			var hrefBoxscore = href.indexOf("?boxscore");

			if ( hrefPlayByPlay !== -1 ) {
				window.urlObject.href = window.urlObject.href.substring(0, hrefPlayByPlay );
			}
			else if ( hrefBoxscore !== -1 ) {
				window.urlObject.href = window.urlObject.href.substring(0, hrefBoxscore );
			}

			window.urlObject.modUrl("StartRange", startRange);
			window.urlObject.modUrl("EndRange", endRange);
			window.urlObject.modUrl("RangeType", rangeType);
		}
	},

	// Deep linking for column arrangment
	columnArranged : function( columnOrder ) {
		if(window.urlObject) {
			window.urlObject.modUrl("columnOrder", columnOrder);
		}
	},

	//Deep linking for Sort column and order
	columnSorted : function(column,order){
		if(window.urlObject){
			window.urlObject.modUrl("sortField",column);
			window.urlObject.modUrl("sortOrder",order);
			window.urlObject.modUrl("pageNo","1");
		}
	},

	//Deep linking for grid page number and rows per page
	pageChanged: function(pageNo, rowsPerPage){
		if(window.urlObject){
			window.urlObject.modUrl("pageNo",pageNo);
			window.urlObject.modUrl("rowsPerPage",rowsPerPage);

		}
	},

	//Return pngFlag False if Mobile or IE < 10.
	getPNGFlagBasedOnBrowseer: function(){
		var pngFlag = true;
		if(IS_MOBILE){
			pngFlag = false;
		}
		else{
			var myNav = navigator.userAgent.toLowerCase();
			if(myNav.indexOf('msie') != -1){
				//pngFlag = false;
				var version = parseInt(myNav.split('msie')[1]);
				if(version < 10){
					pngFlag = false;
				}
			}
		}
		return pngFlag;
	},

	// function to call after jsgrid is reset
	jsGridReset : function(){
		addVideoAnnotation();
	},
});

//Copy deep linking parameter from Object to To Object
var copyDeepLinkingParams = function(fromObj, toObj){
		//Get the Query parameter from urlObject  ---- Filter
		if(fromObj.filters)
			toObj.filterStr = fromObj.filters;
		//Get the Query parameter from urlObject  ---- Pagination
		if(fromObj.pageNo)
			toObj.pageNo = fromObj.pageNo;
		if(fromObj.rowsPerPage)
			toObj.rowsPerPage = fromObj.rowsPerPage;

		//Get the Sort Query parameter from urlObject  ---- SORT
		if(fromObj.sortField)
			toObj.sortField = fromObj.sortField;
		if(fromObj.sortOrder)
			toObj.sortOrder = fromObj.sortOrder;

		// Get the columnOrder Query parameter from urlObject ---- COLUMN ORDER
		if(fromObj.columnOrder) {
			toObj.columnOrder = fromObj.columnOrder;
		}
};


/****** Filter Splits Functions ********/
//Get Split filters option parameters from common
var getSplitFiltersParameters = function(params){
	var splitParams = [];	
	for(var loopCounter=0;loopCounter<params.length;loopCounter++){
		var name = params[loopCounter].name;
		//Make sure this work to seperate the custom Filter
		if(name.length != 3 && name.search("CF") == -1 
			&& name != window.teamAbbrCustomFilter.name
			&& name != window.playerCustomFilter.name){
			splitParams.push(params[loopCounter]);
		}
	}
	return splitParams;
};

//Get Custom filters option parameters from common
var getCustomFilterParameters = function(params){
	var customParams = [];
	for(var loopCounter=0;loopCounter<params.length;loopCounter++){
		var name = params[loopCounter].name;
		//Make sure this work to seperate the custom Filter
		if(name.length == 3 && name.search("CF") != -1){
			customParams.push(params[loopCounter]);
		}

		//Special case in custom filter for Team and Player
		if(name == window.teamAbbrCustomFilter.name || name == window.playerCustomFilter.name){
			customParams.push(params[loopCounter]);
		}
	}
	return customParams;
};

//Merge the split and custom filter objects for init call
var mergeSplitFilterOptions = function(splitFilter, customFilter){
	//Merge customFilter inforamtion into splitFilter Information
	$.each(customFilter, function(){
		splitFilter.push(this);
	});
};

//disable specific options from splitFilters
var disableTeamPlayerSpecificSplitFilters = function(defaultFilters){
	//Check for each query Parameter
	$.each(teamPlayerDisabledSplits, function(){
		for(var counter=0;counter<defaultFilters.length;counter++){
			//If Exist Update parameter in filterInit Object
			if(defaultFilters[counter].name == this.name){
				defaultFilters[counter].disabled = true;
				break;
			}
		}
	});
};

//Reset to default value of Split Filter Settings Object
var resetSplitFilterObject = function(defaultFilters){
	if(IS_MOBILE){
		for(var counter=0;counter<defaultFilters.length;counter++){
			defaultFilters[counter].activated = false;
			defaultFilters[counter].disabled = false;
			defaultFilters[counter].defaultValue = defaultFilters[counter].initialValue;
			defaultFilters[counter].description = "";
		}
	}
	else{
		for(var counter=0;counter<defaultFilters.length;counter++){
			defaultFilters[counter].activated = false;
			defaultFilters[counter].disabled = false;
			defaultFilters[counter].defaultValue = defaultFilters[counter].initialValue;
		}
	}
};

//Compare Old and New split filters options and based on that update URL if required
//Update currentFilter object to get the data from backend based on latest split we have on UI.
var compareandClearFilter =function(prevFilter, newFilter, currentFilter, defaultFilter){

	//Compare prevFilter and newFilter
	var prevLength = 0;
	var newLength = 0;
	var comparisionFlag = true;
	//Compare value of each property
	$.each(prevFilter, function(key, value){
		if(newFilter[key] != value){
			comparisionFlag = false;
		}
		prevLength++;
	});
	$.each(newFilter, function(key, value){
		newLength++;
	});

	//Compare if both prevFilter and newFilter are same
	if(prevLength == newLength && comparisionFlag == true){
		return 0;
	}

	$.each(prevFilter, function(key, value){
		//Set default value in URL
		if(newFilter[key] == undefined){
			if(window.urlObject){
				window.urlObject.modUrl(key,defaultFilter[key]);
				currentFilter[key] = defaultFilter[key];
			}
		}
	});
	return 1;
};

//Fill Split Filter settings Object based on Deep linking values coming from URL
var initSplitFilterObject = function(defaultFilters, copyParams, newParams){
	//Check for each query Parameter
	$.each(newParams, function(key, value){
		for(var counter=0;counter<defaultFilters.length;counter++){
			//If Exist Update parameter in filterInit Object
			if(defaultFilters[counter].name == key){
				defaultFilters[counter].activated = true;
				defaultFilters[counter].defaultValue = value;
				//Copy in copyParams Object to keep track of filter values
				copyParams[key] = value;
				break;
			}
		}
	});
};

//Fill Filter settings Object based on Deep linking values coming from URL
var initFilterObject = function(filterStr){
	//For blank filter
	if(filterStr=="")
		return;

	var filterColumns = filterStr.split("**");
	var filterLength =	filterColumns.length;
	//Max 5 Custom filter
	if(filterLength > maxCustomFilter){
		filterLength = maxCustomFilter;
	}
	for(filterCount=0;filterCount<filterLength;filterCount++){
		var colName = (filterColumns[filterCount]).split("*")[0];
		if(filterColumns[filterCount] != "" 
			&& colName != window.teamAbbrCustomFilter.name
			&& colName != window.playerCustomFilter.name ){
			var customFilter = window.splitFiltersCustom[filterCount];
			customFilter.activated = true;
			customFilter.defaultValue = filterColumns[filterCount];
		}

		//Special filter Dleague/Nba Prospect or Team Abbr
		if(colName == window.teamAbbrCustomFilter.name){
			var customFilter = $.grep(window.splitFiltersCustom, function(filterItem) { return filterItem.name==colName})[0];
			customFilter.activated = true;
			customFilter.defaultValue = (filterColumns[filterCount]).split("*")[2];
		}

		if(colName == window.playerCustomFilter.name){
			var customFilter = $.grep(window.splitFiltersCustom, function(filterItem) { return filterItem.name==colName})[0];
			customFilter.activated = true;
			customFilter.defaultValue = ((filterColumns[filterCount]).split("*")[2]).split(",");	
		}
	}
};

var addTeamAbbrCustomFilter = function(){
	window.splitFiltersCustom.push(window.teamAbbrCustomFilter);
};

var addPlayerCustomFilter = function(){
	window.splitFiltersCustom.push(window.playerCustomFilter);
};

//Reset to default value of Filter Settings Object
var resetFilterObject = function(){
	//Default all options available
	//Keep track of options availabele in custom filters
	$.each(window.customFilterColumns,function(){ 
		this.visible = true; 
	});

	$.each(window.splitFiltersCustom,function(){ 
		this.visible = true;
		this.activated = false; 
		this.defaultValue = '';
	});
};


//Update filter setting based on page contain the columns
var updateFilterObject = function(fieldCollection){
	//Update the list of options in custom filter based on columns available on the page
	$.each(window.customFilterColumns,function(){
		if (fieldCollection.indexOf(this.k) != -1){
			this.visible = true;
		}
		else{
			this.visible = false;
		}
	});
};

//Common function
//E	==
//NE	!=
//G		>
//GE	>=	
//L		<
//LE	<=
//Apply filter on this row with the filter Object
var filterData = function(row,filter){
	var retVal = true;
	var count= 0;
	for(count=0;count<filter.length;count++){
		var field = filter[count].field;
		var relation = filter[count].relation;
		var value;
		//Do not convert values to Number in some specific case
		if(field == window.teamAbbrCustomFilter.name || field == window.playerCustomFilter.name){
			value = filter[count].value;
		}else{
			value = Number(filter[count].value);
		}

		//IF field is relate to percentage formatter fields
		if(masterLayoutConfigNBA[field].specialFilter == true){
			value = value / 100;
		}
		
		//Check for the field avialable or not and also consider it when it's vlue is 0
		if(row[field] || row[field]==0){
			switch(relation){
				case "E":
					if (!(row[field] == value))
						retVal = false;
					break;
				case "NE":
					if (!(row[field] != value))
						retVal = false;
					break;
				case "G":
					if (!(row[field] > value))
						retVal = false;
					break;
				case "GE":
					if (!(row[field] >= value))
						retVal = false;
					break;
				case "L":
					if (!(row[field] < value))
						retVal = false;
					break;
				case "LE":
					if (!(row[field] <= value))
						retVal = false;
					break;
				//Just Search for one playerID	
				case "SUB":
					var supSet = value.split(",");
					if(supSet.indexOf(row[field]) == -1)
						retVal = false;
					break;
				//Search for multiple playerID
				case "SUP":
					var supSet = value.split(",");
					var subSet = row[field].split(" - ");
					var searchItemExist = false;
					var item;
					for(item=0;item<supSet.length;item++){
						if(subSet.indexOf(supSet[item]) != -1){
							searchItemExist = true;
							break;
						}
					}
					if(searchItemExist != true)
						retVal = false;
					break;
				default:
					break;
			}
		}
				
		if(retVal == false)
		break;
	}
	return retVal;
};


//Convert Filter String to Object
var processFilterStr = function(filterStr,fieldCollection){
	var processedfilterString = "";
	var filterColumns = filterStr.split("**");
	var filterCount = 0;
	
	for(filterCount=0;filterCount<filterColumns.length;filterCount++){
		var filterColumn = filterColumns[filterCount].split("*");
		//It must contain field name, filter relation and filter vaule
		if(filterColumn.length >= 3){
			if(fieldCollection){
				if( (filterColumn[0] == window.teamAbbrCustomFilter.name && filterColumn[2] == "0") ||
					(filterColumn[0] == window.playerCustomFilter.name && filterColumn[2] == "") ){
					//Ignore filter
				}
				else if(fieldCollection.indexOf(filterColumn[0]) != -1){
					processedfilterString += filterColumn[0] +"*"+ filterColumn[1] +"*"+ filterColumn[2] + "**";
				}
				else{
					//Ignore filter
				}
			}
			else{
				processedfilterString += filterColumn[0] +"*"+ filterColumn[1] +"*"+ filterColumn[2] + "**";
			}
		}
	}

	//Remove extra ** from the end	
	if(processedfilterString.length > 0){
		processedfilterString = processedfilterString.substr(0,processedfilterString.length-2);
	}
	return processedfilterString;
};


//Convert Filter String to Object
var makeFilterObject = function(filterStr){
	var filterObj = [];
	var filterColumns = filterStr.split("**");
	var filterCount = 0;
	
	for(filterCount=0;filterCount<filterColumns.length;filterCount++){
		var filterColumn = filterColumns[filterCount].split("*");
		//It must contain field name, filter relation and filter vaule
		if(filterColumn.length >= 3){
			var newFilterColumn = { field: filterColumn[0], relation: filterColumn[1], value: filterColumn[2]};
			filterObj.push(newFilterColumn);	
		}
	}
	return filterObj;
};
/****** Filter Splits Functions ********/

/*** DOM Events ***/

// annotation on first jsgrid header for pages with video/shotcharts
var addVideoAnnotation = function() {
	if(IS_MOBILE){
		return;
	}
	else {
		$('.video-annotation').remove(); // remove if already exists
		var annotationContent = {
			className : "video-annotation",
			link : "/statsVideo.html",
			text : "Click on any linked stat to view the Video and/or Shot Chart",
			icon : "/media/annotation_icon.png"
		}
		var jsGridHeader = $('.header.jsgrid').eq(0);
		var annotationDiv = $('<div>');
		annotationDiv.addClass(annotationContent.className)
					 .html('<img src="' + annotationContent.icon + '" /> <span>' + annotationContent.text + ' <a href="' + annotationContent.link + '">[more]</a></span>');
		jsGridHeader.prepend(annotationDiv);
	}
}

// add deep-linked social sharing to video modal window
var addModalSocialSharing = function(link) {

	var shareButtons;
	var bitlyLogin = 'nba450';
	var bitlyAPI = 'R_46b31735252665da66f63ede638288f1';
	var shortenedURL;

	var getShortURL = function(long, login, api, func) {
		$.getJSON(
			"http://api.bitly.com/v3/shorten?callback=?", 
			{ 
				"format": "json",
				"apiKey": api,
				"login": login,
				"longUrl": long
			},
			function(response) {
				func(response.data.url);
			}
		);
	};
	
	var modalTitleParts = {
		player : $('.playerName').text(),
		team : $('.teamName').text(),
		description : $('.titleString').text()
	}
	var modalTitleText = modalTitleParts.player + '|' + modalTitleParts.team + '|' + modalTitleParts.description.replace('@','vs.');
	var modalShareText = modalTitleParts.player + ' ' + modalTitleParts.team + ': ' + modalTitleParts.description.replace('@','vs.');

	// build modal share url
	shareURL = urlObject.href.substr(0, urlObject.href.indexOf('?'));
	link = link.replace('%3FP','?');
	var gridQueryParams = $.getQueryParameters(urlObject.href.substr(urlObject.href.indexOf('?'), urlObject.href.length));
	var videoQueryParams = $.getQueryParameters(link.substr(link.indexOf('?'), link.length));
	var allQueryParams = $.extend(gridQueryParams, videoQueryParams);
	var allParamsString = $.param(allQueryParams);

	// add playvid and video title params
	var videoParamsLength = allParamsString.indexOf('&pv=');
	if ( videoParamsLength == -1 ) {
		videoParamsLength = allParamsString.length;
	}
	var videoParamsOnly = allParamsString.substr(0, videoParamsLength);
	videoParamsOnly = videoParamsOnly.replace(/\+/g,' ');
	var newShareURL = shareURL + '?' + videoParamsOnly + '&pv=1&vt=' + modalTitleText;

	// bit.ly callback
	var setShortURL = function(resp) {
		shortenedURL = decodeURIComponent(resp);
		shareButtons = $('<div id="social-icons" class="modal">' + 
						    '<ul>' +
						        '<li class="label">Share Page:</li>' +
						        '<li class="facebook"><a class="short-url" href="http://www.facebook.com/sharer.php?s=100&p[url]=' + shortenedURL + '&p[summary]=via NBA.com/Stats&p[title]=' + modalShareText + '" >Facebook</a></li>' +
						        '<li class="twitter"><a class="short-url" href="https://twitter.com/intent/tweet?url=' + shortenedURL + '&text=' + modalShareText + '&via=nbastats">Twitter</a></li>' +
						        '<li class="google"><a class="short-url" href="https://plus.google.com/share?url=' + shortenedURL + '">Google +</a></li>' +
								'<input type="text" value="' + shortenedURL + '" />' +
						    '</ul>' +
						'</div>');
	    var title = $('.ui-dialog-title').after(shareButtons);
	    var iconsURLTextbox = $('#social-icons input')[0];

	  	$('#social-icons input').bind({
	  		click : function(e) {
				e.stopPropagation();
				$(this).select();
			},
			contextmenu : function(e) {
				e.stopPropagation();
				$(this).select();
			}
		});

	    // generate social popup
	 	$('a.short-url').click(function(e){
	   	e.preventDefault();
	   	window.open($(this).attr('href'), 'Stats', 'resizable=yes,scrollbars=yes,height=300,width=600');
		});
	};

	// call button url creation
	getShortURL(decodeURIComponent(newShareURL), bitlyLogin, bitlyAPI, setShortURL);
}

/******Helper Functions ********/
var getStringFromArrOrObject = function(obj){
	if(typeof (obj) != "string"){
		return obj[0];
	}
	else{
		return obj;
	}
};

var makeQueryStringFromObject = function(QueryObject, ignoreSeason){
	var qString = [];
	$.each(QueryObject, function(key, value) {
		if(value != null && value != ""){
			if(key == ignoreSeason){
				qString.push(key + "=" + "ignore");
			}
			else{
				qString.push(key + "=" + encodeURIComponent(value));
			}
		}
	});
	return qString.join("&");
};


/******Helper Functions ********/
//Master configuration object for stats.nba.com
var masterLayoutConfigNBA =  {
	"TeamAbbr" :		{ label: 'Team', name: 'TeamAbbr', dataFormatType:"number", hide: true},	
	"PlayerSearch" :	{ label: 'Player', name: 'PlayerSearch', dataFormatType:"number", hide: true},	

	"GP":		{ label: 'GP', name: 'GP', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of games a player or team has played.', filterLabel: 'Games Played', dataAs: window.formatterDataFunctions.blanktoZeroValue },
	"GS":		{ label: 'GS', name: 'GS', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.blanktoZeroValue },
	"W":		{ label: 'W', name: 'W', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of wins a player or team has earned.', filterLabel: 'Wins', dataAs: window.formatterDataFunctions.blanktoZeroValue},
	"L":		{ label: 'L', name: 'L', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of losses a player or team has earned.', filterLabel: 'Losses', dataAs: window.formatterDataFunctions.blanktoZeroValue },
	"W_PCT":	{ label: 'Win%', name: 'W_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of games that a team wins. The formula to determine win percentage is: Wins/Games Played.', filterLabel: 'Win Percentage', dataAs: window.formatterDataFunctions.toThreeDecimalPlaces },
	
	"MIN":		{ label: 'MIN', name: 'MIN', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of minutes a player or team has played.', filterLabel: 'Minutes', dataAs: window.formatterDataFunctions.MIN_formatter },
	"FGM":		{ label: 'FGM', name: 'FGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals that a player or team has made. This includes both 2 pointers and 3 pointers.', filterLabel: 'Field Goals Made', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA":		{ label: 'FGA', name: 'FGA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals that a player or team has attempted. This includes both 2 or 3 pointers.', filterLabel: 'Field Goals Attempted', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT":	{ label: 'FG%', name: 'FG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals that a player makes. The formula to determine field goal percentage is Field Goals Made/Field Goals Attempted.', filterLabel: 'Field Goal Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"FG3M":	{ label: '3FGM', name: 'FG3M', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of 3 point field goals that a player or team has made.', filterLabel: '3 Point Field Goals Made', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG3A":	{ label: '3FGA', name: 'FG3A', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of 3 point field goals that a player or team has attempted.', filterLabel: '3 Point Field Goals Attempted', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG3_PCT":	{ label: '3FG%', name: 'FG3_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of 3 point field goals that a player or team has made. The formula to determine 3 point field goal percentage is: 3 Point Field Goals Made/3 Point Field Goals Attempted.', filterLabel: '3 Point Field Goal Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"FTM":		{ label: 'FTM', name: 'FTM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of free throws that a player or team has successfully made.', filterLabel: 'Free Throws Made', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FTA":		{ label: 'FTA', name: 'FTA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of free throws that a player or team has taken.', filterLabel: 'Free Throws Attempted', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FT_PCT":	{ label: 'FT%', name: 'FT_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of free throws that a player or team has made. The formula to determine free throw percentage is: Free Throws Made/Free Throws Attempted.', filterLabel: 'Free Throw Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"OREB":	{ label: 'OREB', name: 'OREB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of rebounds a player or team has collected while they were on offense.', filterLabel: 'Offensive Rebounds', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"DREB":	{ label: 'DREB', name: 'DREB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of rebounds a player or team has collected while they were on defense.', filterLabel: 'Defensive Rebounds', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"REB":		{ label: 'REB', name: 'REB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A rebound occurs when a player recovers the ball after a missed shot. This statistic is the number of total rebounds a player or team has collected on either offense or defense.', filterLabel: 'Rebounds', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"AST":		{ label: 'AST', name: 'AST', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'An assist occurs when a player completes a pass to a teammate that directly leads to a made field goal.', filterLabel: 'Assists', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"STL":		{ label: 'STL', name: 'STL', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A steal occurs when a defensive player takes the ball from a player on offense, causing a turnover.', filterLabel: 'Steals', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"BLK":		{ label: 'BLK', name: 'BLK', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A block occurs when an offensive player attempts a shot, and the defense player tips the ball, blocking their chance to score.', filterLabel: 'Blocks', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"BLKA":	{ label: 'BLKA', name: 'BLKA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goal attempts by a player or team that was blocked by the opposing team.', filterLabel: 'Blocked Field Goal Attempts', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"TOV":		{ label: 'TOV', name: 'TOV', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A turnover occurs when the team on offense loses the ball to the defense.', filterLabel: 'Turnovers', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"TO":		{ label: 'TO', name: 'TO', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A turnover occurs when the team on offense loses the ball to the defense.', filterLabel: 'Turnovers', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"DD2":		{ label: 'DD2', name: 'DD2', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A player records a Double Double when they record 10 or more units in two stat categories. A Double Double is most commonly recorded in the categories of points, rebounds, or assists.', filterLabel: 'Double Doubles', dataAs: window.formatterDataFunctions.toInteger },
	"TD3":		{ label: 'TD3', name: 'TD3', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A player records a Triple Double when they record 10 or more units in three different stat categories. A Triple Double is most commonly recorded in the categories of points, rebounds, or assists.', filterLabel: 'Triple Doubles', dataAs: window.formatterDataFunctions.toInteger },
	"PF":		{ label: 'PF', name: 'PF', dataFormatType:"number",	sortable: true, tooltipOn: true, tooltipDesc: 'The total number of fouls that a player or team has committed.', filterLabel: 'Personal Fouls', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"PFD":		{ label: 'PFD', name: 'PFD', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The total number of fouls that a player or team has drawn on the other team.', filterLabel: 'Personal Fouls Drawn', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"PTS":		{ label: 'PTS', name: 'PTS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a player or team has scored. A point is scored when a player makes a basket.', filterLabel: 'Points', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"PLUS_MINUS": { label: '+/-', name: 'PLUS_MINUS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The point differential of the score for a player while on the court. For a team, it is how much they are winning or losing by.', filterLabel: 'Plus/Minus', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	
	"OFF_RATING":	{ label: 'OffRtg', name: 'OFF_RATING', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points scored per 100 possessions by a team. For a player, it is the number of points per 100 possessions that the team scores while that individual player is on the court.', filterLabel: 'Offensive Rating', dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"DEF_RATING":	{ label: 'DefRtg', name: 'DEF_RATING', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points allowed per 100 possessions by a team. For a player, it is the number of points per 100 possessions that the team allows while that individual player is on the court.', filterLabel: 'Defensive Rating', dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"NET_RATING":	{ label: 'NetRtg', name: 'NET_RATING', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Net Rating is the difference in a player or team\'s Offensive and Defensive Rating. The formula for this is: Offensive Rating - Defensive Rating', filterLabel: 'Net Rating', dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"AST_PCT":		{ label: 'AST%', name: 'AST_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Assist Percentage is the percent of teammate\'s field goals that the player assisted.', filterLabel: 'Assist Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"AST_TO":		{ label: 'AST/TO', name: 'AST_TO', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of assists a player has for every turnover that player commits.', filterLabel: 'Assist to Turnover Ratio', dataAs: window.formatterDataFunctions.toTwoDecimalPlaces },
	"AST_TOV": 	{ label: 'AST/TO', name: 'AST_TOV', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toTwoDecimalPlaces },
	"STL_TOV":		{ label: 'STL/TO', name: 'STL_TOV', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toTwoDecimalPlaces },
	"AST_RATIO":	{ label: 'AST Ratio', name: 'AST_RATIO', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Assist Ratio is the number of assists a player or team averages per 100 of their own possessions.', filterLabel: 'Assist Ratio', dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"OREB_PCT":	{ label: 'OREB%', name: 'OREB_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of offensive rebounds a player or team obtains while on the court.', filterLabel: 'Offensive Rebound Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"DREB_PCT":	{ label: 'DREB%', name: 'DREB_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of defensive rebounds a player or team obtains while on the court.', filterLabel: 'Defensive Rebound Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"REB_PCT":		{ label: 'REB%', name: 'REB_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of total rebounds a player obtains while on the court.', filterLabel: 'Rebound Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"TM_TOV_PCT":	{ label: 'TO Ratio', name: 'TM_TOV_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Turnover Ratio is the number of turnovers a player or team averages per 100 of their own possessions.', filterLabel: 'Turnover Ratio', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"EFG_PCT":		{ label: 'eFG%', name: 'EFG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Effective Field Goal Percentage is a field goal percentage that is adjusted for made 3 pointers being 1.5 times more valuable than a 2 point shot.', filterLabel: 'Effective Field Goal Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"TS_PCT":		{ label: 'TS%', name: 'TS_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A shooting percentage that is adjusted to include the value three pointers and free throws. The formula is: Points/ [2*(Field Goals Attempted+0.44*Free Throws Attempted)]', filterLabel: 'True Shooting Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"USG_PCT":		{ label: 'USG%', name: 'USG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s offensive possessions that a player uses while on the court.', filterLabel: 'Usage Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PACE":		{ label: 'PACE', name: 'PACE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Pace is the number of possessions per 48 minutes for a player or team.', filterLabel: 'Pace', dataAs: window.formatterDataFunctions.toTwoDecimalPlaces },
	"PIE":			{ label: 'PIE', name: 'PIE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'PIE is an estimate of a player\'s or team\'s contributions and impact on a game. PIE shows what % of game events did that player or team achieve.', filterLabel: 'Player Impact Estimate', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	
	"FTA_RATE":	{ label: 'FTA Rate', name: 'FTA_RATE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of free throws a player or team shoots in comparison to the number of shots that player or team shoots. The formula is Free Throws Attempted/Field Goals Attempted. This statistic shows who is good at drawing fouls and getting to the line', filterLabel: 'Free Throw Attempt Rate', dataAs: window.formatterDataFunctions. toThreeDecimalPlaces },
	"OPP_EFG_PCT":	{ label: 'Opp eFG%', name: 'OPP_EFG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Opponent\'s Effective Field Goal Percentage is what the team\'s defense forces their opponent to shoot. Effective Field Goal Percentage is a field goal percentage that is adjusted for made 3 pointers being 1.5 times more valuable than a 2 point shot.', filterLabel: 'Opponent\'s Effective Field Goal Percentage', dataAs: window.formatterDataFunctions. toPercentageOneDecimal, specialFilter: true },
	"OPP_FTA_RATE": { label: 'Opp FTA Rate', name: 'OPP_FTA_RATE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of free throws an opposing player or team shoots in comparison to the number of shots that player or team shoots.', filterLabel: 'Opponent\'s Free Throw Attempt Rate', dataAs: window.formatterDataFunctions. toThreeDecimalPlaces },
	"OPP_TOV_PCT":	{ label: 'Opp TO Ratio', name: 'OPP_TOV_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Opponent\'s Turnover Ratio is the number of turnovers an opposing team averages per 100 of their own possessions.', filterLabel: 'Opponent\'s Turnover Rate', dataAs: window.formatterDataFunctions. toPercentageOneDecimal, specialFilter: true },
	"OPP_OREB_PCT": { label: 'Opp OREB%', name: 'OPP_OREB_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The opponent\'s percentage of offensive rebounds a player or team obtains while on the court.', filterLabel: 'Opponent\'s Offensive Rebound Rate', dataAs: window.formatterDataFunctions. toPercentageOneDecimal, specialFilter: true },

	"PTS_OFF_TOV":			{ label: 'PTS OFF TO', name: 'PTS_OFF_TOV', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points scored by a player or team following an opponent\'s turnover.', filterLabel: 'Points Off Turnovers', dataAs: window.formatterDataFunctions.MISC_formatter },
	"PTS_2ND_CHANCE":		{ label: '2nd PTS', name: 'PTS_2ND_CHANCE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number points scored by a team on a possession that they rebound the ball on offense.', filterLabel: '2nd Chance Points', dataAs: window.formatterDataFunctions.MISC_formatter },
	"PTS_FB":				{ label: 'FBPs', name: 'PTS_FB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points scored by a player or team while on a fast break', filterLabel: 'Fast Break Points', dataAs: window.formatterDataFunctions.MISC_formatter },
	"PTS_PAINT":			{ label: 'PITP', name: 'PTS_PAINT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points scored by a player or team in the paint.', filterLabel: 'Points in the Paint', dataAs: window.formatterDataFunctions.MISC_formatter },
	"OPP_PTS_OFF_TOV":		{ label: 'Opp PTS OFF TO', name: 'OPP_PTS_OFF_TOV', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points scored by an opposing player or team following a turnover.', filterLabel: 'Opponent Points off Turnovers', dataAs: window.formatterDataFunctions.MISC_formatter },
	"OPP_PTS_2ND_CHANCE":	{ label: 'Opp 2nd PTS', name: 'OPP_PTS_2ND_CHANCE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points an opposing team scores on a possession when the opposing team  rebounds the ball on offense.', filterLabel: 'Opponent 2nd Chance Points', dataAs: window.formatterDataFunctions.MISC_formatter },
	"OPP_PTS_FB":			{ label: 'Opp FBPs', name: 'OPP_PTS_FB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points scored by an opposing player or team while on a fast break.', filterLabel: 'Opponent Fast Break Points', dataAs: window.formatterDataFunctions.MISC_formatter },
	"OPP_PTS_PAINT":		{ label: 'Opp PITP', name: 'OPP_PTS_PAINT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points scored by an opposing player or team in the paint.', filterLabel: 'Opponent Points in the Paint', dataAs: window.formatterDataFunctions.MISC_formatter },

	"PCT_FGA_2PT":		{ label: '%FGA (2PT)', name: 'PCT_FGA_2PT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals attempted by a player or team that are 2 pointers.', filterLabel: 'Percent of Field Goals Attempted (2 Pointers)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_FGA_3PT":		{ label: '%FGA (3PT)', name: 'PCT_FGA_3PT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals attempted by a player or team that are 3 pointers.', filterLabel: 'Percent of Field Goals Attempted (3 Pointers)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS_2PT":		{ label: '%PTS (2PT)', name: 'PCT_PTS_2PT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of points scored by a player or team that are 2 pointers.', filterLabel: 'Percent of Points (2 Pointers)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS_2PT_MR":	{ label: '%PTS (2PT-MR)', name: 'PCT_PTS_2PT_MR', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of points scored by a player or team that are 2 point mid-range jump shots. Mid-Range Jump Shots are generally jump shots that occur within the 3 point line, but not near the rim.', filterLabel: 'Percent of Points (Mid-Range)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS_3PT":		{ label: '%PTS (3PT)', name: 'PCT_PTS_3PT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of points scored by a player or team that are 3 pointers.', filterLabel: 'Percent of Points (3 Pointers)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS_FB":		{ label: '%PTS (FBPs)', name: 'PCT_PTS_FB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of points scored by a player or team that are scored while on a fast break.', filterLabel: 'Percent of Points (Fast Break Points)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS_FT":		{ label: '%PTS (FT)', name: 'PCT_PTS_FT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of points scored by a player or team that are free throws.', filterLabel: 'Percent of Points (Free Throws)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS_OFF_TOV":	{ label: '%PTS (OffTO)', name: 'PCT_PTS_OFF_TOV', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of points scored by a player or team that are scored after forcing an opponent\'s turnover', filterLabel: 'Percent of Points (Off Turnovers)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS_PAINT":	{ label: '%PTS (PITP)', name: 'PCT_PTS_PAINT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of points scored by a player or team that are scored in the paint.', filterLabel: 'Percent of Points (Points in the Paint)', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_AST_2PM":		{ label: '2FGM (%AST)', name: 'PCT_AST_2PM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of 2 point field goals made that are assisted by a teammate.', filterLabel: 'Percent of 2 Point Field Goals Made Assisted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_UAST_2PM":	{ label: '2FGM (%UAST)', name: 'PCT_UAST_2PM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of 2 point field goals that are not assisted by a teammate.', filterLabel: 'Percent of 2 Point Field Goals Made Unassisted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_AST_3PM":		{ label: '3FGM (%AST)', name: 'PCT_AST_3PM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of 3 point field goals made that are assisted by a teammate.', filterLabel: 'Percent of 3 Point Field Goals Made Assisted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_UAST_3PM":	{ label: '3FGM (%UAST)', name: 'PCT_UAST_3PM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of 3 point field goals that are not assisted by a teammate.', filterLabel: 'Percent of 3 Point Field Goals Made Unassisted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_AST_FGM":		{ label: 'FGM (%AST)', name: 'PCT_AST_FGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals made that are assisted by a teammate.', filterLabel: 'Percent of Field Goals Made Assisted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true, width:"50px" },
	"PCT_UAST_FGM":	{ label: 'FGM (%UAST)', name: 'PCT_UAST_FGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals that are not assisted by a teammate.', filterLabel: 'Percent of Field Goals Made Unassisted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true, width:"50px" },
	
	"OPP_FGM":		{ label: 'Opp FGM', name: 'OPP_FGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals that an opposing team has made. This includes both 2 pointers and 3 pointers.', filterLabel: 'Opponent\'s Field Goals Made', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_FGA":		{ label: 'Opp FGA', name: 'OPP_FGA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals that an opposing team has attempted. This includes both 2 pointers and 3 pointers.', filterLabel: 'Opponent\'s Field Goals Attempted', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_FG_PCT":	{ label: 'Opp FG%', name: 'OPP_FG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals that a player makes. The formula to determine field goal percentage is: Field Goals Made/Field Goals Attempted.', filterLabel: 'Opponent\'s Field Goal Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"OPP_FG3M":	{ label: 'Opp 3FGM', name: 'OPP_FG3M', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of 3 point field goals that an opposing team has made.', filterLabel: 'Opponent\'s 3 Point Field Goals Made', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_FG3A":	{ label: 'Opp 3FGA', name: 'OPP_FG3A', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of 3 point field goals that an opposing team has attempted.', filterLabel: 'Opponent\'s 3 Point Field Goals Attempted', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_FG3_PCT":	{ label: 'Opp 3FG%', name: 'OPP_FG3_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of 3 point field goals that an opposing team has made. The formula to determine 3 point field goal percentage is: 3 Point Field Goals Made/3 Point Field Goals Attempted.', filterLabel: 'Opponent\'s 3 Point Field Goal Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"OPP_FTM":		{ label: 'Opp FTM', name: 'OPP_FTM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of free throws that an opposing team has successfully made.', filterLabel: 'Opponent\'s Free Throws Made', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_FTA":		{ label: 'Opp FTA', name: 'OPP_FTA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of free throws that an opposing team has taken.', filterLabel: 'Opponent\'s Free Throws Attempted', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_FT_PCT":	{ label: 'Opp FT%', name: 'OPP_FT_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of free throws that an opposing team has made. The formula to determine free throw percentage is: Free Throws Made/Free Throws Attempted.', filterLabel: 'Opponent\'s Free Throw Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"OPP_OREB":	{ label: 'Opp OREB', name: 'OPP_OREB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of rebounds an opposing team has collected while they were on offense.', filterLabel: 'Opponent\'s Offensive Rebounds', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_DREB":	{ label: 'Opp DREB', name: 'OPP_DREB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of rebounds an opposing team has collected while they were on defense.', filterLabel: 'Opponent\'s Defensive Rebounds', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_REB":		{ label: 'Opp REB', name: 'OPP_REB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of total rebounds an opposing team has collected on either offense or defense.', filterLabel: 'Opponent\'s Rebounds', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_AST":		{ label: 'Opp AST', name: 'OPP_AST', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'An assist occurs when a player completes a pass to a teammate that directly leads to a made field goal.', filterLabel: 'Opponent\'s Rebound Assists', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_TOV":		{ label: 'Opp TO', name: 'OPP_TOV', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A turnover occurs when the team on offense loses the ball to the defense.', filterLabel: 'Opponent\'s Turnovers', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_STL":		{ label: 'Opp STL', name: 'OPP_STL', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A steal occurs when a defensive player takes the ball from a player on offense, causing a turnover.', filterLabel: 'Opponent\'s Steals', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_BLK":		{ label: 'Opp BLK', name: 'OPP_BLK', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A block occurs when an offensive player attempts a shot, and the defense player tips the ball, blocking their chance to score.', filterLabel: 'Opponent\'s Blocks', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_BLKA":	{ label: 'Opp BLKA', name: 'OPP_BLKA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goal attempts by an opposing team that was blocked by the opposing team.', filterLabel: 'Opponent\'s Blocked Field Goal Attempts', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_PF":		{ label: 'Opp PF', name: 'OPP_PF', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The total number of fouls that an opposing team has committed.', filterLabel: 'Opponent\'s Personal Fouls', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_PFD":		{ label: 'Opp PFD', name: 'OPP_PFD', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The total number of fouls that an opposing team has drawn on the other team.', filterLabel: 'Opponent\'s Personal Fouls Drawn', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_PTS":		{ label: 'Opp PTS', name: 'OPP_PTS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points an opposing team has scored. A point is scored when a player makes a basket.', filterLabel: 'Oppononent\'s Points', dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"OPP_PLUS_MINUS": { label: '+/-', name: 'PLUS_MINUS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The point differential of the score for a player while on the court. For a team, it is how much they are winning or losing by.', filterLabel: 'Opponent\'s Plus/Minus', dataAs: window.formatterDataFunctions.FGTMA_formatter },

	"PCT_DREB": { label: '%DREB', name: 'PCT_DREB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s defensive rebounds that a player has while on the court.', filterLabel: 'Percent of Team\'s Defensive Rebounds', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_FG3A": { label: '%3FGA', name: 'PCT_FG3A', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s 3 point field goals attempted that a player has while on the court.', filterLabel: 'Percent of Team\'s 3 Point Field Goals Attempted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_FG3M": { label: '%3FGM', name: 'PCT_FG3M', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s 3 point field goals made that a player has while on the court.', filterLabel: 'Percent of Team\'s 3 Point Field Goals Made', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_FGA":  { label: '%FGA', name: 'PCT_FGA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s field goals attempted that a player has while on the court.', filterLabel: 'Percent of Team\'s Field Goals Attempted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_FGM":  { label: '%FGM', name: 'PCT_FGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s field goals made that a player has while on the court.', filterLabel: 'Percent of Team\'s Field Goals Made', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_FTA":  { label: '%FTA', name: 'PCT_FTA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s free throws attempted that a player has while on the court.', filterLabel: 'Percent of Team\'s Free Throws Attempted', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_FTM":  { label: '%FTM', name: 'PCT_FTM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s free throws made that a player has while on the court.', filterLabel: 'Percent of Team\'s Free Throws Made', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_OREB": { label: '%OREB', name: 'PCT_OREB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s offensive rebounds that a player has while on the court.', filterLabel: 'Percent of Team\'s Offensive Rebounds', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PF":	{ label: '%PF', name: 'PCT_PF', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s personal fouls that a player has while on the court.', filterLabel: 'Percent of Team\'s Personal Fouls', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PFD":  { label: '%PFD', name: 'PCT_PFD', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s personal fouls drawn that a player has while on the court.', filterLabel: 'Percent of Team\'s Personal Fouls Drawn', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_PTS":  { label: '%PTS', name: 'PCT_PTS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s points that a player has while on the court.', filterLabel: 'Percent of Team\'s Points', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_REB":  { label: '%REB', name: 'PCT_REB', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s total rebounds that a player has while on the court.', filterLabel: 'Percent of Team\'s Rebounds', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_STL":  { label: '%STL', name: 'PCT_STL', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s steals that a player has while on the court.', filterLabel: 'Percent of Team\'s Steals', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_TOV":  { label: '%TO', name: 'PCT_TOV', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s turnovers that a player has while on the court.', filterLabel: 'Percent of Team\'s Turnovers', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_AST":  { label: '%AST', name: 'PCT_AST', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s assists that a player has while on the court.', filterLabel: 'Percent of Team\'s Assists', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_BLK":  { label: '%BLK', name: 'PCT_BLK', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s blocks that a player has while on the court.', filterLabel: 'Percent of Team\'s Blocks', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },
	"PCT_BLKA": { label: '%BLKA', name: 'PCT_BLKA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of a team\'s own blocked field goal attempts that a player has while on the court.', filterLabel: 'Percent of Team\'s Blocked Field Goal Attempts', dataAs: window.formatterDataFunctions.toPercentageOneDecimal, specialFilter: true },

	"GP-ON":			{ label: 'GS ON', name: 'GP-ON', dataFormatType:"number", sortable: true, tooltipOn: false },
	"MIN-ON":			{ label: 'MIN ON', name: 'MIN-ON', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"PLUS_MINUS-ON":	{ label: '+/- ON', name: 'PLUS_MINUS-ON', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"OFF_RATING-ON":	{ label: 'OffRtg ON', name: 'OFF_RATING-ON', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"DEF_RATING-ON":	{ label: 'DefRtg ON', name: 'DEF_RATING-ON', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"NET_RATING-ON":	{ label: 'NetRtg ON', name: 'NET_RATING-ON', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },

	"GP-OFF":			{ label: 'GS OFF', name: 'GP-OFF', dataFormatType:"number", sortable: true, tooltipOn: false },
	"MIN-OFF":			{ label: 'MIN OFF', name: 'MIN-OFF', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"PLUS_MINUS-OFF":	{ label: '+/- OFF', name: 'PLUS_MINUS-OFF', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"OFF_RATING-OFF":	{ label: 'OffRtg OFF', name: 'OFF_RATING-OFF', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"DEF_RATING-OFF":	{ label: 'DefRtg OFF', name: 'DEF_RATING-OFF', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	"NET_RATING-OFF":	{ label: 'NetRtg OFF', name: 'NET_RATING-OFF', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.toOneDecimalPlaces },
	
	"EFF": { label: 'EFF', name: 'EFF', dataFormatType:"number", sortable: true, tooltipOn: false, dataAs:window.formatterDataFunctions.FGTMA_formatter },

	"FGM5ft1"	: { label: 'FGM', name: 'FGM5ft1', dataFormatType:"number", filterLabel: "FGM (<5ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA5ft1"	: { label: 'FGA', name: 'FGA5ft1', dataFormatType:"number", filterLabel: "FGA (<5ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT5ft1": { label: 'FG%', name: 'FG_PCT5ft1', dataFormatType:"number", filterLabel: "FG% (<5ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM5ft2"	: { label: 'FGM', name: 'FGM5ft2', dataFormatType:"number", filterLabel: "FGM (5-9ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA5ft2"	: { label: 'FGA', name: 'FGA5ft2', dataFormatType:"number", filterLabel: "FGA (5-9ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT5ft2": { label: 'FG%', name: 'FG_PCT5ft2', dataFormatType:"number", filterLabel: "FG% (5-9ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM5ft3"	: { label: 'FGM', name: 'FGM5ft3', dataFormatType:"number", filterLabel: "FGM (10-14ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA5ft3"	: { label: 'FGA', name: 'FGA5ft3', dataFormatType:"number", filterLabel: "FGA (10-14ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT5ft3": { label: 'FG%', name: 'FG_PCT5ft3', dataFormatType:"number", filterLabel: "FG% (10-14ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM5ft4"	: { label: 'FGM', name: 'FGM5ft4', dataFormatType:"number", filterLabel: "FGM (15-19ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA5ft4"	: { label: 'FGA', name: 'FGA5ft4', dataFormatType:"number", filterLabel: "FGA (15-19ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT5ft4": { label: 'FG%', name: 'FG_PCT5ft4', dataFormatType:"number", filterLabel: "FG% (15-19ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM5ft5"	: { label: 'FGM', name: 'FGM5ft5', dataFormatType:"number", filterLabel: "FGM (20-24ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA5ft5"	: { label: 'FGA', name: 'FGA5ft5', dataFormatType:"number", filterLabel: "FGA (20-24ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT5ft5": { label: 'FG%', name: 'FG_PCT5ft5', dataFormatType:"number", filterLabel: "FG% (20-24ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM5ft6"	: { label: 'FGM', name: 'FGM5ft6', dataFormatType:"number", filterLabel: "FGM (25-29ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA5ft6"	: { label: 'FGA', name: 'FGA5ft6', dataFormatType:"number", filterLabel: "FGA (25-29ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT5ft6": { label: 'FG%', name: 'FG_PCT5ft6', dataFormatType:"number", filterLabel: "FG% (25-29ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	
	"FGM8ft1"	: { label: 'FGM', name: 'FGM8ft1', dataFormatType:"number", filterLabel: "FGM (<8ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA8ft1"	: { label: 'FGA', name: 'FGA8ft1', dataFormatType:"number", filterLabel: "FGA (<8ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT8ft1": { label: 'FG%', name: 'FG_PCT8ft1', dataFormatType:"number", filterLabel: "FG% (<8ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM8ft2"	: { label: 'FGM', name: 'FGM8ft2', dataFormatType:"number", filterLabel: "FGM (8-16ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA8ft2"	: { label: 'FGA', name: 'FGA8ft2', dataFormatType:"number", filterLabel: "FGA (8-16ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT8ft2": { label: 'FG%', name: 'FG_PCT8ft2', dataFormatType:"number", filterLabel: "FG% (8-16ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM8ft3"	: { label: 'FGM', name: 'FGM8ft3', dataFormatType:"number", filterLabel: "FGM (16-24ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA8ft3"	: { label: 'FGA', name: 'FGA8ft3', dataFormatType:"number", filterLabel: "FGA (16-24ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT8ft3": { label: 'FG%', name: 'FG_PCT8ft3', dataFormatType:"number", filterLabel: "FG% (16-24ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM8ft4"	: { label: 'FGM', name: 'FGM8ft4', dataFormatType:"number", filterLabel: "FGM (>24ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA8ft4"	: { label: 'FGA', name: 'FGA8ft4', dataFormatType:"number", filterLabel: "FGA (>24ft)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT8ft4": { label: 'FG%', name: 'FG_PCT8ft4', dataFormatType:"number", filterLabel: "FG% (>24ft)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGM8ft5"	: { label: 'FGM', name: 'FGM8ft5', dataFormatType:"number", filterLabel: "FGM (BackCourt)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGA8ft5"	: { label: 'FGA', name: 'FGA8ft5', dataFormatType:"number", filterLabel: "FGA  (BackCourt)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCT8ft5": { label: 'FG%', name: 'FG_PCT8ft5', dataFormatType:"number", filterLabel: "FG%  (BackCourt)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },

	"FGMZone1"	: 	{ label: 'FGM', name: 'FGMZone1', dataFormatType:"number", filterLabel: "FGM (RA)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGAZone1"	: 	{ label: 'FGA', name: 'FGAZone1', dataFormatType:"number", filterLabel: "FGA (RA)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCTZone1": 	{ label: 'FG%', name: 'FG_PCTZone1', dataFormatType:"number", filterLabel: "FG% (RA)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGMZone2"	: 	{ label: 'FGM', name: 'FGMZone2', dataFormatType:"number", filterLabel: "FGM (Non-RA)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGAZone2"	: 	{ label: 'FGA', name: 'FGAZone2', dataFormatType:"number", filterLabel: "FGA (Non-RA)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCTZone2": 	{ label: 'FG%', name: 'FG_PCTZone2', dataFormatType:"number", filterLabel: "FG% (Non-RA)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGMZone3"	: 	{ label: 'FGM', name: 'FGMZone3', dataFormatType:"number", filterLabel: "FGM (MidRange)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGAZone3"	: 	{ label: 'FGA', name: 'FGAZone3', dataFormatType:"number", filterLabel: "FGA (MidRange)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCTZone3": 	{ label: 'FG%', name: 'FG_PCTZone3', dataFormatType:"number", filterLabel: "FG% (MidRange)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGMZone4"	: 	{ label: 'FGM', name: 'FGMZone4', dataFormatType:"number", filterLabel: "FGM (Left Corner3)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGAZone4"	: 	{ label: 'FGA', name: 'FGAZone4', dataFormatType:"number", filterLabel: "FGA (Left Corner3)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCTZone4": 	{ label: 'FG%', name: 'FG_PCTZone4', dataFormatType:"number", filterLabel: "FG% (Left Corner3)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGMZone5"	: 	{ label: 'FGM', name: 'FGMZone5', dataFormatType:"number", filterLabel: "FGM (Right Corner3)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGAZone5"	: 	{ label: 'FGA', name: 'FGAZone5', dataFormatType:"number", filterLabel: "FGA (Right Corner3)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCTZone5": 	{ label: 'FG%', name: 'FG_PCTZone5', dataFormatType:"number", filterLabel: "FG% (Right Corner3)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	"FGMZone6"	: 	{ label: 'FGM', name: 'FGMZone6', dataFormatType:"number", filterLabel: "FGM (AboveBR3)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FGAZone6"	: 	{ label: 'FGA', name: 'FGAZone6', dataFormatType:"number", filterLabel: "FGA (AboveBR3)", sortable: true, tooltipOn: false, dataAs: window.formatterDataFunctions.FGTMA_formatter },
	"FG_PCTZone6": 	{ label: 'FG%', name: 'FG_PCTZone6', dataFormatType:"number", filterLabel: "FG% (AboveBR3)", sortable: true, tooltipOn: false, specialFilter: true, dataAs: window.formatterDataFunctions.toPercentageOneDecimal },
	
	"DVS": { label: 'Drives Per Game', name: 'DVS', dataFormatType:"number", sortable: true,  tooltipOn: true, tooltipDesc: 'The number of times a player has driven to the basket. A drive is considered any touch that starts at least 20 feet of the hoop and is dribbled within 10 feet of the hoop. Fast break drives are excluded.', filterLabel:'Drives Per Game', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"DPP": { label: 'Player PPG on Drives', name: 'DPP', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a player has accumulated on drives to the basket.', filterLabel:'Player Points per Game on Drives', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"DTP": { label: 'Team PPG on Drives', name: 'DTP', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a team has accumulated on drives to the basket by this player per game.', filterLabel:'Team Points per Game on Drives', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"PTS_48": { label: 'PTS Per 48 Min on Drives', name: 'PTS_48', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a player has accumulated on drives per 48 minutes played.', filterLabel:'Points Per 48 Min on Drives', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	
	"DIST": { label: 'Distance Traveled (total miles)', name: 'DIST', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The total distance in miles that a player covered while on the court.', filterLabel:'Distance Traveled (miles)', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"AV_SPD": { label: 'Average Speed (mph)', name: 'AV_SPD', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The average speed in miles per hour of all movements (sprinting, jogging, standing, walking, backwards and forwards) by a player while on the court', filterLabel:'Average Speed (mph)', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"DIST_PG": { label: 'Distance Traveled Per Game', name: 'DIST_PG', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The distance in miles that a player covered while on the court per game played.', filterLabel:'Distance Traveled Per Game (miles)', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"DIST_48": { label: 'Distance Traveled Per 48', name: 'DIST_48', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The distance in miles that a player covered while on the court per 48 minutes played.', filterLabel:'Distance Traveled Per 48 minutes (miles)', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	
	"REB_CHANCE": { label: 'REB Chances', name: 'REB_CHANCE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times player was within the vicinity (3.5 ft) of a rebound.', filterLabel:'Rebound Chances', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"REB_COL_PCT": { label: 'Percent Of Available REB Grabbed', name: 'REB_COL_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Percentage of total rebounds gathered when in the vicinity (3.5 ft) of a rebound.', filterLabel:'Percent Of Available Rebounds Grabbed', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	"REB_CONTESTED": { label: 'Contested REB', name: 'REB_CONTESTED', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of rebounds gathered where an opponent is within 3.5 feet.', filterLabel:'Contested Rebounds', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"REB_UNCONTESTED": { label: 'Uncontested REB', name: 'REB_UNCONTESTED', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of rebounds gathered where no opponent is within 3.5 feet.', filterLabel:'Uncontested Rebounds', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"REB_UNCONTESTED_PCT": { label: 'Contested REB Percentage', name: 'REB_UNCONTESTED_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of rebounds the player collects that were contested.  The formula is Contested Rebounds / Total Rebounds.', filterLabel:'Contested Rebound Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	
	"TCH": { label: 'Touches', name: 'TCH', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times a player touches and possesses the ball.', filterLabel:'Touches', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FC_TCH": { label: 'Front Court Touches', name: 'FC_TCH', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times a player touches and possesses the ball on their team\'s offensive half of the court.', filterLabel:'Front Court Touches', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"TOP": { label: 'Time of Possession (min)', name: 'TOP', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The total number of times a player possesses the ball per game in minutes.', filterLabel:'Time of Possession', dataAs: window.formatterDataFunctions.toOneDecimalPlaces,},
	"CL_TCH": { label: 'Close Touches', name: 'CL_TCH', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'All touches that originate within 12 feet of the basket, excluding drives.', filterLabel:'Close Touches', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"EL_TCH": { label: 'Elbow Touches', name: 'EL_TCH', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Touches that originate within the 5 foot radius nearing the edge of the lane and free throw line, inside the 3-point line.', filterLabel:'Elbow Touches', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"PTS_TCH": { label: 'PTS Per Touch', name: 'PTS_TCH', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a player scores per times they possesed the ball.', filterLabel:'Points Per Touch', dataAs: window.formatterDataFunctions.toTwoDecimalPlaces},
	"PTS_HCCT": { label: 'PTS Per Half Court Touch', name: 'PTS_HCCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a player scores per half court touch.', filterLabel:'Points Per Half Court Touch', dataAs: window.formatterDataFunctions.toTwoDecimalPlaces},
	
	"PASS": { label: 'Passes', name: 'PASS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of passes a player has made',filterLabel:'Passes', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"AST_FT": { label: 'Free Throw AST', name: 'AST_FT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Quantity of passes made by a player to a recipient who was fouled, missed the shot if shooting, and made at least 1 free throw. Recipient must be fouled within 2 seconds and 1 dribble for passer to earn a FTA Assist.', filterLabel:'Free Throw Assists', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"AST_SEC": { label: 'Secondary AST', name: 'AST_SEC', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Quantity of passes made by a player to the player who earned an assist on a made shot. Assister must make a pass within 2 seconds and 1 dribble for passer to earn a secondary assist.', filterLabel:'Secondary Assists', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"AST_POT": { label: 'Potential AST', name: 'AST_POT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Passes by a player to a teammate in which the teammate attempts a shot, and if made, would be an assist. ', filterLabel:'Potential Assists', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"PTS_CRT": { label: 'Points Created by AST', name: 'PTS_CRT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Points created by a player or team through their assists.', filterLabel:'Points Created', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"PTS_CRT_48": { label: 'Points Created by AST Per 48 Min', name: 'PTS_CRT_48', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Points created by a player or team through their assists per 48 minutes.', filterLabel:'Points Created Per 48', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	
	"DEFEND_RIM": { label: 'Defending the Rim', name: 'DEFEND_RIM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Being within five feet of the basket and within five feet of the offensive player attempting a shot.', filterLabel:'Defending the Rim', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGM_DEFEND_RIM": { label: 'Opp FGM at Rim per game', name: 'FGM_DEFEND_RIM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goals Made by an opposing player or team at the rim while being defended.', filterLabel:'Opponent Field Goals Made at Rim', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGA_DEFEND_RIM": { label: 'Opp FGA at Rim per game', name: 'FGA_DEFEND_RIM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goals Attempted by an opposing player or team at the rim while being defended.', filterLabel:'Opponent Field Goal Attempts at Rim', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGP_DEFEND_RIM": { label: 'Opp FGP at Rim', name: 'FGP_DEFEND_RIM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Percentage of an opposing player\'s or team\'s shots at the rim while being defended.', filterLabel:'Opponent Field Goal Percent at Rim', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	
	"PTS_DRIVE": { label: 'Drives PTS', name: 'PTS_DRIVE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Points that are scored by a player on drives to the basket.', filterLabel:'Drives Points', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"PTS_CLOSE": { label: 'Close PTS', name: 'PTS_CLOSE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Points that are scored by a player on any touch that starts within 12 feet of the basket, excluding drives.', filterLabel:'Close Points', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"PTS_CATCH_SHOOT": { label: 'Catch and Shoot PTS', name: 'PTS_CATCH_SHOOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Points that are scored by a player on a catch and shoot opportunity.', filterLabel:'Catch and Shoot Points', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"PTS_PULL_UP": { label: 'Pull Up PTS', name: 'PTS_PULL_UP', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Points that are scored by a player on a pull up opportunity.', filterLabel:'Pull Up Points', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGA_DRIVE": { label: 'Drives Attempts', name: 'PTS_DRIVE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Attempts that are taken when a player is driving to the basket.', filterLabel:'Drives Attempts', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGA_CLOSE": { label: 'Close Attempts', name: 'PTS_CLOSE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Attempts a player takes on any touch that starts within 12 feet of the basket, excluding drives.', filterLabel:'Close Attempts', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGA_CATCH_SHOOT": { label: 'Catch and Shoot Attempts', name: 'PTS_CATCH_SHOOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Attempts by a player on a catch and shoot opportunity.', filterLabel:'Catch and Shoot Attempts', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGA_PULL_UP": { label: 'Pull Up Attempts', name: 'PTS_PULL_UP', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Attempts by a player on a pull up opportunity.', filterLabel:'Pull Up Attempts', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"FGP_DRIVE": { label: 'Drives FG%', name: 'FGP_DRIVE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Percentage on shots taken when a player is driving to the basket.', filterLabel:'Drives Field Goal Percent', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	"FGP_CLOSE": { label: 'Close FG%', name: 'FGP_CLOSE', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Percentage on shots taken by a player on any touch that starts within 12 feet of the basket, excluding drives.', filterLabel:'Close Field Goal Percent', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	"FGP_CATCH_SHOOT": { label: 'Catch and Shoot FG%', name: 'FGP_CATCH_SHOOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Percentage by a player on catch and shoot opportunities.', filterLabel:'Catch and Shoot Field Goal Percent', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	"FGP_PULL_UP": { label: 'Pull up FG%', name: 'FGP_PULL_UP', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field Goal Percentage by a player on a pull up opportunity.', filterLabel:'Pull up Field Goal Percent', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	
	"PTS_TOT":		{ label: 'Total PTS', name: 'PTS_TOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a player or team has scored. A point is scored when a player makes a basket.', filterLabel: 'Points', dataAs: window.formatterDataFunctions.blanktoZeroValue },
	"DPP_TOT": { label: 'Total Player PTS on Drives', name: 'DPP_TOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of points a player has accumulated on drives to the basket.', filterLabel:'Player Points per Game on Drives', dataAs: window.formatterDataFunctions.blanktoZeroValue },
	"REB_TOT":		{ label: 'Total REB', name: 'REB_TOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A rebound occurs when a player recovers the ball after a missed shot. This statistic is the number of total rebounds a player or team has collected on either offense or defense.', filterLabel: 'Rebounds', dataAs: window.formatterDataFunctions.blanktoZeroValue  },
	"AST_TOT":		{ label: 'Total AST', name: 'AST_TOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'An assist occurs when a player completes a pass to a teammate that directly leads to a made field goal.', filterLabel: 'Assists', dataAs: window.formatterDataFunctions.blanktoZeroValue  },
	"TCH_TOT": { label: 'Total Touches', name: 'TCH_TOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times a player touches and possesses the ball.', filterLabel:'Touches', dataAs: window.formatterDataFunctions.blanktoZeroValue },
	"BLK_TOT":		{ label: 'Total BLK', name: 'BLK_TOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'A block occurs when an offensive player attempts a shot, and the defense player tips the ball, blocking their chance to score.', filterLabel: 'Blocks', dataAs: window.formatterDataFunctions.blanktoZeroValue },
	"DVS_TOT": { label: 'Total Drives', name: 'DVS_TOT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The total number of times a player has driven to the basket. A drive is considered any touch that starts at least 20 feet of the hoop and is dribbled within 10 feet of the hoop. Fast break drives are excluded.', filterLabel:'Total Drives', dataAs: window.formatterDataFunctions.blanktoZeroValue },
	
	// player tracking box score stats
	"DIST": { label: 'DIST', name: 'DIST', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The total distance in miles that a player covered while on the court.', filterLabel:'Distance Traveled (miles)', dataAs: window.formatterDataFunctions.toOneDecimalPlaces},
	"SPD": { label: 'SPD', name: 'SPD', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The average speed in miles per hour of all movements (sprinting, jogging, standing, walking, backwards and forwards) by a player while on the court', filterLabel:'Average Speed (mph)', dataAs: window.formatterDataFunctions.toOneDecimalPlacesDash},
	"RBC": { label: 'RBC', name: 'RBC', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times player was within the vicinity (3.5 ft) of a rebound.', filterLabel:'Rebound Chances', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"ORBC": { label: 'ORBC', name: 'ORBC', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times player was within the vicinity (3.5 ft) of an offensive rebound.', filterLabel:'Offensive Rebound Chances', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"DRBC": { label: 'DRBC', name: 'DRBC', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times player was within the vicinity (3.5 ft) of a defensive rebound.', filterLabel:'Defensive Rebound Chances', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"TCHS": { label: 'TCHS', name: 'TCHS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of times a player touches and possesses the ball.', filterLabel:'Touches', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"PASS": { label: 'PASS', name: 'PASS', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of passes a player has made',filterLabel:'Passes', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"FTAST": { label: 'FTAST', name: 'FTAST', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Quantity of passes made by a player to a recipient who was fouled, missed the shot if shooting, and made at least 1 free throw. Recipient must be fouled within 2 seconds and 1 dribble for passer to earn a FTA Assist.', filterLabel:'Free Throw Assists', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"SAST": { label: 'SAST', name: 'SAST', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Quantity of passes made by a player to the player who earned an assist on a made shot. Assister must make a pass within 2 seconds and 1 dribble for passer to earn a secondary assist.', filterLabel:'Secondary Assists', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"CFGM": { label: 'CFGM', name: 'CFGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals made when the shooter has a defender within his vicinity (4 ft).', filterLabel:'Contested Field Goals Made', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"CFGA": { label: 'CFGA', name: 'CFGA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals attempted when the shooter has a defender within his vicinity (4 ft).', filterLabel:'Contested Field Goal Attempts', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"CFG_PCT": { label: 'CFG%', name: 'CFG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals attempted when the shooter has a defender within his vicinity (4 ft).', filterLabel:'Contested Field Goal Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	"UFGM": { label: 'UFGM', name: 'UFGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals made when the shooter does not have a defender within his vicinity (4 ft).', filterLabel:'Uncontested Field Goals Made', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"UFGA": { label: 'UFGA', name: 'UFGA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The number of field goals attempted when the shooter does not have a defender within his vicinity (4 ft).', filterLabel:'Uncontested Field Goal Attempts', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"UFG_PCT": { label: 'UFG%', name: 'UFG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'The percentage of field goals made when the shooter does not have a defender within his vicinity (4 ft).', filterLabel:'Uncontested Field Goal Percentage', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
	"DFGM": { label: 'DFGM', name: 'DFGM', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field goals made by the opponent while the player or team was defending the rim.', filterLabel:'Field Goals Defended at Rim Made', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"DFGA": { label: 'DFGA', name: 'DFGA', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field goals attempted by the opponent while the player or team was defending the rim.', filterLabel:'Field Goals Defended at Rim Attempted', dataAs: window.formatterDataFunctions.FGTMA_formatter},
	"DFG_PCT": { label: 'DFG%', name: 'DFG_PCT', dataFormatType:"number", sortable: true, tooltipOn: true, tooltipDesc: 'Field goal percentage of the oppenent while the player or team was defending the rim. ', filterLabel:'Field Goals Defended at Rim Percent', dataAs: window.formatterDataFunctions.toPercentageOneDecimal},
};