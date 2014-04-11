/*
 * plugin name: accessibility
 * author(s): Randall Prince (Randall.Prince@turner.com) and
 *            Justin Richards (Justin.Richards@turner.com)
 * dependancies: jquery
 * description: the accessibility plugin creates a standard menu at the top of the page which allows
 * for users to either skip to various content blocks on the page (header, body, footer) as well as
 * display the simple key commands which let an individual know certain accessibility shortcuts.
 * testing notes:
 * 1. start out by knowing the key commands used to open the accessibility menu is alt+a. this will
 * get you to all other commands (alt+1, 2, 3, etc.)
 * 2. testing should mostly consist of ensuring that each of the content block (skipping) short-cuts
 * are always working (alt+1, 2, 3) and once your in one of those blocks you can "tab" through all the
 * standard content
 * 3. testing should also be done to ensure that as you tab outside of a given content block, it
 * continues to the next block without getting "stuck" inside the original content block selected.
 * 4. next, the two edge cases of the first element of the page and the last should be tested to
 * ensure the navigation loops from the last element to the first (and back to the last if you
 * shift+tab).
 * 5. using the alt+down command on a parent list element with children should yeild a jump to the
 * first element inside of that parent list item. once you tab through each of the children (or
 * shift+tab back to the beginning of the element), the focus of the cursor should jump outside of
 * the loop and not get "trapped" inside the list of child elements (the same as the major content
 * block elements).
 * 6. hitting the escape key at any time should take the accessibilty menu away and bring you back
 * to normal page browsing mode.
 */

