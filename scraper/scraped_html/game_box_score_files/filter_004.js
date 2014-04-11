/*
 *	droplist.js 
 *  ver 1.97
 *  2013 08 30 02
 *	nicholas ortenzio (niortenzio@nba.com)
 *  documentation: http://linuxpubstats.nba.com:7110/docs/droplist/
 */

(function($) { 


/*** CONFIGURATION ***/

    var defaults = {     
    	initCall : false,       
        canRemove : false,
        datalist : null,
        defaultSelected : null,
        enableSearch : true,
        initWithCallback : true,
        labelText : '',
        maxSelected : 1000,
        multiSelect : false,
        onChange : function () { },
        onRemove : function () { },
        transitionSpeed : 'fast'
    };

	var pluginName 	  = 'droplist';
	var dataItem 	  = 'droplistitem';

	var selectedClass = 'selected';
	var disabledClass = 'disabled';
	var filteredClass = 'filtered';
	var hiddenClass   = 'hidden';
	var openClass 	  = 'opened';
	var labelClass 	  = 'label';
	var multiClass 	  = 'multi';
	var searchClass	  = 'search';
	var tooltipClass  = 'tooltip';
	var tooltipContentClass = 'tooltip-content';
	var tooltipArrowClass = 'tooltip-arrow';

	var searchAttr = {
		'placeholder' : 'Search',
		'spellcheck' : false,
		'type' : 'text'
	};


/*** API ***/

	var methods = {

		init : function(opt) {
		
			var options = $.extend({}, defaults, opt);

			return this.each(function() {

				var $this = $(this).addClass(pluginName).attr('role','listbox').show();
				var $holder = $('<div></div>').addClass('holder').appendTo($this);

				var $list  = $this.find("> ul").attr('role','listbox').remove();
					$holder.append($list);

				var $label = $this.find("> a");
					$label = ($label.length==0) ? $('<a></a>').prependTo($this) : $label;
					$label.addClass(labelClass);

				var $search;
				if (options.enableSearch) {
					$search = $('<input />').attr(searchAttr).attr('role', 'search').addClass(searchClass).keyup(onSearchChange);
					$holder.prepend($search);
				}
				
				if (options.multiSelect) {
					$this.addClass(multiClass).attr('aria-multiselectable', 'true');
					$label.html('<span class="labeltext">' + options.labelText + '</span>');					
				}

				if (options.datalist) {
					var $li = initForDatalist(options.datalist);
					$list.empty().append($li);
				}

				if (options.canRemove) {
					initRemoveButton($this);
				}

				var $items = $list.find("> li > a").attr('role','option')

				var data = {
					$this : $this,
					$label : $label,
					$list : $list,
					$items : $items,
					$search : $search,
					$holder : $holder,
					options : options
				};
			
				$this.data(pluginName, data);
				$label.click(dropdownClick);
				$list.on('click', 'a', listItemClick);
				$list.on('mouseover', 'a', listItemMouseOver);
				$list.on('mouseout', 'a', listItemMouseOut)

				if (!options.multiSelect) {
					//Do not click on DropList during Init call
					initSelected(data.$items, options.defaultSelected, options.initCall);
				}
				
			});
		},
		
		close : function () {
			var $this = $(this);
			var data = $this.data(pluginName);

			if (!data) {
				return;
			}

			var opt = data.options;
			var isOpen = $this.hasClass(openClass);

			data.$holder.slideUp(opt.transitionSpeed, function () {
				$this.removeClass(openClass);
			});

			if (data.options.enableSearch) {
				data.$search.val('');
				data.$items.removeClass(filteredClass);	      	
			}
		},

		deselect : function (value, shouldCallback) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			if (!opt.multiSelect) {
				return;
			}

			var $elm = data.$items.filter('[value="' + value + '"]');

			if ($elm.length==0) {
				return;
			}

			$elm.removeClass(selectedClass).attr('aria-selected', 'false');

			if (shouldCallback) {
				opt.onChange([], $this);				
			}
		},

		disable : function () {
			var $this = $(this);
			var data = $this.data(pluginName);
				data.$this.addClass(disabledClass);
		},
			
		enable : function () {
			var $this = $(this);
			var data = $this.data(pluginName);
				data.$this.removeClass(disabledClass);
		},

		filter : function (value) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var $items = data.$items;

			if (value.length<3) {
				$items.removeClass(filteredClass);
				return;
			}

			$.each($items, filterFilters.bind(this, value));
		},
		
		getSelected : function () { 
			var $this = $(this);
			var data = $this.data(pluginName);
			var $selected = data.$items.filter('.'+selectedClass);;				

			var arr = $.map($selected, function (n,i) {
				return $(n).attr('value');
			});

			return arr;
		},

		open : function () {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			data.$holder.slideDown(opt.transitionSpeed, function() {
				$this.addClass(openClass);

				if (data.options.enableSearch) {	
					data.$search.focus();
				}
			});	
		},

		remove : function (shouldCallback) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			if (shouldCallback) {
				data.options.onRemove($this);
			}

			$this.remove();			
		},

		select : function (value, shouldCallback) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			if (!opt.multiSelect) {
				return;
			}

			var $elm = data.$items.filter('[value="' + value + '"]');
			$this.attr('value', value).attr('aria-valuetext', value);

			if ($elm.length==0) {
				return;
			}

			$elm.addClass(selectedClass).attr('aria-selected', 'true');;

			if (shouldCallback) {
				opt.onChange([], $this);				
			}
		},

		setValue : function (value, shouldCallback) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			var $elm = data.$items.filter('[value="' + value + '"]');
			$this.attr('value', value).attr('aria-valuetext', value);;

			if ($elm.length==0) {
				return;
			}

			if (opt.multiSelect) {
				$elm.toggleClass(selectedClass);
			} else {				
				var v = $elm.attr('value');
				var t = $elm.eq(0).text();

				data.$items.removeClass(selectedClass).attr('aria-selected', 'false');;
				data.$label.attr('value', v).html('<span class="labeltext">' + opt.labelText + '</span>' + t);
				$elm.addClass(selectedClass).attr('aria-selected', 'true');;
			}

			if (shouldCallback) {
				opt.onChange(v, t, $this);
			}
		},

		updateItems : function (items, defaultSelected) {
			var $this = $(this);
			var data = $this.data(pluginName);
			defaultSelected = defaultSelected || 0;

			if (items) { 
				var $li = initForDatalist(items);
					data.$list.empty().append($li);
			}
			data.$items = $this.find(".holder > ul > li > a");
			initSelected(data.$items, defaultSelected, true);
		}
	};


	
