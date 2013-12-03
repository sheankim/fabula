var Twitter = {
  login: function(callbackSuccess, callbackFailure) {
    // this is the format for Twitter's OAuth URL
    var AUTH_URL_FORMAT = 'https://api.twitter.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token';

    // this is the format for the redirect URI registered on Twitter
    var REDIRECT_URI_FORMAT = 'https://APP-ID.chromiumapp.org';

    // build the OAuth URL
    var auth_url = AUTH_URL_FORMAT;

    // add in the client id, given to us by Twitter
    auth_url = auth_url.replace(/CLIENT-ID/, SecretKeys.twitter.client_id);

    // build the redirect URI -- it __MUST__ match what is registered on Twitter
    var redirect_uri = REDIRECT_URI_FORMAT.replace(/APP-ID/, chrome.runtime.id);

    // add in the redirect URI
    auth_url = auth_url.replace(/REDIRECT-URI/, encodeURIComponent(redirect_uri));

    // ask the user to log into Twitter (using the OAuth URL)
    chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true},
      function(responseURL) {
        // check if the login was successful
        if (responseURL.indexOf('error_reason') == -1) {
          // the user is now logged in, so we will grab and save the access token
          var accessToken = responseURL.split('=')[1];

          // TODO: we should probably abstract out this part
          localStorage.twitterToken = accessToken;

          // login succeeded - notify the caller
          callbackSuccess(accessToken);
        } else {
          // login failed - notify the caller
          callbackFailure();
        }
    });
  },

  getUsername: function(callback) {
    Twitter.makeRequest('GET', 'users/self', function(parsedResponse) {
      callback(parsedResponse.data.username);
    });
  },

  getUserId: function(callback) {
    Twitter.makeRequest('GET', 'users/self', function(parsedResponse) {
      callback(parsedResponse.data.id);
    });
  },

  getFeed: function(callback) {
    Twitter.makeRequest('GET', 'users/self/feed', callback);
  },

  makeRequest: function(type, resource, callback) {
    // TODO: abstraction needed here
    var twitterToken = localStorage.twitterToken;

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var parsedResponse = JSON.parse(xhr.response);
      callback(parsedResponse);
    };
    xhr.open(type, 'https://api.twitter.com/' + resource + '?access_token=' + twitterToken);
    xhr.send();
  },

  logout: function(callback) {
    // TODO: abstraction needed here
    var twitterToken = localStorage.twitterToken;
    chrome.identity.removeCachedAuthToken({token: twitterToken}, function(){});
  }
};
