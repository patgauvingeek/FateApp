
fateAppNav.controller('importCharacterDialogCtrl', function ($uibModalInstance, campaigns) {
  var $ctrl = this;

  $ctrl.Campaigns = campaigns;
  
  $ctrl.import = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

fateAppNav.controller('identificationDialogCtrl', function ($uibModalInstance, campaignOptions, name, campaign, player, refresh, description, imageSource) {
  var $ctrl = this;
  
  $ctrl.campaignOptions = campaignOptions;
  $ctrl.name = name;
  $ctrl.campaign = campaign;
  $ctrl.player = player;
  $ctrl.refresh = refresh;
  $ctrl.description = description;
  $ctrl.imageSource = imageSource;
  
  $ctrl.ok = function () {
    var item = {
      name: $ctrl.name,
      campaign: $ctrl.campaign,
      player: $ctrl.player,
      refresh: $ctrl.refresh,
      description: $ctrl.description,
      imageSource: $ctrl.imageSource,
      delete: false
    };
    $uibModalInstance.close(item);
  };

  $ctrl.delete = function () {
    $uibModalInstance.close({delete: true});
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

fateAppNav.controller('aspectDialogCtrl', function ($uibModalInstance, deleteEnabled, clearEnabled, elementType, aspectName) {
  var $ctrl = this;

  $ctrl.deleteEnabled = deleteEnabled;
  $ctrl.clearEnabled = clearEnabled;
  $ctrl.elementType = elementType;
  $ctrl.aspectName = aspectName;
  
  $ctrl.ok = function () {
    $uibModalInstance.close({aspectName:$ctrl.aspectName, delete: false});
  };

  $ctrl.clear = function () {
    $uibModalInstance.close({aspectName:"", delete: false});
  };

  $ctrl.delete = function () {
    $uibModalInstance.close({delete: true});
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

fateAppNav.controller('skillDialogCtrl', function ($uibModalInstance, skill) {
  var $ctrl = this;

  $ctrl.defaultSkills = ["Athletics", "Burglary", "Contacts", "Crafts", "Deceive", "Drive", 
                          "Empathy", "Fight", "Investigate", "Lore", "Notice", "Physique", 
                          "Provoke", "Rapport", "Resources", "Shoot", "Stealth", "Will"];
  
  $ctrl.skillName = skill.name;
  $ctrl.skillBonus = skill.bonus;
  
  $ctrl.ok = function () {
    $uibModalInstance.close({name:$ctrl.skillName, bonus:$ctrl.skillBonus, delete: false});
  };

  $ctrl.delete = function () {
    $uibModalInstance.close({delete: true});
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

fateAppNav.controller('extraOrStuntDialogCtrl', function ($uibModalInstance, elementType, element) {
  var $ctrl = this;

  $ctrl.elementType = elementType;
  $ctrl.name = element.name;
  $ctrl.description = element.description;
  
  $ctrl.ok = function () {
    $uibModalInstance.close({name:$ctrl.name, description:$ctrl.description, delete: false});
  };

  $ctrl.delete = function () {
    $uibModalInstance.close({delete: true});
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

fateAppNav.controller('stressTrackDialogCtrl', function ($uibModalInstance, stressTrack) {
  var $ctrl = this;

  $ctrl.defaultSkills = ["Athletics", "Burglary", "Contacts", "Crafts", "Deceive", "Drive", 
                          "Empathy", "Fight", "Investigate", "Lore", "Notice", "Physique", 
                          "Provoke", "Rapport", "Resources", "Shoot", "Stealth", "Will"];
  
  $ctrl.name = stressTrack.name;
  $ctrl.skillName = stressTrack.skillName;
  $ctrl.activeBoxCount = stressTrack.activeBoxCount;

  $ctrl.ok = function () {
    $uibModalInstance.close({name:$ctrl.name, skillName:$ctrl.skillName, activeBoxCount:$ctrl.activeBoxCount, delete: false});
  };

  $ctrl.delete = function () {
    $uibModalInstance.close({delete: true});
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

fateAppNav.controller('consequenceSlotDialogCtrl', function ($uibModalInstance, consequence, stressTrackNames) {
  var $ctrl = this;

  $ctrl.stressTrackNames = stressTrackNames;
  
  $ctrl.severity = consequence.severity;
  $ctrl.type = consequence.type;
  
  $ctrl.ok = function () {
    $uibModalInstance.close({severity:$ctrl.severity, type:$ctrl.type, delete: false});
  };

  $ctrl.delete = function () {
    $uibModalInstance.close({delete: true});
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});