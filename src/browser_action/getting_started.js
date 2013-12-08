function displayInformation(socialNetwork) {
    alert("Yay we're logged in! the access token is " + socialNetwork.getAccessToken());

    socialNetwork.getUsername(function(username) {
      alert("We've got your username!");
      alert("Your username is " + username);
    });

    socialNetwork.getRawFeed(function(rawFeed) {
      alert("We've got your feed!");
      alert(JSON.stringify(rawFeed));
    });
}

// Instagram button event handler
function onInstagramBtnClick() {
  var config = Settings.getInstance();
  var instagram = SocialNetworkFactory.create('instagram');

  instagram.login(function(success) {
    if (!success) {
      alert("Uh oh! Your login failed. Please try logging into Instagram again.");
      onInstagramBtnClick();
    } else {
      config.setProperty('instagram', true);

      // show some info to the user
      displayInformation(instagram);
    }
  });
}

// Facebook button event handler
function onFacebookBtnClick() {
  var config = Settings.getInstance();
  var facebook = SocialNetworkFactory.create('facebook');

  facebook.login(function(success) {
    if (!success) {
      alert("Uh oh! Your login failed. Please try logging into Facebook again.");
      onFacebookBtnClick();
    } else {
      config.setProperty('facebook', true);

      // show some info to the user
      displayInformation(facebook);
    }
  });
}

// register the event handlers when the document finishes loading
$(document).ready(function() {
  $('#instagram').click(onInstagramBtnClick);
  $('#facebook').click(onFacebookBtnClick);
});
