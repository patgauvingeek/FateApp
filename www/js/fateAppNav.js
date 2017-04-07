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
      case 'options':
      {
        $scope.is_associated_with_dropbox = localStorage.getItem(DROPBOX_ACCESS_TOKEN_KEY) != null;
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
  $scope.log = "";
  
  $scope.executeSql = function()
  {
    FateDb.transaction(
      function (t)
      {
        t.executeSql($scope.Sql, [], sqlCompletedHandler, errorHandler);
      });
  }
  
  $scope.forget_dropbox = function()
  {
    $scope.is_associated_with_dropbox = false;
    localStorage.removeItem(DROPBOX_ACCESS_TOKEN_KEY);
  }

  $scope.authenticate_dropbox = function()
  {
    $scope.log = "starting authentication."
    authenticate_dropbox_with_cordova(DROPBOX_APP_KEY, 
      function(accessToken) {
         localStorage.setItem(DROPBOX_ACCESS_TOKEN_KEY, accessToken);
         $scope.is_associated_with_dropbox = true;
         $scope.$apply();
      },
      function(error) 
      {
        $scope.is_associated_with_dropbox = false;
        $scope.log = error;
        $scope.$apply();
      },
      function (log)
      {
        $scope.log = log;
        $scope.$apply();
      });
  }

}]);