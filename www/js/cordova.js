function authenticate_dropbox_with_cordova(clientId, successCallback, errorCallback, log)
{
  var dbx = new Dropbox({ clientId: clientId });
  var redirect_url = "https://www.dropbox.com/1/oauth2/redirect_receiver";
  var url = dbx.getAuthenticationUrl(redirect_url);
  log(url);
  var browser = window.open(url, "_blank", "location=yes,closebuttoncaption=Cancel");
  log(JSON.stringify(browser));
  var removed = false;

  var onEvent = function(event) {
    if (event.type == 'loadstop')
    {
      var error_label = "&error=";
      var error_index = event.url.indexOf(error_label);

      if (error_index > -1)
      {
        // Try to avoid a browser crash on browser.close().
        window.setTimeout(function() { browser.close() }, 10);
        
        error_index += error_label.length;
        errorCallback(event.url.substring(error_index));
      }
      else
      { 
        var access_token_label = "#access_token=";
        var access_token_index = event.url.indexOf(access_token_label);
        var token_type_index = event.url.indexOf("&token_type=");
        if (access_token_index > -1)
        {
          access_token_index += access_token_label.length;
          // Try to avoid a browser crash on browser.close().
          window.setTimeout(function() { browser.close() }, 10);

          var access_token = event.url.substring(access_token_index, token_type_index);
          successCallback(access_token);
        }
      }
    } 
    else if (event.type == 'exit')
    {
      if(removed)
      {
        return 
      }
      browser.removeEventListener('loadstart', onEvent);
      browser.removeEventListener('loaderror', onEvent);
      browser.removeEventListener('loadstop', onEvent);
      browser.removeEventListener('exit', onEvent);
      removed = true
    }
  }
  
  browser.addEventListener('loadstart', onEvent);
  browser.addEventListener('loaderror', onEvent);
  browser.addEventListener('loadstop', onEvent);
  browser.addEventListener('exit', onEvent)
  log("ok");
}

function register_dropbox(clientId, localStorageKey, registered, error)
{
  var access_token = localStorage.getItem(localStorageKey);
  if (access_token == null)
  {
    authenticate_dropbox_with_cordova(clientId,
      function(accessToken) {        
         localStorage.setItem(localStorageKey, accessToken);
         registered(new Dropbox({ accessToken: accessToken }));
      },
      error);
  }
  else
  {
    registered(new Dropbox({ accessToken: access_token }));
  }
}