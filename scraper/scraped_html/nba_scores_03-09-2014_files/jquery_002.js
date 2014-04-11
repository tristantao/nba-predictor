/*
 * jquery.buttonset.js
 * nicholas ortenzio
 */

(function($) { 

	var classes = {
		active : 'ui-active',
		button : 'ui-button',
		buttonset : 'buttonset'
	};
	
	var dataname = 'buttonset';

	var onClick = function (e) {
		
		
		// stop event
		e.preventDefault();
		e.stopPropagation();

		// cache $this
		var $this = $(this);
		
		// cache module parent
		var $parent = $this.parent().parent();
		
		// get data object for buttonset plugin
		var data = $parent.data(dataname);
		
		// if the current active element is clicked do nothing
		if ($this.hasClass(classes.active)) {
			return;
		}
		
		// get value of clicked element
		var val = $this.attr('value');
		
		// unset active siblings
		$parent.find('.' + classes.active).removeClass(classes.active);

		// set clicked element as active
		$this.addClass(classes.active);
		
		// set $curr to $this
		data.$curr = $this;
		
		//Flag
		e.fromInitCall = false;
		
		// make callback
		data.callback.apply(data.$this, [val, e]);
	}
		
	
    /*** Module Definition ***/

    $.fn.buttonset = function (callback, initWithCallback) {	
	
		var init = function () {

			var $this = $(this).addClass(classes.buttonset);
			var $items = $this.find('.' + classes.button);
			var $curr = $this.find('.' + classes.active);

			if ($curr.length==0) {
				$curr = $this.find("a").eq(0).addClass(classes.active);
			}
			
			var data = { 
				$this : $this,
				$items : $items,
				$curr : $curr,
				callback : callback
			};
		
			$this.data(dataname, data);
			$this.on('click', 'a', onClick);
			
			if (initWithCallback) {
				//callback.apply(data.$this, [$curr.attr('value')]);
				callback.apply(data.$this, [$curr.attr('value'),{"fromInitCall": true}]);
			}
		};
		
		$.each(this, init);
    };


})(jQuery);