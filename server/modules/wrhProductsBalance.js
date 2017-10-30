var dataModel=require('../datamodel');
var wrh_products_operations_v= require(appDataModelPath+"wrh_products_operations_v"),
    dir_products=require(appDataModelPath+'dir_products-bata'),
    dir_products_batches= require(appDataModelPath+"dir_products_batches"),
    dir_products_batches_v= require(appDataModelPath+"dir_products_batches_v");
var server= require("../server"), log= server.log;

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_products_operations_v, dir_products,
            dir_products_batches, dir_products_batches_v], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/productsBalance";
module.exports.modulePagePath = "wrh/productsBalance.html";
module.exports.init = function(app) {

    var repProductsBalanceRegisterTableColumns=[
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID", visible:false },
        { dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        {data: "PINV_SQTY", name: "Кол-во прихода", dataSource:"dir_products_batches_v", sourceField:"QTY"},
        {data: "QTY", name: "Кол-во остатка", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}},
        { dataSource:"dir_products_batches_v",
            linkCondition:"dir_products_batches_v.PRODUCT_ID=wrh_products_operations_v.PRODUCT_ID" +
                " and dir_products_batches_v.BATCH_NUMBER=wrh_products_operations_v.BATCH_NUMBER"},
        {data: "PINV_NUMBER", name: "Номер прихода", dataSource:"dir_products_batches_v", sourceField:"R_DOCNUMBER"},
        {data: "PINV_CURRENCY_CODE", name: "Валюта прихода", width:70,
            dataSource:"sys_currency", sourceField:"CODE", linkCondition:"sys_currency.ID=dir_products_batches_v.CURRENCY_ID"},
        {data: "PINV_PRICE", name: "Цена прихода", dataSource:"dir_products_batches_v", sourceField:"PRICE"},
        {data: "COST_SUM", name: "Себе-стоимость",
            dataFunction:{function:"sumIsNull", sourceField:"wrh_products_operations_v.BATCH_QTY*dir_products_batches_v.PRICE"}},
        {data: "SALE_PRICE", name: "Розн. цена"},
        {data: "DISCOUNT_PERCENT", name: "Скидка, %", width:70},
        {data: "SALE_PRICE_WD", name: "Розн. цена со ск."}
    ];
    repProductsBalanceRegisterTableColumns=
        dir_products.addProductColumnsTo(repProductsBalanceRegisterTableColumns,2,{linkSource:"wrh_products_operations_v",
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repProductsBalanceRegisterTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBalanceRegisterTableColumns,2);
    app.get("/wrh/productsBalance/getProductsBalanceRegister", function (req, res) {
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
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID", visible:false },
        { dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        //{ data: "PROD_ID", name: "PROD_ID", sourceField:"ID", dataSource:"dir_products", linkCondition:"dir_products.ID=wrh_products_operations_v.PRODUCT_ID"},
        {data: "PINV_SQTY", name: "Кол-во прихода"},
        {data: "QTY", name: "Кол-во остатка", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}},
        {data: "PINV_NUMBER", name: "Номер прихода"},
        {data: "PINV_CURRENCY_CODE", name: "Валюта прихода", width:70},
        {data: "PINV_PRICE", name: "Цена прихода"},
        {data: "COST_SUM", name: "Себе-стоимость" /*, dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}*/},
        {data: "SALE_PRICE_WD", name: "Цена продажи"},
        {data: "DISCOUNT_PERCENT", name: "Скидка, %", width:70}
    ];
    repProductsBalanceRegisterByProductsArticlesTableColumns=
        dir_products.addProductAttrsColumnsTo(repProductsBalanceRegisterByProductsArticlesTableColumns,2,{
            excludeColumns:{"SIZE":true}
        });
    app.get("/wrh/productsBalance/getProductsBalanceRegisterByProductsArticles", function (req, res) {
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