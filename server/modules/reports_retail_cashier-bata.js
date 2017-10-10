var dataModel=require('../datamodel');
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

module.exports.modulePageURL = "/reports/retailCashier";
module.exports.modulePagePath = "reports/retailCashier-bata.html";
module.exports.init = function(app) {
    var repRetailCashReportTableColumns=[
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер", "width": 55, "type": "numeric", dataField:"NUMBER" },
        {"data": "POS", "name": "Позиция", "width": 55, "type": "numeric", visible:false },
        { "data": "PRODUCT_NAME", "name": "Наименование товара", "width": 300, "type": "text",
            dataSource:"dir_products", dataField:"NAME", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},
        {"data": "SALE_PRICE", "name": "Цена", "width": 70, "type": "numeric2" },
        {"data": "DISCOUNT_PERCENT", "name": "Скидка, %", "width": 60, "type": "text",align:"center", dataFunction:"DISCOUNT*100" },
        {"data": "PRICE", "name": "Цена со ск.", "width": 70, "type": "numeric2" },
        {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric" },
        {"data": "SALE_QTY", "name": "Кол-во продаж", "width": 50, "type": "numeric", visible:false },
        {"data": "RET_SALE_QTY", "name": "Кол-во возвратов", "width": 50, "type": "numeric", visible:false },
        {"data": "POSSUM", "name": "Сумма", "width": 90, "type": "numeric2" },
        {"data": "SALE_POSSUM", "name": "Сумма продаж", "width": 90, "type": "numeric", visible:false },
        {"data": "RET_SALE_POSSUM", "name": "Сумма возвратов", "width": 90, "type": "numeric", visible:false },
        {"data": "SEP1", "name": " ", "width": 30, "type": "text", useFilter:false },
        {"data": "CASH_SUM", "name": "Сумма нал.", "width": 80, "type": "numeric2" },
        {"data": "CARD_SUM", "name": "Сумма плат.карт.", "width": 80, "type": "numeric2" },
        {"data": "SALE_CASH_SUM", "name": "Сумма продаж нал.", "width": 90, "type": "numeric", visible:false },
        {"data": "SALE_CARD_SUM", "name": "Сумма продаж плат.карт.", "width": 90, "type": "numeric", visible:false },
        {"data": "RET_SALE_CASH_SUM", "name": "Сумма возвратов нал", "width": 90, "type": "numeric", visible:false },
        {"data": "RET_SALE_CARD_SUM", "name": "Сумма возвратов плат.карт.", "width": 90, "type": "numeric", visible:false }
    ];
    app.get("/reports/retailCashier/getCashReport", function (req, res) {
        fin_retail_tickets_payments_v.getDataForTable({tableColumns:repRetailCashReportTableColumns,
                identifier:repRetailCashReportTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","DOCNUMBER","POS","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesByArticlesTableColumns=[
        { dataSource:"wrh_retail_tickets", dataField:"ID"},
        { dataSource:"dir_products", dataField:"ID"},
        {"data": "PRODUCT_ARTICLE", "name": "Артикул товара", "width": 80, "type": "text",
            dataSource:"dir_products_articles", dataField:"VALUE", linkCondition:"dir_products_articles.ID=dir_products.ARTICLE_ID" },
        {"data": "PRODUCT_KIND", "name": "Вид товара", "width": 150, "type": "text",
            dataSource:"dir_products_kinds", dataField:"NAME", linkCondition:"dir_products_kinds.ID=dir_products.KIND_ID" },
        {"data": "PRODUCT_COMPOSITION", "name": "Состав товара", "width": 150, "type": "text",
            dataSource:"dir_products_compositions", dataField:"VALUE", linkCondition:"dir_products_compositions.ID=dir_products.COMPOSITION_ID" },
        {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2" },
        {"data": "SQTY", "name": "Кол-во", "width": 50, "type": "numeric",
            dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", "width": 80, "type": "numeric2",
            dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"}}
    ];
    app.get("/reports/retailCashier/getSalesByArticles", function (req, res) {
        wrh_retail_tickets_products.getDataForTable({tableColumns:repRetailSalesByArticlesTableColumns,
                identifier:repRetailSalesByArticlesTableColumns[0].data,
                conditions:req.query,
                order:["PRODUCT_ARTICLE","PRODUCT_KIND","PRODUCT_COMPOSITION","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesByBataAttributesTableColumns=[
        { dataSource:"wrh_retail_tickets", dataField:"ID"},
        { dataSource:"dir_products", dataField:"ID"},
        {"data": "PRODUCT_GENDER_CODE", "name": "Код группы товара", "width": 65, "type": "text",
            dataSource:"dir_products_genders", dataField:"CODE", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {"data": "PRODUCT_GENDER", "name": "Группа товара", "width": 150, "type": "text",
            dataSource:"dir_products_genders", dataField:"NAME", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории товара", "width": 80, "type": "text",
            dataSource:"dir_products_categories", dataField:"CODE", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {"data": "PRODUCT_CATEGORY", "name": "Категория товара", "width": 200, "type": "text",
            dataSource:"dir_products_categories", dataField:"NAME", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории товара", "width": 100, "type": "text",
            dataSource:"dir_products_subcategories", dataField:"CODE", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория товара", "width": 200, "type": "text",
            dataSource:"dir_products_subcategories", dataField:"NAME", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {"data": "PRODUCT_ARTICLE", "name": "Артикул товара", "width": 80, "type": "text",
            dataSource:"dir_products_articles", dataField:"VALUE", linkCondition:"dir_products_articles.ID=dir_products.ARTICLE_ID" },
        {"data": "PRODUCT_KIND", "name": "Вид товара", "width": 150, "type": "text",
            dataSource:"dir_products_kinds", dataField:"NAME", linkCondition:"dir_products_kinds.ID=dir_products.KIND_ID" },
        {"data": "PRODUCT_COMPOSITION", "name": "Состав товара", "width": 150, "type": "text",
            dataSource:"dir_products_compositions", dataField:"VALUE", linkCondition:"dir_products_compositions.ID=dir_products.COMPOSITION_ID" },
        {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2" },
        {"data": "SQTY", "name": "Кол-во", "width": 50, "type": "numeric",
            dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", "width": 80, "type": "numeric2",
            dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"}}
    ];
    app.get("/reports/retailCashier/getSalesByBataAttributes", function (req, res) {
        wrh_retail_tickets_products.getDataForTable({tableColumns:repRetailSalesByBataAttributesTableColumns,
                identifier:repRetailSalesByBataAttributesTableColumns[6].data,
                conditions:req.query,
                order:["PRODUCT_GENDER_CODE","PRODUCT_CATEGORY_CODE","PRODUCT_SUBCATEGORY_CODE",
                    "PRODUCT_ARTICLE","PRODUCT_KIND","PRODUCT_COMPOSITION","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailSalesByDatesTableColumns=[
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataSource:"wrh_retail_tickets",dataField:"DOCDATE" },
        { dataSource:"dir_products", dataField:"ID"},
        {"data": "PRODUCT_COLLECTION_CODE", "name": "Код коллекции товара", "width": 100, "type": "text",
            dataSource:"dir_products_collections", dataField:"CODE", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        {"data": "PRODUCT_COLLECTION", "name": "Коллекция товара", "width": 150, "type": "text",
            dataSource:"dir_products_collections", dataField:"NAME", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        {"data": "PRODUCT_ARTICLE", "name": "Артикул товара", "width": 80, "type": "text",
            dataSource:"dir_products_articles", dataField:"VALUE", linkCondition:"dir_products_articles.ID=dir_products.ARTICLE_ID" },
        {"data": "PRODUCT_KIND", "name": "Вид товара", "width": 150, "type": "text",
            dataSource:"dir_products_kinds", dataField:"NAME", linkCondition:"dir_products_kinds.ID=dir_products.KIND_ID" },
        {"data": "PRODUCT_COMPOSITION", "name": "Состав товара", "width": 150, "type": "text",
            dataSource:"dir_products_compositions", dataField:"VALUE", linkCondition:"dir_products_compositions.ID=dir_products.COMPOSITION_ID" },
        {"data": "PRODUCT_SIZE", "name": "Размер товара", "width": 80, "type": "text",
            dataSource:"dir_products_sizes", dataField:"VALUE", linkCondition:"dir_products_sizes.ID=dir_products.SIZE_ID" },
        {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2" },
        {"data": "SQTY", "name": "Кол-во", "width": 50, "type": "numeric",
            dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"QTY"} },
        {"data": "SPOSSUM", "name": "Сумма", "width": 80, "type": "numeric2",
            dataFunction:{function:"sumIsNull", source:"wrh_retail_tickets_products", sourceField:"POSSUM"} }
    ];
    app.get("/reports/retailCashier/getSalesByDates", function (req, res) {
        wrh_retail_tickets_products.getDataForTable({tableColumns:repRetailSalesByDatesTableColumns,
                identifier:repRetailSalesByDatesTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","PRODUCT_ARTICLE","PRODUCT_COLLECTION","PRODUCT_KIND","PRODUCT_COMPOSITION","PRODUCT_SIZE","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailCashBalanceTableColumns=[
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataField:"DOCDATE" },
        {"data": "DOCNUMBER", "name": "Номер", "width": 55, "type": "numeric", dataField:"NUMBER" },
        {"data": "BEGIN_BALANCE", "name": "Начальный остаток", "width": 80, "type": "numeric2" },
        {"data": "CASH_IN", "name": "Внос", "width": 80, "type": "numeric2" },
        {"data": "CASH_OUT", "name": "Вынос", "width": 80, "type": "numeric2" },
        {"data": "TICKET_DOCNUMBER", "name": "Номер чека", "width": 80, "type": "numeric", dataField:"TICKET_NUMBER" },
        {"data": "CASH_SALE", "name": "Чек", "width": 90, "type": "numeric2" },
        {"data": "CASH_RET_SALE", "name": "Возврат", "width": 90, "type": "numeric2" },
        {"data": "END_BALANCE", "name": "Конечный остаток", "width": 80, "type": "numeric2" }
        //{ "data": "PRODUCT_NAME", "name": "Наименование товара", "width": 300, "type": "text",
        //    dataSource:"dir_products", dataField:"NAME", linkCondition:"dir_products.ID=fin_retail_tickets_payments_v.PRODUCT_ID"},

    ];
    app.get("/reports/retailCashier/getRetailCashBalance", function (req, res) {
        fin_retail_receipts_payments_v.getDataForTable({tableColumns:repRetailCashBalanceTableColumns,
                identifier:repRetailCashBalanceTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","NUMBER","TICKET_NUMBER"]},
            function(result){
                if(result.items===undefined){
                    res.send(result);
                    return;
                }
                var outData=result;
                fin_retail_receipts_payments_v.getDataItem({fields:["BEGIN_BALANCE"],fieldsFunctions:{"BEGIN_BALANCE":{function:"SUM(DOCSUM)"}},
                        conditions:{"DOCDATE<":req.query["DOCDATE>~"]} },
                    function(result){
                        var beginBalance=result.item["BEGIN_BALANCE"];
                        outData.items.unshift({"BEGIN_BALANCE":beginBalance});
                        fin_retail_receipts_payments_v.getDataItem({fields:["CASH_IN","CASH_OUT","CASH_SALE","CASH_RET_SALE"],
                                fieldsFunctions:{"CASH_IN":{function:"SUM(CASH_IN)"},"CASH_OUT":{function:"SUM(CASH_OUT)"},
                                    "CASH_SALE":{function:"SUM(CASH_SALE)"},"CASH_RET_SALE":{function:"SUM(CASH_RET_SALE)"}},
                                conditions:req.query },
                            function(result){
                                outData.items.push({
                                    "END_BALANCE":beginBalance+result.item["CASH_IN"]-result.item["CASH_OUT"]+result.item["CASH_SALE"]-result.item["CASH_RET_SALE"]});

                                //outData.items.push(beginBalance);
                                res.send(outData);
                            });
                        //outData.items.push(beginBalance);
                        //res.send(outData);
                    });
            });
    });
};