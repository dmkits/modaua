var dataModel=require('../datamodel');
var wrh_retail_tickets= require(appDataModelPath+"wrh_retail_tickets"),
    wrh_retail_tickets_products= require(appDataModelPath+"wrh_retail_tickets_products"),
    wrh_retail_tickets_v= require(appDataModelPath+"wrh_retail_tickets_v"),
    fin_retail_tickets_v= require(appDataModelPath+"fin_retail_tickets_v"),
    fin_retail_tickets_payments_v= require(appDataModelPath+"fin_retail_tickets_payments_v"),
    fin_retail_receipts_payments_v= require(appDataModelPath+"fin_retail_receipts_payments_v"),
    dir_products=require(appDataModelPath+'dir_products-bata');
var dir_units= require(appDataModelPath+"dir_units"),
    dir_contractors= require(appDataModelPath+"dir_contractors");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_retail_tickets,wrh_retail_tickets_products,
            wrh_retail_tickets_v, fin_retail_tickets_v, fin_retail_tickets_payments_v,
            fin_retail_receipts_payments_v,dir_units,dir_contractors], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/reports/retailSales";
module.exports.modulePagePath = "reports/retailSales-bata.html";
module.exports.init = function(app) {
    var repRetailSalesReportTableColumns=[
        {data: "ID", name: "ID", width: 100, type: "text", visible:false },
        { dataSource:"wrh_retail_tickets" },
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_retail_tickets.UNIT_ID" },
        {data: "DOCDATE", name: "Дата", dataSource:"wrh_retail_tickets", sourceField:"DOCDATE" },
        {data: "DOCNUMBER", name: "Номер чека", dataSource:"wrh_retail_tickets", sourceField:"NUMBER" },
        {data: "BUYER_NAME", name: "Покупатель", width: 100, type: "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_retail_tickets.BUYER_ID" },
        {data: "POSITION", name: "Позиция в чеке", dataFunction:"POS+1" },
        { data: "BARCODE", name: "Штрихкод", width: 100, type: "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        {data: "SALE_PRICE", name: "Цена" },
        {data: "DISCOUNT_PERCENT", name: "Скидка, %", width: 70, type: "text",align:"center", dataFunction:"DISCOUNT*100" },
        {data: "PRICE", name: "Цена со ск." },
        {data: "QTY", name: "Кол-во" },
        {data: "POSSUM", name: "Сумма" }
    ];
    repRetailSalesReportTableColumns=
        dir_products.addProductColumnsTo(repRetailSalesReportTableColumns,8,{
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
        {data: "ID", name: "ID", width: 100, type: "text", visible:false },
        { dataSource:"wrh_retail_tickets" },
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_retail_tickets.UNIT_ID" },
        {data: "DOCDATE", name: "Дата", dataSource:"wrh_retail_tickets", sourceField:"DOCDATE" },
        {data: "DOCNUMBER", name: "Номер чека", dataSource:"wrh_retail_tickets", sourceField:"NUMBER" },
        {data: "BUYER_NAME", name: "Покупатель", width: 100, type: "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_retail_tickets.BUYER_ID" },
        {data: "POSITION", name: "Позиция в чеке", dataFunction:"POS+1" },
        {data: "SALE_PRICE", name: "Цена" },
        {data: "DISCOUNT_PERCENT", name: "Скидка, %", width: 70, type: "text",align:"center", dataFunction:"DISCOUNT*100" },
        {data: "PRICE", name: "Цена со ск." },
        {data: "QTY", name: "Кол-во" },
        {data: "POSSUM", name: "Сумма" }
    ];
    repRetailSalesReportWithProductAttrsTableColumns=
        dir_products.addProductColumnsTo(repRetailSalesReportWithProductAttrsTableColumns,7,{
            visibleColumns:{"CODE":false,"NAME":false,"UM":false,"PRINT_NAME":false,"PBARCODE":false}});
    repRetailSalesReportWithProductAttrsTableColumns=
        dir_products.addProductAttrsColumnsTo(repRetailSalesReportWithProductAttrsTableColumns,7,{
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
        {data: "PRICE", name: "Цена" },
        {data: "SQTY", name: "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {data: "SPOSSUM", name: "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"}}
    ];
    repRetailSalesByArticlesTableColumns=
        dir_products.addProductAttrsColumnsTo(repRetailSalesByArticlesTableColumns,1,{
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

    var repRetailSalesByCollectionsTableColumns=[
        { dataSource:"wrh_retail_tickets" },
        {data: "PRICE", name: "Цена" },
        {data: "SQTY", name: "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {data: "SPOSSUM", name: "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"}}
    ];
    repRetailSalesByCollectionsTableColumns=
        dir_products.addProductAttrsColumnsTo(repRetailSalesByCollectionsTableColumns,1,{
            excludeColumns:{"SIZE":true}});
    app.get("/reports/retailSales/getSalesByCollections", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesByCollectionsTableColumns,
                identifier:repRetailSalesByCollectionsTableColumns[0].data,
                conditions:req.query,
                order:["PRODUCT_COLLECTION","PRODUCT_COLLECTION_CODE","PRODUCT_KIND","PRODUCT_COMPOSITION","PRICE"]},
            function(result){
                res.send(result);
            });
    });

    var repRetailSalesByBataAttributesTableColumns=[
        { dataSource:"wrh_retail_tickets" },
        {data: "PRICE", name: "Цена" },
        {data: "SQTY", name: "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {data: "SPOSSUM", name: "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"}}
    ];
    repRetailSalesByBataAttributesTableColumns=
        dir_products.addProductBataAttrsColumnsTo(repRetailSalesByBataAttributesTableColumns,0);
    repRetailSalesByBataAttributesTableColumns=
        dir_products.addProductAttrsColumnsTo(repRetailSalesByBataAttributesTableColumns,7,{
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
        {data: "DOCDATE", name: "Дата", dataSource:"wrh_retail_tickets",sourceField:"DOCDATE" },
        {data: "PRICE", name: "Цена" },
        {data: "SQTY", name: "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {data: "SPOSSUM", name: "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"} }
    ];
    repRetailSalesByDatesTableColumns=
        dir_products.addProductAttrsColumnsTo(repRetailSalesByDatesTableColumns,1,{ excludeColumns:{}});
    app.get("/reports/retailSales/getSalesByDates", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesByDatesTableColumns,
                identifier:repRetailSalesByDatesTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","PRODUCT_ARTICLE","PRODUCT_COLLECTION","PRODUCT_KIND","PRODUCT_COMPOSITION","PRODUCT_SIZE","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesTicketsListTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false, dataSource:"wrh_retail_tickets"},
        {data: "NUMBER", name: "Номер", width: 65, type: "text", dataSource:"wrh_retail_tickets"},
        {data: "DOCDATE", name: "Дата", width: 55, type: "dateAsText", dataSource:"wrh_retail_tickets"},
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text", dataSource:"dir_units",
            sourceField:"NAME",linkCondition:"dir_units.ID=wrh_retail_tickets.UNIT_ID" },
        {data: "BUYER_NAME", name: "Покупатель", width: 150, type: "text", dataSource:"dir_contractors",
            sourceField:"NAME",linkCondition:"dir_contractors.ID=wrh_retail_tickets.BUYER_ID"},
        {data: "SQTY", name: "Кол-во", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {data: "SPOSSUM", name: "Сумма", dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"} },
        {data: "CURRENCY_CODE", name: "Валюта", width: 70, type: "text", dataSource:"sys_currency",
            sourceField:"CODE", linkCondition:"sys_currency.ID=wrh_retail_tickets.CURRENCY_ID"},
        {data: "CURRENCY_CODENAME", name: "Валюта", width: 50, type: "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {data: "DOCSTATE_NAME", name: "Статус", width: 110, type: "text", dataSource:"sys_docstates", sourceField:"NAME",
            linkCondition:"sys_docstates.ID=wrh_retail_tickets.DOCSTATE_ID"}
    ];
    app.get("/reports/retailSales/getTicketsList", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_retail_tickets."+condItem]=req.query[condItem];
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesTicketsListTableColumns,
                identifier:repRetailSalesTicketsListTableColumns[0].data,
                conditions:conditions,
                order:["DOCDATE","UNIT_NAME","NUMBER"]},
            function(result){
                res.send(result);
            });
    });
};