// think of this as an "interface"
var SocialNetworkAdapter = new Class({
  initialize: function() { throw new Error(); },

  login: function(callback) { throw new Error(); },
  logout: function(callback) { throw new Error(); },
  isLoggedIn: function() { throw new Error(); },
  getAccessToken: function() { throw new Error(); },

  getUsername: function(callback) { throw new Error(); },
  getRawFeed: function(callback) { throw new Error(); },

  getNews: function() { throw new Error(); }
});
