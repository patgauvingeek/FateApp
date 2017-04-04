var fateAppNav = angular.module("fateAppNav", ["ui.bootstrap"]);

fateAppNav.controller('fateAppNavCtrl',
['$scope', '$location', function ($scope, $location)
{
  $scope.goto = function(page)
  {
    $scope.page = page;
    switch (page)
    {
      case 'settings':
      {
        FateDb.transaction(function (t)  { selectSettings(t); });
      } break;
      case 'characters':
      {
        FateDb.transaction(function (t)  { selectCharacters(t) });
      } break;
    }
  }

  $scope.goto('characters');

  $scope.gotoItem = function (page, id)
  {
    $scope.page = page;
    $scope.id = id;
    switch (page)
    {
      case 'setting':
      {
        FateDb.transaction(function (t)  { selectSetting(t, id); });
      } break;
      case 'character':
      {
        FateDb.transaction(function (t)  {
           selectCampaignOptions(t);
           selectCharacter(t, id); 
        });
      } break;
    }
  }

  $scope.navClass = function (page)
  {
    return $scope.page == page
      ? 'active'
      : '';
  };

  $scope.resetDatabase = function()
  {
    resetDatabase();
  }

  $scope.Sql = "";
  
  $scope.executeSql = function()
  {
    FateDb.transaction(
      function (t)
      {
        t.executeSql($scope.Sql, [], sqlCompletedHandler, errorHandler);
      });
  }
  
  var dbx = new Dropbox({ clientId: 'usarv8nul4pzua8' });
  $scope.log = window.location.href;
  $scope.authenticateWithDropboxUrl = dbx.getAuthenticationUrl('https://www.dropbox.com/1/oauth2/redirect_receiver');

}]);