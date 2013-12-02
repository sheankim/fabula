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
    consumerSecret: 'AGG3mit5cWiDo87f7x0hDL2tRt8k55XhsYRMZ3XwCHg',
    consumerKey: 'zO6E8kLJB6DyQVoh9Jfrng'
  },

  instagram: {
    client_id: '07b4ee0d5e2342628ea01a47e26a3cac',
    client_secret: '2740eb3635404471938fd92dc3b85815',
    redirect_uri: 'https://www.example.com',
    auth_url: 'https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code'
  },

  hasValidKeys: function() {
    return (this.twitter.consumerSecret != '' && this.twitter.consumerKey != '') &&
      (this.instagram.client_id != '' && this.instagram.client_secret != '');
  }
};
