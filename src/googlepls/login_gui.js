// this function is an event handler
// it gets called when you click on the googlepls button
function onGoogleplsBtnClick() {
  Googlepls.login(function(accessToken) {
    alert("Yay, we're logged in! The access token is " + accessToken);

    Googlepls.getUsername(function(username) {
      alert("We've got your username!");
      alert("Your username is " + username);
    });

    Googlepls.getFeed(function(feed) {
      alert("We've got the feed!");
      alert(JSON.stringify(feed));
    });
  },
  function() {
    alert("Uh oh! Your login failed. Please try again.")
  });
}

// run this function when the document is ready
$(document).ready(function() {
  // register the event handler for when the googlepls button is clicked
  $('#googlepls').click(onGoogleplsBtnClick);
});
