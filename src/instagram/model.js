// TODO: refactor
var Instagram = {
  login: function(callbackSuccess, callbackFailure) {
    // this is the format for Instagram's OAuth URL
    var AUTH_URL_FORMAT = 'https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token';

    // this is the format for the redirect URI registered on instagram
    var REDIRECT_URI_FORMAT = 'https://APP-ID.chromiumapp.org';

    // build the OAuth URL
    var auth_url = AUTH_URL_FORMAT;

    // add in the client id, given to us by Instagram
    auth_url = auth_url.replace(/CLIENT-ID/, SecretKeys.instagram.client_id);

    // build the redirect URI -- it __MUST__ match what is registered on Instagram
    var redirect_uri = REDIRECT_URI_FORMAT.replace(/APP-ID/, chrome.runtime.id);

    // add in the redirect URI
    auth_url = auth_url.replace(/REDIRECT-URI/, encodeURIComponent(redirect_uri));

    // ask the user to log into Instagram (using the OAuth URL)
    chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true},
      function(responseURL) {
        // check if the login was successful
        if (responseURL.indexOf('error_reason') == -1) {
          // the user is now logged in, so we will grab and save the access token
          var accessToken = responseURL.split('=')[1];

          // TODO: we should probably abstract out this part
          localStorage.instagramToken = accessToken;

          // login succeeded - notify the caller
          callbackSuccess(accessToken);
        } else {
          // login failed - notify the caller
          callbackFailure();
        }
    });
  },

  getUser: function(callback) {
    // get data from Instagram (the data source)
    Instagram.makeRequest('GET', 'users/self', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  getUsername: function(callback) {
    // get data from Instagram (the data source)
    Instagram.getUser(function(user) {
      callback(user.username);
    });
  },

  getUserId: function(callback) {
    // get data from Instagram (the data source)
    Instagram.getUser(function(user) {
      callback(user.id);
    });
  },

  getFeed: function(callback) {
    // get data from Instagram (the data source)
    Instagram.makeRequest('GET', 'users/self/feed', callback);
  },

  makeRequest: function(type, resource, callback) {
    // TODO: abstraction needed here
    var instagramToken = localStorage.instagramToken;

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var parsedResponse = JSON.parse(xhr.response);
      callback(parsedResponse);
    };
    xhr.open(type, 'https://api.instagram.com/v1/' + resource + '?access_token=' + instagramToken);
    xhr.send();
  },

  logout: function(callback) {
    // TODO: abstraction needed here
    var instagramToken = localStorage.instagramToken;
    chrome.identity.removeCachedAuthToken({token: instagramToken}, function(){});
  }
};
