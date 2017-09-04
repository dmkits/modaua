var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrhPInvs= require(appDataModelPath+"wrh_pinvs"), wrhPInvsProducts= require(appDataModelPath+"wrh_pinvs_products");
var dirUnits= require(appDataModelPath+"dir_units"), dirContractors= require(appDataModelPath+"dir_contractors"),
    sysCurrency= require(appDataModelPath+"sys_currency"), sysDocStates= require(appDataModelPath+"sys_docstates"),
    dirProdsCollections= require(appDataModelPath+"dir_products_collections");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"wrh_pinvs":wrhPInvs/*,"wrh_pinvs_products":wrhPInvsProducts*/},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/pinvoices";
module.exports.modulePagePath = "wrh/pinvoices.html";
module.exports.init = function(app){
    var wrhPInvsListTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false, dataSource:"wrh_pinvs"},
        {"data": "NUMBER", "name": "Номер", "width": 50, "type": "text", dataSource:"wrh_pinvs"},
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "text_date", dataSource:"wrh_pinvs"},
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text", dataSource:"dir_units", sourceField:"NAME"},
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 120, "type": "text", dataSource:"dir_contractors", sourceField:"NAME"},
        {"data": "SUPPLIER_ORDER_NUM", "name": "Номер заказа поставщика", "width": 100, "type": "text", dataSource:"wrh_pinvs"},
        {"data": "SUPPLIER_INV_NUM", "name": "Номер накл. поставщика", "width": 100, "type": "text", dataSource:"wrh_pinvs"},
        {"data": "PRODUCT_COLLECTION", "name": "Коллекция", "width": 50, "type": "text", dataSource:"dir_products_collections", sourceField:"NAME"},
        {"data": "DOCSUM", "name": "Сумма", "width": 60, "type": "numeric2"},
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", sourceField:"CODE"},
        {"data": "CURRENCY_CODENAME", "name": "Валюта", "width": 50, "type": "text", visible:false,
            dataSource:"sys_currency", sourceFieldFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {"data": "DOCSTATE_NAME", "name": "Статус", "width": 110, "type": "text", dataSource:"sys_docstates", sourceField:"NAME"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_pinvs"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_pinvs"},
        {"data": "BASE_FACTOR", "name": "Базов.коэфф.", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_pinvs"}
    ];
    app.get("/wrh/pInvoices/getDataForWrhPInvsListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_pinvs."+condItem]=req.query[condItem];
        wrhPInvs.getDataForTable({tableColumns:wrhPInvsListTableColumns,
                identifier:wrhPInvsListTableColumns[0].data,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/pInvoices/getPInvData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_pinvs."+condItem]=req.query[condItem];
        wrhPInvs.getDataItemForTable({tableColumns:wrhPInvsListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/pInvoices/getNewPInvData", function(req, res){
        wrhPInvs.getDataItem({fieldFunction:{name:"MAXNUMBER", function:"maxPlus1", sourceField:"NUMBER"}},
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
                                        wrhPInvs.setDataItem({
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
    app.post("/wrh/pInvoices/storePInvData", function(req, res){
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
                            var storeTableData={};
                            wrhPInvs.storeTableDataItem({tableColumns:wrhPInvsListTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    //if(!result.resultItem){
                                    //
                                    //    return;
                                    //}
                                    res.send(result);
                                });
                        });
                    });
                });
            });
        });


        //res.send({});
        //wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
        //    res.send(result);
        //});
    });
    app.post("/wrh/pInvoices/deletePInvData", function(req, res){
        res.send({});
        //wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
        //    res.send(result);
        //});
    });

    var wrhOrderBataDetailsTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "ORDER_BATA_ID", "name": "ORDER_BATA_ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "POS", "name": "Номер п/п", "width": 45, "type": "text"},
        {"data": "PRODUCT_GENDER_CODE", "name": "Код группы", "width": 50, "type": "text"},
        {"data": "PRODUCT_GENDER", "name": "Группа", "width": 90, "type": "text"},
        {"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории", "width": 60, "type": "text"},
        {"data": "PRODUCT_CATEGORY", "name": "Категория", "width": 170, "type": "text"},
        {"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 75, "type": "text"},
        {"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория", "width": 130, "type": "text"},
        {"data": "PRODUCT_ARTICLE", "name": "Артикул", "width": 80, "type": "text"},
        {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric"},
        {"data": "RETAIL_PRICE", "name": "Цена Retail", "width": 60, "type": "numeric2"},
        {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2"},
        {"data": "POSSUM", "name": "Сумма", "width": 80, "type": "numeric2"}
    ];
    app.get("/wrh/pInvoices/getDataForWrhOrdersBataDetailsTable", function(req, res){
        wrhPInvsProducts.getDataForTable({tableColumns:wrhOrderBataDetailsTableColumns,
                identifier:wrhOrderBataDetailsTableColumns[0].data,
                conditions:req.body},
            function(result){
                res.send(result);
            });
    });
    //app.get("/dir/contractors/newDataForDirContractorsTable", function(req, res){
    //    dirProducts.getNewDataForDirContractorsTable(function(result){
    //        res.send(result);
    //    });
    //});
    //app.post("/dir/products/storeDirProductsTableData", function(req, res){
    //    wrhOrderBataDetailsView.getDataForWrhOrdersBataDetailsTable(req.body, function(result){
    //        res.send(result);
    //    });
    //});
    //app.post("/dir/contractors/deleteDirContractorsTableData", function(req, res){
    //    dirProducts.deleteDirContractorsTableData(req.body, function(result){
    //        res.send(result);
    //    });
    //});
};