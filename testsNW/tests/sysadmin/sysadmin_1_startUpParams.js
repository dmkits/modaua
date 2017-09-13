var fs = require('fs');
var moment = require('moment');

function deleteTestBackupDataFile() {

    fs.unlink('./backups/test_DB_data.sql', function (err) {
        if (err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info('File "test_DB_data.sql" removed');
        }
    });
}
//var now=moment().format("YYYYMMDD_HHm");
module.exports = {
    // '@disabled': true,
    before: function (browser) {
        fs.createReadStream('./uiTest.cfg').pipe(fs.createWriteStream('./test_temp_copy.cfg'));
    },

    after: function (browser) {
        deleteTestBackupDataFile();
    },

    'Open  browser': function (browser) {

        var sysadminHeader = browser.page.sysadminHeader();
        sysadminHeader
            .navigate();
    },

    'step_0.1 Login and Enter test params': function (browser) {
        var loginPage = browser.page.loginPage();
        loginPage.loginAsAdmin();
        var sysadminHeader = browser.page.sysadminHeader();
        sysadminHeader
            .click('@serverConfigBtn');
        var serverConfig = browser.page.serverConfig();
        serverConfig.setInitialDBConfig();
        sysadminHeader.click("@logoutBtn");
    },

    'step_1 Sysadmin Header If  All Elements Visible Tests': function (browser) {
        var loginPage = browser.page.loginPage();
        loginPage.loginAsAdmin();

        var sysadminHeader = browser.page.sysadminHeader();
        sysadminHeader
            .waitForElementVisible("@img")
            .assert.visible("@img")
            //.assert.title('MODA.UA')
            .assert.containsText('@user', "USER:admin")
            .assert.containsText('@mode', "MODE:uiTest")
            .assert.containsText('@port', "PORT:8181")
            .assert.containsText('@dbName', "DB NAME:modaua_uiTtest1")
            .assert.containsText('@dbUser', "DB USER:user")
            .assert.containsText('@dbConnectionState', 'DB CONNECTION STATE:')
            .assert.visible('@serverConfigBtn')
            .assert.visible('@btnDatabase')
            .assert.visible('@logoutBtn')
            .click('@serverConfigBtn')
            .assert.attributeContains('@serverConfigBtn', 'aria-pressed', 'true');
    },
    'step_2 Check initial DB Config Tests': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible('@dbHostLabel')
            .assert.containsText('@dbHostLabel', 'db.host')
            .waitForElementVisible('@dbNameLabel')
            .assert.containsText('@dbNameLabel', 'db.name')
            .waitForElementVisible('@dbUserLabel')
            .assert.containsText('@dbUserLabel', 'db.user')
            .waitForElementVisible('@dbPasswordLabel')
            .assert.containsText('@dbPasswordLabel', 'db.password')
            .waitForElementVisible('@configNamedLabel')
            .assert.containsText('@configNamedLabel', 'configName')
            .waitForElementVisible('@backupScheduleLabel')
            .assert.containsText('@backupScheduleLabel', 'backupSchedule');

        serverConfig.expect.element('@dbHostInput').to.have.attribute('value').which.equal('localhost');
        serverConfig.expect.element('@dbNameInput').to.have.attribute('value').which.equal('modaua_uiTtest1');
        serverConfig.expect.element('@dbUserInput').to.have.attribute('value').which.equal('user');
        serverConfig.expect.element('@dbPasswordInput').to.have.attribute('value').which.equal('user');
        serverConfig.expect.element('@configNameInput').to.have.attribute('value').which.equal('config.json');
        serverConfig.expect.element('@backupScheduleInput').to.have.attribute('value').which.equal('0 0 1 * * * ');

        serverConfig
            .waitForElementVisible('@localConfigInfo')
            .assert.containsText('@localConfigInfo', "Configuration loaded.")
            .click('@loadSettingsBtn')
            .assert.containsText('@localConfigInfo', "Configuration reloaded.")
            .waitForElementVisible('@dbHostInput')
    },
    'step_3 drop DB': function (browser) {
        var sysadminHeader = browser.page.sysadminHeader();
        sysadminHeader
            .click('@serverConfigBtn')
            .assert.attributeContains('@serverConfigBtn', 'aria-pressed', 'true');
        var serverConfig = browser.page.serverConfig();
        serverConfig.dropDB();
    },

    'step_4 Sysadmin Header when BD dropped Tests': function (browser) {
        var sysadminHeader = browser.page.sysadminHeader();
        sysadminHeader
            .waitForElementVisible("@img")
            .assert.visible("@img")
            //.assert.title('MODA.UA')
            .assert.containsText('@user', "USER:admin")
            .assert.containsText('@mode', "MODE:uiTest")
            .assert.containsText('@port', "PORT:8181")
            .assert.containsText('@dbName', "DB NAME:modaua_uiTtest1")
            .assert.containsText('@dbUser', "DB USER:user")
            .assert.containsText('@dbConnectionState', 'DB CONNECTION STATE:Failed')
            .assert.containsText('@dbValidateState', '')
    },

    'step_5 Enter INVALID DB Config values Tests': function (browser) {

        var serverConfig = browser.page.serverConfig();
        var sysadminHeader = browser.page.sysadminHeader();

        sysadminHeader
            .waitForElementVisible('@serverConfigBtn')
            .click("@serverConfigBtn");

        serverConfig
            .waitForElementVisible('@dbHostInput')
            .clearValue('@dbHostInput')
            .setValue('@dbHostInput', '192.168.0.93_false')
            .click('@StoreAndReconnectBtn')
            .waitForElementVisible('@localConfigInfo')
            .assert.containsText('@localConfigInfo', "Configuration sav");
        browser.pause(1000);
        serverConfig
            .assert.containsText('@localConfigInfo', "Failed to connect to database!");

        sysadminHeader.waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        serverConfig
            .setInitialDBConfig()
            .waitForElementVisible('@dbNameInput')
            .clearValue('@dbNameInput')
            .setValue('@dbNameInput', 'GMSSample38xml_false')
            .click('@StoreAndReconnectBtn')
            .waitForElementVisible('@localConfigInfo')
            .assert.containsText('@localConfigInfo', "Configuration sav")
            .assert.containsText('@localConfigInfo', "Failed to connect to database!");

        sysadminHeader.waitForElementVisible('@dbName')
            .assert.containsText("@dbName", "GMSSample38xml_false")
            .waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        serverConfig
            .setInitialDBConfig()
            .waitForElementVisible('@dbUserInput')
            .clearValue('@dbUserInput')
            .setValue('@dbUserInput', 'sa1')
            .click('@StoreAndReconnectBtn');

        sysadminHeader.waitForElementVisible('@dbUser')
            .assert.containsText("@dbUser", "sa1")
            .waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        serverConfig.setInitialDBConfig()
            .waitForElementVisible('@dbPasswordInput')
            .clearValue('@dbPasswordInput')
            .setValue('@dbPasswordInput', 'false')
            .click('@StoreAndReconnectBtn');

        sysadminHeader
            .waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        serverConfig
            .setInitialDBConfig();
    },

    'step_6 DB Empty Values for AuthAdmin Dialog ': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible('@dropDBBtn')
            .click('@dropDBBtn')
            .waitForElementVisible('@authAdminDialog')
            .assertAdminDialogIsEmpty()  ///
            .submitDialog('@authAdminDialog')
            .assert.containsText('@dropDBResultField', 'ACCESS_DENIED_ERROR')

            .waitForElementVisible('@dropDBBtn')
            .click('@dropDBBtn')
            .cancelDialog('@authAdminDialog')
            .assert.containsText('@dropDBResultField', 'ACCESS_DENIED_ERROR')

            .waitForElementVisible('@backupBtn')
            .click('@backupBtn')
            .assertAdminDialogIsEmpty()
            .submitDialog('@authAdminDialog')
            .assert.containsText('@backupDBResultField', 'ACCESS_DENIED_ERROR')

            .waitForElementVisible('@restoreBtn')
            .click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .submitDialog('@authAdminDialog')
            .assert.containsText('@restoreDBResultField', 'ACCESS_DENIED_ERROR');
    },

    'step_7 DB Button Actions Tests Create DB': function (browser) {

        var serverConfig = browser.page.serverConfig();
        var sysadminHeader = browser.page.sysadminHeader();
        serverConfig
            .waitForElementVisible('@createDBBtn')
            .assert.visible('@createDBBtn')
            .click('@createDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'Database created!');
        sysadminHeader
            .waitForElementVisible('@dbConnectionState')
            .assert.containsText('@dbConnectionState', 'Connected')
            .waitForElementVisible('@dbValidateState')
            .assert.containsText('@dbValidateState', 'Fail');
    },

    'step_7.1 DB Button Actions Tests Try to create DB when it is already exists': function (browser) {
        var serverConfig = browser.page.serverConfig();

        serverConfig
            .waitForElementVisible('@createDBBtn')
            .assert.visible('@createDBBtn')
            .click('@createDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'Impossible to create DB!')
    },

    'step_7.2 DB Button Actions drop DB': function (browser) {
        var serverConfig = browser.page.serverConfig();
        var sysadminHeader = browser.page.sysadminHeader();

        serverConfig
            .waitForElementPresent('@dropDBBtn')
            .click('@dropDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@dropDBResultField')
            .assert.containsText('@dropDBResultField', 'dropped!');

        sysadminHeader
            .assert.containsText('@dbConnectionState', 'Failed to connect to database!');
    },

    'step_7.2.1 try to drop DB when DB not exists': function (browser) {
        var serverConfig = browser.page.serverConfig();

        serverConfig
            .waitForElementPresent('@dropDBBtn')
            .click('@dropDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@dropDBResultField')
            .assert.containsText('@dropDBResultField', 'FAIL!');
    },

    'step_7.3 DB Try to backup DB(with schema) when DB is not exists': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible("@backupBtn")
            .click('@backupBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .assert.visible("@backupDialog")
            .assert.visible("@backupFileName")
            .clearValue("@backupFileName")
            .setValue("@backupFileName", "test_DB")
            .submitDialog('@backupDialog')
            .waitForElementVisible('@backupDBResultField')
            .assert.containsText('@backupDBResultField', 'FAIL!')
    },

    'step_7.4 DB Try to backup DB(data only) when DB is not exists': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible("@backupDataBtn")
            .click('@backupDataBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .assert.visible("@backupDialog")
            .assert.visible("@backupFileName")
            .clearValue("@backupFileName")
            .setValue("@backupFileName", "test_DB")
            .submitDialog('@backupDialog')
            .waitForElementVisible('@backupDataResultField')
            .assert.containsText('@backupDataResultField', 'FAIL!')
    },

    'step_7.5 DB Try to drop DB when DB is not exists': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible("@dropDBBtn")
            .click('@dropDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@dropDBResultField')
            .assert.visible("@dropDBResultField")
            .assert.containsText('@dropDBResultField', 'FAIL!')
    },
    'step_7.6 DB Try to restore DB when DB is not exists': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible("@restoreBtn")
            .click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@restoreDialog')
            .waitForElementVisible('@restoreFileName')
            .setValue('@restoreFileName', 'test_DB')
            .submitDialog('@restoreDialog')
            .waitForElementVisible('@restoreDBResultField', 10000)
            .assert.containsText('@restoreDBResultField', 'FAIL!')
    },

    'step_8 create  DB': function (browser) {
        var serverConfig = browser.page.serverConfig();
        var sysadminHeader = browser.page.sysadminHeader();
        serverConfig
            .click('@createDBBtn')
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'Database created!');
        sysadminHeader
            .assert.containsText('@dbConnectionState', 'Connected');
    },
    'step_9 try to create  DB when DB exists': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .click('@createDBBtn')
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'FAIL!');
    },
    'step_10 restore DB with schema Tests': function (browser) {
        var serverConfig = browser.page.serverConfig();

        serverConfig
            .click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@restoreDialog')
            //.assertRestoreDialogIsEmpty()
            .clearValue("@restoreFileName")
            .setValue("@restoreFileName", "test_DB")
            .submitDialog('@restoreDialog')
            .waitForElementVisible('@restoreDBResultField', 10000)
            .assert.containsText('@restoreDBResultField', 'Restoring started...');
        browser.pause(10000);
        serverConfig
            .assert.containsText('@restoreDBResultField', 'restored successfully!')
    },

    'step_11 backup DB (data only) Tests': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible("@backupDataBtn")
            .click('@backupDataBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .assert.visible("@backupDialog")
            .assert.visible("@backupFileName");

        var now = moment().format("YYYYMMDD_HHm");
        browser.perform(function () {
            serverConfig.expect.element('@backupFileName').to.have.attribute('value').which.contain(now);
            serverConfig.expect.element('@backupFileName').to.have.attribute('value').which.contain('_data');
        });

        serverConfig
            .clearValue("@backupFileName")
            .setValue("@backupFileName", "test_DB")
            .submitDialog('@backupDialog')
            .waitForElementVisible('@rewriteBackupDialog')
            .submitDialog('@rewriteBackupDialog')
            .waitForElementVisible('@backupDataResultField')
            .assert.visible("@backupDataResultField", 10000)
            .assert.containsText('@backupDataResultField', 'backup saved');
    },

    'step_12 backup DB (with schema) Tests': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .waitForElementVisible("@backupBtn")
            .click('@backupBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .assert.visible("@backupDialog")
            .assert.visible("@backupFileName");

        var now = moment().format("YYYYMMDD_HH");
        browser.perform(function () {
            serverConfig.expect.element('@backupFileName').to.have.attribute('value').which.contain(now);
        });

        serverConfig
            .clearValue("@backupFileName")
            .setValue("@backupFileName", "test_DB_data")
            .submitDialog('@backupDialog')
            .waitForElementVisible('@backupDBResultField', 20000)
            .assert.containsText('@backupDBResultField', 'backup saved');
    },
    'step_13 restore DB(data only) Tests': function (browser) {
        var serverConfig = browser.page.serverConfig();

        serverConfig
            .click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@restoreDialog')
            //.assertRestoreDialogIsEmpty()
            .clearValue("@restoreFileName")
            .setValue("@restoreFileName", "test_DB_data")
            .submitDialog('@restoreDialog')
            .waitForElementVisible('@restoreDBResultField', 10000)
            .assert.containsText('@restoreDBResultField', 'Restoring started...');
        browser.pause(20000);
        serverConfig
            .assert.containsText('@restoreDBResultField', 'restored successfully!')
    },

    'step_14 test databases list visible': function (browser) {
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .assert.containsText('@dbListHeading', 'Databases list for user:')
            .assert.containsText('@dbListContent', 'information_schema')
            .assert.visible("@dbListBtn")
            .click("@dbListBtn")
            .waitForElementVisible('@dbListDialog')
            .setValue('@dbListDialog_UserName','root')
            .setValue('@dbListDialog_UserPas','root')
            .submitDialog('@dbListDialog');
        browser.pause(5000);
        serverConfig
            .assert.containsText('@dbListContent','information_schema')
    },
    'Validate DB and check Validation State':function(browser){
        var sysadminHeader=browser.page.sysadminHeader();
        var database=browser.page.database();

        sysadminHeader
            .waitForElementVisible('@btnDatabase')
            .click('@btnDatabase');
        database
            .waitForElementVisible('@currentChangesTable')
            .moveToCell('@currentChangesTable', 1, 1)
            .mouseButtonClick('right')
            .waitForElementVisible('@applyAllChangesDialog')
            .click('@applyAllChangesDialog');
        browser.pause(60000);

        sysadminHeader
            .assert.containsText('@dbValidateState','success');
    }
};