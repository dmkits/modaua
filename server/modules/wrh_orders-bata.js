var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrhOrdersBata= require(appDataModelPath+"wrh_orders_bata");
var wrhOrdersBataView= require(appDataModelPath+"wrh_orders_bata_view");
var wrhOrderBataDetails= require(appDataModelPath+"wrh_order_bata_details");
var wrhOrderBataDetailsView= require(appDataModelPath+"wrh_order_bata_details_view");
var dirUnits= require(appDataModelPath+"dir_units"),
    dirContractors= require(appDataModelPath+"dir_contractors"),
    sysCurrency= require(appDataModelPath+"sys_currency"),
    sysDocStates= require(appDataModelPath+"sys_docstates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"wrh_orders_bata":wrhOrdersBata,//"wrh_orders_bata_view":wrhOrdersBataView,
            "wrh_orders_bata_details":wrhOrderBataDetails/*,"wrh_orders_bata_details_view":wrhOrderBataDetailsView*/},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/orders-bata";
module.exports.modulePagePath = "wrh/orders-bata.html";
module.exports.init = function(app){
    var wrhOrdersBataListTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false, dataSource:"wrh_orders_bata"},
        {"data": "NUMBER", "name": "Номер", "width": 50, "type": "text", dataSource:"wrh_orders_bata"},
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "text_date", dataSource:"wrh_orders_bata"},
        {"data": "SUPPLIER_ORDER_NUM", "name": "Номер заказа поставщика", "width": 100, "type": "text", dataSource:"wrh_orders_bata"},
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text", dataSource:"dir_units", sourceField:"NAME"},
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 120, "type": "text", dataSource:"dir_contractors", sourceField:"NAME"},
        {"data": "DOCSUM", "name": "Сумма", "width": 60, "type": "numeric2"},
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", sourceField:"CODE"},
        {"data": "DOCSTATE_NAME", "name": "Статус", "width": 110, "type": "text", dataSource:"sys_docstates", sourceField:"NAME"}
    ];
    app.get("/wrh/ordersBata/getDataForWrhOrdersBataListTable", function(req, res){
        wrhOrdersBata.getDataForTable({tableColumns:wrhOrdersBataListTableColumns,
                identifier:wrhOrdersBataListTableColumns[0].data,
                conditions:req.query},
            function(result){
                res.send(result);
            });
    });

    app.get("/wrh/ordersBata/getOrderBataData", function(req, res){
        wrhOrdersBata.getDataItem({fields:["ID","NUMBER","DOCDATE","SUPPLIER_ORDER_NUM"],
                conditions:req.query},
            function(result){
                res.send(result);
            });
        //res.send({});
    });
    app.get("/wrh/ordersBata/getNewOrderBataData", function(req, res){
        wrhOrdersBata.getDataItem({fieldFunction:{name:"MAXNUMBER", function:"maxPlus1", sourceField:"NUMBER"}},
            function(result){
                var newNumber=(result&&result.item)?result.item["MAXNUMBER"]:"", docDate=dateFormat(new Date(),"yyyy-mm-dd");
                dirUnits.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                    var unitName=(result&&result.item)?result.item["NAME"]:"";
                    dirContractors.getDataItem({fields:["NAME"],conditions:{"ID=":"1"}}, function(result){
                        var supplierName=(result&&result.item)?result.item["NAME"]:"";
                        sysCurrency.getDataItem({fields:["CODE"],conditions:{"ID=":"0"}}, function(result){
                            var sysCurrencyCode=(result&&result.item)?result.item["CODE"]:"";
                            //sysDocStates.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                            //});
                            wrhOrdersBata.setDataItem({fields:["NUMBER","DOCDATE","SUPPLIER_ORDER_NUM","UNIT_NAME","SUPPLIER_NAME",
                                    "CURRENCY_CODE","DOCSTATE_NAME", "DOCCOUNT","DOCQTYSUM","DOCSUM"],
                                    values:[newNumber,docDate,"",unitName,supplierName,sysCurrencyCode,"",0,0,0]},
                                function(result){
                                    res.send(result);
                                });
                        });
                    });
                });
            });
    });
    app.post("/wrh/ordersBata/storeOrderBataData", function(req, res){
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
                    var docStateID=0;
                    sysDocStates.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["DOCSTATE_NAME"]}}, function(result){
                        if(result.item) docStateID=result.item["ID"];
                        storeData["DOCSTATE_ID"]=docStateID;
                        var storeTableData={};
                        wrhOrdersBata.storeTableDataItem({idFieldName:"ID", storeTableData:storeData},function(result){
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


        //res.send({});
        //wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
        //    res.send(result);
        //});
    });
    app.post("/wrh/ordersBata/deleteOrderBataData", function(req, res){
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
    app.get("/wrh/ordersBata/getDataForWrhOrdersBataDetailsTable", function(req, res){
        wrhOrderBataDetails.getDataForTable({tableColumns:wrhOrderBataDetailsTableColumns,
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