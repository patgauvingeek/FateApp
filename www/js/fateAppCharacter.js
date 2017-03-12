function fateAppCharacterCtrl($scope, $uibModal)
{
  var $ctrl = this;

  $ctrl.showIdentificationDialog = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: 'identificationDialog.html',
      controller: 'identificationDialogCtrl',
      controllerAs: '$ctrl',
      size: 'lg',
      appendTo: undefined,
      resolve: {
        campaignOptions: function(){
          return $scope.CampaignOptions;
        },
        name: function() {
          return $scope.Name;
        },
        campaign: function() {
          return $scope.Campaign;
        },
        player: function() {
          return $scope.Player;
        },
        refresh: function() {
          return $scope.Refresh;
        },
        description: function() {
          return $scope.Description;
        },
        imageSource: function() {
          return $scope.imageSource;
        }
      }
    });
  
    modalInstance.result.then(
      function (values)
      {        
        if (values.delete)
        {
          FateDb.transaction(function(t)
          {
            deleteCharacter(t, $scope.Id);
          });
          // navigate away...
          $scope.goto('characters');
          return;
        }

        $scope.Name = values.name;
        $scope.Campaign = values.campaign;
        $scope.Player = values.player;
        $scope.Refresh = values.refresh;
        $scope.Description = values.description;
        $scope.imageSource = values.imageSource;

        FateDb.transaction(function(t)
        {
          updateCharacterIdentification(t, $scope.Id, $scope.Name, $scope.Campaign, $scope.Player, $scope.Refresh, $scope.Description, $scope.imageSource);
        });
      },
      function () { });
  };
  
  $ctrl.showSkillDialog = function (skill) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: 'skillDialog.html',
      controller: 'skillDialogCtrl',
      controllerAs: '$ctrl',
      size: 'sm',
      appendTo: undefined,
      resolve: {
        skill: function () {
          return skill
        }
      }
    });
  
    modalInstance.result.then(
      function (newSkill)
      {        
        var oldLadderIndex = $scope.Ladder
          .findIndex(l => l.bonus == skill.bonus);
        
        if (oldLadderIndex < 0)
        {
          throw "Old ladder not found !";
        }

        var oldLadder = $scope.Ladder[oldLadderIndex];
                
        var skillOldIndex = oldLadder.Skills
          .findIndex(s => s.id == skill.id);

        if (skillOldIndex < 0)
        {
          throw "Skill old index not found !";
        }

        if (newSkill.delete)
        {
          FateDb.transaction(function(t)
          {
            deleteCharacterSkill(t, skill.id);
          });
          oldLadder.Skills.splice(skillOldIndex, 1);
          if (oldLadder.Skills.length == 0)
          {
            $scope.Ladder.splice(oldLadderIndex, 1);
          }
          return;
        }

        FateDb.transaction(function(t)
        {
          updateCharacterSkill(t, skill.id, newSkill.name, newSkill.bonus);
        });
        skill.name = newSkill.name;
        
        if (skill.bonus == newSkill.bonus)
        {
          oldLadder.Skills.sort((a, b) => a.name.localeCompare(b.name));
          return;
        }

        oldLadder.Skills.splice(skillOldIndex, 1);
        if (oldLadder.Skills.length == 0)
        {
          $scope.Ladder.splice(oldLadderIndex, 1);
        }

        skill.bonus = newSkill.bonus;

        var newLadder = $scope.Ladder
          .find(l => l.bonus == skill.bonus);
        if (!newLadder)
        {
          newLadder =
          {
            bonus: skill.bonus,
            Skills: []
          }
          $scope.Ladder.push(newLadder);
          // sort descending.
          $scope.Ladder.sort((a, b) => b.bonus - a.bonus);
        }
        newLadder.Skills.push(skill);
        newLadder.Skills.sort((a, b) => a.name.localeCompare(b.name));
      },
      function () { });
  };

  $ctrl.showExtraOrStuntDialog = function (elementType, element) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: 'extraOrStuntDialog.html',
      controller: 'extraOrStuntDialogCtrl',
      controllerAs: '$ctrl',
      size: 'lg',
      appendTo: undefined,
      resolve: {
        elementType: function()
        {
          return elementType;
        },
        element: function () {
          return element
        }
      }
    });
  
    modalInstance.result.then(
      function (result)
      { 
        var collection = $scope.Stunts;
        var deleteElement = deleteCharacterStunt;
        var updateElement = updateCharacterStunt;
        if (elementType == 'Extra')
        {
          collection = $scope.Extras;
          deleteElement = deleteCharacterExtra;
          updateElement = updateCharacterExtra;
        }
        
        if (result.delete)
        {
          FateDb.transaction(function(t)
          {
            deleteElement(t, element.id);
          });
          var elementIndex = collection
            .findIndex(e => e.id == element.id);
          collection.splice(elementIndex, 1);
          return;
        }

        FateDb.transaction(function(t)
        {
          updateElement(t, element.id, result.name, result.description);
        });
        element.name = result.name;
        element.description = result.description; 
        collection.sort((a, b) => a.name.localeCompare(b.name));
      },
      function () { });
  }

  $ctrl.showStressTrackDialog = function (stressTrack) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: 'stressTrackDialog.html',
      controller: 'stressTrackDialogCtrl',
      controllerAs: '$ctrl',
      size: 'sm',
      appendTo: undefined,
      resolve: {
        stressTrack: function()
        {
          return stressTrack;
        }
      }
    });
  
    modalInstance.result.then(
      function (result)
      { 
        if (result.delete)
        {
          FateDb.transaction(function(t)
          {
            deleteStressTrack(t, stressTrack.id);
          });
          var stressTrackIndex = $scope.StressTracks
            .findIndex(s => s.id == stressTrack.id);
          $scope.StressTracks.splice(stressTrackIndex, 1);
          return;
        }
        FateDb.transaction(function(t)
        {
          updateStressTrack(t, stressTrack.id, result.name, result.skillName, result.activeBoxCount);
        });
        stressTrack.name = result.name;
        stressTrack.skillName = result.skillName; 
        stressTrack.activeBoxCount = result.activeBoxCount;
        stressTrack.isBox1Checked = false;
        stressTrack.isBox2Checked = false;
        stressTrack.isBox3Checked = false;
        stressTrack.isBox4Checked = false;
        $scope.StressTracks.sort((a, b) => a.name.localeCompare(b.name));
      },
      function () { });
  }

  $ctrl.showConsequenceSlotDialog = function (consequence) {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      templateUrl: 'consequenceSlotDialog.html',
      controller: 'consequenceSlotDialogCtrl',
      controllerAs: '$ctrl',
      size: 'sm',
      appendTo: undefined,
      resolve: {
        consequence: function()
        {
          return consequence;
        },
        stressTrackNames: function()
        {
          var output = [];
          for (var stressTrack of $scope.StressTracks)
          {
            output.push(stressTrack.name);
          }
          return output;
        }
      }
    });
  
    modalInstance.result.then(
      function (result)
      { 
        if (result.delete)
        {
          FateDb.transaction(function(t)
          {
            deleteConsequenceSlot(t, consequence.id);
          });
          var consequenceIndex = $scope.Consequences
            .findIndex(c => c.id == consequence.id);
          $scope.Consequences.splice(consequenceIndex, 1);
          return;
        }
        FateDb.transaction(function(t)
        {
          updateConsequenceSlot(t, consequence.id, result.severity, result.type);
        });
        consequence.severity = result.severity;
        consequence.type = result.type;
        $scope.Consequences.sort((a, b) => a.severity - b.severity);
      },
      function () { });
  }

  $scope.BonusText = {
    '-2':'Terrible (-2)',
    '-1':'Poor (-1)',
     '0':'Mediocre (+0)',
     '1':'Average (+1)',
     '2':'Fair (+2)',
     '3':'Good (+3)',
     '4':'Great (+4)',
     '5':'Superb (+5)',
     '6':'Fantastic (+6)',
     '7':'Epic (+7)',
     '8':'Legendary (+8)'
  };

  $scope.getBonusText = function(bonus)
  {
    var bonusText = $scope.BonusText[bonus];
    return bonusText 
    ? bonusText 
    : bonus < 0 
      ? "HORRIBLE (" + bonus + ")"
      : "AWESOME (+" + bonus +")"
  }

  $scope.updateCharacterName = function(id, name)
  {
    FateDb.transaction(function(t)
    {
      updateCharacterName(t, id, name);
    });
  }

  $scope.updateCharacterCampaign = function(id, campaign)
  {
    FateDb.transaction(function(t)
    {
      updateCharacterCampaign(t, id, campaign);
    });
  }

  $scope.updateCharacterPlayer = function(id, player)
  {
    FateDb.transaction(function(t)
    {
      updateCharacterPlayer(t, id, player);
    });
  }

  $scope.updateCharacterRefresh = function(id, refresh)
  {
    FateDb.transaction(function(t)
    {
      updateCharacterRefresh(t, id, refresh);
    });
  }

  $scope.updateCharacterImageSource = function(id, imageSource)
  {
    FateDb.transaction(function(t)
    {
      updateCharacterImageSource(t, id, imageSource);
    });
  }
  
  $scope.updateCharacterDescription = function(id, description)
  {
    FateDb.transaction(function(t)
    {
      updateCharacterDescription(t, id, description);
    });
  }

  $scope.updateCharacterAspectName = function(id, name)
  {
    FateDb.transaction(function(t)
    {
      updateCharacterAspectName(t, id, name);
    });
  }

  $scope.addAspect = function()
  {
    var aspect = new Object(); 
    aspect.name = "";
    aspect.position = $scope.Aspects.length;
    $scope.Aspects.push(aspect);
    FateDb.transaction(function(t)
    {
      addAspectToCharacter(t, aspect.name, aspect.position, $scope.Id, function(id) { aspect.id = id; });
    });
  }

  $scope.moveAspectUp = function(aspect)
  {
    var wOrignalPosition = aspect.position;
    if (wOrignalPosition == 0)
    {
      throw "invalid command 'moveAspectUp'";
    }
    var wTargetPosition = wOrignalPosition - 1;
    var wAspectToReplace = $scope.Aspects
      .find(a => a.position == wTargetPosition);

    FateDb.transaction(function(t)
    {
      updateAspectPosition(t, aspect.id, wTargetPosition);
      updateAspectPosition(t, wAspectToReplace.id, wOrignalPosition);
    });

    $scope.Aspects.splice(wTargetPosition, 2, aspect, wAspectToReplace);
    wAspectToReplace.position = wOrignalPosition;
    aspect.position = wTargetPosition;
  }

  $scope.moveAspectDown = function(aspect)
  {
    var wOrignalPosition = aspect.position;
    if (wOrignalPosition == $scope.Aspects.length - 1)
    {
      throw "invalid command 'moveAspectDown'";
    }
    var wTargetPosition = wOrignalPosition + 1;
    var wAspectToReplace = $scope.Aspects
      .find(a => a.position == wTargetPosition);

    FateDb.transaction(function(t)
    {
      updateAspectPosition(t, aspect.id, wTargetPosition);
      updateAspectPosition(t, wAspectToReplace.id, wOrignalPosition);
    });    
      
    $scope.Aspects.splice(wOrignalPosition, 2, wAspectToReplace, aspect);
    wAspectToReplace.position = wOrignalPosition;
    aspect.position = wTargetPosition;
  }

  $scope.deleteAspect = function(aspect)
  {
    $scope.Aspects.splice(aspect.position, 1);
    FateDb.transaction(function(t)
    {
      deleteAspect(t, aspect.id);
      for(var aspectToMove of $scope.Aspects)
      {
        if (aspectToMove.position > aspect.position)
        {
          aspectToMove.position--;
          updateAspectPosition(t, aspectToMove.id, aspectToMove.position);
        }
      }      
    });
  }

  $scope.addSkill = function()
  {
    var skill = new Object();
    skill.name = "";
    skill.bonus = 1;

    var ladder = $scope.Ladder
      .find(ladder => ladder.bonus === skill.bonus);
    if (!ladder)
    {
      ladder = new Object();
      ladder.bonus = skill.bonus;
      ladder.Skills = [];
      $scope.Ladder.push(ladder);
    }
    ladder.Skills.push(skill);
    
    FateDb.transaction(function(t)
    {
      addSkillToCharacter(t, skill.name, skill.bonus, $scope.Id, function(id) { skill.id = id; });
    });
  }

  $scope.addExtra = function()
  {
    var extra = new Object();
    extra.id = -1;
    extra.name = "";
    extra.description = "";
    $scope.Extras.push(extra);
    FateDb.transaction(function(t)
    {
      addExtraToCharacter(t, extra.name, extra.description, $scope.Id, function(id) { extra.id = id; });
    });
  }

  $scope.addStunt = function()
  {
    var stunt = new Object();
    stunt.id = -1;
    stunt.name = "";
    stunt.description = "";
    $scope.Stunts.push(stunt);
    FateDb.transaction(function(t)
    {
      addStuntToCharacter(t, stunt.name, stunt.description, $scope.Id, function(id) { stunt.id = id; });
    });
  }

  $scope.addStressTrack = function()
  {      
    var stressTrack = new Object();
    stressTrack.id = -1;
    stressTrack.name = "";
    stressTrack.skillName = "";
    stressTrack.activeBoxCount = 2;

    stressTrack.isBox1Checked = false;
    stressTrack.isBox2Checked = false;
    stressTrack.isBox3Checked = false;
    stressTrack.isBox4Checked = false;

    $scope.StressTracks.push(stressTrack);

    FateDb.transaction(function(t)
    {
      addStressTrackToCharacter(t, stressTrack.name, stressTrack.skillName, stressTrack.activeBoxCount, $scope.Id, function(id) { stressTrack.id = id; });
    });
  }

  $scope.ConsequenceText = {
     '2':'Mild',
     '4':'Moderate',
     '6':'Severe'
  };

  $scope.getConsequenceText = function(c)
  {
    var consequenceText = $scope.ConsequenceText[c.severity];
    var typeText = c.type 
      ? "(" + c.type + ")"
      : "";
    return consequenceText 
      ? consequenceText + " " + typeText
      : typeText + " ";
  }

  $scope.addConsequenceSlot = function()
  {      
    var consequence = new Object();
    consequence.id = -1;
    consequence.severity = 2;
    consequence.name = "";
    consequence.type = "";
    $scope.Consequences.push(consequence);

    FateDb.transaction(function(t)
    {
      addConsequenceSlotToCharacter(t, consequence.severity, consequence.name, consequence.type, $scope.Id, function(id) { consequence.id = id; });
    });
  }

  $scope.updateConsequence = function(id, name)
  {
    FateDb.transaction(function (t)  { updateConsequence(t, id, name); });
  }

  FateDb.dataSelectCampaignOptionsHandler = function(transaction, results)
  {
    $scope.CampaignOptions = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);
      $scope.CampaignOptions.push(row['campaign']);
    }
  }

  FateDb.dataSelectCharacterHandler = function (transaction, results)
  {
    var row = results.rows.item(0);
    $scope.Id = row['id'];
    $scope.Name = row['name'];
    $scope.Description = row['description'];
    $scope.Refresh = row['refresh'];
    $scope.Campaign = row['campaign']
    $scope.Player = row['player'];
    $scope.imageSource = row['imageSource'];
    $scope.$apply();
  }

  FateDb.dataSelectCharacterAspectsHandler = function (transaction, results)
  {
    $scope.Aspects = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var aspect = new Object();
      aspect.id = row['id'];
      aspect.name = row['name'];
      aspect.position = row['position'];
      $scope.Aspects.push(aspect);
    }
    $scope.$apply();
  }

  FateDb.dataSelectCharacterSkillsHandler = function (transaction, results)
  {
    var ladderDictionary = [];
    $scope.Ladder = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var skill = new Object();
      skill.id = row['id'];
      skill.name = row['name'];
      skill.bonus = row['bonus'];

      var ladder = ladderDictionary[skill.bonus];
      if (!ladder)
      {
        ladder = new Object();
        ladder.bonus = skill.bonus;
        ladder.Skills = [];
        $scope.Ladder.push(ladder);
        ladderDictionary[skill.bonus] = ladder;
      }
      ladder.Skills.push(skill);
    }
    $scope.$apply();
  }

  FateDb.dataSelectCharacterExtrasHandler = function (transaction, results)
  {
    $scope.Extras = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var extra = new Object();
      extra.id = row['id'];
      extra.name = row['name'];
      extra.description = row['description'];

      $scope.Extras.push(extra);
    }
    $scope.$apply();
  }

  FateDb.dataSelectCharacterStuntsHandler = function (transaction, results)
  {
    $scope.Stunts = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var stunt = new Object();
      stunt.id = row['id'];
      stunt.name = row['name'];
      stunt.description = row['description'];

      $scope.Stunts.push(stunt);
    }
    $scope.$apply();
  }

  FateDb.dataSelectCharacterStressTracksHandler = function (transaction, results)
  {
    $scope.StressTracks = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var stressTrack = new Object();
      stressTrack.id = row['id'];
      stressTrack.name = row['name'];
      stressTrack.skillName = row['skillName'];
      stressTrack.activeBoxCount = row['activeBoxCount'];

      var checkedFlag = row['checkedFlag'];
      stressTrack.isBox1Checked = (checkedFlag & 1) != 0;
      stressTrack.isBox2Checked = (checkedFlag & 2) != 0;
      stressTrack.isBox3Checked = (checkedFlag & 4) != 0;
      stressTrack.isBox4Checked = (checkedFlag & 8) != 0;

      stressTrack.update = function ()
      {
        var value = 0;
        value += this.isBox1Checked ? 1 : 0;
        value += this.isBox2Checked ? 2 : 0;
        value += this.isBox3Checked ? 4 : 0;
        value += this.isBox4Checked ? 8 : 0;
        var id = this.id;
        FateDb.transaction(function (t)  { updateStressBoxCheckedFlag(t, id, value); });
      }

      $scope.StressTracks.push(stressTrack);
    }
    $scope.$apply();
  }

  FateDb.dataSelectCharacterConsequencesHandler = function (transaction, results)
  {
    $scope.Consequences = [];
    for (var i = 0; i < results.rows.length; i++)
    {
      var row = results.rows.item(i);

      var consequence = new Object();
      consequence.id = row['id'];
      consequence.severity = row['severity'];
      consequence.name = row['name'];
      consequence.type = row['type'];
      $scope.Consequences.push(consequence);
    }
    $scope.$apply();
  }

  $scope.exportCharacter = function()
  {
    selectMany = function(collection, selector)
    {
      var output = [];
      for (var item of collection)
      {
        var subCollection = selector(item);
        for (var subItem of subCollection)
        {
          output.push(subItem);
        }
      }
      return output;
    }

    var character =
    {
      id: $scope.Id,
      name: $scope.Name,
      campaign: $scope.Campaign,
      player: $scope.Player,
      description: $scope.Description,
      imageSource: $scope.imageSource,
      refresh: $scope.Refresh,
      aspects: $scope.Aspects,
      skills: selectMany($scope.Ladder, l => l.Skills),
      extras: $scope.Extras,
      stunts: $scope.Stunts,
      stressTracks: $scope.StressTracks,
      consequences: $scope.Consequences
    }
    var str = JSON.stringify(character);

    //Save the file contents as a DataURI
    var dataUri = 'data:application/json_download;charset=utf-8,'+ encodeURIComponent(str);

    var downloadLink = document.createElement("a");
    downloadLink.href = dataUri;
    downloadLink.download = $scope.Name + ".fc";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

}

fateAppNav.controller('fateAppCharacterCtrl', fateAppCharacterCtrl);