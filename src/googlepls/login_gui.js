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
  $('#disconnect').click(helper.disconnect);
  $('#loaderror').hide();
  if ($('[data-clientid="YOUR_CLIENT_ID"]').length > 0) {
    alert('This sample requires your OAuth credentials (client ID) ' +
        'from the Google APIs console:\n' +
        '    https://code.google.com/apis/console/#:access\n\n' +
        'Find and replace YOUR_CLIENT_ID with your client ID.'
    );
  }
});

