
//user
module.exports= {

    //'@disabled': true,

    after : function(browser) {
     //   browser.end();
    },

    'step_1 Open browser':function(browser){
        var mainPage = browser.page.mainPage();
        browser.maximizeWindow();
        mainPage
            .navigate();
    },
    'step_1.1 Validate DB': function (browser) {
        browser.url('localhost:8181/sysadmin');
        var loginPage = browser.page.loginPage();
        loginPage.
            loginAsAdmin();
        var sysadminHeader=browser.page.sysadminHeader();
        var database=browser.page.database();

        sysadminHeader
            .click('@serverConfigBtn')
            .assert.attributeContains('@serverConfigBtn','aria-pressed','true');
        var serverConfig = browser.page.serverConfig();
        serverConfig
            .dropDB()
            .waitForElementVisible('@createDBBtn')
            .assert.visible('@createDBBtn')
            .click('@createDBBtn')
            .assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'Database created!');


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
            .assert.containsText('@dbValidateState','success')
            .click("@logoutBtn");
    },
    'step_2 Login main page':function(browser){
        var loginPage = browser.page.loginPage();
        loginPage
            .waitForElementVisible('@loginDialog')
            .assert.valueContains("@userLoginNameInput","")
            .assert.valueContains("@userLoginPasswordInput","")
            .setValue("@userLoginNameInput",'user')
            .setValue("@userLoginPasswordInput",'user')
            .click("@loginDialog_submitBtn");
    },
    'step_3 Main Header If  All Elements Visible Tests': function (browser) {

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
    'step_4 Assert main page tab is visible': function (browser) {

        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible("@tablist_PageContentPane_mainPage")
            .assert.containsText('@tablist_PageContentPane_mainPage', "Главная страница")
            .waitForElementVisible("@mainpage_MainContent")
    },

    'step_5 About program dialog tests': function (browser) {
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
    'step_6 Assert menuBarPopupMenuMain has all  menu choices tests': function (browser) {       //Предприятие
        var mainPage = browser.page.mainPage();
        mainPage
            .click("@menuBarPopupMenuMain")
            .waitForElementVisible("@menuBarPopupMenuMain_menu")
            .waitForElementVisible("@menuBarDirsItemUnits")
            .assert.containsText('@menuBarDirsItemUnits', "Подразделения")
            .assert.containsText('@menuBarDirsItemContractors', "Контрагенты")  //menuBarDirsItemProducts
            .assert.containsText('@menuBarDirsItemProducts', "Товарные номенклатуры")
    },
    'step_7 Assert menuBarWrh has all  menu choices tests': function (browser) {               //Склад
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
    'step_8 Assert menuBarPopupMenuSales has all  menu choices tests': function (browser) {    // Продажи
        var mainPage = browser.page.mainPage();
        mainPage
        .click('@menuBarPopupMenuSales')
            .waitForElementVisible("@menuBarSalesItemCashier")
            .assert.containsText('@menuBarSalesItemCashier', "Отчеты кассира");
    },

    'step_9 Assert Main Dirs ItemUnits all elements are visible': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible('@menuBarPopupMenuMain')
            .click('@menuBarPopupMenuMain')
            .waitForElementVisible('@menuBarDirsItemUnits')
            .click('@menuBarDirsItemUnits')
            .waitForElementVisible("@main_ContentContainer_tablist_PageContentPane_dir_units")
            .waitForElementVisible("@usedDirUnitsBtn")    //
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

    },
    'step_10 Add row to Dirs ItemUnits': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
        .clickAddBtn('dir_units')
            .assertCellContainsText('dir_units','1','1',"Новое подразделение")
            .cellSetValue('dir_units','1','1',"New name")
            .cellSetValue('dir_units','1','2',"New full_name")
            .cellSetValue('dir_units','1','3',"New note")
            .cellSetValue('dir_units','1','4',"new city")
            .cellSetValue('dir_units','1','5',"new address")
            .clickSaveBtn('dir_units');
        ;},
    'Assert Added row to Dirs ItemUnits is saved': function (browser) {
       // browser.refresh();
        var mainPage = browser.page.mainPage();
        mainPage
            .clickRefreshBtnInTable('dir_units')
            .assertCellContainsText('dir_units','3','1',"New name")
            .assertCellContainsText('dir_units','3','2',"New full_name")
            .assertCellContainsText('dir_units','3','3',"New note")
            .assertCellContainsText('dir_units','3','4',"new city")
            .assertCellContainsText('dir_units','3','5',"new address")
        ;},
    'step_11 Change  row in Dirs ItemUnits ': function (browser) {
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
            .clickSaveBtn('dir_units');
        browser.pause(1000);

        ;},

    'step_12 Check if changed was saved in Dirs ItemUnits ': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .clickRefreshBtnInTable('dir_units')
            .assertCellContainsText('dir_units','3','1',"Changed name")
            .assertCellContainsText('dir_units','3','2',"Changed full_name")
            .assertCellContainsText('dir_units','3','3',"Changed note")
            .assertCellContainsText('dir_units','3','4',"Changed city")
            .assertCellContainsText('dir_units','3','5',"Changed address")
        ;},

    'step_13 Set Unused tip in Dirs ItemUnits': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible("@dir_units_TableDirUnits")
            .moveToCell('dir_units',3,3)
            .mouseButtonClick()
            .clickChangeBtn('dir_units')
            .changeTickBtnStatus('dir_units',3,6);

        browser.perform(function(){
            mainPage.expect.element('@tickBtn').to.have.attribute('checked').which.equal('true');
        });

        mainPage
            .clickSaveBtn('dir_units')
            .clickRefreshBtnInTable('dir_units');
        browser.expect.element('#dir_units_TableDirUnits').text.to.not.contain('Changed').after(500);

        mainPage
            .click('@notUsedDirUnitsBtn');
        browser.pause(1000);
        mainPage
            .assert.attributeContains('@notUsedDirUnitsBtn','aria-pressed','true')
            .waitForElementVisible("@dir_units_TableDirUnits")
            .assertCellContainsText('dir_units','1','1',"Changed name");
        },

    'step_14 Delete row in Dirs ItemUnits ': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .moveToCell('dir_units',1,1)
            .mouseButtonClick()
            .clickDeleteBtn('dir_units');
        browser.expect.element('#dir_units_TableDirUnits').text.to.not.contain('Changed').after(500);
    },

    'Main Dirs Contractors Tests': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible('@menuBarPopupMenuMain')
            .click('@menuBarPopupMenuMain')
            .waitForElementVisible('@menuBarDirsItemContractors')
            .click('@menuBarDirsItemContractors')
            .waitForElementVisible("@dir_contractors_TableDirContractors")
            .assertHeaderContainsText('dir_contractors','1',"Наименование")
            .assertHeaderContainsText('dir_contractors','2',"Полное наименование")
            .assertHeaderContainsText('dir_contractors','3',"Примечание")
            .assertHeaderContainsText('dir_contractors','4',"Страна")
            .assertHeaderContainsText('dir_contractors','5',"Город")
            .assertHeaderContainsText('dir_contractors','6',"Адрес")
            .assertHeaderContainsText('dir_contractors','7',"Поставщик")
            .assertHeaderContainsText('dir_contractors','8',"Покупатель")

            .assertCellContainsText('dir_contractors','1','1',"Поставщик 1")
            .assertCellContainsText('dir_contractors','1','2',"Поставщик 1")
            .assertCellContainsText('dir_contractors','1','3',"Поставщик 1")
            .assertCellContainsText('dir_contractors','1','4',"Украина")
            .assertCellContainsText('dir_contractors','1','5',"Днепр")
            .assertCellContainsText('dir_contractors','1','6',"-")

            .assertTopButtonsVisible('dir_contractors')
            .assertActionPaneVisible('dir_contractors')
        ;},

    'Assert Main Contractors BUYERS are visible': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .click("@isBuyerContractorsBtn")
            .assert.attributeContains('@isBuyerContractorsBtn','aria-pressed','true')
            .waitForElementVisible("@dir_contractors_TableDirContractors")
            .assertHeaderContainsText('dir_contractors', '1', "Наименование")
            .assertHeaderContainsText('dir_contractors', '2', "Полное наименование")
            .assertHeaderContainsText('dir_contractors', '3', "Примечание")
            .assertHeaderContainsText('dir_contractors', '4', "Страна")
            .assertHeaderContainsText('dir_contractors', '5', "Город")
            .assertHeaderContainsText('dir_contractors', '6', "Адрес")
            .assertHeaderContainsText('dir_contractors', '7', "Поставщик")
            .assertHeaderContainsText('dir_contractors', '8', "Покупатель")

            .assertCellContainsText('dir_contractors', '1', '1', "Розничный покупатель")
            .assertCellContainsText('dir_contractors', '1', '2', "Розничный покупатель")
            .assertCellContainsText('dir_contractors', '1', '3', "Розничный покупатель")
            .assertCellContainsText('dir_contractors', '1', '4', "Украина")
            .assertCellContainsText('dir_contractors', '1', '5', "Днепр")
    },

    'Add new Contractor ' : function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .clickAddBtn('dir_contractors')
            .assertCellContainsText('dir_contractors','1','1',"Новый контрагент")

            .cellSetValue('dir_contractors','1','3',"New Contractor note")
            .cellSetValue('dir_contractors','1','5',"New Contractor city")
            .cellSetValue('dir_contractors','1','2',"New Contractor full_name")
            .cellSetValue('dir_contractors','1','6',"New Contractor address")
            .cellSetValue('dir_contractors','1','4',"New Contractor country")
            .cellSetValue('dir_contractors','1','1',"New Contractor name")
            .clickSaveBtn('dir_contractors')
            .clickRefreshBtnInTable('dir_contractors');

        browser.expect.element('#dir_contractors_TableDirContractors').text.to.not.contain('New Contractor name').after(500);
    },

 'Assert new contractor saved to "Other Contractors Table"' : function (browser) {
     var mainPage = browser.page.mainPage();
     mainPage
         .click("@otherContractorsBtn")
         .waitForElementVisible("@dir_contractors_TableDirContractors")
         .assertCellContainsText('dir_contractors','1','1',"New Contractor name");
 },
    'Change Contractors Values' : function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .moveToCell('dir_contractors',1,1)
            .mouseButtonClick()
            .clickChangeBtn('dir_contractors')

            .cellSetValue('dir_contractors','1','3',"Changed Contractor note")
            .cellSetValue('dir_contractors','1','5',"Changed Contractor city")
            .cellSetValue('dir_contractors','1','2',"Changed Contractor full_name")
            .cellSetValue('dir_contractors','1','6',"Changed Contractor address")
            .cellSetValue('dir_contractors','1','4',"Changed Contractor country")
            .cellSetValue('dir_contractors','1','1',"Changed Contractor name")
            .clickSaveBtn('dir_contractors');
        browser.pause(1000);
    },
    ' Check if changed was saved in "Other Contractors Table"' : function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .clickRefreshBtnInTable('dir_contractors')
            .assertCellContainsText('dir_contractors','1','1',"Changed Contractor name")
            .assertCellContainsText('dir_contractors','1','2',"Changed Contractor full_name")
            .assertCellContainsText('dir_contractors','1','3',"Changed Contractor note")
            .assertCellContainsText('dir_contractors','1','4',"Changed Contractor country")
            .assertCellContainsText('dir_contractors','1','5',"Changed Contractor city")
            .assertCellContainsText('dir_contractors','1','6',"Changed Contractor address")
    },

    'Set Supplier  tip to the Contractor': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible("@dir_contractors_TableDirContractors")
            .moveToCell('dir_contractors',1,1)
            .mouseButtonClick()
            .clickChangeBtn('dir_contractors')
           // .changeTickBtnStatus('dir_contractors',3);
            .changeTickBtnStatus('dir_contractors',1,7);

        browser.perform(function(){
            mainPage.expect.element('@tickBtn').to.have.attribute('checked').which.equal('true');
        });

        mainPage
            .clickSaveBtn('dir_contractors')
            .clickRefreshBtnInTable('dir_contractors');
        browser.expect.element('#dir_contractors_TableDirContractors').text.to.not.contain('Changed').after(500);
        mainPage
            .click('@isSupplierContractorsBtn')
            .assert.attributeContains('@isSupplierContractorsBtn','aria-pressed','true')
            .assertCellContainsText('dir_contractors','2','1',"Changed Contractor name");
        },

    'Mark new Contractor AS BUYER too':function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .waitForElementVisible("@dir_contractors_TableDirContractors")
            .moveToCell('dir_contractors',2,1)
            .mouseButtonClick()
            .clickChangeBtn('dir_contractors')
            .moveToCell('dir_contractors',2,8)
            .changeTickBtnStatus('dir_contractors',2,8);

        browser.perform(function(){
            mainPage.expect.element('@tickBtn').to.have.attribute('checked').which.equal('true');
        });

        mainPage
            .clickSaveBtn('dir_contractors')
            .clickRefreshBtnInTable('dir_contractors');
        browser.pause(1000);
        mainPage
            .assert.containsText("@dir_contractors_TableDirContractors",'Changed');
        mainPage
            .click('@isBuyerContractorsBtn')
            .assert.attributeContains('@isBuyerContractorsBtn','aria-pressed','true')
            .assertCellContainsText('dir_contractors','2','1',"Changed Contractor name");
    },
   'Delete Contractor': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .moveToCell('dir_contractors',2,1)
            .mouseButtonClick()
            .clickDeleteBtn('dir_contractors');
        browser.expect.element('#dir_contractors_TableDirContractors').text.to.not.contain('Changed').after(500);

       mainPage
           .click("@isSupplierContractorsBtn")
           .waitForElementVisible("@dir_contractors_TableDirContractors");
       browser.pause(500);
       mainPage.
           assert.containsText("@dir_contractors_TableDirContractors",'Поставщик 1');
       browser.expect.element('#dir_contractors_TableDirContractors').text.to.not.contain('Changed').after(500);
    },

};