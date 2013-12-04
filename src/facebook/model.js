var Facebook = {
  login: function(callbackSuccess, callbackFailure) {
    // this is the format for Facebook's OAuth URL
    var AUTH_URL_FORMAT = 'https://www.facebook.com/dialog/oauth?client_id=CLIENT-ID&response_type=token&redirect_uri=REDIRECT-URI';

    // this is the format for the redirect URI registered on Facebook
    var REDIRECT_URI_FORMAT = 'https://APP-ID.chromiumapp.org';

    // build the OAuth URL
    var auth_url = AUTH_URL_FORMAT;

    // add in the client id, given to us by Facebook
    auth_url = auth_url.replace(/CLIENT-ID/, SecretKeys.facebook.client_id);

    // build the redirect URI -- it __MUST__ match what is registered on Facebook
    var redirect_uri = REDIRECT_URI_FORMAT.replace(/APP-ID/, chrome.runtime.id);

    // add in the redirect URI
    auth_url = auth_url.replace(/REDIRECT-URI/, encodeURIComponent(redirect_uri));

    // ask the user to log into Facebook (using the OAuth URL)
    chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true},
      function(responseURL) {
        // check if the login was successful
        if(responseURL.indexOf('error_reason') == -1) {
          // the user is now logged in, so we will grab and save the access token
          var accessToken = responseURL.split('access_token=')[1].split('&')[0];

          // TODO: we should probably abstract out this part
          localStorage.facebookToken = accessToken;

          // login succeeded - notify the caller
          callbackSuccess(accessToken);
        } else {
          // login failed - notify the caller
          callbackFailure();
        }
    });
  },

  getUser: function(callback) {
    // get data from Facebook (the data source)
    Facebook.makeRequest('GET', 'me', function(parsedResponse) {
      callback(parsedResponse);
    });
  },

  getUsername: function(callback) {
    // get data from Facebook (the data source)
    Facebook.getUser(function(user) {
      callback(user.username);
    });
  },

  getEmail: function(callback) {
    // get data from Facebook (the data source)
    Facebook.getUser(function(user) {
      callback(user.email);
    });
  },

  getFeed: function(callback) {
    // get data from Facebook (the data source)
    Facebook.makeRequest('GET', 'me/feed', function(parsedResponse) {
      callback(parsedResponse);
    });
  },

  makeRequest: function(type, resource, callback) {
    // TODO: abstraction needed here
    var facebookToken = localStorage.facebookToken;

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var parsedResponse = JSON.parse(xhr.response);
      callback(parsedResponse);
    };
    xhr.open(type, 'https://graph.facebook.com/' + resource + '?access_token=' + facebookToken);
    xhr.send();
  },

  logout: function(callback) {
    // TODO: abstraction needed here
    var facebookToken = localStorage.facebookToken;

    if (facebookToken) {
      chrome.identity.removeCachedAuthToken({token: facebookToken}, function() {
        localStorage.facebookToken = null;
      });
    }
  }
};
