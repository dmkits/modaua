var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrh_retail_tickets= require(appDataModelPath+"wrh_retail_tickets"),
    wrh_retail_tickets_products= require(appDataModelPath+"wrh_retail_tickets_products"),
    wrh_retail_tickets_products_wob= require(appDataModelPath+"wrh_retail_tickets_products_wob");
var dir_units= require(appDataModelPath+"dir_units"), dir_contractors= require(appDataModelPath+"dir_contractors"),
    sys_currency= require(appDataModelPath+"sys_currency"), sys_docstates= require(appDataModelPath+"sys_docstates");
var fin_retail_receipts= require(appDataModelPath+"fin_retail_receipts"),
    fin_retail_payments= require(appDataModelPath+"fin_retail_payments"),
    fin_retail_receipts_purposes= require(appDataModelPath+"fin_retail_receipts_purposes"),
    dir_retail_receipt_purposes= require(appDataModelPath+"dir_retail_receipt_purposes");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_retail_tickets,wrh_retail_tickets_products,wrh_retail_tickets_products_wob,
            fin_retail_receipts,fin_retail_payments,fin_retail_receipts_purposes,
            dir_retail_receipt_purposes], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/retailTickets";
module.exports.modulePagePath = "wrh/retailTickets.html";
module.exports.init = function(app){
    var wrhInvsListTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false, dataSource:"wrh_retail_tickets"},
        {"data": "NUMBER", "name": "Номер", "width": 50, "type": "text", dataSource:"wrh_retail_tickets"},
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataSource:"wrh_retail_tickets"},
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text", dataSource:"dir_units", dataField:"NAME"},
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 150, "type": "text", dataSource:"dir_contractors", dataField:"NAME"},
        //{"data": "SUPPLIER_ORDER_NUM", "name": "Номер заказа поставщика", "width": 100, "type": "text", dataSource:"wrh_retail_tickets"},
        //{"data": "SUPPLIER_INV_NUM", "name": "Номер накл. поставщика", "width": 100, "type": "text", dataSource:"wrh_retail_tickets"},
        //{"data": "PRODUCT_COLLECTION", "name": "Коллекция", "width": 150, "type": "text", dataSource:"dir_products_collections", dataField:"NAME"},
        {"data": "DOCCOUNT", "name": "Строк", "width": 60, "type": "numeric", visible:false, dataFunction:"0" },
        {"data": "DOCQTYSUM", "name": "Кол-во", "width": 60, "type": "numeric", dataFunction:"0" },
        {"data": "DOCSUM", "name": "Сумма", "width": 60, "type": "numeric2", dataFunction:"0.00" },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", dataField:"CODE"},
        {"data": "CURRENCY_CODENAME", "name": "Валюта", "width": 50, "type": "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {"data": "DOCSTATE_NAME", "name": "Статус", "width": 110, "type": "text", dataSource:"sys_docstates", dataField:"NAME"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_retail_tickets"}
       // ,{"data": "BASE_FACTOR", "name": "Базов.коэфф.", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_retail_tickets"}
    ];
    app.get("/wrh/retailTickets/getDataForRTicketsListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_retail_tickets."+condItem]=req.query[condItem];
        wrh_retail_tickets.getDataForTable({tableColumns:wrhInvsListTableColumns,
                identifier:wrhInvsListTableColumns[0].data,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/retailTickets/getRTicketData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_retail_tickets."+condItem]=req.query[condItem];
        wrh_retail_tickets.getDataItemForTable({tableColumns:wrhInvsListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/retailTickets/getNewRTicketData", function(req, res){
        wrh_retail_tickets.getDataItem({fieldFunction:{name:"MAXNUMBER", function:"maxPlus1", sourceField:"NUMBER"},
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
                                wrh_retail_tickets.setDataItem({
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
    app.post("/wrh/retailTickets/storeRTicketData", function(req, res){
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
                            wrh_retail_tickets.storeTableDataItem({tableColumns:wrhInvsListTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    res.send(result);
                                });
                        });
                  //  });
                });
            });
        });
    });
    app.post("/wrh/retailTickets/deleteRTicketData", function(req, res){
        var delData=req.body;
        wrh_retail_tickets.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });

    var wrhInvProductsTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "INV_ID", "name": "INV_ID", "width": 50, "type": "text", readOnly:true, visible:false},
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
    app.get("/wrh/retailTickets/getDataForRTicketProductsTable", function(req, res){
        wrh_retail_tickets_products.getDataForTable({tableColumns:wrhInvProductsTableColumns,
                identifier:wrhInvProductsTableColumns[0].data,
                conditions:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/retailTickets/storeRTicketProductsTableData", function(req, res){
        wrh_retail_tickets_products.storeTableDataItem({tableColumns:wrhInvProductsTableColumns, idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/retailTickets/deleteRTicketProductsTableData", function(req, res){
        wrh_retail_tickets_products.delTableDataItem({idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
};