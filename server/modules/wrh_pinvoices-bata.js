var dataModel=require('../datamodel'), dateFormat = require('dateformat'),util=require('../util'), path=require('path');
var XLSX=require('xlsx'),fs=require('fs');
var wrh_pinvs= require(appDataModelPath+"wrh_pinvs"), wrh_pinvs_products= require(appDataModelPath+"wrh_pinvs_products");
var dir_units= require(appDataModelPath+"dir_units"), dirContractors= require(appDataModelPath+"dir_contractors"),
    sys_currency= require(appDataModelPath+"sys_currency"), sysDocStates= require(appDataModelPath+"sys_docstates"),
    dir_products_collections= require(appDataModelPath+"dir_products_collections"),
    dir_products_bata= require(appDataModelPath+"dir_products-bata"),
    dir_products_batches= require(appDataModelPath+"dir_products_batches");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([wrh_pinvs,wrh_pinvs_products,
            dir_products_bata, dir_products_batches], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/pinvoices";
module.exports.modulePagePath = "wrh/pinvoices-bata.html";
module.exports.init = function(app){
    var wrhPInvsListTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false, dataSource:"wrh_pinvs"},
        {"data": "NUMBER", "name": "Номер", "width": 50, "type": "text", dataSource:"wrh_pinvs"},
        {"data": "DOCDATE", "name": "Дата", "width": 55, "type": "dateAsText", dataSource:"wrh_pinvs"},
        {"data": "UNIT_NAME", "name": "Подразделение", "width": 120, "type": "text", dataSource:"dir_units", dataField:"NAME"},
        {"data": "SUPPLIER_NAME", "name": "Поставщик", "width": 150, "type": "text", dataSource:"dir_contractors", dataField:"NAME"},
        {"data": "SUPPLIER_ORDER_NUM", "name": "Номер заказа поставщика", "width": 100, "type": "text", dataSource:"wrh_pinvs"},
        {"data": "SUPPLIER_INV_NUM", "name": "Номер накл. поставщика", "width": 100, "type": "text", dataSource:"wrh_pinvs"},
        {"data": "PRODUCT_COLLECTION", "name": "Коллекция", "width": 120, "type": "text", visible:false,
            dataSource:"dir_products_collections", dataField:"NAME"},
        {"data": "DOCCOUNT", "name": "Строк", "width": 60, "type": "numeric", visible:false,
            childDataSource:"wrh_pinvs_products", childLinkField:"PINV_ID", parentLinkField:"ID",
            dataFunction:{function:"rowsCountIsNull", source:"wrh_pinvs_products", sourceField:"POSIND"} },
        {"data": "DOCQTYSUM", "name": "Кол-во", "width": 60, "type": "numeric",
            childDataSource:"wrh_pinvs_products", childLinkField:"PINV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"QTY"} },
        {"data": "DOCSUM", "name": "Сумма", "width": 80, "type": "numeric2",
            childDataSource:"wrh_pinvs_products", childLinkField:"PINV_ID", parentLinkField:"ID",
            dataFunction:{function:"sumIsNull", source:"wrh_pinvs_products", sourceField:"POSSUM"} },
        {"data": "CURRENCY_CODE", "name": "Валюта", "width": 50, "type": "text", dataSource:"sys_currency", dataField:"CODE"},
        {"data": "CURRENCY_CODENAME", "name": "Валюта", "width": 50, "type": "text", visible:false,
            dataSource:"sys_currency", dataFunction:{function:"concat",fields:["sys_currency.CODE","' ('","sys_currency.NAME","')'"]} },
        {"data": "DOCSTATE_NAME", "name": "Статус", "width": 110, "type": "text", dataSource:"sys_docstates", dataField:"NAME"},
        {"data": "RATE", "name": "Курс валюты", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_pinvs"},
        {"data": "BASE_FACTOR", "name": "Базов.коэфф.", "width": 60, "type": "numeric2", visible:false, dataSource:"wrh_pinvs"}
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
        wrh_pinvs.getDataItem({fieldFunction:{name:"MAXNUMBER", function:"maxPlus1", sourceField:"NUMBER"},
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
        {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "PINV_ID", "name": "PINV_ID", "width": 50, "type": "text", readOnly:true, visible:false},
        {"data": "SUPPLIER_ID", "name": "SUPPLIER_ID", "width": 65, "type": "text", readOnly:true, visible:false,
            dataSource:"wrh_pinvs", dataField:"SUPPLIER_ID", linkCondition:"wrh_pinvs.ID=wrh_pinvs_products.PINV_ID" },
        {"data": "SUPPLIER_COUNTRY", "name": "SUPPLIER_COUNTRY", "width": 65, "type": "text", readOnly:true, visible:false,
            dataSource:"dir_contractors", dataField:"COUNTRY", linkCondition:"dir_contractors.ID=wrh_pinvs.SUPPLIER_ID" },
        {"data": "POSIND", "name": "POSIND", "width": 45, "type": "numeric", visible:false},
        {"data": "POS", "name": "Номер п/п", "width": 45, "type": "numeric", dataFunction:"TRUNCATE(POSIND,0)"},
        {"data": "PRODUCT_GENDER_CODE", "name": "Код группы", "width": 65,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/genderCode",
            dataSource:"dir_products_genders", dataField:"CODE", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {"data": "PRODUCT_GENDER", "name": "Группа", "width": 150,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsGendersCombobox/gender",
            dataSource:"dir_products_genders", dataField:"NAME", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" },
        {"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории", "width": 80,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/CategoryCode",
            dataSource:"dir_products_categories", dataField:"CODE", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {"data": "PRODUCT_CATEGORY", "name": "Категория", "width": 200,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsCategoryCombobox/Category",
            dataSource:"dir_products_categories", dataField:"NAME", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" },
        {"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 100,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/SubcategoryCode",
            dataSource:"dir_products_subcategories", dataField:"CODE", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория", "width": 200,
            "type": "combobox", "sourceURL":"/dir/products/getDataForOrderBataProductsSubcategoryCombobox/Subcategory",
            dataSource:"dir_products_subcategories", dataField:"NAME", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" },
        {"data": "PRODUCT_COLLECTION", "name": "Коллекция", "width": 150, "type": "text", visible:false,
            dataSource:"dir_products_collections", dataField:"NAME", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        {"data": "PRODUCT_COLLECTION_CODE", "name": "Код коллекции", "width": 100, "type": "text", visible:false,
            dataSource:"dir_products_collections", dataField:"CODE", linkCondition:"dir_products_collections.ID=dir_products.COLLECTION_ID" },
        //{"data": "PRODUCT_TYPE", "name": "Тип", "width": 100, //"type": "text",
        //    "type": "combobox", "sourceURL":"/dir/products/getDataForProductsTypesCombobox",
        //    dataSource:"dir_products_types", dataField:"NAME"},
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
        {"data": "POSSUM", "name": "Сумма", "width": 80, "type": "numeric2"},
        {"data": "BATCH_NUMBER", "name": "Партия", "width": 60, "type": "text", visible:false},
        {"data": "FACTOR", "name": "Коэфф.", "width": 60, "type": "numeric2"},
        {"data": "SALE_PRICE", "name": "Цена продажи", "width": 75, "type": "numeric2"},
        {"data": "PRICELIST_PRICE", "name": "Цена по прайс-листу", "width": 75, "type": "numeric2",
            dataFunction:"0"}
    ];
    app.get("/wrh/pInvoices/getDataForPInvProductsTable", function(req, res){
        wrh_pinvs_products.getDataForTable({tableColumns:wrhPInvProductsTableColumns,
                identifier:wrhPInvProductsTableColumns[0].data,
                conditions:req.query,
                order:["POSIND"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/wrh/pInvoices/storePInvProductsTableData", function(req, res){
        var storeData=req.body;
        var findFields=[];
        if(storeData["PRODUCT_CODE"]||storeData["PRODUCT_NAME"]){
            if (storeData["PRODUCT_CODE"])findFields.push("CODE");
            if (storeData["PRODUCT_NAME"])findFields.push("NAME");
        }
        dir_products_bata.findDataItemByOrCreateNew({resultFields:["ID","CODE","NAME","PRINT_NAME","UM","PBARCODE"],
                findByFields:findFields,
                idFieldName:"ID",
                fieldsValues:{"CODE":storeData["PRODUCT_CODE"],"NAME":storeData["PRODUCT_NAME"],
                    "UM":storeData["PRODUCT_UM"],"PBARCODE":storeData["BARCODE"],
                    "ARTICLE":storeData["PRODUCT_ARTICLE"],"COLLECTION":storeData["PRODUCT_COLLECTION"],
                    "TYPE":storeData["PRODUCT_TYPE"],"KIND":storeData["PRODUCT_KIND"],
                    "COMPOSITION":storeData["PRODUCT_COMPOSITION"],"SIZE":storeData["PRODUCT_SIZE"],
                    "GENDER":storeData["PRODUCT_GENDER"],"GENDER_CODE":storeData["PRODUCT_GENDER_CODE"],
                    "CATEGORY":storeData["PRODUCT_CATEGORY"],"CATEGORY_CODE":storeData["PRODUCT_CATEGORY_CODE"],
                    "SUBCATEGORY":storeData["PRODUCT_SUBCATEGORY"],"SUBCATEGORY_CODE":storeData["PRODUCT_SUBCATEGORY_CODE"]}},
            function(result) {
                if (result.error) {
                    res.send({error: "Failed find/create product! Reason:"+result.error});
                    return;
                }
                if (!result.resultItem) {
                    res.send({error: "Failed find/create product! Reason: no result!"});
                    return;
                }
                var prodID=result.resultItem["ID"];
                storeData["PRODUCT_ID"]=prodID;
                if(!storeData["BARCODE"])storeData["BARCODE"]=result.resultItem["PBARCODE"];
                dir_products_batches.createNewBatch({prodData:{"PRODUCT_ID":prodID}},
                    function(result){
                        if(result.error) {
                            res.send({error: "Failed create product batch! Reason:"+result.error});
                            return;
                        }
                        storeData["BATCH_NUMBER"]=result.resultItem["BATCH_NUMBER"];
                        wrh_pinvs_products.storeTableDataItem({tableColumns:wrhPInvProductsTableColumns, idFieldName:"ID",
                                storeTableData:storeData},
                            function(result){
                                res.send(result);
                            });
                    });
            });
    });
    app.post("/wrh/pInvoices/deletePInvProductsTableData", function(req, res){
        var delData=req.body;
        wrh_pinvs_products.delTableDataItem({idFieldName:"ID", delTableData:delData},
            function(result){
                res.send(result);
            });
    });

    app.post("/wrh/pInvoices/get_excel_file", function(req, res){
        try {
            var body = JSON.parse(req.body), columns=body.columns, rows=body.rows;
        }catch(e){
            res.sendStatus(500);   console.log("Impossible to parse data! Reason:"+e);
            return;
        }
        var uniqueFileName = util.getUIDNumber();
        var fname = path.join(__dirname, '../../XLSX_temp/' + uniqueFileName + '.xlsx');
        try {fs.writeFileSync(fname);} catch (e) {
            res.sendStatus(500);
            return;
        }
        try {
            var wb = XLSX.readFileSync(fname);
        }catch(e){
            res.sendStatus(500);
            return;
        }
        wb.SheetNames = [];
        wb.SheetNames.push('Sheet1');

        fillTable(wb,columns,rows);

        XLSX.writeFileAsync(fname, wb, {bookType: "xlsx", cellStyles: true}, function(err){
            if (err) {
                res.sendStatus(500);    console.log("send xlsx file err=", err);
                return;
            }
            var options = {headers: {'Content-Disposition': 'attachment; filename =out.xlsx'}};
            res.sendFile(fname, options, function (err) {
                if (err) {
                    res.sendStatus(500); console.log("send xlsx file err=", err);
                }
                fs.unlinkSync(fname);
            })
        });
    });
    function fillTable(wb,columns,rows){
        fillHeaders(wb,columns);
        var lineNum=1;
        for (var i in rows){
            fillRowData(wb,rows[i],columns,lineNum);
            lineNum++;
        }
    }
    function fillHeaders(wb,columns){
        var worksheetColumns = [];
        wb.Sheets['Sheet1'] = {
            '!cols': worksheetColumns
        };
        for (var j = 0; j < columns.length; j++) {
            worksheetColumns.push({wpx: columns[j].width});
            var currentHeader = XLSX.utils.encode_cell({c: j, r: 0});
            wb.Sheets['Sheet1'][currentHeader] = {t: "s", v: columns[j].name, s: {font: {bold: true}}};
        }
    }
    function fillRowData(wb,rowData,columns, lineNum){
        var lastCellInRaw;
        for (var i = 0; i < columns.length; i++) {
            var cellType=getCellType(columns[i]);
            var columnDataID = columns[i].data;
            var displayValue = rowData[columnDataID];
            var currentCell = XLSX.utils.encode_cell({c: i, r: lineNum});
            lastCellInRaw=currentCell;
            wb.Sheets['Sheet1'][currentCell] = {
                t: cellType,
                v: displayValue
            };
            wb.Sheets['Sheet1']['!ref']='A1:'+lastCellInRaw;
        }
    }
    function getCellType(columnData){
        if(!columnData.type) return's';
        if(columnData.type=="numeric") return'n';
        else return's';
    }
};