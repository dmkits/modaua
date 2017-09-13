var pinvsCommands= {
    assertHeaderContainsText: function (headerNumber, text) {
        this.elements.tableHeader = {
            selector: "//div[@id='wrh_pinv_ProductsTable']//div[@class='ht_clone_top handsontable']//table[@class='htCore']//thead/tr[2]/th[" + headerNumber + "]",
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible("@tableHeader")
            .assert.containsText("@tableHeader", text);
    }

    ,assertCellContainsText: function (tableID, RowNumber, ColumnNumber, text) {
        this.elements.tableCell = {
            selector: "//div[@id='wrh_pinv_ProductsTable']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible("@tableCell")
            .assert.containsText("@tableCell", text);
    },
    //clickCell: function (tableID, RowNumber, ColumnNumber) {
    //    this.elements.tableCell = {
    //        selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
    //        locateStrategy: 'xpath'
    //    };
    //    return this
    //        //.moveToElement("@tableCell", 15, 15)
    //        .click("@tableCell");
    //},
    //
    //assertTopButtonsVisible:function(tableID){
    //    this.elements.refreshBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Обновить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    this.elements.printBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Печатать')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    return this
    //        .waitForElementVisible('@refreshBtn')
    //        .waitForElementVisible('@printBtn')
    //},
    //clickRefreshBtnInTable:function(tableID){
    //    this.elements.refreshBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Обновить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    return this.click("@refreshBtn");
    //},
    //assertActionPaneVisible: function (tableID) {
    //    var instance = this;
    //    instance.elements.actionPaneTitle = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Действия')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    instance.elements.addBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Добавить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    instance.elements.changeBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Изменить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    instance.elements.saveBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Сохранить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    instance.elements.deleteBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Удалить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    return instance
    //        .waitForElementPresent("@actionPaneTitle")
    //        .waitForElementPresent("@addBtn")
    //        .waitForElementPresent("@changeBtn")
    //        .waitForElementPresent("@saveBtn")
    //        .waitForElementPresent("@deleteBtn");
    //},
    //clickAddBtn:function(tableID){
    //    this.elements.addBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Добавить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    return this.click('@addBtn');
    //},
    //clickChangeBtn:function(tableID){
    //    this.elements.changeBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Изменить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    return this.click('@changeBtn');
    //},
    //clickSaveBtn:function(tableID){
    //    this.elements.saveBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Сохранить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    return this.click('@saveBtn');
    //},
    //clickDeleteBtn:function(tableID){
    //    this.elements.deleteBtn = {
    //        selector: "//*[@id='"+tableID+"_ContentContainer']//span[contains(text(),'Удалить')]",                     //*[@id='"+tableID+"_ContentContainer']
    //        locateStrategy: 'xpath'
    //    };
    //    return this.click('@deleteBtn');
    //},
    //cellSetValue:function(tableID, RowNumber, ColumnNumber,value){
    //    var instance = this;
    //    this.elements.tableCell = {
    //        selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
    //        locateStrategy: 'xpath'
    //    };
    //    this.moveToElement("@tableCell",15,15,function(){
    //        instance.api.doubleClick();
    //    });
    //    this.api.perform(function () {
    //        instance.api.keys(value);
    //    });
    //    return this;
    //},
    //moveToCell: function (tableID, RowNumber, ColumnNumber) {
    //    var instance = this;
    //    this.elements.tableCell = {
    //        selector: "//div[@id='"+tableID+"_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
    //        locateStrategy: 'xpath'
    //    };
    //    return instance
    //        .waitForElementVisible('@tableCell')
    //        .moveToElement("@tableCell", 15, 15);
    //},
    //mouseButtonClick: function (btn) {
    //    var instance = this;
    //    this.api.mouseButtonClick(btn);
    //    return instance;
    //},
    //doubleClick: function (btn) {
    //    var instance = this;
    //    this.api.doubleClick(btn);
    //    return instance;
    //},
    //mouseButtonDown: function (btn) {
    //    var instance = this;
    //    this.api.mouseButtonDown(btn);
    //    return instance;
    //},
    //mouseButtonUp: function (btn) {
    //    var instance = this;
    //    this.api.mouseButtonUp(btn);
    //    return instance;
    //},
    //changeTickBtnStatus: function (tableID, RowNumber, ColumnNumber) {
    //    var instance = this;
    //    this.api.perform(function () {console.log("changeNotUsedPropBtn");});
    //    this.elements.tickBtn = {
    //        selector: "//div[@id='" + tableID + "_ContentContainer']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td["+ColumnNumber+"]//input[@type='checkbox']",
    //        locateStrategy: 'xpath'
    //    };
    //    instance
    //        .waitForElementVisible("@tickBtn")
    //        .moveToElement("@tickBtn", 5, 5, function () {
    //            instance.mouseButtonClick();
    //            instance.api.keys(' ');
    //        });
    //    return this;
    //},
    //pressPrintBtnForTableID: function (tableID) {
    //    var instance = this;
    //    this.api.perform(function () {console.log("pressPrintBtnForTableID");});
    //    this.elements.printBtn = {
    //        selector: '//div[@id="' + tableID + '_ContentContainer"]//span[contains(text(), "Печатать")]',
    //        locateStrategy: 'xpath'
    //    };
    //    instance
    //        .waitForElementVisible("@printBtn")
    //        .click("@printBtn");
    //    return this;
    //}
};

module.exports = {
    commands: [pinvsCommands],
    elements: {
        wrh_pinv_DetailHeader:"#wrh_pinv_DetailHeader",
        detailHeaderTitle:{
            selector:'//div[@id="wrh_pinv_DetailHeader"]/table[1]/tbody/tr/th[1]',
            locateStrategy:'xpath'
        },

        refreshBtn:{
            selector:'//div[@id="wrh_pinv_DetailHeader"]//span[text()="Обновить"]',
            locateStrategy:'xpath'
        },

        printBtn: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[1]/tbody/tr/th[3]//span[text()="Печатать"]',
            locateStrategy: 'xpath'
        },

        pickUpUnitLabel: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[2]/tbody/tr/td[1]/label',
            locateStrategy: 'xpath'
        },
        pickUpUnitInput: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[2]/tbody/tr/td[1]/table//input[@role="presentation"]/ancestor::tr',
            locateStrategy: 'xpath'
        },

        dateLabel: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[2]/tbody/tr/td[3]/label',
            locateStrategy: 'xpath'
        },
        dateInput: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[2]/tbody/tr/td[3]/table//input[@role="combobox"]',
            locateStrategy: 'xpath'
        },

        supplierLabel: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[3]/tbody/tr/td[1]/label',
            locateStrategy: 'xpath'
        },
        supplierInput: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[3]/tbody/tr/td[1]/table//span[@role="option"]',
            locateStrategy: 'xpath'
        },
        currencyLabel: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[4]/tbody/tr/td[1]/label',
            locateStrategy: 'xpath'
        },
        currencyInput: {
            selector: '//div[@id="wrh_pinv_DetailHeader"]/table[4]/tbody/tr/td[1]/table//span[@role="option"]',
            locateStrategy: 'xpath'
        },

        createNewPinvBtn:{
            selector: '//div[@id="wrh_pinv_RightContainer"]//span[text()="Новая накладная"]',

            locateStrategy:'xpath'
        },
        saveNewPinvBtn: {
            selector: '//div[@id="wrh_pinv_RightContainer"]//span[text()="Сохранить накладную"]',
            locateStrategy: 'xpath'
        },


        leftContainerHeading:{
            selector: '//div[@id="wrh_pinv_ListContainer"]//div[1]/table[1]//th',
            locateStrategy:'xpath'
        }
    }
};