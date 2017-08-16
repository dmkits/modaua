module.exports= {
    '@disabled': true,

    before: function (browser) {
        browser.maximizeWindow();
    },

    'Open  browser': function (browser) {
        var mainHeader = browser.page.sysadminHeader();
        mainHeader
            .navigate();
    },
    'step_1 Check Login Dialog elements visible': function (browser) {
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
    'step_2 Log in AS ADMIN login and password': function (browser) {
        browser.url("http://localhost:8181/sysadmin");
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput", "")
            .assert.valueContains("@userLoginPasswordInput", "")
            .setValue("@userLoginNameInput", 'admin')
            .setValue("@userLoginPasswordInput", 'admin')
            .click("@loginDialog_submitBtn");
    },

    'step_3 Drop modaua_uiTtest1 DB and log out': function (browser) {

        var serverConfig = browser.page.serverConfig();
        var mainHeader = browser.page.sysadminHeader();

        mainHeader
            .waitForElementVisible('@serverConfigBtn')
            .click("@serverConfigBtn");
        serverConfig
            .waitForElementVisible('@dropDBBtn')
            .click("@dropDBBtn")
            .authorizeAsAdmin();
        mainHeader
            .click('@logoutBtn');
    },

    'step_4 Try log in as user when DB is dropped':function(browser){
        browser
            .url("http://localhost:8181/sysadmin");

        var loginPage = browser.page.loginPage();
            loginPage
                .waitForElementVisible("@loginDialog")
                .assert.valueContains("@userLoginNameInput","")
                .assert.valueContains("@userLoginPasswordInput","")
                .setValue("@userLoginNameInput",'user')
                .setValue("@userLoginPasswordInput",'user')
                .click("@loginDialog_submitBtn");

        var dbConnectionFailed= browser.page.dbConnectionFailed();
        dbConnectionFailed
            .waitForElementVisible('@auth_as_sysadmin')
            .assert.containsText('body','Не удалось подключиться к базе данных!')
            .assert.containsText('body','Обратитесь к системному администратору!');

        browser
            .assert.urlEquals("http://localhost:8181/");

        dbConnectionFailed
            .waitForElementVisible('@auth_as_sysadmin')
            .assert.containsText('body','Не удалось подключиться к базе данных!')
            .assert.containsText('body','Обратитесь к системному администратору!')
            .click('@auth_as_sysadmin');
    },

    'step_5 Login as ADMIN when DB is dropped': function (browser) {
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput", "")
            .assert.valueContains("@userLoginPasswordInput", "")
            .setValue("@userLoginNameInput", 'admin')
            .setValue("@userLoginPasswordInput", 'admin')
            .click("@loginDialog_submitBtn");
    },

    'step_6 Try go to main page as ADMIN  when DB is dropped': function (browser) {
        browser
            .url("http://localhost:8181/")
            .pause(500)
            .assert.urlEquals("http://localhost:8181/sysadmin");
    },

    'step_7 Create DB and log out': function (browser) {
      var sysadminHeader=browser.page.sysadminHeader();
        var serverConfig=browser.page.serverConfig();

        sysadminHeader
            .waitForElementVisible('@serverConfigBtn')
            .click('@serverConfigBtn');

        serverConfig
            .waitForElementVisible('@createDBBtn')
            .click('@createDBBtn')
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField','created');
        sysadminHeader
            .click("@logoutBtn");

    },
    'step_8 Try log in as user when DB is not validated':function(browser){
        browser
            .url("http://localhost:8181/sysadmin");

        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible("@loginDialog")
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'user')
            .setValue("@userLoginPasswordInput",'user')
            .click("@loginDialog_submitBtn");

        var validationFailed= browser.page.validationFailed();
        validationFailed
            .waitForElementVisible('@auth_as_sysadmin')
            .assert.containsText('body','База данных не прошла проверку!')
            .assert.containsText('body','Обратитесь к системному администратору!');

        browser
            .assert.urlEquals("http://localhost:8181/");

        validationFailed
            .waitForElementVisible('@auth_as_sysadmin')
            .assert.containsText('body','База данных не прошла проверку!')
            .assert.containsText('body','Обратитесь к системному администратору!')
            .click('@auth_as_sysadmin');
    },


    'step_9 Login as ADMIN when DB is not validated': function (browser) {
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput", "")
            .assert.valueContains("@userLoginPasswordInput", "")
            .setValue("@userLoginNameInput", 'admin')
            .setValue("@userLoginPasswordInput", 'admin')
            .click("@loginDialog_submitBtn");
    },

    'step_10 Try go to main page as ADMIN  when DB is not validated': function (browser) {
        browser
            .url("http://localhost:8181/")
            .pause(500)
            .assert.urlEquals("http://localhost:8181/sysadmin");
    },

    'step_11 Validate DB': function (browser) {
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

        sysadminHeader  //dbValidateState
            .assert.containsText('@dbValidateState','success');
    },

    'step_12 Try go to main page as ADMIN  when DB is validated': function (browser) {
        browser
            .url("http://localhost:8181/")
            .pause(500)
            .assert.urlEquals("http://localhost:8181/");
    },
    'step_13 Log out as ADMIN from main page and try go to /sysadmin url': function (browser) {
        var mainPage = browser.page.mainPage();

        mainPage
            .waitForElementVisible('@menuBarItemCloseItem')
            .click('@menuBarItemCloseItem');

        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog');

        browser
            .url("http://localhost:8181/sysadmin");
        loginPage
            .waitForElementVisible('@loginDialog');
    },

    'step_14 Log in as USER  when DB is validated': function (browser) {
        var mainPage = browser.page.mainPage();
        var loginPage = browser.page.loginPage();

        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput", "")
            .assert.valueContains("@userLoginPasswordInput", "")
            .setValue("@userLoginNameInput", 'user')
            .setValue("@userLoginPasswordInput", 'user')
            .click("@loginDialog_submitBtn");

        mainPage
            .waitForElementVisible('@main_username')
            .assert.containsText("@main_username", "user");
    },

    'step_15 USER Tries go to /sysadmin when DB is validated': function (browser) {
        var mainPage = browser.page.mainPage();
        var loginPage = browser.page.loginPage();

        browser
            .assert.urlEquals("http://localhost:8181/")
            .url("http://localhost:8181/sysadmin")
            .pause(1000)
            .assert.urlEquals("http://localhost:8181/");

        mainPage
            .waitForElementVisible('@menuBarItemCloseItem')
            .click('@menuBarItemCloseItem');

        loginPage
            .waitForElementVisible('@loginDialog');
    },
    'step_16 Log in AS FALSE USER with FALSE PASSWORD': function (browser) {
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput", "")
            .assert.valueContains("@userLoginPasswordInput", "")
            .setValue("@userLoginNameInput", 'false')
            .setValue("@userLoginPasswordInput", 'false')
            .click("@loginDialog_submitBtn")
            .waitForElementVisible('@loginDialog');
    },
    'step_17 Log in AS FALSE USER with USER PASSWORD': function (browser) {
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput", "")
            .assert.valueContains("@userLoginPasswordInput", "")
            .setValue("@userLoginNameInput", 'false')
            .setValue("@userLoginPasswordInput", 'user')
            .click("@loginDialog_submitBtn")
            .waitForElementVisible('@loginDialog');
    },
    'step_18 Log in AS  USER with FALSE PASSWORD': function (browser) {
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput", "")
            .assert.valueContains("@userLoginPasswordInput", "")
            .setValue("@userLoginNameInput", 'user')
            .setValue("@userLoginPasswordInput", 'false')
            .click("@loginDialog_submitBtn")
            .waitForElementVisible('@loginDialog');
    }
};