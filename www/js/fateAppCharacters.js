function fateAppCharactersCtrl($scope)
{
  $scope.addCharacter = function ()
  {
    FateDb.transaction(addCharacter);
  }

  FateDb.dataSelectCharactersHandler = function (transaction, results)
  {
	  // Handle the results
    $scope.Campaigns = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var character = new Object();
      character.id = row['id'];
    	character.name = row['name'];
      character.imageSource = row['imageSource'];

      var campaignName = row['campaign'];
      var campaign = $scope.Campaigns
        .find(c => c.name == campaignName);
      if (!campaign)
      {
        campaign = new Object();
        campaign.name = row['campaign'];
        campaign.Characters = [];
        $scope.Campaigns.push(campaign);
      }
      campaign.Characters.push(character);
    }
    $scope.$apply();
  }
}

fateAppNav.controller('fateAppCharactersCtrl', fateAppCharactersCtrl);
