var retInvsCommands= {
    assertHeaderContainsText: function (headerNumber, text) {
        this.elements.tableHeader = {
            selector: "//div[@id='wrh_ret_inv_ProductsTable']//div[@class='ht_clone_top handsontable']//table[@class='htCore']//thead/tr[2]/th[" + headerNumber + "]",
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible("@tableHeader")
            .assert.containsText("@tableHeader", text);
    }

    ,assertCellContainsText: function (tableID, RowNumber, ColumnNumber, text) {
        this.elements.tableCell = {
            selector: "//div[@id='wrh_ret_inv_ProductsTable']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible("@tableCell")
            .assert.containsText("@tableCell", text);
    },

    assertLeftContainerHeaderContainsText: function (headerNumber, text) {
        this.elements.tableHeader = {
            selector:'//div[@id="wrh_ret_inv_ListContainer"]//div[2]//div[@class="ht_clone_top handsontable"]//thead/tr[2]/th['+headerNumber+']',
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementPresent("@tableHeader")
            .assert.containsText("@tableHeader", text);
    },

    assertLeftContainerCellContainsText: function (rowNumber,headerNumber, text) {
        this.elements.tableCell = {
            selector:'//div[@id="wrh_ret_inv_ListContainer"]//div[2]//div[@class="ht_master handsontable"]//tbody/tr['+rowNumber+']/td['+headerNumber+']',
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementPresent("@tableCell")
            .assert.containsText("@tableCell", text);
    },

    assertLeftContainerTableisEmpty: function () {

        this.api.perform(function () {
            console.log("assertLeftContainerTableisEmpty");
        });

        this.elements.tableCell = {
            selector:'//div[@id="wrh_ret_inv_ListContainer"]//div[2]//div[@class="ht_master handsontable"]//tbody/tr[1]/td[1]',
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementNotPresent("@tableCell");
        //.assert.elementNotPresent("@tableCell");
    },

    selectLeftContainerTableRow: function (rowNumber) {
        this.api.perform(function () {
            console.log("selectLeftContainerTableRow");
        });

        this.elements.tableCell = {
            selector:'//div[@id="wrh_ret_inv_ListContainer"]//div[2]//div[@class="ht_master handsontable"]//tbody/tr['+rowNumber+']/td[1]',
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementPresent("@tableCell")
            .moveToElement('@tableCell',5,5)
            .mouseButtonClick();
    },

    showFullLeftContainer:function(){
        return this.waitForElementPresent('@splitter')
            .moveToElement('@splitter',2,2)
            .mouseButtonDown(0)
            .moveToElement('@wrh_ret_inv_PageContainer',900,100)           //990
            .mouseButtonUp(0);
    },

    showFullDetailContainer:function(){
        return this.waitForElementPresent('@splitter')
            .moveToElement('@splitter',2,2)
            .mouseButtonDown(0)
            .moveToElement('@wrh_ret_inv_PageContainer',120,100)
            .mouseButtonUp(0);
    },

    selectCurrencyFromList:function(FullCurrencyLabelName){
        var instance=this;
        instance.api.useXpath();
        instance.getAttribute('//div[@id="wrh_ret_inv_DetailHeader"]/table[3]/tbody/tr/td[2]/table',"aria-owns",function(result){
            instance.api.perform(function () {
                console.log("selectCurrencyFromList result=",result);
            });
            instance.elements.currencyInSelector = {
                    selector:'//table[@id="'+result.value+'"]//tr[@aria-label="'+FullCurrencyLabelName+'"]',
                    locateStrategy: 'xpath'
                };
                instance
                    .waitForElementVisible("@currencyInSelector")
                    .click("@currencyInSelector");
               instance.api.useCss();
            });
        return this;
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
    mouseButtonClick: function (btn) {
        var instance = this;
        this.api.mouseButtonClick(btn);
        return instance;
    },
    doubleClick: function (btn) {
        var instance = this;
        this.api.doubleClick(btn);
        return instance;
    }
};

module.exports = {
    commands: [retInvsCommands],
    elements: {
        wrh_ret_inv_DetailHeader:"#wrh_ret_inv_DetailHeader",
        detailHeaderTitle:{
            selector:'//div[@id="wrh_ret_inv_DetailHeader"]/table[1]/tbody/tr/th[1]',
            locateStrategy:'xpath'
        },

        wrh_ret_inv_PageContainer:"#wrh_ret_inv_PageContainer",

        splitter:'#wrh_ret_inv_ListContainer_splitter',

        refreshBtn:{
            selector:'//div[@id="wrh_ret_inv_DetailHeader"]//span[text()="Обновить"]',
            locateStrategy:'xpath'
        },

        printBtn: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[1]/tbody/tr/th[3]//span[text()="Печатать"]',
            locateStrategy: 'xpath'
        },

        pickUpUnitLabel: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[2]/tbody/tr/td[1]/label',
            locateStrategy: 'xpath'
        },
        pickUpUnitInput: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[2]/tbody/tr/td[1]/table//input[@role="presentation"]/ancestor::tr',
            locateStrategy: 'xpath'
        },

        dateLabel: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[2]/tbody/tr/td[3]/label',
            locateStrategy: 'xpath'
        },
        dateInput: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[2]/tbody/tr/td[3]/table//input[@role="combobox"]',
            locateStrategy: 'xpath'
        },

        buyerLabel: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[3]/tbody/tr/td[1]/label',
            locateStrategy: 'xpath'
        },
        buyerInput: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[3]/tbody/tr/td[1]/table//span[@role="option"]',
            locateStrategy: 'xpath'
        },
        currencyLabel: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[3]/tbody/tr/td[2]/label',
            locateStrategy: 'xpath'
        },
        currencyInput: {
            selector: '//div[@id="wrh_ret_inv_DetailHeader"]/table[3]/tbody/tr/td[2]/table//span[@role="option"]',
            locateStrategy: 'xpath'
        },

        createNewRetInvBtn:{
            selector: '//div[@id="wrh_ret_inv_RightContainer"]//span[text()="Новая накладная"]',
            locateStrategy:'xpath'
        },
        saveNewRetInvBtn: {
            selector: '//div[@id="wrh_ret_inv_RightContainer"]//span[text()="Сохранить накладную"]',
            locateStrategy: 'xpath'
        },
        deleteRetInvBtn: {
            selector: '//div[@id="wrh_ret_inv_RightContainer"]//span[text()="Удалить накладную"]',
            locateStrategy: 'xpath'
        },

        leftContainerHeading:{
            selector: '//div[@id="wrh_ret_inv_ListContainer"]//div[1]/table[1]//th',
            locateStrategy:'xpath'
        },
    }
};