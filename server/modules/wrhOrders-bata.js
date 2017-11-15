var dataModel=require('../datamodel'), dateFormat = require('dateformat');
var wrh_orders_bata= require(appDataModelPath+"wrh_orders_bata"),
    wrh_orders_bata_details= require(appDataModelPath+"wrh_orders_bata_details");
var path=require('path'), XLSX=require('xlsx'),fs=require('fs');
var multer  = require('multer'), upload = multer({ dest: 'uploads/' });
var dir_units= require(appDataModelPath+"dir_units"),
    dir_contractors= require(appDataModelPath+"dir_contractors"),
    sys_currency= require(appDataModelPath+"sys_currency"),
    sys_docstates= require(appDataModelPath+"sys_docstates");
var dir_products_articles= require(appDataModelPath+"dir_products_articles"),
    dir_products_genders= require(appDataModelPath+"dir_products_genders-bata"),
    dir_products_categories= require(appDataModelPath+"dir_products_categories-bata"),
    dir_products_subcategories= require(appDataModelPath+"dir_products_subcategories-bata"),
    dir_products_categories_subcategories= require(appDataModelPath+"dir_products_categories_subcats-bata");


module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_orders_bata,wrh_orders_bata_details, dir_products_articles], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/orders-bata";
module.exports.modulePagePath = "wrh/orders-bata.html";
module.exports.init = function(app){
    var wrhOrdersBataListTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false, dataSource:"wrh_orders_bata"},
        {data: "NUMBER", name: "Номер", width: 50, type: "text", dataSource:"wrh_orders_bata"},
        {data: "DOCDATE", name: "Дата", width: 55, type: "dateAsText", dataSource:"wrh_orders_bata"},
        {data: "UNIT_NAME", name: "Подразделение", width: 120, type: "text", dataSource:"dir_units", sourceField:"NAME"},
        {data: "SUPPLIER_NAME", name: "Поставщик", width: 120, type: "text", dataSource:"dir_contractors", sourceField:"NAME"},
        {data: "SUPPLIER_ORDER_NUM", name: "Номер заказа поставщика", width: 80, type: "text", dataSource:"wrh_orders_bata"},
        {data: "DOCCOUNT", name: "Строк", width: 50, type: "numeric", visible:false,
            childDataSource:"wrh_orders_bata_details", childLinkField:"ORDER_BATA_ID", parentLinkField:"ID",
            dataFunction:{function:"rowsCountIsNull", source:"wrh_orders_bata_details", sourceField:"POS"} },
        {data: "DOCQTYSUM", name: "Кол-во", width: 60, type: "numeric",
            childDataSource:"wrh_orders_bata_details", childLinkField:"ORDER_BATA_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_orders_bata_details", sourceField:"QTY"} },
        {data: "DOCSUM", name: "Сумма", width: 80, type: "numeric2",
            childDataSource:"wrh_orders_bata_details", childLinkField:"ORDER_BATA_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_orders_bata_details", sourceField:"POSSUM"} },
        {data: "CURRENCY_CODE", name: "Валюта", width: 50, type: "text", dataSource:"sys_currency", sourceField:"CODE"},
        {data: "CURRENCY_CODENAME", name: "Валюта", width: 50, type: "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {data: "DOCSTATE_NAME", name: "Статус", width: 110, type: "text", dataSource:"sys_docstates", sourceField:"NAME"}
    ];
    app.get("/wrh/ordersBata/getDataForOrdersBataListTable", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_orders_bata."+condItem]=req.query[condItem];
        wrh_orders_bata.getDataForTable({tableColumns:wrhOrdersBataListTableColumns,
                identifier:wrhOrdersBataListTableColumns[0].data,
                conditions:conditions, order:"NUMBER,DOCDATE,dir_units.NAME"},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/ordersBata/getOrderBataData", function(req, res){
        var conditions={};
        for(var condItem in req.query) conditions["wrh_orders_bata."+condItem]=req.query[condItem];
        wrh_orders_bata.getDataItemForTable({tableColumns:wrhOrdersBataListTableColumns,
                conditions:conditions},
            function(result){
                res.send(result);
            });
    });
    app.get("/wrh/ordersBata/getNewOrderBataData", function(req, res){
        wrh_orders_bata.getDataItem({fields:["MAXNUMBER"],fieldsFunctions:{"MAXNUMBER":{function:"maxPlus1", sourceField:"NUMBER"}},
                conditions:{"1=1":null}},
            function(result){
                var newNumber=(result&&result.item)?result.item["MAXNUMBER"]:"", docDate=dateFormat(new Date(),"yyyy-mm-dd");
                dir_units.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                    var unitName=(result&&result.item)?result.item["NAME"]:"";
                    dir_contractors.getDataItem({fields:["NAME"],conditions:{"ID=":"1"}}, function(result){
                        var supplierName=(result&&result.item)?result.item["NAME"]:"";
                        sys_currency.getDataItem({ fields:["CODE","CODENAME"],
                                fieldsFunctions:{"CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"]}},
                                conditions:{"ID=":"0"} },
                            function(result){
                                var sysCurrencyCode=(result&&result.item)?result.item["CODE"]:"";
                                var sysCurrencyCodeName=(result&&result.item)?result.item["CODENAME"]:"";
                                //sys_docstates.getDataItem({fields:["NAME"],conditions:{"ID=":"0"}}, function(result){
                                //});
                                wrh_orders_bata.setDataItem({fields:["NUMBER","DOCDATE","SUPPLIER_ORDER_NUM","UNIT_NAME","SUPPLIER_NAME",
                                        "CURRENCY_CODE","CURRENCY_CODENAME", "DOCSTATE_NAME", "DOCCOUNT","DOCQTYSUM","DOCSUM"],
                                        values:[newNumber,docDate,"",unitName,supplierName,sysCurrencyCode,sysCurrencyCodeName,"",0,0,0]},
                                    function(result){
                                        res.send(result);
                                    });
                            });
                    });
                });
            });
    });
    app.post("/wrh/ordersBata/storeOrderBataData", function(req, res){
        var storeData=req.body;
        dir_units.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["UNIT_NAME"]}}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded unit by name!"});
                return;
            }
            storeData["UNIT_ID"]=result.item["ID"];
            dir_contractors.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["SUPPLIER_NAME"]}}, function(result){
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
                    var docStateID=0;
                    sys_docstates.getDataItem({fields:["ID"],conditions:{"NAME=":storeData["DOCSTATE_NAME"]}}, function(result){
                        if(result.item) docStateID=result.item["ID"];
                        storeData["DOCSTATE_ID"]=docStateID;
                        wrh_orders_bata.storeTableDataItem({tableColumns:wrhOrdersBataListTableColumns, idFieldName:"ID", storeTableData:storeData},
                            function(result){
                                res.send(result);
                            });
                    });
                });
            });
        });
    });
    app.post("/wrh/ordersBata/deleteOrderBataData", function(req, res){
        var delData=req.body;
        wrh_orders_bata.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });
    var wrhOrderBataDetailsTableColumns=[
        {data: "ID", name: "ID", width: 50, type: "text", readOnly:true, visible:false},
        {data: "ORDER_BATA_ID", name: "ORDER_BATA_ID", width: 50, type: "text", readOnly:true, visible:false},
        {data: "POS", name: "Номер п/п", width: 45, type: "text"},
        {data: "PRODUCT_GENDER_CODE", name: "Код группы", width: 65,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/genderCode",
            dataSource:"dir_products_genders", sourceField:"CODE"},
        {data: "PRODUCT_GENDER", name: "Группа", width: 150,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/gender",
            dataSource:"dir_products_genders", sourceField:"NAME"},
        {data: "PRODUCT_CATEGORY_CODE", name: "Код категории", width: 80,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/CategoryCode",
            dataSource:"dir_products_categories", sourceField:"CODE"},
        {data: "PRODUCT_CATEGORY", name: "Категория", width: 200,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/Category",
            dataSource:"dir_products_categories", sourceField:"NAME"},
        {data: "PRODUCT_SUBCATEGORY_CODE", name: "Код подкатегории", width: 100,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/SubcategoryCode",
            dataSource:"dir_products_subcategories", sourceField:"CODE"},
        {data: "PRODUCT_SUBCATEGORY", name: "Подкатегория", width: 200,
            type: "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/Subcategory",
            dataSource:"dir_products_subcategories", sourceField:"NAME"},
        {data: "PRODUCT_ARTICLE", name: "Артикул", width: 80, type: "text",
            dataSource:"dir_products_articles", sourceField:"VALUE"},
        {data: "QTY", name: "Кол-во", width: 50, type: "numeric"},
        {data: "RETAIL_PRICE", name: "Цена Retail", width: 60, type: "numeric2"},
        {data: "PRICE", name: "Цена", width: 60, type: "numeric2"},
        {data: "POSSUM", name: "Сумма", width: 80, type: "numeric2"}
    ];
    app.get("/wrh/ordersBata/getDataForOrdersBataDetailsTable", function(req, res){
        wrh_orders_bata_details.getDataForTable({tableColumns:wrhOrderBataDetailsTableColumns,
                identifier:wrhOrderBataDetailsTableColumns[0].data,
                conditions:req.query,
                order:["POS"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/ordersBata/storeOrdersBataDetailsTable", function(req, res){
        var storeData=req.body;
        var genderCondition={};
        if(storeData["PRODUCT_GENDER"]) genderCondition["NAME="]=storeData["PRODUCT_GENDER"];
        if(storeData["PRODUCT_GENDER_CODE"]) genderCondition["CODE="]=storeData["PRODUCT_GENDER_CODE"];
        dir_products_genders.getDataItem({fields:["ID"],conditions:genderCondition}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded gender by code,name!"});
                return;
            }
            storeData["PRODUCT_GENDER_ID"]=result.item["ID"];
            var categoryCondition={};
            if(storeData["PRODUCT_CATEGORY"]) categoryCondition["NAME="]=storeData["PRODUCT_CATEGORY"];
            if(storeData["PRODUCT_CATEGORY_CODE"]) categoryCondition["CODE="]=storeData["PRODUCT_CATEGORY_CODE"];
            dir_products_categories.getDataItem({fields:["ID"],conditions:categoryCondition}, function(result){
                if(!result.item){
                    res.send({ error:"Cannot finded category by code,name!"});
                    return;
                }
                storeData["PRODUCT_CATEGORY_ID"]=result.item["ID"];
                var subcategoryCondition={};
                if(storeData["PRODUCT_SUBCATEGORY"]) subcategoryCondition["NAME="]=storeData["PRODUCT_SUBCATEGORY"];
                if(storeData["PRODUCT_SUBCATEGORY_CODE"]) subcategoryCondition["CODE="]=storeData["PRODUCT_SUBCATEGORY_CODE"];
                dir_products_subcategories.getDataItem({fields:["ID"],conditions:subcategoryCondition}, function(result) {
                    if (!result.item) {
                        res.send({error: "Cannot finded subcategory by code,name!"});
                        return;
                    }
                    storeData["PRODUCT_SUBCATEGORY_ID"] = result.item["ID"];
                    var prodArticle=storeData["PRODUCT_ARTICLE"];
                    dir_products_articles.findDataItemByOrCreateNew({resultFields:["ID"],
                            findByFields:["VALUE"],
                            idFieldName:"ID", fieldsValues:{"VALUE":prodArticle} },
                        function(result){
                            if (result.error||!result.resultItem||result.resultItem["ID"]==null) {
                                res.send({error: "Cannot finded or create article!"});
                                return;
                            }
                            storeData["PRODUCT_ARTICLE_ID"] = result.resultItem["ID"];
                            wrh_orders_bata_details.storeTableDataItem({tableColumns:wrhOrderBataDetailsTableColumns, idFieldName:"ID", storeTableData:storeData},
                                function(result){
                                    if (result.error) {
                                        res.send({error: "Cannot store order bata! Reason:"+result.error});
                                        return;
                                    }
                                    res.send(result);
                                });
                        });
                });
            });
        });
    });
    app.post("/wrh/ordersBata/deleteOrdersBataDetailsTable", function(req, res){
        var delData=req.body;
        wrh_orders_bata_details.delTableDataItem({idFieldName:"ID", delTableData:delData}, function(result){
            res.send(result);
        });
    });

    app.post("/wrh/ordersBata/importOrderFromFile", upload.single('newOrder'), function(req, res){
        var outData={};
        outData.columns=wrhOrderBataDetailsTableColumns;
        var fname = path.join(__dirname, "../../"+req.file.path);
        var wb;
        try {
            wb = XLSX.readFileSync(fname);
        }catch(e){                                                                  log.error("Impossible to create workbook! Reason:",e);
            res.sendStatus(500);
            return;
        }
        var sheet=wb["Sheets"]["Dati"];
        if(sheet==undefined){
            outData.error="Failed to get 'Dati' sheet in file";
            res.send(outData);
            return;
        }
       var posColNum, prodGenderCodeColNum, prodCatCodeColNum,prodSubCatCodeColNum,prodArticleColNum,qtyColNum,
           retailPriceColNum, priceColNum;
        var range=XLSX.utils.decode_range(sheet['!ref']);
        for(var HC=0; HC < range.e.c; HC++){
            var header_address = {c:HC, r:0};
            var header_ref = XLSX.utils.encode_cell(header_address);
                var headerObj=sheet[header_ref];
            if(!headerObj || !headerObj.v) continue;
            else if(headerObj.v.trim()=="Line") posColNum=header_address.c;
            else if(headerObj.v.trim()=="Gender") prodGenderCodeColNum=header_address.c;
            else if(headerObj.v.trim()=="Cat.") prodCatCodeColNum=header_address.c;
            else if(headerObj.v.trim()=="Sub.") prodSubCatCodeColNum=header_address.c;
            else if(headerObj.v.trim()=="Item No.") prodArticleColNum=header_address.c;
            else if(headerObj.v.trim()=="Q.ty") qtyColNum = header_address.c;
            else if(headerObj.v.trim()=="Gross Price by unit") retailPriceColNum=header_address.c;
            else if(headerObj.v.trim()=="Net Price by unit") priceColNum=header_address.c;
        }
        outData.items=[];
        for(var R = 1; R <= range.e.r; R++) {
            var tableDataItem={};
            var posCellRef = XLSX.utils.encode_cell({c:posColNum, r:R});
            var posCellObj = sheet[posCellRef];
            if(!posCellObj || !posCellObj.v) break;
            tableDataItem["POS"]=posCellObj.v;
            var prodGenderCodeCellRef = XLSX.utils.encode_cell({c:prodGenderCodeColNum, r:R});
            var prodGenderCodeCellObj = sheet[prodGenderCodeCellRef];
            if(!prodGenderCodeCellObj || !prodGenderCodeCellObj.v) break;
            tableDataItem["PRODUCT_GENDER_CODE"]= prodGenderCodeCellObj.v.trim();
            var prodCategoryCodeCellRef = XLSX.utils.encode_cell({c:prodCatCodeColNum, r:R});
            var prodCategoryCodeCellObj = sheet[prodCategoryCodeCellRef];
            if(!prodCategoryCodeCellObj || !prodCategoryCodeCellObj.v) break;
            tableDataItem["PRODUCT_CATEGORY_CODE"] = parseInt(prodCategoryCodeCellObj.v.trim());
            var prodSubCatCodeCellRef = XLSX.utils.encode_cell({c:prodSubCatCodeColNum, r:R});
            var prodSubCatCodeCodeCellObj = sheet[prodSubCatCodeCellRef];
            if(!prodSubCatCodeCodeCellObj || !prodSubCatCodeCodeCellObj.v.trim()) break;
            tableDataItem["PRODUCT_SUBCATEGORY_CODE"] = parseInt(prodSubCatCodeCodeCellObj.v.trim());
            var prodArticleCellRef = XLSX.utils.encode_cell({c:prodArticleColNum, r:R});
            var prodArticleCellObj = sheet[prodArticleCellRef];
            if(!prodArticleCellObj || !prodArticleCellObj.v) break;
            tableDataItem["PRODUCT_ARTICLE"] = prodArticleCellObj.v.trim();
            var qtyCellRef = XLSX.utils.encode_cell({c:qtyColNum, r:R});
            var qtyCellObj = sheet[qtyCellRef];
            if(!qtyCellObj || !qtyCellObj.v) break;
            tableDataItem["QTY"] = qtyCellObj.v;
            var retailPriceCellRef = XLSX.utils.encode_cell({c:retailPriceColNum, r:R});
            var retailPriceCellObj = sheet[retailPriceCellRef];
            if(!retailPriceCellObj || !retailPriceCellObj.v) break;
            tableDataItem["RETAIL_PRICE"] = retailPriceCellObj.v;
            var priceCellRef = XLSX.utils.encode_cell({c:priceColNum, r:R});
            var priceCellObj = sheet[priceCellRef];
            if(!priceCellObj || !priceCellObj.v) break;
            tableDataItem["PRICE"] =  priceCellObj.v;
            outData.items.push(tableDataItem);
        }
        res.send(outData);
    });

};