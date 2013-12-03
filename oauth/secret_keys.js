/*
  You should fill this file with your API keys
*/

/*I got this set of Keys with my personal account by creating a test twitter app
  on https://dev.twitter.com/apps. These keys are required when we use Oauth to access twitter account.
  I am still experimenting on how to use these keys for our fabula extension.
*/

//TODO: the secret keys actually need to be secret
var SecretKeys = {
  twitter: {
    client_secret: 'AGG3mit5cWiDo87f7x0hDL2tRt8k55XhsYRMZ3XwCHg',
    client_id: 'zO6E8kLJB6DyQVoh9Jfrng'
  },
  
  facebook:{
	  client_id: '512526515510999',
	  client_secret: 'e97ee1b76ccbce0d6797223278ad54d7'
  },

  instagram: {
    client_id: '07b4ee0d5e2342628ea01a47e26a3cac',
    client_secret: '2740eb3635404471938fd92dc3b85815',
  },

  hasValidKeys: function() {
    return (this.twitter.consumerSecret != '' && this.twitter.consumerKey != '') &&
      (this.instagram.client_id != '' && this.instagram.client_secret != '');
  }
};
