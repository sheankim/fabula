var Googlepls = (function() {
  var BASE_API_PATH = 'plus/v1/';

  return {
   
    onSignInCallback: function(authResult) {
      gapi.client.load('plus','v1', function(){
        $('#authResult').html('Auth Result:<br/>');
        for (var field in authResult) {
          $('#authResult').append(' ' + field + ': ' +
              authResult[field] + '<br/>');
        }
        if (authResult['access_token']) {
          $('#authOps').show('slow');
          $('#gConnect').hide();
          Googlepls.profile();
          Googlepls.people();
        } else if (authResult['error']) {
          // There was an error, which means the user is not signed in.
          // As an example, you can handle by writing to the console:
          console.log('There was an error: ' + authResult['error']);
          $('#authResult').append('Logged out');
          $('#authOps').hide('slow');
          $('#gConnect').show();
        }
        console.log('authResult', authResult);
      });
    },


    login: function(callbackSuccess, callbackFailure) {
    // this is the format for Google+'s OAuth URL
    var AUTH_URL_FORMAT = 'https://accounts.google.com/o/oauth2/auth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token';

    // this is the format for the redirect URI registered on googlepls
    var REDIRECT_URI_FORMAT = 'https://APP-ID.chromiumapp.org';

    // build the OAuth URL
    var auth_url = AUTH_URL_FORMAT;

    // add in the client id, given to us by googlepls
    auth_url = auth_url.replace(/CLIENT-ID/, SecretKeys.googlepls.client_id);

    // build the redirect URI -- it __MUST__ match what is registered on googlepls
    var redirect_uri = REDIRECT_URI_FORMAT.replace(/APP-ID/, chrome.runtime.id);

    // add in the redirect URI
    auth_url = auth_url.replace(/REDIRECT-URI/, encodeURIComponent(redirect_uri));

    // ask the user to log into googlepls (using the OAuth URL)
    chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true},
      function(responseURL) {
        // check if the login was successful
        if (responseURL.indexOf('error_reason') == -1) {
          // the user is now logged in, so we will grab and save the access token
          var accessToken = responseURL.split('=')[1];

          // TODO: we should probably abstract out this part
          localStorage.googleplsToken = accessToken;

          // login succeeded - notify the caller
          callbackSuccess(accessToken);
        } else {
          // login failed - notify the caller
          callbackFailure();
        }
    });
  },

   
    disconnect: function() {
      $.ajax({
        type: 'GET',
        url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
            gapi.auth.getToken().access_token,
        async: false,
        contentType: 'application/json',
        dataType: 'jsonp',
        success: function(result) {
          console.log('revoke response: ' + result);
          $('#authOps').hide();
          $('#profile').empty();
          $('#visiblePeople').empty();
          $('#authResult').empty();
          $('#gConnect').show();
        },
        error: function(e) {
          console.log(e);
        }
      });
    },

  
    people: function() {
      var request = gapi.client.plus.people.list({
        'userId': 'me',
        'collection': 'visible'
      });
      request.execute(function(people) {
        $('#visiblePeople').empty();
        $('#visiblePeople').append('Number of people visible to this app: ' +
            people.totalItems + '<br/>');
        for (var personIndex in people.items) {
          person = people.items[personIndex];
          $('#visiblePeople').append('<img src="' + person.image.url + '">');
        }
      });
    },

 
    profile: function(){
      var request = gapi.client.plus.people.get( {'userId' : 'me'} );
      request.execute( function(profile) {
        $('#profile').empty();
        if (profile.error) {
          $('#profile').append(profile.error);
          return;
        }
        $('#profile').append(
            $('<p><img src=\"' + profile.image.url + '\"></p>'));
        $('#profile').append(
            $('<p>Hello ' + profile.displayName + '!<br />Tagline: ' +
            profile.tagline + '<br />About: ' + profile.aboutMe + '</p>'));
        if (profile.cover && profile.coverPhoto) {
          $('#profile').append(
              $('<p><img src=\"' + profile.cover.coverPhoto.url + '\"></p>'));
        }
      });
    }
  };
})();


function onSignInCallback(authResult) {
  Googlepls.onSignInCallback(authResult);
}

