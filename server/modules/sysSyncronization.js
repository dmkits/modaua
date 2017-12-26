var server = require('../server'), log = server.log;
var dateFormat = require('dateformat'), moment = require('moment');

var dataModel = require('../datamodel');
var sys_currency = require(appDataModelPath + "sys_currency"),
    sys_docstates = require(appDataModelPath + "sys_docstates"),
    sys_sync_POSes = require(appDataModelPath + "sys_sync_POSes"),
    sys_sync_errors_log = require(appDataModelPath + "sys_sync_errors_log"),
    sys_sync_incoming_data = require(appDataModelPath + "sys_sync_incoming_data"),
    sys_sync_incoming_data_details = require(appDataModelPath + "sys_sync_incoming_data_details"),
    sys_sync_output_data = require(appDataModelPath + "sys_sync_output_data"),
    sys_sync_output_data_details = require(appDataModelPath + "sys_sync_output_data_details"),
    dir_units = require(appDataModelPath + "dir_units"),
    fin_retail_receipts = require(appDataModelPath + "fin_retail_receipts"),
    wrh_retail_tickets = require(appDataModelPath + "wrh_retail_tickets"),
    wrh_retail_tickets_products = require(appDataModelPath + "wrh_retail_tickets_products"),
    fin_retail_receipts_purposes = require(appDataModelPath + "fin_retail_receipts_purposes"),
    fin_retail_payments = require(appDataModelPath + "fin_retail_payments"),
    dir_retail_receipt_purposes = require(appDataModelPath + "dir_retail_receipt_purposes");

