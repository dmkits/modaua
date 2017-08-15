module.exports= {
    //'@disabled': true,
    before: function (browser) {
        browser.maximizeWindow();
    },

    //after: function (browser) {
    //    deleteTestBackUpFile();
    //},

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
    //'Enter wrong login  and password': function (browser) {
    //
    //    var loginPage = browser.page.loginPage();
    //    loginPage
    //        .assert.valueContains("@userLoginNameInput", "")
    //        .assert.valueContains("@userLoginPasswordInput", "")
    //        .setValue("@userLoginNameInput", 'false')
    //        .setValue("@userLoginPasswordInput", 'false')
    //        .click("@loginDialog_submitBtn");
    //    browser.pause(500);
    //    loginPage
    //        .assert.valueContains("@userLoginNameInput", "")
    //        .assert.valueContains("@userLoginPasswordInput", "")
    //
    //},

    'Enter ADMIN login  and password': function (browser) {
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

    'Drop modaua_uiTtest1 DB and log out': function (browser) {

        var startUpParams = browser.page.startUpParams();
        var mainHeader = browser.page.sysadminHeader();

        mainHeader
            .waitForElementVisible('@StartUpParamsBtn')
            .click("@StartUpParamsBtn");
        startUpParams
            .waitForElementVisible('@dropDBBtn')
            .click("@dropDBBtn")
            .authorizeAsAdmin();
        mainHeader
            .click('@logoutBtn');
    },
    'Try log in as user when DB is dropped':function(browser){
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
            .assert.containsText('body','Обратитесь к системному администратору!');
    }


};