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
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 100, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_retail_tickets.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText",
            dataSource:"wrh_retail_tickets", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер чека", "width": 55, "type": "numeric",
            dataSource:"wrh_retail_tickets", sourceField:"NUMBER" },
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_retail_tickets.BUYER_ID" },
        {"data": "POSNUM", "name": "Позиция в чеке", "width": 55, "type": "numeric", dataFunction:"POS+1" },
        { "data": "BARCODE", "name": "Штрихкод", "width": 100, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        {"data": "SALE_PRICE", "name": "Цена", "width": 70, "type": "numeric2" },
        {"data": "DISCOUNT_PERCENT", "name": "Скидка, %", "width": 60, "type": "text",align:"center", dataFunction:"DISCOUNT*100" },
        {"data": "PRICE", "name": "Цена со ск.", "width": 70, "type": "numeric2" },
        {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric" },
        {"data": "POSSUM", "name": "Сумма", "width": 90, "type": "numeric2" }
    ];
    repRetailSalesReportTableColumns=
        dirProducts.addProductColumnsTo(repRetailSalesReportTableColumns,8,{
            visibleColumns:{"PRINT_NAME":false,"PBARCODE":false}});
    app.get("/reports/retailSales/getRetailSales", function (req, res) {
        wrh_retail_tickets_products.getDataForTable({tableColumns:repRetailSalesReportTableColumns,
                identifier:repRetailSalesReportTableColumns[0].data,
                conditions:req.query,
                order:["UNIT_NAME","DOCDATE","DOCNUMBER","POS","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesReportTableColumnsExt=[
        {"data": "ID", "name": "ID", "width": 100, "type": "text", visible:false },
        { dataSource:"wrh_retail_tickets" },
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 100, "type": "text",
            dataSource:"dir_units", sourceField:"NAME", linkCondition:"dir_units.ID=wrh_retail_tickets.UNIT_ID" },
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText",
            dataSource:"wrh_retail_tickets", sourceField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер чека", "width": 55, "type": "numeric",
            dataSource:"wrh_retail_tickets", sourceField:"NUMBER" },
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 100, "type": "text", visible:false,
            dataSource:"dir_contractors", sourceField:"NAME", linkCondition:"dir_contractors.ID=wrh_retail_tickets.BUYER_ID" },
        {"data": "POS", "name": "Позиция в чеке", "width": 55, "type": "numeric", visible:false },
        {"data": "PRODUCT_GENDER_CODE", "name": "Код группы товара", "width": 65, "type": "text", visible:false,
            dataSource:"dir_products_genders", sourceField:"CODE", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {"data": "PRODUCT_GENDER", "name": "Группа товара", "width": 150, "type": "text", visible:false,
            dataSource:"dir_products_genders", sourceField:"NAME", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории товара", "width": 80, "type": "text", visible:false,
            dataSource:"dir_products_categories", sourceField:"CODE", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {"data": "PRODUCT_CATEGORY", "name": "Категория товара", "width": 200, "type": "text", visible:false,
            dataSource:"dir_products_categories", sourceField:"NAME", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории товара", "width": 100, "type": "text", visible:false,
            dataSource:"dir_products_subcategories", sourceField:"CODE", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория товара", "width": 200, "type": "text", visible:false,
            dataSource:"dir_products_subcategories", sourceField:"NAME", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {"data": "PRODUCT_COLLECTION", "name": "Коллекция товара", "width": 150, "type": "text",
            dataSource:"dir_products_collections", sourceField:"NAME", linkCondition:"dir_products_collections.ID=dir_products.ARTICLE_ID" },
        {"data": "PRODUCT_COLLECTION", "name": "Код коллекции товара", "width": 80, "type": "text",
            dataSource:"dir_products_collections", sourceField:"NAME", linkCondition:"dir_products_collections.ID=dir_products.ARTICLE_ID" },
        {"data": "PRODUCT_ARTICLE", "name": "Артикул товара", "width": 80, "type": "text",
            dataSource:"dir_products_articles", sourceField:"VALUE", linkCondition:"dir_products_articles.ID=dir_products.ARTICLE_ID" },
        {"data": "PRODUCT_KIND", "name": "Вид товара", "width": 150, "type": "text",
            dataSource:"dir_products_kinds", sourceField:"NAME", linkCondition:"dir_products_kinds.ID=dir_products.KIND_ID" },
        {"data": "PRODUCT_COMPOSITION", "name": "Состав товара", "width": 150, "type": "text",
            dataSource:"dir_products_compositions", sourceField:"VALUE", linkCondition:"dir_products_compositions.ID=dir_products.COMPOSITION_ID" },
        {"data": "PRODUCT_SIZE", "name": "Размер товара", "width": 50, "type": "text",
            dataSource:"dir_products_sizes", sourceField:"VALUE", linkCondition:"dir_products_sizes.ID=dir_products.SIZE_ID" },

        { "data": "BARCODE", "name": "Штрихкод", "width": 100, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        { "data": "PRODUCT_CODE", "name": "Код товара", "width": 55, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"CODE", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        { "data": "PRODUCT_NAME", "name": "Наименование товара", "width": 220, "type": "text",
            dataSource:"dir_products", sourceField:"NAME", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        { "data": "PRODUCT_UM", "name": "Ед.изм.", "width": 55, "type": "text", align:"center",
            dataSource:"dir_products", sourceField:"UM", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        { "data": "PRODUCT_PRINT_NAME", "name": "Печатное наименование товара", "width": 220, "type": "text", visible:false,
            dataSource:"dir_products", sourceField:"PRINT_NAME", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        { "data": "PRODUCT_PBARCODE", "name": "Осн.штрихкод", "width": 100, "type": "text", align:"center", visible:false,
            dataSource:"dir_products", sourceField:"PBARCODE", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},

        {"data": "SALE_PRICE", "name": "Цена", "width": 70, "type": "numeric2" },
        {"data": "DISCOUNT_PERCENT", "name": "Скидка, %", "width": 60, "type": "text",align:"center", dataFunction:"DISCOUNT*100" },
        {"data": "PRICE", "name": "Цена со ск.", "width": 70, "type": "numeric2" },
        {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric" },
        {"data": "POSSUM", "name": "Сумма", "width": 90, "type": "numeric2" }
    ];
    app.get("/reports/retailSales/getRetailSalesExt", function (req, res) {
        wrh_retail_tickets_products.getDataForTable({tableColumns:repRetailSalesReportTableColumnsExt,
                identifier:repRetailSalesReportTableColumnsExt[0].data,
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
    app.get("/reports/retailSales/getSalesByBataAttributes", function (req, res) {
        wrh_retail_tickets_products.getDataForDocTable({tableColumns:repRetailSalesByBataAttributesTableColumns,
                identifier:repRetailSalesByBataAttributesTableColumns[0].data,
                conditions:req.query,
                order:["PRODUCT_GENDER_CODE","PRODUCT_CATEGORY_CODE","PRODUCT_SUBCATEGORY_CODE"]},
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