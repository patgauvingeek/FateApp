function fateAppCharactersCtrl($scope, $uibModal, $http)
{
  $scope.addCharacter = function ()
  {
    FateDb.transaction(addCharacter);
  }

  var $ctrl = this;

  $ctrl.showImportCharacterDialog = function () {

    var dbx = new Dropbox(cDropBoxAccessTokenObject);

    dbx.filesListFolder({'path':'', recursive: true })
      .then(function(response) {

        values = function(dic)
        {
          var output = [];
          for (var item in dic)
          {
            output.push(dic[item]);
          }
          return output;
        }

        var campaigns = {};
        for (var entry of response.entries)
        {
          if (entry.path_display.endsWith(".json"))
          {
            var campaignName = entry.path_display.split("/")[1];
            var campaign = campaigns[campaignName];
            var name = entry.name.split(".")[0];
            if (campaign == undefined)
            {
              campaign = {
                name: campaignName,
                characters: []
              }
              campaigns[campaignName] = campaign;
            }
            campaign.characters.push({name: name, filename: entry.path_display});
          }
        }
        
        var modalInstance = $uibModal.open({
          animation: $ctrl.animationsEnabled,
          templateUrl: 'importCharacterDialog.html',
          controller: 'importCharacterDialogCtrl',
          controllerAs: '$ctrl',
          size: 'lg',
          appendTo: undefined,
          scope: $scope.selector,
          resolve: {
            campaigns: function()
            {
              return values(campaigns);
            }
          }
        });
    
        modalInstance.result.then(
          function (character)
          {
            console.log(character.filename);
            var dbx = new Dropbox(cDropBoxAccessTokenObject);
            dbx.filesDownload({path: character.filename})
              .then(function(data) {
                var downloadUrl = URL.createObjectURL(data.fileBlob);
                console.log(downloadUrl);
                $http({
                  method: 'GET',
                  url: downloadUrl
                }).then(function successCallback(response) {
                   console.log(response.data);
                }, function errorCallback(response) {
                  console.log(response);
                });
              })
              .catch(function(error) {
                console.error(error);
              });
          },
          function () { });
      })
      .catch(function(error) {
      });  
  };

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
