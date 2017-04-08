function register_dropbox(clientId, localStorageKey, registered, error)
{
  var access_token = localStorage.getItem(localStorageKey);
  if (access_token == null)
  {
    var dbx = new Dropbox({ clientId: clientId });
    dbx.authenticateWithCordova(
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