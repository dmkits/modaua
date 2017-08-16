
//user
module.exports= {

    //'@disabled': true,

    after : function(browser) {
     //   browser.end();
    },

    'Open browser':function(browser){
        var mainPage = browser.page.mainPage();
        mainPage
            .navigate();
    },
    'Login main page':function(browser){
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'user')
            .setValue("@userLoginPasswordInput",'user')
            .click("@loginDialog_submitBtn");
    },
/*
    'Main Header If  All Elements Visible Tests': function (browser) {

        browser.pause(2000);

        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible("@img")
            .assert.visible("@img")
            .waitForElementVisible('@main_username')
            .assert.containsText('@main_username', "user")
            .assert.title('MODA.UA')
            .waitForElementVisible("@mode")
            .assert.containsText('@mode', "uiTest")
            .waitForElementVisible("@mainMenuItem")
            .assert.containsText('@mainMenuItem', "Главная страница")
            .waitForElementVisible("@menuBarPopupMenuMain")
            .assert.containsText('@menuBarPopupMenuMain', "Предприятие")
            .waitForElementVisible("@menuBarWrh")
            .assert.containsText('@menuBarWrh', "Склад")
            .waitForElementVisible("@menuBarPopupMenuSales")
            .assert.containsText('@menuBarPopupMenuSales', "Продажи")
            .waitForElementVisible("@menuBarItemCloseItem")
            .assert.containsText('@menuBarItemCloseItem', "Выход")
            .waitForElementVisible("@menuBarItemHelpAboutItem")
            .assert.containsText('@menuBarItemHelpAboutItem', "О программе")

    },
    'Assert main page tab is visible': function (browser) {

        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible("@tablist_PageContentPane_mainPage")
            .assert.containsText('@tablist_PageContentPane_mainPage', "Главная страница")
            .waitForElementVisible("@mainpage_MainContent")
    },

    'About program dialog tests': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
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
    },
    'Assert menuBarPopupMenuMain has all  menu choices tests': function (browser) {       //Предприятие
        var mainPage = browser.page.mainPage();
        mainPage
            .click("@menuBarPopupMenuMain")
            .waitForElementVisible("@menuBarPopupMenuMain_menu")
            .waitForElementVisible("@menuBarDirsItemUnits")
            .assert.containsText('@menuBarDirsItemUnits', "Подразделения")
            .assert.containsText('@menuBarDirsItemContractors', "Контрагенты")  //menuBarDirsItemProducts
            .assert.containsText('@menuBarDirsItemProducts', "Товарные номенклатуры")
    },
          //Предприятие

            //.click("@menuBarDirsItemUnits")
            //.waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_dir_units")
            //.assert.containsText('@main_ContentContainer_tablist_PageContentPane_dir_units', "Подразделения")
            //.click('@closeTabMainDirUnits')
            //.waitForElementNotPresent("@main_ContentContainer_tablist_PageContentPane_dir_units")
    'Assert menuBarWrh has all  menu choices tests': function (browser) {               //Склад
        var mainPage = browser.page.mainPage();
        mainPage
            .click('@menuBarWrh')
            .waitForElementVisible("@menuBarWrhPInvoice")
            .assert.containsText('@menuBarWrhPInvoice', "Приходные накладные")
            .assert.containsText('@menuBarWrhInvoice', "Расходные накладные")
            .assert.containsText('@menuBarWrhRetInvoice', "Возвратные накладные")
            .assert.containsText('@menuBarWrhBalance', "Остатки товара")
            .assert.containsText('@menuBarWrhMoves', "Движение товаров")
    },
    'Assert menuBarPopupMenuSales has all  menu choices tests': function (browser) {    // Продажи
        var mainPage = browser.page.mainPage();
        mainPage
        .click('@menuBarPopupMenuSales')
            .waitForElementVisible("@menuBarSalesItemCashier")
            .assert.containsText('@menuBarSalesItemCashier', "Отчеты кассира");
    },
    */
    'Assert Main Dirs ItemUnits all elements are visible': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible('@menuBarPopupMenuMain')
            .click('@menuBarPopupMenuMain')
            .waitForElementVisible('@menuBarDirsItemUnits')
            .click('@menuBarDirsItemUnits')
            .waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_dir_units")
           /* .waitForElementVisible("@usedDirUnitsBtn")    //
            .assert.attributeContains('@usedDirUnitsBtn','aria-pressed','true')
            .assertHeaderContainsText('dir_units', '1', "Наименование")
            .assertHeaderContainsText('dir_units', '2', "Полное наименование")
            .assertHeaderContainsText('dir_units', '3', "Примечание")
            .assertHeaderContainsText('dir_units', '4', "Город")
            .assertHeaderContainsText('dir_units', '5', "Адрес")
            .assertHeaderContainsText('dir_units', '6', "Не используется")

            .assertCellContainsText('dir_units', '1', '1', "Гл.офис")
            .assertCellContainsText('dir_units', '1', '2', "офис")
            .assertCellContainsText('dir_units', '1', '3', "офис")
            .assertCellContainsText('dir_units', '1', '4', "Днипро")
            .assertCellContainsText('dir_units', '1', '5', "Днипро")

            .assertTopButtonsVisible('dir_units')//кнопки обновить + печать
            .assertActionPaneVisible('dir_units')
            */
    },
   /* 'Add row to Dirs ItemUnits': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
        .clickAddBtn('dir_units')
            .assertCellContainsText('dir_units','1','1',"Новое подразделение")
            .cellSetValue('dir_units','1','1',"New name")
            .cellSetValue('dir_units','1','2',"New full_name")
            .cellSetValue('dir_units','1','3',"New note")
            .cellSetValue('dir_units','1','4',"new city")
            .cellSetValue('dir_units','1','5',"new address")
            .clickSaveBtn('dir_units')
        ;},
    'Assert Added row to Dirs ItemUnits is saved': function (browser) {
       // browser.refresh();
        var mainPage = browser.page.mainPage();
        mainPage
            .pressRefreshBtnInTable('dir_units')
            .assertCellContainsText('dir_units','3','1',"New name")
            .assertCellContainsText('dir_units','3','2',"New full_name")
            .assertCellContainsText('dir_units','3','3',"New note")
            .assertCellContainsText('dir_units','3','4',"new city")
            .assertCellContainsText('dir_units','3','5',"new address")
        ;},
    'Change  row in Dirs ItemUnits ': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .moveToCell('dir_units',3,3)
            .mouseButtonClick()
            .clickChangeBtn('dir_units')
            .cellSetValue('dir_units','3','1',"Changed name")
            .cellSetValue('dir_units','3','2',"Changed full_name")
            .cellSetValue('dir_units','3','3',"Changed note")
            .cellSetValue('dir_units','3','4',"Changed city")
            .cellSetValue('dir_units','3','5',"Changed address")
            .clickSaveBtn('dir_units')
        ;},

    'Check if changed was saved in Dirs ItemUnits ': function (browser) {
       // browser.refresh();
        var mainPage = browser.page.mainPage();
        mainPage
            .pressRefreshBtnInTable('dir_units')
            .assertCellContainsText('dir_units','3','1',"Changed name")
            .assertCellContainsText('dir_units','3','2',"Changed full_name")
            .assertCellContainsText('dir_units','3','3',"Changed note")
            .assertCellContainsText('dir_units','3','4',"Changed city")
            .assertCellContainsText('dir_units','3','5',"Changed address")
        ;},
*/
    'Set Unused tip': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .moveToCell('dir_units',3,3)
            .mouseButtonClick()
            .clickChangeBtn('dir_units')
            .changeNotUsedPropBtn('dir_units',3)
            .clickSaveBtn('dir_units')
            .pressRefreshBtnInTable('dir_units');
       // browser.expect.element('#dir_units_TableDirUnits').text.to.not.contain('Changed').after(1000);
        mainPage
            .click('@notUsedDirUnitsBtn')
            .assert.attributeContains('@notUsedDirUnitsBtn','aria-pressed','true')
            .assertCellContainsText('dir_units','1','1',"Changed name")
        ;},
    //'Delete row in Dirs ItemUnits ': function (browser) {
    //    var mainPage = browser.page.mainPage();
    //    mainPage
    //        .moveToCell('dir_units',3,3)
    //        .mouseButtonClick()
    //        .clickDeleteBtn('dir_units');
    //    browser.expect.element('#dir_units_ContentContainer').text.to.not.contain('Changed').after(500);
    //
    //
    //    ;}


    //
    //
    //'Main Dirs Contractors Tests': function (browser) {
    //    var mainPage = browser.page.mainPage();
    //    mainPage
    //        .waitForElementVisible('@menuBarPopupMenuMain')
    //        .click('@menuBarPopupMenuMain')
    //        .waitForElementVisible('@menuBarDirsItemContractors')
    //        .click('@menuBarDirsItemContractors')
    //        .waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_dir_contractors")
    //        .assertHeaderContainsText('dir_contractors','1',"NAME")
    //        .assertHeaderContainsText('dir_contractors','2',"FULL_NAME")
    //        .assertHeaderContainsText('dir_contractors','3',"NOTE")
    //        .assertHeaderContainsText('dir_contractors','4',"CITY")
    //        .assertHeaderContainsText('dir_contractors','5',"ADDRESS")
    //        .assertHeaderContainsText('dir_contractors','6',"IS_SUPPLIER")
    //        .assertHeaderContainsText('dir_contractors','7',"IS_BUYER")
    //
    //        .assertCellContainsText('dir_contractors','1','1',"поставщик 1")
    //        .assertCellContainsText('dir_contractors','1','2',"поставщик 1")
    //        .assertCellContainsText('dir_contractors','1','3',"")
    //        .assertCellContainsText('dir_contractors','1','4',"украина")
    //        .assertCellContainsText('dir_contractors','1','5',"украина")
    //        .assertCellContainsText('dir_contractors','1','6',"1")
    //        .assertCellContainsText('dir_contractors','1','7',"0")
    //
    //        .assertTopButtonsVisible('dir_contractors')
    //        .assertActionPaneVisible('dir_contractors')
    //    ;}

};