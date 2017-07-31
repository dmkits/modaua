

module.exports= {

    //'@disabled': true,

    after : function(browser) {
        browser.end();
    },

    'Main Header If  All Elements Visible Tests': function (browser) {

        browser.pause(2000);

        var mainPage = browser.page.mainPage();
        mainPage
            .navigate()
            .waitForElementVisible("@img")
            .assert.visible("@img")
            .assert.title('MODA.UA')
            .waitForElementVisible("@mode")
            .assert.containsText('@mode', "test")

            .waitForElementVisible("@mainMenuItem")
            .assert.containsText('@mainMenuItem', "Главная страница")
            .waitForElementVisible("@popupMenuDirsItem")
            .assert.containsText('@popupMenuDirsItem', "Справочники")
            .waitForElementVisible("@menuBarItemCloseItem")
            .assert.containsText('@menuBarItemCloseItem', "Выход")
            .waitForElementVisible("@menuBarItemHelpAboutItem")
            .assert.containsText('@menuBarItemHelpAboutItem', "О программе")

            .waitForElementVisible("@tablist_PageContentPane_mainPage")
            .assert.containsText('@tablist_PageContentPane_mainPage', "Главная страница")
            .waitForElementVisible("@mainpage_MainContent")

            .click("@menuBarItemHelpAboutItem")
            .waitForElementVisible("@aboutProgramDialog")
            .assert.containsText('@aboutProgramDialog', "Система учета MODA.UA")
            .assert.containsText('@aboutProgramDialog', "Разработчики: dmkits, ianagez 2017")
            .click("@aboutProgramDialog_submitBtn")
            .waitForElementNotVisible("@aboutProgramDialog")
            .click("@menuBarItemHelpAboutItem")
            .waitForElementVisible("@aboutProgramDialog")
            .click("@aboutProgramDialog_cancelBtn")
            .waitForElementNotVisible("@aboutProgramDialog")

            .click("@popupMenuDirsItem")
            .waitForElementVisible("@menuBarPopupMenuDirs_menu")
            .waitForElementVisible("@menuBarDirsItemUnits")
            .assert.containsText('@menuBarDirsItemUnits', "Подразделения")
            .waitForElementVisible("@menuBarDirsItemContractors")
            .assert.containsText('@menuBarDirsItemContractors', "Контрагенты")

            .click("@menuBarDirsItemUnits")
            .waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_mainDirUnits")
            .assert.containsText('@main_ContentContainer_tablist_PageContentPane_mainDirUnits', "Подразделения")
            .click('@closeTabMainDirUnits')
            .waitForElementNotPresent("@main_ContentContainer_tablist_PageContentPane_mainDirUnits")

            .click("@popupMenuDirsItem")
            .waitForElementVisible("@menuBarDirsItemContractors")
            .click("@menuBarDirsItemContractors")
            .waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_mainDirContractors")
            .click("@closeTabMainDirContractors")
            .waitForElementNotPresent("@main_ContentContainer_tablist_PageContentPane_mainDirContractors")

            .click("@menuBarItemCloseItem")
            .waitForElementVisible("@finishedContentPane")
            .assert.containsText('@finishedContentPane', "Вы закрыли все окна.")
        ;
    }
};