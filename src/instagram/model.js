// TODO: an actual cache impl

// default constructor
function InstagramConnection() {
  this.loggedIn = false;
  this.instagramToken = null;
  this.cache = {};
}

// alternate constructor
function InstagramConnection(savedInstagramToken) {
  if (!savedInstagramToken) {
    this.loggedIn = false;
    this.instagramToken = null;
  } else {
    this.loggedIn = true;
    this.instagramToken = savedInstagramToken;
  }
}

InstagramConnection.prototype.isLoggedIn =  function() {
  return this.loggedIn;
}

InstagramConnection.prototype.getInstagramToken =  function() {
  return this.instagramToken;
}

InstagramConnection.prototype.login = function(callbackSuccess, callbackFailure) {
  var self = this;

  // no need to log in twice
  if (this.loggedIn) {
    return;
  }

  // build the redirect URI -- it __MUST__ match what is registered on Instagram
  var redirect_uri = 'https://' + chrome.runtime.id + '.chromiumapp.org';

  // build the OAuth URL
  var auth_url = 'https://api.instagram.com/oauth/authorize/' +
    '?client_id=' + SecretKeys.instagram.client_id +
    '&redirect_uri=' + redirect_uri +
    '&scope=comments+likes+relationships' +
    '&response_type=token';

  // ask the user to log into Instagram (using the OAuth URL)
  chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true},
    function(responseURL) {
      // check if the login was successful
      if (responseURL.indexOf('error_reason') == -1) {
        // the user is now logged in, so we will grab and save the access token
        var accessToken = responseURL.split('access_token=')[1].split('&')[0];

        // update internal state
        self.instagramToken = accessToken;
        self.loggedIn = true;

        // login succeeded - notify the caller
        callbackSuccess(accessToken);
      } else {
        // login failed - notify the caller
        callbackFailure();
      }
  });
}

InstagramConnection.prototype.logout = function(callback) {
  var self = this;

  // no need to log out twice
  if (this.loggedIn) {
    chrome.identity.removeCachedAuthToken({token: self.instagramToken}, function() {
      // log out, update internal state, and notify the caller
      self.loggedIn = false;
      self.instagramToken = null;
      callback();
    });
  }
}

InstagramConnection.prototype.getUser = function(callback) {
  var self = this;

  if (this.loggedIn) {
    // get data from Instagram (the data source) and cache it
    this.makeGETRequest('users/self', function(parsedResponse) {
      self.user = parsedResponse.data;
      callback(parsedResponse.data);
    });
  } else {
    throw new Error("You must be logged in to get the current user!");
  }
}

InstagramConnection.prototype.getUsername = function(callback) {
  if (this.loggedIn) {
    // see if we can load it from the cache
    if (this.user) {
      callback(this.user.username);
    } else {
      this.getUser(function(user) {
        callback(user.username);
      });
    }
  } else {
    throw new Error("You must be logged in to get the current username!");
  }
}

InstagramConnection.prototype.getUserId = function(callback) {
  if (this.loggedIn) {
    // see if we can load it from the cache
    if (this.user) {
      callback(this.user.id);
    } else {
      this.getUser(function(user) {
        callback(user.id);
      });
    }
  } else {
    throw new Error("You must be logged in to get the current user's id!");
  }
}

InstagramConnection.prototype.getFeed = function(callback) {
  var self = this;

  if (this.loggedIn) {
    // get data from Instagram (the data source) and cache it
    this.makeGETRequest('users/self/feed', function(parsedResponse) {
      self.feed = parsedResponse.data;
      callback(parsedResponse.data);
    });
  } else {
    throw new Error("You must be logged in to get the current user's feed!");
  }
}

InstagramConnection.prototype.getFollowers = function(callback) {
  var self = this;

  if (this.loggedIn) {
    // get data from Instagram (the data source) and cache it
    // TODO: cache
    this.makeGETRequest('users/self/followed-by', function(parsedResponse) {
      self.followers = parsedResponse.data;
      callback(parsedResponse.data);
    });
  } else {
    throw new Error("You must be logged in to get the current user's followers!");
  }
}