/*** PRIVATE METHODS ***/

	var initRemoveButton = function ($label) {

		var $a = $('<a></a>').attr('href', '#').addClass("remove").prependTo($label).click(onRemoveClick);
	};

	var initSelected = function ($items, defaultSelected, doNotClick) {
		var $selected = (defaultSelected) ? $items.filter('[value="' + defaultSelected + '"]') : $items.filter('.' + selectedClass);
		$selected = ($selected.length==0) ? $items.eq(0) : $selected;
		if(doNotClick == true){
			//Do not Click
		}
		else{
			$selected.click();	
		}
		
	};

	var initForDatalist = function (datalist) {
		var arr = [];
		for (var i=0; i<datalist.length; i+=1) {
			var item = datalist[i];
			var $li = $("<li></li>");
			var $a = $("<a></a>")
				.attr("href", "")
				.attr("title", item.description)
				.attr("value", item.value)
				.text(item.text).data(dataItem, item);

			if (item.selected) {
				$a.addClass(selectedClass);
			}

			if (item.description) {
				// append tooltip
				var $tooltip = $('<div class="' + tooltipClass + '">');
				var $tooltipTitle = $('<h3>').text(item.text).wrap('<div class="' + tooltipContentClass + '">');
				var $tooltipDescription = $('<p>').text(item.description);
				var $tooltipArrow = $('<div class="' + tooltipArrowClass + '"> </div>');
				$tooltip.append($tooltipTitle.parent().append($tooltipArrow).append($tooltipDescription)).hide();
				$li.append($tooltip);
			}

			arr.push($li.append($a));
		}
		return arr;
	};

	var filterFilters = function (value, i, elm) {
		var $elm = $(elm);
		var name = $elm.attr('value').toLowerCase();
		var text = $elm.text().toLowerCase();
		var data = $elm.data(dataItem);

		if (name.indexOf(value) > -1) {
			$elm.removeClass(filteredClass);
			return;
		}

		if (text.indexOf(value) > -1 ) {
			$elm.removeClass(filteredClass);			
			return;
		} 
		
		if (data && data.fields) {
			for (var i=0; i<data.fields.length; i+=1) {
				var field = data.fields[i].toLowerCase();
				if (field.indexOf(value) > -1) {
					$elm.removeClass(filteredClass);
					return;
				}
			}
		}

		$elm.addClass(filteredClass);		
	};

	

