 $(document).ready(function () {
 $('#twitter').click(function (e) {
 alert('redirecting to twitter signin page...');
 var textToTweet = "This is a tweet for testing purpose.";
 if (textToTweet.length > 140) {
 alert('Tweet should be less than 140 Chars');
 }
 else {
 var twtLink = 'http://twitter.com/home?status=' +encodeURIComponent(textToTweet);
 window.open(twtLink,'_blank');
 }
 });
 });
 