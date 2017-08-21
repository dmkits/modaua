var fs = require('fs');

module.exports = {

    //'@disabled': true,

    before: function (browser) {
        fs.createReadStream('./uiTest.cfg').pipe(fs.createWriteStream('./test_temp_copy.cfg'));
        browser.maximizeWindow();
    },

    'step_1 login AS ADMIN Drop AND create new DB': function (browser) {

        var sysadminHeader = browser.page.sysadminHeader();
        var loginPage = browser.page.loginPage();
        var serverConfig = browser.page.serverConfig();

        sysadminHeader
            .navigate();
        loginPage
            .loginAsAdmin();
        sysadminHeader
            .waitForElementVisible('@serverConfigBtn')
            .click('@serverConfigBtn');
        serverConfig
            .dropDB()
            .waitForElementVisible('@createDBBtn')
            .click('@createDBBtn')
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'created')
    },

    'step_2 Assert first raw in  ChangeLog table contains values Tests': function (browser) {
        var sysadminHeader = browser.page.sysadminHeader();
        var database = browser.page.database();
        browser.maximizeWindow();

        sysadminHeader
            .waitForElementVisible('@btnDatabase')
            .click('@btnDatabase')
            .assert.attributeContains('@btnDatabase', 'aria-pressed', 'true');

        database
            .waitForElementVisible('@currentChangesTable')

            .assertTableTitleHasText('@currentChangesTable', 'Data model current changes')
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
            .assertCellContainsText('@currentChangesTable', '1', '6', 'not applied');
    },

    'step_3 Select and apply first 3 rows': function (browser) {
        var database = browser.page.database();

        database
            .moveToCell('@currentChangesTable', '1', '1')
            .mouseButtonDown("left")
            .moveToCell('@currentChangesTable', '3', '3')
            .mouseButtonUp("left")
            .mouseButtonClick('right')
            .waitForElementVisible('@applyChangesDialog')
            .click('@applyChangesDialog');
        browser.pause(6000);
    },
    'step_4 Assert rows applied': function (browser) {
        var database = browser.page.database();
        database
            .assertCellContainsText('@currentChangesTable', '1', '6', 'applied')
            .assertCellContainsText('@currentChangesTable', '2', '6', 'applied')
            .assertCellContainsText('@currentChangesTable', '3', '6', 'applied');
    },

    'step_5 Assert rows not in the Current Changes table after refresh': function (browser) {
        var database = browser.page.database();
        database
            .clickRefreshBtn("@currentChangesTable")
            .waitForElementVisible("@currentChangesTable");
        browser.pause(2000);

        database.assertCellContainsText('@currentChangesTable', '1', '1', 'dir_units__2')
            .assertCellContainsText('@currentChangesTable', '1', '2', '2016-08-29 11:42:00')
            .assertCellContainsText('@currentChangesTable', '1', '3', 'dir_units')
            .assertCellContainsText('@currentChangesTable', '1', '4', 'ALTER TABLE dir_units ADD COLUMN NAME VARCHAR(200) NOT NULL')
            .assertCellContainsText('@currentChangesTable', '1', '5', 'new')
            .assertCellContainsText('@currentChangesTable', '1', '6', 'not applied');
        // .waitForElementVisible('@currentChangesTable')
    },

    'step_6 Assert the aaplied rows are visible in changeLog table': function (browser) {

        var database = browser.page.database();
        database
            .click('@changeLogBtn')
            .waitForElementVisible('@changeLogTable')
            .assertTableTitleHasText('@changeLogTable', 'database change log')
            .assertHeaderContainsText('@changeLogTable', '1', 'changeID')
            .assertHeaderContainsText('@changeLogTable', '2', 'changeDatetime')
            .assertHeaderContainsText('@changeLogTable', '3', 'changeObj')
            .assertHeaderContainsText('@changeLogTable', '4', 'changeVal')
            .assertHeaderContainsText('@changeLogTable', '5', 'appliedDatetime')

            .assertCellContainsText('@changeLogTable', '1', '1', 'chl__1')
            .assertCellContainsText('@changeLogTable', '1', '2', '2016-08-29 09:01:00')
            .assertCellContainsText('@changeLogTable', '1', '3', 'change_log')
            .assertCellContainsText('@changeLogTable', '1', '4', 'CREATE TABLE change_log')
            .assertTotalRowContainsValue('@changeLogTable', '3')
    },

    'step_7 Select and apply one more row': function (browser) {
        var database = browser.page.database();
        database
            .click('@currentChangesBtn')
            .waitForElementVisible('@currentChangesTable')
            .moveToCell('@currentChangesTable', '1', '1')
            .mouseButtonClick('right')
            .waitForElementVisible('@applyChangesDialog')
            .click('@applyChangesDialog');
        browser.pause(10000);
    },

    'step_8 Assert the applied row are no more visible in current Change table': function (browser) {
        var database = browser.page.database();
        database
            .clickRefreshBtn("@currentChangesTable")
            .waitForElementVisible("@currentChangesTable");
        browser.pause(2000);

        database.assertCellContainsText('@currentChangesTable', '1', '1', 'dir_units__3')
            .assertCellContainsText('@currentChangesTable', '1', '2', '2016-08-29 11:43:00')
            .assertCellContainsText('@currentChangesTable', '1', '3', 'dir_units')
            .assertCellContainsText('@currentChangesTable', '1', '4', 'ALTER TABLE dir_units ADD CONSTRAINT DIR_UNITS_NAME_UNIQUE UNIQUE(NAME)')
            .assertCellContainsText('@currentChangesTable', '1', '5', 'new')
            .assertCellContainsText('@currentChangesTable', '1', '6', 'not applied');
    },

    'step_9 Assert the row visible in changeLog table': function (browser) {
        var database = browser.page.database();
        database
            .click('@changeLogBtn')
            .waitForElementVisible('@changeLogTable')
            .clickRefreshBtn('@changeLogTable')
            .assertCellContainsText('@changeLogTable', '4', '1', 'dir_units__2')
            .assertCellContainsText('@changeLogTable', '4', '2', '2016-08-29 11:42:00')
            .assertCellContainsText('@changeLogTable', '4', '3', 'dir_units')
            .assertCellContainsText('@changeLogTable', '4', '4', 'ALTER TABLE dir_units ADD COLUMN NAME VARCHAR(200) NOT NULL')
            .assertTotalRowContainsValue('@changeLogTable', '4')
    }
    //,
    //'step_10 Apply all rows': function (browser) {
    //    var database = browser.page.database();
    //    database
    //        .click('@currentChangesBtn')
    //        .waitForElementVisible('@currentChangesTable')
    //        .moveToCell('@currentChangesTable', '1', '1')
    //        .mouseButtonClick('right')
    //        .waitForElementVisible('@applyAllChangesDialog')
    //        .click('@applyAllChangesDialog');
    //    browser.pause(60000);
    //},

    //'step_11 Assert no more rows left in Changes Table': function (browser) {
    //    var database = browser.page.database();
    //    database
    //        .scrollTableToTop('@currentChangesTable')
    //        .assertCellContainsText('@currentChangesTable', '1', '6', 'applied')
    //        .clickRefreshBtn("@currentChangesTable")
    //        .assertTotalRowContainsValue('@currentChangesTable', '0');
    //},

    //'step_12 Assert sysadminHeader DB Validation State is success': function (browser) {
    //    var sysadminHeader = browser.page.sysadminHeader();
    //    sysadminHeader
    //        .waitForElementVisible("@dbValidateState")
    //        .assert.containsText("@dbValidateState", "success");
    //}
};


