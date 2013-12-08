var InstagramAdapter = new Class(SocialNetworkAdapter, {
  initialize: function() {
    this.instagram = new InstagramAPI();
  },

  login: function(callback) {
    this.instagram.login(callback);
  },

  logout: function(callback) {
    this.instagram.logout(callback);
  },

  isLoggedIn: function() {
    return this.instagram.isLoggedIn();
  },

  getAccessToken: function() {
    return this.instagram.getAccessToken();
  },

  getUsername: function(callback) {
    // sanity check
    if (!callback) {
      throw new Error("Missing parameter: callback (of the form function(news))");
    }

    this.instagram.getUsername(callback);
  },

  getRawFeed: function(callback) {
    this.instagram.getFeed(callback);
  },

  getNews: function(callback) {
    // sanity check
    if (!callback) {
      throw new Error("Missing parameter: callback (of the form function(news))");
    }

    this.instagram.getFeed(function(feed) {
      var result = [];

      for (thing in feed) {
        if (thing.type == 'image') {
          var obj = {};

          obj.author = thing.user.username;

          if (thing.caption) {
            obj.caption = thing.caption.text;
          } else {
            obj.caption = 'No caption';
          }

          obj.imgURL = thing.images.standard_resolution;
          obj.comments = [];

          for (comment in thing.comments) {
            obj.comments.push({text: comment.text, author: comment.from.username});
          }

          result.push(obj);
        }
      }

      callback(result);
    });
  }
});
