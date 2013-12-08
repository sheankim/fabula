var InstagramAPI = new Class({
  initialize: function() {
    // build the redirect URI -- it __MUST__ match what is registered on Instagram
    var redirectURI = 'https://' + chrome.runtime.id + '.chromiumapp.org';

    // build the OAuth URL
    var authURL = 'https://api.instagram.com/oauth/authorize/' +
      '?client_id=' + SecretKeys.instagram.client_id +
      '&redirect_uri=' + encodeURIComponent(redirectURI) +
      '&scope=comments+likes+relationships' +
      '&response_type=token';

    var apiURL = 'https://api.instagram.com/v1/';

    this.oauthHelper = new OAuthHelper(authURL, apiURL);
  },

  isLoggedIn: function() {
    return this.oauthHelper.isAuthorized();
  },

  getAccessToken: function() {
    if (!this.isLoggedIn()) {
      throw new Error("Must be logged in to get the access token");
    }
    return this.oauthHelper.getAccessToken();
  },

  login: function(callback) {
    // no need to log in twice
    if (this.isLoggedIn()) {
      return;
    }

    // ask the user to log into Instagram (using OAuth)
    this.oauthHelper.performLogin(callback);
  },

  logout: function(callback) {
    // no need to log out twice
    if (!this.isLoggedIn()) {
      return;
    }

    this.oauthHelper.performLogout(callback);
  },

  getUser: function(callback) {
    this.oauthHelper.get('users/self', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  getUsername: function(callback) {
    this.getUser(function(user) {
      callback(user.username);
    });
  },

  getUserId: function(callback) {
    this.getUser(function(user) {
      callback(user.id);
    });
  },

  getFeed: function(callback) {
    this.oauthHelper.get('users/self/feed', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  getFollowers: function(callback) {
    this.oauthHelper.get('users/self/followed-by', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  getPendingFollowers: function(callback) {
    this.oauthHelper.get('users/self/requested-by', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  getRecentMedia: function(callback) {
    this.oauthHelper.get('users/self/media/recent', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  getMediaComments: function(mediaId, callback) {
    this.oauthHelper.get('media/' + mediaId + '/comments', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  // commenting on a media item is currently not possible with the Instagram API
  setMediaComment: function(mediaId, comment, callback) {
    throw new Error("This feature is currently unavailable!");

    this.oauthHelper.post('media/' + mediaId + '/comments', {text: comment},
      function(parsedResponse) {
        callback(parsedResponse.data);
    });
  },

  getMediaLikes: function(mediaId, callback) {
    this.oauthHelper.get('media/' + mediaId + '/likes', function(parsedResponse) {
      callback(parsedResponse.data);
    });
  },

  setMediaLike: function(mediaId, callback) {
    this.oauthHelper.post('media/' + mediaId + '/likes', null, function(parsedResponse) {
      callback();
    });
  },

  setMediaUnlike: function(mediaId, callback) {
    this.oauthHelper.del('media/' + mediaId + '/likes', function(parsedResponse) {
      callback();
    });
  }
});
