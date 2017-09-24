var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrh_orders_bata= require(appDataModelPath+"wrh_orders_bata"),
    wrh_orders_bata_details= require(appDataModelPath+"wrh_orders_bata_details");
//var wrhOrdersBataView= require(appDataModelPath+"wrh_orders_bata_view");
var dir_units= require(appDataModelPath+"dir_units"),
    dir_contractors= require(appDataModelPath+"dir_contractors"),
    sys_currency= require(appDataModelPath+"sys_currency"),
    sys_docstates= require(appDataModelPath+"sys_docstates");
var dir_products_articles= require(appDataModelPath+"dir_products_articles"),
    dir_products_genders= require(appDataModelPath+"dir_products_genders-bata"),
    dir_products_categories= require(appDataModelPath+"dir_products_categories-bata"),
    dir_products_subcategories= require(appDataModelPath+"dir_products_subcategories-bata"),
    dir_products_categories_subcategories= require(appDataModelPath+"dir_products_categories_subcats-bata");


module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"wrh_orders_bata":wrh_orders_bata,
            "wrh_orders_bata_details":wrh_orders_bata_details},
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
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataSource:"wrh_orders_bata"},
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text", dataSource:"dir_units", dataField:"NAME"},
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 120, "type": "text", dataSource:"dir_contractors", dataField:"NAME"},
        {"data": "SUPPLIER_ORDER_NUM", "name": "Номер заказа поставщика", "width": 80, "type": "text", dataSource:"wrh_orders_bata"},
        {"data": "DOCCOUNT", "name": "Строк", "width": 50, "type": "numeric", visible:false,
            childDataSource:"wrh_orders_bata_details", childLinkField:"ORDER_BATA_ID", parentLinkField:"ID",
            dataFunction:{function:"rowsCountIsNull", source:"wrh_orders_bata_details", sourceField:"POS"} },
        {"data": "DOCQTYSUM", "name": "Кол-во", "width": 60, "type": "numeric",
            childDataSource:"wrh_orders_bata_details", childLinkField:"ORDER_BATA_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_orders_bata_details", sourceField:"QTY"} },
        {"data": "DOCSUM", "name": "Сумма", "width": 80, "type": "numeric2",
            childDataSource:"wrh_orders_bata_details", childLinkField:"ORDER_BATA_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_orders_bata_details", sourceField:"POSSUM"} },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", dataField:"CODE"},
        {"data": "CURRENCY_CODENAME", "name": "Валюта", "width": 50, "type": "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {"data": "DOCSTATE_NAME", "name": "Статус", "width": 110, "type": "text", dataSource:"sys_docstates", dataField:"NAME"}
    ];
    app.get("/wrh/ordersBata/getDataForOrdersBataListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_orders_bata."+condItem]=req.query[condItem];
        wrh_orders_bata.getDataForTable({tableColumns:wrhOrdersBataListTableColumns,
                identifier:wrhOrdersBataListTableColumns[0].data,
                conditions:conditions, order:"NUMBER,DOCDATE,dir_units.NAME"},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/ordersBata/getOrderBataData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_orders_bata."+condItem]=req.query[condItem];
        wrh_orders_bata.getDataItemForTable({tableColumns:wrhOrdersBataListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/ordersBata/getNewOrderBataData", function(req, res){
        wrh_orders_bata.getDataItem({fieldFunction:{name:"MAXNUMBER", function:"maxPlus1", sourceField:"NUMBER"}},
            function(result){
                var newNumber=(result&&result.item)?result.item["MAXNUMBER"]:"", docDate=dateFormat(new Date(),"yyyy-mm-dd");
                dir_units.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                    var unitName=(result&&result.item)?result.item["NAME"]:"";
                    dir_contractors.getDataItem({fields:["NAME"],conditions:{"ID=":"1"}}, function(result){
                        var supplierName=(result&&result.item)?result.item["NAME"]:"";
                        sys_currency.getDataItem({ fields:["CODE","CODENAME"],
                                fieldsFunctions:{"CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"]}},
                                conditions:{"ID=":"0"} },
                            function(result){
                                var sysCurrencyCode=(result&&result.item)?result.item["CODE"]:"";
                                var sysCurrencyCodeName=(result&&result.item)?result.item["CODENAME"]:"";
                                //sys_docstates.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                                //});
                                wrh_orders_bata.setDataItem({fields:["NUMBER","DOCDATE","SUPPLIER_ORDER_NUM","UNIT_NAME","SUPPLIER_NAME",
                                        "CURRENCY_CODE","CURRENCY_CODENAME", "DOCSTATE_NAME", "DOCCOUNT","DOCQTYSUM","DOCSUM"],
                                        values:[newNumber,docDate,"",unitName,supplierName,sysCurrencyCode,sysCurrencyCodeName,"",0,0,0]},
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
        dir_units.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["UNIT_NAME"]}}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"]=result.item["ID"];
            dir_contractors.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["SUPPLIER_NAME"]}}, function(result){
                if(!result.item){
                    res.send({ error:"Cannot finded conractor by name!"});
                    return;
                }
                storeData["SUPPLIER_ID"]=result.item["ID"];
                sys_currency.getDataItem({fields:["ID"],conditions:{"CODE=":storeData["CURRENCY_CODE"]}}, function(result){
                    if(!result.item){
                        res.send({ error:"Cannot finded currency by code!"});
                        return;
                    }
                    storeData["CURRENCY_ID"]=result.item["ID"];
                    var docStateID=0;
                    sys_docstates.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["DOCSTATE_NAME"]}}, function(result){
                        if(result.item) docStateID=result.item["ID"];
                        storeData["DOCSTATE_ID"]=docStateID;
                        wrh_orders_bata.storeTableDataItem({tableColumns:wrhOrdersBataListTableColumns, idFieldName:"ID", storeTableData:storeData},
                            function(result){
                                res.send(result);
                            });
                    });
                });
            });
        });
    });
    app.post("/wrh/ordersBata/deleteOrderBataData", function(req, res){
        var delData=req.body;
        wrh_orders_bata.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });

    var wrhOrderBataDetailsTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "ORDER_BATA_ID", "name": "ORDER_BATA_ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "POS", "name": "Номер п/п", "width": 45, "type": "text"},
        {"data": "PRODUCT_GENDER_CODE", "name": "Код группы", "width": 65,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/genderCode",
            dataSource:"dir_products_genders", dataField:"CODE"},
        {"data": "PRODUCT_GENDER", "name": "Группа", "width": 150,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/gender",
            dataSource:"dir_products_genders", dataField:"NAME"},
        {"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории", "width": 80,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/CategoryCode",
            dataSource:"dir_products_categories", dataField:"CODE"},
        {"data": "PRODUCT_CATEGORY", "name": "Категория", "width": 200,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/Category",
            dataSource:"dir_products_categories", dataField:"NAME"},
        {"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 100,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/SubcategoryCode",
            dataSource:"dir_products_subcategories", dataField:"CODE"},
        {"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория", "width": 200,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/Subcategory",
            dataSource:"dir_products_subcategories", dataField:"NAME"},
        {"data": "PRODUCT_ARTICLE", "name": "Артикул", "width": 80, "type": "text",
            dataSource:"dir_products_articles", dataField:"VALUE"},
        {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric"},
        {"data": "RETAIL_PRICE", "name": "Цена Retail", "width": 60, "type": "numeric2"},
        {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2"},
        {"data": "POSSUM", "name": "Сумма", "width": 80, "type": "numeric2"}
    ];
    app.get("/wrh/ordersBata/getDataForOrdersBataDetailsTable", function(req, res){
        wrh_orders_bata_details.getDataForTable({tableColumns:wrhOrderBataDetailsTableColumns,
                identifier:wrhOrderBataDetailsTableColumns[0].data,
                conditions:req.query,
                order:["POS"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/ordersBata/storeOrdersBataDetailsTable", function(req, res){
        var storeData=req.body;
        var genderCondition={};
        if(storeData["PRODUCT_GENDER"]) genderCondition["NAME="]=storeData["PRODUCT_GENDER"];
        if(storeData["PRODUCT_GENDER_CODE"]) genderCondition["CODE="]=storeData["PRODUCT_GENDER_CODE"];
        dir_products_genders.getDataItem({fields:["ID"],conditions:genderCondition}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded gender by code,name!"});
                return;
            }
            storeData["PRODUCT_GENDER_ID"]=result.item["ID"];
            var categoryCondition={};
            if(storeData["PRODUCT_CATEGORY"]) categoryCondition["NAME="]=storeData["PRODUCT_CATEGORY"];
            if(storeData["PRODUCT_CATEGORY_CODE"]) categoryCondition["CODE="]=storeData["PRODUCT_CATEGORY_CODE"];
            dir_products_categories.getDataItem({fields:["ID"],conditions:categoryCondition}, function(result){
                if(!result.item){
                    res.send({ error:"Cannot finded category by code,name!"});
                    return;
                }
                storeData["PRODUCT_CATEGORY_ID"]=result.item["ID"];
                var subcategoryCondition={};
                if(storeData["PRODUCT_SUBCATEGORY"]) subcategoryCondition["NAME="]=storeData["PRODUCT_SUBCATEGORY"];
                if(storeData["PRODUCT_SUBCATEGORY_CODE"]) subcategoryCondition["CODE="]=storeData["PRODUCT_SUBCATEGORY_CODE"];
                dir_products_subcategories.getDataItem({fields:["ID"],conditions:subcategoryCondition}, function(result) {
                    if (!result.item) {
                        res.send({error: "Cannot finded subcategory by code,name!"});
                        return;
                    }
                    storeData["PRODUCT_SUBCATEGORY_ID"] = result.item["ID"];
                    var prodArticle=storeData["PRODUCT_ARTICLE"];

                    //_findDataItemByOrCreate
                    dir_products_articles.findDataItemByOrCreateNew({findCondition:{"VALUE=":prodArticle},resultFields:["ID"],
                            newData:{"VALUE":prodArticle} },
                        function(result){
                            if (result.error||!result.resultItem||result.resultItem["ID"]==null) {
                                res.send({error: "Cannot finded or create article!"});
                                return;
                            }
                            storeData["PRODUCT_ARTICLE_ID"] = result.resultItem["ID"];
                            wrh_orders_bata_details.storeTableDataItem({tableColumns:wrhOrderBataDetailsTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    if (result.error) {
                                        res.send({error: "Cannot store order bata! Reason:"+result.error});
                                        return;
                                    }
                                    res.send(result);
                                });
                        });

                    //dir_products_articles.getDataItem({fields:["ID"],conditions:{"VALUE=":prodArticle}}, function(result) {
                    //    //var
                    //    if (!result.item) {
                    //
                    //        dir_products_articles.storeDataItem({idFieldName:"ID",storeData:{"ID":null,"VALUE":prodArticle}},
                    //            function(result){
                    //                if(!result.updateCount>0||!result.resultItem){
                    //                    res.send({error: "Cannot added new article!"});
                    //                    return;
                    //                }
                    //                storeData["PRODUCT_ARTICLE_ID"] = result.resultItem["ID"];
                    //                wrh_orders_bata_details.storeTableDataItem({tableColumns:wrhOrderBataDetailsTableColumns, idFieldName:"ID", storeTableData:storeData},
                    //                    function(result){
                    //                        res.send(result);
                    //                    });
                    //            });
                    //        return;
                    //    }
                    //    storeData["PRODUCT_ARTICLE_ID"] = result.item["ID"];
                    //    wrh_orders_bata_details.storeTableDataItem({tableColumns:wrhOrderBataDetailsTableColumns, idFieldName:"ID", storeTableData:storeData},
                    //        function(result){
                    //            res.send(result);
                    //        });
                    //});
                });
            });
        });
    });
    app.post("/wrh/ordersBata/deleteOrdersBataDetailsTable", function(req, res){
        var delData=req.body;
        wrh_orders_bata_details.delTableDataItem({idFieldName:"ID", delTableData:delData}, function(result){
            res.send(result);
        });
    });
};