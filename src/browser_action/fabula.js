var socialNetworks = [];
var newsItems = [];

function func1() {
  var config = Settings.getInstance();

  if (config.getProperty('instagram')) {
    var socialNetwork = SocialNetworkFactory.create('instagram');
    socialNetworks.push(socialNetwork);
  }

  if (config.getProperty('facebook')) {
    var socialNetwork = SocialNetworkFactory.create('facebook');
    socialNetworks.push(socialNetwork);
  }

  for (var i = 0; i < socialNetworks.length; i++) {
    var socialNetwork = socialNetworks[i];

    socialNetwork.login(function(success) {
      if (success) {
        socialNetwork.getNews(function(news) {
          for (newsItem in news) {
            newsItems.push(newsItem);
          }
        });
      }
    });
  }
}

func1();
