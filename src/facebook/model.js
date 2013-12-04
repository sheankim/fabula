function FacebookConnection(){
	this.loggedIn = false;
	this.facebookToken = null;
	this.cache = {};
}

function FacebookConnection(savedFacebookToken){
	if(!savedFacebookToken){
		this.loggedIn = false;
		this.facebookToken = null;
	}else{
		this.loggedIn = true;
		this.facebookToken = savedFacebookToken;
	}
}

FacebookConnection.prototype.isLoggedIn = function(){
	return this.loggedIn;
}

FacebookConnection.prototype.getFacebookToken = function(){
	var self = this;
	if (this.loggedIn){
		return;
	}
	
	var redirect_uri 'https://' + chrome.runtime.id + '.chromiumapp.org';
	
	var auth_url = 'https://www.facebook.com/dialog/oauth?'+'
		client_id='+SecretKeys.facebook.client_id+
		'&response_type=token&redirect_uri='+redirect_uri+'&scope=manage_notifications,status_update';
		
	    chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true},
	      function(responseURL) {
	        // check if the login was successful
	        if(responseURL.indexOf('error_reason') == -1) {
	          // the user is now logged in, so we will grab and save the access token
	          var accessToken = responseURL.split('access_token=')[1].split('&')[0];

	          // TODO: we should probably abstract out this part
	          self.facebookToken = accessToken;
			  self.loggedIn = true;
	          // login succeeded - notify the caller
	          callbackSuccess(accessToken);
	        } else {
	          // login failed - notify the caller
	          callbackFailure();
	        }
	    });
	  }
}

FacebookConnection.prototype.logout = function(callback){
	var self = this;
	
	if (this.loggedIn){
		chrome.identity.removeCachedAuthToken({token: self.facebookToken}, function(){
			self.loggedIn = false;
			self.facebookToken = null;
			callback();
		});
	}
}

FacebookConnection.prototype.getUser = function(callback){
	var self = this;
	if(this.loggedIn){
		this.makeGETRequest('me', function(parsedResponse){
			self.user = parsedResponse.data;
			callback(parsedResponse.data);
		});
	} else {
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.getUsername = function(callback){
	if (this.loggedIn){
		if(this.user){
			callback(this.user.username);
		}else{
			this.getUser(function(user){
				callback(user.username);
			});
		}
	}else{
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.getEmail = function(callback){
	if (this.loggedIn){
		if(this.user){
			callback(this.user.id);
		}else {
			this.getUser(function(user){
				callback(user.id);
			});
		}
	}else {
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.getFeed = function(callback){
	var self = this;
	
	if(this.loggedIn){
		this.makeGETRequest('me/feed', function(parsedResponse){
			self.feed = parsedResponse.data;
			callback(parsedResponse.data);
		});
	} else{
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.getNotifications = function(callback){
	var self = this;
	
	if(this.loggedIn){
		this.makeGETRequest('me/notifications', function(parsedResponse){
			self.notifications = parsedResponse.data;
			callback(parsedResponse.data);
		});
	} else{
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.getStatuses = function(callback){
	var self = this;
	
	if(this.loggedIn){
		this.makeGETRequest('me/statuses', function(parsedResponse){
			self.statuses = parsedResponse.data;
			callback(parsedResponse.data);
		});
	} else{
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.getEvents = function(callback){
	var self = this;
	
	if(this.loggedIn){
		this.makeGETRequest('me/events', function(parsedResponse){
			self.events = parsedResponse.data;
			callback(parsedResponse.data);
		});
	} else{
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.getTagged = function(callback){
	var self = this;
	
	if(this.loggedIn){
		this.makeGETRequest('me/tagged', function(parsedResponse){
			self.tagged = parsedResponse.data;
			callback(parsedResponse.data);
		});
	} else{
		throw new Error("You must be logged in");
	}
}

FacebookConnection.prototype.makeGETRequest = function(resource, callback){
	var url = null;
	if(this.loggedIn){
		url = 'https://graph.facebook.com/'+resource+'?access_token=' + this.facebookToken;
	}
	else{
		url = 'https://graph.facebook.com/'+resource;
	}
	
	$.get(url, callback);
}

<<<<<<< HEAD
FacebookConnection.prototype.makePOSTRequest = function(resource, data, callback){
	if(this.loggedIn){
		var url = "https://graph.facebook.com/" + resource + '?access_token=' + this.facebookToken;
		$.post(url, data, callback);
	} else {
		throw new Error("You must be logged in to make a POST request.");
	}
}
=======
  logout: function(callback) {
    // TODO: abstraction needed here
    var facebookToken = localStorage.facebookToken;

    if (facebookToken) {
      chrome.identity.removeCachedAuthToken({token: facebookToken}, function() {
        localStorage.facebookToken = null;
      });
    }
  }
};
>>>>>>> 337c4c35a1655f4154d5795a93a3744c069d7fd6
