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
        var instance=this;
        this.elements.tableCell = {
            selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        return this
            .clearValue("@tableCell",function(){

        })
            .setValue("@tableCell",value);
    }
};

module.exports = {
    commands: [mainPageCommands],
    url: 'http://localhost:8181',
    elements: {
        img: "#main_TopImg",
        mode: '#main_app_mode',
        main_username:"#main_username",


        mainMenuItem: '#main_MainMenu',
        menuBarPopupMenuMain: '#menuBarPopupMenuMain',
        menuBarWrh:"#menuBarWrh",
        menuBarPopupMenuSales:"#menuBarPopupMenuSales",
        menuBarItemCloseItem: '#menuBarItemClose',
        menuBarItemHelpAboutItem: '#menuBarItemHelpAbout',

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
        finishedContentPane:"#finish"
    }
};