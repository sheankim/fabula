function OAuthHelper(authURL, apiURL) {
  // sanity checks
  if (!authURL) {
    throw new Error("Missing parameter: authURL (OAuth authorization URL)");
  } else if (!apiURL) {
    throw new Error("Missing parameter: apiURL (API URL)");
  }

  // required for authentication
  this.authURL = authURL;

  // required for authenticated requests
  this.apiURL = apiURL;

  // internal authorization state
  this.authorized = false;
  this.accessToken = null;
}

OAuthHelper.prototype.isAuthorized = function() {
  return this.authorized;
};

OAuthHelper.prototype.getAccessToken = function() {
  return this.accessToken;
};

OAuthHelper.prototype.performLogin = function(callback) {
  var self = this;

  // sanity check
  if (!callback) {
    throw new Error("Missing parameter: callback (of the form function(success))");
  }

  // ask the user to log into the OAuth-enabled website (using the OAuth URL)
  chrome.identity.launchWebAuthFlow({url: self.authURL, interactive: true},
    function(responseURL) {
      // check if the login was successful
      if (!responseURL || responseURL.indexOf('error_reason') != -1) {
        // login failed - notify the caller
        callback(false);
      } else {
        // the user is now logged in, so we will grab and save the access token
        var accessToken = responseURL.split('access_token=')[1].split('&')[0];

        // update internal state
        self.authorized = true;
        self.accessToken = accessToken;

        // login succeeded - notify the caller
        callback(true);
      }
  });
};

OAuthHelper.prototype.performLogout = function(callback) {
  var self = this;

  // sanity checks
  if (!callback) {
    throw new Error("Missing parameter: callback (of the form function())");
  } else if (!this.authorized) {
    throw new Error("Unable to deauthorize without prior authorization.");
  }

  // perform logout
  chrome.identity.removeCachedAuthToken({token: self.accessToken}, function() {
    // update internal state
    self.authorized = false;
    self.accessToken = null;

    // notify the caller
    callback();
  });
};

OAuthHelper.prototype.buildURL = function(resource) {
  // sanity check
  if (!resource) {
    throw new Error("Missing parameter: resource (the API endpoint)");
  }

  // build the URL for the particular API endpoint
  return this.apiURL + resource + '?access_token=' + this.accessToken;
};

OAuthHelper.prototype.get = function(resource, callback) {
  // sanity checks
  if (!callback) {
    throw new Error("Missing parameter: callback (of the form function(response))");
  } else if (!this.authorized) {
    throw new Error("Prior authorization required.");
  }

  var url = this.buildURL(resource);
  $.get(url, callback);
};

OAuthHelper.prototype.post = function(resource, callback) {
  // sanity checks
  if (!callback) {
    throw new Error("Missing parameter: callback (of the form function(response))");
  } else if (!this.authorized) {
    throw new Error("Prior authorization required.");
  }

  var url = this.buildURL(resource);
  $.post(url, callback);
};

OAuthHelper.prototype.del = function(resource, callback) {
  // sanity checks
  if (!callback) {
    throw new Error("Missing parameter: callback (of the form function(response))");
  } else if (!this.authorized) {
    throw new Error("Prior authorization required.");
  }

  var url = this.buildURL(resource);
  $.ajax({url: url, type: 'DELETE', success: callback});
};
