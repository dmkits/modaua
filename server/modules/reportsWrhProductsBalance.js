var dataModel=require('../datamodel');
var wrh_products_operations_v= require(appDataModelPath+"wrh_products_operations_v"),
    dir_products=require(appDataModelPath+'dir_products-bata'),
    dir_products_batches= require(appDataModelPath+"dir_products_batches");
var server= require("../server"), log= server.log;

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_products_operations_v, dir_products,
            dir_products_batches], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/reports/productsBalance";
module.exports.modulePagePath = "reports/productsBalance.html";
module.exports.init = function(app) {

    var repProductsBalanceRegisterTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        { dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        //{ "data": "PROD_ID", "name": "PROD_ID", sourceField:"ID", dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        {"data": "PINV_SQTY", "name": "Кол-во прихода"},
        {"data": "SQTY", "name": "Кол-во остатка", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}},
        {"data": "PINV_NUMBER", "name": "Номер прихода"},
        {"data": "PINV_CURRENCY_CODE", "name": "Валюта прихода", width:70},
        {"data": "PINV_PRICE", "name": "Цена прихода"},
        {"data": "COST_SUM", "name": "Себе-стоимость" /*, dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}*/},
        {"data": "SALE_PRICE", "name": "Розн. цена"},
        {"data": "DISCOUNT_PERCENT", "name": "Скидка, %", width:70},
        {"data": "SALE_PRICE_WD", "name": "Розн. цена со ск."}
    ];
    //repProductsBalanceRegisterTableColumns=
    //    dir_products.addProductColumnsTo(repProductsBalanceRegisterTableColumns,1,{linkSource:"wrh_products_operations_v",
    //        visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repProductsBalanceRegisterTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBalanceRegisterTableColumns,2);
    app.get("/reports/productsBalance/getProductsBalanceRegister", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBalanceRegisterTableColumns,
                identifier:repProductsBalanceRegisterTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_ARTICLE","PRODUCT_TYPE","PRODUCT_KIND","PRODUCT_SIZE"]},
            function(result){
                res.send(result);
            });
    });
    var repProductsBalanceRegisterByProductsArticlesTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        { dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        //{ "data": "PROD_ID", "name": "PROD_ID", sourceField:"ID", dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        {"data": "PINV_SQTY", "name": "Кол-во прихода"},
        {"data": "SQTY", "name": "Кол-во остатка", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}},
        {"data": "PINV_NUMBER", "name": "Номер прихода"},
        {"data": "PINV_CURRENCY_CODE", "name": "Валюта прихода", width:70},
        {"data": "PINV_PRICE", "name": "Цена прихода"},
        {"data": "COST_SUM", "name": "Себе-стоимость" /*, dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}*/},
        {"data": "SALE_PRICE_WD", "name": "Цена продажи"},
        {"data": "DISCOUNT_PERCENT", "name": "Скидка, %", width:70}
    ];
    repProductsBalanceRegisterByProductsArticlesTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBalanceRegisterByProductsArticlesTableColumns,2,{
            excludeColumns:{"SIZE":true}
        });
    app.get("/reports/productsBalance/getProductsBalanceRegisterByProductsArticles", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBalanceRegisterByProductsArticlesTableColumns,
                identifier:repProductsBalanceRegisterByProductsArticlesTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_ARTICLE","PRODUCT_TYPE","PRODUCT_KIND"]},
            function(result){
                res.send(result);
            });
    });

    var repProductsBalanceTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"} }
    ];
    repProductsBalanceTableColumns=
        dir_products.addProductColumnsTo(repProductsBalanceTableColumns,1,{linkSource:"wrh_products_operations_v",
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repProductsBalanceTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBalanceTableColumns,6);
    app.get("/reports/productsBalance/getProductsBalance", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBalanceTableColumns,
                identifier:repProductsBalanceTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_ARTICLE","PRODUCT_SIZE"]},
            function(result){
                res.send(result);
            });
    });
    var repProductsBalanceByBataAttributesTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        { dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"} }
    ];
    repProductsBalanceByBataAttributesTableColumns=
        dir_products.addProductBataAttrsColumnsTo(repProductsBalanceByBataAttributesTableColumns,2);
    app.get("/reports/productsBalance/getProductsBalanceByBataAttributes", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBalanceByBataAttributesTableColumns,
                identifier:repProductsBalanceByBataAttributesTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_GENDER","PRODUCT_CATEGORY","PRODUCT_SUBCATEGORY"]},
            function(result){
                res.send(result);
            });
    });
    var repProductsBalanceByTypesKindsTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        { dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"} }
    ];
    repProductsBalanceByTypesKindsTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBalanceByTypesKindsTableColumns,2, {
            excludeColumns:{"ARTICLE":true,"COLLECTION":true,"COLLECTION_CODE":true,"COMPOSITION":true,"SIZE":true}});
    app.get("/reports/productsBalance/getProductsBalanceByTypesKinds", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBalanceByTypesKindsTableColumns,
                identifier:repProductsBalanceByTypesKindsTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_TYPE","PRODUCT_KIND"]},
            function(result){
                res.send(result);
            });
    });

    var repProductsBatchesBalanceTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        {"data": "BATCH_NUMBER", "name": "Партия", width:70, type:"text", align:"center" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"} }
    ];
    repProductsBatchesBalanceTableColumns=
        dir_products.addProductColumnsTo(repProductsBatchesBalanceTableColumns,1,{linkSource:"wrh_products_operations_v",
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repProductsBatchesBalanceTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBatchesBalanceTableColumns,6);
    app.get("/reports/productsBalance/getProductsBatchesBalance", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBatchesBalanceTableColumns,
                identifier:repProductsBatchesBalanceTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_ARTICLE","PRODUCT_SIZE"]},
            function(result){
                res.send(result);
            });
    });

    var repProductsBalanceWCCTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"} },
        {"data": "COST_SUM", "name": "Себе-стоимость" /*, dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}*/}
    ];
    repProductsBalanceWCCTableColumns=
        dir_products.addProductColumnsTo(repProductsBalanceWCCTableColumns,1,{linkSource:"wrh_products_operations_v",
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repProductsBalanceWCCTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBalanceWCCTableColumns,6);
    app.get("/reports/productsBalance/getProductsBalanceWCC", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBalanceWCCTableColumns,
                identifier:repProductsBalanceWCCTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_ARTICLE","PRODUCT_SIZE"]},
            function(result){
                res.send(result);
            });
    });

    var repProductsBatchesBalanceWCCTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        {"data": "BATCH_NUMBER", "name": "Партия", width:70, type:"text", align:"center" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"} },
        {"data": "COST_SUM", "name": "Себе-стоимость" /*, dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}*/}
    ];
    repProductsBatchesBalanceWCCTableColumns=
        dir_products.addProductColumnsTo(repProductsBatchesBalanceWCCTableColumns,1,{linkSource:"wrh_products_operations_v",
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repProductsBatchesBalanceWCCTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBatchesBalanceWCCTableColumns,6);
    app.get("/reports/productsBalance/getProductsBatchesBalanceWCC", function (req, res) {
        var conditions=req.query;
        for(var conditionItem in conditions){
            conditions["SUM(BATCH_QTY)<>0"]=null; break;
        }
        wrh_products_operations_v.getDataForDocTable({tableColumns:repProductsBatchesBalanceWCCTableColumns,
                identifier:repProductsBatchesBalanceWCCTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_ARTICLE","PRODUCT_SIZE"]},
            function(result){
                res.send(result);
            });
    });

    dir_products_batches.createNewBatch= function(params,resultCallback){
        if (!params) {                                                                                      log.error("FAILED dir_products_batches.createNewBatch! Reason: no parameters!");//test
            resultCallback({ error:"Failed create new batch for product! Reason:no function parameters!"});
            return;
        }
        if (!params.prodData||!params.prodData["PRODUCT_ID"]) {                                             log.error("FAILED dir_products_batches.createNewBatch! Reason: no prod data or prod ID!");//test
            resultCallback({ error:"Failed create new batch for product! Reason:no prod data or prod ID!"});
            return;
        }
        var prodID=params.prodData["PRODUCT_ID"], thisInstance=this;
        this.getDataItem({fields:["NEWBATCHNUMBER"],fieldsFunctions:{"NEWBATCHNUMBER":{function:"maxPlus1", sourceField:"BATCH_NUMBER"}},
                conditions:{"PRODUCT_ID=":prodID}},
            function(result) {
                var newBatchNumber = (result && result.item) ? result.item["NEWBATCHNUMBER"] : "1";
                var insData={"PRODUCT_ID":prodID, "BATCH_NUMBER":newBatchNumber};
                thisInstance.insDataItem({insData:insData},
                    function(result){
                        if(result&&!result.error&&result.updateCount>0) result.resultItem=insData;
                        resultCallback(result);
                    });
            });
    }
};