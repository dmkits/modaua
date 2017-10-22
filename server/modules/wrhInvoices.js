var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrh_invs= require(appDataModelPath+"wrh_invs"),
    wrh_invs_products= require(appDataModelPath+"wrh_invs_products"),
    wrh_invs_products_wob= require(appDataModelPath+"wrh_invs_products_wob");
var dir_units= require(appDataModelPath+"dir_units"), dir_contractors= require(appDataModelPath+"dir_contractors"),
    sys_currency= require(appDataModelPath+"sys_currency"), sys_docstates= require(appDataModelPath+"sys_docstates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_invs,wrh_invs_products,wrh_invs_products_wob], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/invoices";
module.exports.modulePagePath = "wrh/invoices.html";
module.exports.init = function(app){
    var wrhInvsListTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false, dataSource:"wrh_invs"},
        {data: "NUMBER", name: "Номер", width: 50, type: "text", dataSource:"wrh_invs"},
        {data: "DOCDATE", name: "Дата", width: 55, type: "dateAsText", dataSource:"wrh_invs"},
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text", dataSource:"dir_units", sourceField:"NAME"},
        {data: "BUYER_NAME", name: "Покупатель", width: 150, type: "text", dataSource:"dir_contractors", sourceField:"NAME"},
        //{data: "SUPPLIER_ORDER_NUM", name: "Номер заказа поставщика", width: 100, type: "text", dataSource:"wrh_invs"},
        //{data: "SUPPLIER_INV_NUM", name: "Номер накл. поставщика", width: 100, type: "text", dataSource:"wrh_invs"},
        //{data: "PRODUCT_COLLECTION", name: "Коллекция", width: 150, type: "text", dataSource:"dir_products_collections", sourceField:"NAME"},
        {data: "DOCCOUNT", name: "Строк", width: 60, type: "numeric", visible:false, dataFunction:"0" },
        {data: "DOCQTYSUM", name: "Кол-во", width: 60, type: "numeric", dataFunction:"0" },
        {data: "DOCSUM", name: "Сумма", width: 60, type: "numeric2", dataFunction:"0.00" },
        {data: "CURRENCY_CODE", name: "Валюта", width: 50, type: "text", dataSource:"sys_currency", sourceField:"CODE"},
        {data: "CURRENCY_CODENAME", name: "Валюта", width: 50, type: "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {data: "DOCSTATE_NAME", name: "Статус", width: 110, type: "text", dataSource:"sys_docstates", sourceField:"NAME"},
        {data: "RATE", name: "Курс валюты", width: 60, type: "numeric2", visible:false, dataSource:"wrh_invs"}
       // ,{data: "BASE_FACTOR", name: "Базов.коэфф.", width: 60, type: "numeric2", visible:false, dataSource:"wrh_invs"}
    ];
    app.get("/wrh/invoices/getDataForInvsListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_invs."+condItem]=req.query[condItem];
        wrh_invs.getDataForTable({tableColumns:wrhInvsListTableColumns,
                identifier:wrhInvsListTableColumns[0].data,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/invoices/getInvData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_invs."+condItem]=req.query[condItem];
        wrh_invs.getDataItemForTable({tableColumns:wrhInvsListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/invoices/getNewInvData", function(req, res){
        wrh_invs.getDataItem({fields:["MAXNUMBER"],fieldsFunctions:{"MAXNUMBER":{function:"maxPlus1", sourceField:"NUMBER"}},
                conditions:{"1=1":null}},
            function(result){
                var newNumber=(result&&result.item)?result.item["MAXNUMBER"]:"", docDate=dateFormat(new Date(),"yyyy-mm-dd");
                dir_units.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                    var unitName=(result&&result.item)?result.item["NAME"]:"";
                    dir_contractors.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                        var buyerName=(result&&result.item)?result.item["NAME"]:"";
                        sys_currency.getDataItem({ fields:["CODE","CODENAME"],
                                fieldsFunctions:{"CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"]}},
                                conditions:{"ID=":"0"} },
                            function(result){
                                var sysCurrencyCode=(result&&result.item)?result.item["CODE"]:"";
                                var sysCurrencyCodeName=(result&&result.item)?result.item["CODENAME"]:"";
                                wrh_invs.setDataItem({
                                        fields:["NUMBER","DOCDATE","UNIT_NAME","BUYER_NAME",
                                            "CURRENCY_CODE","CURRENCY_CODENAME", "DOCSTATE_NAME", "DOCCOUNT","DOCQTYSUM","DOCSUM",
                                            "RATE"],
                                        values:[newNumber,docDate,unitName,buyerName,
                                            sysCurrencyCode,sysCurrencyCodeName, "",0,0,0,
                                            1]},
                                    function(result){
                                        res.send(result);
                                    });
                            });
                    });
                });
            });
    });
    app.post("/wrh/invoices/storeInvData", function(req, res){
        var storeData=req.body;
        dir_units.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["UNIT_NAME"]}}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"]=result.item["ID"];
            dir_contractors.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["BUYER_NAME"]}}, function(result){
                if(!result.item){
                    res.send({ error:"Cannot finded conractor by name!"});
                    return;
                }
                storeData["BUYER_ID"]=result.item["ID"];
                sys_currency.getDataItem({fields:["ID"],conditions:{"CODE=":storeData["CURRENCY_CODE"]}}, function(result){
                    if(!result.item){
                        res.send({ error:"Cannot finded currency by code!"});
                        return;
                    }
                    storeData["CURRENCY_ID"]=result.item["ID"];
                   // dirProdsCollections.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["PRODUCT_COLLECTION"]}}, function(result){
                       // storeData["COLLECTION_ID"]=result.item["ID"];
                        var docStateID=0;
                        sys_docstates.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["DOCSTATE_NAME"]}}, function(result){
                            if(result.item) docStateID=result.item["ID"];
                            storeData["DOCSTATE_ID"]=docStateID;
                            wrh_invs.storeTableDataItem({tableColumns:wrhInvsListTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    res.send(result);
                                });
                        });
                  //  });
                });
            });
        });
    });
    app.post("/wrh/invoices/deleteInvData", function(req, res){
        var delData=req.body;
        wrh_invs.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });

    var wrhInvProductsTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false},
        {data: "INV_ID", name: "INV_ID", width: 50, type: "text", readOnly:true, visible:false},
        {data: "POSIND", name: "POSIND", width: 45, type: "numeric", visible:false},
        {data: "POS", name: "Номер п/п", width: 45, type: "numeric", dataFunction:"TRUNCATE(POSIND,0)"},
        {data: "PRODUCT_ID", name: "PRODUCT_ID", width: 50, type: "text", visible:false},
        {data: "PRODUCT_CODE", name: "Код товара", width: 65, type: "text", dataSource:"dir_products", sourceField:"CODE"},
        {data: "BARCODE", name: "Штрихкод", width: 75, type: "text", visible:false},
        {data: "PRODUCT_NAME", name: "Товар", width: 250, type: "text", dataSource:"dir_products", sourceField:"NAME"},
        {data: "PRODUCT_UM", name: "Ед.изм.", width: 55, type: "text", dataSource:"dir_products", sourceField:"UM"},
        {data: "QTY", name: "Кол-во", width: 50, type: "numeric"},
        {data: "PRICE", name: "Цена", width: 60, type: "numeric2"},
        {data: "POSSUM", name: "Сумма", width: 80, type: "numeric2"},
        {data: "FACTOR", name: "Коэфф.", width: 60, type: "numeric2"},
        {data: "SALE_PRICE", name: "Цена продажи", width: 75, type: "numeric2"},
        {data: "PRICELIST_PRICE", name: "Цена по прайс-листу", width: 75, type: "numeric2"},
        {data: "BATCH_NUMBER", name: "BATCH_NUMBER", width: 60, type: "numeric", visible:false}
    ];
    app.get("/wrh/invoices/getDataForInvProductsTable", function(req, res){
        wrh_invs_products.getDataForTable({tableColumns:wrhInvProductsTableColumns,
                identifier:wrhInvProductsTableColumns[0].data,
                conditions:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/invoices/storeInvProductsTableData", function(req, res){
        wrh_invs_products.storeTableDataItem({tableColumns:wrhInvProductsTableColumns, idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/invoices/deleteInvProductsTableData", function(req, res){
        wrh_invs_products.delTableDataItem({idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
};