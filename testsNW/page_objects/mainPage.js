var mainPageCommands= {
    assertHeaderContainsText: function (tableID, headerNumber, text) {
        this.elements.tableHeader = {
                selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_clone_top handsontable']//table[@class='htCore']//thead/tr[2]/th[" + headerNumber + "]",
                locateStrategy: 'xpath'
            };
        return this
            .waitForElementVisible("@tableHeader")
            .assert.containsText("@tableHeader", text);
    },
    assertCellContainsText: function (tableID, RowNumber, ColumnNumber, text) {
        this.elements.tableCell = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible("@tableCell")
            .assert.containsText("@tableCell", text);
    },
    clickCell: function (tableID, RowNumber, ColumnNumber) {
        this.elements.tableCell = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        return this
            //.moveToElement("@tableCell", 15, 15)
            .click("@tableCell");
    },

    assertTopButtonsVisible:function(tableID){
        this.elements.refreshBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Обновить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        this.elements.printBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Печатать')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible('@refreshBtn')
            .waitForElementVisible('@printBtn')
    },
    clickRefreshBtnInTable:function(tableID){
        this.elements.refreshBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Обновить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        return this.click("@refreshBtn");
    },
    assertActionPaneVisible: function (tableID) {
        var instance = this;
        instance.elements.actionPaneTitle = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Действия')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        instance.elements.addBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Добавить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        instance.elements.changeBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Изменить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        instance.elements.saveBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Сохранить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        instance.elements.deleteBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Удалить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        return instance
            .waitForElementPresent("@actionPaneTitle")
            .waitForElementPresent("@addBtn")
            .waitForElementPresent("@changeBtn")
            .waitForElementPresent("@saveBtn")
            .waitForElementPresent("@deleteBtn");
    },
    clickAddBtn:function(tableID){
        this.elements.addBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Добавить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        return this.click('@addBtn');
    },
    clickChangeBtn:function(tableID){
        this.elements.changeBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Изменить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        return this.click('@changeBtn');
    },
    clickSaveBtn:function(tableID){
        this.elements.saveBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Сохранить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        return this.click('@saveBtn');
    },
    clickDeleteBtn:function(tableID){
        this.elements.deleteBtn = {
            selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Удалить')]",                     //*[@id='"+tableID+"_ContentContainer']
            locateStrategy: 'xpath'
        };
        return this.click('@deleteBtn');
    },
    cellSetValue:function(tableID, RowNumber, ColumnNumber,value){
         var instance = this;
        this.elements.tableCell = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        this.moveToElement("@tableCell",15,15,function(){
            instance.api.doubleClick();
        });
        this.api.perform(function () {
            instance.api.keys(value);
        });
        return this;
    },
    moveToCell: function (tableID, RowNumber, ColumnNumber) {
        var instance = this;
        this.elements.tableCell = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        return instance
            .waitForElementVisible('@tableCell')
            .moveToElement("@tableCell", 15, 15);
    },
    mouseButtonClick: function (btn) {
        var instance = this;
        this.api.mouseButtonClick(btn);
        return instance;
    },
    doubleClick: function (btn) {
        var instance = this;
        this.api.doubleClick(btn);
        return instance;
    },
    mouseButtonDown: function (btn) {
        var instance = this;
        this.api.mouseButtonDown(btn);
        return instance;
    },
    mouseButtonUp: function (btn) {
        var instance = this;
        this.api.mouseButtonUp(btn);
        return instance;
    },
    changeTickBtnStatus: function (tableID, RowNumber, ColumnNumber) {
        var instance = this;
        this.api.perform(function () {console.log("changeNotUsedPropBtn");});
        this.elements.tickBtn = {
            selector: "//div[@id='" + tableID + "_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td["+ColumnNumber+"]//input[@type='checkbox']",
            locateStrategy: 'xpath'
        };
        instance
            .waitForElementVisible("@tickBtn")
            .moveToElement("@tickBtn", 5, 5, function () {
                instance.mouseButtonClick();
                instance.api.keys(' ');
            });
        return this;
    },
    pressPrintBtnForTableID: function (tableID) {
        var instance = this;
        this.api.perform(function () {console.log("pressPrintBtnForTableID");});
        this.elements.printBtn = {
            selector: '//div[@id="' + tableID + '_ContentContainer"]//span[contains(text(), "Печатать")]',
            locateStrategy: 'xpath'
        };
        instance
            .waitForElementVisible("@printBtn")
            .click("@printBtn");
        return this;
    }

};

