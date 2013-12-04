// this function is an event handler
// it gets called when you click on the instagram button
function onInstagramBtnClick() {
  Instagram.login(function(accessToken) {
    alert("Yay, we're logged in! The access token is " + accessToken);

    Instagram.getUsername(function(username) {
      alert("We've got your username!");
      alert("Your username is " + username);
    });

    Instagram.getFeed(function(feed) {
      alert("We've got the feed!");
      alert(JSON.stringify(feed));
    });
  },
  function() {
    alert("Uh oh! Your login failed. Please try again.");
  });
}

// run this function when the document is ready
$(document).ready(function() {
  // register the event handler for when the instagram button is clicked
  $('#instagram').click(onInstagramBtnClick);
});
