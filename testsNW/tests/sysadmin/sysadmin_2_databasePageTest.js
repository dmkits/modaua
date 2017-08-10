var fs=require('fs');

module.exports= {

//'@disabled': true,

    before: function (browser) {
        fs.createReadStream('./test.cfg').pipe(fs.createWriteStream('./test_temp_copy.cfg'));
        browser.maximizeWindow();
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
        browser.pause(1000)
            .assert.urlEquals("http://localhost:8181/sysadmin")
    },
    'Sysadmin Header If  All Elements Visible Tests': function (browser) {
        browser.pause(2000);
        var mainHeader = browser.page.sysadminHeader();
        var startUpParams = browser.page.startUpParams();

        mainHeader
            .navigate()
            .waitForElementVisible("@img")
            .waitForElementVisible("@btnDatabase")
            .click('@StartUpParamsBtn');

        startUpParams.createTempDB();

        mainHeader
            .waitForElementVisible('@btnDatabase')
            .click('@btnDatabase')
            .assert.attributeContains('@btnDatabase', 'aria-pressed', 'true');
    },

    'Sysadmin ChangeLogTable Tests': function(browser) {

        var sysadminHeader = browser.page.sysadminHeader();
        var database = browser.page.database();

        database
            .waitForElementVisible('@sysadmin_database_ContentPaneDetailContainer')
            .assertTableTitleHasText('@currentChangesTable', 'Current Changes')
            .waitForElementVisible('@currentChangesTable')
            .assertTotalRowContainsValue('@currentChangesTable', '13')

            .assertTableTitleHasText('@currentChangesTable', 'Current Changes')
            .assertHeaderContainsText('@currentChangesTable', '1', 'changeID')
            .assertHeaderContainsText('@currentChangesTable', '2', 'changeDatetime')
            .assertHeaderContainsText('@currentChangesTable', '3', 'changeObj')
            .assertHeaderContainsText('@currentChangesTable', '4', 'changeVal')
            .assertHeaderContainsText('@currentChangesTable', '5', 'type')
            .assertHeaderContainsText('@currentChangesTable', '6', 'message')

            .assertCellContainsText('@currentChangesTable', '1', '1', 'chl__1')
            .assertCellContainsText('@currentChangesTable', '1', '2', '2016-08-29 09:01:00')
            .assertCellContainsText('@currentChangesTable', '1', '3', 'change_log')
            .assertCellContainsText('@currentChangesTable', '1', '4', 'CREATE TABLE change_log')
            .assertCellContainsText('@currentChangesTable', '1', '5', 'new')
            .assertCellContainsText('@currentChangesTable', '1', '6', 'not applied')

            .moveToCell('@currentChangesTable', '1', '1')
            .mouseButtonDown("left")
            .moveToCell('@currentChangesTable', '3', '3')
            .mouseButtonUp("left")
            .mouseButtonClick('right')
            .waitForElementVisible('@applyChangesDialog')
            .click('@applyChangesDialog');
        browser.pause(6000);

            database.assertCellContainsText('@currentChangesTable', '1', '6', 'applied')
            .assertCellContainsText('@currentChangesTable', '2', '6', 'applied')
            .assertCellContainsText('@currentChangesTable', '3', '6', 'applied')
            .clickRefreshBtn("@currentChangesTable")
            .waitForElementVisible("@currentChangesTable");
        browser.pause(2000);

        database.assertCellContainsText('@currentChangesTable', '1', '1', 'dir_units__1')
            .assertCellContainsText('@currentChangesTable', '1', '2', '2016-08-29 11:41:00')
            .assertCellContainsText('@currentChangesTable', '1', '3', 'dir_units')
            .assertCellContainsText('@currentChangesTable', '1', '4', 'CREATE TABLE dir_units')
            .assertCellContainsText('@currentChangesTable', '1', '5', 'new')
            .assertCellContainsText('@currentChangesTable', '1', '6', 'not applied')
            .waitForElementVisible('@currentChangesTable')
            .assertTotalRowContainsValue('@currentChangesTable', '10')

            .click('@changeLogBtn')
            .waitForElementVisible('@changeLogTable')
            .assertTableTitleHasText('@changeLogTable', 'Change Log')
            .assertHeaderContainsText('@changeLogTable', '1', 'changeID')
            .assertHeaderContainsText('@changeLogTable', '2', 'changeDatetime')
            .assertHeaderContainsText('@changeLogTable', '3', 'changeObj')
            .assertHeaderContainsText('@changeLogTable', '4', 'changeVal')

            .assertCellContainsText('@changeLogTable', '1', '1', 'chl__1')
            .assertCellContainsText('@changeLogTable', '1', '2', '2016-08-29 09:01:00')
            .assertCellContainsText('@changeLogTable', '1', '3', 'change_log')
            .assertCellContainsText('@changeLogTable', '1', '4', 'CREATE TABLE change_log')
            .assertTotalRowContainsValue('@changeLogTable', '3')

            .click('@currentChangesBtn')
            .waitForElementVisible('@currentChangesTable')
            .moveToCell('@currentChangesTable', '1', '1')
            .mouseButtonDown("left")
            .moveToLastRow('@currentChangesTable')
            .mouseButtonUp("left")
            .mouseButtonClick('right')
            .waitForElementVisible('@applyChangesDialog')
            .click('@applyChangesDialog');
            browser.pause(60000);

        database
            .scrollTableToTop('@currentChangesTable')
            .assertCellContainsText('@currentChangesTable', '1', '6', 'applied');

            database.click('@changeLogBtn')
            .clickRefreshBtn("@changeLogTable");
        browser.pause(2000);

        database.assertTotalRowContainsValue('@changeLogTable', '13');

        sysadminHeader
            .click('@StartUpParamsBtn');
    }
    ,
        'Delete Test DB and reconnect': function(browser) {
            var startUpParams = browser.page.startUpParams();
            startUpParams.dropTempDBAndReconnect();
              //  browser.end();

        }
};