/*** UI EVENTS ***/


	var listItemClick = function (e) {
	    e.preventDefault();
 
		var $this = $(this);
		var $root = $this.parents('.' + pluginName);
		var data = $root.data(pluginName);
		var opt = data.options;

		var value = $this.attr('value');
		var text = $this.text();

		if ($this.hasClass(disabledClass)){
			return; 
		}

		$root.attr('value', value).attr('aria-valuetext', value);

		if (opt.multiSelect) {
			var numSelected = $root.find('.' + selectedClass).length;
			var toggle = !$this.hasClass(selectedClass);

			if (!toggle) { // remove
				$this.toggleClass(selectedClass);
				opt.onChange(value, text, toggle, $this);
			} else { // add
				if (opt.maxSelected>1 && numSelected >= opt.maxSelected) {
					return;
				}
				$this.toggleClass(selectedClass);
				opt.onChange(value, text, toggle, $this);
			}


		} else {

			if ($this.hasClass(selectedClass)) {
				data.$label.attr('value', value).html('<span class="labeltext">' + opt.labelText + '</span>' + text);
				methods.close.apply($root)
				return; 
			}

			data.$items.removeClass(selectedClass)
			$this.addClass(selectedClass).attr('value', value);
			data.$label.attr('value', value).html('<span class="labeltext">' + opt.labelText + '</span>' + text);

			methods.close.apply($root);
			opt.onChange(value, text, $this);
		}
	};

	var dropdownClick = function (e) {
		e.preventDefault();
	
		var $this = $(this);
		var $root = $this.parents('.' + pluginName);
		
		$('.' + pluginName).filter('.' + openClass).droplist('close');

		if ($root.hasClass(disabledClass)) {
			return; 
		}

		if ($root.hasClass(openClass)) {
			$root[pluginName]('close');
			return;
		}

		$root[pluginName]('open'); 
	};

	var onSearchChange = function (e) {
		e.preventDefault();		
		var $this = $(this);
		var $root = $this.parents('.' + pluginName);
		var value = $this.val().toLowerCase();
		$root[pluginName]('filter', value);
	};

	var onRemoveClick = function (e) { 
		e.preventDefault();
		var $this = $(this);
		var $root = $this.parents('.' + pluginName);
		$root[pluginName]('remove', true);
	};

	var listItemMouseOver = function (e) {
		// remove title attribute and show tooltip
		var $item = $(this);
		$item.attr('title','');

		var position = $item[0].getBoundingClientRect();
		
		var leftPos = position.left + $item.width() + 8;
		var topPos = position.top - ($item.height() * .25);

		$(this).siblings('.' + tooltipClass).fadeIn('fast').css({
			'left' : leftPos + 'px',
			'top' : topPos + 'px'
		});
		
	};

	var listItemMouseOut = function (e) {
		// hide tooltip and set title attribute
		var $tooltip = $(this).siblings('.' + tooltipClass);
		$tooltip.hide();
		$(this).attr('title', $tooltip.find('p').text());
	}


/*** MODULE DEFINITION ***/

    $.fn[pluginName] = function (method) {
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this,arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };


})(jQuery);