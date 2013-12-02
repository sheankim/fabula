function onInstagramBtnClick() {
  alert("instagram handler was called");

  var auth_url = SecretKeys.instagram.auth_url;
  auth_url = auth_url.replace(/CLIENT-ID/, SecretKeys.instagram.client_id);
  auth_url = auth_url.replace(/REDIRECT-URI/, encodeURIComponent(SecretKeys.instagram.redirect_uri));
  console.log(auth_url);
}

$(document).ready(function() {
  $('#instagram').click(onInstagramBtnClick);
});
