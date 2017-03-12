function fateAppSettingsCtrl($scope)
{
  FateDb.dataSelectSettingsHandler = function (transaction, results)
  {
    $scope.Settings = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var setting = new Object();
      setting.id = row['id'];
      setting.name = row['name'];
      $scope.Settings.push(setting);
    }
    $scope.$apply();
  }
}

fateAppNav.controller('fateAppSettingsCtrl', fateAppSettingsCtrl);
