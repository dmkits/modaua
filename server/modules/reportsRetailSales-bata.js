var dataModel=require('../datamodel'),
    dirProducts=require('./dirProducts-bata');
var wrh_retail_tickets= require(appDataModelPath+"wrh_retail_tickets"),
    wrh_retail_tickets_products= require(appDataModelPath+"wrh_retail_tickets_products"),
    wrh_retail_tickets_v= require(appDataModelPath+"wrh_retail_tickets_v"),
    fin_retail_tickets_v= require(appDataModelPath+"fin_retail_tickets_v"),
    fin_retail_tickets_payments_v= require(appDataModelPath+"fin_retail_tickets_payments_v"),
    fin_retail_receipts_payments_v= require(appDataModelPath+"fin_retail_receipts_payments_v");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_retail_tickets,wrh_retail_tickets_products,
            wrh_retail_tickets_v, fin_retail_tickets_v, fin_retail_tickets_payments_v,
            fin_retail_receipts_payments_v], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/reports/retailSales";
module.exports.modulePagePath = "reports/retailSales-bata.html";
module.exports.init = function(app) {
    var repRetailSalesReportTableColumns=[
        {"data": "ID", "name": "ID", "width": 100, "type": "text", visible:false },
        { dataSource:"wrh_retail_tickets" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_retail_tickets.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_retail_tickets", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер чека", dataSource:"wrh_retail_tickets", sourceField:"NUMBER" },
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_retail_tickets.BUYER_ID" },
        {"data": "POSITION", "name": "Позиция в чеке", dataFunction:"POS+1" },
        { "data": "BARCODE", "name": "Штрихкод", "width": 100, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        {"data": "SALE_PRICE", "name": "Цена" },
        {"data": "DISCOUNT_PERCENT", "name": "Скидка, %", "width": 70, "type": "text",align:"center", dataFunction:"DISCOUNT*100" },
        {"data": "PRICE", "name": "Цена со ск." },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repRetailSalesReportTableColumns=
        dirProducts.addProductColumnsTo(repRetailSalesReportTableColumns,8,{
            visibleColumns:{"PRINT_NAME":false,"PBARCODE":false}});
    app.get("/reports/retailSales/getRetailSales", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesReportTableColumns,
                identifier:repRetailSalesReportTableColumns[0].data,
                conditions:req.query,
                order:["UNIT_NAME","DOCDATE","DOCNUMBER","POS","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesReportWithProductAttrsTableColumns=[
        {"data": "ID", "name": "ID", "width": 100, "type": "text", visible:false },
        { dataSource:"wrh_retail_tickets" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_retail_tickets.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_retail_tickets", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер чека", dataSource:"wrh_retail_tickets", sourceField:"NUMBER" },
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_retail_tickets.BUYER_ID" },
        {"data": "POSITION", "name": "Позиция в чеке", dataFunction:"POS+1" },
        {"data": "SALE_PRICE", "name": "Цена" },
        {"data": "DISCOUNT_PERCENT", "name": "Скидка, %", "width": 70, "type": "text",align:"center", dataFunction:"DISCOUNT*100" },
        {"data": "PRICE", "name": "Цена со ск." },
        {"data": "QTY", "name": "Кол-во" },
        {"data": "POSSUM", "name": "Сумма" }
    ];
    repRetailSalesReportWithProductAttrsTableColumns=
        dirProducts.addProductColumnsTo(repRetailSalesReportWithProductAttrsTableColumns,7,{
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repRetailSalesReportWithProductAttrsTableColumns=
        dirProducts.addProductAttrsColumnsTo(repRetailSalesReportWithProductAttrsTableColumns,7,{
            visibleColumns:{}});
    app.get("/reports/retailSales/getRetailSalesWithProductsAttrs", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesReportWithProductAttrsTableColumns,
                identifier:repRetailSalesReportWithProductAttrsTableColumns[0].data,
                conditions:req.query,
                order:["UNIT_NAME","DOCDATE","DOCNUMBER","POS","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesByArticlesTableColumns=[
        { dataSource:"wrh_retail_tickets" },
        {"data": "PRICE", "name": "Цена" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"}}
    ];
    repRetailSalesByArticlesTableColumns=
        dirProducts.addProductAttrsColumnsTo(repRetailSalesByArticlesTableColumns,1,{
            excludeColumns:{"COLLECTION_CODE":true,"COLLECTION":true,"SIZE":true}});
    app.get("/reports/retailSales/getSalesByArticles", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesByArticlesTableColumns,
                identifier:repRetailSalesByArticlesTableColumns[0].data,
                conditions:req.query,
                order:["PRODUCT_ARTICLE","PRODUCT_KIND","PRODUCT_COMPOSITION","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesByBataAttributesTableColumns=[
        { dataSource:"wrh_retail_tickets" },
        {"data": "PRICE", "name": "Цена" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"}}
    ];
    repRetailSalesByBataAttributesTableColumns=
        dirProducts.addProductBataAttrsColumnsTo(repRetailSalesByBataAttributesTableColumns,0);
    repRetailSalesByBataAttributesTableColumns=
        dirProducts.addProductAttrsColumnsTo(repRetailSalesByBataAttributesTableColumns,7,{
            excludeColumns:{"COLLECTION_CODE":true,"COLLECTION":true,
                "TYPE":true,"KIND":true,"COMPOSITION":true,"SIZE":true}});

    app.get("/reports/retailSales/getSalesByBataAttributes", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesByBataAttributesTableColumns,
                identifier:repRetailSalesByBataAttributesTableColumns[0].data,
                conditions:req.query,
                order:["PRODUCT_GENDER_CODE","PRODUCT_CATEGORY_CODE","PRODUCT_SUBCATEGORY_CODE, PRODUCT_ARTICLE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesByDatesTableColumns=[
        {"data": "DOCDATE", "name": "Дата", dataSource:"wrh_retail_tickets",sourceField:"DOCDATE" },
        {"data": "PRICE", "name": "Цена" },
        {"data": "SQTY", "name": "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"} }
    ];
    repRetailSalesByDatesTableColumns=
        dirProducts.addProductAttrsColumnsTo(repRetailSalesByDatesTableColumns,1,{ excludeColumns:{}});
    app.get("/reports/retailSales/getSalesByDates", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesByDatesTableColumns,
                identifier:repRetailSalesByDatesTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","PRODUCT_ARTICLE","PRODUCT_COLLECTION","PRODUCT_KIND","PRODUCT_COMPOSITION","PRODUCT_SIZE","PRICE"]},
            function(result){
                res.send(result);
            });
    });
};