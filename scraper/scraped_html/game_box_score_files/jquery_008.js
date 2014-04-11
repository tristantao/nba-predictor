/*
 * jquery.qp.js
 * Nicholas Ortenzio
 */

(function() { 


 	var setTextElement = function ($e, v) {
		$e.attr("value", v);
	};

	var setSelectElement = function ($e, v) {
		$e.find('option').removeAttr('selected').filter('[value="' + v + '"]').attr("selected", "selected");
		$e.change();
	};
 
	var setRadioElement = function ($e, v) {
		$e.removeAttr('checked').filter('[value="' + v + '"]').attr('checked','checked');
	};
	
	var setCheckbox = function ($e, v) {
		var bool = (v=="true");
		$e.attr("checked", bool);
	};
	
	var setButtonset = function ($e, v) {
		$e.find('.ui-active').removeClass('ui-active');
		$e.find('a[value="' + v + '"]').click();
	};

	var setDroplist = function ($e, v) {
		$e.find('a[value="' + v + '"]').click();
	};

	var clearTextElement = function ($e) {
		$e.attr("value", "");
	};

	var clearSelectElement = function ($e) {
		$e.find('option').removeAttr('selected').eq(0).attr("selected", "selected");
		$e.change();	
	};

	var clearRadioElement = function ($e) {
		$e.removeAttr('checked').eq(0).attr('checked','checked');	
	};

	var clearCheckbox = function ($e) {
		$e.attr("checked", false);
	};
	
	var setURLstring = function (key, val, search) {
	
		var regex = new RegExp("(\\?|&)" + key + "=");
		
		var rep = key + "=" + escape(val);
		var startswith = (search=="") ? "?" : "&";
		var exists = regex.test(search);
		
		var sreg = new RegExp("(\\?|&)" + key + "=[\\w\\d\\/\\-\\%\\*]*(&|$)");
		if (exists) {
			search = search.replace(sreg, "$1" + rep + "$2");
		} else {
			search += startswith + rep;
		}	
				
		return search;
	};

	var setHashString = function (key, val, hash) {
	
		var regex = new RegExp("([^\\?&#])" + key + "=");		
		var rep = key + "=" + escape(val);
		var startswith = (hash=="") ? "" : "&";
		var exists = regex.test(hash);
		
		var sreg = new RegExp("([^\\?&#])" + key + "=[\\w\\d\\/\\-\\%\\*]*(&|$)");
		if (exists) {
			hash = hash.replace(sreg, "$1" + rep + "$2");
		} else {
			hash += startswith + rep;
		}	
				
		return hash;
	};
	
	var setForm = function (key, val) {
	
		if ($.isFunction(val)) {
			return;
		}
		
		var $elm = $('[name="' + key + '"]');
		var type = $elm.attr('type');
		var func = null;
				
		switch (type) {
			case "text" : 
				func = setTextElement;
				break;
			case "select" :
				func = setSelectElement;
				break;
			case "radio" :
				func = setRadioElement;
				break;
			case "checkbox" : 
				func = setCheckbox;
				break;
			case "buttonset" :
				func = setButtonset;
				break;
			case "droplist" : 
				func = setDroplist;
				break;				
			default:
				func = setTextElement;
				break;
		}
		
		func($elm, val);
	};
	
	var clearForm = function (key, val) {
		if ($.isFunction(val)) {
			return;
		}
		
		var $elm = $('[name="' + key + '"]');
		var type = $elm.attr('type');
		var func = null;
			
		switch (type) {
			case "text" : 
				func = clearTextElement;
				break;
			case "select" :
				func = clearSelectElement;
				break;
			case "radio" :
				func = clearRadioElement;
				break;
			case "checkbox" : 
				func = clearCheckbox;
				break;
			default:
				func = clearTextElement;
				break;
		}
		
		func($elm);
	};	
		
	var onShotchartClick = function (e) {
		e.preventDefault(); 
		e.stopPropagation(); 
		var href = $(this).attr("href"); 
		window.open(href,'popUpWindow','height=750,width=1100,left=10,top=10,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no');	
	};


	// custom jquery functions
	
	jQuery.extend({

		getQueryParameters : function(str) {		
			var search = str || document.location.search;
			var hash = document.location.hash.replace("#","");
			var array = (/^\?/.test(search)) ? search.slice(1).split("&") : search.split("&");
			
			if (hash!="") {
				array = array.concat(hash.split("&"));
			}
								
			if (!array[0]) {
				return false;
			}
			
			var params = {};
			
			for (var i=0; i<array.length; ++i) {
			  var val = array[i].split("=");
			  params[val[0]] = unescape(val[1]);
			}
		
			return params;
		},
		
		getQueryParametersCustom : function(str) {		
			var search = str || document.location.search;
			var hash = document.location.hash.replace("#","");
			var array = [];
			var arrayHash = [];
			var paramCollection = [];
			
			if(search != ""){
				array = (/^\?/.test(search)) ? search.slice(1).split("&") : search.split("&");
			}
			
			if (hash!="") {
				arrayHash = (hash.split("&"));
			}
			
			paramCollection = array.concat(arrayHash)
								
			if (paramCollection.length == 0) {
				return false;
			}
			
			var params = {};
			for (var i=0; i<paramCollection.length; ++i) {
			  var val = paramCollection[i].split("=");
			  params[val[0]] = unescape(decodeURIComponent(val[1]));
			}
			
			return params;
		},
		
		getQueryParametersHash : function(str) {		
			var search = str || document.location.search;
			var hash = document.location.hash.replace("#","");
			var array = (/^\?/.test(search)) ? search.slice(1).split("&") : search.split("&");
			
			if (hash!="") {
				array = array.concat(hash.split("&"));
				if (array.length <= 1) { return false; }
			}
			
			var params = {};
			
			for (var i=0; i<array.length; ++i) {
			  var val = array[i].split("=");
			  params[val[0]] = unescape(val[1]);
			}
		
			return params;
		},
		
		setForms : function (key, val) {
			if ($.isPlainObject(key)) {
				$.each(key, setForm);
			} else {
				setForm(key, val)
			}		
		},
		
		clearForms : function (key, val) {
			if ($.isPlainObject(key)) {
				$.each(key, clearForm);
			} else {
				setForm(key, val)
			}				
		},
		
		setURL : function (key, val) {
			var search = document.location.search + "";

			var curry = function (k, v) {
				search = setURLstring(k, v, search);
			}
			
			if ($.isPlainObject(key)) {
				$.each(key, curry);
			} else {
				curry(key, val)
			}
			
			search += document.location.hash;
		
			if ($.canReplaceState()) {
				window.history.replaceState("", "", search);
			} else {
				location = search;
			}
		},
		
		setHash : function (key, val) {
		
			var hash = document.location.hash + "";
				hash = hash.replace("#", "");

			var curry = function (k, v) {
				hash = setHashString(k, v, hash);
			}
			
			if ($.isPlainObject(key)) {
				$.each(key, curry);
			} else {
				curry(key, val);
			}

			document.location.hash = hash;
		},
		
		yearToSeason : function (year) {
			var season = year + "-";
			var next= year+1;
				next = next.toString().substr(2,2);
				season += next;
			
			return season;
		},
		
		getNBAPlayerByID : function (id) {
			if (!window.NBAPlayers) {
				return;
			}
			return $.grep(window.NBAPlayers, function(p) { return p.PlayerID==id})[0];		
		},
		
		getNBATeamByID : function (id) {
			if (!window.NBATeams) {
				return;
			}
			return $.grep(window.NBATeams, function(p) { return p.TeamID==id})[0];			
		},

		padZero : function (val) {
			return ("0"+val).split("").reverse().splice(0,2).reverse().join("");
		},
	
		nth : function (o) { 
			return (['st','nd','rd'][(o+'').match(/1?\d\b/)-1]||'th');
		},

		whitelistExtend : function (alpha, omega) {
			var obj = { };
			$.each(alpha, function (k, v) {
				if (!omega.hasOwnProperty(k)) {
					return;
				}
				obj[k] = omega[k];
			});
			$.extend(alpha, obj);
			
			return alpha;
		},
		
		whitelist : function (list, omega) {
			var obj = { };
			
			$.each(list, function (i, n) {
				if (!omega.hasOwnProperty(n)) {
					return;
				}
				obj[n] = omega[n];
			});
			
			return $.extend({}, obj);
		},
		
		canReplaceState : function () {
			return (window.history.replaceState);
		}
		
	});

	
	// add types to non-input ui elements
	$('select').attr('type', 'select');
	$('.buttonset').attr('type', 'buttonset');
	$('.droplist').attr('type', 'droplist');
	
	// watch for shotchart links
	$('.container').on('click', 'a[rel=shotchart]', onShotchartClick);
	
}());