module.exports = {
    commands: [mainPageCommands],
    url: 'http://localhost:8181',
    elements: {
        img: "#main_TopImg",
        mode: '#main_app_mode',
        main_username:"#main_username",


        mainMenuItem: '#main_MainMenu',                      //Главная стр
        menuBarPopupMenuMain: '#menuBarPopupMenuMain',       //Предприятие
        menuBarWrh:"#menuBarWrh",                            //Склад
        menuBarItemSalesCashier:"#menuBarItemSalesCashier",  //Отчеты кассира
        menuBarPopupMenuSales:"#menuBarPopupMenuSales",      //Продажи
        menuBarItemCloseItem: '#menuBarItemClose',            //Выход
        menuBarItemHelpAboutItem: '#menuBarItemHelpAbout',    //О программе

        aboutProgramDialog:"#DialogSimple",

        aboutProgramDialog_submitBtn:{
            selector:'//div[@id="DialogSimple"]//span[@class="dijitReset dijitInline dijitButtonText" and text()="OK"]',
            locateStrategy:'xpath'
        },
        aboutProgramDialog_cancelBtn:{
            selector:'//div[@id="DialogSimple"]//span[@class="dijitReset dijitInline dijitButtonText" and text()="Закрыть"]',
            locateStrategy:'xpath'
        },

        tablist_PageContentPane_mainPage:"#main_ContentContainer_tablist_PageContentPane_mainPage",
        mainpage_MainContent:"#mainpage_MainContent",

        menuBarPopupMenuMain_menu:"#menuBarPopupMenuMain_menu",
        menuBarDirsItemUnits:"#menuBarDirsItemUnits",
        menuBarDirsItemContractors:"#menuBarDirsItemContractors",
        menuBarDirsItemProducts:"#menuBarDirsItemProducts",


        main_ContentContainer_tablist_PageContentPane_dir_units:"#main_ContentContainer_tablist_PageContentPane_dir_units",  //tab dirunits
        closeTabMainDirUnits:{
            selector:'//span[@id="main_ContentContainer_tablist_PageContentPane_dir_units"] /ancestor::div/span[@title="Закрыть"]',
            locateStrategy:'xpath'
        },

        menuBarWrhPInvoice:"#menuBarWrhPInvoice",               //Приходные накладные
        menuBarWrhInvoice:"#menuBarWrhInvoice",                 //Расходные накладные
        menuBarWrhRetInvoice:"#menuBarWrhRetInvoice",           //Возвратные накладные
        menuBarWrhBalance:"#menuBarWrhBalance",                 //Остатки товара
        menuBarWrhMoves:"#menuBarWrhMoves",                     //Движение товаров

        menuBarSalesItemCashier:"#menuBarSalesItemCashier",

        dir_units_ContentContainer:"#dir_units_ContentContainer",
        dir_units_TableDirUnits:"#dir_units_TableDirUnits",

        usedDirUnitsBtn:{
            selector:'//div[@id="dir_units_TableDirUnits"] //span[contains(text(), "Используемые")]/ancestor::span[@role="button"]',
            locateStrategy:'xpath'
        },
        notUsedDirUnitsBtn:{
            selector:'//div[@id="dir_units_TableDirUnits"] //span[contains(text(), "Не используемые")]/ancestor::span[@role="button"]',
            locateStrategy:'xpath'
        },

        main_ContentContainer_tablist_PageContentPane_dir_contractors:"#main_ContentContainer_tablist_PageContentPane_dir_contractors", //tab contractors
        closeTabMainDirContractors:{
            selector:'//span[@id="main_ContentContainer_tablist_PageContentPane_dir_contractors"] /ancestor::div/span[@title="Закрыть"]',
            locateStrategy:'xpath'
        },
        dir_contractors_TableDirContractors:"#dir_contractors_TableDirContractors",

        isSupplierContractorsBtn:{
            selector:'//div[@id="dir_contractors_TableDirContractors"] //span[contains(text(), "Поставщики")]/ancestor::span[@role="button"]',
            locateStrategy:'xpath'
        },
        isBuyerContractorsBtn:{
            selector:'//div[@id="dir_contractors_TableDirContractors"] //span[contains(text(), "Покупатели")]/ancestor::span[@role="button"]',
            locateStrategy:'xpath'
        },
        otherContractorsBtn:{
            selector:'//div[@id="dir_contractors_TableDirContractors"] //span[contains(text(), "Прочие")]/ancestor::span[@role="button"]',
            locateStrategy:'xpath'
        },

        rightClickMenu:{
            selector: '//div[contains(text(),"Добавить строки")]/ancestor::div[@class="ht_master handsontable"]',
            locateStrategy: 'xpath'
        },
        rightClickAdd:{
            selector: "//div[contains(text(),'Добавить строки')]",
            locateStrategy: 'xpath'
        },
        rightClickChange:{
            selector: "//div[contains(text(),'Изменить строки')]",
            locateStrategy: 'xpath'
        },
        rightClickSave:{
            selector: "//div[contains(text(),'Сохранить строки')]",
            locateStrategy: 'xpath'
        }
    }
};