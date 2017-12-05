var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrh_pinvs= require(appDataModelPath+"wrh_pinvs"), wrh_pinvs_products= require(appDataModelPath+"wrh_pinvs_products"),
    sys_operations=require(appDataModelPath+"sys_operations"),
    wrh_products_r_operations=require(appDataModelPath+"wrh_products_r_operations");
var dir_units= require(appDataModelPath+"dir_units"), dirContractors= require(appDataModelPath+"dir_contractors"),
    sys_currency= require(appDataModelPath+"sys_currency"), sysDocStates= require(appDataModelPath+"sys_docstates"),
    dir_products_collections= require(appDataModelPath+"dir_products_collections"),
    dir_products_bata= require(appDataModelPath+"dir_products-bata"),
    dir_products_batches= require(appDataModelPath+"dir_products_batches"),
    dir_products_genders_bata=require(appDataModelPath+"dir_products_genders-bata"),
    dir_products_subcategories_bata=require(appDataModelPath+"dir_products_subcategories-bata"),
    dir_products_categories_bata=require(appDataModelPath+"dir_products_categories-bata");


module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_pinvs,wrh_pinvs_products, sys_operations, wrh_products_r_operations,
            dir_products_bata, dir_products_batches,dir_products_genders_bata,dir_products_subcategories_bata,
            dir_products_categories_bata], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/pinvoices";
