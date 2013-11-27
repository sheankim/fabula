/*
  You should fill this file with your API keys
*/

/*I got this set of Keys with my personal account by creating a test twitter app 
  on https://dev.twitter.com/apps. These keys are required when we use Oauth to access twitter account.
  I am still experimenting on how to use these keys for our fabula extension.
*/
var SecretKeys = {
  twitter: {
    consumerSecret: 'AGG3mit5cWiDo87f7x0hDL2tRt8k55XhsYRMZ3XwCHg',
    consumerKey: 'zO6E8kLJB6DyQVoh9Jfrng'
  },

  hasValidKeys: function() {
    return (this.twitter.consumerSecret != '' && this.twitter.consumerKey != '');          
  }
};