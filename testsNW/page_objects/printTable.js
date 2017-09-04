var printPageCommands = {
    assertDataTableHeaderContainsText: function (colNumber,text) {
        this.elements.tableHeader = {
            selector:'//*[@id="print_PrintContent"]/div[2]/table/thead/tr/th['+colNumber+']',
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible("@tableHeader")
            .assert.containsText("@tableHeader", text);
    },
    assertDataTableCellContainsText: function (RowNumber, ColumnNumber, text) {
        this.elements.tableCell = {
            selector: '//*[@id="print_PrintContent"]/div[2]/table/tbody/tr['+RowNumber+']/td['+ColumnNumber+']',
            locateStrategy: 'xpath'
        };
        return this
            .waitForElementVisible("@tableCell")
            .assert.containsText("@tableCell", text);
    }

};


module.exports = {
    commands:[printPageCommands],
    url: 'http://localhost:8181/print/printSimpleDocument',
    elements: {

        tableTitle: {
            selector: '//div[@id="print_PrintContent"]/div[1]/table/tr/td/div',                                 //   /div[1]/table/tr/td/div
            locateStrategy: 'xpath'
        },

        dataTable: {
            selector: '//span[@id="print_PrintContent"]/div[2]',
            locateStrategy: 'xpath'
        },

        tableBottom: {
            selector: '//div[@id="print_PrintContent"]/div[3]/table',
            locateStrategy: 'xpath'
        }
    }
};