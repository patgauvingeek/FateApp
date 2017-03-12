function fateAppSettingCtrl($scope)
{
  FateDb.dataSelectSettingHandler = function (transaction, results)
  {
    var row = results.rows.item(0);
    $scope.Name = row['name'];
    $scope.IsReadonly = row['readonly']
    $scope.$apply();
  }

  FateDb.dataSelectSettingAspectsHandler = function (transaction, results)
  {
    $scope.Aspects = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var aspect = new Object();
      aspect.id = row['id'];
      aspect.name = row['name'];
      aspect.description = row['description'];
      $scope.Aspects.push(aspect);
    }
    $scope.$apply();
  }

  FateDb.dataSelectSettingSkillsHandler = function (transaction, results)
  {
    $scope.Skills = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var skill = new Object();
      skill.id = row['id'];
      skill.name = row['name'];
      skill.description = row['description'];
      $scope.Skills.push(skill);
    }
    $scope.$apply();
  }

  FateDb.dataSelectSettingStressTracksHandler = function (transaction, results)
  {
    $scope.StressTracks = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var stressTrack = new Object();
      stressTrack.id = row['id'];
      stressTrack.name = row['name'];
      stressTrack.description = row['description'];
      $scope.StressTracks.push(stressTrack);
    }
    $scope.$apply();
  }
}

fateAppNav.controller('fateAppSettingCtrl', fateAppSettingCtrl);
