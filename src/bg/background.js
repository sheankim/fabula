// this is like the controller for the application
// it tells the browser which view (html file) to render inside the popup

(function() {
  var config = Settings.getInstance();
  var total = 0;

  if (config.getProperty('instagram')) {
    total += 1;
  }

  if (config.getProperty('facebook')) {
    total += 1;
  }

  // which default view to render: getting_started or fabula
  if (total == 0) {
    chrome.browserAction.setPopup({popup: 'src/browser_action/getting_started.html'});
  } else {
    chrome.browserAction.setPopup({popup: 'src/browser_action/fabula.html'});
  }
})();
