/*
 *	filter.controller.js 
 *  ver 1.01
 *  2013 08 30
 *	nicholas ortenzio (niortenzio@nba.com)
 */

$(function(){



/*** SETTINGS ***/

	var init = false;
	var hasChanged = false;
	var dom = {
		$filterRow : $("#filters"),
		$filterSelector : $("#filter-selector"),
		$runit : $("#run-it")
	};
	var FILTERS = [];
	var runitCallback = function () { return false };



/*** STAT REQUEST ***/

	var activateRunButton = function (type) {

		dom.$runit.attr('disabled', false);
	};



/*** CALL BACKS ***/

	var onSelectDropdownChange = function (value, text) {

		activateRunButton('param');
	};

	var onSelectDropdownRemove = function ($elm) { 
		var name = $elm.attr("name");
		dom.$filterSelector.droplist('deselect', name, false);
		activateRunButton('param');	
	};

	var onMultiDropdownChange = function (value, text, toggle) {
		console.log('multi', this, value, toggle, text);
		activateRunButton('param');
	};

	var onMultiDropdownRemove = function ($elm) { 
		var name = $elm.attr("name");
		dom.$filterSelector.droplist('deselect', name, false);
		activateRunButton('param');
	};

	var onDateSelectorChange = function (obj) { 

		activateRunButton('param');		
	};

	var onDateSelectorClose = function ($elm) { 
		var name = $elm.attr("name");					
		dom.$filterSelector.droplist('deselect', name, false);
		activateRunButton('param');
	};

	var onCustomFilterChange = function (value) {

		activateRunButton('param');
	};

	var onCustomFilterClose = function ($elm) {
		var name = $elm.attr("name");			
		dom.$filterSelector.droplist('deselect', name, false);
		activateRunButton('filter');
	};

	var onPlayerFilterChange = function (value) { 
		activateRunButton('filter');
	}

	var onPlayerFilterClose = function ($elm) {
		var name = $elm.attr("name");			
		dom.$filterSelector.droplist('deselect', name, false);
		activateRunButton('filter');
	};	

	var onRunItClick = function (e) {
		e.preventDefault();

		var selected = dom.$filterSelector.droplist('getSelected');

		var params = $.map(selected, function(n,i) {
			var $elm = $('#' + n);
			var obj = {name: $elm.attr('name'), value:$elm.attr('value') }
			return obj;
		});

		dom.$runit.attr('disabled', true);

		runitCallback(params);
	};


/*** CREATE QUERY COMPONENTS ***/

	var createSelectDroplist = function (item) { 
		var $elm = $('<div/>').attr('name', item.name).attr('id', item.name).addClass('filter-node span1').append('<ul></ul>');
		var options = _.map(item.options, function (n,i) { return { value:n.k, text:n.v }; });

		var selected = (!init) ? item.defaultValue : null;

		$elm.droplist({
			labelText : item.label,
			datalist : options,
			searchEnabled : item.canSearch,
			enableSearch : item.canSearch,
			defaultSelected : selected,
			canRemove : true,			
			onChange: onSelectDropdownChange,
			onRemove: onSelectDropdownRemove
		});

		dom.$filterRow.append($elm);
		activateRunButton('param');
	};

	var createMultiDroplist = function (item) { 
		var $elm = $('<div/>').attr('name', item.name).attr('id', item.name).addClass('filter-node span1').append('<ul></ul>');
		var options = _.map(item.options, function (n,i) { return { value:n.k, text:n.v }; });

		var selected = (!init) ? item.defaultValue : null;

		$elm.droplist({
			labelText : item.label,
			datalist : options,
			multiSelect	: true,
			maxSelected : 10,
			defaultSelected : selected,			
			searchEnabled : item.canSearch,
			enableSearch : item.canSearch,
			canRemove : true,
			onChange: onMultiDropdownChange,
			onRemove: onMultiDropdownRemove
		});

		dom.$filterRow.append($elm);
		activateRunButton('param');		
	};

	var createDateSelector = function (item) { 
		var $elm = $('<div/>').attr('id', item.name).attr('name', item.name).addClass('filter-node span1');

		var date = (!init) ? item.defaultValue : null;

		$elm.datefilter({
			label : item.label,
			date : date,
			onChange: onDateSelectorChange,
			onClose : onDateSelectorClose
		});

		dom.$filterRow.append($elm);
		activateRunButton('param');				
	};

	var createSearchField = function (item) { 

		/*** not yet implemented ***/
	};

	var createCustomFilter = function (item) {
		var $elm = $("<div/>").attr("id", item.name).attr("name", item.name).addClass('filter-node span1');

		var value = (!init) ? item.defaultValue : null;		

		$elm.customfilter({
			columns : item.options,
			defaultValue : value,
			onChange: onCustomFilterChange,
			onClose : onCustomFilterClose
		});

		dom.$filterRow.append($elm);
		activateRunButton('filter');	
	};

	var createPlayerFilter = function (item) {
		var $elm = $("<div/>").attr("id", item.name).attr("name", item.name).addClass('filter-node span1');
		var value = (!init) ? item.defaultValue : [];
		$elm.playerfilter({
			//datalist :  _.filter(window.NBAPlayers, function (n,i) { return n.isActive; }),
			datalist :  window.NBAPlayers,
			defaultSelected : value,
			canRemove : true,
			onChange: onPlayerFilterChange,
			onRemove : onPlayerFilterClose
		});

		dom.$filterRow.append($elm);
		activateRunButton('filter');	
	};


/*** REMOVE QUERY COMPONENTS ***/

	var removeSelectDroplist = function (value) {
		var $elm = $("#" + value);

		if (!$elm) {
			return;
		}

		$elm.droplist('remove', true);
		activateRunButton('param');
	};

	var removeMultiDroplist = function (value) {
		var $elm = $("#" + value);

		if (!$elm) {
			return;
		}

		$elm.droplist('remove', true);
		activateRunButton('param');
	};

	var removeDateSelector = function (value) {
		var $elm = $("#" + value);

		if (!$elm) { 
			return;
		}

		$elm.datefilter('close',false);
		activateRunButton('param');		
	};

	var removeSearchField = function (item) {
		var $elm = $("#" + value);

		if (!$elm) { 
			return;
		}

		$elm.remove();
		activateRunButton('param');
	};

	var removeCustomFilter = function (value) {
		var $elm = $("#" + value);

		if (!$elm) { 
			return;
		}

		$elm.remove();
		activateRunButton('filter');
	};

	var removePlayerFilter = function (value) {
		var $elm = $("#" + value);

		if (!$elm) { 
			return;
		}

		$elm.remove();
		activateRunButton('filter');
	};	


/*** ADD / REMOVE FILTER CALLBACK ***/

	var createDropdown = function (name) { 

		var items = _.filter(FILTERS, function (n) { return n.name==name; });
		
		if (!items) { 
			return;
		}

		var item = items[0];

		switch (item.type) {
			case "select":
				createSelectDroplist(item);
				break;
			case "multi":
				createMultiDroplist(item);			
				break;
			case "date":
				createDateSelector(item);			
				break;
			case "search":
				createSearchField(item);			
				break;
			case "custom":
				createCustomFilter(item);			
				break;
			case "player":
				createPlayerFilter(item);				
		}
	};

	var removeDropdown = function (name) {

		var items = _.filter(FILTERS, function (n) { return n.name==name; });[0];
		
		if (!items) { 
			return;
		}

		var item = items[0];

		switch (item.type) {
			case "select":
				removeSelectDroplist(item.name);		
				break;
			case "multi":
				removeMultiDroplist(item.name);		
				break;
			case "date":
				removeDateSelector(item.name);
				break;
			case "search":
				removeSearchField(item.name);
				break;
			case "custom":
				removeCustomFilter(item.name);	
				break;
			case "player":
				removePlayerFilter(item.name);
		}
	};


/*** INIT ***/

	var initActiveControls = function (filters) { 
		$.each(filters, function (i, n) {
			if (!n.activated) { 
				return;
			}

			dom.$filterSelector.droplist('select', n.name, false);	
			createDropdown(n.name);
		});
	};

	var initFilterSelector = function (filters) { 
		var items = _.chain(filters)
			.filter(function(n,i) { 
				return (!n.disabled)
			}).map(function(n,i) {
				return {value:n.name, text:n.label, description: n.description}
			}).value();

		dom.$filterSelector.droplist({
			labelText : "Add / Remove Filters",
			datalist : items,
			multiSelect : true,
			onChange:function (value, text, toggle, $this) {
				if (toggle) { 
					createDropdown(value);
				} else {
					removeDropdown(value);
				}
			}
		});
	};

	window.initFilterControls = function (filters, onRunCallback) {
		FILTERS = filters;

		initFilterSelector(filters);
		initActiveControls(filters);

		runitCallback = onRunCallback;

		dom.$runit.attr('disabled', true).click(onRunItClick);

		init = true;
	};

	$(window).on('click', function (e) { 
		var $target = $(e.target);
		var $root = $target.parents('.droplist');
		var $rootPlayerFilter = $target.parents('.playerfilter');
		
		if ($root.length==0) { 
			$('.droplist').each(function (i, n) { $(this).droplist('close'); });
		} 
		if ($rootPlayerFilter.length==0) {
			$('.playerfilter').each(function (i, n) { $(this).playerfilter('closeSelectedView'); });
		}
	})

});