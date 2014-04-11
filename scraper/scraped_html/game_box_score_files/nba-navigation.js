function loadJS(src, callback) {
	var scripts = document.getElementsByTagName('script')[0];
    var s = document.createElement('script');
    s.type = "text/javascript";
    s.src = src;
    s.async = true;
    s.onreadystatechange = s.onload = function() {
        var state = s.readyState;
        if (!callback.done && (!state || /loade|complete/.test(state))) {
            callback.done = true;
            callback();
        }
    };
    //document.getElementsByTagName('head')[0].appendChild(s);
    scripts.parentNode.insertBefore(s, scripts);
}

var $nbaNav = {
    
    /******* private fields *********/

    _target: 'nbaHeader',
    _onBodyDoneTimerId: null,
	gpInterval: null,

    /******* private methods ********/

    _onBodyDone: function() {
        $nbaNav._init();
    },
    _init: function(){
        var nav;
        if (document.getElementById(this._target)) {
            nav = document.getElementById(this._target);
        }
        else {
            nav = document.createElement('div');
            nav.id = this._target;
            var body = document.getElementsByTagName('body')[0];
            body.insertBefore(nav, body.childNodes[0]);
        }
       
        var s = document.getElementsByTagName('script')[0];
        
        loadJS('http://www.nba.com/cmsinclude/desktopWrapperHeader_jsonp.html', function() { 
		    // put your code here to run after script is loaded
			nav.innerHTML = $nbaNav._getHTML();
			$nbaNav._hookHovers();
			$nbaNav._setupSearchInput();
		});
        
		
        
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/plusone.js';
		
		s.parentNode.insertBefore(po, s);
										
		var adaMenu = document.createElement('script'); adaMenu.type = 'text/javascript'; adaMenu.async = true;
		adaMenu.src = 'http://i.cdn.turner.com/nba/nba/.element/js/3.0/accessibility/jquery.accessibility.js';
		s.parentNode.insertBefore(adaMenu, s);
					
        /*var textResizer = document.createElement('script'); textResizer.type = 'text/javascript'; textResizer.async = true;
		textResizer.src = 'http://i.cdn.turner.com/nba/nba/.element/js/3.0/accessibility/nbaTextResizer.js';
		s = document.getElementById('nbaTextResizeNav'); 
		s.parentNode.insertBefore(textResizer, s.nextSibling);*/
		
		
		//window.gpInterval=setInterval(this.checkForGoogle, 300);
		
				        	
			        
        if (document.removeEventListener) {
            document.removeEventListener('DOMContentLoaded', this._onBodyDone, false);
        }
        if (this._onBodyDoneTimerId) {
            clearInterval(this._onBodyDoneTimerId);
        }
        if (this._onCssTimerId) {
            clearInterval(this._onCssTimerId);
        }
    },
	checkForGoogle: function(){
		if($(".nbaGooglePlus iframe").length!=0)
		{
			$(".nbaGooglePlus iframe").attr("name", "Publicly Recommended on Google +");
			window.clearInterval(this.gpInterval);
		}
	
	},
    _hookHovers: function(){
        var sfEls = document.getElementById("nbaGlobalNav").getElementsByTagName("LI");
        for (var i = 0; i < sfEls.length; i++) {
            sfEls[i].onmouseover = function(){
                this.className = (this.className ? this.className + " " : "") + "nbaHover";
            }
            sfEls[i].onmouseout = function(){
                this.className = this.className.replace(/\s*?\bnbaHover\b/, "");
            }
        }
    },
    _getNavHTML: function(navElement, key){
		var navPosition = navElement;
		if(typeof navElement.length == 'undefined')
		{
			for (var k in navElement){
			    if (navElement.hasOwnProperty(k)) {
			    	//document.write("Key is " + k + ", value is" + navElement[k]);
			    	if(k == "class" || k == "id" || k == "href" || k == "title" || k == "style" || k == "target")
			    	{
			    		if(k == "href" && navElement[k].indexOf("http:") == -1)
			    		{
			    			window.out += k + '="http://www.nba.com'+navElement[k]+'"';
			    		}
			    		else
			    		{
			    			window.out += k + '="'+navElement[k]+'"';
			    		}
			    	}
			    	if(k == "text")
			    	{
			    		window.out += ">" + navElement[k];	
			    	}
			    	if (k == 'nav' || k == "a" || k == "li" || k == "ul" || k == "div" || k == "span")
			    	{
    			    		if( k != 'nav')
			    			{
    			    			window.out += '>';	
			    			}
    			    		window.out += "<"+ k + " ";
    			    		this._getNavHTML(navElement[k], k);
			    			if(typeof navElement[k].text != 'undefined')
			    			{
			    				window.out += "</"+ k ;
			    			}
			    			else if(k == "li" && navElement[k].length > 0)
			    			{	
			    			}
			    			else 
			    			{
			    				window.out += "</"+ k + ">";
			    			}
			    	}
			    }
			}	
		}
		else {
			var arrayLength = navElement.length;
			for(var i=0;i<navElement.length;i++)
			{
				if(i != 0)
				{
					window.out += "<"+ key + " ";
				}
				this._getNavHTML(navElement[i], i);
    			if(typeof navElement[i].a != 'undefined' && (typeof navElement[i].div == 'undefined' || typeof navElement[i].div.class == 'undefined' || navElement[i].div.class != 'nbaNavDropdown'))
    			{
    				window.out += "></"+ key + ">";
    			}
    			else 
    			{
    				window.out += "</"+ key + ">";
    			}
			}
		}
		
    },
    _getHTML: function(){
    	 window.out = '';
         window.out += '<h1 class="nbaAssist">NBA.com, Official site of the National Basketball Association</h1><span class="nbaLogo"><a href="http://www.nba.com" title="Link to NBA.com Homepage">Link to NBA.com</a></span>';
         window.out += '<script src="http://i.cdn.turner.com/nba/nba/.element/js/global/2.0/nbaGlobalNav.js" type="text/javascript"></script>';
 		//NEW CODE
         this._getNavHTML(nav);
         //END New code
         window.out += '<div id="nbaSearch"><div class="nbaSkin"></div><form action="http://www.nba.com/search" method="get"><!--[if IE]><label for="nbaSearchInput" id="nbaSearchInputLabel">Search NBA.com</label><![endif]--><input type="text" value="" name="text" id="nbaSearchInput" placeholder="Search NBA.com" title="Search on NBA.com" /><button type="submit" class="nbaSubmit" value="Submit">Submit</button></form></div>';
         window.out +='<div class="nbaSocial"><div class="nbaLogin"><div class="nbaGlobal"><a href="http://www.nba.com/global" title="Link to NBA Global Homepage">NBA Global</a></div><div class="nbaWNBA"><a href="http://www.wnba.com" title="Link to WNBA Homepage">WNBA</a></div><div class="nbaDleague"><a href="http://www.nba.com/dleague" title="Link to NBA D-League Homepage">NBA Dleague</a></div><div id="nbaChromeLogin"><div class="Action"><a title="Link to get news and offers" target="_top" href="http://www.nba.com/allaccess/about.html">Get News & Offers</a></div>';
         window.out +='<div class="User"><a href="https://audience.nba.com/services/msib/flow/login?" title="Log into NBA.com">Login</a> | </div></div></div>';
         window.out +='<div class="nbaFBLike"><!--[if !IE]><!--><iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com/nba&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21&amp;appId=164914533589201"></iframe><!--<![endif]--><!--[if IE]><iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com/nba&amp;send=false&amp;layout=button_count&amp;width=100&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21&amp;appId=164914533589201" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" allowtransparency="true" style="border:none; overflow:hidden;"></iframe><![endif]--></div>';
         window.out +='<div class="nbaTwitterFollow"><!--[if !IE]><!--><iframe src="//platform.twitter.com/widgets/follow_button.html?screen_name=NBA&amp;show_count=true"></iframe><!--<![endif]--><!--[if IE]><iframe src="//platform.twitter.com/widgets/follow_button.html?screen_name=NBA&amp;show_count=true" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" allowtransparency="true" style="border:none; overflow:hidden;"></iframe><![endif]--></div>';
         window.out +='<div class="nbaGooglePlus"><div class="g-plusone" data-size="medium" data-href="http://www.nba.com"></div></div></div>';
         //add in storenav stuff here
         this._getNavHTML(storeNav);
         //end storenav stuff here
         window.out += '<style>.nbaSubTitle {text-decoration:none !important; cursor:default;} #nbaStoreNav .nbaNavDropdown a {text-align:left;}</style>';
 		
         return window.out;
    },
    
    updateSearchFormLabel: function(){
	    var label = document.getElementById("nbaSearchInputLabel");
	    var input = document.getElementById("nbaSearchInput");
	    var focus = (input == document.activeElement);
    	if(focus && input.value=='') {
    		if(navigator.appName == "Microsoft Internet Explorer") {
	    		label.style.display = 'none';
    		} else {
    			/* non IE browsers support the placeholder attribute */
    			input.placeholder = '';
    		}
	    } else if (!focus && input.value=='') {
	    	if(navigator.appName == "Microsoft Internet Explorer") {
	    		label.style.display = 'block';
	    	} else {
	    		/* non IE browsers support the placeholder attribute */
	    		input.placeholder = "Search NBA.com";
	    	}
	    }
    	return true;
    },
    _setupSearchInput: function(){
    	var input = document.getElementById("nbaSearchInput");
    	input.onfocus = function(){$nbaNav.updateSearchFormLabel();}
    	input.onblur = function(){$nbaNav.updateSearchFormLabel();}
    },
    

    /******** public fields *********/

    getCDN: function(){
        var server = window.location.hostname;
        var secure = window.location.protocol.match(/https/i);
        if (secure) {
            return 'https://s.cdn.turner.com/nba';
        } else {
            return 'http://z.cdn.turner.com/nba';
        }
    },
    img: function(src, alt, attributes){
        alt = typeof(alt) != 'undefined' ? alt : '';
        attributes = typeof(attributes) != 'undefined' ? attributes : '';
        return '<img src="' + this.getCDN() + src + '" alt="' + alt + '" ' + attributes + '/>';
    },
    
    init: function(){
        for (i = 0; i < document.styleSheets.length; i++) {
            var css = document.styleSheets[i];
        }
        if (!this._cssDone && document.createStyleSheet) {
            document.createStyleSheet(this.getCDN() + (window.location.protocol == 'https:'?'/tmpl_asset/static/nba-cms3-homepage/latest/css/pkg-min.css':'/tmpl_asset/static/nba-cms3-homepage/latest/css/pkg-min.css'));
			
        }
        else 
            if (!this._cssDone) {
                var ss = document.createElement('link');
                ss.rel = 'stylesheet';
                ss.href = this.getCDN() + (window.location.protocol == 'https:'?'/tmpl_asset/static/nba-cms3-homepage/latest/css/pkg-min.css':'/tmpl_asset/static/nba-cms3-homepage/latest/css/pkg-min.css');
                var head = document.getElementsByTagName('head')[0];
                head.insertBefore(ss, head.childNodes[0]);
				//ss.href="/.element/css/3.0/global/nbaTextResizeNav.css";
                //head.insertBefore(ss, head.childNodes[0]);
            }
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', this._onBodyDone, false);
        }
		
		
		
        this._onBodyDoneTimerId = setInterval(function(){
            if (/loaded|complete/.test(document.readyState)) {
                $nbaNav._onBodyDone();
            }
        }, 50);
		
	},    
    
    /******** navigation *********/
    
    _nav: [
    {
        id: "Tickets",
        url: "http://www.nba.com/tickets/tickets.html?ls=iref:nba:gnav",
        nbacl: "nbaSingleton"
    }, {
       id: "Teams",
        url: "http://www.nba.com/teams?ls=iref:nba:gnav",
        nbacl: "nbaTeams",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "Eastern Conference",
                        divisions : [
                            {
                                name : 'Atlantic',
                                teams : [
                                    {
                                        label : 'Boston Celtics',
                                        url : 'http://www.nba.com/celtics?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamBOS'
                                    },
                                    {
                                        label : 'Brooklyn Nets',
                                        url : 'http://www.nba.com/nets?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamBKN'
                                    },
                                    {
                                        label : 'New York Knicks',
                                        url : 'http://www.nba.com/knicks?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamNYK'
                                    },
                                    {
                                        label : 'Philadelphia 76ers',
                                        url : 'http://www.nba.com/sixers?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamPHI'
                                    },
                                    {
                                        label : 'Toronto Raptors',
                                        url : 'http://www.nba.com/raptors?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamTOR'
                                    }
                                ]
                            },
                            {
                                name : 'Central',
                                teams : [
                                    {
                                        label : 'Chicago Bulls',
                                        url : 'http://www.nba.com/bulls?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamCHI'
                                    },
                                    {
                                        label : 'Cleveland Cavaliers',
                                        url : 'http://www.nba.com/cavaliers?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamCLE'
                                    },
                                    {
                                        label : 'Detroit Pistons',
                                        url : 'http://www.nba.com/pistons?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamDET'
                                    },
                                    {
                                        label : 'Indiana Pacers',
                                        url : 'http://www.nba.com/pacers?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamIND'
                                    },
                                    {
                                        label : 'Milwaukee Bucks',
                                        url : 'http://www.nba.com/bucks?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamMIL'
                                    }
                                ]
                            },
                            {
                                name : 'Southeast',
                                teams : [
                                    {
                                        label : 'Atlanta Hawks',
                                        url : 'http://www.nba.com/hawks?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamATL'
                                    },
                                    {
                                        label : 'Charlotte Bobcats',
                                        url : 'http://www.nba.com/bobcats?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamCHA'
                                    },
                                    {
                                        label : 'Miami Heat',
                                        url : 'http://www.nba.com/heat?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamMIA'
                                    },
                                    {
                                        label : 'Orlando Magic',
                                        url : 'http://www.nba.com/magic?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamORL'
                                    },
                                    {
                                        label : 'Washington Wizards',
                                        url : 'http://www.nba.com/wizards?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamWAS'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "Western Conference",
                        divisions : [
                            {
                                name : 'Southwest',
                                teams : [
                                    {
                                        label : 'Dallas Mavericks',
                                        url : 'http://www.nba.com/mavericks?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamDAL'
                                    },
                                    {
                                        label : 'Houston Rockets',
                                        url : 'http://www.nba.com/rockets?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamHOU'
                                    },
                                    {
                                        label : 'Memphis Grizzlies',
                                        url : 'http://www.nba.com/grizzlies?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamMEM'
                                    },
                                    {
                                        label : 'New Orleans Pelicans',
                                        url : 'http://www.nba.com/pelicans?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamNOH'
                                    },
                                    {
                                        label : 'San Antonio Spurs',
                                        url : 'http://www.nba.com/spurs?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamSAS'
                                    }
                                ]
                            },
                            {
                                name : 'Northwest',
                                teams : [
                                    {
                                        label : 'Denver Nuggets',
                                        url : 'http://www.nba.com/nuggets?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamDEN'
                                    },
                                    {
                                        label : 'Minnesota Timberwolves',
                                        url : 'http://www.nba.com/timberwolves?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamMIN'
                                    },
                                    {
                                        label : 'Portland Trail Blazers',
                                        url : 'http://www.nba.com/blazers?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamPOR'
                                    },
                                    {
                                        label : 'Oklahoma City Thunder',
                                        url : 'http://www.nba.com/thunder?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamOKC'
                                    },
                                    {
                                        label : 'Utah Jazz',
                                        url : 'http://www.nba.com/jazz?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamUTA'
                                    }
                                ]
                            },
                            {
                                name : 'Pacific',
                                teams : [
                                    {
                                        label : 'Golden State Warriors',
                                        url : 'http://www.nba.com/warriors?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamGSW'
                                    },
                                    {
                                        label : 'Los Angeles Clippers',
                                        url : 'http://www.nba.com/clippers?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamLAC'
                                    },
                                    {
                                        label : 'Los Angeles Lakers',
                                        url : 'http://www.nba.com/lakers?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamLAL'
                                    },
                                    {
                                        label : 'Phoenix Suns',
                                        url : 'http://www.nba.com/suns?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamPHX'
                                    },
                                    {
                                        label : 'Sacramento Kings',
                                        url : 'http://www.nba.com/kings?ls=iref:nba:gnav',
                                        classVal : 'nbaTeamSAC'
                                    }
                                ]
                            }
                        ]
                }
        ]
	}, {
        id: "Scores &amp; Schedules",
        url: "/gameline?ls=iref:nba:gnav",
        nbacl: "nbaSingleton"
    }, {    
       id: "News",
        url: "http://www.nba.com/news?ls=iref:nba:gnav",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'NBA Headlines',
                                        url : 'http://www.nba.com/news?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Transactions',
                                        url : 'http://stats.nba.com/transactions.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'NBA.com Writers',
                                        url : 'http://www.nba.com/personalities?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'News Archive',
                                        url : 'http://www.nba.com/news/news_archive.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'RSS',
                                        url : 'http://www.nba.com/rss?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'History',
                                        url : 'http://www.nba.com/history?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Daily Ref Assignments',
                                        url : 'http://www.nba.com/news/referee.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Important Dates',
                                        url : 'http://www.nba.com/news/important-dates/index.html?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "More",
                        subs : [
                            {
                                teams : [
                                	{
									    label : '2014 All-Star',
									    url : 'http://www.nba.com/allstar/2014/?ls=iref:nba:gnav'
									},
									{
                                    	label : '2013 Hall of Fame',
                                    	url : 'http://www.nba.com/halloffame?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : '2013 Summer League',
                                        url : 'http://www.nba.com/summerleague?ls=iref:nba:gnav'
                                    },
									{
									    label : '2013 NBA Draft',
									    url : 'http://www.nba.com/draft?ls=iref:nba:gnav'
									},
                                    {
                                        label : '2013 Playoffs',
                                        url : 'http://www.nba.com/playoffs?ls=iref:nba:gnav'
                                    },
									{
                                        label : '2013 All-Star',
                                        url : 'http://www.nba.com/allstar?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
       id: "Blogs",
        url: "http://hangtime.blogs.nba.com?ls=iref:nba:gnav",
        nbacl: "nbaPreventDefault",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'Hang Time Blog',
                                        url : 'http://hangtime.blogs.nba.com?ls=iref:nba:gnav',
										target: '_blank'
                                    },
                                    {
                                        label : 'Hang Time Podcast',
                                        url : 'http://hangtime.blogs.nba.com/category/podcast?ls=iref:nba:gnav',
										target: '_blank'
                                    },
                                    {
                                        label : 'All Ball Blog',
                                        url : 'http://allball.blogs.nba.com?ls=iref:nba:gnav',
										target: '_blank'
                                    },
                                    {
                                        label : 'Ten Before Tip',
                                        url : 'http://tbt.blogs.nba.com?ls=iref:nba:gnav',
										target: '_blank'
                                    },
                                    {
                                        label : 'CharlesBarkley.com',
                                        url : 'http://charlesbarkley.com?ls=iref:nba:gnav',
										target: '_blank'
                                    },
                                    {
                                        label : 'MikeFratello.com',
                                        url : 'http://mikefratello.com?ls=iref:nba:gnav',
										target: '_blank'
                                    },
                                    {
                                        label : 'The Starters',
                                        url : 'http://thestarters.nba.com/',
										target: '_blank'
                                    }									
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "NBA.com Ladders",
                        subs : [
                            {
                                teams : [
									{
									    label : 'Rookie Ladder',
									    url : 'http://www.nba.com/rookie-ladder?ls=iref:nba:gnav'
									},
                                    {
                                        label : 'Dunk Ladder',
                                        url : 'http://www.nba.com/dunk-ladder?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Top Plays Ladder',
                                        url : 'http://www.nba.com/top-plays-ladder?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Kia MVP Ladder',
                                        url : 'http://www.nba.com/mvp-ladder?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
       id: "Video",
        url: "http://www.nba.com/video?ls=iref:nba:gnav",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'All Videos',
                                        url : 'http://www.nba.com/video?ls=iref:nba:gnav'
									},
                                    {
                                        label : 'Highlights',
                                        url : 'http://www.nba.com/video/highlights?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'Playoffs 2013',
                                    	url : 'http://www.nba.com/video/playoffs?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'Top Plays',
                                    	url : 'http://www.nba.com/video/topplays?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'NBA TV',
                                        url : 'http://www.nba.com/video/nbatv?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Editor&#39;s Picks',
                                        url : 'http://www.nba.com/video/editorspicks?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'TNT OT',
                                        url : 'http://www.nba.com/video/tntot?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Video Rulebook',
                                        url : 'http://www.nba.com/videorulebook?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "More",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'Fantasy',
                                        url : 'http://www.nba.com/video/nbatv/fantasy?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'NBA Rooks',
                                        url : 'http://www.nba.com/video/nbarooks?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'The Association',
                                        url : 'http://www.nba.com/theassociation?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'History',
                                        url : 'http://www.nba.com/video/history?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
       id: "Players",
        url: "http://www.nba.com/players?ls=iref:nba:gnav",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'Players',
                                        url : 'http://www.nba.com/players?ls=iref:nba:gnav'
									},
                                    {
                                        label : 'Coaches',
                                        url : 'http://www.nba.com/news/coaches/index.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Team Rosters',
                                        url : 'http://www.nba.com/teams/teamIndividualLinks.html?title=Team%20Roster&amp;file=roster&ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Free Agent Tracker',
                                        url : 'http://www.nba.com/freeagents/2013?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'NBA Rooks',
                                        url : 'http://www.nba.com/rooks?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'Kia Performance Awards',
                                    	url : 'http://www.nba.com/awards?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "More",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'Legends',
                                        url : 'http://www.nba.com/history/legends/legends-index/index.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Historical Player Search',
                                        url : 'http://stats.nba.com/players.html?ls=iref:nba:gnav#historic-players'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
       id: "Standings",
        url: "http://www.nba.com/standings?ls=iref:nba:gnav",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'By Division',
                                        url : 'http://www.nba.com/standings/team_record_comparison/conferenceNew_Std_Div.html?ls=iref:nba:gnav'
									},
                                    {
                                        label : 'By Conference',
                                        url : 'http://www.nba.com/standings/team_record_comparison/conferenceNew_Std_Cnf.html?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "More",
                        subs : [
                            {
                                teams : [
                                    {
                                    	label : 'Streaks &amp; Last 10',
                                    	url : 'http://www.nba.com/standings/team_record_comparison/conferenceNew_Stk_Cnf.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Ahead &amp; Behind',
                                        url : 'http://www.nba.com/standings/team_record_comparison/conferenceNew_Ahd_Div.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Margin &amp; Stats',
                                        url : 'http://www.nba.com/standings/team_record_comparison/conferenceNew_Mrg_Div.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : '2012-13 Standings',
                                        url : 'http://www.nba.com/standings/2012/team_record_comparison/conferenceNew_Std_Div.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : '2011-12 Standings',
                                        url : 'http://www.nba.com/standings/2011/team_record_comparison/conferenceNew_Std_Div.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Season Recaps',
                                        url : 'http://www.nba.com/history/nba-season-recaps/index.html?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
       id: "Stats",
        url: "http://stats.nba.com?ls=iref:nba:gnav",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'NBA.com/Stats',
                                        url : 'http://stats.nba.com?ls=iref:nba:gnav'
									},
									{
										label : 'Sortable Player Stats',
										url : 'http://stats.nba.com/leaguePlayerGeneral.html?ls=iref:nba:gnav'
									},
                                    {
                                        label : 'Sortable Team Stats',
                                        url : 'http://stats.nba.com/leagueTeamGeneral.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Category Leaders',
                                        url : 'http://stats.nba.com/leaders.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Scoring Leaders',
                                        url : 'http://stats.nba.com/leadersGrid.html?PerMode=Totals&sortField=PTS&Season=2012-13&SeasonType=Regular%20Season&Scope=S&StatCategory=PTS&ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Pre Season Leaders',
                                        url : 'http://stats.nba.com/leadersGrid.html?Season=2013-14&SeasonType=Pre%20Season&PerMode=Totals&Scope=S'
                                    },                                    
                                    {
                                        label : 'League Lineups',
                                        url : 'http://stats.nba.com/leagueLineups.html?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "More",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'Every NBA Box Score (1946-Present)',
                                        url : 'http://stats.nba.com/scores.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Complete Franchise History',
                                        url : 'http://stats.nba.com/history.html?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'Shot Charts',
                                    	url : 'http://stats.nba.com/shotcharts.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Stats Blog',
                                        url : 'http://hangtime.blogs.nba.com/category/nba-comstats?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
       id: "Mobile",
        url: "http://www.nba.com/mobile/?ls=iref:nba:gnav",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'NBA Mobile Products',
                                        url : 'http://www.nba.com/mobile?ls=iref:nba:gnav'
									},
                                    {
                                        label : 'NBA Game Time Connected',
                                        url : 'http://www.nba.com/connected?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'LEAGUE PASS Mobile',
                                        url : 'http://www.nba.com/leaguepass/mobile?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "More",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'Custom Covers &amp; Cases',
                                        url : 'http://www.coveroo.com/nba?ls=iref:nba:gnav',
										target: "_blank"
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
       id: "TV",
        url: "http://www.nba.com/nbatv?ls=iref:nba:gnav",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'National TV Schedule',
                                        url : 'http://www.nba.com/schedules/national_tv_schedule/index.html?ls=iref:nba:gnav'
									},
                                    {
                                        label : 'NBA TV',
                                        url : 'http://www.nba.com/nbatv?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'NBA on TNT',
                                        url : 'http://www.nba.com/nbaontnt?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'NBA on ESPN',
                                    	url : 'http://www.nba.com/schedules/national_tv_schedule/ESPN?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'NBA on ABC',
                                    	url : 'http://www.nba.com/schedules/national_tv_schedule/ABC?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'International TV Schedule',
                                        url : 'http://www.nba.com/schedules/international_nba_tv_schedule.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'Canadian TV Schedule',
                                        url : 'http://www.nba.com/schedules/national_tv_schedule/canada?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
                {
                        div: "nbaSecondary",
                        subhead: "More",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'NBA Fan Night',
                                        url : 'http://www.nba.com/fannight?ls=iref:nba:gnav'
                                    },
									{
                                        label : 'Inside Stuff',
                                        url : 'http://www.nba.com/insidestuff/?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'The Starters',
                                        url : 'http://www.nba.com/thestarters?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'Open Court',
                                    	url : 'http://www.nba.com/opencourt?ls=iref:nba:gnav'
                                    },
									{
                                        label : 'Inside the NBA',
                                        url : 'http://www.nba.com/video/Inside_the_NBA?ls=iref:nba:gnav'
                                    },
									{
                                        label : 'TV Companion',
                                        url : 'http://www.nba.com/tvc/info.html?ls=iref:nba:gnav'
                                    },
									{
                                        label : 'Connected TVs',
                                        url : 'http://www.nba.com/connected/index.html?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, {    
    	id: "League Pass",
        url: "http://www.nba.com/leaguepass?ls=iref:nba:gnav:lp",
        nbacl: "",
        items: [
                    {       
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
									{
                                        label : 'LP for TV',
                                        url : 'http://www.nba.com/leaguepass/3pp/?ls=iref:nba:gnav:lp:lptv'
									},
                                    {
                                        label : 'Activate LP for TV',
                                        url : 'http://www.nba.com/leaguepass/activate/?ls=iref:nba:gnav:lp:alptv'
                                    },
                                    {
                                        label : 'LP Broadband',
                                        url : 'http://www.nba.com/leaguepass/broadband/?ls=iref:nba:gnav:lp:lpbb'
                                    },
                                    {
                                        label : 'LP Mobile',
                                        url : 'http://www.nba.com/leaguepass/mobile/?ls=iref:nba:gnav:lp:lpm'
                                    },
                                    {
                                        label : 'International LP Broadband',
                                        url : 'http://watch.nba.com/nba/subscribe?ls=iref:nba:gnav:lp:ilpbb'
                                    },
                                    {
                                        label : 'LP Audio',
                                        url : 'http://www.nba.com/allaccess/watchListen.html?ls=iref:nba:gnav:lp:lpa'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }, 
//    {    
//       id: "Store",
//        url: "http://www.nba.com/global/storelinkhandler.html",
//        nbacl: "",
//        items: [
//                    {       
//                        div: "nbaPrimary",
//                        subhead: "",
//                        subs : [
//                            {
//                                teams : [
//                                    {
//                                        label : 'Jerseys',
//                                        url : 'http://store.nba.com/entry.point?entry=2482948&source=NBA_Jerseys'
//									},
//                                    {
//                                        label : 'Mens',
//                                        url : 'http://store.nba.com/entry.point?entry=2482948&source=NBA_Jerseys'
//                                    },
//                                    {
//                                        label : 'Kids',
//                                        url : 'http://store.nba.com/entry.point?entry=1400501&source=NBA_Kids'
//                                    },
//                                    {
//                                        label : 'NBA4HER',
//                                        url : 'http://store.nba.com/entry.point?entry=1400501&source=NBA_Kids'
//                                    },
//                                    {
//                                        label : 'Custom Shop',
//                                        url : 'http://store.nba.com/entry.point?entry=3358354&source=NBA_CustomShop'
//                                    },
//                                    {
//                                        label : 'Headwear',
//                                        url : 'http://store.nba.com/entry.point?entry=2132627&source=NBA_Headwear'
//                                    },
//                                    {
//                                        label : 'Basketballs',
//                                        url : 'http://store.nba.com/entry.point?entry=2132627&source=NBA_Headwear'
//                                    },
//                                    {
//                                        label : 'Footwear',
//                                        url : 'http://store.nba.com/entry.point?entry=2710536&source=NBA_Footwear'
//                                    },
//                                    {
//                                        label : 'What&#39;s Hot',
//                                        url : 'http://store.nba.com/entry.point?entry=2849973&source=NBA_WhatsHot'
//                                    },
//                                    {
//                                        label : 'Auctions',
//                                        url : 'http://auctions.nba.com',
//										target: '_blank'
//                                    },
//                                    {
//                                        label : 'NBAGameworn.com',
//                                        url : 'http://NBAGameworn.com'
//                                    },
//                                    {
//                                        label : 'Shop Photo Store',
//                                        url : 'http://www.photostore.nba.com/?sourceid=TopNav_Photos'
//                                    },
//                                    {
//                                        label : 'NYC Store',
//                                        url : 'http://www.nba.com/nycstore'
//                                    }
//                                ]
//                            }
//                        ]
//                }
//        ]
//    },
    {    
        id: "Fantasy",
         url: "http://www.nba.com/fantasy?ls=iref:nba:gnav",
         nbacl: "",
         items: [
            {       
                div: "nbaPrimary",
                subhead: "",
                subs : [
                   {
                       teams : [
                           {
                        	   label : 'NBA.com/Yahoo! Fantasy Basketball',
                        	   url : 'http://basketball.fantasysports.yahoo.com/nba?ls=iref:nba:gnav'
                           },
                           {
                        	   label : 'Fantasy Video',
                        	   url : 'http://www.nba.com/video/nbatv/fantasy?ls=iref:nba:gnav'
                           },
                           {
                        	   label : 'Fantasy Blogs',
                        	   url : 'http://hangtime.blogs.nba.com/category/fantasy?ls=iref:nba:gnav'
                           },
                           {
                        	   label : 'NBA Fantasy on Twitter',
                        	   url : 'https://twitter.com/nbafantasy?ls=iref:nba:gnav'
                           },
                           {
                        	   label : 'Fantasy Rankings Ladder',
                        	   url : 'http://stats.nba.com/featured/2013_fantasy_rankings_ladder.html'
                           }						   
                       ]
                   }
               ]
            }
        ]
    },     
    {    
    	id: "More",
        url: "#",
        nbacl: "nbaLast",
        items: [
                {
                        div: "nbaPrimary",
                        subhead: "",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'Officials &amp; Rulebook',
                                        url : 'http://www.nba.com/news/officiating/index.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'All Access',
                                        url : 'http://www.nba.com/allaccess/?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'NBA Photos',
                                        url : 'http://www.nba.com/photos/index.html?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'For Kids',
                                        url : 'http://www.nbahooptroop.com/?ls=iref:nba:gnav'
                                    },
                                    {
                                        label : 'NBA Fan Travel',
                                        url : 'http://www.nba.com/travel/?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                },
				{
                        div: "nbaSecondary",
                        subhead: "Social Media",
                        subs : [
                            {
                                teams : [
                                    {
                                        label : 'NBA on Facebook',
                                        url : 'http://www.facebook.com/nba?ls=iref:nba:gnav'
                                    },
									{
                                        label : 'NBA on Twitter',
                                        url : 'https://twitter.com/nba?ls=iref:nba:gnav'
                                    },
                                    {
                                    	label : 'NBA Tumblr',
                                    	url : 'http://nba.tumblr.com?ls=iref:nba:gnav'
                                    },
									{
                                        label : 'Social Spotlight',
                                        url : 'http://www.nba.com/social-spotlight/?ls=iref:nba:gnav'
                                    },
									{
                                        label : 'NBA Pulse',
                                        url : 'http://www.nba.com/pulse/?ls=iref:nba:gnav'
                                    }
                                ]
                            }
                        ]
                }
        ]
    }]  
}

$nbaNav.init();

(function() {
	'use strict';
	
	var onload = window.onload;
	
	window.onload = function() {
		var flashJS = document.createElement('script'),
			head = document.getElementsByTagName('head')[0];
		
		flashJS.src = "http://z.cdn.turner.com/nba/nba/.element/js/2.1/sect/leaguepass/nbaLeaguePass.js";
		flashJS.async = 'true';
		
		head.appendChild(flashJS);
		
		if (typeof(jQuery) !== 'undefined') {
			jQuery(document).on('click', '.nbaSearchPromoRight img', function(event) {
				event.preventDefault();
				window.nbaLeaguePass.checkFlashFirst();
			});
		}
		
		if (typeof(onload) === 'function') {
			onload();
		}
		
	};
	
}());