module.exports.validateModule = function (errs, nextValidateModuleCallback) {
    dataModel.initValidateDataModels([sys_sync_POSes, sys_sync_errors_log,
            sys_sync_incoming_data, sys_sync_incoming_data_details,
            sys_sync_output_data, sys_sync_output_data_details,
            dir_units, sys_currency, sys_docstates,
            fin_retail_receipts, wrh_retail_tickets, wrh_retail_tickets_products,
            fin_retail_receipts_purposes,dir_retail_receipt_purposes], errs,
        function () {
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/system/synchronization";
module.exports.modulePagePath = "/sysadmin/synchronization.html";
var thisInstance = this;

module.exports.init = function (app) {

    //app.get("/system/synchronization", function (req, res) {
    //    res.sendFile(appViewsPath+'sysadmin/synchronization.html');
    //});
    var sysSyncPOSesTableColumns = [
        {data: "ID", name: "POS ID", width: 90, type: "text", visible: false},
        {data: "POS_NAME", name: "POS name", width: 150, type: "text", sourceField: "NAME"},
        {data: "POS_HOST_NAME", name: "POS HOST name", width: 150, type: "text", sourceField: "HOST_NAME"},
        {data: "DATABASE_NAME", name: "POS Database name", width: 200, type: "text"},
        {data: "UNIT_NAME", name: "Unit", width: 200, dataSource: "dir_units", sourceField: "NAME",
            type: "combobox", "sourceURL": "/dir/units/getDataForUnitsCombobox" },
        {data: "ACTIVE", name: "Active", width: 90, type: "checkbox", visible:true}
    ];
    app.get('/system/synchronization/getSyncPOSesDataForTable', function (req, res) {
        sys_sync_POSes.getDataForTable({
            tableColumns: sysSyncPOSesTableColumns, identifier: sysSyncPOSesTableColumns[0].data,
            order: "ID", conditions: req.query
        }, function (result) {
            res.send(result);
        });
    });
    app.get('/system/synchronization/newDataForSyncPOSesTable', function (req, res) {
        sys_sync_POSes.getDataForTable({
            tableColumns: sysSyncPOSesTableColumns, identifier: sysSyncPOSesTableColumns[0].data,
            order: "ID", conditions: req.query
        }, function (result) {
            res.send(result);
        });
    });
    app.post("/system/synchronization/storeSyncPOSesTableData", function (req, res) {
        var storeData = {};
        for (var colName in req.body) {
            var colValue = req.body[colName];
            if (colName == "POS_NAME") storeData["NAME"] = colValue;
            else if (colName == "POS_HOST_NAME") storeData["HOST_NAME"] = colValue;
            else storeData[colName] = colValue;
        }
        dir_units.getDataItem({fields: ["ID"], conditions: {"NAME=": storeData["UNIT_NAME"]}}, function (result) {
            if (!result.item) {
                res.send({error: "Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"] = result.item["ID"];
            sys_sync_POSes.storeTableDataItem({
                    tableColumns: sysSyncPOSesTableColumns, idFieldName: sysSyncPOSesTableColumns[0].data,
                    storeTableData: storeData
                },
                function (result) {
                    res.send(result);
                });
        });
    });
    app.post("/system/synchronization/deleteSyncPOSesTableData", function (req, res) {
        var deleteData = {};
        for (var colName in req.body) {
            var colValue = req.body[colName];
            if (colName == "POS_NAME") deleteData["NAME"] = colValue;
            else if (colName == "POS_HOST_NAME") deleteData["HOST_NAME"] = colValue;
            else deleteData[colName] = colValue;
        }
        sys_sync_POSes.delTableDataItem({idFieldName: sysSyncPOSesTableColumns[0].data, delTableData: deleteData},
            function (result) {
                res.send(result);
            });
    });

    var sysSyncErrorsLogTableColumns = [
        {data: "CREATE_DATE", name: "Log date", width: 70, type: "datetimeAsText"},
        {data: "ERROR_MSG", name: "Error msg", width: 350, type: "text"},
        {data: "HEADER", name: "Client Message Header", width: 150, type: "text"},
        {data: "CLIENT_POS_NAME", name: "Client POS Name", width: 120, type: "text"},
        {data: "CLIENT_POS_HOST_NAME", name: "Client POS Host Name", width: 120, type: "text"},
        {data: "CLIENT_REQUEST_TYPE", name: "Client request type", width: 120, type: "text"},
        {data: "CLIENT_DATA", name: "Client data", width: 400, type: "text"}
    ];
    app.get('/system/synchronization/getErrorLogDataForTable', function (req, res) {
        sys_sync_errors_log.getDataForTable({
            tableColumns: sysSyncErrorsLogTableColumns, identifier: sysSyncErrorsLogTableColumns[0].data,
            order: "CREATE_DATE", conditions: req.query
        }, function (result) {
            res.send(result);
        });
    });

    var sysSyncIncomingDataTableColumns = [
        {data: "ID", name: "ID", width: 70, type: "text", visible: false},
        {data: "CREATE_DATE", name: "Create date", width: 70, type: "datetimeAsText"},
        {data: "SYNC_POS_NAME", name: "SyncPOS", width: 100, type: "text", dataSource: "sys_sync_POSes", sourceField: "NAME"},
        {data: "CLIENT_SYNC_DATA_OUT_ID", name: "Client data sync out ID", width: 70, type: "text"},
        {data: "CLIENT_CREATE_DATE", name: "Client create date", width: 80, type: "datetimeAsText"},
        {data: "OPERATION_TYPE", name: "Operation type", width: 80, type: "text"},
        {data: "CLIENT_TABLE_NAME", name: "Client table name", width: 160, type: "text"},
        {data: "CLIENT_TABLE_KEY1_NAME", name: "Client table key1 name", width: 100, type: "text"},
        {data: "CLIENT_TABLE_KEY1_VALUE", name: "Client table key1 value", width: 160, type: "text"},
        {data: "LAST_UPDATE_DATE", name: "Last update date", width: 70, type: "datetimeAsText"},
        {data: "STATE", name: "State", width: 60, type: "text"},
        {data: "APPLIED_DATE", name: "Applied date", width: 70, type: "datetimeAsText"},
        {data: "MSG", name: "Message", width: 150, type: "text"},
        {data: "OPERATION_RESULT", name: "Operation result", width: 250, type: "text"}
    ];
    app.get('/system/synchronization/getIncomingDataForTable', function (req, res) {
        sys_sync_incoming_data.getDataForTable({
            tableColumns: sysSyncIncomingDataTableColumns, identifier: sysSyncIncomingDataTableColumns[0].data,
            order: ["CREATE_DATE", "CLIENT_SYNC_DATA_OUT_ID"], conditions: req.query
        }, function (result) {
            res.send(result);
        });
    });
    app.post("/system/synchronization/getInfoPaneDetailIncomingData", function (req, res) {
       var conditions=req.body;
        sys_sync_incoming_data_details.getDataItems({fields: ["NAME", "VALUE"],
                conditions:conditions, order: "NAME"
            },
            function (result) {
                res.send(result);
            });
    });

    sys_sync_incoming_data.saveToRetailReceipts = function (incDataItems, incDataValues, OperationType, resultCallBack) {
        if (OperationType == "I") {
            fin_retail_receipts.getDataItem({fields: ["MAXNUMBER"],
                    fieldsFunctions: {"MAXNUMBER": {function: "maxPlus1", sourceField: "NUMBER"}},
                    conditions: {"UNIT_ID=": incDataItems["UNIT_ID"]}
                },
                function (result) {
                    var newNumber = (result && result.item) ? result.item["MAXNUMBER"] : "1";
                    fin_retail_receipts.insDataItemWithNewID({
                            tableName: "fin_retail_receipts", idFieldName: "ID",
                            insData: {"NUMBER": newNumber, "DOCDATE": incDataValues["DATENEW"], "UNIT_ID": incDataItems["UNIT_ID"],
                                "BUYER_ID": "0", "CURRENCY_ID": "0", "RATE": "1", "DOCSTATE_ID": "1", "SOURCE_ID": incDataItems["CLIENT_TABLE_KEY1_VALUE"]}},
                        function (result) {
                            resultCallBack(result);
                        })
                });
        }else if(OperationType == "U"){
            fin_retail_receipts.updDataItem({updData: { "DOCDATE": incDataValues["DATENEW"]    /*, "UNIT_ID": incDataItems["UNIT_ID"], "SOURCE_ID": incDataItems["CLIENT_TABLE_KEY1_VALUE"]*/},
                conditions:{"SOURCE_ID=":incDataItems["CLIENT_TABLE_KEY1_VALUE"]}},
                function(result){
                    resultCallBack(result);
                });
        }
    };

    sys_sync_incoming_data.saveToRetailTickets = function (incDataItems, incDataValues, OperationType, resultCallBack) {
        fin_retail_receipts.getDataItem({
                fields: ["ID", "DOCDATE"],
                conditions: {"SOURCE_ID=": incDataItems["CLIENT_TABLE_KEY1_VALUE"], "UNIT_ID=": incDataItems["UNIT_ID"]}
            },
            function (result) {
                var retailReceiptID = null;
                var retailReceiptDocDate = null;
                if (result.item) {
                    retailReceiptID = result.item["ID"];
                    retailReceiptDocDate = result.item["DOCDATE"];
                }
                if (OperationType == "I") {
                    wrh_retail_tickets.insDataItemWithNewID({idFieldName: "ID",
                            insData: {"RETAIL_RECEIPT_ID": retailReceiptID, "NUMBER": incDataValues["TICKETID"], "DOCDATE": retailReceiptDocDate,
                                "UNIT_ID": incDataItems["UNIT_ID"], "BUYER_ID": "0", "CURRENCY_ID": "0", "RATE": "1",
                                "DOCSTATE_ID": "0", "SOURCE_ID": incDataItems["CLIENT_TABLE_KEY1_VALUE"]
                            }
                        },
                        function (result) {
                            resultCallBack(result);
                        })
                } else if (OperationType == "U") {
                    wrh_retail_tickets.updDataItem({
                            tableName: "wrh_retail_tickets",
                            updData: {
                                /*"RETAIL_RECEIPT_ID": retailReceiptID,*/"NUMBER": incDataValues["TICKETID"],
                                "DOCDATE": retailReceiptDocDate, /*"UNIT_ID": incDataItems["UNIT_ID"],*/
                            },
                            conditions: {"RETAIL_RECEIPT_ID=": retailReceiptID}
                        },
                        function (result) {
                            resultCallBack(result);
                        })
                }
            });
    };

    sys_sync_incoming_data.saveToRetailTicketsProducts = function (incDataItems, incDataValues, OperationType, resultCallBack) {
        wrh_retail_tickets.getDataItem({ fields: ["ID"],
                conditions: {"SOURCE_ID=": incDataItems["CLIENT_TABLE_KEY1_VALUE"], "UNIT_ID=": incDataItems["UNIT_ID"]} },
            function (result) {
                var retailTicketID;
                if (result.item)retailTicketID = result.item["ID"];
                var qty = incDataValues["UNITS"], price = incDataValues["PRICE"];
                if (OperationType == "I") {
                    wrh_retail_tickets_products.insDataItemWithNewID({
                            tableName: "wrh_retail_tickets", idFieldName: "ID",
                            insData: {"RETAIL_TICKET_ID": retailTicketID, "POS": incDataValues["LINE"] + 1, "PRODUCT_ID": incDataValues["PRODUCT"],
                                "QTY": qty, "PRICE": price, "POSSUM": qty * price, "SALE_PRICE": incDataValues["SALE_PRICE"], "DISCOUNT": incDataValues["DISCOUNT"]}
                        },
                        function (result) {
                            resultCallBack(result);
                        });
                }else if(OperationType == "U"){
                    wrh_retail_tickets_products.updDataItem({
                            updData: { "PRODUCT_ID": incDataValues["PRODUCT"], "QTY": qty, "PRICE": price, "POSSUM": qty * price,
                                "SALE_PRICE": incDataValues["SALE_PRICE"], "DISCOUNT": incDataValues["DISCOUNT"]},
                            conditions:{"RETAIL_TICKET_ID=":retailTicketID,"POS=": incDataValues["LINE"] + 1 }
                        },
                        function (result) {
                            resultCallBack(result);
                        });
                }
            });
    };
    sys_sync_incoming_data.saveToRetailReceiptsPurposes = function (incDataItems, incDataValues, OperationType, resultCallBack) {
        fin_retail_receipts.getDataItem({
                fields: ["ID"], conditions: {"SOURCE_ID=": incDataValues["RECEIPT_ID"], "UNIT_ID=": incDataItems["UNIT_ID"]}},
            function (result) {
                var retailReceiptID = null;
                if (result.item) {
                    retailReceiptID = result.item["ID"];
                }
                if (OperationType == "I") {
                    fin_retail_receipts_purposes.insDataItem({tableName: "fin_retail_receipts_purposes", insData: {"RETAIL_RECEIPT_ID": retailReceiptID,
                            "RETAIL_RECEIPT_PURPOSE_ID":incDataValues["PURPOSE_ID"], "NOTE": incDataValues["NOTE"]}},
                        function (result) {
                            resultCallBack(result);
                        })
                }else if(OperationType == "U"){
                    fin_retail_receipts_purposes.updDataItem({updData: {
                            "RETAIL_RECEIPT_PURPOSE_ID":incDataValues["PURPOSE_ID"], "NOTE": incDataValues["NOTE"]},
                            conditions:{"RETAIL_RECEIPT_ID=": retailReceiptID}
                        },
                        function (result) {
                            resultCallBack(result);
                        })
                }
            });
    };

    sys_sync_incoming_data.saveToRetailReceiptsPayments = function (incDataItems, incDataValues, OperationType, resultCallBack) {
        fin_retail_receipts.getDataItem({
                fields: ["ID"],
                conditions: {"SOURCE_ID=": incDataValues["RECEIPT"], "UNIT_ID=": incDataItems["UNIT_ID"]}},
            function (result) {
                var retailReceiptID = null;
                if (result.item) retailReceiptID = result.item["ID"];
                var clientPaymentName = incDataValues["PAYMENT"];
                var paymentFomCode = null;
                if (clientPaymentName.indexOf('cash') >= 0) {
                    paymentFomCode = "1";
                } else if (clientPaymentName.indexOf('card') >= 0) {
                    paymentFomCode = "2";
                }
                if (OperationType == "I") {
                    fin_retail_payments.insDataItemWithNewID({tableName: "fin_retail_payments", idFieldName: "ID",
                            insData: {"RETAIL_RECEIPT_ID": retailReceiptID, "DOCSUM": incDataValues["TOTAL"], "PAYMENT_FORM_CODE": paymentFomCode}
                        },
                        function (result) {
                            resultCallBack(result);
                        });
                }else if(OperationType == "U"){
                    fin_retail_payments.updDataItem({
                            updData: { "DOCSUM": incDataValues["TOTAL"], "PAYMENT_FORM_CODE": paymentFomCode},
                            conditions:{"RETAIL_RECEIPT_ID=": retailReceiptID}},
                        function (result) {
                            resultCallBack(result);
                        });
                }
            });
    };

    sys_sync_incoming_data.saveToDirReceiptPurposes = function (incDataItems, incDataValues, OperationType, resultCallBack) {
                if (OperationType == "I") {
                    dir_retail_receipt_purposes.insDataItem({insData: {"ID": incDataValues["ID"], "VALUE": incDataValues["VALUE"], "FOR_CASHIN": incDataValues["FOR_CASHIN"], "FOR_CASHOUT":incDataValues["FOR_CASHOUT"]}},
                        function (result) {
                            resultCallBack(result);
                        });
                } else if (OperationType == "U") {
                    fin_retail_payments.updDataItem({updData: {"VALUE": incDataValues["VALUE"], "FOR_CASHIN": incDataValues["FOR_CASHIN"], "FOR_CASHOUT":incDataValues["FOR_CASHOUT"]},
                            conditions:{"ID=": incDataValues["ID"]}},
                        function (result) {
                            resultCallBack(result);
                        });
                }
    };


    sys_sync_incoming_data.updApplyState = function (saveToDestTableResult, resultCallBack) {
        var updStateData = {"STATE": "1", "MSG": "Synchronized successfully", "APPLIED_DATE": new Date(), "LAST_UPDATE_DATE":new Date()};
        if(saveToDestTableResult.error)updStateData= {"STATE": "-1", "MSG":saveToDestTableResult.error,"LAST_UPDATE_DATE":new Date()};
        sys_sync_incoming_data.updDataItem({updData: updStateData, conditions: {"ID=": saveToDestTableResult["ID"]}},
            function (updResult) {
                var result = {};
                if (updResult.error) result.updStateError = "Failed update sync incoming data state! Reason" + updResult.error;
                else result.resultItem = updStateData;
                resultCallBack(result);
            });
    };
    /**
     * syncIncData={ID, CREATE_DATE, SYNC_POS_ID, CLIENT_SYNC_DATA_OUT_ID,  CLIENT_CREATE_DATE, OPERATION_TYPE,
     * CLIENT_TABLE_NAME, CLIENT_TABLE_KEY1_NAME, CLIENT_TABLE_KEY1_VALUE, STATE, MSG, UNIT_ID}
     */
    sys_sync_incoming_data.applyDataItem = function (syncIncData, resultCallBack) {
        var clientTableName = syncIncData["CLIENT_TABLE_NAME"],
            operationType = syncIncData["OPERATION_TYPE"];
        var thisInstance = this;
        if (clientTableName == "APP.RECEIPTS") {
            sys_sync_incoming_data_details.getDataItems({
                    fields: ["NAME", "VALUE"], conditions: {"SYNC_INCOMING_DATA_ID=": syncIncData["ID"]}},
                function (result) {
                    if (!result || result.error) {
                        resultCallBack({error: "Failed get sync incoming data details! Reason: "+result.error});
                        return;
                    } else if (!result.items) {
                        resultCallBack({error: "No sync incoming data details!"});
                        return;
                    }
                    var syncIncDataValues = {};
                    for (var i = 0; i < result.items.length; i++) {
                        var dataItem = result.items[i];
                        syncIncDataValues[dataItem["NAME"]] = dataItem["VALUE"];
                    }
                    thisInstance.saveToRetailReceipts(syncIncData, syncIncDataValues, operationType, function (result) {
                        result["ID"] = syncIncData["ID"];
                        if (result.resultItem) result["DEST_TABLE_DATA_ID"] = result.resultItem["ID"];
                        thisInstance.updApplyState(result,
                            function (result) {
                                resultCallBack(result);
                            })
                    })
                });
        } else if (clientTableName == "APP.RECEIPTS_PURPOSES") {
            sys_sync_incoming_data_details.getDataItems({
                    fields: ["NAME", "VALUE"], conditions: {"SYNC_INCOMING_DATA_ID=": syncIncData["ID"]}},
                function (result) {
                    if (!result || result.error) {
                        resultCallBack({error: "Failed get sync incoming data details! Reason: " +result.error });
                        return;
                    } else if (!result.items) {
                        resultCallBack({error: "No sync incoming data details!"});
                        return;
                    }
                    var syncIncDataValues = {};
                    for (var i = 0; i < result.items.length; i++) {
                        var dataItem = result.items[i];
                        syncIncDataValues[dataItem["NAME"]] = dataItem["VALUE"];
                    }
                    thisInstance.saveToRetailReceiptsPurposes(syncIncData, syncIncDataValues, operationType, function (result) {
                        result["ID"] = syncIncData["ID"];
                        if (result.resultItem) result["DEST_TABLE_DATA_ID"] = result.resultItem["ID"];
                        thisInstance.updApplyState(result,
                            function (result) {
                                resultCallBack(result);
                            })
                    })
                });
        } else if (clientTableName == "APP.TICKETS") {
            sys_sync_incoming_data_details.getDataItems({
                    fields: ["NAME", "VALUE"], conditions: {"SYNC_INCOMING_DATA_ID=": syncIncData["ID"]}},
                function (result) {
                    if (!result || result.error) {
                        resultCallBack({error: "Failed get sync incoming data details! Reason: " +result.error });
                        return;
                    } else if (!result.items) {
                        resultCallBack({error: "No sync incoming data details!"});
                        return;
                    }
                    var syncIncDataValues = {};
                    for (var i = 0; i < result.items.length; i++) {
                        var dataItem = result.items[i];
                        syncIncDataValues[dataItem["NAME"]] = dataItem["VALUE"];
                    }
                    thisInstance.saveToRetailTickets(syncIncData, syncIncDataValues, operationType, function (result) {
                        result["ID"] = syncIncData["ID"];
                        if (result.resultItem) result["DEST_TABLE_DATA_ID"] = result.resultItem["ID"];
                        thisInstance.updApplyState(result,
                            function (result) {
                                resultCallBack(result);
                            })
                    })
                });

        } else if (clientTableName == "APP.TICKETLINES") {
            sys_sync_incoming_data_details.getDataItems({
                    fields: ["NAME", "VALUE"], conditions: {"SYNC_INCOMING_DATA_ID=": syncIncData["ID"]}},
                function (result) {
                    if (!result || result.error) {
                        resultCallBack({error: "Failed get sync incoming data details!! Reason: " +result.error});
                        return;
                    } else if (!result.items) {
                        resultCallBack({error: "No sync incoming data details!"});
                        return;
                    }
                    var syncIncDataValues = {};
                    for (var i = 0; i < result.items.length; i++) {
                        var dataItem = result.items[i];
                        syncIncDataValues[dataItem["NAME"]] = dataItem["VALUE"];
                    }
                    thisInstance.saveToRetailTicketsProducts(syncIncData, syncIncDataValues, operationType, function (result) {
                        result["ID"] = syncIncData["ID"];
                        if (result.resultItem) result["DEST_TABLE_DATA_ID"] = result.resultItem["ID"];
                        thisInstance.updApplyState(result,
                            function (result) {
                                resultCallBack(result);
                            })
                    })
                });
        } else if (clientTableName == "APP.PAYMENTS") {
            sys_sync_incoming_data_details.getDataItems({
                    fields: ["NAME", "VALUE"], conditions: {"SYNC_INCOMING_DATA_ID=": syncIncData["ID"]}},
                function (result) {
                    if (!result || result.error) {
                        resultCallBack ({error: "Failed get sync incoming data details!! Reason: " +result.error});
                        return;
                    } else if (!result.items) {
                        resultCallBack({error: "No sync incoming data details!"});
                        return;
                    }
                    var syncIncDataValues = {};
                    for (var i = 0; i < result.items.length; i++) {
                        var dataItem = result.items[i];
                        syncIncDataValues[dataItem["NAME"]] = dataItem["VALUE"];
                    }
                    thisInstance.saveToRetailReceiptsPayments(syncIncData, syncIncDataValues, operationType, function (result) {
                        result["ID"] = syncIncData["ID"];
                        if (result.resultItem) result["DEST_TABLE_DATA_ID"] = result.resultItem["ID"];
                        thisInstance.updApplyState(result,
                            function (result) {
                                resultCallBack(result);
                            })
                    });
                });
        } else if (clientTableName == "APP.RECEIPT_PURPOSES") {
            sys_sync_incoming_data_details.getDataItems({
                    fields: ["NAME", "VALUE"], conditions: {"SYNC_INCOMING_DATA_ID=": syncIncData["ID"]}},
                function (result) {
                    if (!result || result.error) {
                        resultCallBack ({error: "Failed get sync incoming data details!! Reason: " +result.error});
                        return;
                    } else if (!result.items) {
                        resultCallBack({error: "No sync incoming data details!"});
                        return;
                    }
                    var syncIncDataValues = {};
                    for (var i = 0; i < result.items.length; i++) {
                        var dataItem = result.items[i];
                        syncIncDataValues[dataItem["NAME"]] = dataItem["VALUE"];
                    }
                    thisInstance.saveToDirReceiptPurposes(syncIncData, syncIncDataValues, operationType, function (result) {
                        result["ID"] = syncIncData["ID"];
                        if (result.resultItem) result["DEST_TABLE_DATA_ID"] = result.resultItem["ID"];
                        thisInstance.updApplyState(result,
                            function (result) {
                                resultCallBack(result);
                            })
                    });
                });
        } else if (clientTableName == "APP.CLOSEDCASH" ) {
            var msg = "Failed! No model for this data!";
            thisInstance.updApplyState({"ID": syncIncData["ID"], "STATE": 0, "MSG": msg}, function (result) {
                resultCallBack(result);
            })
        } else {
            resultCallBack({error: "Unknown table for apply data!"});
        }
    };

    function getRowSyncSysIncData(clientTableKeyValue, callback){
        sys_sync_incoming_data.getDataItem({
                fields: ["ID","CREATE_DATE","SYNC_POS_ID","CLIENT_SYNC_DATA_OUT_ID","CLIENT_CREATE_DATE","OPERATION_TYPE",
                "CLIENT_TABLE_NAME","CLIENT_TABLE_KEY1_NAME","CLIENT_TABLE_KEY1_VALUE","STATE","MSG"],
                conditions: {"CLIENT_SYNC_DATA_OUT_ID=": clientTableKeyValue}},
            function (syncSysDataRes) {
                sys_sync_POSes.getDataItem({fields:["NAME"], conditions:{"ID=":syncSysDataRes.item["SYNC_POS_ID"]}},
                function(posNameRes){
                    syncSysDataRes.item["SYNC_POS_NAME"]=posNameRes.item["NAME"];
                    callback(syncSysDataRes.item);
                });
            });
    }

    app.post("/system/synchronization/applySyncIncomingData", function (req, res) {
        var clientTableKeyValue=req.body["CLIENT_SYNC_DATA_OUT_ID"];
        getRowSyncSysIncData(clientTableKeyValue, function(syncIncData){
            if(syncIncData["STATE"]=="1"){
                res.send(syncIncData);
                return;
            }
            sys_sync_POSes.getDataItem({fields: ["UNIT_ID"], conditions: {"NAME=": syncIncData["SYNC_POS_NAME"]}},
                function (result) {
                    if (!result || result.error) {
                        res.send({error: "Failed get unit by SYNC_POS_NAME!"});
                        return;
                    } else if (!result.item) {
                        res.send({error: "Not finded unit by SYNC_POS_NAME!"});
                        return;
                    }
                    syncIncData["UNIT_ID"] = result.item["UNIT_ID"];
                    sys_sync_incoming_data.applyDataItem(syncIncData,
                        function (result) {
                            res.send(result);
                        });
                });
        });
    });

    var sysSyncOutputDataTableColumns = [
        {data: "ID", name: "ID", width: 75, type: "text", visible:false},
        {data: "CREATE_DATE", name: "CreateDate", width: 75, type: "datetimeAsText"},
        {data: "SYNC_POS_NAME", name: "SyncPOS", width: 90, type: "text", dataSource: "sys_sync_POSes", sourceField: "NAME",
            linkCondition:"sys_sync_output_data.SYNC_POS_ID=sys_sync_POSes.ID"},
        {data: "TABLE_NAME", name: "TableName", width: 250, type: "text"},
        {data: "KEY_DATA_NAME", name: "KeyName", width: 150, type: "text"},
        {data: "KEY_DATA_VALUE", name: "KeyValue", width: 150, type: "text"},
        {data: "LAST_UPDATE_DATE", name: "LastUpdateDate", width: 90, type: "text"},
        {data: "STATE", name: "State", width: 60, type: "text"},
        {data: "CLIENT_SYNC_DATA_ID", name: "ClientDataID", width: 80, type: "text"},
        {data: "APPLIED_DATE", name: "AppliedDate", width: 80, type: "text"},
        {data: "CLIENT_MESSAGE", name: "ClientMessage", width: 250, type: "text"},
        {data: "OPERATION_ID", name: "OperationID", width: 150, type: "text"},
    ];
    app.get('/system/synchronization/getOutputDataForTable', function (req, res) {
        sys_sync_output_data.getDataForTable({
            tableColumns: sysSyncOutputDataTableColumns, identifier: sysSyncOutputDataTableColumns[0].data,
            order: "sys_sync_output_data.CREATE_DATE", conditions: req.query
        }, function (result) {
            res.send(result);
        });
    });

    app.post("/system/synchronization/getInfoPaneDetailOutputData", function (req, res) {
        var conditions=req.body;
        sys_sync_output_data_details.getDataItems({fields: ["NAME", "VALUE"],
                conditions:conditions, order: "NAME"
            },
            function (result) {
                res.send(result);
            });
    });

    sys_sync_output_data.insertSysSyncOutData=function(ind, insDataArr, callback) {
        if(!insDataArr[ind]){
            callback({});
            return;
        }
        var insData=insDataArr[ind];
        var posIdArr=insData["POS_ID_ARR"];
        sys_sync_output_data.insertSysSyncOutDataByPosId(0,posIdArr,insData,function(result){
            if(result.error){
                callback({error:result.error});
                return;
            }
            sys_sync_output_data.insertSysSyncOutData(ind+1, insDataArr, callback);
        });
    };
    sys_sync_output_data.insertSysSyncOutDataByPosId=function(ind,posIdArr,insData,callback){
        if(!posIdArr[ind]){
            callback({});
            return;
        }
        var now = dateFormat(new Date, "yyyy-mm-dd HH-MM-ss");
        var posId=posIdArr[ind];
        sys_sync_output_data.insDataItemWithNewID({idFieldName:"ID",insData:{"OPERATION_ID":insData["OPERATION_ID"],
                "CREATE_DATE":now, "SYNC_POS_ID":posId, "TABLE_NAME":"APP.PRODUCTS","KEY_DATA_NAME":"ID","STATE":"-1",
                "KEY_DATA_VALUE":insData["PRODUCT_ID"],"LAST_UPDATE_DATE":null,"APPLIED_DATE":null }},
            function(result){
                if(result.error){
                    callback({error:result.error});
                    return;
                }
                var syncOutDataID=result.resultItem["ID"];
                var detailDataObjArr=[];
                var detailData=insData.detailData;
                for(var i in detailData ){
                    var obj={fieldName:i,value:detailData[i]};
                    detailDataObjArr.push(obj);
                }
                sys_sync_output_data_details.insertSysSyncOutDataDetail(0,detailDataObjArr,syncOutDataID,function(result){
                    if(result.error){
                        callback({error:result.error});
                        return;
                    }
                    sys_sync_output_data.updDataItem({updData:{"STATE":"0"}, conditions:{"ID=":result.syncOutDataID}},
                        function(result){
                            if(result.error){
                                callback({error:result.error});
                                return;
                            }
                            sys_sync_output_data.insertSysSyncOutDataByPosId(ind+1,posIdArr,insData,callback);
                        });
                });
            });
    };

    sys_sync_output_data_details.insertSysSyncOutDataDetail=function(ind,detailDataObjArr,syncOutDataID, callback){
        if(!detailDataObjArr[ind]){
            callback({syncOutDataID:syncOutDataID});
            return;
        }
        var detailData=detailDataObjArr[ind];
        sys_sync_output_data_details.insDataItemWithNewID({idFieldName:"ID",insData:{"SYNC_OUTPUT_DATA_ID":syncOutDataID,
                "NAME":detailData.fieldName,"VALUE":detailData.value}},
            function(result){
                if(result.error){
                    callback({error:result.error});
                    return;
                }
                sys_sync_output_data_details.insertSysSyncOutDataDetail(ind+1,detailDataObjArr,syncOutDataID, callback);
            })
    };
};

