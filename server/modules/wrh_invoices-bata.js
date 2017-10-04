var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrh_invs= require(appDataModelPath+"wrh_invs"),
    wrh_invs_products= require(appDataModelPath+"wrh_invs_products"),
    wrh_invs_products_wob= require(appDataModelPath+"wrh_invs_products_wob");
var dir_units= require(appDataModelPath+"dir_units"), dir_contractors= require(appDataModelPath+"dir_contractors"),
    sys_currency= require(appDataModelPath+"sys_currency"), sys_docstates= require(appDataModelPath+"sys_docstates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_invs,wrh_invs_products,wrh_invs_products_wob], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/invoices";
module.exports.modulePagePath = "wrh/invoices-bata.html";
module.exports.init = function(app){
    var wrhInvsListTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false, dataSource:"wrh_invs"},
        {"data": "NUMBER", "name": "Номер", "width": 50, "type": "text", dataSource:"wrh_invs"},
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataSource:"wrh_invs"},
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text", dataSource:"dir_units", dataField:"NAME"},
        {"data": "BUYER_NAME", "name": "Покупатель", "width": 150, "type": "text", dataSource:"dir_contractors", dataField:"NAME"},
        {"data": "DOCCOUNT", "name": "Строк", "width": 60, "type": "numeric", visible:false,
            childDataSource:"wrh_invs_products", childLinkField:"INV_ID", parentLinkField:"ID",
            dataFunction:{function:"rowsCountIsNull", source:"wrh_invs_products", sourceField:"POSIND"} },
        {"data": "DOCQTYSUM", "name": "Кол-во", "width": 60, "type": "numeric",
            childDataSource:"wrh_invs_products", childLinkField:"INV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"QTY"} },
        {"data": "DOCSUM", "name": "Сумма", "width": 80, "type": "numeric2",
            childDataSource:"wrh_invs_products", childLinkField:"INV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_invs_products", sourceField:"POSSUM"} },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", dataField:"CODE"},
        {"data": "CURRENCY_CODENAME", "name": "Валюта", "width": 50, "type": "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {"data": "DOCSTATE_NAME", "name": "Статус", "width": 110, "type": "text", dataSource:"sys_docstates", dataField:"NAME"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_invs"}
    ];
    app.get("/wrh/invoices/getDataForInvsListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_invs."+condItem]=req.query[condItem];
        wrh_invs.getDataForTable({tableColumns:wrhInvsListTableColumns,
                identifier:wrhInvsListTableColumns[0].data,
                conditions:conditions,
                order:["DOCDATE","UNIT_NAME","NUMBER"]},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/invoices/getInvData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_invs."+condItem]=req.query[condItem];
        wrh_invs.getDataItemForTable({tableColumns:wrhInvsListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/invoices/getNewInvData", function(req, res){
        wrh_invs.getDataItem({fieldFunction:{name:"MAXNUMBER", function:"maxPlus1", sourceField:"NUMBER"},
                conditions:{"1=1":null}},
            function(result){
                var newNumber=(result&&result.item)?result.item["MAXNUMBER"]:"", docDate=dateFormat(new Date(),"yyyy-mm-dd");
                dir_units.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                    var unitName=(result&&result.item)?result.item["NAME"]:"";
                    dir_contractors.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                        var buyerName=(result&&result.item)?result.item["NAME"]:"";
                        sys_currency.getDataItem({ fields:["CODE","CODENAME"],
                                fieldsFunctions:{"CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"]}},
                                conditions:{"ID=":"0"} },
                            function(result){
                                var sysCurrencyCode=(result&&result.item)?result.item["CODE"]:"";
                                var sysCurrencyCodeName=(result&&result.item)?result.item["CODENAME"]:"";
                                wrh_invs.setDataItem({
                                        fields:["NUMBER","DOCDATE","UNIT_NAME","BUYER_NAME",
                                            "CURRENCY_CODE","CURRENCY_CODENAME", "DOCSTATE_NAME", "DOCCOUNT","DOCQTYSUM","DOCSUM",
                                            "RATE"],
                                        values:[newNumber,docDate,unitName,buyerName,
                                            sysCurrencyCode,sysCurrencyCodeName, "",0,0,0,
                                            1]},
                                    function(result){
                                        res.send(result);
                                    });
                            });
                    });
                });
            });
    });
    app.post("/wrh/invoices/storeInvData", function(req, res){
        var storeData=req.body;
        dir_units.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["UNIT_NAME"]}}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"]=result.item["ID"];
            dir_contractors.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["BUYER_NAME"]}}, function(result){
                if(!result.item){
                    res.send({ error:"Cannot finded conractor by name!"});
                    return;
                }
                storeData["BUYER_ID"]=result.item["ID"];
                sys_currency.getDataItem({fields:["ID"],conditions:{"CODE=":storeData["CURRENCY_CODE"]}}, function(result){
                    if(!result.item){
                        res.send({ error:"Cannot finded currency by code!"});
                        return;
                    }
                    storeData["CURRENCY_ID"]=result.item["ID"];
                   // dirProdsCollections.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["PRODUCT_COLLECTION"]}}, function(result){
                       // storeData["COLLECTION_ID"]=result.item["ID"];
                        var docStateID=0;
                        sys_docstates.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["DOCSTATE_NAME"]}}, function(result){
                            if(result.item) docStateID=result.item["ID"];
                            storeData["DOCSTATE_ID"]=docStateID;
                            wrh_invs.storeTableDataItem({tableColumns:wrhInvsListTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    res.send(result);
                                });
                        });
                  //  });
                });
            });
        });
    });
    app.post("/wrh/invoices/deleteInvData", function(req, res){
        var delData=req.body;
        wrh_invs.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });

    var wrhInvProductsTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "INV_ID", "name": "INV_ID", "width": 50, "type": "text", readOnly:true, visible:false},
        //{"data": "SUPPLIER_ID", "name": "SUPPLIER_ID", "width": 65, "type": "text", readOnly:true, visible:false,
        //    dataSource:"wrh_invs", dataField:"SUPPLIER_ID", linkCondition:"wrh_pinvs.ID=wrh_pinvs_products.PINV_ID" },
        //{"data": "SUPPLIER_COUNTRY", "name": "SUPPLIER_COUNTRY", "width": 65, "type": "text", readOnly:true, visible:false,
        //    dataSource:"dir_contractors", dataField:"COUNTRY", linkCondition:"dir_contractors.ID=wrh_pinvs.SUPPLIER_ID" },
        {"data": "POSIND", "name": "POSIND", "width": 45, "type": "numeric", visible:false},
        {"data": "POS", "name": "Номер п/п", "width": 45, "type": "numeric", dataFunction:"TRUNCATE(POSIND,0)"},

        //{"data": "PRODUCT_ID", "name": "PRODUCT_ID", "width": 50, "type": "text", visible:false},
        //{"data": "PRODUCT_CODE", "name": "Код товара", "width": 65, "type": "text", dataSource:"dir_products", dataField:"CODE"},
        //{"data": "BARCODE", "name": "Штрихкод", "width": 75, "type": "text", visible:false},
        //{"data": "PRODUCT_NAME", "name": "Товар", "width": 250, "type": "text", dataSource:"dir_products", dataField:"NAME"},
        //{"data": "PRODUCT_UM", "name": "Ед.изм.", "width": 55, "type": "text", dataSource:"dir_products", dataField:"UM"},

        {"data": "PRODUCT_COLLECTION", "name": "Коллекция", "width": 150, "type": "text", visible:false,
            dataSource:"dir_products_collections", dataField:"NAME", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        {"data": "PRODUCT_COLLECTION_CODE", "name": "Код коллекции", "width": 100, "type": "text", visible:false,
            dataSource:"dir_products_collections", dataField:"CODE", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        {"data": "PRODUCT_ARTICLE", "name": "Артикул", "width": 80, "type": "text",
            dataSource:"dir_products_articles", dataField:"VALUE", linkCondition:"dir_products_articles.ID=dir_products.ARTICLE_ID" },
        {"data": "PRODUCT_KIND", "name": "Вид", "width": 150, //"type": "text",
            "type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsKindsCombobox",
            dataSource:"dir_products_kinds", dataField:"NAME", linkCondition:"dir_products_kinds.ID=dir_products.KIND_ID" },
        {"data": "PRODUCT_COMPOSITION", "name": "Состав", "width": 200, "type": "text",
            dataSource:"dir_products_compositions", dataField:"VALUE", linkCondition:"dir_products_compositions.ID=dir_products.COMPOSITION_ID" },
        {"data": "PRODUCT_SIZE", "name": "Размер", "width": 50, "type": "text",
            dataSource:"dir_products_sizes", dataField:"VALUE", linkCondition:"dir_products_sizes.ID=dir_products.SIZE_ID" },
        {"data": "PRODUCT_CODE", "name": "Код товара", "width": 65, "type": "text", visible:false,
            dataSource:"dir_products", dataField:"CODE"},
        {"data": "BARCODE", "name": "Штрихкод", "width": 75, "type": "text", visible:false},
        {"data": "PRODUCT_PBARCODE", "name": "Штрихкод товара", "width": 75, "type": "text", visible:false,
            dataSource:"dir_products", dataField:"PBARCODE"},
        {"data": "PRODUCT_NAME", "name": "Товар", "width": 250, "type": "text", visible:false,
            dataSource:"dir_products", dataField:"NAME"},
        {"data": "PRODUCT_PRINT_NAME", "name": "Печатное наименование товара", "width": 250, "type": "text", visible:false,
            dataSource:"dir_products", dataField:"PRINT_NAME"},
        {"data": "PRODUCT_UM", "name": "Ед.изм.", "width": 55, "type": "text", visible:false,
            dataSource:"dir_products", dataField:"UM"},

        {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric"},
        {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2"},
        {"data": "POSSUM", "name": "Сумма", "width": 80, "type": "numeric2"}
    ];
    app.get("/wrh/invoices/getDataForInvProductsTable", function(req, res){
        wrh_invs_products.getDataForTable({tableColumns:wrhInvProductsTableColumns,
                identifier:wrhInvProductsTableColumns[0].data,
                conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/invoices/storeInvProductsTableData", function(req, res){
        wrh_invs_products.storeTableDataItem({tableColumns:wrhInvProductsTableColumns, idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/invoices/deleteInvProductsTableData", function(req, res){
        wrh_invs_products.delTableDataItem({idFieldName:"ID"},
            function(result){
                res.send(result);
            });
    });
};