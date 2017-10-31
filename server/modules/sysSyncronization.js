var server=require('../server'), log = server.log;
var dateFormat = require('dateformat'), moment = require('moment');

var dataModel=require('../datamodel');
var sys_currency= require(appDataModelPath+"sys_currency"),
    sys_docstates= require(appDataModelPath+"sys_docstates"),
    sys_sync_POSes= require(appDataModelPath+"sys_sync_POSes"),
    sys_sync_errors_log= require(appDataModelPath+"sys_sync_errors_log"),
    sys_sync_incoming_data=require(appDataModelPath+"sys_sync_incoming_data"),
    sys_sync_incoming_data_details=require(appDataModelPath+"sys_sync_incoming_data_details"),
    sys_sync_output_data=require(appDataModelPath+"sys_sync_output_data"),
    sys_sync_output_data_details=require(appDataModelPath+"sys_sync_output_data_details"),
    dir_units=require(appDataModelPath+"dir_units"),
    fin_retail_receipts=require(appDataModelPath+"fin_retail_receipts"),
    wrh_retail_tickets=require(appDataModelPath+"wrh_retail_tickets");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([sys_sync_POSes, sys_sync_errors_log,
            sys_sync_incoming_data, sys_sync_incoming_data_details,
            sys_sync_output_data, sys_sync_output_data_details,
            dir_units,sys_currency,sys_docstates,
            fin_retail_receipts,wrh_retail_tickets], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/system/synchronization";
module.exports.modulePagePath = "/sysadmin/synchronization.html";
var thisInstance=this;

module.exports.init = function(app){

    //app.get("/system/synchronization", function (req, res) {
    //    res.sendFile(appViewsPath+'sysadmin/synchronization.html');
    //});
    var sysSyncPOSesTableColumns=[
        {data: "ID", name: "POS ID", width: 90, type: "text", visible:false},
        {data: "POS_NAME", name: "POS name", width: 150, type: "text", sourceField:"NAME"},
        {data: "POS_HOST_NAME", name: "POS HOST name", width: 150, type: "text", sourceField:"HOST_NAME"},
        {data: "DATABASE_NAME", name: "POS Database name", width: 200, type: "text"},
        {data: "UNIT_NAME", name: "Unit", width: 200,
            type: "combobox", "sourceURL":"/dir/units/getDataForUnitsCombobox",
            dataSource:"dir_units", sourceField:"NAME"}
    ];
    app.get('/system/synchronization/getSyncPOSesDataForTable', function(req, res){
        sys_sync_POSes.getDataForTable({tableColumns:sysSyncPOSesTableColumns, identifier:sysSyncPOSesTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });
    app.get('/system/synchronization/newDataForSyncPOSesTable', function(req, res){
        sys_sync_POSes.getDataForTable({tableColumns:sysSyncPOSesTableColumns, identifier:sysSyncPOSesTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });
    app.post("/system/synchronization/storeSyncPOSesTableData", function(req, res){
        var storeData={};
        for (var colName in req.body) {
            var colValue= req.body[colName];
            if(colName=="POS_NAME") storeData["NAME"]= colValue;
            else if(colName=="POS_HOST_NAME") storeData["HOST_NAME"]= colValue;
            else storeData[colName]= colValue;
        }
        dir_units.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["UNIT_NAME"]}}, function(result) {
            if (!result.item) {
                res.send({error: "Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"] = result.item["ID"];
            sys_sync_POSes.storeTableDataItem({tableColumns:sysSyncPOSesTableColumns, idFieldName:sysSyncPOSesTableColumns[0].data,
                    storeTableData:storeData},
                function(result){
                    res.send(result);
                });
        });
    });
    app.post("/system/synchronization/deleteSyncPOSesTableData", function(req, res){
        var deleteData={};
        for (var colName in req.body) {
            var colValue= req.body[colName];
            if(colName=="POS_NAME") deleteData["NAME"]= colValue;
            else if(colName=="POS_HOST_NAME") deleteData["HOST_NAME"]= colValue;
            else deleteData[colName]= colValue;
        }
        sys_sync_POSes.delTableDataItem({idFieldName:sysSyncPOSesTableColumns[0].data, delTableData:deleteData},
            function(result){
                res.send(result);
            });
    });

    var sysSyncErrorsLogTableColumns=[
        {data: "CREATE_DATE", name: "Log date", width: 70, type: "datetimeAsText"},
        {data: "ERROR_MSG", name: "Error msg", width: 350, type: "text"},
        {data: "HEADER", name: "Client Message Header", width: 150, type: "text"},
        {data: "CLIENT_POS_NAME", name: "Client POS Name", width: 120, type: "text"},
        {data: "CLIENT_POS_HOST_NAME", name: "Client POS Host Name", width: 120, type: "text"},
        {data: "CLIENT_REQUEST_TYPE", name: "Client request type", width: 120, type: "text"},
        {data: "CLIENT_DATA", name: "Client data", width: 400, type: "text"}
    ];
    app.get('/system/synchronization/getErrorLogDataForTable', function(req, res){
        sys_sync_errors_log.getDataForTable({tableColumns:sysSyncErrorsLogTableColumns, identifier:sysSyncErrorsLogTableColumns[0].data,
            order:"CREATE_DATE", conditions:req.query}, function(result){
            res.send(result);
        });
    });

    var sysSyncIncomingDataTableColumns=[
        {data: "ID", name: "ID", width: 70, type: "text", visible:false},
        {data: "CREATE_DATE", name: "Create date", width: 70, type: "datetimeAsText"},
        {data: "SYNC_POS_NAME", name: "SyncPOS", width: 100, type: "text", dataSource:"sys_sync_POSes", sourceField:"NAME"},
        {data: "CLIENT_SYNC_DATA_OUT_ID", name: "Client data sync out ID", width: 70, type: "text"},
        {data: "CLIENT_CREATE_DATE", name: "Client create date", width: 80, type: "datetimeAsText"},
        {data: "OPERATION_TYPE", name: "Operation type", width: 80, type: "text"},
        {data: "CLIENT_TABLE_NAME", name: "Client table name", width: 160, type: "text"},
        {data: "CLIENT_TABLE_KEY1_NAME", name: "Client table key1 name", width: 100, type: "text"},
        {data: "CLIENT_TABLE_KEY1_VALUE", name: "Client table key1 value", width: 160, type: "text"},
        {data: "LAST_UPDATE_DATE", name: "Last update date", width: 70, type: "datetimeAsText"},
        {data: "STATE", name: "State", width: 60, type: "text"},
        {data: "MSG", name: "Message", width: 150, type: "text"},
        {data: "APPLIED_DATE", name: "Applied date", width: 70, type: "datetimeAsText"},
        {data: "DEST_TABLE_CODE", name: "Dest.t code", width: 60, type: "text"},
        {data: "DEST_TABLE_DATA_ID", name: "Dest.t ID", width: 130, type: "text"},
        {data: "OPERATION_RESULT", name: "Operation result", width: 250, type: "text"}
    ];
    app.get('/system/synchronization/getIncomingDataForTable', function(req, res){
        sys_sync_incoming_data.getDataForTable({tableColumns:sysSyncIncomingDataTableColumns, identifier:sysSyncIncomingDataTableColumns[0].data,
            order:["CREATE_DATE","CLIENT_SYNC_DATA_OUT_ID"], conditions:req.query}, function(result){
            res.send(result);
        });
    });

    var sysSyncOutputDataTableColumns=[
        {data: "CREATE_DATE", name: "CreateDate", width: 75, type: "text"},
        {data: "SYNC_POS_NAME", name: "SyncPOS", width: 90, type: "text", dataSource:"sys_sync_POSes", sourceField:"NAME"},
        {data: "TABLE_NAME", name: "TableName", width: 250, type: "text"},
        {data: "KEY_DATA_NAME", name: "KeyName", width: 150, type: "text"},
        {data: "KEY_DATA_VALUE", name: "KeyValue", width: 150, type: "text"},
        {data: "LAST_UPDATE_DATE", name: "LastUpdateDate", width: 90, type: "text"},
        {data: "STATE", name: "State", width: 60, type: "text"},
        {data: "CLIENT_SYNC_DATA_ID", name: "ClientDataID", width: 80, type: "text"},
        {data: "APPLIED_DATE", name: "AppliedDate", width: 80, type: "text"},
        {data: "CLIENT_MESSAGE", name: "ClientMessage", width: 250, type: "text"}
    ];
    app.get('/system/synchronization/getOutputDataForTable', function(req, res){
        sys_sync_output_data.getDataForTable({tableColumns:sysSyncOutputDataTableColumns, identifier:sysSyncOutputDataTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });
    app.post("/system/synchronization/getInfoPaneDetailIncomingData", function(req, res){
        var data=req.body;
        sys_sync_incoming_data_details.getDataItems({fields:["NAME","VALUE"],
            conditions:{"SYNC_INCOMING_DATA_ID=":data["ID"]},
            order:"NAME"},
            function(result){
                res.send(result);
            });
    });

    sys_sync_incoming_data.saveToRetailReceipts= function(incDataItems,incDataValues, OperationType,resultCallBack){
        //    ID(generate)  NUMBER   DOCDATE+  UNIT_ID+   BUYER_ID  CURRENCY_ID  RATE  DOCSTATE_ID
        //    body: { ID: '8606503567423256938',
        //    CREATE_DATE: '2017-10-30T12:44:10.000Z',
        //    SYNC_POS_NAME: 'ShopBata1POS1',
        //    CLIENT_SYNC_DATA_OUT_ID: '5047',
        //    CLIENT_CREATE_DATE: '2017-06-01T07:56:38.000Z',
        //    OPERATION_TYPE: 'I',
        //    CLIENT_TABLE_NAME: 'APP.RECEIPTS',
        //    CLIENT_TABLE_KEY1_NAME: 'ID',
        //    CLIENT_TABLE_KEY1_VALUE: '86b2472d-4877-4a79-aec2-2a0d8fb0a6ae',
        //    STATE: '0',
        //    MSG: 'client sync data out stored',
        //    '<!$selected$!>': 'true' }
        //---------------------------------
        //DATENEW: 2017-06-01 10:56:38.335 -------------------------------------------------------------------->DOCDATE
        //ID: 86b2472d-4877-4a79-aec2-2a0d8fb0a6ae
        //MONEY: 7366a9ab-ca49-4eee-a133-cd4234a74ab8
        console.log("saveToRetailReceipts");
        if(OperationType=="I"){
            fin_retail_receipts.getDataItem({fields:["MAXNUMBER"],fieldsFunctions:{"MAXNUMBER":{function:"maxPlus1", sourceField:"NUMBER"}},
                    conditions:{"UNIT_ID=":incDataItems["UNIT_ID"]}},
                function(result) {
                    var newNumber = (result && result.item) ? result.item["MAXNUMBER"] : "1";
                    fin_retail_receipts.insDataItemWithNewID({tableName:"fin_retail_receipts",idFieldName:"ID",
                            insData:{"NUMBER":newNumber, "DOCDATE":incDataValues["DATENEW"], "UNIT_ID":incDataItems["UNIT_ID"],
                                "BUYER_ID":"0", "CURRENCY_ID":"0", "RATE":"1", "DOCSTATE_ID":"1"
                            }},
                        function(result){                   console.log("fin_retail_receipts result=", result);
                            resultCallBack(result);
                        });
                });
        }
    };

    sys_sync_incoming_data.saveToRetailTickets= function(incDataItems,incDataValues, OperationType,resultCallBack){
        console.log("saveToRetailTickets");
      //wrh_retail_tickets
      // ID (generate), RETAIL_RECEIPT_ID+, NUMBER+, DOCDATE+, UNIT_ID+, BUYER_ID+ , CURRENCY_ID-, RATE-, DOCSTATE_ID+
      //-------------
      //  body: { ID: '7884521351672052074',
      //      CREATE_DATE: '2017-10-30T12:44:11.000Z',
      //      SYNC_POS_NAME: 'ShopBata1POS1',  ----------->  sys_sync_POSes UNIT_ID WHERE NAME==SYNC_POS_NAME
      //      CLIENT_SYNC_DATA_OUT_ID: '5051',
      //      CLIENT_CREATE_DATE: '2017-06-01T08:42:48.000Z',  ---------------------> DOCDATE
      //      OPERATION_TYPE: 'I',
      //      CLIENT_TABLE_NAME: 'APP.TICKETS',
      //      CLIENT_TABLE_KEY1_NAME: 'ID',
      //      CLIENT_TABLE_KEY1_VALUE: 'af2ed762-52cd-4318-9c3e-f2755596f2b6',
      //      STATE: '0',
      // --------------------
      //  CUSTOMER: <null>    -------------------------------------------------->     BUYER_ID
      //  ID: af2ed762-52cd-4318-9c3e-f2755596f2b6 ----------------------------> RETAIL_RECEIPT_ID
      //  PERSON: 2
      //  STATUS: 0        ---------------------------------------------------->  DOCSTATE_ID}
      //  TICKETID: 50  ------------------------------------------------------------> NUMBER
      //  TICKETTYPE: 1
        //sys_sync_POSes.getDataItem({fields:["UNIT_ID"], condition:"NAME="+incDataItems["SYNC_POS_NAME"]},
        //function(resultUnitID){
            sys_sync_incoming_data_details.getDataItems({fields:["NAME","VALUE"],
                    conditions:{"SYNC_INCOMING_DATA_ID=":incDataItems["ID"]}},
                function(detailData){
                    if(OperationType=="I"){
                        wrh_retail_tickets.insDataItemWithNewID({tableName:"wrh_retail_tickets",idFieldName:"ID",
                                insData:{
                                    "RETAIL_RECEIPT_ID":detailData["RETAIL_RECEIPT_ID"],
                                    "NUMBER":detailData["TICKETID"],
                                    "DOCDATE":incDataItems["CLIENT_CREATE_DATE"],
                                    "UNIT_ID":resultUnitID["UNIT_ID"],
                                    "BUYER_ID":"0",
                                    "CURRENCY_ID":"0",
                                    "RATE":"1",
                                    "DOCSTATE_ID":detailData["STATUS"]
                                }},
                            function(result){
                                resultCallBack({result:result});
                                console.log("result=",result);
                            })
                    }
                });
      //  });
    };
    sys_sync_incoming_data.saveToRetailTicketsProducts= function(incDataItems,incDataValues, OperationType,resultCallBack){
       // wrh_retail_tickets_products
        //ID(generate), RETAIL_TICKET_ID(get from retail ticket),POS+, PRODUCT_ID+, QTY+, PRICE+, POSSUM(QTY*PRICE), SALE_PRICE+, DISCOUNT+

        //body: { ID: '3780053241277266282',
        //    CREATE_DATE: '2017-10-30T12:44:12.000Z',
        //    SYNC_POS_NAME: 'ShopBata1POS1',
        //    CLIENT_SYNC_DATA_OUT_ID: '5052',
        //    CLIENT_CREATE_DATE: '2017-06-01T08:42:48.000Z',
        //    OPERATION_TYPE: 'I',
        //    CLIENT_TABLE_NAME: 'APP.TICKETLINES',
        //    CLIENT_TABLE_KEY1_NAME: 'TICKET',
        //    CLIENT_TABLE_KEY1_VALUE: 'af2ed762-52cd-4318-9c3e-f2755596f2b6',
        //    STATE: '0',
        //    MSG: 'client sync data out stored',
        //    '<!$selected$!>': 'true' }
        //--------------------------
        //ATTRIBUTESETINSTANCE_ID:<null>
        //DISCOUNT: 0.0             ------------------------------------->DISCOUNT
        //LINE: 0 ------------------------------------------------------->POS
        //PRICE: 1105.0-------------------------------------------------->PRICE
        //PRODUCT: 4121463679884551481_----------------------------------->PRODUCT_ID
        //SALE_PRICE: 0.0 ------------------------------------------------->SALE_PRICE
        //TAXID: 000
        //TICKET: af2ed762-52cd-4318-9c3e-f2755596f2b6
        //UNITS: -1.0                                      ------------------->QTY

        console.log("saveToRetailTicketsProducts");
        resultCallBack({error:"saveToRetailTicketsProducts ERROR"});
    };
    sys_sync_incoming_data.saveToRetailReceiptsPurposes= function(incDataItems,incDataValues, OperationType,resultCallBack){
        console.log("saveToRetailReceiptsPurposes");
        resultCallBack({error:"saveToRetailReceiptsPurposes ERROR"});
    };
    sys_sync_incoming_data.saveToRetailReceiptsPayments= function(incDataItems,incDataValues, OperationType,resultCallBack){
        console.log("saveToRetailReceiptsPayments");
        resultCallBack({error:"saveToRetailReceiptsPayments ERROR"});
    };

    /**
     * params = { tableName, idFieldName,
 *      tableColumns=[ {<tableColumnData>},... ],
 *      updTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
     * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error })
     */

    sys_sync_incoming_data.updApplyState= function(saveToDestTableResult,resultCallBack){

        var updStateData={"STATE":"1","MSG":"Synchronized successfully","APPLIED_DATE":new Date(),
            "DEST_TABLE_DATA_ID":saveToDestTableResult["DEST_TABLE_DATA_ID"]};

        sys_sync_incoming_data.updDataItem({ updData:updStateData, conditions:{"ID=":data["ID"]}},
            function(updResult){
                var result={};
                if(updResult.error) result.updStateError="Failed update sync incoming data state! Reason"+updResult.error;
                else result.resultItem= updStateData;
                resultCallBack(result);
            });
    };
    /**
     * syncIncData={ ID,CLIENT_TABLE_NAME, syncIncDataValues }
     */
    sys_sync_incoming_data.applyDataItem= function(syncIncData, syncIncDataValues, resultCallBack){
        var clientTableName=syncIncData["CLIENT_TABLE_NAME"],
            operationType=syncIncData["OPERATION_TYPE"];
        var thisInstance=this;
        if(clientTableName=="APP.RECEIPTS"){
            this.saveToRetailReceipts(syncIncData,syncIncDataValues,operationType,function(result){
                //{"ID":syncIncData["ID"],
                //    "DEST_TABLE_DATA_ID":result.resultItem["ID"],"STATE":1,"MSG":"Synchronized successfully"}
                thisInstance.updApplyState(result,
                    function(result){
                        resultCallBack(result);
                    })
            })
        }else if(clientTableName=="APP.RECEIPTS_PURPOSES"){
            this.saveToRetailReceiptsPurposes(syncIncData,syncIncDataValues,operationType,function(result){
                thisInstance.updApplyState({"ID":"","STATE":0,"MSG":""},function(result){
                    resultCallBack(result);
                })
            })
        }else if(clientTableName=="APP.TICKETS"){
            this.saveToRetailTickets(syncIncData,syncIncDataValues,operationType,function(result){
                thisInstance.updApplyState({"ID":"","STATE":0,"MSG":""},function(result){
                    resultCallBack(result);
                })
            })
        }else if(clientTableName=="APP.TICKETLINES") {
            this.saveToRetailTicketsProducts(syncIncData,syncIncDataValues, operationType, function (result) {
                thisInstance.updApplyState({"ID": "", "STATE": 0, "MSG": ""}, function (result) {
                    resultCallBack(result);
                })
            })
        } else if(clientTableName=="APP.PAYMENTS"){
            this.saveToRetailReceiptsPayments(syncIncData,syncIncDataValues,operationType,function(result){
                thisInstance.updApplyState({"ID":"","STATE":0,"MSG":""},function(result){
                    resultCallBack(result);
                })
            })
        } else if(clientTableName=="APP.CLOSEDCASH"){
            var msg="Failed! No model for this data!";
            thisInstance.updApplyState({"ID":"","STATE":0,"MSG":msg},function(result){
                resultCallBack(result);
            })
        } else {
            resultCallBack({error:"Unknown table for apply data!"});
        }
    };

    app.post("/system/synchronization/applySyncIncomingData", function(req, res){
        var syncIncData= req.body;
        sys_sync_POSes.getDataItem({fields:["UNIT_ID"], conditions:{"NAME=":syncIncData["SYNC_POS_NAME"]}},
            function(result){
                if(!result||result.error){
                    res.send({error:"Failed get unit by SYNC_POS_NAME!"});
                    return;
                } else if(!result.item){
                    res.send({error:"Not finded unit by SYNC_POS_NAME!"});
                    return;
                }
                syncIncData["UNIT_ID"]=result.item["UNIT_ID"];

                sys_sync_incoming_data_details.getDataItems({fields:["NAME","VALUE"], conditions:{"SYNC_INCOMING_DATA_ID=":syncIncData["ID"]}},
                    function(result) {
                        if (!result || result.error) {
                            res.send({error: "Failed get sync incoming data details!"});
                            return;
                        } else if (!result.items) {
                            res.send({error: "No sync incoming data details!"});
                            return;
                        }
                        var syncIncDataValues= {};
                        for (var i = 0; i < result.items.length; i++) {
                            var dataItem = result.items[i];
                            syncIncDataValues[dataItem["NAME"]]= dataItem["VALUE"];
                        }
                        sys_sync_incoming_data.applyDataItem(syncIncData, syncIncDataValues/*{"ID":req.body["ID"],"CLIENT_TABLE_NAME":req.body["CLIENT_TABLE_NAME"]*/,
                            function(result){
                                res.send(result);
                            });
                    });
            });
    });
};

