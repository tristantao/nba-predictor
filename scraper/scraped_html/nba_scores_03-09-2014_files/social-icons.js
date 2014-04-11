$(function () {

      var title = $('title').text();
      var new_href, socialType, pageTitle;
      /** bit.ly integration **/
      var bitlyLogin = 'nba450';
      var bitlyAPI = 'R_46b31735252665da66f63ede638288f1';
      var shortenedURL;

      /*** get shorty ***/
      var getShortURL = function(long, login, api, func) {
          $.getJSON(
              "http://api.bitly.com/v3/shorten?callback=?", 
              { 
                  "format": "json",
                  "apiKey": api,
                  "login": login,
                  "longUrl": long
              },
              function(response)
              {
                  func(response.data.url);
              }
          );
      };

      var shareURL = function(resp) {
          var get_href =  resp;
          get_href = escape(get_href);
          
          switch ( socialType ) {
            case 'facebook':
              get_text = '&p[summary]=via NBA.com/Stats&p[title]=' + pageTitle;
              break;
            case 'twitter':
              get_text = '&text=' + pageTitle;
              break;
            case 'google':
              get_text = '&text=' + pageTitle;
              break;
            default:
              get_text = '&text=' + pageTitle;
              break;
          }

          console.log(get_text);

          get_href += get_text;
          get_href += ' %23NBAStats';
          new_href = new_href.replace('{URL}',get_href);
          window.open(new_href, 'Stats', 'resizable=yes,scrollbars=yes,height=300,width=600');
      };

      $('#social-icons a').click(function(e){
            e.preventDefault();
            new_href =  $(this).attr('href');
            socialType = $(this).parent().attr('class');
            pageTitle = $('title').text();
            getShortURL(location.href, bitlyLogin, bitlyAPI, shareURL);
      });
});


