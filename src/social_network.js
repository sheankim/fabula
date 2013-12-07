var SocialNetwork = new Class({
  extend: {
    find: function(name) {
      if (!name) {
        throw new Error("Missing parameter: name (social network name");
      } else if (name == 'instagram') {
        return new InstagramAdapter();
      } else if (name == 'facebook') {
        return new FacebookAdapter();
      }
    }
  }
});
