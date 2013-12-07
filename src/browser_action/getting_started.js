// Instagram button event handler
function onInstagramBtnClick() {
  var config = Settings.getInstance();
  var instagram = new InstagramAPI();

  instagram.login(function(success) {
    if (!success) {
      alert("Uh oh! Your login failed. Please try again.");
      onInstagramBtnClick();
    } else {
      config.setProperty('instagram', true);
    }
  });
}

// Facebook button event handler
function onFacebookBtnClick() {
  var config = Settings.getInstance();
  var facebook = new FacebookAPI();

  facebook.login(function(success) {
    if (!success) {
      alert("Uh oh! Your login failed. Please try again.");
      onFacebookBtnClick();
    } else {
      config.setProperty('facebook', true);
    }
  });
}

// register the event handlers when the document finishes loading
$(document).ready(function() {
  $('#instagram').click(onInstagramBtnClick);
  $('#facebook').click(onFacebookBtnClick);
});
