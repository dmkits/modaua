var databaseCommands = {

    assertHeaderContainsText: function (table, headerNumber, text) {
        console.log("table=", table);
        var instance = this;
        getTableID(table, function (id) {
            instance.elements.tableHeader = {
                selector: "//div[@id='" + id + "']//div[@class='ht_clone_top handsontable']//table[@class='htCore']//thead/tr[2]/th[" + headerNumber + "]",
                locateStrategy: 'xpath'
            };
        });
        return instance
            .waitForElementVisible("@tableHeader")
            .assert.containsText("@tableHeader", text);

    },
    assertCellContainsText: function (table, RowNumber, ColumnNumber, text) {
        var instance = this;
        getTableID(table, function (id) {
            instance.elements.tableCell = {
                selector: "//div[@id='" + id + "']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
                locateStrategy: 'xpath'
            };
        });
        return instance
            .waitForElementVisible("@tableCell")
            .assert.containsText("@tableCell", text);
    },
    moveToCell: function (table, RowNumber, ColumnNumber) {
        var instance = this;
        getTableID(table, function (id) {
            instance.elements.tableCell = {
                selector: "//div[@id='" + id + "']//div[@class='ht_master handsontable']//table[@class='htCore']//tbody/tr[" + RowNumber + "]/td[" + ColumnNumber + "]",
                locateStrategy: 'xpath'
            };
        });
        return instance
            .moveToElement("@tableCell", 15, 15);
    },

    scrollTableToValue: function (table, value) {   /// bug

        var instance = this;
        var scrollTopValue = 0;
        var LastVisibleRowValue = "";

        getTableID(table, function (id) {
            instance.elements.TargetCell = {
                selector: "//div[@id='" + id + "']//td[contains(text(), '" + value + "')]",
                locateStrategy: 'xpath'
            };
        });

        function scrollTable(table, scrollTopValue, callback) {
            instance.api.pause(2000,function(){
                getTableID(table, function (id) {
                    instance.api.execute(function (id, scrollTopValue) {
                        var table = document.evaluate('//*[@id="' + id + '"]//*[@class="handsontable htColumnHeaders"]/div[1]/div[@class="wtHolder"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        //table.scrollTop = 0;
                        table.scrollTop = scrollTopValue;
                    }, [id, scrollTopValue], function () {
                        instance.api.saveScreenshot('./screenshots/fileName' + scrollTopValue + '.png');

                        //instance.api.pause(2000);
                        instance.elements.LastVisibleRow = {
                            selector: '//*[@id="' + id + '"]//*[@class="handsontable htColumnHeaders"]/div[1]/div[@class="wtHolder"]//table[@class=\'htCore\']//tbody/tr[last()]/td[1]',
                            locateStrategy: 'xpath'
                        };

                        instance.getText('@LastVisibleRow', function (result) {
                            //var text = result.value;     console.log("text=",text);console.log("LastVisibleRowValue=",LastVisibleRowValue);
                            //if (text==LastVisibleRowValue){
                            //    callback(false); //scrolled
                            //    return;
                            //}
                            //LastVisibleRowValue=text;
                          //  callback(true);

                            console.log("result.value=",result.value);

                            if (result.value=="dir_products_collections__5"){  ////////// заглушка
                                callback(false); //scrolled
                                return;
                            }
                              callback(true);
                        });
                    });
                });
            });
        }

        function checkIfValueVisible(callback) {
            instance.api.perform(function () {
                instance.waitForElementVisible('@TargetCell', 3000, false, function (result) {
                    if (result && result.value == false) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                }, "IGNORE IT! Just looking for element while scrolling the table %s ");
            });
        }

        function loop() {
            checkIfValueVisible(function (find) {
                if (find == true)return;
                scrollTopValue = scrollTopValue + 380;
                scrollTable(table, scrollTopValue, function (scrolled) {
                    if(scrolled==true)return loop();
                    instance.waitForElementVisible('@TargetCell',1000,"FAIL! Value not found in the table  %s ");
                });
            });
        }

        loop();
        return instance;
    },

    moveToLastRow:function(table){
        var instance = this;
                getTableID(table, function (id) {
                    instance.api.execute(function (id) {
                        var table = document.evaluate('//*[@id="' + id + '"]//*[@class="handsontable htColumnHeaders"]/div[1]/div[@class="wtHolder"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        table.scrollTop = 1000000;
                    }, [id], function () {
                        instance.elements.LastRowInTable = {
                            selector: '//*[@id="' + id + '"]//*[@class="handsontable htColumnHeaders"]/div[1]/div[@class="wtHolder"]//table[@class=\'htCore\']//tbody/tr[last()]/td[1]',
                            locateStrategy: 'xpath'
                        };
                        instance
                            .moveToElement('@LastRowInTable', 10, 10);
                    });
                });

        return instance;
    },
    scrollTableToTop: function (table) {
        var instance = this;
        getTableID(table, function (id) {
            instance.api.execute(function (id) {
                var table = document.evaluate('//*[@id="' + id + '"]//*[@class="handsontable htColumnHeaders"]/div[1]/div[@class="wtHolder"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                table.scrollTop = 0;
            }, [id], function () {
            });
        });
        return instance;
    },
    clickRefreshBtn: function (table) {
        this.api.pause(3000);
        var instance = this;
        getTableID(table, function (id) {
            instance.elements.refreshBtn = {
                selector: "//*[@id='" + id + "']//input[@type='button']/ancestor::span[@role='presentation']//span[contains(text(), 'Обновить')]",
                locateStrategy: 'xpath'
            };
        });
        return instance
            .waitForElementVisible("@refreshBtn")
            .click("@refreshBtn");
    },
    assertTableTitleHasText: function (table, text) {
        var instance = this;
        getTableID(table, function (id) {
            instance.elements.tableTitle = {
                selector: "//*[@id='" + id + "']//td/h1",
                locateStrategy: 'xpath'
            };
        });
        return instance
            .waitForElementVisible("@tableTitle")
            .assert.containsText("@tableTitle", text);
    },
    //assertTableTitleHasText: function (text) {
    //    var instance = this;
    //        instance.elements.tableTitle = {
    //            selector: "//*[@id='sysadmin_database_ContentPaneDetailContainer']//td/h1[contains(text(), '"+text+"')]",  /////////
    //            locateStrategy: 'xpath'
    //        };
    //    return instance
    //        .waitForElementVisible("@tableTitle");
    //},
    assertTotalRowContainsValue: function (table, value) {
        var instance = this;
        getTableID(table, function (id) {
            instance.elements.totalRowInput = {
                selector: "//*[@id='" + id + "']//label[contains(text(), 'ИТОГО строк:')]/ancestor::td//input[@type='hidden']",
                locateStrategy: 'xpath'
            };
        });
        return instance
            .waitForElementPresent("@totalRowInput")
            .assert.valueContains("@totalRowInput", value);
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
    }
};

module.exports = {
    commands: [databaseCommands],
    elements: {
        sysadmin_database_ContentPaneDetailContainer: "#sysadmin_database_ContentPaneDetailContainer",

        currentChangesBtn: '#sysadmin_database_btnCurrentChanges',
        changeLogBtn: '#sysadmin_database_btnChangeLog',

        //currentChangesTable: {
        //    selector: "//*[@id='sysadmin_database_TableCurrentChanges']//div[@class='ht_master handsontable']//table[@class='htCore']",
        //    locateStrategy: 'xpath'
        //},
        //
        //changeLogTable: {
        //    selector: "//*[@id='sysadmin_database_TableCurrentChanges']//div[@class='ht_master handsontable']//table[@class='htCore']",
        //    locateStrategy: 'xpath'
        //},

        currentChangesTable:'#sysadmin_database_TableCurrentChanges',
        changeLogTable:'#sysadmin_database_TableChangeLog',
        applyChangesDialog: {
            selector: "//div[contains(text(), 'Apply selected changes')]/../..",
            locateStrategy: 'xpath'
        }
    }
};

function getTableID(table, callback) {
    if (table == '@currentChangesTable') {
        callback('sysadmin_database_TableCurrentChanges');   //sysadmin_database_TableCurrentChanges
    }
    if (table == '@changeLogTable') {
        callback('sysadmin_database_TableChangeLog');   //sysadmin_database_TableChangeLog
    }
}

