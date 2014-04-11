/*
 *	jquery.uidropdown.js
 *	nicholas ortenzio
 */

(function($) { 

    /*** Default Configuration Options ***/

    var defaults = {            
        onChange : $.noop()
    };

	var dataName = 'uidropdown';

    /*** Module API ***/

    var methods = {

        init : function(opt) {
		
            var options = $.extend({}, defaults, opt);

            return this.each(function() {

                var $this = $(this).addClass('ui-dropdown');
				var $label = $this.find('label');
				var $select = $this.find('select');
				var $items = $select.find('option');
				
				$select.attr('size', Math.min(10, $items.length+1));
				
                var data = {
                    $this : $this,
                    $select : $select,
					$label : $label,
					options : options
                };
				
                $this.data(dataName, data);				

				methods.setLabel(data);
				
				$label.click(onDropdownClick);
				$select.blur(onSelectBlur);
				$select.change(onSelectClick);				

            });
        },

		setLabel : function (data) {
			var value = data.$select.val();
			
			var $options = data.$select.find('option');			
			var $selected = $options.filter(':selected')

			if ($selected.length==0) {
				$selected = $options.eq(0);
			}
			var text = $selected.text();
			
			$options.removeAttr('selected');	
			$selected.attr("selected", "selected");
			
			data.$label.text(text);
			data.options.onChange(value, text);
		},
		
		enable : function () {
			var $this = $(this);
			var $par = $this.parent();
			
			$this.removeClass('ui-disabled');
			$par.removeClass('ui-disabled');
		},
		
		disable : function () {
			var $this = $(this);
			var $par = $this.parent();
			
			$this.addClass('ui-disabled');
			$par.addClass('ui-disabled');		
		}
		
    };

	
	
	
    /*** Module Definition ***/

    $.fn.uidropdown = function (method) {
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this,arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };

	
	
	
	
	/*** UI EVENTS ***/

	var onDropdownClick = function (e) {
		var $this = $(this);
		var $par = $this.parent();
		
		if ($par.hasClass('ui-disabled')) {
			return;
		}
		
		$par.addClass("ui-active");
		
		var data = $par.data(dataName);

		data.$select.show().focus();
	};
	
	var onSelectClick = function (e) {
		e.stopPropagation();
		e.preventDefault();

		var $this = $(this);
		var $par = $this.parent();
		
		if ($par.hasClass('ui-disabled')) {
			return;
		}
		
		var data = $par.data(dataName);
		
		methods.setLabel(data);
		$this.hide();
	};
	
	var onSelectBlur = function (e) {
		e.stopPropagation();
		e.preventDefault();
		
		var $par = $(this).parent().removeClass("ui-active");
		
		$(this).hide();
	};
		
})(jQuery);