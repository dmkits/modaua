var dataModel=require('../datamodel');
var wrh_invs= require(appDataModelPath+"wrh_invs"),
    wrh_invs_products= require(appDataModelPath+"wrh_invs_products"),
    dir_products=require(appDataModelPath+'dir_products-bata');
var dir_units= require(appDataModelPath+"dir_units"),
    dir_contractors= require(appDataModelPath+"dir_contractors");

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
        {data: "ID", name: "ID", width: 100, type: "text", visible:false },
        { dataSource:"wrh_invs" },
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_invs.UNIT_ID" },
        {data: "DOCDATE", name: "Дата", dataSource:"wrh_invs", sourceField:"DOCDATE" },
        {data: "DOCNUMBER", name: "Номер накладной", dataSource:"wrh_invs", sourceField:"NUMBER" },
        {data: "BUYER_NAME", name: "Покупатель", width: 100, type: "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_invs.BUYER_ID" },
        {data: "POSITION", name: "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        { data: "BARCODE", name: "Штрихкод", width: 100, type: "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=wrh_invs_products.PRODUCT_ID"},
        {data: "PRICE", name: "Цена" },
        {data: "QTY", name: "Кол-во" },
        {data: "POSSUM", name: "Сумма" }
    ];
    repSalesReportTableColumns=
        dir_products.addProductColumnsTo(repSalesReportTableColumns,8,{
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
        {data: "DOCDATE", name: "Дата", dataSource:"wrh_invs",sourceField:"DOCDATE" },
        {data: "PRICE", name: "Цена" },
        {data: "SQTY", name: "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"QTY"} },
        {data: "SPOSSUM", name: "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"POSSUM"} }
    ];
    repSalesByDatesTableColumns=
        dir_products.addProductAttrsColumnsTo(repSalesByDatesTableColumns,1,{ excludeColumns:{}});
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
        {data: "ID", name: "ID", width: 100, type: "text", visible:false },
        { dataSource:"wrh_invs" },
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_invs.UNIT_ID" },
        {data: "DOCDATE", name: "Дата", dataSource:"wrh_invs", sourceField:"DOCDATE" },
        {data: "DOCNUMBER", name: "Номер накладной", dataSource:"wrh_invs", sourceField:"NUMBER" },
        {data: "BUYER_NAME", name: "Покупатель", width: 100, type: "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_invs.BUYER_ID" },
        {data: "POSITION", name: "Позиция в накладной", dataFunction:"ROUND(POSIND)" },
        {data: "PRICE", name: "Цена" },
        {data: "QTY", name: "Кол-во" },
        {data: "POSSUM", name: "Сумма" }
    ];
    repSalesWithProdAttrReportTableColumns=
        dir_products.addProductColumnsTo(repSalesWithProdAttrReportTableColumns,7,{
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repSalesWithProdAttrReportTableColumns=
        dir_products.addProductAttrsColumnsTo(repSalesWithProdAttrReportTableColumns,7,{
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
    var wrhInvsListTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false, dataSource:"wrh_invs"},
        {data: "NUMBER", name: "Номер", width: 65, type: "text", dataSource:"wrh_invs"},
        {data: "DOCDATE", name: "Дата", width: 55, type: "dateAsText", dataSource:"wrh_invs"},
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text", dataSource:"dir_units", sourceField:"NAME"},
        {data: "BUYER_NAME", name: "Покупатель", width: 150, type: "text", dataSource:"dir_contractors", sourceField:"NAME"},
        {data: "DOCCOUNT", name: "Строк", width: 60, type: "numeric", visible:false,
            childDataSource:"wrh_invs_products", childLinkField:"INV_ID", parentLinkField:"ID",
            dataFunction:{function:"rowsCountIsNull", source:"wrh_invs_products", sourceField:"POSIND"} },
        {data: "DOCQTYSUM", name: "Кол-во", width: 60, type: "numeric",
            childDataSource:"wrh_invs_products", childLinkField:"INV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"QTY"} },
        {data: "DOCSUM", name: "Сумма", width: 80, type: "numeric2",
            childDataSource:"wrh_invs_products", childLinkField:"INV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"POSSUM"} },
        {data: "CURRENCY_CODE", name: "Валюта", width: 70, type: "text", dataSource:"sys_currency", sourceField:"CODE"},
        {data: "CURRENCY_CODENAME", name: "Валюта", width: 50, type: "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {data: "DOCSTATE_NAME", name: "Статус", width: 110, type: "text", dataSource:"sys_docstates", sourceField:"NAME"},
        {data: "RATE", name: "Курс валюты", width: 60, type: "numeric2", visible:false, dataSource:"wrh_invs"}
    ];
    app.get("/reports/sales/getInvsList", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_invs."+condItem]=req.query[condItem];
        wrh_invs.getDataForDocTable({tableColumns:wrhInvsListTableColumns,
                identifier:wrhInvsListTableColumns[0].data,
                conditions:conditions,
                order:["DOCDATE","UNIT_NAME","NUMBER"]},
            function(result){
                res.send(result);
            });
    });
};