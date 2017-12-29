var dataModel=require('../datamodel');
var wrh_products_operations_v= require(appDataModelPath+"wrh_products_operations_v"),
    wrh_products_r_operations= require(appDataModelPath+"wrh_products_r_operations"),
    wrh_pinvs_products= require(appDataModelPath+"wrh_pinvs_products"),
    dir_products=require(appDataModelPath+'dir_products-bata'),
    dir_products_batches= require(appDataModelPath+"dir_products_batches"),
    dir_products_batches_v= require(appDataModelPath+"dir_products_batches_v"),
    dir_products_batches_sale_prices= require(appDataModelPath+"dir_products_batches_sale_prices");
var server= require("../server"), log= server.log;

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_products_operations_v, wrh_products_r_operations,
            dir_products, dir_products_batches, dir_products_batches_v], errs,
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
        {data: "PINV_SQTY", name: "Кол-во прихода", dataSource:"dir_products_batches_v", dataFunction:{function:"sumIsNull", sourceField:"QTY"}},
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
        {leftJoinedSources:
            {"dir_pricelists_products_batches": {
                "dir_pricelists_products_batches.PRICELIST_ID=dir_units.PRICELIST_ID":null ,
                "dir_pricelists_products_batches.PRODUCT_ID=wrh_products_operations_v.PRODUCT_ID":null,
                "dir_pricelists_products_batches.BATCH_NUMBER=wrh_products_operations_v.BATCH_NUMBER": null},
            "dir_products_batches_sale_prices": {
                "dir_products_batches_sale_prices.CHANGE_DATETIME=dir_pricelists_products_batches.CHANGE_DATETIME": null,
                "dir_products_batches_sale_prices.PRODUCT_ID=dir_pricelists_products_batches.PRODUCT_ID": null,
                "dir_products_batches_sale_prices.BATCH_NUMBER=dir_pricelists_products_batches.BATCH_NUMBER": null,
                "dir_products_batches_sale_prices.PRICELIST_ID=dir_pricelists_products_batches.PRICELIST_ID": null}}},
        {data: "SALE_PRICE", name: "Розн. цена", sourceField:"PRICE", dataSource:"dir_products_batches_sale_prices"},
        {data: "DISCOUNT", name: "Скидка, %", sourceField:"DISCOUNT", dataSource:"dir_products_batches_sale_prices"},
        {data: "PRICE_WITH_DISCOUNT", name: "Розн. цена со скидкой",sourceField:"PRICE_WITH_DISCOUNT", dataSource:"dir_products_batches_sale_prices" }
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
        { dataSource:"dir_products_batches_v",
            linkCondition:"dir_products_batches_v.PRODUCT_ID=wrh_products_operations_v.PRODUCT_ID" +
            " and dir_products_batches_v.BATCH_NUMBER=wrh_products_operations_v.BATCH_NUMBER"},
        {data: "PINV_SQTY", name: "Кол-во прихода", dataSource:"dir_products_batches_v", dataFunction:{function:"sumIsNull", sourceField:"QTY"}/*sourceField:"QTY"*/},
        {data: "QTY", name: "Кол-во остатка", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}},
        {data: "PINV_NUMBER", name: "Номер прихода", dataSource:"dir_products_batches_v", sourceField:"R_DOCNUMBER"},
        {data: "PINV_CURRENCY_CODE", name: "Валюта прихода", width:70,
            dataSource:"sys_currency", sourceField:"CODE", linkCondition:"sys_currency.ID=dir_products_batches_v.CURRENCY_ID"},
        {data: "PINV_PRICE", name: "Цена прихода", dataSource:"dir_products_batches_v", sourceField:"PRICE"},
        {data: "COST_SUM", name: "Себе-стоимость",
            dataFunction:{function:"sumIsNull", sourceField:"wrh_products_operations_v.BATCH_QTY*dir_products_batches_v.PRICE"}},
        {leftJoinedSources: {
            "dir_pricelists_products_batches": {
                "dir_pricelists_products_batches.PRICELIST_ID=dir_units.PRICELIST_ID":null ,
                "dir_pricelists_products_batches.PRODUCT_ID=wrh_products_operations_v.PRODUCT_ID":null,
                "dir_pricelists_products_batches.BATCH_NUMBER=wrh_products_operations_v.BATCH_NUMBER": null},
            "dir_products_batches_sale_prices": {
                "dir_products_batches_sale_prices.CHANGE_DATETIME=dir_pricelists_products_batches.CHANGE_DATETIME": null,
                "dir_products_batches_sale_prices.PRODUCT_ID=dir_pricelists_products_batches.PRODUCT_ID": null,
                "dir_products_batches_sale_prices.BATCH_NUMBER=dir_pricelists_products_batches.BATCH_NUMBER": null,
                "dir_products_batches_sale_prices.PRICELIST_ID=dir_pricelists_products_batches.PRICELIST_ID": null}}},
        {data: "SALE_PRICE", name: "Розн. цена", sourceField:"PRICE", dataSource:"dir_products_batches_sale_prices"},
        {data: "DISCOUNT", name: "Скидка, %", sourceField:"DISCOUNT", dataSource:"dir_products_batches_sale_prices"},
        {data: "PRICE_WITH_DISCOUNT", name: "Розн. цена со скидкой",sourceField:"PRICE_WITH_DISCOUNT", dataSource:"dir_products_batches_sale_prices" }
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
    };

    app.get("/dir/products/getProdAttributesFromROperationsByArticle", function (req, res) {
        var operationId=req.query["ID"], prodArticle=req.query["PRODUCT_ARTICLE"];
        var condition={"dir_products_articles.VALUE=":prodArticle};
        if(operationId) condition["OPERATION_ID<>"]=operationId;
            wrh_products_r_operations.getDataItems({
                    fields:["OPERATION_ID","PRODUCT_ID","PRODUCT_ARTICLE"],
                    fieldsSources:{"PRODUCT_ID":"dir_products.ID", "PRODUCT_ARTICLE":"dir_products_articles.VALUE"},
                    joinedSources:{
                        wrh_pinvs_products:{"wrh_pinvs_products.ID=wrh_products_r_operations.OPERATION_ID":null},
                        dir_products:{"dir_products.ID=wrh_products_r_operations.PRODUCT_ID":null},
                        dir_products_articles:{"dir_products_articles.ID=dir_products.ARTICLE_ID":null}
                    },
                    conditions:condition
                    },
                function(result){
                    console.log("getProdAttributesFromROperationsByArticle result=",result);
                    if(!result.items||result.items.length==0){
                        res.send(result);
                        return;
                    }
                    dir_products.getProductsDataForTable({condition:{"dir_products.ID=":result.items[0]["PRODUCT_ID"]}},
                        function(result){
                            if(result.items&&result.items.length>0) res.send({item:result.items[0]}); else res.send(result);
                        });
                });
    });

    app.post("/wrh/productsBalance/getSalePriceHistory", function (req, res) {
      var conditions={};
        conditions["dir_units.NAME="]=req.body.unitName;
        req.body.productCode?conditions["dir_products.CODE="]=req.body.productCode:"";
        req.body.prodBatchNum?conditions["dir_products_batches_sale_prices.BATCH_NUMBER="]=req.body.prodBatchNum:"";
        req.body.prodArticle?conditions["dir_products_articles.VALUE="]=req.body.prodArticle:"";
        if(req.body.prodArticle){
            dir_products_batches_sale_prices.getDataItems({fields:["CHANGE_DATETIME","PRICE","DISCOUNT","PRICE_WITH_DISCOUNT"],
                joinedSources:{
                    "dir_units":{"dir_units.PRICELIST_ID=dir_products_batches_sale_prices.PRICELIST_ID":null},
                    "dir_products":{"dir_products.ID=dir_products_batches_sale_prices.PRODUCT_ID":null},
                    "dir_products_articles":{"dir_products_articles.ID=dir_products.ARTICLE_ID":null}
                },
                conditions:conditions,
                order:["dir_products_batches_sale_prices.CHANGE_DATETIME DESC"]
            },function(result){
                res.send(result);
            });
            return;
        }
        dir_products_batches_sale_prices.getDataItems({fields:["CHANGE_DATETIME","PRICE","DISCOUNT","PRICE_WITH_DISCOUNT"],
            joinedSources:{"dir_units":{"dir_units.PRICELIST_ID=dir_products_batches_sale_prices.PRICELIST_ID":null},
                "dir_products":{"dir_products.ID=dir_products_batches_sale_prices.PRODUCT_ID":null}
            },
            conditions:conditions,
            order:["dir_products_batches_sale_prices.CHANGE_DATETIME DESC"]
        },function(result){
            res.send(result);
        });
    });
};