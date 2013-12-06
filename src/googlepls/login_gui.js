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
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://plus.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  });
}


// run this function when the document is ready
$(document).ready(function() {
// register the event handler for when the googlepls button is clicked
  $('#googlepls').click(onGoogleplsBtnClick);
  $('#disconnect').click(Googlepls.disconnect);
  $('#loaderror').hide();
  
});

