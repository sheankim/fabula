var Facebook = {
	login: function(callbackSuccess, callbackFailure){
		var AUTH_URL_FORMAT = 'https://www.facebook.com/dialog/oauth?client_id=CLIENT-ID&response_type=token&redirect_uri=REDIRECT-URI';
		
		var REDIRECT_URI_FORMAT = 'https://APP-ID.chromiumapp.org';
		
		var auth_url = AUTH_URL_FORMAT;
		
		auth_url = auth_url.replace(/CLIENT-ID/, SecretKeys.facebook.client_id);
		
		var redirect_uri = REDIRECT_URI_FORMAT.replace(/APP-ID/, chrome.runtime.id);
		
		auth_url = auth_url.replace(/REDIRECT-URI/, encodeURIComponent(redirect_uri));
		
		chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true},
			function(responseURL){
				
				if(reponseURL.indexOf('error_reason') == -1){
					
					var accessToken = reponseURL.split('=')[1];
					
					localStorage.facebookToken = accessToken;
					
					callbackSuccess(accessToken);
				} else {
					callbackFailure();
				}
			});
	},
	
	getUserName: function(callback){
		Facebook.makeRequest('GET', 'https://graph.facebook.com/me', function(parsedResponse){
			callback(parsedResponse.data.email);
		});
	},
	
	logout: function(callback){
		var facebookToken = localStorage.facebookToken;
		chrome.identity.removeCachedAuthToken({token: facebookToken}, function(){});
	}
};