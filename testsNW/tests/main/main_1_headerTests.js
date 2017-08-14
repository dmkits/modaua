

module.exports= {

    '@disabled': true,

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

            .click("@menuBarPopupMenuMain")
            .waitForElementVisible("@menuBarPopupMenuMain_menu")
            .waitForElementVisible("@menuBarDirsItemUnits")
            .assert.containsText('@menuBarDirsItemUnits', "Подразделения")
            .waitForElementVisible("@menuBarDirsItemContractors")
            .assert.containsText('@menuBarDirsItemContractors', "Контрагенты")

            .click("@menuBarDirsItemUnits")
            .waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_dir_units")
            .assert.containsText('@main_ContentContainer_tablist_PageContentPane_dir_units', "Подразделения")
            .click('@closeTabMainDirUnits')
            .waitForElementNotPresent("@main_ContentContainer_tablist_PageContentPane_dir_units")

            .click('@menuBarWrh')
            .waitForElementVisible("@menuBarWrhPInvoice")
            .assert.containsText('@menuBarWrhPInvoice', "Приходные накладные")
            .assert.containsText('@menuBarWrhInvoice', "Расходные накладные")
            .assert.containsText('@menuBarWrhRetInvoice', "Возвратные накладные")
            .assert.containsText('@menuBarWrhBalance', "Остатки товара")
            .assert.containsText('@menuBarWrhMoves', "Движение товаров")

            .click('@menuBarPopupMenuSales')
            .waitForElementVisible("@menuBarSalesItemCashier")
            .assert.containsText('@menuBarSalesItemCashier', "Отчеты кассира")


            //.click("@menuBarPopupMenuMain")
            //.waitForElementVisible("@menuBarDirsItemContractors")
            //.click("@menuBarDirsItemContractors")
            //.waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_dir_contractors")
            //.click("@closeTabMainDirContractors")
            //.waitForElementNotPresent("@main_ContentContainer_tablist_PageContentPane_dir_contractors")

          //  .click("@menuBarItemCloseItem");

        //var loginPage=browser.page.loginPage();
        //loginPage
        //    .waitForElementVisible("@loginDialog");
    },

    //'Main Dirs ItemUnits Tests': function (browser) {
    //    browser.refresh();
    //
    //    var mainPage = browser.page.mainPage();
    //    mainPage
    //        .waitForElementVisible('@menuBarPopupMenuMain')
    //        .click('@menuBarPopupMenuMain')
    //        .waitForElementVisible('@menuBarDirsItemUnits')
    //        .click('@menuBarDirsItemUnits')
    //        .waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_dir_units")
    //        .assertHeaderContainsText('dir_units','1',"NAME")
    //        .assertHeaderContainsText('dir_units','2',"FULL_NAME")
    //        .assertHeaderContainsText('dir_units','3',"NOTE")
    //        .assertHeaderContainsText('dir_units','4',"CITY")
    //        .assertHeaderContainsText('dir_units','5',"ADDRESS")
    //
    //        .assertCellContainsText('dir_units','1','1',"Гл.офис")
    //        .assertCellContainsText('dir_units','1','2',"офис")
    //        .assertCellContainsText('dir_units','1','3',"офис")
    //        .assertCellContainsText('dir_units','1','4',"Днипро")
    //        .assertCellContainsText('dir_units','1','5',"Днипро")
    //
    //        .assertTopButtonsVisible('dir_units')
    //        .assertActionPaneVisible('dir_units')
    //
    //        //.clickCell('dir_units','1','1')  //
    //       // .clickChangeBtn()
    //        .clickAddBtn('dir_units')
    //        .assertCellContainsText('dir_units','1','1',"новое подразделение")
    //        .cellSetValue('dir_units','1','1',"New name")
    //        .cellSetValue('dir_units','1','2',"New full_name")
    //        .cellSetValue('dir_units','1','3',"New note")
    //        .cellSetValue('dir_units','1','4',"new city")
    //        .cellSetValue('dir_units','1','5',"new address")
    //        .clickSaveBtn('dir_units')
    //    ;},
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