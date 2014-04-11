/**
 * This object contains a number of methods used for the 2010/2011 League Pass.
 *
 * @type {Object}
 */

var nbaLeaguePass = function () {

	/*** BEGIN: Set some manual global variables ***/

	var w = window;

	var config = {
		general:{
			appPath:'/pr/leaguepass/app/2013/console.html',
			debug:true,
			ilpURI:'https://ilp.nba.com/nbalp/secure/registerform?utm_source=nbacom&utm_medium=text&utm_content=generic&utm_campaign=NBACOMGENERIC',
			redirectTimeout:500
		},
		gallery:{
			defaultImage:'/2012/images/12/13/LeaguePass-Main-slides-holiday_v01.jpg',
			loopMax:2,
			target:'lpbbMastSlider',
			timeout:6000,
			slideDuration:2
		},
		mso:{
			infoNode:'instMsg',
			acceptTerms:"options['acceptTerms']",
			provider:{
				acctNum:'partnerUserId',
				acctNumOrig:'partnerUserIdOrig',
				acctNumError:'accountNumberError',
				acctNumInput:'partnerUserIdOrig',
				auth:{
					clientId:"NBAD",
					flash:{
						major:10,
						minor:2,
						release:152,
						url:'http://get.adobe.com/flashplayer/',
						name:'installFlash',
						width:'750',
						height:'550'
					},
					loadingId:'lpbbLoading',
					nMessageId:'lpbbProviderAuthNPass',
					providerDDId:'partnerId',
					providerDDWrapId:'lpbbProviderDD',
					providerResource:'NBALP3',
					tokenId:'partnerToken',
					resourceId:'partnerResource',
					zMessageId:'lpbbProviderAuthZPass'
				},
				popupId:'mvpddiv',
				popupFrameId:'mvpdframe',
				reqInfo:'lpbbProviderReqInfo',
				resource:{
					ATT:'NBALP3',
					Brighthouse:'NBALP3',
					Cox:'NBALP3',
					DTV:'NBALP3',
					TWC:'NBALP3',
					verizon:'NBALP3'
				},
				subError:'subscribeError'
			}
		},
		server:{
			adobeSwfURL:'https://entitlement.auth.adobe.com/entitlement/AccessEnabler.swf',
			app:'http://premium.nba.com',
			img:'http://i.cdn.turner.com/nba/nba',
			msib:'https://audience.nba.com/services/msib/flow/',
			page:'http://www.nba.com',
			secImg:'https://s.cdn.turner.com/nba/nba',
			stf:'https://account.nba.com/'
		}
	};

	//Setting the ILP campaign ID
	if (w.location.pathname.indexOf('gameinfo.html') != -1) {
		config.general.ilpURI = 'http://watch.nba.com/nba/subscribe?utm_source=nbacom&utm_medium=graphic&utm_content=gameinfo&utm_campaign=NBACOMAUTO';
	} else if (w.location.pathname.indexOf('gameline') != -1) {
		config.general.ilpURI = 'http://watch.nba.com/nba/subscribe?utm_source=nbacom&utm_medium=text&utm_content=gameline&utm_campaign=NBACOMAUTO'; 
	} else if (w.location.pathname == '/') {
		config.general.ilpURI = 'http://watch.nba.com/nba/subscribe?utm_source=nbacom&utm_medium=text&utm_content=hp&utm_campaign=NBACOMNAV';
	}

	if (w.location.pathname.indexOf('lpb-msoActivate') != -1) {
		config.mso.provider.init = true;
	}

	/*** END: Set some manual global variables ***/

	/*** BEGIN: Set some automatic global variables ***/
	//Set the default date that all links will be display.
	config.general.displayDate = new Date();
	config.general.displayDate.setFullYear(2011,5,16);
	config.general.displayDate.setHours(10,0,0,0);

	//Check if we have an Internet Explorer browser, if so, get the exact version.
	if (navigator.appVersion.indexOf("MSIE")==-1) {
		config.general.ieBrowser = null;
	} else {
		config.general.ieBrowser = /MSIE (\d{1,})?/.exec(navigator.appVersion)[1];
	}

	/* get the file name */
	if (w.location.pathname.split('/').length == 1) {
		config.general.fileName = w.location.pathname; 
	} else {
		var splitPath = w.location.pathname.match(/^(\/(.*))?$/)[2].split('/');
		config.general.fileName = splitPath.pop();
	}

	//Get the gallery images from the array created by the CMS.
	if (w.galleryImages && w.galleryImages.length > 1) {

		//Override the default image with the first one in the array.
		config.gallery.defaultImage = w.galleryImages[0];
		config.gallery.images = w.galleryImages;

	} else {
		config.gallery.images = [config.gallery.defaultImage];
	}

	//Get the current geographic value (if it is set)
	if (w.nbaGeoLocation) {
		config.general.geoLocation = w.nbaGeoLocation;
	} else {
		config.general.geoLocation = 'UNKNOWN';
	}

	var domains = w.location.hostname.split('.').reverse();

	switch(domains[2]) {
		case 'payp1dev1':
		case 'nba-webdev-preview':
			config.server.adobeSwfURL = "https://entitlement.auth-staging.adobe.com/entitlement/AccessEnabler.swf";
			config.server.app = 'http://premium-webdev.nba.com';
			config.server.img = 'http://nba-webdev-preview.nba.com';
			config.server.msib = 'http://payp1dev1.nba.com:1085/services/nba-msib/flow/';
			config.server.page = 'http://nba-webdev-preview.nba.com';
			config.server.secImg = 'http://nba-webdev-preview.nba.com';
			config.server.stf = 'http://account-qai.nba.com/';
		break;
		case 'aud-qai':
		case 'account-qai':
		case 'nba-ref-preview':
		case 'nba-pt':
			config.server.adobeSwfURL = "https://entitlement.auth-staging.adobe.com/entitlement/AccessEnabler.swf";
			config.server.app = 'http://premium-qa.nba.com';
			config.server.img = 'http://nba-ref-preview.nba.com';
			config.server.msib = 'https://aud-qai.nba.com/services/msib/flow/';
			config.server.page = 'http://nba-ref-preview.nba.com';
			config.server.secImg = 'https://s.cdn.turner.com/nba/nba';
			config.server.stf = 'https://account-qai.nba.com/';
		break;
		case '56m':
		case 'account-staging':
			config.server.adobeSwfURL = "https://entitlement.auth-staging.adobe.com/entitlement/AccessEnabler.swf";
			config.server.app = 'http://premium-qa.nba.com';
			config.server.img = 'http://nba-ref-preview.nba.com';
			config.server.msib = 'https://aud-qai.nba.com/services/msib/flow/';
			config.server.page = 'http://nba-ref-preview.nba.com';
			config.server.secImg = 'https://s.cdn.turner.com/nba/nba';
			config.server.stf = 'https://account-staging.nba.com/';
		break;
		case 'nba-qa-preview':
			config.server.adobeSwfURL = "https://entitlement.auth-staging.adobe.com/entitlement/AccessEnabler.swf";
			config.server.app = 'http://premium-qa.nba.com';
			config.server.img = 'http://nba-qa-preview.nba.com';
			config.server.msib = 'https://aud-qai.nba.com/services/msib/flow/';
			config.server.page = 'http://nba-qa-preview.nba.com';
			config.server.secImg = 'https://s.cdn.turner.com/nba/nba';
			config.server.stf = 'https://account-qai.nba.com/';
		break;
		case 'staging':
			switch(domains[3]) {
				case 'dev':
					config.server.adobeSwfURL = "https://entitlement.auth-staging.adobe.com/entitlement/AccessEnabler.swf";
					config.server.app = 'http://premium-qa.nba.com';
					config.server.img = 'http://nba-qa-preview.nba.com';
					config.server.msib = 'https://aud-qai.nba.com/services/msib/flow/';
					config.server.page = 'http://nba-qa-preview.nba.com';
					config.server.secImg = 'https://s.cdn.turner.com/nba/nba';
					config.server.stf = 'https://account-staging.nba.com/';
				break;
				case 'ref':
					config.server.adobeSwfURL = "https://entitlement.auth-staging.adobe.com/entitlement/AccessEnabler.swf";
					config.server.app = 'http://premium-qa.nba.com';
					config.server.img = 'http://nba-qa-preview.nba.com';
					config.server.msib = 'https://aud-qai.nba.com/services/msib/flow/';
					config.server.page = 'http://nba-qa-preview.nba.com';
					config.server.secImg = 'https://s.cdn.turner.com/nba/nba';
					config.server.stf = 'https://account-qai.nba.com/'; 
				break;
			};
		break;
	};
	
	/*** END: Set some automatic global variables ***/

	var main = function() {
		/*** BEGIN: Set object defaults based on above preprocessing ***/
		this.appLocation=config.server.app+config.general.appPath;
		this.debug=config.general.debug;
		this.displayDate=config.general.displayDate;
		this.fileName=config.general.fileName;
		this.geoLocation=config.general.geoLocation;
		this.ilpURI=config.general.ilpURI;
		this.ieBrowser=config.general.ieBrowser;
		this.imgBasePath=config.server.img;
		this.msibBasePath=config.server.msib;
		this.pageBasePath=config.server.page;
		this.providerInit=config.mso.provider.init;
		this.redirectTimeout=config.general.redirectTimeout;
		this.stfBasePath=config.server.stf;

		/*** BEGIN: Set the main functions. ***/
		this.displayLink=function(linkID,currDate,displayDate) {

			var re = /^[0]+/g;
			if (!displayDate) {
				var nbaDisplayDate = this.displayDate;
			} else {
				var arrDD = displayDate.split(",");
				var nbaDisplayDate = new Date();
				nbaDisplayDate.setFullYear(arrDD[0],(arrDD[1].replace(re,'')-1),arrDD[2].replace(re,''));
				nbaDisplayDate.setHours(arrDD[3].replace(re,''),0,0,0);
			}
			var nbaCurrDate = new Date();
			var arrCD = currDate.split(",");
			nbaCurrDate.setFullYear(arrCD[0],(arrCD[1].replace(re,'')-1),arrCD[2].replace(re,''));
			nbaCurrDate.setHours(arrCD[3].replace(re,''),0,0,0);
			if (nbaDisplayDate<=nbaCurrDate) {
				document.getElementById(linkID).style.display='inline';
			}
			return true;
		}

		this.init=function() {

			if (this.providerInit === true) {
				/*** BEGIN: The MSO Authorization and Authentication functions. ***/
				this.mso.provider.init();
				/*** END: The MSO Authorization and Authentication functions. ***/
			}
		}

		this.launchApp=function(gameID,debug,type,cid){

			// note: if passing in the cid, you need to set values for all of the 
			// arguments - if an arg doesn't have a value then use '' or null
			// for example: 
			// launchApp('','','','','nba289');
			// or 
			// launchApp(null,null,null,'nba289');
			if (this.geoLocation == 'UNKNOWN' && window.nbaGeoLocation) {
				this.geoLocation = window.nbaGeoLocation;
			}

			//Add more case matches under the "US" match for other white-listed countries.
			switch(this.geoLocation) {
				case 'US':
				case 'UNKNOWN':
					var lpPage = this.appLocation;
				    var escapedCid = (cid && cid != "") ? "&cid=" + escape(cid) : "";
					lpPage += (debug && debug.indexOf("true")>-1)?"?debug=true":"?debug=false";
					lpPage += (type && type != "") ? "&type=" + type : "&type=lp";
					lpPage += (gameID && gameID != "") ? "&gameID=" + gameID : "";
					//Check to make sure that all the basic login cookies are set, if not, redirect to the login page.
					if (document.cookie.indexOf('authid') == -1 || document.cookie.indexOf('TSid') == -1) {
						lpPage = this.msibBasePath+'lpb-authorizer?url='+escape(lpPage)+escapedCid;
					} else {
						lpPage += escapedCid;
					}
					window.open(lpPage,"lpWindow","width=1000,height=650,top=0,left=0,menubar=no,toolbar=no,status=no,location=no,resizable=yes,scrollbars=yes");
					return void(0);
				break;
				default:
					window.location = this.ilpURI;
			};
		}
		
		this.checkFlashFirst = function(gameID,debug,type,cid) {
			if (navigator.userAgent.match(/iPad|iPhone|iPod|Android|BlackBerry|BB10|Opera.Mobi/)) {
				location.href="http://www.nba.com/mobile/";
			} else {
				//flash checker
				var version = this.getFlashVersion().split(',').shift();
				if(version >= 11){
					this.launchApp(gameID,debug,type,cid);
				}else{
					iBox.showURL('http://www.nba.com/leaguepass/schedule/flash.html');
				}
			}
		}
		
		this.getFlashVersion = function() {
			  // ie
			  try {
			    try {
			      // avoid fp6 minor version lookup issues
			      // see: http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
			      var axo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.6');
			      try { axo.AllowScriptAccess = 'always'; }
			      catch(e) { return '6,0,0'; }
			    } catch(e) {}
			    return new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version').replace(/\D+/g, ',').match(/^,?(.+),?$/)[1];
			  // other browsers
			  } catch(e) {
			    try {
			      if(navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin){
			        return (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]).description.replace(/\D+/g, ",").match(/^,?(.+),?$/)[1];
			      }
			    } catch(e) {}
			  }
			  return '0,0,0';
			}

		this.log=function(message) {
			if (window.console && window.console.log && this.debug) {
				window.console.log(message);
			}
		}

		this.checkPhone=function(obj) {
			 str = obj.value.replace(/[^0-9]+?/g, '');
			  switch (str.length) {
			   case 6:
			     str = str.substr(0,3)+"-"+str.substr(3,4);
			     break;
			   case 9:
			   case 10:
			   case 11:
			     str = "("+str.substr(0,3)+") "+str.substr(3,3)+"-"+str.substr(6,3);
			     break;
			  }
			  
			  obj.value = str;
		}
		
		this.chkCookie=function(){
			if(document.cookie)
			{
				var cookieName = 'LPMobileTxt';
				var count = this.getCookie("LPMobileTxt");
				
				if(count != null)
				{
					if(count == 3)
					{
						alert("too many times!");
					}
					else 
					{
						var phoneNumInput = $('#phoneNumber').val();
						var phoneNum = phoneNumInput.replace(/[^0-9]+?/g, '');
						if(phoneNum != "") {
							var url = "http://bell.tbs.io/OutgoingSMS/SendBundle?to="+ phoneNum  +"&name=NBALeaguePass";
							var num = parseInt(count);
							num = num + 1;
							$.ajax({
			                    url: url,
			                    type : 'POST',
			                    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
			                    data: "{}"
			                });
							this.putCookie(cookieName, num);
							$('#phoneNumber').val('');
							$( "#textResponse" ).show( "slow", function() {});
						}
					}
				}
				else 
				{ 
					var phoneNumInput = $('#phoneNumber').val();
					var phoneNum = phoneNumInput.replace(/[^0-9]+?/g, '');
					if(phoneNum != "") {
						var url = "http://bell.tbs.io/OutgoingSMS/SendBundle?to="+ phoneNum  +"&name=NBALeaguePass";
						$.ajax({
		                    url: url,
		                    type : 'POST',
		                    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
		                    data: "{}"
		                });
						this.putCookie(cookieName, 0);
						$('#phoneNumber').val('');
						$( "#textResponse" ).show( "slow", function() {});
				    }
				}
			}
			else 
			{
				var phoneNumInput = $('#phoneNumber').val();
				var phoneNum = phoneNumInput.replace(/[^0-9]+?/g, '');
				if(phoneNum != "") {
					var url = "http://bell.tbs.io/OutgoingSMS/SendBundle?to="+ phoneNum  +"&name=NBALeaguePass";
					$.ajax({
	                    url: url,
	                    type : 'POST',
	                    contentType : 'application/x-www-form-urlencoded; charset=UTF-8',
	                    data: "{}"
	                });
					this.putCookie(cookieName, 0);
					$('#phoneNumber').val('');
					$( "#textResponse" ).show( "slow", function() {});
				}
			}
		}
		
		this.getCookie=function(c_name) {
			var c_value = document.cookie;
			var c_start = c_value.indexOf(" " + c_name + "=");
			if (c_start == -1)
			  {
			  c_start = c_value.indexOf(c_name + "=");
			  }
			if (c_start == -1)
			  {
			  c_value = null;
			  }
			else
			  {
			  c_start = c_value.indexOf("=", c_start) + 1;
			  var c_end = c_value.indexOf(";", c_start);
			  if (c_end == -1)
			    {
			    c_end = c_value.length;
			    }
			  c_value = unescape(c_value.substring(c_start,c_end));
			  }
			return c_value;
		}
		
		this.putCookie=function(cookieName, value) {
			expiry = new Date();
			expiry.setDate(expiry.getDate() + 1);
			if(cookieName == 'LPMobileTxt')
			{
				document.cookie=cookieName+"="+ value +"; expires=" + expiry.toGMTString();
			}
			else 
			{
				document.cookie=cookieName+"="+ value + ";domain=.nba.com;path=/";
			}
		}
		
		this.startPurchase=function(salesKey,flowName,cid,checkoutNum){
			var my = this;

			switch(flowName) {
				case 'LeaguePass-Preview':
					if (this.fileName == 'lpb-authorizer') {
						this.parentWindow(my.msibBasePath+"free-preview-enroll");
					} else {
						window.setTimeout(function(){window.location=my.msibBasePath+"free-preview-enroll"},my.redirectTimeout);
					}
				break;
				case 'LeaguePass-Coupon':
					window.setTimeout(function(){window.location=nbaLeaguePass.stfBasePath+'redeem/'},this.redirectTimeout);
				break;
				default:
					if (cid && cid !="")
					{
						window.setTimeout("window.location='" + this.stfBasePath + "affiliate/" + escape(cid) + "?redirect=checkout/" + escape(checkoutNum) + "';",this.redirectTimeout);
					}
					else
					{
						window.setTimeout("window.location='" + this.stfBasePath + "checkout/" + escape(checkoutNum) + "';",this.redirectTimeout);
					}
			};
			return void(0);
		}

		this.parentWindow=function(url) {
			window.opener.location=url;
			window.opener.focus();
			window.setTimeout(function(){window.close();},this.redirectTimeout);
			return void(0);
		}

		this.setPopups=function(excludeIDs,excludeClasses) {
			var nbaAllAnchors = document.getElementsByTagName('a');
			this.matchFound = false;
			for (i in nbaAllAnchors) {
				if (nbaAllAnchors[i].id && excludeIDs) {
					var arrIDs = excludeIDs.split(",");
					for (j in arrIDs) {
						if (arrIDs[j] == nbaAllAnchors[i].id) {
							this.matchFound = true;
							break;
						}
					}
				}
				if (this.matchFound === true) {continue}
				
				if (nbaAllAnchors[i].className && excludeClasses) {
					var arrClasses = excludeClasses.split(",");
					for (k in arrClasses) {
						if (arrClasses[k] == nbaAllAnchors[i].className) {
							this.matchFound = true;
							break;
						}
					}
				}
				if (this.matchFound === true) {continue}
				
				nbaAllAnchors[i].onkeypress = function(){window.open(this.href); return false;};
				nbaAllAnchors[i].onclick = function(){window.open(this.href); return false;};
			}
		}
		/*** END: Set the main functions. ***/
	}
	/*** END: Set object defaults based on above preprocessing ***/

	/*** BEGIN: Set up the gallery object. ***/
	var gallery=function() {
		/*** BEGIN: Set gallery object defaults. ***/
		this.count=config.gallery.images.length;
		this.defaultImage=config.gallery.defaultImage;
		this.loopMax=config.gallery.loopMax;
		this.loopCount=1;
		this.imageCount=0;
		this.images=config.gallery.images;
		this.paused=false;
		this.targetID=config.gallery.target;
		this.timeout=config.gallery.timeout;
		this.secImgBasePath=config.gallery.secImg;
		this.slideDuration=config.gallery.slideDuration;
		/*** BEGIN: Set gallery object defaults. ***/

		/*** BEGIN: Set the main gallery functions. ***/
		this.advanceImage=function() {
			this.currentImage = this.newImage;
			this.imageCount++;
			window.setTimeout(function(){nbaLeaguePass.gallery.checkImage();},this.timeout);
			return true;
		}

		this.bringToFront=function() {
				this.currentImage.style['zIndex']='2';
				return true;
		}

		this.checkLoading=function(){
				if(this.newImage.complete){
					this.fadeImages();
				} else {
					window.setTimeout(function(){nbaLeaguePass.gallery.checkLoading();},100);
				}
				return true;
		}

		this.checkImage=function() {
				if (this.imageCount < this.count) {
					if (this.paused === false) {
						this.loadImage();
					} else {
						window.setTimeout(function(){nbaLeaguePass.gallery.checkImage();},1000);
					}
				} else {
					if (this.loopCount < this.loopMax) {
						this.loopCount++;
						this.imageCount = 0;
						this.checkImage();
					}
				}
				return true;
		}

		this.displayCurrentImage=function(){
				this.currentImage.style['display']='block';
				//Get the correct opacity value.
				if (this.ieBrowser > 7) {
					this.currentImage.style['-ms-filter']='progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';
				} else if (this.ieBrowser > 4) {
					this.currentImage.style['filter']='alpha(opacity=100)';
				} else {
					this.currentImage.setStyle({opacity:'1'});
				}
				return true;
		}

		this.fadeImages=function() {
				var parent = this;
				this.fadeOut = null;
				this.fadeIn = null;
				if (this.currentImage) {
					this.bringToFront();
					this.fadeOut = new Effect.Appear(this.currentImage,{duration:this.slideDuration,from:1.0,to:0.0,afterFinish:function(){parent.removeImage();}});
				}
				this.target.appendChild(this.newImage);
				this.fadeIn = new Effect.Appear(this.newImage,{duration:this.slideDuration,from:0.0,to:1.0,afterFinish:function(){parent.advanceImage();}});
				return true;
		}

		this.load=function() {
				this.target = document.getElementById(this.targetID);
				//Had to remove "setStyle" because of a bug with IE and Prototype 1.6.1.
				this.target.style['position']='relative';
				this.target.style['overflow']='hidden';
				if (this.count > 1) {
					this.imageCount = 0;
					this.checkImage();
				} else {
					this.loopCount = this.loopMax;
					this.imageCount = 0;
					this.checkImage();
				}
				return true;
		}

		this.loadImage=function() {
				this.newImage = document.createElement('img');
				this.newImage.setAttribute('src',this.imgBasePath+this.images[this.imageCount]);
				this.newImage.style['position']='absolute';
				this.newImage.style['left']='0px';
				this.newImage.style['top']='0px';
				if (this.ieBrowser > 7) {
					this.newImage.style['-ms-filter']='progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
				} else if (this.ieBrowser > 5) {
					this.newImage.style['filter']='alpha(opacity=0)';
				} else {
					this.newImage.style['opacity']='0';
				}
				/* If the image isn't ready, then wait. */
				if(!this.newImage.complete) {
					this.checkLoading();
				} else {
					/* The image is ready. */
					this.fadeImages();
				}
				return true;
		}

		this.morphCurrentImage=function() {
				this.currentImage.morph('left:'+this.newImage.offsetWidth+'px', {duration:this.slideDuration});
				return true;
			},

		this.morphNewImage=function() {
				this.newImage.morph('left:0px', {duration:this.slideDuration});
				return true;
		}

		this.positionNewImage=function() {
				this.newImage.style['left']='-'+this.newImage.offsetWidth+'px';
				this.newImage.style['display']='block';
				if (this.ieBrowser > 7) {
					this.newImage.style['-ms-filter']='progid:DXImageTransform.Microsoft.Alpha(Opacity=100)';
				} else if (this.ieBrowser > 4) {
					this.newImage.style['filter']='alpha(opacity=100)';
				} else {
					this.newImage.setStyle({opacity:'1'});
				}
				return true;
		}

		this.removeImage=function() {
				this.target.removeChild(this.currentImage);
				return true;
		}

		this.slideRight=function(){
				if (this.currentImage) {
					this.displayCurrentImage();
					this.bringToFront();
					this.morphCurrentImage();
				}
				this.positionNewImage();
				this.morphNewImage();
				this.currentImage = this.newImage;
				return true;
		}

		/*** END: Set the main gallery functions. ***/
	}



	/*** END: Set up the gallery object. ***/

	/*** BEGIN: Set the main MSO functions. ***/
	var mso = function() {
		this.acceptTerms=config.mso.acceptTerms;
		this.acctNum=config.mso.provider.acctNum;
		this.acctNumOrig=config.mso.provider.acctNumOrig;
		this.acctNumError=config.mso.provider.acctNumError;
		this.acctNumInput=config.mso.provider.acctNumInput;
		this.providerDDId=config.mso.provider.auth.providerDDId;
		this.popupId=config.mso.provider.popupId;
		this.popupFrameId=config.mso.provider.popupFrameId;
		this.infoNode=config.mso.infoNode;
		this.reqInfo=config.mso.provider.reqInfo;
		this.subError=config.mso.provider.subError;

		this.checkLength=function(provider,field) {
			switch(provider) {
				case 'cablevision':
					if (field.value.length > 13) {
						alert('"Cablevision" accounts are only 13 digits long, please check your account number and try again.');
						document.getElementById(this.acctNumError).style.display='inline';
						field.value = field.value.substr(0,13);
						field.focus();
					}
				break;
			};
			return true;
		}

		this.displayHelpText=function(provider) {
				var currNode = document.getElementById(this.infoNode);
				switch(provider) {
					case 'cablevision':
						currNode.innerHTML='<p>Please enter your 13-digit Cablevision account number.<br/><br/><a href="http://optimum.custhelp.com/cgi-bin/optimum.cfg/php/enduser/std_adp.php?p_faqid=948&amp;p_created=1096483547&amp;p_sid=2st4nQbk&amp;p_accessibility=0&amp;p_redirect=&amp;p_lva=&amp;p_sp=cF9zcmNoPTEmcF9zb3J0X2J5PSZwX2dyaWRzb3J0PSZwX3Jvd19jbnQ9MTI4LDEyOCZwX3Byb2RzPTAmcF9jYXRzPSZwX3B2PSZwX2N2PSZwX3BhZ2U9MSZwX3NlYXJjaF90ZXh0PWFjY291bnQgbnVtYmVy&amp;p_li=&amp;p_topview=1" target="_blank">Don&#39;t know your Account Number?</a></p>';
					break;
					case 'timewarner':
						currNode.innerHTML='<p>Please enter the last 6 digits of your Time Warner Cable account number.</p>';
					break;
					default:
						currNode.innerHTML='';
				};
		}

		this.reverseText=function(input) {
				var splitInput = input.split("");
				var reversedInput = splitInput.reverse();
				var output = reversedInput.join("");
				return output;
		}
		
		this.stripAcctnum=function(provider,account) {
				switch(provider){
					case 'cablevision':
						var accountRev = this.reverseText(account);
						accountRev = accountRev.substr(0,7);
						accountRev = this.reverseText(accountRev);
						return accountRev;
					break;
					case 'comcast':
						if (account.length == 16) {
							return account.substr(1,15);
						} else if (account.length == 14) {
							return account.substr(1,12);
						} else {
							return account;
						}
					break;
					default:
						return account;
				};
		}
		
		this.submit=function(form){
				document.getElementById(this.acctNumError).style.display='none';
				document.getElementById(this.subError).style.display='none';
				if (this.provider.tve === false) {
					if (this.trim(form[this.acctNumOrig].value) == '') {
						alert('The "Customer Account Number" field cannot be blank.  Please enter your account number and try again.');
						document.getElementById(this.acctNumError).style.display='inline';
						form[this.acctNumOrig].focus();
						return false;
					}
				}
				if (!form[this.acceptTerms].checked) {
					alert("You must accept the NBA League Pass Broadband Subscriber Agreement");
					document.getElementById(this.subError).style.display='inline';
					form[this.acceptTerms].focus();
					return false;
				}
				//set appropriate account number
				form[this.acctNum].value = this.stripAcctnum(form[this.providerDDId].options[form[this.providerDDId].selectedIndex].value,this.trim(form[this.acctNumOrig].value));
				//submit form
				return true;
		}
		
		this.trim=function(stringToTrim) {
			return stringToTrim.replace(/\s+/g,'');
		}
		/*** END: Set the main MSO functions. ***/
	}

	/*** BEGIN: Set the provider functions. ***/
	var provider = function() {

		this.checkAuth=function(provider) {
			this.hideReqInfo(provider);
			document.getElementById(this.auth.options.nMessageId).className="Loading";
			this.auth.provider = provider;
			this.auth.getAuthentication(this.auth.options.resource);
			this.auth.selectProvider(this.auth.provider);
		}

		this.checkFlash=function() {
			if (typeof swfobject != 'undefined') {
				var flashVersion = swfobject.getFlashPlayerVersion();
				var minVersion = config.mso.provider.auth.flash;
				if (flashVersion.major > minVersion.major) {
					this.log("Required Flash version verified (installed: "+flashVersion.major+"."+flashVersion.minor+"."+flashVersion.release+".x)");
					return true;
				}
				else if (flashVersion.major == minVersion.major && flashVersion.minor >= minVersion.minor && flashVersion.release > minVersion.release) {
					this.log("Required Flash version verified (installed: "+flashVersion.major+"."+flashVersion.minor+"."+flashVersion.release+".x)");
					return true;
				} else {
					this.log("Required Flash version not met (installed: "+flashVersion.major+"."+flashVersion.minor+"."+flashVersion.release+".x, needed: "+minVersion.major+"."+minVersion.minor+"."+minVersion.release+".x), notifying user.");
					alert("This website requires Flash version \""+minVersion.major+"."+minVersion.minor+"."+minVersion.release+".x\" in order to validate your account. A window for installing the latest Flash version will now be opened.");
					window.open(minVersion.url,minVersion.name,"location=1,status=1,scrollbars=1, width="+minVersion.width+",height="+minVersion.height);
					return false;
				}
			} else {
				this.log("Required Flash version not met (installed: none, needed: "+minVersion.major+"."+minVersion.minor+"."+minVersion.release+".x), notifying user.");
				alert("This website requires Flash version \""+minVersion.major+"."+minVersion.minor+"."+minVersion.release+".x\" in order to validate your account. A window for installing the latest Flash version will now be opened.");
				window.open(minVersion.url,minVersion.name,"location=1,status=1,scrollbars=1, width="+minVersion.width+",height="+minVersion.height);
				return false;
			}
		}

		this.displayAcctInput=function() {
			document.getElementById(this.reqInfo).style.display="block";
		}

		this.displayAuthInfo=function() {
			document.getElementById(this.auth.options.nMessageId).className="Message";
			document.getElementById(this.auth.options.zMessageId).className="Message";
		}

		this.displayReqInfo=function(provider) {
			switch(provider) {
				case 'Adobe_Brightcove':
				case 'ATT':
				case 'Brighthouse':
				case 'Cox':
					this.tve = true;
					this.auth.options.resource = config.mso.provider.resource[provider.toLowerCase()];
					document.getElementById(this.auth.options.resourceId).value = this.auth.options.resource;
					this.displayHelpText(provider);
					this.hideAcctInput();
					this.hideAuthInfo();

					if (!this.auth.provider || this.auth.provider == 'None') {
						if (confirm("You are about to be redirected to the \""+provider+"\" login page, once you successfully log in, you will be sent back to this page.")) {
							this.checkAuth(provider);
						}
					} else if (this.auth.provider != provider && this.auth.nPassed === true) {
						document.getElementById(this.auth.options.nMessageId).innerHTML = this.auth.options.authNMessage(this.auth.provider,provider);
						this.displayAuthInfo();
					} else {
						document.getElementById(this.auth.options.nMessageId).innerHTML = this.auth.options.authNMessage(this.auth.provider);
						this.displayAuthInfo();
					}
				break;
				case 'cablevision':
					this.tve = false;
					this.displayHelpText(provider);
					this.displayAcctInput();
					this.hideAuthInfo();
					document.getElementById(this.acctNumInput).focus();
				break;
				case 'TWC':
				case 'DTV':
				case 'Verizon':
					this.tve = true;
					this.auth.options.resource = config.mso.provider.resource[provider.toLowerCase()];
					document.getElementById(this.auth.options.resourceId).value = this.auth.options.resource;
					this.displayHelpText(provider);
					this.hideAcctInput();
					this.hideAuthInfo();

					if (!this.auth.provider || this.auth.provider == 'None') {
						document.getElementById(this.popupId).style.display = 'block';
						this.checkAuth(provider);
					} else if (this.auth.provider != provider && this.auth.nPassed === true) {
						document.getElementById(this.auth.options.nMessageId).innerHTML = this.auth.options.authNMessage(this.auth.provider,provider);
						this.displayAuthInfo();
					} else {
						document.getElementById(this.auth.options.nMessageId).innerHTML = this.auth.options.authNMessage(this.auth.provider);
						this.displayAuthInfo();
					}
				break;
				default:
					this.tve = false;
					this.displayHelpText(provider);
					this.displayAcctInput();
					this.hideAuthInfo();
					document.getElementById(this.acctNumInput).focus();
			};
		}

		this.hideAcctInput=function() {
			document.getElementById(this.reqInfo).style.display="none";
		}

		this.hideAuthInfo=function() {
			document.getElementById(this.auth.options.nMessageId).className="Hidden";
			document.getElementById(this.auth.options.zMessageId).className="Hidden";
		}

		this.hideReqInfo=function(provider) {
			switch(provider) {
				case 'Adobe_Brightcove':
				case 'ATT':
				case 'Brighthouse':
				case 'Cox':
				case 'DTV':
				case 'TWC':
				case 'Verizon':
					document.getElementById(this.reqInfo).style.display="none";
				break;
				default:
			};
			document.getElementById(this.auth.options.nMessageId).className="Hidden";
			document.getElementById(this.auth.options.zMessageId).className="Hidden";
		}

		this.init=function() {
			if (!this.checkFlash()) {
				var messageDiv = document.getElementById(config.mso.provider.auth.nMessageId);
				if (messageDiv) {
					messageDiv.innerHTML = 'Please <a href="javascript:window.location.reload(true);">refresh</a> this page once you have updated your version of Flash.';
					messageDiv.className="Message";
				}
			} else {
				if (typeof(CVP) != "undefined" && typeof(CVP.AuthManager) != "undefined") {
					var auth = new CVP.AuthManager({
						adobeSwfURL:config.server.adobeSwfURL,
						clientId:config.mso.provider.auth.clientId,
						loadingId:config.mso.provider.auth.loadingId,
						nMessageId:config.mso.provider.auth.nMessageId,
						providerDDId:config.mso.provider.auth.providerDDId,
						providerDDWrapId:config.mso.provider.auth.providerDDWrapId,
						resource:config.mso.provider.auth.providerResource,
						resourceId:config.mso.provider.auth.resourceId,
						swfobject:swfobject,
						tokenId:config.mso.provider.auth.tokenId,
						zMessageId:config.mso.provider.auth.zMessageId,
						authNMessage:function(currProvider,newProvider) {
							if (newProvider) {
								return 'Though you just selected "'+newProvider+'", you are currently authenticated with "'+currProvider+'". If this is not the provider that you have purchased League Pass through, please <a href="javascript:nbaLeaguePass.mso.provider.auth.logout();">log out</a> and select your provider from the above dropdown.';
							} else {
								return 'You are authenticated with "'+currProvider+'". If this is not the provider that you have purchased League Pass through, please <a href="javascript:nbaLeaguePass.mso.provider.auth.logout();">log out</a> and select your provider from the above dropdown.';
							}
						},
						providerWhitelist:{
							ATT: true,
							Brighthouse: true,
							Cox: true,
							DTV: true,
							TWC: true,
							Verizon: true
						},
						onCustomMVPDPicker:function(props) {
						},
						onInitReady:function() {
							AUTHREADY = true;
							auth.ready = true;
							auth.isAuthenticated();
						},
						onAuthenticationPassed:function() {
							AUTHBOOL = true;
							auth.nPassed = true;
							auth.provider = auth.getProviderID();
							this.partnerDD = document.getElementById(this.providerDDId);
							this.updateDropDown();
							document.getElementById(this.loadingId).style.display="none";
							document.getElementById(this.providerDDWrapId).style.display="block";
							document.getElementById(this.nMessageId).className="Message";
							document.getElementById(this.nMessageId).innerHTML = this.authNMessage(auth.provider);
							document.getElementById(this.zMessageId).className="Loading";
							this.partnerDD.focus();
							if (config.mso.provider.resource[auth.provider.toLowerCase()]) {
								this.resource = config.mso.provider.resource[auth.provider.toLowerCase()];
							}
							document.getElementById(this.resourceId).value = this.resource;
							auth.getAuthorization(this.resource);
						},
						onAuthenticationFailed:function(errorCode) {
							AUTHBOOL = false;
							auth.nPassed = false;
							auth.provider = 'None';
							this.partnerDD = document.getElementById(this.providerDDId);
							this.updateDropDown();
							document.getElementById(this.loadingId).style.display="none";
							document.getElementById(this.providerDDWrapId).style.display="block";
							this.partnerDD.focus();
						},
						onAuthorizationPassed:function(resource) {
							AUTHBOOL = true;
							auth.zPassed = true;
							auth.resource = resource;
							document.getElementById(this.zMessageId).className="Message";
							document.getElementById(this.zMessageId).innerHTML = 'We have verified that you have purchased League Pass from "'+auth.provider+'". Please read through and agree to the subscriber agreement below, then click on the "Submit" button to complete your League Pass activation.';
							auth.token = auth.getAccessToken();
							document.getElementById(this.tokenId).value = auth.token.accessToken;
						},
						onAuthorizationFailed:function(resource,errorCode,errorString) {
							AUTHBOOL = false;
							auth.zPassed = false;
							document.getElementById(this.zMessageId).className="Message";
							document.getElementById(this.zMessageId).innerHTML = 'We\'re sorry. Based on the information you entered, it appears you have not purchased NBA League Pass. Please <a href="javascript:void(window.open(\'http://leaguepasssupport.nba.com\'));">click here</a> for more information.';
						},
						onTrackingData:function(eventType,trackingData) {
							auth.eventType = eventType;
							auth.trackingData = trackingData;
						},
						updateDropDown:function() {
							var countPartners = this.partnerDD.options.length;
							for (var i=0;i<countPartners;i++) {
								if (this.partnerDD.options[i].value.toLowerCase() == auth.provider.toLowerCase()) {
									this.partnerDD.options[i].selected = true;
									break;
								}
							}
						}
					});
					this.auth = auth;
				}
			}
		}

		this.logoutAuth=function(provider) {
			this.auth.logout();
			window.setTimeout(function(){nbaLeaguePass.mso.provider.checkAuth(provider);},1000);
		}
	}

	/*** END: Set the provider functions. ***/

	/*** BEGIN: Connect all of the objects. ***/

	var base = new main();
	gallery.prototype=base;
	gallery.prototype.constructor=gallery;
	base.gallery = new gallery();

	mso.prototype=base;
	mso.prototype.constructor=mso;
	base.mso = new mso();

	provider.prototype=base.mso;
	provider.prototype.constructor=provider;
	base.mso.provider = new provider();
	/*** END: Connect all of the objects. ***/

	/*** BEGIN: Do some final initialization when the window loads. ***/
	var oldLoad = window.onload ? window.onload : function() {};
	window.onload=function(){
		oldLoad();
		base.init();
	}
	/*** END: Do some final initialization when the window loads. ***/

	/*** BEGIN: Return the final "nbaLeaguePass" object ***/
	return base;
}();