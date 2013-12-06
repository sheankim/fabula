/*
  You should fill this file with your API keys
*/

/*I got this set of Keys with my personal account by creating a test twitter app
  on https://dev.twitter.com/apps. These keys are required when we use Oauth to access twitter account.
  I am still experimenting on how to use these keys for our fabula extension.
*/

//TODO: the secret keys actually need to be secret
var SecretKeys = {
  googlepls: {
    client_id: '1087500663835-t3e6vbdbcvr82rvf426s33284262obh2.apps.googleusercontent.com',
    client_secret: 'RqjiV3goeYlgGawZirn02AMS'
  },

  twitter: {
    client_id: 'zO6E8kLJB6DyQVoh9Jfrng',
    client_secret: 'AGG3mit5cWiDo87f7x0hDL2tRt8k55XhsYRMZ3XwCHg',
  },

  facebook:{
	  client_id: '550975091661750',
	  client_secret: '45922ae38a3ee67ea869ec6e22fcc1a4'
  },

  instagram: {
    client_id: '07b4ee0d5e2342628ea01a47e26a3cac',
    client_secret: '2740eb3635404471938fd92dc3b85815',
  },

  hasValidKeys: function() {
    return (this.googlepls.client_id != '' && this.googlepls.client_secret != '') &&
      (this.twitter.client_id != '' && this.twitter.client_secret != '') &&
      (this.facebook.client_id != '' && this.facebook.client_secret != '') &&
      (this.instagram.client_id != '' && this.instagram.client_secret != '');
  }
};
