var dataModel=require('../datamodel');
var wrh_pinvs= require(appDataModelPath+"wrh_pinvs"),
    wrh_pinvs_products= require(appDataModelPath+"wrh_pinvs_products"),
    sys_currency= require(appDataModelPath+"sys_currency"),
    dir_products=require(appDataModelPath+'dir_products-bata');
var dir_units= require(appDataModelPath+"dir_units"), dir_contractors= require(appDataModelPath+"dir_contractors");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_pinvs,wrh_pinvs_products,sys_currency, dir_units,dir_contractors], errs,
        function(){
            nextValidateModuleCallback();
        });
};
module.exports.modulePageURL = "/reports/purchases";
module.exports.modulePagePath = "reports/purchases-bata.html";
module.exports.init = function(app) {
    var repPurchasesReportTableColumns=[
        {"data": "ID", "name": "ID", "width": 100, "type": "text", visible:false },
        { dataSource:"wrh_pinvs" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_pinvs.UNIT_ID" },
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 100, "type": "text", /*visible:false,*/
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_pinvs.SUPPLIER_ID" },
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_pinvs", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер накладной", dataSource:"wrh_pinvs", sourceField:"NUMBER" },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", sourceField:"CODE",
            linkCondition:"wrh_pinvs.CURRENCY_ID=sys_currency.ID"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", dataSource:"wrh_pinvs"},
        {"data": "POSITION", "name": "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        { "data": "BARCODE", "name": "Штрихкод", "width": 100, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=wrh_pinvs_products.PRODUCT_ID"},
        {"data": "PRICE", "name": "Цена" },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repPurchasesReportTableColumns=
        dir_products.addProductColumnsTo(repPurchasesReportTableColumns,10,{
            visibleColumns:{"PRINT_NAME":false,"PBARCODE":false}});
    app.get("/reports/purchases/getPurchases", function (req, res) {
        wrh_pinvs_products.getDataForDocTable({tableColumns:repPurchasesReportTableColumns,
                identifier:repPurchasesReportTableColumns[0].data,
                conditions:req.query,
                order:["UNIT_NAME","DOCDATE","DOCNUMBER","POSITION","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repPurchasesByDatesTableColumns=[
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_pinvs",sourceField:"DOCDATE" },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", sourceField:"CODE",
            linkCondition:"wrh_pinvs.CURRENCY_ID=sys_currency.ID"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", dataSource:"wrh_pinvs"},
        {"data": "PRICE", "name": "Цена" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"POSSUM"} }
    ];
    repPurchasesByDatesTableColumns=
        dir_products.addProductAttrsColumnsTo(repPurchasesByDatesTableColumns,3,{ excludeColumns:{}});
    app.get("/reports/purchases/getPurchasesByDates", function (req, res) {
        wrh_pinvs_products.getDataForDocTable({tableColumns:repPurchasesByDatesTableColumns,
                identifier:repPurchasesByDatesTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","PRODUCT_ARTICLE","PRODUCT_COLLECTION","PRODUCT_KIND","PRODUCT_COMPOSITION","PRODUCT_SIZE","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repPurchasesWithProdAttrReportTableColumns=[
        {"data": "ID", "name": "ID", "width": 100, "type": "text", visible:false },
        { dataSource:"wrh_pinvs" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_pinvs.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_pinvs", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер накладной", dataSource:"wrh_pinvs", sourceField:"NUMBER" },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", sourceField:"CODE",
            linkCondition:"wrh_pinvs.CURRENCY_ID=sys_currency.ID"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", dataSource:"wrh_pinvs"},
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_pinvs.SUPPLIER_ID" },
        {"data": "POSITION", "name": "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        {"data": "PRICE", "name": "Цена" },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repPurchasesWithProdAttrReportTableColumns=
        dir_products.addProductColumnsTo(repPurchasesWithProdAttrReportTableColumns,9,{
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repPurchasesWithProdAttrReportTableColumns=
        dir_products.addProductAttrsColumnsTo(repPurchasesWithProdAttrReportTableColumns,9,{
            visibleColumns:{}});
    app.get("/reports/purchases/getPurchasesWithProdAttr", function (req, res) {
        wrh_pinvs_products.getDataForDocTable({tableColumns:repPurchasesWithProdAttrReportTableColumns,
                identifier:repPurchasesWithProdAttrReportTableColumns[0].data,
                conditions:req.query,
                order:["UNIT_NAME","DOCDATE","DOCNUMBER","POSITION","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
};