/*
 *	customfilter.js 
 *  ver 1.05
 *  2013 08 27
 *	nicholas ortenzio (niortenzio@nba.com)
 *  documentation: http://linuxpubstats.nba.com:7110/docs/customfilter/
 */

(function($) { 


/*** CONFIGURATION ***/

	var defaults = {
		datalist : [],
		initWithCallback : true,
		defaultValue : null,
		onChange : function () { },
		onClose : function () { },
	};

	var pluginName = 'customfilter';

	var comparators = [
		{k: "E",  v: "=" },
		{k: "NE", v: "!="},
		{k: "G",  v: ">" },
		{k: "GE", v: ">="},
		{k: "L",  v: "<" },
		{k: "LE", v: "<="}							
	];


/*** API ***/

	var methods = {

		init : function(opt) {
		
			var options = $.extend({}, defaults, opt);

			return this.each(function() {

				var $this = $(this).addClass(pluginName).attr('value', options.defaultValue);

				var $field	= $('<select />').addClass('filter-column').appendTo($this).append(initList(options.columns)).change(onInputChange);
				var $ctype 	= $('<select />').addClass('filter-ctype').appendTo($this).append(initList(comparators)).change(onInputChange);
				var $value 	= $('<input />').attr('type', 'text').addClass('filter-value').appendTo($this).keyup(onInputChange);
				var $close 	= $('<a />').addClass('filter-close').attr('href','#').html('close').prependTo($this).click(onCloseClick);

				var data = {
					$this : $this,
					$field : $field,
					$ctype : $ctype,
					$value : $value,
					options : options
				};
			
				$this.data(pluginName, data);
			
				if (options.defaultValue) { 
					$this[pluginName]('setFilter', options.defaultValue, options.initWithCallback)
				} else if (options.initWithCallback) {
					opt.onChange($this[pluginName]('serialize'));
				}

			});
		},

		serialize : function () {
			var $this = $(this);
			var data = $this.data(pluginName);

			return data.$field.val() + "*" + data.$ctype.val() + "*" + data.$value.val();
		},

		close : function (shouldCallback) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			if (shouldCallback) {
				data.options.onClose($this);
			}

			$this.remove();			
		},
		
		setColumns : function (columns) {
			var $this = $(this);
			var data = $this.data(pluginName);

			$field.empty().append(initList(columns));
		},

		setFilter : function (value, shouldCallback) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			var values = value.split("*");

			if (values.length != 3) { 
				return;
			}

			data.$field.val(values[0]);
			data.$ctype.val(values[1]);
			data.$value.val(values[2]);			

			var serialized = $this[pluginName]('serialize');
			$this.attr('value', serialized);

			if (shouldCallback) {
				opt.onChange(serialized);
			}
		}

	};


	
/*** PRIVATE METHODS ***/

	var initList = function (list) {
		var arr = [];
		for (var i=0; i<list.length; i+=1) {

			if (list[i].hasOwnProperty('visible') && !list[i].visible) {
				continue;
			}

			var $opt = $('<option />').attr('value', list[i].k).html(list[i].v);
			arr.push($opt);
		}
		return arr;
	};


/*** UI EVENTS ***/

	var onCloseClick = function (e) {
		e.preventDefault();
		var $root = $(this).parents('.'+pluginName);
		$root[pluginName]('close', true);
	};

	var onInputChange = function (e) { 
		var $root = $(this).parents('.'+pluginName);
		var data = $root.data(pluginName);

		var serialized = $root[pluginName]('serialize');
		$root.attr('value', serialized);

		data.options.onChange(serialized, $root);
	};


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