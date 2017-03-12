function sqlCompletedHandler()
{
  console.log("SQL Query Succeeded");
}

function errorHandler( transaction, error )
{
  if (error.code==1){
    // DB Table already exists
  } else {
    // Error is a human-readable string.
    console.log('Error: ' + error.message + ' (Code '+ error.code + ')');
  }
  return false;
}

function initDatabase()
{
  try
  {
    if (!window.openDatabase)
    {
      alert('Databases are not supported in this browser.');
    }
    else
    {
      var shortName = 'FateDb';
      var version = '';
      var displayName = 'Fate App Database';
      var maxSize = 1024000; //  1 mb
      FateDb = openDatabase(shortName, version, displayName, maxSize);
      createTables();
    }
  }
  catch(e)
  {
    if (e == 2)
    {
      // Version number mismatch.
      console.log("Invalid database version.");
    }
    else
    {
      console.log("Unknown error " + e + ".");
    }
    return;
  }
}

function createTables()
{
  var M = new Migrator(FateDb);
  M.setDebugLevel(Migrator.DEBUG_HIGH);
  M.migration(1, function(t)
  {
    t.executeSql("CREATE TABLE Settings " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  readonly INTEGER" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("INSERT INTO Settings (name, readonly)" +
                   "  VALUES ('Fate CORE SYSTEM', 1);", sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE AspectSettings " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  description TEXT NOT NULL," +
                 "  settingId INTEGER," +
                 "  FOREIGN KEY(settingId) REFERENCES Settings(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("INSERT INTO AspectSettings (name, description, settingId)" +
                 "  VALUES ('High Concept', 'Your high concept is a phrase that sums up what your character is about--" +
                                            "who he is and what he does. It''s an aspect, one of the first and most " +
                                            "important ones for your character.', 1)," +
                 "         ('Trouble', 'Your trouble is the answer to a simple question: what complicates your character''s " +
                                       "existance.', 1)," +
                 "         ('Your Adventure', 'Your character''s first true adventure.', 1)," +
                 "         ('Crossing Path', 'This aspect goal is to tie the group together.', 1)," +
                 "         ('Crossing Path Again', 'This aspect goal is to tie the group together.', 1);", sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE SkillSettings " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  description TEXT NOT NULL," +
                 "  settingId INTEGER," +
                 "  FOREIGN KEY(settingId) REFERENCES Settings(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("INSERT INTO SkillSettings (name, description, settingId)" +
                 "  VALUES ('Athletics', 'The Athletics skill represents your character''s general level of physical fitness, " +
                                         "whether through training, natural gifts, or genre-specific means (like magic or " +
                                         "genetic alteration). It''s how good you are at moving your body. As such, it is a " +
                                         "popular choice for nerly any action-y character.', 1)," +
                 "         ('Burglary', 'The Burglary skill covers your character''s aptitude for stealing things and getting into "+
                                        "places that are off-limits.', 1)," +
                 "         ('Contacts', 'Contacts is the skill of knowing and making connections with people. It presumes proficiency " +
                                        "with all means of networking available in the setting.', 1)," +
                 "         ('Crafts', 'Crafts is the skill of working with machinery, for good or ill.', 1)," +
                 "         ('Deceive', 'Deceive is the skill about lying to and misdirecting people.', 1)," +
                 "         ('Drive', 'The drive skill is all about operating vehicles and things that go fast.', 1)," +
                 "         ('Empathy', 'Empathy involves knowing and being able to spot changes in a person''s mood or bearing. It''s " +
                                       "basically the emotional Notice skill.', 1)," +
                 "         ('Fight', 'The Fight skill covers all forms of close-quarters combat (in other words within the same zone), " +
                                     "both unarmed and using weapons. For the ranged weapons counterpart, see Shoot.', 1)," +
                 "         ('Investigate', 'Investigate is the skill you use to find things out. It''s a counterpart to Notice" +
                                           "--whereas Notice revolves around situational alertness and surface observation, " +
                                           "Investigate revolves around concentrated effort and in-depth scrutiny.', 1)," +
                 "         ('Lore', 'The Lore skill is about knowledge and education.', 1)," +
                 "         ('Notice', 'The Notice skill involves just that--noticing things. It''s a counterpart to Investigate, " +
                                      "representing a character''s overall perception, ability to pick out details at a glance, " +
                                      "and other powers of observation. Usually, when you use Notice, it''s very quick compared " +
                                      "to Investigate, so the kinds of details you get from it are more superficial, but " +
                                      "you also don''t have to expend as much effort to find them.', 1)," +
                 "         ('Physique', 'The Physique skill is a counterpart to Athletics, representing the character''s natural " +
                                        "physical aptitudes, such as raw strength and endurance. This skill best represent the " +
                                        "strongman.', 1)," +
                 "         ('Provoke', 'Provoke is the skill about getting someone''s dander up and eliciting negative " +
                                       "emotional response from them--fear, anger, shame, etc. It''s the \"being a " +
                                       "jerk\" skill.', 1)," +
                 "         ('Rapport', 'The Rapport skill is all about making positive connections to people and eliciting " +
                                       "positive emotion. It''s the skill of being liked and trusted.', 1)," +
                 "         ('Resources', 'Resources describes your character''s general level of material wealth in the game " +
                                         "world and ability to apply it. This might not always reflect cash on hand, given the " +
                                         "different ways you can represent wealth in a particular setting--in a medival game, it " +
                                         "might be tied to land or vassals as much as gold; in the modern day, it might mean a " +
                                         "number of good line of credit.', 1)," +
                 "         ('Shoot', 'The counterpart to Fight, Shoot is the skill of using ranged weaponry, either in a conflict " +
                                     "or on targets that don''t actively resist your attempts to shoot them (like a bull''s-eye " +
                                     "or the broad side of a barn).', 1)," +
                 "         ('Stealth', 'The stealth skill allows you to avoid detection, both when hiding in place and trying to " +
                                       "move about unseen. It pairs well with the Burglary skill.', 1)," +
                 "         ('Will', 'The Will skill represents your character''s general level of mental fortitude, the same way that " +
                                    "Physique represents your physical fortitude.', 1);", sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE StressTrackSettings " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  description TEXT NOT NULL," +
                 "  settingId INTEGER," +
                 "  FOREIGN KEY(settingId) REFERENCES Settings(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("INSERT INTO StressTrackSettings (name, description, settingId)" +
                 "  VALUES ('Physical Stress (Physique)', ' The physical stress track deals with physical harm.', 1)," +
                 "         ('Mental Stress (Will)', 'The mental stress track mitigates mental harm.', 1);", sqlCompletedHandler, errorHandler);

    // Character tables
    t.executeSql("CREATE TABLE Characters " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  description TEXT," +
                 "  campaign TEXT," +
                 "  refresh INTEGER DEFAULT 3," +
                 "  player TEXT," +
                 "  imageSource TEXT" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE CharacterAspects " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  position INTEGER," +
                 "  characterId INTEGER," +
                 "  FOREIGN KEY(characterId) REFERENCES Characters(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE CharacterSkills " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  bonus INTEGER," +
                 "  characterId INTEGER," +
                 "  FOREIGN KEY(characterId) REFERENCES Characters(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE CharacterStunts " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  description TEXT NOT NULL," +
                 "  characterId INTEGER," +
                 "  FOREIGN KEY(characterId) REFERENCES Characters(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE CharacterExtras " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  description TEXT NOT NULL," +
                 "  characterId INTEGER," +
                 "  FOREIGN KEY(characterId) REFERENCES Characters(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE CharacterStressTracks " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  name TEXT NOT NULL," +
                 "  skillName TEXT NOT NULL," +
                 "  activeBoxCount INTEGER," +
                 "  checkedFlag INTEGER," +
                 "  characterId INTEGER," +
                 "  FOREIGN KEY(characterId) REFERENCES Characters(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
    t.executeSql("CREATE TABLE CharacterConsequences " +
                 "(" +
                 "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                 "  severity INTEGER," +
                 "  name TEXT NOT NULL," +
                 "  type TEXT NOT NULL," +
                 "  characterId INTEGER," +
                 "  FOREIGN KEY(characterId) REFERENCES Characters(id)" +
                 ");", [], sqlCompletedHandler, errorHandler);
  });
  M.execute();
}

function resetDatabase()
{
  FateDb.transaction(
    function (t)
    {
      t.executeSql("DROP TABLE _migrator_schema;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DELETE FROM sqlite_sequence;", [], sqlCompletedHandler, errorHandler);

      t.executeSql("DROP TABLE CharacterConsequences;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE CharacterStressTracks;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE CharacterSkills;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE CharacterStunts;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE CharacterExtras;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE CharacterAspects;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE Characters;", [], sqlCompletedHandler, errorHandler);

      t.executeSql("DROP TABLE StressTrackSettings;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE SkillSettings;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE AspectSettings;", [], sqlCompletedHandler, errorHandler);
      t.executeSql("DROP TABLE Settings;", [], sqlCompletedHandler, errorHandler);
    });
  createTables();
}

function selectSettings(t)
{
  t.executeSql("SELECT * FROM Settings;", [], FateDb.dataSelectSettingsHandler, errorHandler);
}

function selectSetting(t, id)
{
  t.executeSql("SELECT * FROM Settings WHERE id = (?);", [id], FateDb.dataSelectSettingHandler, errorHandler);
  t.executeSql("SELECT * FROM SkillSettings WHERE settingId = (?);", [id], FateDb.dataSelectSettingSkillsHandler, errorHandler);
  t.executeSql("SELECT * FROM AspectSettings WHERE settingId = (?);", [id], FateDb.dataSelectSettingAspectsHandler, errorHandler);
  t.executeSql("SELECT * FROM StressTrackSettings WHERE settingId = (?);", [id], FateDb.dataSelectSettingStressTracksHandler, errorHandler);
}

function selectCampaignOptions(t)
{
  t.executeSql("SELECT DISTINCT campaign FROM Characters;", [], FateDb.dataSelectCampaignOptionsHandler, errorHandler);
}

function selectCharacters(t)
{
  t.executeSql("SELECT * FROM Characters ORDER BY campaign, name;", [], FateDb.dataSelectCharactersHandler, errorHandler);
}

function selectCharacter(t, id)
{
  t.executeSql("SELECT * FROM Characters WHERE id = (?);", [id], FateDb.dataSelectCharacterHandler, errorHandler);
  t.executeSql("SELECT * FROM CharacterAspects WHERE characterId = (?) ORDER BY position;", [id], FateDb.dataSelectCharacterAspectsHandler, errorHandler);
  t.executeSql("SELECT * FROM CharacterSkills WHERE characterId = (?) ORDER BY bonus desc, name;", [id], FateDb.dataSelectCharacterSkillsHandler, errorHandler);
  t.executeSql("SELECT * FROM CharacterStunts WHERE characterId = (?);", [id], FateDb.dataSelectCharacterStuntsHandler, errorHandler);
  t.executeSql("SELECT * FROM CharacterExtras WHERE characterId = (?);", [id], FateDb.dataSelectCharacterExtrasHandler, errorHandler);
  t.executeSql("SELECT * FROM CharacterStressTracks WHERE characterId = (?) ORDER BY name;", [id], FateDb.dataSelectCharacterStressTracksHandler, errorHandler);
  t.executeSql("SELECT * FROM CharacterConsequences WHERE characterId = (?) ORDER BY severity;", [id], FateDb.dataSelectCharacterConsequencesHandler, errorHandler);
}

function updateStressBoxCheckedFlag(t, id, value)
{
  t.executeSql("UPDATE CharacterStressTracks SET checkedFlag = (?) WHERE id = (?);", [value, id], sqlCompletedHandler, errorHandler);
}

function updateConsequence(t, id, name)
{
  t.executeSql("UPDATE CharacterConsequences SET name = (?) WHERE id = (?);", [name, id], sqlCompletedHandler, errorHandler);
}

function addCharacter(t)
{
  t.executeSql("INSERT INTO Characters (name, description, campaign, refresh, player) VALUES (?, ?, ?, ?, ?);",
    ['', '', '', 3, ''], sqlCompletedHandler, errorHandler);
  selectCharacters(t);
}

function updateCharacterIdentification(t, id, name, campaign, player, refresh, description, imageSource)
{
  var sql = "UPDATE Characters" +
            "  SET name = (?)," +
            "      campaign = (?)," +
            "      player = (?)," +
            "      refresh = (?)," +
            "      description = (?)," +
            "      imageSource = (?)" +
            "  WHERE id = (?);"
  t.executeSql(sql, [name, campaign, player, refresh, description, imageSource, id], sqlCompletedHandler, errorHandler);
}

function deleteCharacter(t, id)
{
  t.executeSql("DELETE FROM CharacterConsequences WHERE characterId = (?)", [id], sqlCompletedHandler, errorHandler);
  t.executeSql("DELETE FROM CharacterStressTracks WHERE characterId = (?)", [id], sqlCompletedHandler, errorHandler);
  t.executeSql("DELETE FROM CharacterStunts WHERE characterId = (?)", [id], sqlCompletedHandler, errorHandler);
  t.executeSql("DELETE FROM CharacterExtras WHERE characterId = (?)", [id], sqlCompletedHandler, errorHandler);
  t.executeSql("DELETE FROM CharacterSkills WHERE characterId = (?)", [id], sqlCompletedHandler, errorHandler);
  t.executeSql("DELETE FROM CharacterAspects WHERE characterId = (?);", [id], sqlCompletedHandler, errorHandler);
  t.executeSql("DELETE FROM Characters WHERE id = (?);", [id], sqlCompletedHandler, errorHandler);
}

function addAspectToCharacter(t, name, position, characterId, done)
{
  t.executeSql("INSERT INTO CharacterAspects (name, position, characterId) VALUES (?, ?, ?);", [name, position, characterId],
   function(t,r) { done(r.insertId); }, errorHandler);
}

function updateCharacterAspectName(t, id, name)
{
  t.executeSql("UPDATE CharacterAspects SET name = (?) WHERE id = (?);", [name, id], sqlCompletedHandler, errorHandler);
}

function updateAspectPosition(t, id, position)
{
  t.executeSql("UPDATE CharacterAspects SET position = (?) WHERE id = (?);", [position, id], sqlCompletedHandler, errorHandler);
}

function deleteAspect(t, id)
{
  t.executeSql("DELETE FROM CharacterAspects WHERE id = (?);", [id], sqlCompletedHandler, errorHandler);
}

function addSkillToCharacter(t, name, bonus, characterId, done)
{
  t.executeSql("INSERT INTO CharacterSkills (name, bonus, characterId) VALUES (?, ?, ?);", [name, bonus, characterId],
   function(t,r) { done(r.insertId); }, errorHandler);
}

function updateCharacterSkill(t, id, name, bonus)
{
  t.executeSql("UPDATE CharacterSkills SET name = (?), bonus = (?) WHERE id = (?)", [name, bonus, id], sqlCompletedHandler, errorHandler);
}

function deleteCharacterSkill(t, id)
{
  t.executeSql("DELETE FROM CharacterSkills WHERE id = (?)", [id], sqlCompletedHandler, errorHandler);
}

function addExtraToCharacter(t, name, description, characterId, done)
{
  t.executeSql("INSERT INTO CharacterExtras (name, description, characterId) VALUES (?, ?, ?);", [name, description, characterId],
   function(t,r) { done(r.insertId); }, errorHandler);
}

function addStuntToCharacter(t, name, description, characterId, done)
{
  t.executeSql("INSERT INTO CharacterStunts (name, description, characterId) VALUES (?, ?, ?);", [name, description, characterId],
   function(t,r) { done(r.insertId); }, errorHandler);
}

function updateCharacterExtra(t, id, name, description)
{
  t.executeSql("UPDATE CharacterExtras SET name = (?), description = (?) WHERE id = (?)", [name, description, id], sqlCompletedHandler, errorHandler);
}

function deleteCharacterExtra(t, id)
{
  t.executeSql("DELETE FROM CharacterExtras WHERE id = (?)", [id], sqlCompletedHandler, errorHandler);
}

function updateCharacterStunt(t, id, name, description)
{
  t.executeSql("UPDATE CharacterStunts SET name = (?), description = (?) WHERE id = (?)", [name, description, id], sqlCompletedHandler, errorHandler);
}

function deleteCharacterStunt(t, id)
{
  t.executeSql("DELETE FROM CharacterStunts WHERE id = (?)", [id], sqlCompletedHandler, errorHandler);
}

function addStressTrackToCharacter(t, name, skillName, activeBoxCount, characterId, done)
{
  t.executeSql("INSERT INTO CharacterStressTracks (name, skillName, activeBoxCount, characterId) VALUES (?, ?, ?, ?);", [name, skillName, activeBoxCount, characterId],
   function(t,r) { done(r.insertId); }, errorHandler);
}

function updateStressTrack(t, id, name, skillName, activeBoxCount)
{
  t.executeSql("UPDATE CharacterStressTracks SET name = (?), skillName = (?), activeBoxCount = (?), checkedFlag = 0 WHERE id = (?);", [name, skillName, activeBoxCount, id],
   sqlCompletedHandler, errorHandler);
}

function deleteStressTrack(t, id)
{
  t.executeSql("DELETE FROM CharacterStressTracks WHERE id = (?)", [id], sqlCompletedHandler, errorHandler);
}

function addConsequenceSlotToCharacter(t, severity, name, type, characterId, done)
{
  t.executeSql("INSERT INTO CharacterConsequences (severity, name, type, characterId) VALUES (?, ?, ?, ?);", [severity, name, type, characterId],
   function(t,r) { done(r.insertId); }, errorHandler);
}

function updateConsequenceSlot(t, id, severity, type)
{
  t.executeSql("UPDATE CharacterConsequences SET severity = (?), type = (?) WHERE id = (?);", [severity, type, id],
   sqlCompletedHandler, errorHandler);
}

function updateConsequence(t, id, name)
{
  t.executeSql("UPDATE CharacterConsequences SET name = (?) WHERE id = (?);", [name, id],
   sqlCompletedHandler, errorHandler);
}

function deleteConsequenceSlot(t, id)
{
  t.executeSql("DELETE FROM CharacterConsequences WHERE id = (?)", [id], sqlCompletedHandler, errorHandler);
}

initDatabase();