;(function( $ ) {

    $.accessibility = function( el, options ) {

        // set default variables
        var defaults = {

            // Cursor reference, remembers what element you're focused on.
            cursor  : '',
            
            containerHtml :''+
                '<section id="accessibilityMenu">'+
                                '<div id="primary">'+
                                    '<span id="goto">Go To:</span>'+                
                                    '<ul id="quickLinks">'+             
                                            '<li><a id="accessibilityTargetHeader" href="#">Header</a></li>'+
                                            '<li><a id="accessibilityTargetContent" href="#">Content</a></li>'+
                                            '<li><a id="accessibilityTargetFooter" href="#">Footer</a></li>'+
                                    '</ul>'+    
                                    '<ul class="hotkeys">'+                 
                                        '<li><a href="#"><span>ALT</span>+<span>A</span></a> Toggle Accessibility Menu</li>'+
                                        '<li><a href="#"><span>ALT</span>+<span>H</span></a> Jump To Home Page</li>'+
                                        '<li><a href="#"><span>ALT</span>+<span>1</span></a> Navigation</li>'+
                                        '<li><a href="#"><span>ALT</span>+<span>2</span></a> Main Content</li>'+
                                        '<li><a href="#"><span>ALT</span>+<span>3</span></a> Footer</li>'+
                                    '</ul>'+
                                '</div> '+          
                    '</section>'+

                    '<div id="accessibilityTooltip">'+
                        '<p class="input">Type Keywords to Search</p>'+
                        '<p class="dropdown">Press Alt+Down to enter this Submenu, then Tab to navigate (Alt+Up to minimize)</p>'+
                        '<p class="toggle">Press Alt+Down to Toggle this Submenu, then Tab</p>'+
                        '<div></div>'+
                    '</div>'+
                    '<div id="accessibilityCursor" style=" border-left: 8px solid #95d774;"></div>'
        };
         
        // default plugin stuff
        var plugin          = this;
            plugin.settings = {};
            plugin.loop     = {};
            plugin.nVal     = "";
            plugin.cVal     = "";
            plugin.keys     = {};

        /*
         * name: init
         * input: none
         * returns: none
         * description: this function creates thes basic plugin variables like the settings,
         * the menu descriptions, the heights of the menu, the default focus of the page (to
         * ensure we capture our initial accessiblity menu loading), etc. We also make sure
         * to call the functions which create our listeners - which essentially drive this
         * script in two ways:
         * 1. listening for keyboard commands
         * 2. capturing the focusing of anchors, inputs and iframes
         */
        var init = function() {         

            plugin.settings = $.extend( {}, defaults, options );
            plugin.el       = el;

            buildElements();

            //accessibility menu/cursor/tooltip 
            plugin.menu    = $( '#accessibilityMenu'    );
            plugin.cursor  = $( '#accessibilityCursor'  );
            plugin.tooltip = $( '#accessibilityTooltip' );

            // Get Accessibility Menu height from css, includes border/padding
            plugin.settings.menuHeight = plugin.menu.find( '#primary' ).outerHeight();

            // Set accessibility bar height to 0
            plugin.menu.height( 0 );
            
            /* as soon as the page loads, make sure the focus is the page and
             * not the toolbar / search bar / etc. */
            $( 'html' ).focus();

            plugin.cursor.hide();
            plugin.tooltip.hide();

            // Kick off listenter to make allow this script to do its job
            keyListener();
            focusListener();
        };

        /*
         * name: buildElements
         * input: none
         * returns: none
         * description: This function creates the accessibility menu, focus pointer and tooltips
         * and puts it as the first element in the dom
         */
        var buildElements = function() {

            $( 'body' ).prepend( plugin.settings.containerHtml );
        }

        /*
         * name: keyListener
         * input: none
         * returns: none
         * description: this function creates thes basic plugin variables like the settings,
         */
        var keyListener = function() {

            $( document ).mousedown( function() {

                if ( checkAccessability() ) {

                    exitAccessability();
                }
            });

            /* function: keydown
             * description:
             */
            $( document ).keydown( function( e ) {

                plugin.keys[e.which] = true;

                // 9  = tab
                // 13 = enter
                // 18 = alt
                // 40 = down
                // 65 = a
                if (
                    ( plugin.keys[18] && plugin.keys[65]      ) ||

                    ( checkAccessability() && plugin.keys[13] ) ||
                    ( checkAccessability() && plugin.keys[32] ) ||

                    ( checkAccessability() && plugin.keys[38] ) ||
                    ( checkAccessability() && plugin.keys[40] ) ||
                    ( checkAccessability() && plugin.keys[9]  )
                ) {

                    // 18 = alt
                    // 65 = a
                    if ( plugin.keys[18] && plugin.keys[65] ) {

                        if ( checkAccessability() ) {

                            exitAccessability();

                        } else {

                            startAccessability();
                        }

                        delete plugin.keys[18];
                        delete plugin.keys[65];

                        console.log( "alt+a (both up)" );

                        e.preventDefault();
                    }

                    e.preventDefault();
                }

            });

            /* function: keyup
             * description:
             */
            $( document ).keyup( function ( e ) {

                if ( checkAccessability() ) {

                    // 9  = tab
                    // 13 = enter
                    // 16 = shift
                    // 18 = alt
                    // 27 = esc
                    // 32 = space
                    // 38 = up
                    // 40 = down
                    // 49 = 1
                    // 50 = 2
                    // 51 = 3
                    // 65 = a
                    // 72 = h

                    // 9 = tab
                    // 16 = shift
                    if ( plugin.keys[9] && plugin.keys[16] ) {

                        var f = $( '.accessibilityFocus' );
                            f.removeClass( 'accessibilityFocus' );

                        // if we're currently focused on the accessibility menu...
                        if ( f.parents( '#accessibilityMenu' ).length ) {

                            if ( f.parent().is( ':first-child' ) ) {

                                f.parents( 'ul' ).find( 'a:last' ).addClass( 'accessibilityFocus' );

                            } else {

                                f.parent().prev().find( 'a:first' ).addClass( 'accessibilityFocus' );
                            }

                            adjustFocus( $( '.accessibilityFocus' ) );

                        // homepage - playoff leaders
                        } else if ( f.parent().parent().hasClass( 'ui-selectmenu-menu-dropdown' ) ) {

                            f.parent().prev().find( 'a:first' ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // team menu selection

                            ( f.parents( '#nbaTeamBox' ).length   ) &&
                            ( $( '#nbaTeamBox a' ).index( f ) > 0 )
                        ) {

                            $( '#nbaTeamBox a' ).eq( $( '#nbaTeamBox a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // calendar menu selection

                            ( f.parents( '#nbaCalendarBox' ).length   ) &&
                            ( $( '#nbaCalendarBox a' ).index( f ) > 0 )
                        ) {

                            $( '#nbaCalendarBox a' ).eq( $( '#nbaCalendarBox a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if (

                            ( f.parents( '#nbaVidSltBg' ).length  ) &&
                            ( $( '#nbaVidSltBg a' ).index( f ) > 0)

                        ) { // team selection on video page

                            $( '#nbaVidSltBg a' ).eq( $( '#nbaVidSltBg a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // video navigation on video page

                            ( f.parents( '.nbaVidNavLinks' ).length                     ) &&
                            ( f.closest( '.nbaVidNavLinks' ).find( 'a' ).index( f ) > 0 )

                        ) { // team selection on video page

                            f.closest( '.nbaVidNavLinks' ).find( 'a' ).eq( f.closest( '.nbaVidNavLinks' ).find( 'a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // video navigation on video page

                            ( f.parents( '.nbaVidNavLinks' ).length                      ) &&
                            ( f.closest( '.nbaVidNavLinks' ).find( 'a' ).index( f ) == 0 )

                        ) {

                            f.closest( 'div' ).css( 'display', 'none' );

                            loopPrev();

                        } else if ( // tickets page

                            ( f.parents( '#ticket_links ul li ul' ).length                            ) &&
                            ( plugin.loop.obj.eq( plugin.loop.cur ).next().find( 'a' ).index( f ) > 0 )
                        ) {

                            plugin.loop.obj.eq( plugin.loop.cur ).next().find( 'a' ).eq( plugin.loop.obj.eq( plugin.loop.cur ).next().find( 'a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        // else if we're focused inside a submenu of sorts
                        } else if ( // dropdowns in the header

                            ( f.parents( '.nbaHover div' ).length   ) &&
                            ( $( '.nbaHover div a' ).index( f ) > 0 )
                        ) {

                            var h = $( '.nbaHover' );

                            $( '.nbaHover div a' ).eq( $( '.nbaHover div a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            focusBlur( $( '.accessibilityFocus' ) );

                            h.addClass( 'nbaHover' ).hover();

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if (

                            ( f.parents( '#nbaTextResizeNav .nbaStore .nbaPrimary' ).length ) &&
                            ( $( '#nbaTextResizeNav .nbaStore .nbaPrimary a' ).index( f ) > 0 )
                        ) {

                            $( '#nbaTextResizeNav .nbaStore .nbaPrimary a' ).eq( $( '#nbaTextResizeNav .nbaStore .nbaPrimary a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if (

                            ( f.parents( '#nbaStoreNav .nbaStore .nbaPrimary' ).length ) &&
                            ( $( '#nbaStoreNav .nbaStore .nbaPrimary a' ).index( f ) > 0 )
                        ) {

                            $( '#nbaStoreNav .nbaStore .nbaPrimary a' ).eq( $( '#nbaStoreNav .nbaStore .nbaPrimary a' ).index( f ) - 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        // else we're just on some normal page link / input / etc.
                        } else {

                            $( '.nbaHover' ).removeClass( 'nbaHover' );
                            $( '#nbaTextResizeNav .nbaPrimary' ).hide();

                            if
                            (
                                ( f.parents( '#nbaCalendarBox' ).length ) ||
                                ( f.parents( '#nbaTeamBox'     ).length )
                            ) {

                                $( '.closeCal' ).click();

                            } else if ( f.parents( 'nav#nbaStoreNav' ).length ) {

                                $( 'nav#nbaStoreNav div.nbaNavDropdown' ).removeClass( 'active' );

                            } else if ( f.parents( '#nbaVidSltBg' ).length ) {

                                $( '.nbaVidClsBtn' ).click();

                            } else if ( f.parents( '#ticket_links ul li ul' ).length ) {

                                f.parents( '#ticket_links ul li ul' ).css( 'display', 'none' );
                            }

                            loopPrev();
                        }

                        delete plugin.keys[9];

                    // 9 = tab
                    } else if ( plugin.keys[9] ) {

                        var f = $( '.accessibilityFocus' );
                            f.removeClass( 'accessibilityFocus' );

                        // if we're currently focused on the accessibility menu...
                        if ( f.parents( '#accessibilityMenu' ).length ) {

                            if ( f.parent().is( ':last-child' ) ) {

                                f.parents( 'ul' ).find( 'a:first' ).addClass( 'accessibilityFocus' );

                            } else {

                                f.parent().next().find( 'a:first' ).addClass( 'accessibilityFocus' );
                            }

                            adjustFocus( $( '.accessibilityFocus' ) );

                        // homepage - playoff leaders
                        } else if ( f.parent().parent().hasClass( 'ui-selectmenu-menu-dropdown' ) ) {

                            f.parent().next().find( 'a:first' ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // team menu selection

                            ( f.parents( '#nbaTeamBox' ).length                                 ) &&
                            ( $( '#nbaTeamBox a' ).length > $( '#nbaTeamBox a' ).index( f ) + 1 )
                        ) {

                            $( '#nbaTeamBox a' ).eq( $( '#nbaTeamBox a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            f.removeClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // calendar menu selection

                            ( f.parents( '#nbaCalendarBox' ).length                                     ) &&
                            ( $( '#nbaCalendarBox a' ).length > $( '#nbaCalendarBox a' ).index( f ) + 1 )
                        ) {

                            $( '#nbaCalendarBox a' ).eq( $( '#nbaCalendarBox a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if (

                            ( f.parents( '#nbaVidSltBg' ).length                                  ) &&
                            ( $( '#nbaVidSltBg a' ).length > $( '#nbaVidSltBg a' ).index( f ) + 1 )

                        ) { // team selection on video page

                            $( '#nbaVidSltBg a' ).eq( $( '#nbaVidSltBg a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // video navigation on video page

                            ( f.parents( '.nbaVidNavLinks' ).length                                                                         ) &&
                            ( f.closest( '.nbaVidNavLinks' ).find( 'a' ).length > f.closest( '.nbaVidNavLinks' ).find( 'a' ).index( f ) + 1 )

                        ) { // team selection on video page

                            f.closest( '.nbaVidNavLinks' ).find( 'a' ).eq( f.closest( '.nbaVidNavLinks' ).find( 'a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // video navigation on video page

                            ( f.parents( '.nbaVidNavLinks' ).length                                                                          ) &&
                            ( f.closest( '.nbaVidNavLinks' ).find( 'a' ).length == f.closest( '.nbaVidNavLinks' ).find( 'a' ).index( f ) + 1 )

                        ) {

                            f.closest( 'div' ).css( 'display', 'none' );

                            loopNext();

                        } else if ( // tickets page

                            ( f.parents( '#ticket_links ul li ul' ).length                                                                                              ) &&
                            ( plugin.loop.obj.eq( plugin.loop.cur ).next().find( 'a' ).length > plugin.loop.obj.eq( plugin.loop.cur ).next().find( 'a' ).index( f ) + 1 )
                        ) {

                            plugin.loop.obj.eq( plugin.loop.cur ).next().find( 'a' ).eq( plugin.loop.obj.eq( plugin.loop.cur ).next().find( 'a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        /* ...else if we're focused inside a submenu of sorts. normall there will
                         * be a nbaHover class to denote this.
                         */
                        } else if ( // dropdowns in the header

                            ( f.parents( '.nbaHover div' ).length                                   ) &&
                            ( $( '.nbaHover div a' ).length > $( '.nbaHover div a' ).index( f ) + 1 )
                        ) {

                            var h = $( '.nbaHover' );

                            $( '.nbaHover div a' ).eq( $( '.nbaHover div a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                            focusBlur( $( '.accessibilityFocus' ) );

                            h.addClass( 'nbaHover' ).hover();

                        } else if ( // gameline social networking icons

                            ( f.parents( '.nbaBtmClose'   ).length                                                ) &&
                            ( f.parents( '.nbaBtmClose a' ).length > f.parents( '.nbaBtmClose a' ).index( f ) + 1 )
                        ) {

                            f.parents( '.nbaBtmClose a' ).eq( f.parents( '.nbaBtmClose a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // nbastore in the header

                            ( f.parents( '#nbaStoreNav .nbaStore div' ).length                                                                                                   ) &&
                            ( $( '#nbaStoreNav .nbaStore div a' ).length > $( '#nbaStoreNav .nbaStore div a' ).index( f ) + 1 )
                        ) {

                            $( '#nbaStoreNav .nbaStore div a' ).eq( $( '#nbaStoreNav .nbaStore div a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        } else if ( // nbastore in the header

                            ( f.parents( '#nbaTextResizeNav .nbaStore div' ).length                                                                                                   ) &&
                            ( $( '#nbaTextResizeNav .nbaStore div a' ).length > $( '#nbaTextResizeNav .nbaStore div a' ).index( f ) + 1 )
                        ) {

                            $( '#nbaTextResizeNav .nbaStore div a' ).eq( $( '#nbaTextResizeNav .nbaStore div a' ).index( f ) + 1 ).addClass( 'accessibilityFocus' );

                            adjustFocus( $( '.accessibilityFocus' ) );

                        // ...else we're just on some normal page link / input / etc.
                        } else {

                            $( '.nbaHover' ).removeClass( 'nbaHover' );
                            $( '#nbaTextResizeNav .nbaPrimary' ).hide();

                            if
                            (
                                ( f.parents( '#nbaCalendarBox' ).length ) ||
                                ( f.parents( '#nbaTeamBox'     ).length )
                            ) {

                                $( '.closeCal' ).click();

                            } else if ( f.parents( '#nbaVidSltBg' ).length ) {

                                $( '.nbaVidClsBtn' ).click();

                            } else if ( f.parents( 'nav#nbaStoreNav' ).length ) {

                                // $( 'li.nbaStore div.nbaNavDropdown' ).css( 'left', '-999em' );
                                $( 'nav#nbaStoreNav div.nbaNavDropdown' ).removeClass( 'active' );

                            } else if ( f.parents( '#ticket_links ul li ul' ).length ) {

                                f.parents( '#ticket_links ul li ul' ).css( 'display', 'none' );

                            } else if ( f[0].tagName == "LI" ) {

                                f.addClass( 'accessibilityFocus' );
                            }

                            loopNext();
                        }

                        delete plugin.keys[9];
                    }

                    // 27 = esc
                    if ( plugin.keys[27] ) {

                        exitAccessability();

                        delete plugin.keys[27];
                    }

                    // 13 = enter
                    if ( plugin.keys[13] ) {

                        // this is how we'll skip page blocks
                        switch( $( '.accessibilityFocus' ).attr( 'id' ) ) {

                            case 'accessibilityTargetHeader':

                                $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );

                                $( 'header a:first' ).addClass( 'accessibilityFocus' );

                                createLoop();

                                break;

                            case 'accessibilityTargetContent':

                                $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );

                                $( 'a' ).not( '#accessibilityMenu a' ).not( '.nbaAssist' ).not( 'header a' ).not( '#nbaHeader a' ).first().addClass( 'accessibilityFocus' );

                                createLoop();

                                break;

                            case 'accessibilityTargetFooter':

                                $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );

                                $( 'footer a:first' ).addClass( 'accessibilityFocus' );

                                createLoop();

                                break;

                            default:

                                var href    = 'showDropDown';
                                var re      = new RegExp( href, 'i' );

                                var attr    = plugin.loop.obj.eq( plugin.loop.cur ).attr( 'data-page' );
                                var aria    = $( '.accessibilityFocus' ).attr( 'aria-selected' );
                                var onclick = $( '.accessibilityFocus' ).attr( 'onclick' );

                                var f = $( '.accessibilityFocus' );

                                // INDEX: nbaItem is part of the gametracker at the top of the homepage
                                if ( f.hasClass( 'nbaItem' ) ) {

                                    loadURL( f.find( 'li.nbaGameInfo a' ).attr( 'href' ) );

                                // GENERAL: This is just for general anchors which have a href attribute
                                } else if (
                                    ( f.attr( 'href' )        ) &&
                                    ( f.attr( 'href' ).length ) 
                                ) {

                                    // GENERAL: Here we differential between hrefs that contain "onclick"...
                                    if ( f.attr( 'href' ).indexOf( 'onclick' ) > -1 ) {

                                        f.click();

                                    // GENERAL: ...and normal hrefs with urls
                                    } else {

                                        loadURL( f.attr( 'href' ) );
                                    }

                                } else if ( f[0].tagName == "INPUT" ){

                                    // console.log( f[0].tagName );

                                    f.parents( 'form' ).find( 'button' ).click();

                                } else if ( f[0].tagName == "BUTTON" ){

                                    f.click();
                                }

                                /* OLD STUFF BELOW
                                 * ***************
                                 */

                                if (
                                    ( plugin.loop.obj.eq( plugin.loop.cur ).hasClass( 'nbaFsScroll' ) ) ||
                                    ( typeof attr !== 'undefined' && attr !== false                   ) 
                                ) { // gameline scrolling or the data-url code on the player profiles on the main page

                                    plugin.loop.obj.eq( plugin.loop.cur ).click();

                                    createLoop();

                                } else if ( plugin.loop.obj.eq( plugin.loop.cur ).find( '#nbaSelectDateBttn' ).size() ) {

                                    $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );

                                    $( this ).find( '#nbaSelectDateBttn' ).click();

                                    $( '.nbaCalBox a:first' ).addClass( 'accessibilityFocus' );

                                } else if ( plugin.loop.obj.eq( plugin.loop.cur ).find( '#nbaSelectTeamBttn' ).size() ) {

                                    $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );

                                    $( this ).find( '#nbaSelectTeamBttn' ).click();

                                    $( '.nbaTeamBox a:first' ).addClass( 'accessibilityFocus' );

                                } else if ( $( '.accessibilityFocus' ).parents( 'nav#nbaTextResizeNav .nbaPrimary' ) ) {

                                    if ( $( 'nav#nbaTextResizeNav .nbaPrimary a' ).index( $( '.accessibilityFocus' ) ) == 0 ) {

                                      nbaTextResizer.changeFontSize( 100 );

                                    } else if ( $( 'nav#nbaTextResizeNav .nbaPrimary a' ).index( $( '.accessibilityFocus' ) ) == 1 ) {

                                      nbaTextResizer.changeFontSize( 150 )

                                    } else if ( $( 'nav#nbaTextResizeNav .nbaPrimary a' ).index( $( '.accessibilityFocus' ) ) == 2 ) {

                                      nbaTextResizer.changeFontSize( 200 )
                                    }

                                } else if (
                                    ( typeof aria    !== 'undefined' && aria    !== false ) ||
                                    ( typeof onclick !== 'undefined' && onclick !== false )
                                ) {

                                    $( '.accessibilityFocus' ).click();

                                } else if (

                                    ( $( '.accessibilityFocus' ).parent()[0].tagName == 'P'                         ) &&
                                    ( $( '.accessibilityFocus' ).parent().attr( 'class' ).match( "nbaVidSection*" ) )
                                ) {

                                    $( '.accessibilityFocus' ).click();

                                    createLoop();

                                } else if ( $( '.accessibilityFocus' ).attr( 'data-href' ) ) {

                                    loadURL( $( '.accessibilityFocus' ).attr( 'data-href' ) );

                                } else {

                                    if ( $( '.accessibilityFocus' ).attr( 'onclick' ) ) {

                                        $( '.accessibilityFocus' ).click();

                                    } else {

                                        // $( '.accessibilityFocus' ).click();
                                        // or if the tag is an anchor with a real href, just go to that URL
                                        loadURL( $( '.accessibilityFocus' ).attr( 'href' ) );
                                    }
                                }

                                break;
                        }

                        adjustFocus( $( '.accessibilityFocus' ) );
                        focusBlur( $( '.accessibilityFocus' ) );

                        delete plugin.keys[13];

                    } // END - 13 = enter

                    // 18 = alt
                    // 40 = down
                    if ( plugin.keys[18] && plugin.keys[40] ) {

                        var p = $( '.accessibilityFocus' );
                            p.removeClass( 'accessibilityFocus' );

                        if (
                            ( p.parents(  'nav#nbaGlobalNav'   ).length ) &&
                            ( p.siblings( 'div.nbaNavDropdown' ).length )
                        ) {

                            p.parent().addClass( 'nbaHover' ).hover();
                            p.next().find( 'a:first' ).addClass( "accessibilityFocus" );

                        } else if ( p.hasClass( 'ui-selectmenu' ) ) {

                            $( '.ui-selectmenu-menu' ).addClass( 'ui-selectmenu-open' );
                            $( '.ui-selectmenu-menu a:first' ).addClass( 'accessibilityFocus' );

                        } else if ( p.parents( 'nav#nbaTextResizeNav' ).length ) {

                            $( '#nbaTextResizeNav' ).removeClass( 'nbaTextResizeHidden' );
                            $( '#nbaStoreNav'      ).addClass(    'nbaTextNav'          );

                            $( '#nbaTextResizeNav .nbaPrimary a:first' ).addClass( "accessibilityFocus" );

                        } else if ( p.parents( 'nav#nbaStoreNav' ).length ) {

                            p.next().find( 'a:first' ).addClass( 'accessibilityFocus' );

                            p.parent().hover();
                            $( 'nav#nbaStoreNav div.nbaNavDropdown' ).addClass( 'active' );

                        } else if ( plugin.loop.obj.eq( plugin.loop.cur ).children( ':first' ).hasClass( 'nbaModBarPlusBut' ) ) {

                            plugin.loop.obj.eq( plugin.loop.cur ).children( ':first' ).click();
                            plugin.loop.obj.eq( plugin.loop.cur ).parent().prev().find( '.nbaBtmClose a:first' ).addClass( 'accessibilityFocus' );

                        } else if ( plugin.loop.obj.eq( plugin.loop.cur ).find( 'div.nbaSelectDate' ).size() ) {

                            $( this ).find( '#nbaSelectDateBttn' ).click();
                            $( '.nbaCalBox a:first' ).addClass( 'accessibilityFocus' );

                        } else if ( plugin.loop.obj.eq( plugin.loop.cur ).find( 'div.nbaSelectTeam' ).size() ) {

                            $( '#nbaSelectTeamBttn' ).click();
                            $( '.nbaTeamBox a:first' ).addClass( 'accessibilityFocus' );

                        } else if (

                            ( p.parent()[0].tagName == 'P'                         ) &&
                            ( p.parent().attr( 'class' ).match( "nbaVidSection*" ) )
                        ) {

                            p.parent().parent().next().css( 'display', 'block' );
                            p.parent().parent().next().find( 'a:first' ).addClass( 'accessibilityFocus') ;

                        } else if ( $( '#ticket_links a' ).index( plugin.loop.obj.eq( plugin.loop.cur ) ) ) {

                            p.next().css( 'display', 'block' );
                            p.next().find( 'a:eq(0)' ).addClass( 'accessibilityFocus' );

                        } else if ( plugin.loop.obj.eq( plugin.loop.cur ).attr() == 'nbaVidSelectText' ) {

                            // console.log( "VIDEO" );

                        } else if ( p.hasClass( 'nbaVidPickTeam' ) ) {

                            $( '#nbaVidSltBg a:first' ).addClass( 'accessibilityFocus' );

                        } else {

                            p.parent().find( 'div a:first' ).addClass( 'accessibilityFocus' );
                            focusBlur( $( '.accessibilityFocus' ) );
                            p.parent().addClass( 'nbaHover' ).hover();
                        }

                        focusBlur(   $( '.accessibilityFocus' ) );
                        adjustFocus( $( '.accessibilityFocus' ) );

                        delete plugin.keys[40];
                    }

                    // 18 = alt
                    // 38 = up
                    if ( plugin.keys[18] && plugin.keys[38] ) {

                        var p = $( '.accessibilityFocus' );
                            p.removeClass( 'accessibilityFocus' );

                        if ( p.parents( 'nav#nbaStoreNav' ).length ) {

                            p.next().find( 'a:first' ).addClass( 'accessibilityFocus' );

                            p.parent().hover();
                            $( 'nav#nbaStoreNav div.nbaNavDropdown' ).removeClass( 'active' );

                        } else if (

                            ( p.parents( '#nbaCalendarBox' ).length ) ||
                            ( p.parents( '#nbaTeamBox'     ).length )
                        ) {

                            $( '.closeCal' ).click();

                        } else if ( p.parents( '#nbaVidSltBg' ).length ) {

                            $( '.nbaVidClsBtn' ).click();

                        } else if (

                            ( plugin.loop.obj.eq( plugin.loop.cur ).children( ':first' ).hasClass( 'nbaModBarPlusBut' )     ) &&
                            ( plugin.loop.obj.eq( plugin.loop.cur ).parent().prev().find( '.nbaBtmClose' ).is( ':visible' ) )
                        ) {

                            plugin.loop.obj.eq( plugin.loop.cur ).children( ':first' ).click();

                        } else if (

                            ( p.parent()[0].tagName == 'P'                         ) &&
                            ( p.parent().attr( 'class' ).match( "nbaVidSection*" ) )
                        ) {

                            p.parent().parent().next().css( 'display', 'none' );

                        // text resize dropdown
                        } else if (
                          ( p.parents( '#nbaTextResizeNav .nbaPrimary' ).length                                                   ) &&
                          ( $( '#nbaTextResizeNav .nbaPrimary a' ).length > $( '#nbaTextResizeNav .nbaPrimary a' ).index( p ) + 1 )
                        ) {

                            $( '#nbaTextResizeNav .nbaPrimary' ).hide();

                        } else if ( p.parents( '.nbaVidNavLinks' ).length ) {

                            p.closest( 'div' ).css( 'display', 'none' );

                        } else if ( p.parents( '#ticket_links ul li ul' ).length ) {

                            p.closest( 'ul' ).css( 'display', 'none' );                            

                        // header case : NBA Store
                        // } else if ( $( '.accessibilityFocus' ).parents( '.nbaPrimary .nbaStore' ).length ) {

                        } else if ( p.parents( '.nbaStore' ).length ) {

                            $( 'li.nbaStore div.nbaNavDropdown' ).css( 'left', '-999em' );

                        // header case : standard hover dropdown class

                        } else {

                            $( '.nbaHover' ).removeClass( 'nbaHover' );
                        }

                        p.removeClass( 'accessibilityFocus' );

                        plugin.loop.obj.eq( plugin.loop.cur ).addClass( 'accessibilityFocus' );

                        adjustFocus( $( '.accessibilityFocus' ) );

                        delete plugin.keys[38];
                    }

                    // 18 = alt
                    // 49 = 1
                    if ( plugin.keys[18] && plugin.keys[49] ) {

                        $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );
                        $( '#nbaHeader a:first'  ).addClass(    'accessibilityFocus' );

                        createLoop();

                        adjustFocus( $( '.accessibilityFocus' ) );
                        focusBlur(   $( '.accessibilityFocus' ) );

                        delete plugin.keys[49];
                    }

                    // 18 = alt
                    // 50 = 2
                    if ( plugin.keys[18] && plugin.keys[50] ) {

                        $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );
                        $( 'a' ).not( '#accessibilityMenu a' ).not( '.nbaAssist' ).not( 'header a' ).not( '#nbaHeader a' ).first().addClass( 'accessibilityFocus' );

                        createLoop();

                        adjustFocus( $( '.accessibilityFocus' ) );
                        focusBlur(   $( '.accessibilityFocus' ) );

                        delete plugin.keys[50];
                    }

                    // 18 = alt
                    // 51 = 3
                    if ( plugin.keys[18] && plugin.keys[51] ) {

                        // console.log( $( 'footer a:first' ) );

                        $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );
                        $( 'footer a:first'      ).addClass(    'accessibilityFocus' );

                        createLoop();

                        adjustFocus( $( '.accessibilityFocus' ) );
                        focusBlur(   $( '.accessibilityFocus' ) );

                        delete plugin.keys[51];
                    }

                    // 18 = alt
                    // 72 = h
                    if ( plugin.keys[18] && plugin.keys[72] ) {

                        loadURL( '/' );

                        delete plugin.keys[72];
                    }

                    // 32 = space
                    if ( plugin.keys[32] ) {

                        if ( $( '.accessibilityFocus' )[0].tagName == "INPUT" ) {

                            $( 'input[name="' + $( '.accessibilityFocus' ).attr( 'name' ) + '"]' ).prop('checked', false);

                            $( '.accessibilityFocus' ).prop( 'checked', true );
                        }

                        delete plugin.keys[32];
                    }
                }

                delete plugin.keys[e.which];
            });
        }

        /*
         * name: createLoop
         * input: none
         * returns: none
         * description: this creates an object that will function as the order
         * in which the page will be navigated by tab / shift-tab key strokes. It also sets all
         * the default variables like the jquery object hash, the object itself (so it doesn't
         * have to regenerate the object each query), the current, previous, and next index (what
         * element we're currently on), etc.
         */
        var createLoop = function() {

            delete( plugin.loop.obj );
            delete( plugin.loop.len );
            delete( plugin.loop.cur );
            delete( plugin.loop.nxt );
            delete( plugin.loop.prv );

            plugin.loop.hsh = "a,iframe,input,button,li.nbaItem";
            plugin.loop.obj = $( plugin.loop.hsh ).not( '#accessibilityMenu a'       )
                                                  .not( 'a#nbaAssistSkip'            )
                                                  .not( '#nbaGameTracker li a'       )
                                                  .not( 'a.nbaTImage'                )
                                                  .not( 'header li li a'             )
                                                  // .not( 'a:hidden,input:hidden'   )
                                                  .not( 'input:hidden' )
                                                  .not( '#nbaCalendarBox a'          )
                                                  .not( '#nbaTeamBox a'              )
                                                  .not( '#ticket_links ul li ul a'   )
                                                  .not( '.nbaFnlMnSocialDiv a'       )
                                                  .not( 'button#fb-auth'             )
                                                  .not( 'div.nbaVidPlusBtn a'        )
                                                  .not( 'a.nbaAssist'                )
                                                  .not( 'a#nbaVidSelectLk'           )
                                                  .not( 'a.nbaTextSizeBtn'           )

                                                  .not( 'iframe#_fw_frame_fw_nba_skin_slot' )
                                                  .not( 'iframe#fb_xdm_frame_http'   )
                                                  .not( 'iframe#facePile'            )
                                                  .not( 'iframe#nbaResponsysFrame'   )

                                                  .not( 'iframe#fb_xdm_frame_https'  )
                                                  .not( 'iframe#csiDataIframecsi2'   )
                                                  .not( 'iframe#lb_pixels_145841489' )
                                                  .not( 'iframe#175224' )
                                                  .not( 'iframe#195065' )
                                                  .not( 'iframe#279323' )
                                                  .not( 'iframe#522130' )
                                                  .not( 'iframe#228279' )
                                                  .not( 'iframe#772905' )
                                                  .not( 'iframe#790007' )
                                                  .not( 'iframe#602522' )

                                                  .filter( function() {

                                                    if ( $( this ).parent().parent().hasClass( 'nbaLeadersList' ) ) {

                                                        if ( $( this ).parent().css( 'z-index' ) == 2 ) {

                                                            return $( this );
                                                        }

                                                    } else {

                                                        return $( this );
                                                    }
                                                });

            plugin.loop.len = plugin.loop.obj.size();
            plugin.loop.cur = plugin.loop.obj.index( $( '.accessibilityFocus' ) );
            plugin.loop.nxt = plugin.loop.cur + 1;
            plugin.loop.prv = plugin.loop.cur - 1;

            if ( plugin.loop.prv < 0 ) {

                plugin.loop.prv = plugin.loop.len - 1;
            }

            return true;
        }

        /*
         * name: checkAccessability
         * input: none
         * returns: none
         * description: this checks to see if the accessibility menu is currently active
         * or still hidden.
         */
        var checkAccessability = function() {

            if ( $( '#accessibilityMenu' ).height() > 0 ) {

                return true;

            } else {

                return false;
            }
        };

        /*
         * name: startAccessability
         * input: none
         * returns: none
         * description: show the accessibility bar at the top of the page - make sure to pad the body as well
         * so we don't lose any navigation elements at the top of the page.
         */
        var startAccessability = function() {

            plugin.menu.show();
            plugin.cursor.show();
            plugin.menu.animate({ height: plugin.settings.menuHeight }, 500 );

            plugin.menu.find( 'a:first' ).addClass( 'accessibilityFocus' );

            adjustFocus( $( '.accessibilityFocus' ) );

            $( ':focus' ).blur();

            $( 'body' ).animate({ paddingTop: plugin.settings.menuHeight }, 500 );
        };

        /*
         * name: exitAccessability
         * input: none
         * returns: none
         * description: this function animates the hiding of the accessibility menu. just a simple
         * change in the height to 0. We also de-focus from anything that is currently in focus
         * and refocus on the body of the page.
         */
        var exitAccessability = function() {

            $( '.closeCal' ).click();

            plugin.menu.animate({ height: 0 }, 500 ).hide();;
            $( 'body' ).animate({ paddingTop: 0 }, 500 );

            plugin.tooltip.hide();
            plugin.cursor.hide();

            $( ':focus'              ).blur();
            $( '.accessibilityFocus' ).blur();

            $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );
            $( '.nbaHover' ).removeClass( 'nbaHover' );

            $( 'nav#nbaStoreNav div.nbaNavDropdown' ).removeClass( 'active' );

            $( 'a:first' ).focus();
        };

        /*
         * name: focusListener
         * input: none
         * returns: none
         * description: creates listeners such that whenever an anchor link or an iframe element
         * is focused in upon, we take special actions. if that element has div siblings, it's
         * likely part of a list element with a dropdown, so we change the tooltip to explain how
         * to navigate into that element, hide the standard anchor cursor, show the tooltip div
         * element and make sure the offset is set appropraitely. If this is not a dropdown element,
         * we'll hide the tooltip element (just in case it might be currently visible from the
         * previous element), show the accessibility cursor and then re-focus that cursor to the
         * proper location via the focusCursor funtion.
         */
        var focusListener = function() {

/*
            plugin.cVal = $( '#nbaVidRsltBody' ).html();

            setInterval( function() {

                plugin.nVal = $( '#nbaVidRsltBody' ).html();

                if ( plugin.cVal != plugin.nVal ) {

                    alert( "newVids" );
                    plugin.cVal = $( '#nbaVidRsltBody' ).html();
                    createLoop();
                }

            }, 5000 );
*/
        }

        var focusBlur = function( element ) {

            // console.log( element );

            if (
              (  element.is( ':visible' ) ) &&
              ( !element.is( ':empty' )   )
            ) {

                element.focus();

            } else {

                $( ':focus' ).blur();
            }          

            if ( element.hasClass( 'nbaItem' ) ) {

                // console.log( element.attr( 'title' ) );

                element.find( 'li.nbaGameInfo a:first' ).html( element.attr( 'title' ) );
                element.find( 'li.nbaGameInfo a:first' ).show().focus();
            }

            if ( element.is( 'iframe' ) || element.is( 'input' ) ) {

                element.focus();
            }

        }

        /*
         * name: adjustFocus
         * input: element (jQuery object)
         * returns: none
         * description:
         */
        var adjustFocus = function( element ) {

/*
            console.log( "<adjustFocus..." );
            console.log( $( '.accessibilityFocus' ) );
            console.log( $( '.accessibilityFocus' ).parent() );
            console.log( $( '.accessibilityFocus' ).length );
            console.log( $( '.accessibilityFocus' ).parent()[0].tagName );
            console.log( $( '.accessibilityFocus' ).html() );
            console.log( "</adjustFocus>" );
*/

            if ( element.parents( 'header' ).size() ) {

                if ( element.siblings( 'div' ).size() ) {

                    // console.log( "DIVHEADER" );
                    focusBlur( element );
                    element.parent().removeClass( 'nbaHover' );
                    plugin.tooltip.attr( 'class', '' ).addClass( 'dropdown' );
                    focusTooltip();
                    plugin.tooltip.offset({ top: element.offset().top + 4, left: element.offset().left - plugin.tooltip.width() - 29 });

                } else if (

                    ( element.parents( '#nbaChromeLogin'   ).size() ) ||
                    ( element.hasClass( 'nbaTextSizeBtn' ) )
                ) {

                    // console.log( "CHROMELOGIN/TXTSIZE" );
                    focusBlur( element );
                    focusCursor();
                    plugin.cursor.offset({ top: element.offset().top + 1, left: element.offset().left - 10 });

                } else if ( element.parents( '.nbaHover div' ).size() ) {

                    // console.log( "NBAHOVER" );
                    focusCursor();
                    plugin.cursor.offset({ top: element.parent().offset().top + 2, left: element.parent().offset().left - 13 });

                } else {

                    focusCursor();
                    focusBlur( element );
                    plugin.cursor.offset({ top: element.offset().top + 12, left: element.offset().left - 10 });
                }

            } else if ( element.hasClass( 'ui-selectmenu' ) ) {

                focusBlur( element );
                plugin.tooltip.attr( 'class', '' ).addClass( 'dropdown' );
                focusTooltip();
                plugin.tooltip.offset({ top: element.offset().top - 5, left: element.offset().left - plugin.tooltip.width() - 29 });

            } else if ( element.parents( 'section#accessibilityMenu' ).size() ) {

                focusBlur( element );
                // console.log( "ACCESSIBILITY" );
                focusCursor();
                plugin.cursor.offset({ top: element.offset().top + 1, left: element.offset().left - 10 });

            } else if (

                ( $( '.accessibilityFocus' ).parent().length > 0                                ) &&
                ( $( '.accessibilityFocus' ).parent()[0].tagName == 'P'                         ) &&
                ( $( '.accessibilityFocus' ).parent().attr( 'class' )                           ) &&
                ( $( '.accessibilityFocus' ).parent().attr( 'class' ).match( "nbaVidSection*" ) )
            ) {

                focusBlur( element );
                // console.log( "NBAVID" );
                plugin.tooltip.attr( 'class', '' ).addClass( 'dropdown' );
                focusTooltip();
                plugin.tooltip.offset({ top: element.offset().top - 5, left: element.offset().left - plugin.tooltip.width() - 29 });

            } else if ( $( '.accessibilityFocus' ).hasClass( 'nbaItem' ) ) {

                // console.log( "LIGAMETRAKER" );
                focusBlur( element );

                focusCursor();
                plugin.cursor.offset({ top: element.offset().top, left: element.offset().left });

            } else if ( element.children( 'div' ).size() == 1 ) {

                // console.log( "DIV" );
                focusBlur( element );

                focusCursor();
                plugin.cursor.offset({ top: element.children( 'div' ).offset().top, left: element.children( 'div' ).offset().left - 12 });

            } else if ( element.parents( '#nbaGameTracker' ).length ) {

                // console.log( "nbaGameTracker" );
                focusBlur( element );

                focusCursor();
                plugin.cursor.offset({ top: element.offset().top - 5, left: element.offset().left - 10 });

                createLoop();

            } else if ( element.parents( '#nbaBdHeadButtons' ).size() ) {

                // console.log( "HEADBUTTONS" );
                focusBlur( element );

                focusCursor();
                plugin.cursor.offset({ top: element.offset().top + 35, left: element.offset().left - 10 });

            } else if ( $( '.accessibilityFocus' ).parents( '#ticket_links ul li ul' ).length ) {

                // console.log( "TICKETLINKS" );
                focusBlur( element );

                focusCursor();
                plugin.cursor.offset({ top: element.offset().top + 35, left: element.offset().left - 10 });

            } else if ( $( '.accessibilityFocus' ).hasClass( 'nbaVidPickTeam' ) ) {

                // console.log( "NBAVIDPICK" );
                focusBlur( element );

                plugin.tooltip.attr( 'class', '' ).addClass( 'dropdown' );
                focusTooltip();
                plugin.tooltip.offset({ top: element.offset().top - 5, left: element.offset().left - plugin.tooltip.width() - 29 });

            } else if (

                ( $( '.accessibilityFocus' ).length > 0            ) &&
                ( $( '.accessibilityFocus' )[0].tagName == "INPUT" )
            ) {

                if ( element.attr( 'type' ) == "radio" ) {

                    // console.log( "RADIO" );
                    focusBlur( element );

                    focusCursor();
                    plugin.cursor.offset({ top: element.offset().top + 2, left: element.offset().left - 11 });

                } else {

                    // console.log( "TEXT" );
                    focusBlur( element );

                    plugin.tooltip.attr( 'class', '' ).addClass( 'input' );
                    focusTooltip();
                    plugin.tooltip.offset({ top: element.offset().top - 5, left: element.offset().left - plugin.tooltip.width() - 29 });
                }

            } else if ( $( '.accessibilityFocus' ).parents( '#nbaGameTracker' ).size() ) {

                if ( $( '.accessibilityFocus').parents( '.nbaVidSections' ).size() ) {

                    // console.log( "nbaVidSections" );
                    focusBlur( element );

                    plugin.tooltip.attr( 'class', '' ).addClass( 'dropdown' );
                    focusTooltip();
                    plugin.tooltip.offset({ top: element.offset().top + 3, left: element.offset().left - 10 });

                } else {

                    focusBlur( element );

                    focusCursor();
                    plugin.cursor.offset({ top: element.offset().top + 35, left: element.offset().left - 10 });
                }

            } else if ( $( '.accessibilityFocus' ).parents( 'div#ticket_links' ).size() ) {

                // console.log( "TICKETLINKS" );
                focusBlur( element );

                plugin.tooltip.attr( 'class', '' ).addClass( 'dropdown' );
                focusTooltip();
                plugin.tooltip.offset({ top: element.offset().top + 3, left: element.offset().left - 10 });

            } else {

                // console.log( "ELSE" );
                focusBlur( element );

                // console.log( element.html() );
                // console.log( element.offset() );

                focusCursor();
                plugin.cursor.offset({ top: element.offset().top + 7, left: element.offset().left - 11 });
            }

            // $( document ).scrollTop( element.offset().top - 70 );
        }

        /*
         * name: focusListener
         * input: active (jQuery object)
         * returns: none
         * description: refocuses the cursor upon the active element (this will "move" the arrow
         * created to show element is current active). We use the - 10 / + 1 to adjust the alignment
         * so instead of sitting in the top corner of the element, we focus on the middle of the
         * element, for the most part.
         */
        var focusCursor = function() {

            plugin.tooltip.hide();
            plugin.cursor.show();
        }

        /*
         * name: focusListener
         * input: active (jQuery object)
         * returns: none
         * description: refocuses the cursor upon the active element (this will "move" the arrow
         * created to show element is current active)
         */
        var focusTooltip = function() {

            plugin.cursor.hide();
            plugin.tooltip.show();
        }

        /*
         * name: loopNext
         * input: none
         * returns: none
         * description: this function increments each of the loop index variables (current, next,
         * previous) in addition to re-focusing to the next loop element in the jquery object
         * list. it also checks to make sure that if we're at the end of the list, we don't go
         * outside the scope of the list and instead starts the index back at 0.
         */
        var loopNext = function() {

            $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );

            plugin.loop.cur += 1;

            if ( plugin.loop.cur == plugin.loop.len ) {

                plugin.loop.cur = 0;
            }

            plugin.loop.nxt += 1;
            plugin.loop.prv += 1;

            if ( plugin.loop.nxt == plugin.loop.len ) {

                plugin.loop.nxt = 0;
            }

            plugin.loop.obj.eq( plugin.loop.cur ).addClass( 'accessibilityFocus' );

            adjustFocus( $( '.accessibilityFocus' ) );
        }

        /*
         * name: loopPrev
         * input: none
         * returns: none
         * description: this function decrements each of the loop index variables (current, next,
         * previous) in addition to re-focusing to the previous loop element in the jquery object
         * list. it also checks to make sure that if we're at the beginning of the list, we don't go
         * outside the scope of the list and instead starts the index at the end of the list (which
         * technically the "size" of the list minus 1).
         */
        var loopPrev = function() {

            $( '.accessibilityFocus' ).removeClass( 'accessibilityFocus' );

            plugin.loop.cur -= 1;

            if ( plugin.loop.cur == -1 ) {

                plugin.loop.cur = plugin.loop.len - 1;
            }

            plugin.loop.nxt -= 1;
            plugin.loop.prv -= 1;   

            plugin.loop.obj.eq( plugin.loop.cur ).addClass( 'accessibilityFocus' );

            adjustFocus( $( '.accessibilityFocus' ) );
        }

        /*
         * name: loadURL
         * input: url (string)
         * returns: none
         * description: immediately directs the the user's browser to a specific URL
         */
        var loadURL = function( url ) {

            window.location.href = url;
        };

        // initialize this plugin
        init();
    }

})( jQuery );

$( function() {

    // console.log( 'accessibility mode enabled' );

    $.accessibility();    
});