InstagramConnection.prototype.getPendingFollowers = function(callback) {
  var self = this;

  if (this.loggedIn) {
    // get data from Instagram (the data source) and cache it
    // TODO: cache
    this.makeGETRequest('users/self/requested-by', function(parsedResponse) {
      self.pendingFollowers = parsedResponse.data;
      callback(parsedResponse.data);
    });
  } else {
    throw new Error("You must be logged in to get the current user's pending followers!");
  }
}

InstagramConnection.prototype.getRecentMedia = function(callback) {
  var self = this;

  if (this.loggedIn) {
    // get data from Instagram (the data source) and cache it
    this.makeGETRequest('users/self/media/recent', function(parsedResponse) {
      self.recentMedia = parsedResponse.data;
      callback(parsedResponse.data);
    });
  } else {
    throw new Error("You must be logged in to get the current user's recent media!");
  }
}

InstagramConnection.prototype.getMediaComments = function(mediaId, callback) {
  // get data from Instagram (the data source)
  this.makeGETRequest('media/' + mediaId + '/comments', function(parsedResponse) {
    callback(parsedResponse.data);
  });
}

// commenting on a media item is currently not possible with the Instagram API
InstagramConnection.prototype.setMediaComment = function(mediaId, comment, callback) {
  // TODO: address this
  throw new Error("This feature is currently unavailable!");
  return;

  if (this.loggedIn) {
    // get data from Instagram (the data source)
    this.makePOSTRequest('media/' + mediaId + '/comments', {text: comment},
      function(parsedResponse) {
        callback(parsedResponse.data);
    });
  } else {
    throw new Error("You must be logged in to post comments!");
  }
}

InstagramConnection.prototype.getMediaLikes = function(mediaId, callback) {
  // get data from Instagram (the data source)
  this.makeGETRequest('media/' + mediaId + '/likes', function(parsedResponse) {
    callback(parsedResponse.data);
  });
}

InstagramConnection.prototype.setMediaLike = function(mediaId, callback) {
  if (this.loggedIn) {
    // send data to Instagram (the data source)
    this.makePOSTRequest('media/' + mediaId + '/likes', null, function(parsedResponse) {
      callback();
    });
  } else {
    throw new Error("You must be logged in to like something!");
  }
}

InstagramConnection.prototype.setMediaUnlike = function(mediaId, callback) {
  if (this.loggedIn) {
    // remove data from Instagram (the data source)
    this.makeDELETERequest('media/' + mediaId + '/likes', function(parsedResponse) {
      callback();
    });
  } else {
    throw new Error("You must be logged in to unlike something!");
  }
}

// helper methods for performing HTTP requests

InstagramConnection.prototype.makeGETRequest = function(resource, callback) {
  var url = null;

  // certain types of GET requests require an access token (user must be logged in)
  if (this.loggedIn) {
    url = 'https://api.instagram.com/v1/' + resource + '?access_token=' + this.instagramToken;
  } else {
    url = 'https://api.instagram.com/v1/' + resource;
  }

  $.get(url, callback);
}

InstagramConnection.prototype.makePOSTRequest = function(resource, data, callback) {
  // all POST requests require an access token (user must be logged in)
  if (this.loggedIn) {
    var url = 'https://api.instagram.com/v1/' + resource + '?access_token=' + this.instagramToken;
    $.post(url, data, callback);
  } else {
    throw new Error("You must be logged in to make a POST request.");
  }
}

InstagramConnection.prototype.makeDELETERequest = function(resource, callback) {
  // all DELETE requests require an access token (user must be logged in)
  if (this.loggedIn) {
    var url = 'https://api.instagram.com/v1/' + resource + '?access_token=' + this.instagramToken;
    $.ajax({url: url, type: 'DELETE', success: callback});
  } else {
    throw new Error("You must be logged in to make a DELETE request.");
  }
}
