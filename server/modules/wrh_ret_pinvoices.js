var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrhRetPInvs= require(appDataModelPath+"wrh_ret_pinvs"), wrhRetPInvsProducts= require(appDataModelPath+"wrh_ret_pinvs_products");
var dirUnits= require(appDataModelPath+"dir_units"), dirContractors= require(appDataModelPath+"dir_contractors"),
    sysCurrency= require(appDataModelPath+"sys_currency"), sysDocStates= require(appDataModelPath+"sys_docstates"),
    dirProdsCollections= require(appDataModelPath+"dir_products_collections");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"wrh_ret_pinvs":wrhRetPInvs,"wrh_ret_pinvs_products":wrhRetPInvsProducts},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/ret_pinvoices";
module.exports.modulePagePath = "wrh/ret_pinvoices.html";
module.exports.init = function(app){
    var wrhRetPInvsListTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false, dataSource:"wrh_ret_pinvs"},
        {"data": "NUMBER", "name": "Номер", "width": 50, "type": "text", dataSource:"wrh_ret_pinvs"},
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataSource:"wrh_ret_pinvs"},
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text", dataSource:"dir_units", dataField:"NAME"},
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 150, "type": "text", dataSource:"dir_contractors", dataField:"NAME"},
        {"data": "SUPPLIER_ORDER_NUM", "name": "Номер заказа поставщика", "width": 100, "type": "text", dataSource:"wrh_ret_pinvs"},
        {"data": "SUPPLIER_INV_NUM", "name": "Номер накл. поставщика", "width": 100, "type": "text", dataSource:"wrh_ret_pinvs"},
        {"data": "PRODUCT_COLLECTION", "name": "Коллекция", "width": 150, "type": "text", dataSource:"dir_products_collections", dataField:"NAME"},
        {"data": "DOCCOUNT", "name": "Строк", "width": 60, "type": "numeric", visible:false, dataFunction:"0" },
        {"data": "DOCQTYSUM", "name": "Кол-во", "width": 60, "type": "numeric", dataFunction:"0" },
        {"data": "DOCSUM", "name": "Сумма", "width": 60, "type": "numeric2", dataFunction:"0.00" },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", dataField:"CODE"},
        {"data": "CURRENCY_CODENAME", "name": "Валюта", "width": 50, "type": "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {"data": "DOCSTATE_NAME", "name": "Статус", "width": 110, "type": "text", dataSource:"sys_docstates", dataField:"NAME"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_ret_pinvs"},
        {"data": "BASE_FACTOR", "name": "Базов.коэфф.", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_ret_pinvs"}
    ];
    app.get("/wrh/retPInvoices/getDataForRetPInvsListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_ret_pinvs."+condItem]=req.query[condItem];
        wrhRetPInvs.getDataForTable({tableColumns:wrhRetPInvsListTableColumns,
                identifier:wrhRetPInvsListTableColumns[0].data,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/retPInvoices/getRetPInvData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_ret_pinvs."+condItem]=req.query[condItem];
        wrhRetPInvs.getDataItemForTable({tableColumns:wrhRetPInvsListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/retPInvoices/getNewRetPInvData", function(req, res){
        wrhRetPInvs.getDataItem({fieldFunction:{name:"MAXNUMBER", function:"maxPlus1", sourceField:"NUMBER"},
                conditions:{"1=1":null}},
            function(result){
                var newNumber=(result&&result.item)?result.item["MAXNUMBER"]:"", docDate=dateFormat(new Date(),"yyyy-mm-dd");
                dirUnits.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                    var unitName=(result&&result.item)?result.item["NAME"]:"";
                    dirContractors.getDataItem({fields:["NAME"],conditions:{"ID=":"1"}}, function(result){
                        var supplierName=(result&&result.item)?result.item["NAME"]:"";
                        sysCurrency.getDataItem({ fields:["CODE","CODENAME"],
                                fieldsFunctions:{"CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"]}},
                                conditions:{"ID=":"0"} },
                            function(result){
                                var sysCurrencyCode=(result&&result.item)?result.item["CODE"]:"";
                                var sysCurrencyCodeName=(result&&result.item)?result.item["CODENAME"]:"";
                                dirProdsCollections.getDataItem({ fields:["NAME"], conditions:{"ID=":"1"} },
                                    function(result){
                                        var dirProductsCollectionName=(result&&result.item)?result.item["NAME"]:"";
                                        //sysDocStates.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                                        //});
                                        wrhRetPInvs.setDataItem({
                                                fields:["NUMBER","DOCDATE","UNIT_NAME","SUPPLIER_NAME","SUPPLIER_ORDER_NUM","SUPPLIER_INV_NUM",
                                                    "CURRENCY_CODE","CURRENCY_CODENAME", "PRODUCT_COLLECTION", "DOCSTATE_NAME", "DOCCOUNT","DOCQTYSUM","DOCSUM",
                                                    "RATE","BASE_FACTOR"],
                                                values:[newNumber,docDate,unitName,supplierName,"","",
                                                    sysCurrencyCode,sysCurrencyCodeName, dirProductsCollectionName, "",0,0,0,
                                                    1, 2]},
                                            function(result){
                                                res.send(result);
                                            });
                                    });
                            });
                    });
                });
            });
    });
    app.post("/wrh/retPInvoices/storeRetPInvData", function(req, res){
        var storeData=req.body;
        dirUnits.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["UNIT_NAME"]}}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"]=result.item["ID"];
            dirContractors.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["SUPPLIER_NAME"]}}, function(result){
                if(!result.item){
                    res.send({ error:"Cannot finded conractor by name!"});
                    return;
                }
                storeData["SUPPLIER_ID"]=result.item["ID"];
                sysCurrency.getDataItem({fields:["ID"],conditions:{"CODE=":storeData["CURRENCY_CODE"]}}, function(result){
                    if(!result.item){
                        res.send({ error:"Cannot finded currency by code!"});
                        return;
                    }
                    storeData["CURRENCY_ID"]=result.item["ID"];
                    dirProdsCollections.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["PRODUCT_COLLECTION"]}}, function(result){
                        storeData["COLLECTION_ID"]=result.item["ID"];
                        var docStateID=0;
                        sysDocStates.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["DOCSTATE_NAME"]}}, function(result){
                            if(result.item) docStateID=result.item["ID"];
                            storeData["DOCSTATE_ID"]=docStateID;
                            wrhRetPInvs.storeTableDataItem({tableColumns:wrhRetPInvsListTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    res.send(result);
                                });
                        });
                    });
                });
            });
        });
    });
    app.post("/wrh/retPInvoices/deleteRetPInvData", function(req, res){
        var delData=req.body;
        wrhRetPInvs.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });

    var wrhRetPInvProductsTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "PINV_ID", "name": "PINV_ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "POSIND", "name": "POSIND", "width": 45, "type": "numeric", visible:false},
        {"data": "POS", "name": "Номер п/п", "width": 45, "type": "numeric", dataFunction:"TRUNCATE(POSIND,0)"},
        {"data": "PRODUCT_ID", "name": "PRODUCT_ID", "width": 50, "type": "text", visible:false},
        {"data": "PRODUCT_CODE", "name": "Код товара", "width": 65, "type": "text", dataSource:"dir_products", dataField:"CODE"},
        {"data": "BARCODE", "name": "Штрихкод", "width": 75, "type": "text", visible:false},
        {"data": "PRODUCT_NAME", "name": "Товар", "width": 250, "type": "text", dataSource:"dir_products", dataField:"NAME"},
        {"data": "PRODUCT_UM", "name": "Ед.изм.", "width": 55, "type": "text", dataSource:"dir_products", dataField:"UM"},
        {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric"},
        {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2"},
        {"data": "POSSUM", "name": "Сумма", "width": 80, "type": "numeric2"},
        {"data": "FACTOR", "name": "Коэфф.", "width": 60, "type": "numeric2"},
        {"data": "SALE_PRICE", "name": "Цена продажи", "width": 75, "type": "numeric2"},
        {"data": "PRICELIST_PRICE", "name": "Цена по прайс-листу", "width": 75, "type": "numeric2"},
        {"data": "BATCH_NUMBER", "name": "BATCH_NUMBER", "width": 60, "type": "numeric", visible:false}
    ];
    app.get("/wrh/retPInvoices/getDataForRetPInvProductsTable", function(req, res){
        wrhRetPInvsProducts.getDataForTable({tableColumns:wrhRetPInvProductsTableColumns,
                identifier:wrhRetPInvProductsTableColumns[0].data,
                conditions:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/retPInvoices/storeRetPInvProductsTableData", function(req, res){
        wrhRetPInvsProducts.storeTableDataItem({tableColumns:wrhRetPInvProductsTableColumns, idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/retPInvoices/deleteRetPInvProductsTableData", function(req, res){
        wrhRetPInvsProducts.delTableDataItem({idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
};