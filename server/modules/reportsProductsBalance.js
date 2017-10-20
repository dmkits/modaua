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

    var repSearchedProducTableColumns=[
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_products_operations_v.UNIT_ID" },
        {"data": "BATCH_NUMBER", "name": "Партия", width:70, type:"text", align:"center" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"} },
        {"data": "COST_SUM", "name": "Себе-стоимость" /*, dataFunction:{function:"sumIsNull", sourceField:"BATCH_QTY"}*/}
    ];
    repSearchedProducTableColumns=
        dir_products.addProductColumnsTo(repSearchedProducTableColumns,1,{linkSource:"wrh_products_operations_v",
            visibleColumns:{"CODE":true,"NAME":true,"UM":true,"PRINT_NAME":false,"PBARCODE":false}});

    app.get("/wrh/productsBalance/getSearchedProducts", function (req, res) {
       var outData={};

        if(!req.query.STR_TARGET){
            outData.columns=repSearchedProducTableColumns;
            res.send(outData);
            return;
        }

        var str_target=req.query.STR_TARGET;
        var conditions={};
        conditions["dir_products.NAME LIKE '%"+str_target+"%' "]=null;

        wrh_products_operations_v.getDataForDocTable({tableColumns:repSearchedProducTableColumns,
                identifier:repProductsBalanceTableColumns[0].data,
                conditions:conditions,
                order:["PRODUCT_NAME"]},
            function(result){  console.log("result=",result);
                res.send(result);
            });
    });
};