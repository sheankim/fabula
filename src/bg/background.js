var socialNetworks = [];

(function() {
  var config = Settings.getInstance();

  if (config.getProperty('instagram')) {
    var instagram = new InstagramAPI();

    // verify that the OAuth key is actually cached
    instagram.login(function(success) {
      if (success) {
        socialNetworks.push(instagram);
      } else {
        config.setProperty('instagram', undefined);
      }
    });
  }

  if (config.getProperty('facebook')) {
    var facebook = new FacebookAPI();

    // verify that the OAuth key is actually cached
    facebook.login(function(success) {
      if (success) {
        socialNetworks.push(facebook);
      } else {
        config.setProperty('facebook', undefined);
      }
    });
  }

  // wait 5 seconds for the login transactions to finish
  window.setTimeout(function() {
    // which default view to render: getting_started or fabula
    if (socialNetworks.length == 0) {
      chrome.browserAction.setPopup({popup: 'src/browser_action/getting_started.html'});
    } else {
      chrome.browserAction.setPopup({popup: 'src/browser_action/fabula.html'});
    }
  }, 5000);
})();