// serialize JSON method
$.fn.serializeJSON = function () {
	var obj = {};	
	var arr = $(this).serializeArray();

	$.each(arr, function(i, n){
		var name = n['name'];
		var val = n['value'];
		obj[name] = val;
	});

	return obj;
}

// parse commonplayerinfo script
function playerinfocallback (data) {
	var rows = data.resultSets[0].rowSet;
	var players = [];

	// if (typeof atob != "undefined") { rows.push([102080, atob("T3J0ZW56aW8sIE5pY2hvbGFz"), 0, 1980, 1981]) }

	for (var i=0; i<rows.length; i+=1) {
		var obj = { 
			PlayerID : rows[i][0],
			PlayerName : rows[i][1],
			isActive : !!rows[i][2],
			seasonFrom : parseInt(rows[i][3], 10),
			seasonTo : parseInt(rows[i][4], 10),
			PlayerCode: rows[i][5]
		};
		players.push(obj);
	}
	
	
	window.NBAPlayers = players; 
};	

// parse commonteamyears script
function teaminfocallback (data) {
	var rows = data.resultSets[0].rowSet;
	var teams = [];

	for (var i=0; i<rows.length; i+=1) {
		var obj = { 
			TeamID : rows[i][1],
			seasonFrom : parseInt(rows[i][2], 10),
			seasonTo : parseInt(rows[i][3], 10),
			abbr : rows[i][4]
		};
		teams.push(obj);
	}

	window.NBATeams = teams; 
};	