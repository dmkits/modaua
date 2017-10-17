var dataModel=require('../datamodel'), dirProducts=require('./dirProducts-bata');
var wrh_invs= require(appDataModelPath+"wrh_invs"),
    wrh_invs_products= require(appDataModelPath+"wrh_invs_products");
var dir_units= require(appDataModelPath+"dir_units"), dir_contractors= require(appDataModelPath+"dir_contractors");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_invs,wrh_invs_products, dir_units,dir_contractors], errs,
        function(){
            nextValidateModuleCallback();
        });
};
module.exports.modulePageURL = "/reports/sales";
module.exports.modulePagePath = "reports/sales-bata.html";
module.exports.init = function(app) {
    var repSalesReportTableColumns=[
        {"data": "ID", "name": "ID", "width": 100, "type": "text", visible:false },
        { dataSource:"wrh_invs" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_invs.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_invs", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер накладной", dataSource:"wrh_invs", sourceField:"NUMBER" },
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_invs.BUYER_ID" },
        {"data": "POSITION", "name": "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        { "data": "BARCODE", "name": "Штрихкод", "width": 100, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=wrh_invs_products.PRODUCT_ID"},
        {"data": "PRICE", "name": "Цена" },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repSalesReportTableColumns=
        dirProducts.addProductColumnsTo(repSalesReportTableColumns,8,{
            visibleColumns:{"PRINT_NAME":false,"PBARCODE":false}});
   app.get("/reports/sales/getSales", function (req, res) {
       wrh_invs_products.getDataForDocTable({tableColumns:repSalesReportTableColumns,
               identifier:repSalesReportTableColumns[0].data,
               conditions:req.query,
               order:["UNIT_NAME","DOCDATE","DOCNUMBER","POSITION","PRODUCT_NAME","PRICE"]},
           function(result){
               res.send(result);
           });
    });
    var repSalesByDatesTableColumns=[
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_invs",sourceField:"DOCDATE" },
        {"data": "PRICE", "name": "Цена" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"POSSUM"} }
    ];
    repSalesByDatesTableColumns=
        dirProducts.addProductAttrsColumnsTo(repSalesByDatesTableColumns,1,{ excludeColumns:{}});
    app.get("/reports/sales/getSalesByDates", function (req, res) {
        wrh_invs_products.getDataForDocTable({tableColumns:repSalesByDatesTableColumns,
                identifier:repSalesByDatesTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","PRODUCT_ARTICLE","PRODUCT_COLLECTION","PRODUCT_KIND","PRODUCT_COMPOSITION","PRODUCT_SIZE","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repSalesWithProdAttrReportTableColumns=[
        {"data": "ID", "name": "ID", "width": 100, "type": "text", visible:false },
        { dataSource:"wrh_invs" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_invs.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_invs", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер накладной", dataSource:"wrh_invs", sourceField:"NUMBER" },
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_invs.BUYER_ID" },
        {"data": "POSITION", "name": "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        {"data": "PRICE", "name": "Цена" },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repSalesWithProdAttrReportTableColumns=
        dirProducts.addProductColumnsTo(repSalesWithProdAttrReportTableColumns,7,{
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repSalesWithProdAttrReportTableColumns=
        dirProducts.addProductAttrsColumnsTo(repSalesWithProdAttrReportTableColumns,7,{
            visibleColumns:{}});
    app.get("/reports/sales/getSalesWithProdAttr", function (req, res) {
        wrh_invs_products.getDataForDocTable({tableColumns:repSalesWithProdAttrReportTableColumns,
                identifier:repSalesWithProdAttrReportTableColumns[0].data,
                conditions:req.query,
                order:["UNIT_NAME","DOCDATE","DOCNUMBER","POSITION","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
};