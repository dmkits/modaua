var dataModel=require('../datamodel'), dirProducts=require('./dirProducts-bata');
var wrh_pinvs= require(appDataModelPath+"wrh_pinvs"),
    wrh_pinvs_products= require(appDataModelPath+"wrh_pinvs_products");
var dir_units= require(appDataModelPath+"dir_units"), dir_contractors= require(appDataModelPath+"dir_contractors");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_pinvs,wrh_pinvs_products, dir_units,dir_contractors], errs,
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
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 100, "type": "text", /*visible:false,*/
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_pinvs.SUPPLIER_ID" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_pinvs.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_pinvs", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер накладной", dataSource:"wrh_pinvs", sourceField:"NUMBER" },
        {"data": "POSITION", "name": "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        { "data": "BARCODE", "name": "Штрихкод", "width": 100, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=wrh_pinvs_products.PRODUCT_ID"},
        {"data": "PRICE", "name": "Цена" },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repPurchasesReportTableColumns=
        dirProducts.addProductColumnsTo(repPurchasesReportTableColumns,8,{
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
        {"data": "PRICE", "name": "Цена" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"POSSUM"} }
    ];
    repPurchasesByDatesTableColumns=
        dirProducts.addProductAttrsColumnsTo(repPurchasesByDatesTableColumns,1,{ excludeColumns:{}});
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
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_pinvs.SUPPLIER_ID" },
        {"data": "POSITION", "name": "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        {"data": "PRICE", "name": "Цена" },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repPurchasesWithProdAttrReportTableColumns=
        dirProducts.addProductColumnsTo(repPurchasesWithProdAttrReportTableColumns,7,{
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repPurchasesWithProdAttrReportTableColumns=
        dirProducts.addProductAttrsColumnsTo(repPurchasesWithProdAttrReportTableColumns,7,{
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