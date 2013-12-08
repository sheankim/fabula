var FacebookAPI = new Class({
  initialize: function() {
    // build the redirect URI -- it __MUST__ match what is registered on Instagram
    var redirectURI = 'https://' + chrome.runtime.id + '.chromiumapp.org';

    // build the OAuth URL
    var authURL = 'https://www.facebook.com/dialog/oauth' +
    '?client_id=' + SecretKeys.facebook.client_id +
    '&redirect_uri=' + encodeURIComponent(redirectURI)+
    '&scope=manage_notifications,status_update' +
    '&response_type=token';

    var apiURL = 'https://graph.facebook.com/';

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

    // ask the user to log into Facebook (using OAuth)
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
    this.oauthHelper.get('me', function(parsedResponse) {
      callback(parsedResponse);
    });
  },

	getUsername: function(callback) {
    this.getUser(function(user) {
      callback(user.username);
    });
	},

	getEmail: function(callback) {
    this.getUser(function(user) {
      callback(user.email);
    });
	},

	getFeed: function(callback) {
    this.oauthHelper.get('me/feed', function(parsedResponse) {
      callback(parsedResponse.data);
    });
	},

	getNotifications: function(callback) {
    this.oauthHelper.get('me/notifications', function(parsedResponse) {
      callback(parsedResponse.data);
    });
	},

	getStatuses: function(callback) {
    this.oauthHelper.get('me/statuses', function(parsedResponse) {
      callback(parsedResponse.data);
    });
	},

	getEvents: function(callback) {
    this.oauthHelper.get('me/events', function(parsedResponse) {
      callback(parsedResponse.data);
    });
	},

	getTagged: function(callback) {
    this.oauthHelper.get('me/tagged', function(parsedResponse) {
      callback(parsedResponse.data);
    });
	}
});
