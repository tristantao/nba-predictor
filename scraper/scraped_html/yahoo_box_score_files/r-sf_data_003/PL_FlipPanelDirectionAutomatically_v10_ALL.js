var ebScriptFileName = "PL_FlipPanelDirectionAutomatically_v10_ALL.js";

/*
	http://ds.serving-sys.com/BurstingRes/CustomScripts/PL_FlipPanelDirectionAutomatically_v10_ALL.js?adid=[%tp_adid%]
	This script will expand the panel to the right instead of left in case the banner is on the left part of the screen.
	The panel positioning should be set to expand to the left and the "Corner of Panel to align with the (X,Y) coordinate selected" should
	 be set to "Top-Left".
	If the script Identifies that the banner is in the left part of the screen then it will set the XPos of the panel to 0. [no longer correct, now correctly FLIPS the expansion to other side]

	v2: This script then also looks to see if the panel will appear off of the screen, and if so, will make it flush to that side of the screen so the panel will not disappear.
		- script requires panel to be set to positioning relative to banner in MediaMind platform
	
	v3: Modified to make it a Preload script
	
	v4: Added latest changes to custom script to ensure attaching of correct scripts when multiple ads are on one page
	
	v6: Added changes to the custom script to set the position for single expandables as well
	
	v7: Added changes so that fix which accounts for the 4px border built in to the chrome browser which was causing the panel 
		to go a few pixels off the right side of the screen, causing a horizontal scrollbar.
		
	v8: Remove expand beyond bottom of screen adjustment because if banner is located below the fold, panel is appearing above the fold.
	    Commented out line 256 - John Kim

	v9:Unknown

	v10: Script only worked when ads expanded left by defualt. Added in code so ads can expand either way be default. 
	
	Written by Guy Meiri
	Updated by Mike Denton 1.25.11
	Updated by Tia Koehler 11.10.11
	Updated by Jason Brown 07.24.12
*/

var ebScriptQuery = function(scriptPath) {
    this.scriptPath = scriptPath;
    
};

