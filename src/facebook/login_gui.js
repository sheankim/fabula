function onFacebookBtnClick() {
	Facebook.login(function(accessToken){
		alert("Yay, we're logged in! The access token is " + accessToken);
		
		Facebook.getUsername(function(username){
			alert("We've got your username!");
			alert("Your username is " + username);
			console.log("Hello World!" + username);
		});
	},
	function(){
		alert("Uh oh! Your login failed. Please try again.")
	});
}

$(document).ready(function(){
	console.log("This is a test");
	$('#facebook').click(onFacebookBtnClick);
});