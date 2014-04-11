/*
 *	datefilter.js 
 *  ver 1.03
 *  2013 08 21 01
 *	nicholas ortenzio (niortenzio@nba.com)
 *  documentation: http://linuxpubstats.nba.com:7110/docs/datefilter/
 */

(function($) { 


/*** CONFIGURATION ***/

	var defaults = {
		date : '',
		label : '',
		format : 'mm/dd/yy',
		initWithCallback : true,
		onChange : function () { },
		onClose : function () { },
	};

	var pluginName = 'datefilter';
	var labelClass = 'label';

/*** API ***/

	var methods = {

		init : function(opt) {
		
			var options = $.extend({}, defaults, opt);

			return this.each(function() {

				var $this = $(this).addClass(pluginName).show().attr('value', options.date);

				var param = $this.attr('name');
				var name = param + "_datepicker";
				
				var $a = $('<a/>').attr('href','#').appendTo($this);
				var $label = $('<span></span>').addClass(labelClass).text(options.label).appendTo($a);
				var $input = $('<input>').attr({name:name, id:name, param:param, type:'text', readonly:true}).appendTo($a).val(options.date);
				var $close 	= $('<a />').addClass('filter-close').attr('href','#').html('close').prependTo($this).click(onCloseClick);

					$input.datepicker({
						dateFormat: options.format, 
						defaultDate : options.date,
						onSelect: function (date) {
							$this.attr('value', date);
							var obj = {
								name : $(this).attr('param'),
								value : date,
								type : 'date'
							}
							options.onChange(obj);
						}
					});

				var data = {
					$this : $this,
					$a : $a,
					$label : $label,
					$input : $input,
					options : options
				};
			
				$this.data(pluginName, data);
				
			});
		},

		getDate : function () {
			var $this = $(this);
			var data = $this.data(pluginName);

			return data.$input.datepicker("getDate");
		},

		close : function (shouldCallback) {
			var $this = $(this);
			var data = $this.data(pluginName);
			var opt = data.options;

			data.$input.datepicker('destroy');

			if (shouldCallback) {
				data.options.onClose($this);
			}

			$this.remove();			
		},

		setDate : function (date) {
			var $this = $(this);
			var data = $this.data(pluginName);

			data.$input.datepicker("setDate", date);
		}

	};


/*** UI EVENTS ***/

	var onCloseClick = function (e) {
		e.preventDefault();
		var $root = $(this).parents('.'+pluginName);
		$root[pluginName]('close', true);
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