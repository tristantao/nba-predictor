$(function() {


  /*** DOM ***/

  var $window = $(window);
  var $pull = $('a#pull');
  var $menu = $('#site-nav #accordion');
  var $pull_social = $('#social_pull');
  var $menu_social = $('#social-icons');


  /*** EVENTS ***/

  var onPullMenuClick = function (e) {
    $menu.slideToggle(function(){
      if($menu.css('display') == 'none'){
          $pull.text('Stats Menu');
      }else{
          $pull.text('Close');
      }
    });
  };

  var onPullSocialClick = function (e) {
    $menu_social.slideToggle(function(){
      if($menu_social.css('display') == 'none'){
        $pull_social.attr('class','');
        $pull_social.text('Share');
      } else {
        $pull_social.attr('class','opened');
        $pull_social.text('Close');
      }
    });
  }

  var onWindowResize = function (e) {
    var w = $window.width();
    if(w > 320 && $menu.is(':hidden')) {
      $menu.removeAttr('style');
    }
  }
  if(IS_MOBILE){
  var onNavDropDownClick = function (e) {
    var $this = $(this);
    $('.navDropDown').attr('class', 'navDropDown closed');
    $this.toggleClass('closed');
  };
  }
  var onSiteNavClick = function (e) {

    location.href = $(this).attr('href');
  };


  /*** INIT ***/

  if($window.width() < 600 ) {

    $('.breadcrumb, .breadcrumbs').html('<a href="/">NBA.com/Stats</a>');

    $pull.click(onPullMenuClick);
    $pull_social.click(onPullSocialClick);

    //$('#site-nav ul ').on('click', function(e) {
    $('#site-nav h2.nonav a').on('click', function() {
        location.href = $(this).attr('href');
    });

    $('#site-nav h2').not('.nonav').on('click', function() {
       var link = $(this);

      link.toggleClass('current');
      $('#site-nav h2').not(link).removeClass('current');
      $('#site-nav .pane').removeClass('menu-open');
      link.next('.pane').toggleClass('menu-open');

      $('#site-nav .pane').not('.menu-open').slideUp();
      link.next('.pane').slideToggle();
    });

  }
            
  $window.resize(onWindowResize);
  $('.navDropDown').click(onNavDropDownClick);

});
