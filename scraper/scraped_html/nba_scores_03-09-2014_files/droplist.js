/*
 *	droplist.js
 *	nicholas ortenzio
 */

(function($) { 



    /*** Default Configuration Options ***/

    var defaults = {            
        onChange : function () { },
        selectedClass : 'selected',
        disabledClass : 'disabled',
        openClass : 'open',
        labelText : '',
        transitionSpeed : 'fast'
    };

	var dataName = 'uidropdown';




    /*** Module API ***/

    var methods = {

        init : function(opt) {
		
            var options = $.extend({}, defaults, opt);

            return this.each(function() {

                var $this = $(this).addClass('droplist');
				var $splits = $("#stats-splits-activator");
				var $filter = $("#stats-filters-activator");
				var $list = $this.find("> ul");
				var $items = $list.find("> li > a");
				var $label = $this.find("> a");
					$label = ($label.length==0) ? $('<a></a>').prependTo($this) : $label;

                var data = {
                    $this : $this,
                	$label : $label,
                	$list : $list,
                	$items : $items,
					options : options
                };
				
                $this.data(dataName, data);				

   				$label.click(dropdownClick)
    			$list.on('click', 'a', listItemClick);

				methods.setLabel(data);
            });
        },

		setLabel : function (data) {
			var opt = data.options;
			var $selected = data.$items.filter('.' + opt.selectedClass);
				$selected = ($selected.length==0) ? data.$items.eq(0) : $selected;
				$selected.click();
		},
		
		enable : function () {
			var $this = $(this);
			var data = $this.data(dataName);
			var opt = data.options;
			
			data.$this.removeClass(opt.disabledClass);
		},
		
		disable : function () {
			var $this = $(this);
			var data = $this.data(dataName);
			var opt = data.options;
			
			data.$this.addClass(opt.disabledClass);
		},

		close : function () {
			var $this = $(this);
			var data = $this.data(dataName);
			var opt = data.options;
			var isOpen = $this.hasClass(opt.openClass);

	      	data.$list.slideUp(opt.transitionSpeed, function () {
	      		$this.removeClass(opt.openClass);
	      	});

		},

		open : function () {
			var $this = $(this);
			var data = $this.data(dataName);
			var opt = data.options;

		    data.$list.slideDown(opt.transitionSpeed, function() {
	      		$this.addClass(opt.openClass);
	      	});	

/*
		    setTimeout(function () {
		      	$(document).one('click', function (e) {
		      		methods.close.apply($this);
		      	})
		     }, 250);
*/
		},

		updateItems : function () {
			var $this = $(this);
			var data = $this.data(dataName);

			data.$items = $this.find("> ul > li > a");
			methods.setLabel(data);
		},

		setValue : function (value, shouldCallback) {
			var $this = $(this);
			var data = $this.data(dataName);
			var opt = data.options;

			var $elm = data.$items.filter('[value="' + value + '"]');

			if ($elm.length==0) {
				return;
			}

			var v = $elm.attr('value');
			var t = value;
			if($elm[0].text){ t = $elm[0].text; }
			else if($elm[0].textContent){ t = $elm[0].textContent; }
			else{}
			

	    	data.$items.removeClass(opt.selectedClass);
			data.$label.attr('value', v).html('<span class="label">' + opt.labelText + '</span>' + t);
	    	$elm.addClass(opt.selectedClass);

	    	if (shouldCallback) {
	    		opt.onChange(v, t, $this);
	    	}
		}

    }; 

	
		

	/*** UI EVENTS ***/

	var dropdownClick = function (e) {
	    e.preventDefault();

	    var $this = $(this);
	    var $root = $this.parent();
		var data = $root.data(dataName);
		var opt = data.options;

	    if ($root.hasClass(opt.disabledClass)) {
			return; 
	    }

	    if ($root.hasClass(opt.openClass)) {
	    	methods.close.apply($root);
	    	return;
	    }

	    var $openList = $('.droplist.open');
	    $openList.each(function(){
	    	methods.close.apply($(this));
	    });
		
		var $openDiv = $('.dropdown.ui-active');
		$openDiv.each(function(){
			$(this).removeClass('ui-active').css('display','none');
		});
		$('a.ui-active').removeClass('ui-active');

	    methods.open.apply($root)
	};

	var listItemClick = function (e) {
	    e.preventDefault();

		var $this = $(this);
	    var $root = $this.parent().parent().parent();
		var data = $root.data(dataName);
		var opt = data.options;

		var value = $this.attr('value');
	    var text = $this.text();
	    
	    
	    if ($this.hasClass(opt.disabledClass)){
			return; 
	    }

	    if ($this.hasClass(opt.selectedClass)) {
    		data.$label.attr('value', value).html('<span class="label">' + opt.labelText + '</span>' + text);
    		methods.close.apply($root)
	      	return; 
	    }
	    
	    data.$items.removeClass(opt.selectedClass)
	    $this.addClass(opt.selectedClass);
	    data.$label.attr('value', value).html('<span class="label">' + opt.labelText + '</span>' + text);

	    if ($root.hasClass(openClass)) { 
	    	methods.close.apply($root)
	    }
	    
	    opt.onChange(value, text, $this);
	};





    /*** Module Definition ***/

    $.fn.droplist = function (method) {
        if ( methods[method] ) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this,arguments);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };


})(jQuery);