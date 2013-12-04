// this function is an event handler
// it gets called when you click on the instagram button
function onFacebookBtnClick() {
	var facebook = new FacebookConnection();
	
	facebook.login(function(accessToken){
		localStorage.facebookToken = accessToken;
		alert("Yay we're logged in! the access token is " + accessToken);
	
		facebook.getUsername(function(username){
			alert("Your username is " + username);
		});
	});
	
	facebook.getFeed(function(feed){
		alert("We've got the feed");
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
  $('#facebook').click(onFacebookBtnClick);
});