ebScriptQuery.prototype = {
    get: function() {
        var lastQuery = '';
        var srcRegex = new RegExp(this.scriptPath.replace('.', '\\.') + '(\\?.*)?$');
        var scripts = document.getElementsByTagName("script");
        var i;
         for (i = 0; i < scripts.length; i++) {
            var script = scripts[i];
             if (script.src && script.src.match(srcRegex)) {
                var query = script.src.match(/\?([^#]*)(#.*)?/);
                lastQuery = !query ? '' : query[1];
                
            }
        }
        return lastQuery;
        
    },
    parse: function() {
        var result = {};
        var query = this.get();
        var components = query.split('&');
        var i;
         for (i = 0; i < components.length; i++) {
            var pair = components[i].split('=');
            var name = pair[0], value = pair[1];
            
            if (!result[name]) {
                result[name] = [];
            }
            // decode
             if (!value) {
                value = 'true';
                
            }
            else {
                 try {
                    value = decodeURIComponent(value);
                    
                }
                catch (e) {
                    value = unescape(value);
                    
                }
            }
            
            // MacIE way
            var values = result[name];
            values[values.length] = value;
            
        }
        return result;
        
    },
    flatten: function() {
        var queries = this.parse();
        var name;
         for (name in queries) {
            queries[name] = queries[name][0];
            
        }
        return queries;
        
    },
    toString: function() {
        return 'ebScriptQuery [path=' + this.scriptPath + ']';
        
    }
};

try {
    var gEbQueries = new ebScriptQuery(ebScriptFileName).flatten();
    
}
catch (e) {}

function ebCAutoSideParams()
{
    this.nPanelInitPosX = null;
    // Initial setting for x coordinate panel positioning
    this.nPanelInitPosY = null;
    // Initial setting for y coordinate panel positioning
    this.nPanelInitCorner = null;
    // Initial setting for panel positioning reference corner 
    this.nPanelInitPosType = null;
    // Initial setting for panel positioning type 
    this.oPanelParams = null;
    // Object to hold all initial panel positioning values for all panels
    this.DU = null;
    // Display Unit
    this.sCurrentPanelName = null;
    function mmFixPanelPos(panelName) {
         try {
            
            var panelObj = this.DU.ad.panels[panelName.toLowerCase()];
            // reference to Panel obj in DU
            var panelWidth = parseInt(panelObj.nWidth, 10);
            // width of panel
            var panelHeight = parseInt(panelObj.nHeight, 10);
            // height of panel
            var bannerWidth = parseInt(panelObj.bannerDU.adData.nWidth, 10);
            // width of banner
            var bannerHeight = parseInt(panelObj.bannerDU.adData.nHeight, 10);
            // height of banner
            var panelCorner = panelObj.nCorner;
            // Corrner used as reference for relative location (from MediaMind platform)
            var panelX = panelObj.nXPos;
            // Relative x-positioning of panel
            var panelY = panelObj.nYPos;
            // Relative y-positioning of panel
            
            // X-coordinate of banner
            var bannerX = (this.DU.fEbExpBanerIM) ? window.screenLeft : ebGetRealLeft(this.DU.bannerRes);
            
            // Y-coordinate of banner
            var bannerY = (this.DU.fEbExpBanerIM) ? window.screenTop : ebGetRealTop(this.DU.bannerRes);
			
            var screenHeight = null;
            var screenWidth = null;
            
            if (this.DU.fEbExpBanerIM) {
                // running in IM environment
                screenHeight = parseInt(window.screen.availHeight, 10);
                // Height of viewable screen
                screenWidth = parseInt(window.screen.availWidth, 10);
                // Width of viewable screen
                
            }
            else {
                // not running in IM environment
                var clientArea = new ebCClientArea(gEbDisplayPage.TI);
                clientArea.calc();
                screenHeight = parseInt(clientArea.nHeight, 10);
                // Height of viewable browser window
                screenWidth = parseInt(clientArea.nWidth, 10);
                // Width of viewable browser window
                
            }
            // not running in IM environment
            
            // Check if banner is on left side of screen or right side of screen,and adjust panel position accordingly
            var midScreen = screenWidth / 2;
			if (panelX < 0) { //Unit By default expands to the left
				if (bannerX + (bannerWidth / 2) < midScreen) {
					// Banner is further to the left than to the right so make panel expand to the right instead
					
					var panelRightEdge = bannerX + panelWidth;
					var bannerRightEdge = bannerX + bannerWidth;
					var panToBanDiff = panelRightEdge - bannerRightEdge;
					panelX = panelX + panToBanDiff;
                } 
			}else { //Unit Expands to the Right by default
                if (bannerX + (bannerWidth / 2) > midScreen) {
					// Banner is further to the right than to the left so make panel expand to the left instead
					
					var panelRightEdge = bannerX + panelX + panelWidth;
					var bannerRightEdge = bannerX + bannerWidth;
					var panToBanDiff = panelRightEdge - bannerRightEdge;
					panelX =- panToBanDiff;
                } 
			}
            // These vars are so we can do one single calculation for positioning for all potential corner-alignments
            var topOffset = 0;
            var leftOffset = 0;
            
            // I believe this code ONLY works if we are positioning our panel in reference to our banner (nPosType = 1);
            
            // Also, might only work if we have just one monitor.... I don't beleive multiple monitors are not accounted for
             switch (parseInt(panelCorner, 10)) {
                // Determine which corner of the banner the panel is being displayed in reference to
                case 1:
                    // Top Left corner of banner
                    
                    // No offset necessary
                    break;
                case 2:
                    // Top Right corner of banner
                    
                    // Need to set left offset to the negative width of the banner
                    leftOffset = -bannerWidth;
                    break;
                case 3:
                    // Bottom Left corner of banner
                    
                    // Need to set top offset to the negative height of the banner
                    topOffset = -bannerHeight;
                    break;
                case 4:
                    // Bottom Right corner of banner
                    
                    // Need to set top offset to negative height of banner, and left offset to negative width of banner
                    leftOffset = -bannerWidth;
                    topOffset = -bannerHeight;
                    break;
                    
            }
            var realPanelX = bannerX + panelX + leftOffset;
            // calculate real x-coordinate of panel with relation to the screen
            var realPanelY = bannerY + panelY + topOffset;
            // calculate real y-coordinate of panel with relation to the screen

			
			
            var newRealPanelX = realPanelX;
            var newRealPanelY = realPanelY;
            
            // Check If It Will Expand Beyond Right Side
             if (realPanelX + panelWidth > screenWidth) {
                // Panel will be cut off on right side
                 if (gEbBC.isChrome()) {
                    // v7 fix which accounts for the 4px border built in to the chrome browser
                    leftOffset -= 4;
                    
                }
                newRealPanelX = screenWidth - panelWidth + leftOffset;
                // Set panel to display right-aligned with right side of screen
                
            }
            // Panel will be cut off on right side
            
            // Check If It Will Expand Beyond Left Side
             if (realPanelX < 0) {
                // Panel will be cut off on left side
                newRealPanelX = leftOffset;
                // Set panel to display left-aligned with left side of screen
                
            }
            // Panel will be cut off on left side
            
            // Check If It Will Expand Beyond Bottom of Screen
             if (realPanelY + panelHeight > screenHeight) {
                // Panel will be cut off on bottom
                // JK edit // newRealPanelY = screenHeight - panelHeight + topOffset;
                // Set panel to display bottom-aligned with bottom of screen
                
            }
            // Panel will be cut off on bottom
            
            // Check If It Will Expand Beyond Top Of Screen
             if (realPanelY < 0) {
                // Panel will be cut off on top
                newRealPanelY = topOffset;
                // Set panel to display top-aligned with top of screen
                
            }
            // Panel will be cut off on top
            
            // Set panel's relative position, based on banner position, to NOT clip as per calculations above
            panelObj.nXPos = newRealPanelX - bannerX;
            panelObj.nYPos = newRealPanelY - bannerY;
            
            panelObj.nPosType = 1;
            // Set panel to be relative to banner regardless of what it was ever set for
            panelObj.nCorner = 1;
            // Set panel to be calculated relative to top-left corner of banner
            
        }
        catch (e) {
            gEbDbg.error("Error in mmFixPanelPosition: " + e.message);
            
        }
    }
    this.adjustPanelPosition = mmFixPanelPos;
    
}
function ebCAutoSideParamsInit(duName) {
     try {
		if (gEbQueries.adid == eval(duName).adData.nAdID) {
            // only execute code if correct ad
            ebDu = eval(duName);
            gEbDbg.delimiter("================= Using '" + ebScriptFileName + "' Custom Script =====================");
            
            if (ebDu.ebCAutoSideParamsInst.DU === null) {
                ebDu.ebCAutoSideParamsInst.DU = eval(duName);
                
            }
            
            // Create object to handle all panel info
            var oPanelObj = null;
            var oThisPanel = null;
            ebDu.ebCAutoSideParamsInst.oPanelParams = {};
            var strThisPanel;
             for (strThisPanel in ebDu.ebCAutoSideParamsInst.DU.ad.panels) {
                // loop through all panels in ad
                oThisPanel = ebDu.ebCAutoSideParamsInst.DU.ad.panels[strThisPanel.toLowerCase()];
                oPanelObj = {};
                oPanelObj.nPanelInitPosX = oThisPanel.nXPos;
                // Initial setting for x coordinate panel positioning
                oPanelObj.nPanelInitPosY = oThisPanel.nYPos;
                // Initial setting for y coordinate panel positioning
                oPanelObj.nPanelInitLeft = oThisPanel.nLeft;
                // Initial setting for x coordinate panel positioning
                oPanelObj.nPanelInitTop = oThisPanel.nTop;
                // Initial setting for y coordinate panel positioning
                oPanelObj.nPanelInitCorner = oThisPanel.nCorner;
                // Initial setting for panel positioning reference corner 
                oPanelObj.nPanelInitPosType = oThisPanel.nPosType;
                // Initial setting for panel position type
                ebDu.ebCAutoSideParamsInst.oPanelParams[oThisPanel.strPanelName.toLowerCase()] = oPanelObj;
                // Add this panel to the panel params object
                
                // Disable the adjustRelativeOffsetIM function for the panel (to fix IM positioning)
                
                // We will handle positioning on our own.
                oThisPanel.adjustRelativeOffsetIM = function() {};
                
            }
            // loop through all panels in ad
            
        }
        // only execute code if correct ad
        
    }
    catch (e) {
        gEbDbg.error("Error in " + ebScriptFileName + ":onAfterDefaultBannerShow(): " + e.message);
        
    }
}

function ebCCustomEventHandlers()
{
    this.onClientScriptsLoaded = function(objName) {
        
        // This allows multiple preload scripts to be set on one page for different ads.  DO NOT REMOVE THIS LINE!!!
        gstrEbPreLoadScripts = undefined;
        
    };
    this.onBeforeAddRes = function(objName) {};
    this.onHandleInteraction = function(objName, intName, strObjID) {};
    this.onBeforeDefaultBannerShow = function(objName) {
		ebDu = eval(objName);
		if (!ebDu.ebCAutoSideParamsInst){ebDu.ebCAutoSideParamsInst = new ebCAutoSideParams();}
		ebCAutoSideParamsInit(objName);
	};
    this.onAfterDefaultBannerShow = function(objName){};
    this.onBeforeRichFlashShow = function(objName) {};
    this.onAfterRichFlashShow = function(objName) {};
    this.onBeforePanelShow = function(objName, panelName)
    {
         try {
				ebDu = eval(objName);
				
                 if (!ebDu.ebCAutoSideParamsInst.DU.adData.nAdID) {
					 ebCAutoSideParamsInit(objName);
                    
                }
           
			 if (gEbQueries.adid == ebDu.ebCAutoSideParamsInst.DU.adData.nAdID) {
                // only execute code if correct ad
                if (ebDu.ebCAutoSideParamsInst.DU.isSEAd()) {
                    // single expandable
                    
                    ebDu.ebCAutoSideParamsInst.sCurrentPanelName = panelName;
                    
                    ebDu.ebCAutoSideParamsInst.DU.onSEExpandStarted = function(actionType, strObjId) {
                        
                        // function to handle fixing of the panel positioning
                        
                        ebDu.ebCAutoSideParamsInst.adjustPanelPosition(ebDu.ebCAutoSideParamsInst.sCurrentPanelName);
                        this.doOnResize();
                        
                        this.handleSystemInteraction("ebPanelsViewed");
                        var strPanelName = "";
                         if (strObjId.indexOf(ebgstrPanelObjName) != -1) {
                            var arrParams = strObjId.split(ebgstrDelimiter);
                            strPanelName = arrParams[2];
                            
                        }
                        var panelName = strPanelName.toLowerCase();
                        var interactionKey = strPanelIntKeyPrefix + panelName;
                        this.ebsysteminteractionHandler(interactionKey);
                        this.ebstarttimerHandler(panelName + "_duration");
                         if (this.isDefaultPanelPlayingVideo(this))
                            this.dwellTimeManager.handleVideoPlay(0);
                        this.WSEventSender.eventType = !this.isSEAd() ? ebWSEvent.expandVideoStrip : ebWSEvent.expandSE;
                        this.WSEventSender.actionType = actionType;
                        this.WSEventSender.elementID = strObjId;
                        this.WSEventSender.sendEvent(strPanelName);
                        this.WSEventSender.resetEvent();
                        this.panelFrequency.onExpand();
                        
                    };
                    
                    ebDu.ebCAutoSideParamsInst.DU.ebseretractstartedHandler = function(actionType, strObjId) {
                        
                        var panelName = this.defaultPanel.strPanelName.toLowerCase();
                        
                        // reset the platform positioning values of the panel so if movement occurs of the banner, we can readjust the positioning of the panel accordingly.
                        ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nXPos = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitPosX;
                        ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nYPos = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitPosY;
                        ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nLeft = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitLeft;
                        ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nTop = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitTop;
                        ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nCorner = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitCorner;
                        ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nPosType = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitPosType;
                        
                        this.doOnResize();
                        
                        this.dwellTimeManager.handlePanelClose(panelName);
                        this.ebendtimerHandler(panelName + "_duration");
                        this.WSEventSender.eventType = !this.isSEAd() ? ebWSEvent.retractVideoStrip : ebWSEvent.retractSE;
                        this.WSEventSender.actionType = actionType;
                        this.WSEventSender.elementID = strObjId;
                        var strPanelName = "";
                         if (strObjId.indexOf(ebgstrPanelObjName) != -1) {
                            var arrParams = strObjId.split(ebgstrDelimiter);
                            strPanelName = arrParams[2];
                            
                        }
                        this.WSEventSender.sendEvent(strPanelName);
                        this.WSEventSender.resetEvent();
                        
                    }
                    
                }
                else {
                    // regular expandable
                   // function to handle fixing of the panel positioning
                    ebDu.ebCAutoSideParamsInst.adjustPanelPosition(panelName);
                    
                }
            }
            // only execute code if correct ad
            
        }
        catch (e) {
            gEbDbg.error("Error in " + ebScriptFileName + ":onBeforePanelShow(): " + e.message);
            
        }
    };
    this.onAfterPanelShow = function(objName, panelName) {};
    this.onBeforePanelHide = function(objName, panelName) {
        
    };
    this.onAfterPanelHide = function(objName, panelName) {
         try {
			ebDu = eval(objName);
             if (gEbQueries.adid == ebDu.ebCAutoSideParamsInst.DU.adData.nAdID) {
                
                // reset the platform positioning values of the panel so if movement occurs of the banner, we can readjust the positioning of the panel accordingly.
                ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nXPos = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitPosX;
                ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nYPos = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitPosY;
                ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nLeft = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitLeft;
                ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nTop = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitTop;
                ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nCorner = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitCorner;
                ebDu.ebCAutoSideParamsInst.DU.ad.panels[panelName.toLowerCase()].nPosType = ebDu.ebCAutoSideParamsInst.oPanelParams[panelName.toLowerCase()].nPanelInitPosType;
                
            }
        }
        catch (e) {
            gEbDbg.error("Error in " + ebScriptFileName + ":onAfterPanelHide(): " + e.message);
            
        }
    };
    this.onBeforeAdClose = function(objName) {};
    this.onAfterAdClose = function(objName) {};
    this.onBeforeIntroShow = function(objName) {};
    this.onAfterIntroShow = function(objName) {};
    this.onBeforeIntroHide = function(objName) {};
    this.onAfterIntroHide = function(objName) {};
    this.onBeforeRemShow = function(objName) {};
    this.onAfterRemShow = function(objName) {};
    this.onBeforeRemHide = function(objName) {};
    this.onAfterRemHide = function(objName) {};
    this.onBeforeMiniSiteShow = function(objName) {};
    this.onAfterMiniSiteShow = function(objName) {};
    this.onBeforeMiniSiteHide = function(objName) {};
    this.onAfterMiniSiteHide = function(objName) {};
    
}

//verify by Ad ID or Flight ID
 try {
     if (gEbQueries.type == 'oob') {
        // out-of-banner/floating ad
         if (typeof(gEbEyes) != "undefined") {
            
            // check is the same as the ad is defined in the script
             if (gEbQueries.adid) {
                 for (i = gEbEyes.length - 1; i > -1; i--) {
                     if (gEbEyes[i].adData.nAdID == gEbQueries.adid) {
                        gEbEyes[i].adData.customEventHandler = new ebCCustomEventHandlers();
                        break;
                        
                    }
                }
            }
            if (gEbQueries.flightid) {
                 for (i = gEbEyes.length - 1; i > -1; i--) {
                     if (gEbEyes[i].adData.nFlightID == gEbQueries.flightid) {
                        gEbEyes[i].adData.customEventHandler = new ebCCustomEventHandlers();
                        break;
                        
                    }
                }
            }
        }
    }
    else {
        //rich banner / default
         if (typeof(gEbBanners) != "undefined") {
             if (gEbQueries.adid) {
                 for (i = gEbBanners.length - 1; i > -1; i--) {
                     if (gEbBanners[i].adData.nAdID == gEbQueries.adid) {
                        gEbBanners[i].adData.customEventHandler = new ebCCustomEventHandlers();
                        break;
                        
                    }
                }
            }
            if (gEbQueries.flightid) {
                 for (i = gEbBanners.length - 1; i > -1; i--) {
                     if (gEbBanners[i].adData.nFlightID == gEbQueries.flightid) {
                        gEbBanners[i].adData.customEventHandler = new ebCCustomEventHandlers();
                        break;
                        
                    }
                }
            }
            
        }
    }
}
catch (e) {}