module.exports.modulePagePath = "wrh/pinvoices-bata.html";
module.exports.init = function(app){
    var wrhPInvsListTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false, dataSource:"wrh_pinvs"},
        {data: "NUMBER", name: "Номер", width: 50, type: "text", dataSource:"wrh_pinvs"},
        {data: "DOCDATE", name: "Дата", width: 55, type: "dateAsText", dataSource:"wrh_pinvs"},
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text", dataSource:"dir_units", sourceField:"NAME"},
        {data: "SUPPLIER_NAME", name: "Поставщик", width: 150, type: "text", dataSource:"dir_contractors", sourceField:"NAME"},
        {data: "SUPPLIER_ORDER_NUM", name: "Номер заказа поставщика", width: 100, type: "text", dataSource:"wrh_pinvs"},
        {data: "SUPPLIER_INV_NUM", name: "Номер накл. поставщика", width: 100, type: "text", dataSource:"wrh_pinvs"},
        {data: "PRODUCT_COLLECTION", name: "Коллекция", width: 120, type: "text", visible:false,
            dataSource:"dir_products_collections", sourceField:"NAME"},
        {data: "DOCCOUNT", name: "Строк", width: 60, type: "numeric", visible:false,
            childDataSource:"wrh_pinvs_products", childLinkField:"PINV_ID", parentLinkField:"ID",
            dataFunction:{function:"rowsCountIsNull", source:"wrh_pinvs_products", sourceField:"POSIND"} },
        {data: "DOCQTYSUM", name: "Кол-во", width: 60, type: "numeric",
            childDataSource:"wrh_pinvs_products", childLinkField:"PINV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"QTY"} },
        {data: "DOCSUM", name: "Сумма", width: 80, type: "numeric2",
            childDataSource:"wrh_pinvs_products", childLinkField:"PINV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"POSSUM"} },
        {data: "CURRENCY_CODE", name: "Валюта", width: 50, type: "text", dataSource:"sys_currency", sourceField:"CODE"},
        {data: "CURRENCY_CODENAME", name: "Валюта", width: 50, type: "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {data: "DOCSTATE_NAME", name: "Статус", width: 110, type: "text", dataSource:"sys_docstates", sourceField:"NAME"},
        {data: "RATE", name: "Курс валюты", width: 60, type: "numeric2", visible:false, dataSource:"wrh_pinvs"},
        {data: "BASE_FACTOR", name: "Базов.коэфф.", width: 60, type: "numeric2", visible:false, dataSource:"wrh_pinvs"}
    ];
    app.get("/wrh/pInvoices/getDataForPInvsListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_pinvs."+condItem]=req.query[condItem];
        wrh_pinvs.getDataForTable({tableColumns:wrhPInvsListTableColumns,
                identifier:wrhPInvsListTableColumns[0].data,
                conditions:conditions,
                order:["DOCDATE","NUMBER","UNIT_NAME","SUPPLIER_NAME","SUPPLIER_ORDER_NUM","SUPPLIER_INV_NUM"]},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/pInvoices/getPInvData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_pinvs."+condItem]=req.query[condItem];
        wrh_pinvs.getDataItemForTable({tableColumns:wrhPInvsListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/pInvoices/getNewPInvData", function(req, res){
        wrh_pinvs.getDataItem({fields:["MAXNUMBER"],fieldsFunctions:{"MAXNUMBER":{function:"maxPlus1", sourceField:"NUMBER"}},
                conditions:{"1=1":null}},
            function(result){
                var newNumber=(result&&result.item)?result.item["MAXNUMBER"]:"", docDate=dateFormat(new Date(),"yyyy-mm-dd");
                dir_units.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                    var unitName=(result&&result.item)?result.item["NAME"]:"";
                    dirContractors.getDataItem({fields:["NAME"],conditions:{"ID=":"1"}}, function(result){
                        var supplierName=(result&&result.item)?result.item["NAME"]:"";
                        sys_currency.getDataItem({ fields:["CODE","CODENAME"],
                                fieldsFunctions:{"CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"]}},
                                conditions:{"ID=":"0"} },
                            function(result){
                                var sysCurrencyCode=(result&&result.item)?result.item["CODE"]:"";
                                var sysCurrencyCodeName=(result&&result.item)?result.item["CODENAME"]:"";
                                dir_products_collections.getDataItem({ fields:["NAME"], conditions:{"ID=":"1"} },
                                    function(result){
                                        var dirProductsCollectionName=(result&&result.item)?result.item["NAME"]:"";
                                        //sysDocStates.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                                        //});
                                        wrh_pinvs.setDataItem({
                                                fields:["NUMBER","DOCDATE","UNIT_NAME","SUPPLIER_NAME","SUPPLIER_ORDER_NUM","SUPPLIER_INV_NUM",
                                                    "CURRENCY_CODE","CURRENCY_CODENAME", "PRODUCT_COLLECTION", "DOCSTATE_NAME", "DOCCOUNT","DOCQTYSUM","DOCSUM",
                                                    "RATE","BASE_FACTOR"],
                                                values:[newNumber,docDate,unitName,supplierName,"","",
                                                    sysCurrencyCode,sysCurrencyCodeName, dirProductsCollectionName, "",0,0,0,
                                                    1, 2]},
                                            function(result){
                                                res.send(result);
                                            });
                                    });
                            });
                    });
                });
            });
    });
    app.post("/wrh/pInvoices/storePInvData", function(req, res){
        var storeData=req.body;
        dir_units.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["UNIT_NAME"]}}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"]=result.item["ID"];
            dirContractors.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["SUPPLIER_NAME"]}}, function(result){
                if(!result.item){
                    res.send({ error:"Cannot finded conractor by name!"});
                    return;
                }
                storeData["SUPPLIER_ID"]=result.item["ID"];
                sys_currency.getDataItem({fields:["ID"],conditions:{"CODE=":storeData["CURRENCY_CODE"]}}, function(result){
                    if(!result.item){
                        res.send({ error:"Cannot finded currency by code!"});
                        return;
                    }
                    storeData["CURRENCY_ID"]=result.item["ID"];
                    dir_products_collections.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["PRODUCT_COLLECTION"]}}, function(result){
                        storeData["COLLECTION_ID"]=result.item["ID"];
                        var docStateID=0;
                        sysDocStates.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["DOCSTATE_NAME"]}}, function(result){
                            if(result.item) docStateID=result.item["ID"];
                            storeData["DOCSTATE_ID"]=docStateID;
                            wrh_pinvs.storeTableDataItem({tableColumns:wrhPInvsListTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    res.send(result);
                                });
                        });
                    });
                });
            });
        });
    });
    app.post("/wrh/pInvoices/deletePInvData", function(req, res){
        var delData=req.body;
        wrh_pinvs.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });

    var wrhPInvProductsTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false},
        {data: "PINV_ID", name: "PINV_ID", width: 50, type: "text", readOnly:true, visible:false},
        //{data: "SUPPLIER_ID", name: "SUPPLIER_ID", width: 65, type: "text", readOnly:true, visible:false,
        //    dataSource:"wrh_pinvs", sourceField:"SUPPLIER_ID", linkCondition:"wrh_pinvs.ID=wrh_pinvs_products.PINV_ID" },
        {dataSource:"wrh_pinvs", sourceField:"SUPPLIER_ID", linkCondition:"wrh_pinvs.ID=wrh_pinvs_products.PINV_ID" },
        {data: "SUPPLIER_COUNTRY", name: "SUPPLIER_COUNTRY", width: 65, type: "text", readOnly:true, visible:false,
            dataSource:"dir_contractors", sourceField:"COUNTRY", linkCondition:"dir_contractors.ID=wrh_pinvs.SUPPLIER_ID" },
        {data: "POSIND", name: "POSIND", width: 45, type: "numeric", visible:false},
        {data: "POS", name: "Номер п/п", width: 45, type: "numeric", dataFunction:"TRUNCATE(POSIND,0)"},
        {dataSource:"wrh_products_r_operations",linkCondition:"wrh_products_r_operations.OPERATION_ID=wrh_pinvs_products.ID"},
        {data: "PRODUCT_CODE", name: "Код товара", width: 65, type: "text", dataSource:"dir_products", sourceField:"CODE",
            linkCondition:"dir_products.ID=wrh_products_r_operations.PRODUCT_ID",visible:false},
        {data: "BARCODE", name: "Штрихкод", width: 75, type: "text", dataSource:"dir_products", sourceField:"PBARCODE",visible:false },
        {data: "PRODUCT_NAME", name: "Товар", width: 250, type: "text",
            dataSource:"dir_products", sourceField:"NAME",visible:false},
        {data: "PRODUCT_UM", name: "Ед.изм.", width: 55, type: "text", dataSource:"dir_products", sourceField:"UM",visible:false},
        {data: "PRODUCT_GENDER_CODE", name: "Код группы", width: 65,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/genderCode",
            dataSource:"dir_products_genders", sourceField:"CODE", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {data: "PRODUCT_GENDER", name: "Группа", width: 150,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/gender",
            dataSource:"dir_products_genders", sourceField:"NAME", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {data: "PRODUCT_CATEGORY_CODE", name: "Код категории", width: 80,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/CategoryCode",
            dataSource:"dir_products_categories", sourceField:"CODE", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {data: "PRODUCT_CATEGORY", name: "Категория", width: 200,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/Category",
            dataSource:"dir_products_categories", sourceField:"NAME", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {data: "PRODUCT_SUBCATEGORY_CODE", name: "Код подкатегории", width: 100,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/SubcategoryCode",
            dataSource:"dir_products_subcategories", sourceField:"CODE", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {data: "PRODUCT_SUBCATEGORY", name: "Подкатегория", width: 200,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/Subcategory",
            dataSource:"dir_products_subcategories", sourceField:"NAME", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {data: "PRODUCT_ARTICLE", name: "Артикул", width: 80,
            type: "comboboxWN", "sourceURL":"/dir/products/getDataForProductsArticleCombobox",
            dataSource:"dir_products_articles", sourceField:"VALUE", linkCondition:"dir_products_articles.ID=dir_products.ARTICLE_ID" },
        {data: "PRODUCT_COLLECTION", name: "Коллекция", width: 150, visible:false,
            type: "combobox", "sourceURL":"/dir/products/getDataForProductsCollectionCombobox",
            dataSource:"dir_products_collections", sourceField:"NAME", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        {data: "PRODUCT_COLLECTION_CODE", name: "Код коллекции", width: 100, visible:false,
            type: "combobox", "sourceURL":"/dir/products/getDataForProductsCollectionCodeCombobox",
            dataSource:"dir_products_collections", sourceField:"CODE", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        {data: "PRODUCT_TYPE", name: "Тип", width: 100, //type: "text",
            type: "combobox", "sourceURL":"/dir/products/getDataForProductsTypesCombobox",
            dataSource:"dir_products_types", sourceField:"NAME",linkCondition:"dir_products_types.ID=dir_products.TYPE_ID"},
        {data: "PRODUCT_KIND", name: "Вид", width: 150, //type: "text",
            type: "comboboxWN", "sourceURL":"/dir/products/getDataForProductsKindsCombobox",
            dataSource:"dir_products_kinds", sourceField:"NAME", linkCondition:"dir_products_kinds.ID=dir_products.KIND_ID" },
        {data: "PRODUCT_COMPOSITION", name: "Состав", width: 200,
            type: "comboboxWN", "sourceURL":"/dir/products/getDataForProductsCompositionCombobox",
            dataSource:"dir_products_compositions", sourceField:"VALUE", linkCondition:"dir_products_compositions.ID=dir_products.COMPOSITION_ID" },
        {data: "PRODUCT_SIZE", name: "Размер", width: 50,
            type: "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSizeCombobox",
            dataSource:"dir_products_sizes", sourceField:"VALUE", linkCondition:"dir_products_sizes.ID=dir_products.SIZE_ID" },
        //{data: "PRODUCT_CODE", name: "Код товара", width: 65, type: "text", visible:false,
        //    dataSource:"dir_products", sourceField:"CODE"},
        //{data: "BARCODE", name: "Штрихкод", width: 75, type: "text", visible:false},
        {data: "PRODUCT_PBARCODE", name: "Штрихкод товара", width: 75, type: "text", /*visible:false,*/
            dataSource:"dir_products", sourceField:"PBARCODE",visible:false},
        //{data: "PRODUCT_NAME", name: "Товар", width: 250, type: "text", visible:false,
        //    dataSource:"dir_products", sourceField:"NAME"},
        {data: "PRODUCT_PRINT_NAME", name: "Печатное наименование товара", width: 250, type: "text", /*visible:false,*/
            dataSource:"dir_products", sourceField:"PRINT_NAME",visible:false},
        //{data: "PRODUCT_UM", name: "Ед.изм.", width: 55, type: "text", visible:false,
        //    dataSource:"dir_products", sourceField:"UM"},
        {data: "QTY", name: "Кол-во", width: 50, type: "numeric"},
        {data: "PRICE", name: "Цена", width: 60, type: "numeric2"},
        {data: "POSSUM", name: "Сумма", width: 80, type: "numeric2"},
        {data: "BATCH_NUMBER", name: "Партия", width: 60, type: "text",dataSource:"wrh_products_r_operations", sourceField:"BATCH_NUMBER", visible:false},
        {data: "FACTOR", name: "Коэфф.", width: 60, type: "numeric2"},
        {data: "SALE_PRICE", name: "Цена продажи", width: 75, type: "numeric2"},
        {data: "PRICELIST_PRICE", name: "Цена по прайс-листу", width: 75, type: "numeric2",
            dataFunction:"0"}
    ];
    app.get("/wrh/pInvoices/getDataForPInvProductsTable", function(req, res){
        wrh_pinvs_products.getDataForDocTable({tableColumns:wrhPInvProductsTableColumns,
                identifier:wrhPInvProductsTableColumns[0].data,
                conditions:req.query,
                order:["POSIND"]},
            function(result){
                res.send(result);
            });
    });

    wrh_pinvs_products.insNewPInvTableDataItem= function(tableDataItem, callback){
        sys_operations.insDataItemWithNewID({idFieldName:"ID", insData:{}}, function(sysOperIdRes){
            if(sysOperIdRes.error){
                callback({error:sysOperIdRes.error});
                return;
            }
            var sysOperId=sysOperIdRes.resultItem["ID"];
                dir_products_batches.createNewBatch({prodData:{"PRODUCT_ID":tableDataItem["PRODUCT_ID"]}},
                    function(newBatchRes){
                    if(newBatchRes.error){
                        callback({error:newBatchRes.error});
                        return;
                    }
                        var batchNum= newBatchRes.resultItem["BATCH_NUMBER"];
                        wrh_products_r_operations.insDataItem({insData:{OPERATION_ID:sysOperId,BATCH_NUMBER: batchNum,
                        PRODUCT_ID:tableDataItem["PRODUCT_ID"],BARCODE:tableDataItem["BARCODE"]}}, function(prodOperRes){
                        if(prodOperRes.error){
                            callback({error:newBatchRes.error});
                            return;
                        }
                        wrh_pinvs_products.insTableDataItem({tableColumns:wrhPInvProductsTableColumns,idFieldName:"ID",insTableData:{ID:sysOperId,
                            PINV_ID:tableDataItem["PINV_ID"], POSIND:tableDataItem["POSIND"], PRODUCT_ID:tableDataItem["PRODUCT_ID"],
                            QTY:tableDataItem["QTY"], PRICE:tableDataItem["PRICE"], POSSUM:tableDataItem["POSSUM"],
                            SALE_PRICE:tableDataItem["SALE_PRICE"], FACTOR:tableDataItem["FACTOR"]}}, function(wrhProdRes){
                            if(wrhProdRes.error){
                                callback({error:wrhProdRes.error});
                                return;
                            }
                            callback(wrhProdRes);
                        });
                    });
                });
        })
    };

    wrh_pinvs_products.updPInvTableDataItem= function(tableDataItem, callback){
        var pinvProdId=tableDataItem["ID"], prodID=tableDataItem["PRODUCT_ID"], prodBarcode=tableDataItem["BARCODE"];
        wrh_products_r_operations.getDataItem({fields:["PRODUCT_ID","BATCH_NUMBER"],
            conditions:{"OPERATION_ID=":pinvProdId}}, function(result){
            if(result.error){
                callback({error:result.error});
                return;
            }
            var existsProductID=result.item["PRODUCT_ID"],existsBatchNumber=result.item["BATCH_NUMBER"];
            if(existsProductID==prodID){
                wrh_pinvs_products.updDataItem({updData:{QTY:tableDataItem["QTY"], PRICE:tableDataItem["PRICE"],
                        POSSUM:tableDataItem["POSSUM"], SALE_PRICE:tableDataItem["SALE_PRICE"],FACTOR:tableDataItem["FACTOR"]},
                        conditions:{"ID=":tableDataItem["ID"]}},
                    function(updRes){
                        if(updRes.error){
                            callback({error:updRes.error});
                            return;
                        }
                        wrh_pinvs_products.getDataItemForTable({tableColumns:wrhPInvProductsTableColumns,
                            conditions:{"wrh_pinvs_products.ID=":tableDataItem["ID"]}}, function(updDataRes){
                            if(updDataRes.error){
                                callback({error:updRes.error});
                                return;
                            }
                            callback({resultItem:updDataRes.item,updateCount:updRes.updateCount });
                        })
                });
                return;
            }
            dir_products_batches.createNewBatch({prodData:{"PRODUCT_ID":prodID}},
                function(newBatchRes){
                    if(newBatchRes.error){
                        callback({error:newBatchRes.error});
                        return;
                    }
                    var batchNum= newBatchRes.resultItem["BATCH_NUMBER"];
                    wrh_products_r_operations.updDataItem({updData:{BATCH_NUMBER: batchNum, PRODUCT_ID:prodID, BARCODE:prodBarcode},
                        conditions:{"OPERATION_ID=":pinvProdId,"BATCH_NUMBER=":existsBatchNumber,"PRODUCT_ID=":existsProductID}},
                        function(prodOperRes){
                            if(prodOperRes.error){
                                callback({error:newBatchRes.error});
                                return;
                            }
                        wrh_pinvs_products.updDataItem({updData:{QTY:tableDataItem["QTY"], PRICE:tableDataItem["PRICE"],
                            POSSUM:tableDataItem["POSSUM"], SALE_PRICE:tableDataItem["SALE_PRICE"],FACTOR:tableDataItem["FACTOR"]},
                            conditions:{"ID=":tableDataItem["ID"]}},
                            function(updRes){
                                if(updRes.error){
                                    callback({error:updRes.error});
                                    return;
                                }
                                wrh_pinvs_products.getDataItemForTable({tableColumns:wrhPInvProductsTableColumns,
                                    conditions:{"wrh_pinvs_products.ID=":tableDataItem["ID"]}}, function(updDataRes){
                                    if(updDataRes.error){
                                        callback({error:updDataRes.error});
                                        return;
                                    }
                                    callback({resultItem:updDataRes.item,updateCount:updRes.updateCount });
                                });
                        });
                    });
                });
        });
    };

    wrh_pinvs_products.storePInvTableDataItem= function(storeData, callback){
        if (!storeData["ID"]) {
            var findFields = [];
            if (storeData["PRODUCT_CODE"] || storeData["PRODUCT_NAME"]) {
                if (storeData["PRODUCT_CODE"])findFields.push("CODE");
                if (storeData["PRODUCT_NAME"])findFields.push("NAME");
            }
            dir_products_bata.findDataItemByOrCreateNew({
                    resultFields: ["ID", "CODE", "NAME", "PRINT_NAME", "UM", "PBARCODE"],
                    findByFields: findFields,
                    idFieldName: "ID",
                    fieldsValues: {
                        "CODE": storeData["PRODUCT_CODE"],
                        "NAME": storeData["PRODUCT_NAME"],
                        "PRINT_NAME": storeData["PRODUCT_PRINT_NAME"],
                        "UM": storeData["PRODUCT_UM"],
                        "PBARCODE": storeData["BARCODE"],
                        "ARTICLE": storeData["PRODUCT_ARTICLE"],
                        "COLLECTION": storeData["PRODUCT_COLLECTION"],
                        "TYPE": storeData["PRODUCT_TYPE"],
                        "KIND": storeData["PRODUCT_KIND"],
                        "COMPOSITION": storeData["PRODUCT_COMPOSITION"],
                        "SIZE": storeData["PRODUCT_SIZE"] || "",
                        "GENDER": storeData["PRODUCT_GENDER"],
                        "GENDER_CODE": storeData["PRODUCT_GENDER_CODE"],
                        "CATEGORY": storeData["PRODUCT_CATEGORY"],
                        "CATEGORY_CODE": storeData["PRODUCT_CATEGORY_CODE"],
                        "SUBCATEGORY": storeData["PRODUCT_SUBCATEGORY"],
                        "SUBCATEGORY_CODE": storeData["PRODUCT_SUBCATEGORY_CODE"]
                    }
                },
                function (result) {
                    if (result.error) {
                        callback({error: "Failed find/create product! Reason:" + result.error});
                        return;
                    }
                    if (!result.resultItem) {
                        callback({error: "Failed find/create product! Reason: no result!"});
                        return;
                    }
                    storeData["PRODUCT_ID"]=result.resultItem["ID"];
                    if (!storeData["BARCODE"])storeData["BARCODE"] = result.resultItem["PBARCODE"];
                    wrh_pinvs_products.insNewPInvTableDataItem(storeData, function(insNewDataResult){
                        callback(insNewDataResult);
                    });
                });
            return;
        }

        var findFields = [];
        //ID CODE NAME PRINT_NAME UM PBARCODE ARTICLE_ID KIND_ID COMPOSITION_ID SIZE_ID COLLECTION_ID
        //TYPE_ID  LINE_ID DESCRIPTION_ID
        if (storeData["PRODUCT_CODE"])findFields.push("CODE");
        if (storeData["PRODUCT_NAME"])findFields.push("NAME");
        if (storeData["PRODUCT_PRINT_NAME"])findFields.push("PRINT_NAME");
        if (storeData["PRODUCT_UM"])findFields.push("UM");
        if (storeData["BARCODE"])findFields.push("PBARCODE");
        if (storeData["PRODUCT_ARTICLE"])findFields.push("ARTICLE_ID");
        if (storeData["PRODUCT_COLLECTION"])findFields.push("KIND_ID");
        if (storeData["PRODUCT_KIND"])findFields.push("COMPOSITION_ID");
        if (storeData["PRODUCT_COMPOSITION"])findFields.push("SIZE_ID");
        if (storeData["PRODUCT_SIZE"])findFields.push("COLLECTION_ID");

        dir_products_bata.findDataItemBy({resultFields:["ID"],findByFields:findFields,
            fieldsValues: {
            "CODE": storeData["PRODUCT_CODE"],
            "NAME": storeData["PRODUCT_NAME"],
            "PRINT_NAME": storeData["PRODUCT_PRINT_NAME"],
            "UM": storeData["PRODUCT_UM"],
            "PBARCODE": storeData["BARCODE"],
            "ARTICLE": storeData["PRODUCT_ARTICLE"],
            "COLLECTION": storeData["PRODUCT_COLLECTION"],
            "TYPE": storeData["PRODUCT_TYPE"],
            "KIND": storeData["PRODUCT_KIND"],
            "COMPOSITION": storeData["PRODUCT_COMPOSITION"],
            "SIZE": storeData["PRODUCT_SIZE"],
            "GENDER": storeData["PRODUCT_GENDER"],
            "GENDER_CODE": storeData["PRODUCT_GENDER_CODE"],
            "CATEGORY": storeData["PRODUCT_CATEGORY"],
            "CATEGORY_CODE": storeData["PRODUCT_CATEGORY_CODE"],
            "SUBCATEGORY": storeData["PRODUCT_SUBCATEGORY"],
            "SUBCATEGORY_CODE": storeData["PRODUCT_SUBCATEGORY_CODE"]
        }}, function(result){
            if(result.error){
                callback({error:result.error});
                return;
            }
            if(result.resultItem&&result.resultItem["ID"]){
                storeData["PRODUCT_ID"]=result.resultItem["ID"];
                wrh_pinvs_products.updPInvTableDataItem(storeData, function(updResult){
                    callback(updResult);
                });
                return;
            }

            dir_products_bata.findOrCreateProdAttributes({prodData:{
                "ARTICLE": storeData["PRODUCT_ARTICLE"],
                "COLLECTION": storeData["PRODUCT_COLLECTION"],
                "TYPE": storeData["PRODUCT_TYPE"],
                "KIND": storeData["PRODUCT_KIND"],
                "COMPOSITION": storeData["PRODUCT_COMPOSITION"],
                "SIZE": storeData["PRODUCT_SIZE"]
                 }
            }, function(result) {
                var prodAttributes = result.resultItem;
                //ID CODE* NAME* PRINT_NAME* UM* PBARCODE* ARTICLE_ID* KIND_ID* COMPOSITION_ID* SIZE_ID* COLLECTION_ID* TYPE_ID*
                //GENDER_ID  CATEGORY_ID   SUBCATEGORY_ID
                dir_products_genders_bata.getDataItem({
                        fields: ["ID"], conditions: {"CODE=": storeData["PRODUCT_GENDER_CODE"]}}, function (result) { console.log("result. 460=",result);
                        if (result.error || !result.item || !result.item["ID"]) {
                            callback({error: "Failed to find product gender! Reason: no result!"});
                            return;
                        }
                        var prodGenderID = result.item["ID"];
                        dir_products_categories_bata.getDataItem({fields: ["ID"], conditions: {"NAME=": storeData["PRODUCT_CATEGORY"]}}, function (result) { console.log("result 466=",result);
                            if (result.error || !result.item || !result.item["ID"]) {
                                callback({error: "Failed to find product category! Reason: no result!"});
                                return;
                            }
                            var prodCategoryID = result.item["ID"];
                            dir_products_subcategories_bata.getDataItem({fields:["ID"],
                                conditions:{"NAME=":storeData["PRODUCT_SUBCATEGORY"]}}, function(result){ console.log("result 460=",result);
                                if (result.error || !result.item || !result.item["ID"]) {
                                    callback({error: "Failed to find product subcategory! Reason: no result!"});
                                    return;
                                }
                                var prodSubCategory=result.item["ID"]; console.log("prodSubCategory=",prodSubCategory);

                                wrh_products_r_operations.getDataItem({fields:["PRODUCT_ID"],
                                    conditions:{"OPERATION_ID=":storeData["ID"]}}, function(result) { console.log("result 468=",result);
                                    if (result.error) {
                                        callback({error: result.error});
                                        return;
                                    }
                                    var prodID=result.item["PRODUCT_ID"];
                                    dir_products_bata.updDataItem({updData:{"CODE":storeData["PRODUCT_CODE"],"NAME":storeData["PRODUCT_PRINT_NAME"],
                                        "PRINT_NAME":storeData["PRODUCT_PRINT_NAME"],"UM": storeData["PRODUCT_UM"],"PBARCODE": storeData["BARCODE"],
                                        "COLLECTION_ID":prodAttributes["COLLECTION_ID"],"COMPOSITION_ID":prodAttributes["COMPOSITION_ID"],"SIZE_ID":prodAttributes["SIZE_ID"],
                                        "ARTICLE_ID":prodAttributes["ARTICLE_ID"],"TYPE_ID":prodAttributes["TYPE_ID"], "KIND_ID":prodAttributes["KIND_ID"],
                                        "GENDER_ID":prodGenderID,"CATEGORY_ID":prodCategoryID, "SUBCATEGORY_ID":prodSubCategory}
                                        ,conditions:{"ID=":prodID}},function(updRes){  console.log("updRes=",updRes);
                                        if(updRes.error){
                                            callback({error:updRes.error});
                                        }
                                        wrh_products_r_operations.updDataItem({updData:{BARCODE:storeData["BARCODE"]},
                                                conditions:{"OPERATION_ID=":storeData["ID"]}},
                                            function(prodOperRes){
                                                if(prodOperRes.error){
                                                    callback({error:prodOperRes.error});
                                                    return;
                                                }
                                                wrh_pinvs_products.updDataItem({updData:{QTY:storeData["QTY"], PRICE:storeData["PRICE"],
                                                        POSSUM:storeData["POSSUM"], SALE_PRICE:storeData["SALE_PRICE"],FACTOR:storeData["FACTOR"]},
                                                        conditions:{"ID=":storeData["ID"]}},
                                                    function(updRes){
                                                        if(updRes.error){
                                                            callback({error:updRes.error});
                                                            return;
                                                        }
                                                        wrh_pinvs_products.getDataItemForTable({tableColumns:wrhPInvProductsTableColumns,
                                                            conditions:{"wrh_pinvs_products.ID=":storeData["ID"]}}, function(updDataRes){
                                                            if(updDataRes.error){
                                                                callback({error:updRes.error});
                                                                return;
                                                            }
                                                            callback({resultItem:updDataRes.item,updateCount:updRes.updateCount });
                                                        });
                                                    });
                                            });
                                    });
                                });
                            });
                        });
                    });
            });
    });
    };

    app.post("/wrh/pInvoices/storePInvProductsTableData", function(req, res){
        var storeData=req.body;
        wrh_pinvs_products.storePInvTableDataItem(storeData,
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/pInvoices/deletePInvProductsTableData", function(req, res){
        var delData=req.body;
        wrh_pinvs_products.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });
};