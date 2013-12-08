var FacebookAdapter = new Class(SocialNetworkAdapter, {
  initialize: function() {
    this.facebook = new FacebookAPI();
  },

  login: function(callback) {
    this.facebook.login(callback);
  },

  logout: function(callback) {
    this.facebook.logout(callback);
  },

  isLoggedIn: function() {
    return this.facebook.isLoggedIn();
  },

  getAccessToken: function() {
    return this.facebook.getAccessToken();
  },

  getUsername: function(callback) {
    // sanity check
    if (!callback) {
      throw new Error("Missing parameter: callback (of the form function(news))");
    }

    this.facebook.getUsername(callback);
  },

  getRawFeed: function(callback) {
    this.facebook.getFeed(callback);
  },

  getNews: function(callback) {
    // sanity check
    if (!callback) {
      throw new Error("Missing parameter: callback (of the form function(news))");
    }

    var self = this;

    this.facebook.getFeed(function(feed) {
      var result = [];

      for (thing in feed) {
        if (thing.type == 'photo') {
          var obj = {};

          obj.author = self.facebook.getUsername();

          if (thing.message) {
            obj.caption = thing.message;
          } else {
            obj.caption = 'No caption'
          }

          obj.imgURL = thing.picture;

          if (obj.imgURL.indexOf('_s.')) {
            obj.imgURL = obj.imgURL.replace('_s.', '_n.');
          }

          obj.comments = [];
          result.push(obj);
        }
      }

      callback(result);
    });
  }
});
