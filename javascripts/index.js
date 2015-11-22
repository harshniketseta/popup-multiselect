
$(document).ready(function () {

  $(".tar_download_link").on("click", function () {
    ga && ga('send', 'event', 'link', 'click', 'tar_download_link');
  });

  $(".zip_download_link").on("click", function () {
    ga && ga('send', 'event', 'link', 'click', 'zip_download_link');
  });

  var trackLink = function(event){
    event.preventDefault();

    var jHref = $(this)
      , href = jHref.attr("href")
      , eventLabel = jHref.data("eventLabel")
      , openNewWindow = (jHref.attr("target") === "_blank")
      , gaOptions = {
                      'hitType': 'event',
                      'eventCategory': 'link',
                      'eventAction': 'click',
                      'eventLabel': eventLabel
                    }
      ;
    
    if (openNewWindow) {
      window.open(href);
    } else {
      var t = setTimeout(function(){
        window.location = href;
      }, 250);
      gaOptions.hitCallback = function () {
                                            clearTimeout(t);
                                            window.location = href;
                                          };
    }
    
    // send data to GA:
    ga && ga('send', gaOptions);
  };

  $("#minimal_requirements a").on("click", trackLink);

  $("#forkme_banner").on("click", trackLink);
  $("#goToGithub").on("click", trackLink);
  $("#goToLinkedin").on("click", trackLink);

  function track_tweet(event) {
    if (event) {
      ga('send', {
        'hitType': 'social',
        'socialNetwork': 'Twitter',
        'socialAction': 'Tweet',
        'socialTarget': 'harshniketseta.github.io/popupMultiSelect/',
        'page': '/'
      });
    }
  }

  function addFBEventListeners() {
    if (typeof FB !== 'undefined') {
      clearInterval(window.fbCheck);
      FB.Event.subscribe('edge.create', function (targetUrl) {
        ga('send', 'social', 'facebook', 'like', targetUrl);
      });
    }
  };

  window.fbCheck = setInterval(addFBEventListeners, 100);

  function addtwttrEventListeners() {
    if(typeof twttr !== 'undefined'){
      clearInterval(window.twttrCheck);
      twttr.ready(function (twttr) {
        twttr.events.bind('tweet', track_tweet);
      });
    }
  }

  window.twttrCheck = setInterval(addtwttrEventListeners, 100);

  function track_tweet(event) {
    if (event) {
      ga('send', {
        'hitType': 'social',
        'socialNetwork': 'Twitter',
        'socialAction': 'Tweet',
        'socialTarget': 'harshniketseta.github.io/popupMultiSelect/',
        'page': '/installation'
      });
    }
  }
});


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-63624467-1', 'auto');
ga('send', 'pageview');
