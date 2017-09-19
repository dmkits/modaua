
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
  /* 'step_1.1 Validate DB': function (browser) {
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
            //.assert.visible('@createDBBtn')
            .click('@createDBBtn')
            //.assertAdminDialogIsEmpty()
            .authorizeAsAdmin()
            .waitForElementVisible('@createDBResultField')
            .assert.containsText('@createDBResultField', 'Database created!');


        sysadminHeader
            .waitForElementVisible('@btnDatabase')
            .click('@btnDatabase');
        database
           // .waitForElementVisible('@currentChangesTable')  //refresh
            .clickRefreshBtn('@currentChangesTable')
            .waitForElementVisible('@currentChangesTable')
            .moveToCell('@currentChangesTable', 1, 1)
            .mouseButtonClick('right')
            .waitForElementVisible('@applyAllChangesDialog')
            .click('@applyAllChangesDialog');
        browser.pause(180000);

        sysadminHeader  //dbValidateState
            .assert.containsText('@dbValidateState','success')
            .click("@logoutBtn");
    },
*/
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

  /* 'step_3 Main Header If  All Elements Visible Tests': function (browser) {

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
            .waitForElementPresent("@menuBarWrhPInvoice")
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
            .assertCellContainsText('dir_contractors','1','4',"")
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



    'Right click menu tests add and save new rows': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .click('@menuBarPopupMenuMain')
            .waitForElementVisible('@menuBarDirsItemUnits')
            .click('@menuBarDirsItemUnits')
            .moveToCell('dir_units',1,1)
            .mouseButtonDown('left')
            .moveToCell('dir_units',2,1)
            .mouseButtonUp('left')
            .mouseButtonClick('right')
            .waitForElementVisible('@rightClickMenu')
            .click('@rightClickAdd')
            .cellSetValue('dir_units','4','1',"Name_4")
            .cellSetValue('dir_units','4','2',"FULL_Name_4")
            .cellSetValue('dir_units','4','3',"Note_4")
            .cellSetValue('dir_units','4','4',"City_4")
            .cellSetValue('dir_units','4','5',"Address_4")

            .cellSetValue('dir_units','3','1',"Name_3")
            .cellSetValue('dir_units','3','2',"FULL_Name_3")
            .cellSetValue('dir_units','3','3',"Note_3")
            .cellSetValue('dir_units','3','4',"City_3")
            .cellSetValue('dir_units','3','5',"Address_3")

          //  .moveToCell('dir_units',3,1)
            .mouseButtonClick('right')
            .waitForElementVisible('@rightClickMenu')
            .click('@rightClickSave')

            .moveToCell('dir_units',4,1)
            .mouseButtonClick('right')
            .waitForElementVisible('@rightClickMenu')
            .click('@rightClickSave')
            .clickRefreshBtnInTable('dir_units')
            .assert.containsText('@dir_units_TableDirUnits', "Name_4")
            .assert.containsText('@dir_units_TableDirUnits', "Name_3")

    },
  'Right click menu change rows': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .moveToCell('dir_units',3,1)
            .mouseButtonDown('left')
            .moveToCell('dir_units',4,1)
            .mouseButtonUp('left')
            .mouseButtonClick('right')
            .waitForElementVisible('@rightClickMenu')
            .click('@rightClickChange')
            .cellSetValue('dir_units','4','1',"Name_4C")
            .cellSetValue('dir_units','4','2',"FULL_Name_4C")
            .cellSetValue('dir_units','4','3',"Note_4C")
            .cellSetValue('dir_units','4','4',"City_4C")
            .cellSetValue('dir_units','4','5',"Address_4C")

            .cellSetValue('dir_units','3','1',"Name_3C")
            .cellSetValue('dir_units','3','2',"FULL_Name_3C")
            .cellSetValue('dir_units','3','3',"Note_3C")
            .cellSetValue('dir_units','3','4',"City_3C")
            .cellSetValue('dir_units','3','5',"Address_3C")

            //  .moveToCell('dir_units',3,1)
            .mouseButtonClick('right')
            .waitForElementVisible('@rightClickMenu')
            .click('@rightClickSave')

            .moveToCell('dir_units',4,1)
            .mouseButtonClick('right')
            .waitForElementVisible('@rightClickMenu')
            .click('@rightClickSave')
            .clickRefreshBtnInTable('dir_units')
            .assert.containsText('@dir_units_TableDirUnits', "Name_4C")
            .assert.containsText('@dir_units_TableDirUnits', "Name_3C")
    },
    'Right click menu delete rows': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .moveToCell('dir_units',4,1)
            .mouseButtonClick()
            .clickDeleteBtn('dir_units')

            .moveToCell('dir_units',3,1)
            .mouseButtonClick()
            .clickDeleteBtn('dir_units');

        browser.expect.element('#dir_units_TableDirUnits').text.to.not.contain('Name_4C').after(500);
        browser.expect.element('#dir_units_TableDirUnits').text.to.not.contain('Name_3C').after(500);
    },

    'Print table tests': function (browser) {
        var mainPage = browser.page.mainPage();
        mainPage
            .pressPrintBtnForTableID('dir_units');
        browser
        .windowHandles(function(result) {
            var newWindow;
            this.verify.equal(result.value.length, 2, 'There should be 2 windows   open');
            newWindow = result.value[1];
            this.switchWindow(newWindow);
            this.verify.urlContains('http://localhost:8181/print/printSimpleDocument');
        });


        var printTable = browser.page.printTable();
        printTable
            .waitForElementVisible('@tableTitle')   //tableBottom
            .assert.containsText('@tableTitle','Подразделения')
            .waitForElementVisible('@tableBottom')
            .assert.containsText('@tableBottom','ИТОГО строк:')
            .assert.containsText('@tableBottom','2')

            .assertDataTableHeaderContainsText(1,"Наименование")
            .assertDataTableHeaderContainsText(2,"Полное наименование")
            .assertDataTableHeaderContainsText(3,"Примечание")
            .assertDataTableHeaderContainsText(4,"Город")
            .assertDataTableHeaderContainsText(5,"Адрес")
            .assertDataTableHeaderContainsText(6,"Не используется")

            .assertDataTableCellContainsText(1,1,"Гл.офис")
            .assertDataTableCellContainsText(1,2,"офис")
            .assertDataTableCellContainsText(1,3,"офис")
            .assertDataTableCellContainsText(1,4,"Днипро")
            .assertDataTableCellContainsText(1,5,"Днипро")
            .assertDataTableCellContainsText(1,6,"0")

            .assertDataTableCellContainsText(2,1,"Магазин 1")
            .assertDataTableCellContainsText(2,2,"Магазин 1")
            .assertDataTableCellContainsText(2,3,"Магазин 1")
            .assertDataTableCellContainsText(2,4,"Днипро")
            .assertDataTableCellContainsText(2,5,"Днипро")
            .assertDataTableCellContainsText(2,6,"0");

        browser
            .windowHandles(function(result) {
                var oldWindow;
                this.verify.equal(result.value.length, 2, 'There should be 2 windows   open');
                oldWindow = result.value[0];
                this.switchWindow(oldWindow);
                this.verify.urlEquals('http://localhost:8181/');
            });
    }
   */

    /*
    'Open pinvs table': function (browser) {
        var mainPage = browser.page.mainPage();
        var pinvs = browser.page.pinvs();
        mainPage
            .waitForElementVisible('@menuBarWrh')
            .click('@menuBarWrh')
            .waitForElementVisible('@menuBarWrhPInvoice')
            .click('@menuBarWrhPInvoice');
        pinvs
            .waitForElementVisible('@wrh_pinv_DetailHeader');

    },
    'Pinvs check if DetailHeader elements are visible': function (browser) {
        var pinvs = browser.page.pinvs();
        pinvs
            .waitForElementVisible('@detailHeaderTitle')
            .assert.containsText("@detailHeaderTitle","не выбрана")
            .waitForElementVisible('@leftContainerHeading')
            .assert.containsText("@leftContainerHeading","Список накладных")
            .waitForElementVisible('@refreshBtn')
            .waitForElementVisible('@printBtn')
            .assert.visible('@pickUpUnitLabel')
            .assert.containsText("@pickUpUnitLabel","Подразделение")
            .assert.visible('@dateLabel')
            .assert.containsText("@dateLabel","Дата")
            .assert.visible('@supplierLabel')
            .assert.containsText("@supplierLabel","Поставщик")
            .assert.visible('@currencyLabel')
            .assert.containsText("@currencyLabel","Валюта");
    },

    'assert Pinvs  Header Contains Text': function (browser) {
        var pinvs = browser.page.pinvs();
        pinvs
            .assertHeaderContainsText("1","Номер п/п")
            .assertHeaderContainsText("2","Код товара")
            .assertHeaderContainsText("3","Товар")
            .assertHeaderContainsText("4","Ед.изм.")
            .assertHeaderContainsText("5","Кол-во")
            .assertHeaderContainsText("6","Цена")
            .assertHeaderContainsText("7","Сумма")
            .assertHeaderContainsText("8","Коэфф.")
            .assertHeaderContainsText("9","Цена продажи")
            .assertHeaderContainsText("10","Цена по прайс-листу");

    },

    'create new pinv': function (browser) {
        var pinvs = browser.page.pinvs();

        pinvs
            .waitForElementVisible('@createNewPinvBtn')
            .click('@createNewPinvBtn');
        browser.
            pause(1000);
        pinvs
            .assert.containsText("@detailHeaderTitle","Новая приходная накладная")
            .assert.containsText("@pickUpUnitInput","офис")
            .assert.containsText("@supplierInput","Поставщик")
            .assert.containsText("@currencyInput","UAH (Украинская гривна)")
            .waitForElementVisible('@saveNewPinvBtn')
            .click("@saveNewPinvBtn");

        browser.
            pause(1000);
    ;}

    ,'Assert new pinv added to left container': function (browser) {
        var pinvs = browser.page.pinvs();

        pinvs
            .showFullLeftContainer()
            .waitForElementVisible('@leftContainerHeading')
            .assert.containsText("@leftContainerHeading","Список накладных")
            .assertLeftContainerHeaderContainsText('1','Номер')
            .assertLeftContainerHeaderContainsText('2','Дата')
            .assertLeftContainerHeaderContainsText('3','Подразделение')
            .assertLeftContainerHeaderContainsText('4','Поставщик')
            .assertLeftContainerHeaderContainsText('5','Номер заказа поставщика')
            .assertLeftContainerHeaderContainsText('6','Номер накл. поставщика')
            .assertLeftContainerHeaderContainsText('7','Коллекция')
            .assertLeftContainerHeaderContainsText('8','Кол-во')
            .assertLeftContainerHeaderContainsText('9','Сумма')
            .assertLeftContainerHeaderContainsText('10','Валюта')
            .assertLeftContainerHeaderContainsText('11','Статус')

            .assertLeftContainerCellContainsText('1','1','1')
            .assertLeftContainerCellContainsText('1','2','14.09.17')
            .assertLeftContainerCellContainsText('1','3','Гл.офис')
            .assertLeftContainerCellContainsText('1','4','Поставщик 1')
            .assertLeftContainerCellContainsText('1','7','коллекция 1 2017')
            .assertLeftContainerCellContainsText('1','8','0')
            .assertLeftContainerCellContainsText('1','9','0,00')
            .assertLeftContainerCellContainsText('1','10','UAH')
            .assertLeftContainerCellContainsText('1','11','Документ сохранен')

        ;}

    ,'change pinv and save changes': function (browser) {
        var pinvs = browser.page.pinvs();

        pinvs
            .showFullDetailContainer()
            .moveToElement('@currencyInput',5,5)
            .doubleClick()
            .waitForElementVisible("@currencyUSDinList")
            .click("@currencyUSDinList")
            .waitForElementVisible("@saveNewPinvBtn")
            .click("@saveNewPinvBtn")
            .showFullLeftContainer();
        browser
            .pause(1000);
        pinvs
            .assertLeftContainerCellContainsText('1','10','USD')
        ;}

    ,'create second pinv': function (browser) {
        var pinvs = browser.page.pinvs();

        pinvs
            .showFullDetailContainer()
            .waitForElementVisible('@createNewPinvBtn')
            .click('@createNewPinvBtn');
        pinvs
            .assert.containsText("@detailHeaderTitle", "Новая приходная накладная")
            .assert.containsText("@pickUpUnitInput", "офис")
            .assert.containsText("@supplierInput", "Поставщик")
            .assert.containsText("@currencyInput", "UAH (Украинская гривна)")
            .waitForElementVisible('@saveNewPinvBtn')
            .click("@saveNewPinvBtn");
    }

    ,'Assert second pinv added to left container': function (browser) {
        var pinvs = browser.page.pinvs();

        pinvs
            .showFullLeftContainer()
            .assertLeftContainerCellContainsText('2','1','2')
            .assertLeftContainerCellContainsText('2','2','14.09.17')
            .assertLeftContainerCellContainsText('2','3','Гл.офис')
            .assertLeftContainerCellContainsText('2','4','Поставщик 1')
            .assertLeftContainerCellContainsText('2','7','коллекция 1 2017')
            .assertLeftContainerCellContainsText('2','8','0')
            .assertLeftContainerCellContainsText('2','9','0,00')
            .assertLeftContainerCellContainsText('2','10','UAH')
            .assertLeftContainerCellContainsText('2','11','Документ сохранен')
        ;}

    ,"delete pinv num 1 and assert it doesn't exists": function (browser) {
        var pinvs = browser.page.pinvs();
        pinvs
            .selectLeftContainerTableRow('1')
            .click('@deletePinvBtn')
            .assertLeftContainerCellContainsText('1','1','2')
            .selectLeftContainerTableRow('1')
            .click('@deletePinvBtn')
            .assertLeftContainerTableisEmpty();

        ;},

    */
    ///////////////////////////////////////////////

    'Open invs table': function (browser) {
        var mainPage = browser.page.mainPage();
        var invs = browser.page.invs();
        mainPage
            .waitForElementVisible('@menuBarWrh')
            .click('@menuBarWrh')
            .waitForElementVisible('@menuBarWrhInvoice')
            .click('@menuBarWrhInvoice');
        invs
            .waitForElementVisible('@wrh_inv_DetailHeader');

    },

    'Invs check if DetailHeader elements are visible': function (browser) {
        var invs = browser.page.invs();
        invs
            .waitForElementVisible('@detailHeaderTitle')
            .assert.containsText("@detailHeaderTitle","не выбрана")
            .waitForElementVisible('@leftContainerHeading')
            .assert.containsText("@leftContainerHeading","Список накладных")
            .waitForElementVisible('@refreshBtn')
            .waitForElementVisible('@printBtn')
            .assert.visible('@pickUpUnitLabel')
            .assert.containsText("@pickUpUnitLabel","Подразделение")
            .assert.visible('@dateLabel')
            .assert.containsText("@dateLabel","Дата")
            .assert.visible('@buyerLabel')
            .assert.containsText("@buyerLabel","Покупатель")
            .assert.visible('@currencyLabel')
            .assert.containsText("@currencyLabel","Валюта");
    },

    'assert Invs  Header Contains Text': function (browser) {
        var invs = browser.page.invs();
        invs
            .assertHeaderContainsText("1","Номер п/п")
            .assertHeaderContainsText("2","Код товара")
            .assertHeaderContainsText("3","Товар")
            .assertHeaderContainsText("4","Ед.изм.")
            .assertHeaderContainsText("5","Кол-во")
            .assertHeaderContainsText("6","Цена")
            .assertHeaderContainsText("7","Сумма")
            .assertHeaderContainsText("8","Коэфф.")
            .assertHeaderContainsText("9","Цена продажи")
            .assertHeaderContainsText("10","Цена по прайс-листу");

    },

    'create new pinv': function (browser) {
        var invs = browser.page.invs();

        invs
            .waitForElementVisible('@createNewInvBtn')
            .click('@createNewInvBtn');
        browser.
            pause(1000);
        invs
            .assert.containsText("@detailHeaderTitle","Новая расходная накладная")
            .assert.containsText("@pickUpUnitInput","офис")
            .assert.containsText("@buyerInput","Розничный покупатель")
            .assert.containsText("@currencyInput","UAH (Украинская гривна)")
            .waitForElementVisible('@saveNewInvBtn')
            .click("@saveNewInvBtn");

        browser.
            pause(1000);
        ;}

    ,'Assert new inv added to left container': function (browser) {
        var invs = browser.page.invs();

        invs
            .showFullLeftContainer()
            .waitForElementVisible('@leftContainerHeading')
            .assert.containsText("@leftContainerHeading","Список накладных")
            .assertLeftContainerHeaderContainsText('1','Номер')
            .assertLeftContainerHeaderContainsText('2','Дата')
            .assertLeftContainerHeaderContainsText('3','Подразделение')
            .assertLeftContainerHeaderContainsText('4','Покупатель')
            .assertLeftContainerHeaderContainsText('5','Кол-во')
            .assertLeftContainerHeaderContainsText('6','Сумма')
            .assertLeftContainerHeaderContainsText('7','Валюта')
            .assertLeftContainerHeaderContainsText('8','Статус')

            .assertLeftContainerCellContainsText('1','1','1')
            .assertLeftContainerCellContainsText('1','2','19.09.17')
            .assertLeftContainerCellContainsText('1','3','Гл.офис')
            .assertLeftContainerCellContainsText('1','4','Розничный покупатель')
            .assertLeftContainerCellContainsText('1','5','0')
            .assertLeftContainerCellContainsText('1','6','0,00')
            .assertLeftContainerCellContainsText('1','7','UAH')
            .assertLeftContainerCellContainsText('1','8','Документ сохранен')

        ;}

    ,'change inv and save changes': function (browser) {
        var invs = browser.page.invs();

        invs
            .showFullDetailContainer()
            .moveToElement('@currencyInput',5,5)
            .doubleClick()
            .waitForElementVisible("@currencyUSDinList")
            .click("@currencyUSDinList")
            .waitForElementVisible("@saveNewInvBtn")
            .click("@saveNewInvBtn")
            .showFullLeftContainer();
        browser
            .pause(1000);
        invs
            .assertLeftContainerCellContainsText('1','7','USD')
        ;}

    ,'create second inv': function (browser) {
        var invs = browser.page.invs();

        invs
            .showFullDetailContainer()
            .waitForElementVisible('@createNewInvBtn')
            .click('@createNewInvBtn');
        invs
            .assert.containsText("@detailHeaderTitle", "Новая расходная накладная")
            .assert.containsText("@pickUpUnitInput", "офис")
            .assert.containsText("@buyerInput", "Розничный покупатель")
            .assert.containsText("@currencyInput", "UAH (Украинская гривна)")
            .waitForElementVisible('@saveNewInvBtn')
            .click("@saveNewInvBtn");
    }

    ,'Assert second inv added to left container': function (browser) {
        var invs = browser.page.invs();

        invs
            .showFullLeftContainer()
            .assertLeftContainerCellContainsText('2','1','2')
            .assertLeftContainerCellContainsText('2','2','19.09.17')
            .assertLeftContainerCellContainsText('2','3','Гл.офис')
            .assertLeftContainerCellContainsText('2','4','Розничный покупатель')
            .assertLeftContainerCellContainsText('2','5','0')
            .assertLeftContainerCellContainsText('2','6','0,00')
            .assertLeftContainerCellContainsText('2','7','UAH')
            .assertLeftContainerCellContainsText('2','8','Документ сохранен')
        ;}

    ,"delete invs  and assert they don't exists": function (browser) {
        var invs = browser.page.invs();
        invs
            .selectLeftContainerTableRow('1')
            .click('@deleteInvBtn');
        browser.pause(1000);
        invs
            .assertLeftContainerCellContainsText('1','1','2')
            .selectLeftContainerTableRow('1')
            .click('@deleteInvBtn')
            .assertLeftContainerTableisEmpty();
        ;}


    //,'Logout': function (browser) {
    //    var mainPage = browser.page.mainPage();
    //    var loginPage = browser.page.loginPage();
    //
    //    mainPage
    //    .waitForElementVisible("@menuBarItemCloseItem")
    //        .click('@menuBarItemCloseItem');
    //    loginPage
    //        .waitForElementVisible("@loginDialog");
    //}
};