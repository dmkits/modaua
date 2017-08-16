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
    pressRefreshBtnInTable:function(tableID){
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
        //this.api.perform(function(){console.log("cellSetValue");});
        this.elements.tableCell = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        this.moveToElement("@tableCell",15,15)
            .api.doubleClick();
        this.api.keys(value);
        return this;
    },
    moveToCell: function (tableID, RowNumber, ColumnNumber) {
        var instance = this;
        this.elements.tableCell = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        return instance
            .moveToElement("@tableCell", 15, 15);
    },
    mouseButtonClick: function (btn) {
        var instance = this;
        this.api.mouseButtonClick(btn);
        return instance;
    },
    changeNotUsedPropBtn:function(tableID,RowNumber){
        var instance=this;
        this.api.perform(function(){console.log("changeNotUsedPropBtn");});
        this.elements.notUsedPropBtn = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[6]//input[@type='checkbox']",
            locateStrategy: 'xpath'
        };
        this
            .waitForElementVisible("@notUsedPropBtn")
            .moveToElement("@notUsedPropBtn",7,7,function(){
                instance.api.doubleClick();
                instance.expect.element('@notUsedPropBtn').to.have.attribute('checked').which.equal('true');
            });
        //this.api.perform(function(){
        //    instance.api.doubleClick();
        //});
       // this.api.doubleClick();
       // this.api.perform(function(){
       //     instance.expect.element('@notUsedPropBtn').to.have.attribute('checked').which.equal('true');
       // });
        //this.expect.element('@notUsedPropBtn').to.have.attribute('checked').which.equal('true');
        return this;
    },
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


        main_ContentContainer_tablist_PageContentPane_dir_units:"#main_ContentContainer_tablist_PageContentPane_dir_units",
        closeTabMainDirUnits:{
            selector:'//span[@id="main_ContentContainer_tablist_PageContentPane_dir_units"] /ancestor::div/span[@title="Закрыть"]',
            locateStrategy:'xpath'
        },

        main_ContentContainer_tablist_PageContentPane_dir_contractors:"#main_ContentContainer_tablist_PageContentPane_dir_contractors",
        closeTabMainDirContractors:{
            selector:'//span[@id="main_ContentContainer_tablist_PageContentPane_dir_contractors"] /ancestor::div/span[@title="Закрыть"]',
            locateStrategy:'xpath'
        },

        menuBarWrhPInvoice:"#menuBarWrhPInvoice",
        menuBarWrhInvoice:"#menuBarWrhInvoice",
        menuBarWrhRetInvoice:"#menuBarWrhRetInvoice",
        menuBarWrhBalance:"#menuBarWrhBalance",
        menuBarWrhMoves:"#menuBarWrhMoves",

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
//*[@id="dijit_form_ToggleButton_0_label"]
        finishedContentPane:"#finish"
    }
};