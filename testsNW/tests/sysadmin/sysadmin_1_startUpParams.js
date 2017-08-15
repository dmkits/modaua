
var fs=require('fs');

function deleteTestBackUpFile() {

    fs.unlink('./backups/testBackup.sql', function (err) {
        if (err && err.code == 'ENOENT') {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
        } else if (err) {
            // maybe we don't have enough permission
            console.error("Error occurred while trying to remove file");
        } else {
            console.info('File "testBackup.sql" removed');
        }
    });
}

module.exports= {
    '@disabled': true,
    before: function (browser) {
        fs.createReadStream('./uiTest.cfg').pipe(fs.createWriteStream('./test_temp_copy.cfg'));
    },

    after : function(browser) {
        deleteTestBackUpFile();
    },

    'Open  browser': function (browser) {

        var mainHeader = browser.page.sysadminHeader();
        mainHeader
            .navigate();
    },


    'Check Login Dialog elements visible': function (browser) {

        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .waitForElementVisible('@loginDialog_title')
            .waitForElementVisible('@userLoginNameLabel')
            .waitForElementVisible('@userLoginPasswordLabel')
            .waitForElementVisible('@userLoginNameInput')
            .waitForElementVisible('@userLoginPasswordInput')
            .waitForElementVisible('@loginDialog_submitBtn')
            .waitForElementVisible('@loginDialog_cancelBtn')

    },
    //'Enter NON_ADMIN login  and password': function (browser) {
    //    var loginPage = browser.page.loginPage();
    //    loginPage
    //        .waitForElementVisible("@loginDialog")
    //        .assert.valueContains("@userLoginNameInput","")
    //        .assert.valueContains("@userLoginPasswordInput","")
    //        .setValue("@userLoginNameInput",'user')
    //        .setValue("@userLoginPasswordInput",'user')
    //        .click("@loginDialog_submitBtn");
    //    browser.pause(1000)
    //        .assert.urlEquals("http://localhost:8181/");
    //    var mainPage=browser.page.mainPage();
    //    mainPage
    //        .waitForElementVisible('@menuBarItemCloseItem')
    //        .click('@menuBarItemCloseItem')
    //},
    'Enter wrong login  and password': function (browser) {

        var loginPage = browser.page.loginPage();
        loginPage
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'false')
            .setValue("@userLoginPasswordInput",'false')
            .click("@loginDialog_submitBtn");
          browser.pause(500);
        loginPage
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")

    },

    'Enter ADMIN login  and password': function (browser) {
        browser.url("http://localhost:8181/sysadmin");
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'admin')
            .setValue("@userLoginPasswordInput",'admin')
            .click("@loginDialog_submitBtn");
    },
    'Sysadmin Header If  All Elements Visible Tests': function (browser) {

        //browser.url("http://localhost:8181/sysadmin")
        //             .pause(2000);

        var mainHeader = browser.page.sysadminHeader();
        mainHeader
            .waitForElementVisible("@img")
            .assert.visible("@img")
            .assert.title('MODA.UA')
            .assert.containsText('@user', "USER:admin")
            .assert.containsText('@mode', "MODE:uiTest")
            .assert.containsText('@port', "PORT:8181")
            .assert.containsText('@dbName', "DB NAME:modaua_uiTtest1")
            .assert.containsText('@dbUser', "DB USER:user")
            .assert.containsText('@dbConnectionState', 'Connected')
            .assert.visible('@StartUpParamsBtn')
            .assert.visible('@logoutBtn')
            .click('@StartUpParamsBtn')
            .assert.attributeContains('@StartUpParamsBtn','aria-pressed','true');
    },

    'Check initial DB Config Tests': function (browser) {

        var startUpParams = browser.page.startUpParams();
        var mainHeader = browser.page.sysadminHeader();

        startUpParams
            .waitForElementVisible('@dbHostLabel')
            .assert.containsText('@dbHostLabel', 'db.host')
            .waitForElementVisible('@dbNameLabel')
            .assert.containsText('@dbNameLabel', 'db.name')
            .waitForElementVisible('@dbUserLabel')
            .assert.containsText('@dbUserLabel', 'db.user')
            .waitForElementVisible('@dbPasswordLabel')
            .assert.containsText('@dbPasswordLabel', 'db.password')
            .waitForElementVisible('@configNamedLabel')
            .assert.containsText('@configNamedLabel', 'configName');

        startUpParams.expect.element('@dbHostInput').to.have.attribute('value').which.equal('localhost');
        startUpParams.expect.element('@dbNameInput').to.have.attribute('value').which.equal('modaua_uiTtest1');
        startUpParams.expect.element('@dbUserInput').to.have.attribute('value').which.equal('user');
        startUpParams.expect.element('@dbPasswordInput').to.have.attribute('value').which.equal('user');
        startUpParams.expect.element('@configNameInput').to.have.attribute('value').which.equal('config.json');

        startUpParams
            .waitForElementVisible('@localConfigInfo')
            .assert.containsText('@localConfigInfo', "Configuration loaded.")
            .click('@loadSettingsBtn')
            .assert.containsText('@localConfigInfo', "Configuration reloaded.")
            .waitForElementVisible('@dbHostInput')

            .createTempDB();
            mainHeader.click("@logoutBtn");
    },
    'Enter NON_ADMIN login  and password DB is not Validated': function (browser) {
        var loginPage = browser.page.loginPage();
        var validationFailed = browser.page.validationFailed();
        loginPage
            .waitForElementVisible("@loginDialog")
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'user')
            .setValue("@userLoginPasswordInput",'user')
            .click("@loginDialog_submitBtn");
        validationFailed
            .waitForElementVisible('@auth_as_sysadmin')
            .click('@auth_as_sysadmin');

    },

    'Enter ADMIN login  and password from validateFailed page': function (browser) {
        browser.url("http://localhost:8181");
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'admin')
            .setValue("@userLoginPasswordInput",'admin')
            .click("@loginDialog_submitBtn");
        browser.assert.urlEquals("http://localhost:8181/sysadmin");                     //assert no entrance to  main page
    },

        'Enter INVALID DB Config values Tests': function (browser) {

            var startUpParams = browser.page.startUpParams();
            var mainHeader = browser.page.sysadminHeader();

            mainHeader
                .waitForElementVisible('@StartUpParamsBtn')
                .click("@StartUpParamsBtn");

            startUpParams
                .waitForElementVisible('@dbHostInput')
            .clearValue('@dbHostInput')
            .setValue('@dbHostInput', '192.168.0.93_false')
            .click('@StoreAndReconnectBtn')
            .waitForElementVisible('@localConfigInfo')
            .assert.containsText('@localConfigInfo', "Configuration sav")
            .assert.containsText('@localConfigInfo', "Failed to connect to database!");

        mainHeader.waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        startUpParams
            .resetTempDBConfig()
            .waitForElementVisible('@dbNameInput')
            .clearValue('@dbNameInput')
            .setValue('@dbNameInput', 'GMSSample38xml_false')
            .click('@StoreAndReconnectBtn')
            .waitForElementVisible('@localConfigInfo')
            .assert.containsText('@localConfigInfo', "Configuration sav")
            .assert.containsText('@localConfigInfo', "Failed to connect to database!");

        mainHeader.waitForElementVisible('@dbName')
            .assert.containsText("@dbName", "GMSSample38xml_false")
            .waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        startUpParams
            .resetTempDBConfig()
            .waitForElementVisible('@dbUserInput')
            .clearValue('@dbUserInput')
            .setValue('@dbUserInput','sa1')
            .click('@StoreAndReconnectBtn');

        mainHeader.waitForElementVisible('@dbUser')
            .assert.containsText("@dbUser", "sa1")
            .waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        startUpParams.resetTempDBConfig()
            .waitForElementVisible('@dbPasswordInput')
            .clearValue('@dbPasswordInput')
            .setValue('@dbPasswordInput','false')
            .click('@StoreAndReconnectBtn');

        mainHeader
            .waitForElementVisible('@dbConnectionState')
            .assert.containsText("@dbConnectionState", "Failed to connect to database!");

        startUpParams
            .resetTempDBConfig();
    },

    'Empty  Dialog Values': function (browser) {
        var startUpParams = browser.page.startUpParams();
        startUpParams
            .waitForElementVisible('@dropDBBtn')
            .click('@dropDBBtn')
            .waitForElementVisible('@authAdminDialog')
            .assertAdminDialogIsEmpty()
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
            .assert.containsText('@restoreDBResultField', 'ACCESS_DENIED_ERROR')
        ;
    },

    'DB Button Actions Tests': function (browser) {

        var startUpParams = browser.page.startUpParams();
        var mainHeader = browser.page.sysadminHeader();
        startUpParams

            .waitForElementVisible('@createDBBtn')
            .assert.visible('@createDBBtn')
            .click('@createDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'Impossible to create DB!')

            .waitForElementPresent('@dropDBBtn')
            .click('@dropDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@dropDBResultField')
            .assert.containsText('@dropDBResultField', 'dropped!');
        mainHeader
            .assert.containsText('@dbConnectionState', 'Failed to connect to database!');
    },

    'Enter as user when DB Dropped': function (browser) {

        var mainHeader = browser.page.sysadminHeader();
        var validationFailed = browser.page.validationFailed();
        var loginPage = browser.page.loginPage();

        mainHeader
            .click('@logoutBtn');

            loginPage
                .waitForElementVisible("@loginDialog")
                .assert.valueContains("@userLoginNameInput","")
                .assert.valueContains("@userLoginPasswordInput","")
                .setValue("@userLoginNameInput",'user')
                .setValue("@userLoginPasswordInput",'user')
                .click("@loginDialog_submitBtn");

             validationFailed
                 .waitForElementVisible("@auth_as_sysadmin")
                 .assert.containsText("body","Не удалось подключиться к базе данных!")
                 .assert.containsText("body","Обратитесь к системному администратору!");


        browser.url("http://localhost:8181/sysadmin")
            .assert.urlEquals("http://localhost:8181/");
        validationFailed
            .click("@auth_as_sysadmin");

        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'admin')
            .setValue("@userLoginPasswordInput",'admin')
            .click("@loginDialog_submitBtn");
        browser.url("http://localhost:8181");
        browser.assert.urlEquals("http://localhost:8181/sysadmin");
    },

   'BackupDB Tests':function(browser){

       var startUpParams = browser.page.startUpParams();
       var mainHeader = browser.page.sysadminHeader();

       mainHeader
           .waitForElementVisible("@StartUpParamsBtn")
           .click("@StartUpParamsBtn");

        startUpParams
            .waitForElementVisible("@backupBtn")
            .click('@backupBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .assert.visible("@backupDialog")
            .assert.visible("@backupFileName")
            .assertBackupDialogIsEmpty()
            .setValue("@backupFileName","test_DB")
            .submitDialog('@backupDialog')
            .waitForElementVisible('@backupDBResultField')
            .assert.visible("@backupDBResultField")
            .assert.containsText('@backupDBResultField', 'FAIL!')

            .click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@restoreDialog')
            .assertRestoreDialogIsEmpty()
            .clearValue("@restoreFileName")
            .setValue("@restoreFileName","test_DB")
            .submitDialog('@restoreDialog')
            .waitForElementVisible('@restoreDBResultField')
            .assert.visible("@restoreDBResultField")
            .assert.containsText('@restoreDBResultField', 'FAIL!')

            .click('@createDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'Database created!');
        mainHeader
            .assert.containsText('@dbConnectionState', 'Connected');

        startUpParams.click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@restoreDialog')
            .assertRestoreDialogIsEmpty()
            .clearValue("@restoreFileName")
            .setValue("@restoreFileName","test_DB")
            .submitDialog('@restoreDialog')
            .waitForElementVisible('@restoreDBResultField')
            .assert.containsText('@restoreDBResultField', 'Db dump file restored successfully')

            .click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@restoreDialog')
            .assertRestoreDialogIsEmpty()
            .clearValue("@restoreFileName")
            .setValue("@restoreFileName","test_DB")
            .submitDialog('@restoreDialog')
            .waitForElementVisible('@rewriteDBDialog')
            .submitDialog('@rewriteDBDialog')
            .waitForElementVisible('@restoreDBResultField')
            .assert.containsText('@restoreDBResultField', 'Db dump file restored successfully')

            .click('@restoreBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@restoreDialog')
            .assertRestoreDialogIsEmpty()
            .clearValue("@restoreFileName")
            .setValue("@restoreFileName","fail0000")
            .submitDialog('@restoreDialog')
            .waitForElementVisible('@restoreDBResultField')
            .assert.containsText('@restoreDBResultField', 'FAIL!')

            .waitForElementVisible('@backupBtn')
            .click('@backupBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@backupDialog')
            .assertBackupDialogIsEmpty()
            .clearValue("@backupFileName")
            .setValue("@backupFileName","testBackup")
            .submitDialog('@backupDialog')
            .waitForElementVisible('@backupDBResultField', 10000)
            .assert.containsText('@backupDBResultField', 'backup saved')

            .waitForElementVisible('@backupBtn')
            .click('@backupBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@backupDialog')
            .assertBackupDialogIsEmpty()
            .clearValue("@backupFileName")
            .setValue("@backupFileName","test_DB")
            .submitDialog('@backupDialog')
            .waitForElementVisible('@rewriteBackupDialog', 10000)
            .submitDialog('@rewriteBackupDialog')
            .waitForElementVisible('@backupDBResultField')
            .assert.containsText('@backupDBResultField', 'backup saved')
            .dropTempDBAndReconnect();

        var sysadminHeader=browser.page.sysadminHeader();
        sysadminHeader.click('@logoutBtn');

       // browser.end();
    }
};