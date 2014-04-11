/* **************************************************************** */
// nbaGlobalNav.js
// accessible dropdowns in the global nav
// public methods: init
// keep it tight!
/* **************************************************************** */

(function( $ ){
	var methods = {
		init : function( options ) {
			return this.each(function(index){
				var $this = $(this),
					data = $this.data('nbaGlobalNav');
					
				if (!data){
					
					$(this).data('nbaGlobalNav',{
						target: $this
					});
				}
				
				$this.children('ul').children('li:not(.nbaGlobal)').mouseenter(methods.globalNavEnter).mouseleave(methods.globalNavLeave);
				$this.children('ul').children('li').find('a').focus(methods.globalNavEnter).blur(methods.globalNavLeave);
				$this.find('.nbaPreventDefault').click(methods.preventDefault);
				$this.children('ul').children('li').each(methods.positionMenu);

			});
		},
		
		globalNavEnter : function ( e ) {
			// comment
			var $this = $(this);
			$this.closest('#nbaNav > ul > li').addClass('nbaHover');
		},
		
		globalNavLeave : function ( e ) {
			// comment
			var $this = $(this);
			$this.closest('#nbaNav > ul > li').removeClass('nbaHover');
		},
		
		preventDefault: function (e) {
			e.preventDefault();
		},
		
		positionMenu: function (e) {
			var $this = $('#nbaNav').children('ul').children('li').eq(e);
			if($this.position().left > 813){
				$this.addClass('nbaMenuLeft');
			}
		}
	};
	$.fn.nbaGlobalNav = function(method) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.nbaGlobalNav' );
		}
	};
})( jQuery );