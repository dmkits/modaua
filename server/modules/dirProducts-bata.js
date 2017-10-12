var dataModel=require('../datamodel');
var dir_products_bata= require(appDataModelPath+"dir_products-bata"),
    dir_products_barcodes= require(appDataModelPath+"dir_products_barcodes");
var dir_products_articles= require(appDataModelPath+"dir_products_articles"),
    dir_products_types= require(appDataModelPath+"dir_products_types"),
    dir_products_kinds= require(appDataModelPath+"dir_products_kinds"),
    dir_products_compositions= require(appDataModelPath+"dir_products_compositions"),
    dir_products_sizes= require(appDataModelPath+"dir_products_sizes"),
    dir_products_collections= require(appDataModelPath+"dir_products_collections");
var dir_products_genders= require(appDataModelPath+"dir_products_genders-bata"),
    dir_products_categories= require(appDataModelPath+"dir_products_categories-bata"),
    dir_products_subcategories= require(appDataModelPath+"dir_products_subcategories-bata"),
    dir_products_categories_subcategories= require(appDataModelPath+"dir_products_categories_subcats-bata");
var server= require("../server"), log= server.log;

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([dir_products_bata, dir_products_barcodes,
            dir_products_articles, dir_products_collections,
            dir_products_types,dir_products_kinds,dir_products_compositions,dir_products_sizes,
            dir_products_genders, dir_products_categories, dir_products_subcategories,
            dir_products_categories_subcategories],
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

/**
 * params.linkSource
 * params.visibleColumns = { columnsItem.data:true/false }
 */
module.exports.addProductColumnsTo= function(columnsData, ind, params){
    var result=[];
    if(!params) params={};
    if(!params.visibleColumns) params.visibleColumns={};
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(cInd==ind){
            var prodColData={ "data": "PRODUCT_CODE", "name": "Код товара", "width": 55, "type": "text", align:"center",
                visible:params.visibleColumns["CODE"],
                dataSource:"dir_products", sourceField:"CODE"};
            if(params.linkSource) prodColData.linkCondition="dir_products.ID="+params.linkSource+".PRODUCT_ID";
            result.push(prodColData);
            result.push({ "data": "PRODUCT_NAME", "name": "Наименование товара", "width": 220, "type": "text",
                visible:params.visibleColumns["NAME"],
                dataSource:"dir_products", sourceField:"NAME"});
            result.push({ "data": "PRODUCT_UM", "name": "Ед. изм.", "width": 55, "type": "text", align:"center",
                visible:params.visibleColumns["UM"],
                dataSource:"dir_products", sourceField:"UM"});
            result.push({ "data": "PRODUCT_PRINT_NAME", "name": "Печатное наименование товара", "width": 220, "type": "text",
                visible:params.visibleColumns["PRINT_NAME"],
                dataSource:"dir_products", sourceField:"PRINT_NAME"});
            result.push({ "data": "PRODUCT_PBARCODE", "name": "Осн.штрихкод", "width": 100, "type": "text", align:"center",
                visible:params.visibleColumns["PBARCODE"],
                dataSource:"dir_products", sourceField:"PBARCODE"});
        }
        result.push(columnsData[cInd]);
    }
    return result;
};
/**
 * params.linkSource
 * params.visibleColumns = { columnsItem.data:true/false }
 * params.excludeColumns = { columnsItem.data:true/false }
 */
module.exports.addProductAttrsColumnsTo= function(columnsData, ind, params){
    var result=[];
    if(!params) params={};
    if(!params.linkSource) params.linkSource="dir_products";
    if(!params.visibleColumns) params.visibleColumns={};
    if(!params.excludeColumns) params.excludeColumns={};
    var hasSource=false;
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(!columnsData) continue;
        if(columnsData.dataSource==params.linkSource){
            hasSource=true; break;
        } else if(columnsData.linkCondition&&columnsData.linkCondition.indexOf(params.linkSource+".")>=0){
            hasSource=true; break;
        }
    }
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(cInd==ind){
            if(!hasSource) result.push({dataSource:params.linkSource});
            if(!params.excludeColumns["COLLECTION_CODE"])
                result.push({"data": "PRODUCT_COLLECTION_CODE", "name": "Код коллекции товара", "width": 100, "type": "text", align:"center",
                    visible:params.visibleColumns["COLLECTION_CODE"],
                    dataSource:"dir_products_collections", sourceField:"CODE", linkCondition:"dir_products_collections.ID="+params.linkSource+".COLLECTION_ID" });
            if(!params.excludeColumns["COLLECTION"])
                result.push({"data": "PRODUCT_COLLECTION", "name": "Коллекция товара", "width": 150, "type": "text",
                    visible:params.visibleColumns["COLLECTION"],
                    dataSource:"dir_products_collections", sourceField:"NAME", linkCondition:"dir_products_collections.ID="+params.linkSource+".COLLECTION_ID" });
            if(!params.excludeColumns["ARTICLE"])
                result.push({"data": "PRODUCT_ARTICLE", "name": "Артикул товара", "width": 80, "type": "text", align:"center",
                    visible:params.visibleColumns["ARTICLE"],
                    dataSource:"dir_products_articles", sourceField:"VALUE", linkCondition:"dir_products_articles.ID="+params.linkSource+".ARTICLE_ID" });
            if(!params.excludeColumns["KIND"])
                result.push({"data": "PRODUCT_KIND", "name": "Вид товара", "width": 150, "type": "text",
                    visible:params.visibleColumns["KIND"],
                    dataSource:"dir_products_kinds", sourceField:"NAME", linkCondition:"dir_products_kinds.ID="+params.linkSource+".KIND_ID" });
            if(!params.excludeColumns["COMPOSITION"])
                result.push({"data": "PRODUCT_COMPOSITION", "name": "Состав товара", "width": 150, "type": "text",
                    visible:params.visibleColumns["COMPOSITION"],
                    dataSource:"dir_products_compositions", sourceField:"VALUE", linkCondition:"dir_products_compositions.ID="+params.linkSource+".COMPOSITION_ID" });

            //result.push({ "data": "PRODUCT_PRINT_NAME", "name": "Печатное наименование товара", "width": 220, "type": "text",
            //    visible:params.visibleColumns["PRINT_NAME"],
            //    dataSource:"dir_products", sourceField:"PRINT_NAME"});
            //result.push({ "data": "PRODUCT_PBARCODE", "name": "Осн.штрихкод", "width": 100, "type": "text", align:"center",
            //    visible:params.visibleColumns["PBARCODE"],
            //    dataSource:"dir_products", sourceField:"PBARCODE"});
        }
        result.push(columnsData[cInd]);
    }
    return result;
};
/**
 * params.linkSource
 * params.visibleColumns = { columnsItem.data:true/false }
 * params.excludeColumns = { columnsItem.data:true/false }
 * params.editableValues = true/false
 *
 */
module.exports.addProductBataAttrsColumnsTo= function(columnsData, ind, params){
    var result=[];
    if(!params) params={};
    if(!params.linkSource) params.linkSource="dir_products";
    if(!params.visibleColumns) params.visibleColumns={};
    if(!params.excludeColumns) params.excludeColumns={};
    var hasSource=false;
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(!columnsData) continue;
        if(columnsData.dataSource==params.linkSource){
            hasSource=true; break;
        } else if(columnsData.linkCondition&&columnsData.linkCondition.indexOf(params.linkSource+".")>=0){
            hasSource=true; break;
        }
    }
    var editableWidth=(params.editableValues)?15:0;
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(cInd==ind){
            if(!hasSource) result.push({dataSource:params.linkSource});
            if(!params.excludeColumns["GENDER_CODE"])
                result.push({"data": "PRODUCT_GENDER_CODE", "name": "Код группы товара", "width": 50+editableWidth, "type": "text", align:"center",
                    visible:params.visibleColumns["GENDER_CODE"],
                    dataSource:"dir_products_genders", sourceField:"CODE", linkCondition:"dir_products_genders.ID="+params.linkSource+".GENDER_ID" });
            if(!params.excludeColumns["GENDER"])
                result.push({"data": "PRODUCT_GENDER", "name": "Группа товара", "width": 130+editableWidth, "type": "text",
                    visible:params.visibleColumns["GENDER"],
                    dataSource:"dir_products_genders", sourceField:"NAME", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" });
            if(!params.excludeColumns["CATEGORY_CODE"])
                result.push({"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории товара", "width": 60+editableWidth, "type": "text", align:"center",
                    visible:params.visibleColumns["CATEGORY_CODE"],
                    dataSource:"dir_products_categories", sourceField:"CODE", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" });
            if(!params.excludeColumns["CATEGORY"])
                result.push({"data": "PRODUCT_CATEGORY", "name": "Категория товара", "width": 190+editableWidth, "type": "text",
                    visible:params.visibleColumns["CATEGORY"],
                    dataSource:"dir_products_categories", sourceField:"NAME", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" });
            if(!params.excludeColumns["SUBCATEGORY_CODE"])
                result.push({"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории товара", "width": 80+editableWidth, "type": "text", align:"center",
                    visible:params.visibleColumns["SUBCATEGORY_CODE"],
                    dataSource:"dir_products_subcategories", sourceField:"CODE", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" });
            if(!params.excludeColumns["SUBCATEGORY"])
                result.push({"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория товара", "width": 190+editableWidth, "type": "text",
                    visible:params.visibleColumns["SUBCATEGORY"],
                    dataSource:"dir_products_subcategories", sourceField:"NAME", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" });
        }
        result.push(columnsData[cInd]);
    }
    return result;
};

module.exports.modulePageURL = "/dir/products";
module.exports.modulePagePath = "dir/products-bata.html";
module.exports.init = function(app){
    var dirProductsTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "GENDER_CODE", "name": "Код группы", "width": 50,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/genderCode",
            dataSource:"dir_products_genders", sourceField:"CODE"},
        {"data": "GENDER", "name": "Группа", "width": 120,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/gender",
            dataSource:"dir_products_genders", sourceField:"NAME"},
        {"data": "CATEGORY_CODE", "name": "Код категории", "width": 60,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsCategoryCombobox/CategoryCode",
            dataSource:"dir_products_categories", sourceField:"CODE"},
        {"data": "CATEGORY", "name": "Категория", "width": 200,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsCategoryCombobox/category",
            dataSource:"dir_products_categories", sourceField:"NAME"},
        {"data": "SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 100,
            "type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/SubcategoryCode",
            dataSource:"dir_products_subcategories", sourceField:"CODE"},
        {"data": "SUBCATEGORY", "name": "Подкатегория", "width": 200,
            "type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_subcategories", sourceField:"NAME"},

        {"data": "COLLECTION", "name": "Коллекция", "width": 120,
            "type": "text",
            //"type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_collections", sourceField:"NAME"},
        {"data": "COLLECTION_CODE", "name": "Код коллекции", "width": 120, visible:false,
            "type": "text",
            //"type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_collections", sourceField:"CODE"},
        {"data": "ARTICLE", "name": "Артикул", "width": 80,
            "type": "text",
            //"type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_articles", sourceField:"VALUE"},
        {"data": "KIND", "name": "Вид", "width": 150,
            "type": "text",
            //"type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_kinds", sourceField:"NAME"},
        {"data": "COMPOSITION_ID", "name": "Состав", "width": 150,
            "type": "text",
            //"type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_compositions", sourceField:"VALUE"},
        {"data": "SIZE", "name": "Размер", "width": 50,
            "type": "text",
            //"type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_sizes", sourceField:"VALUE"},

        {"data": "CODE", "name": "Код", "width": 55, "type": "text"},
        {"data": "NAME", "name": "Наименование", "width": 220, "type": "text"},
        {"data": "PRINT_NAME", "name": "Печатное наименование", "width": 220, "type": "text", visible:false},
        {"data": "UM", "name": "Ед.изм.", "width": 55, "type": "text"},
        {"data": "PBARCODE", "name": "Штрихкод", "width": 100, "type": "text", visible:false},


    ];
    app.get("/dir/products/getDataForDirProductsTable", function(req, res){
        dir_products_bata.getDataForTable({tableColumns:dirProductsTableColumns, identifier:dirProductsTableColumns[0].data,
                conditions:req.query,
                order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    //app.get("/dir/contractors/newDataForDirContractorsTable", function(req, res){
    //    dir_products_bata.getNewDataForDirContractorsTable(function(result){
    //        res.send(result);
    //    });
    //});
    app.post("/dir/products/storeDirProductsTableData", function(req, res){
        dir_products_bata.storeTableDataItem({tableName:tableName, idFieldName:idField, storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    //app.post("/dir/contractors/deleteDirContractorsTableData", function(req, res){
    //    dir_products_bata.deleteDirContractorsTableData(req.body, function(result){
    //        res.send(result);
    //    });
    //});

    var dirProductsGendersBataTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "CODE", "name": "Код группы", "width": 65, "type": "text"},
        {"data": "NAME", "name": "Группа", "width": 200, "type": "text"},
        {"data": "CONSTANT", "name": "Постоянная группа", "width": 80, "type": "checkbox"}
    ];
    app.get("/dir/products/getDataForProductsGendersTable", function(req, res){
        dir_products_genders.getDataForTable({tableColumns:dirProductsGendersBataTableColumns,
                identifier:dirProductsGendersBataTableColumns[0].data,
                conditions:req.query, order:["CODE"]},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForProductsGendersTable", function(req, res){
        dir_products_genders.setDataItemForTable({tableColumns:dirProductsGendersBataTableColumns,
                values:[null,"","Новая группа","0"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsGendersTableData", function(req, res){
        dir_products_genders.storeTableDataItem({tableColumns:dirProductsGendersBataTableColumns,
                idFieldName:dirProductsGendersBataTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/deleteProductsGendersTableData", function(req, res){
        dir_products_genders.delTableDataItem({idFieldName:dirProductsGendersBataTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    var dirProductsCategoriesBataTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false, dataSource:"dir_products_categories"},
        {"data": "GENDER_CODE", "name": "Код группы", "width": 50,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/genderCode",
            dataSource:"dir_products_genders", sourceField:"CODE"},
        {"data": "GENDER", "name": "Группа", "width": 130,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/gender",
            dataSource:"dir_products_genders", sourceField:"NAME"},
        {"data": "CODE", "name": "Код категории", "width": 60, "type": "text", dataSource:"dir_products_categories"},
        {"data": "NAME", "name": "Категория", "width": 190, "type": "text", dataSource:"dir_products_categories"},
        {"data": "CONSTANT", "name": "Постоянная категория", "width": 90, "type": "checkbox", dataSource:"dir_products_categories"}
    ];
    app.get("/dir/products/getDataForProductsCategoriesTable", function(req, res){
        dir_products_categories.getDataForTable({tableColumns:dirProductsCategoriesBataTableColumns,
                identifier:dirProductsCategoriesBataTableColumns[0].data,
                conditions:req.query, order:["GENDER_CODE","CODE"]},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForProductsCategoriesTable", function(req, res){
        dir_products_categories.setDataItemForTable({tableColumns:dirProductsCategoriesBataTableColumns,
                values:[null,"","","","Новая категория","0"]},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsGendersCombobox/genderCode", function(req, res){
        dir_products_genders.getDataItemsForTableCombobox({comboboxFields:{"GENDER_CODE":"CODE","GENDER":"NAME"}, order:"CODE"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsGendersCombobox/gender", function(req, res){
        dir_products_genders.getDataItemsForTableCombobox({comboboxFields:{"GENDER":"NAME","GENDER_CODE":"CODE"}, order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsCategoriesTableData", function(req, res){
        var storeData=req.body;
        var findGenderCondition={"CODE=":storeData["GENDER_CODE"]};
        if(!storeData["GENDER_CODE"]) findGenderCondition={"NAME=":storeData["GENDER"]};
        dir_products_genders.getDataItem({fields:["ID"],conditions:findGenderCondition}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded gender by code or name!"});
                return;
            }
            storeData["GENDER_ID"]=result.item["ID"];
            dir_products_categories.storeTableDataItem({tableColumns:dirProductsCategoriesBataTableColumns,
                    idFieldName:dirProductsCategoriesBataTableColumns[0].data,
                    storeTableData:req.body},
                function(result){
                    res.send(result);
                });
        });
    });
    app.post("/dir/products/deleteProductsCategoriesTableData", function(req, res){
        dir_products_categories.delTableDataItem({idFieldName:dirProductsCategoriesBataTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    var dirProductsSubcategoriesBataTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false,
            dataSource:"dir_products_categories_subcategories"},
        //{"data": "GENDER_CODE", "name": "Код группы", "width": 65,
        //    "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/genderCode",
        //    dataSource:"dir_products_genders", sourceField:"CODE"},
        //{"data": "GENDER", "name": "Группа", "width": 150,
        //    "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/gender",
        //    dataSource:"dir_products_genders", sourceField:"NAME"},
        {"data": "CATEGORY_CODE", "name": "Код категории", "width": 80,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsCategoryCombobox/CategoryCode",
            dataSource:"dir_products_categories", sourceField:"CODE"},
        {"data": "CATEGORY", "name": "Категория", "width": 200,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsCategoryCombobox/category",
            dataSource:"dir_products_categories", sourceField:"NAME"},
        {"data": "SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 100,
            "type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/SubcategoryCode",
            dataSource:"dir_products_subcategories", sourceField:"CODE"},
        {"data": "SUBCATEGORY", "name": "Подкатегория", "width": 200,
            "type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_subcategories", sourceField:"NAME"},
        {"data": "SUBCATEGORY_CONSTANT", "name": "Постоянная подкатегория", "width": 100, "type": "checkbox",
            dataSource:"dir_products_subcategories", sourceField:"CONSTANT"}
    ];
    app.get("/dir/products/getDataForDirProductsSubCategoriesTable", function(req, res){
        dir_products_categories_subcategories.getDataForTable({tableColumns:dirProductsSubcategoriesBataTableColumns,
                identifier:dirProductsSubcategoriesBataTableColumns[0].data,
                conditions:req.query,
                order:["CATEGORY_CODE","SUBCATEGORY_CODE"]},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForDirProductsSubCategoriesTable", function(req, res){
        dir_products_categories_subcategories.setDataItemForTable({tableColumns:dirProductsSubcategoriesBataTableColumns,
            values:[null,"","", "","Новая подкатегория",0]},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsCategoryCombobox/CategoryCode", function(req, res){
        dir_products_categories.getDataItemsForTableCombobox({comboboxFields:{"CATEGORY_CODE":"CODE","CATEGORY":"NAME"}, order:"CODE"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsCategoryCombobox/category", function(req, res){
        dir_products_categories.getDataItemsForTableCombobox({comboboxFields:{"CATEGORY":"NAME","CATEGORY_CODE":"CODE"}, order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsSubcategoryCombobox/SubcategoryCode", function(req, res){
        dir_products_subcategories.getDataItemsForTableCombobox({comboboxFields:{"SUBCATEGORY_CODE":"CODE","SUBCATEGORY":"NAME"}, order:"CODE"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsSubcategoryCombobox/subcategory", function(req, res){
        dir_products_subcategories.getDataItemsForTableCombobox({comboboxFields:{"SUBCATEGORY":"NAME","SUBCATEGORY_CODE":"CODE"}, order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsSubCategoriesTableData", function(req, res){
        var storeData=req.body;
        var findCategoryCondition={"CODE=":storeData["CATEGORY_CODE"]};
        if(!storeData["CATEGORY_CODE"]) findCategoryCondition={"NAME=":storeData["CATEGORY"]};
        dir_products_categories.getDataItem({fields:["ID"],conditions:findCategoryCondition}, function(result){
            if(!result.item){
                res.send({ error:"Cannot finded category by code or name!"});
                return;
            }
            storeData["CATEGORY_ID"]=result.item["ID"];
            var findSubcategoryCondition={"CODE=":storeData["SUBCATEGORY_CODE"]};
            if(!storeData["SUBCATEGORY_CODE"]) findSubcategoryCondition={"NAME=":storeData["SUBCATEGORY"]};
            dir_products_subcategories.getDataItem({fields:["ID"],conditions:findSubcategoryCondition}, function(result){
                if(!result.item){
                    dir_products_subcategories.storeDataItem({idFieldName:"ID",
                            storeData:{"CODE":storeData["SUBCATEGORY_CODE"],"NAME":storeData["SUBCATEGORY"],"CONSTANT":storeData["SUBCATEGORY_CONSTANT"]}},
                        function(result){
                            if(!result.resultItem){
                                res.send({ error:"Cannot add new subcategory! Reason:"+result.error});
                                return;
                            }
                            storeData["SUBCATEGORY_ID"]=result.resultItem["ID"];
                            dir_products_categories_subcategories.storeTableDataItem({tableColumns:dirProductsSubcategoriesBataTableColumns,
                                    idFieldName:dirProductsSubcategoriesBataTableColumns[0].data,
                                    storeTableData:storeData},
                                function(result){
                                    res.send(result);
                                });
                        });
                    return;
                }
                storeData["SUBCATEGORY_ID"]=result.item["ID"];
                dir_products_categories_subcategories.storeTableDataItem({tableColumns:dirProductsSubcategoriesBataTableColumns,
                        idFieldName:dirProductsSubcategoriesBataTableColumns[0].data,
                        storeTableData:storeData},
                    function(result){
                        res.send(result);
                    });
            });
        });
    });
    app.post("/dir/products/deleteProductsSubCategoriesTableData", function(req, res){
        dir_products_subcategories.delTableDataItem({idFieldName:dirProductsSubcategoriesBataTableColumns[0].data,
            delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    app.get("/dir/products/getDataForOrderBataProductsGendersCombobox/genderCode", function(req, res){
        dir_products_genders.getDataItemsForTableCombobox({comboboxFields:{"PRODUCT_GENDER_CODE":"CODE","PRODUCT_GENDER":"NAME"}, order:"CODE"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForOrderBataProductsGendersCombobox/gender", function(req, res){
        dir_products_genders.getDataItemsForTableCombobox({comboboxFields:{"PRODUCT_GENDER":"NAME","PRODUCT_GENDER_CODE":"CODE"}, order:"NAME"},
            function(result){
                res.send(result);
            });
    });

    app.get("/dir/products/getDataForOrderBataProductsCategoryCombobox/CategoryCode", function(req, res){
        dir_products_categories.getDataItemsForTableCombobox({
                comboboxFields:{"PRODUCT_CATEGORY_CODE":"CODE","PRODUCT_CATEGORY":"NAME",
                    PRODUCT_GENDER_CODE:{source:"dir_products_genders", field:"CODE"},
                    PRODUCT_GENDER:{source:"dir_products_genders", field:"NAME"} },
                order:"PRODUCT_CATEGORY_CODE"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForOrderBataProductsCategoryCombobox/category", function(req, res){
        dir_products_categories.getDataItemsForTableCombobox({
                comboboxFields:{"PRODUCT_CATEGORY":"NAME","PRODUCT_CATEGORY_CODE":"CODE",
                    PRODUCT_GENDER_CODE:{source:"dir_products_genders", field:"CODE"},
                    PRODUCT_GENDER:{source:"dir_products_genders", field:"NAME"} },
                order:"PRODUCT_CATEGORY"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForOrderBataProductsSubcategoryCombobox/SubcategoryCode", function(req, res){
        dir_products_subcategories.getDataItemsForTableCombobox({
                comboboxFields:{"PRODUCT_SUBCATEGORY_CODE":"CODE","PRODUCT_SUBCATEGORY":"NAME"},
                order:"PRODUCT_SUBCATEGORY_CODE"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForOrderBataProductsSubcategoryCombobox/subcategory", function(req, res){
        dir_products_subcategories.getDataItemsForTableCombobox({
                comboboxFields:{"PRODUCT_SUBCATEGORY":"NAME","PRODUCT_SUBCATEGORY_CODE":"CODE"},
                order:"PRODUCT_SUBCATEGORY"},
            function(result){
                res.send(result);
            });
    });

    var dirProductsCollectionsTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "NAME", "name": "Коллекция", "width": 220, "type": "text"},
        {"data": "CODE", "name": "Код коллекции", "width": 120, "type": "text"}
    ];
    app.get("/dir/products/getDataForProductsCollectionsTable", function(req, res){
        dir_products_collections.getDataForTable({tableColumns:dirProductsCollectionsTableColumns,
                identifier:dirProductsCollectionsTableColumns[0].data,
                conditions:req.query, order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForProductsCollectionsTable", function(req, res){
        dir_products_collections.setDataItemForTable({tableColumns:dirProductsCollectionsTableColumns,
                values:[null,"Новая коллекция",""]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsCollectionsTableData", function(req, res){
        dir_products_collections.storeTableDataItem({tableColumns:dirProductsCollectionsTableColumns,
                idFieldName:dirProductsCollectionsTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/deleteProductsCollectionsTableData", function(req, res){
        dir_products_collections.delTableDataItem({idFieldName:dirProductsCollectionsTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    var dirProductsTypesTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "NAME", "name": "Тип", "width": 330, "type": "text"}
    ];
    app.get("/dir/products/getDataForProductsTypesTable", function(req, res){
        dir_products_types.getDataForTable({tableColumns:dirProductsTypesTableColumns,
                identifier:dirProductsTypesTableColumns[0].data,
                conditions:req.query, order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForProductsTypesTable", function(req, res){
        dir_products_types.setDataItemForTable({tableColumns:dirProductsTypesTableColumns,
                values:[null,"Новый тип"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsTypesTableData", function(req, res){
        dir_products_types.storeTableDataItem({tableColumns:dirProductsTypesTableColumns,
                idFieldName:dirProductsTypesTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/deleteProductsTypesTableData", function(req, res){
        dir_products_types.delTableDataItem({idFieldName:dirProductsTypesTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    var dirProductsKindsTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "NAME", "name": "Вид", "width": 330, "type": "text"}
    ];
    app.get("/dir/products/getDataForProductsKindsTable", function(req, res){
        dir_products_kinds.getDataForTable({tableColumns:dirProductsKindsTableColumns,
                identifier:dirProductsKindsTableColumns[0].data,
                conditions:req.query, order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForProductsKindsTable", function(req, res){
        dir_products_kinds.setDataItemForTable({tableColumns:dirProductsKindsTableColumns,
                values:[null,"Новый вид"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsKindsTableData", function(req, res){
        dir_products_kinds.storeTableDataItem({tableColumns:dirProductsKindsTableColumns,
                idFieldName:dirProductsKindsTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/deleteProductsKindsTableData", function(req, res){
        dir_products_kinds.delTableDataItem({idFieldName:dirProductsKindsTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDirProductsCollectionsForSelect", function (req, res) {
        dir_products_collections.getDataItemsForSelect({ valueField:"NAME",labelField:"NAME",
                order: "NAME"},
            function (result) {
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsTypesCombobox", function (req, res) {
        dir_products_types.getDataItemsForTableCombobox({ comboboxFields:{"PRODUCT_TYPE":"NAME"}, order:"PRODUCT_TYPE" },
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsKindsCombobox", function (req, res) {
        dir_products_kinds.getDataItemsForTableCombobox({ comboboxFields:{"PRODUCT_KIND":"NAME"}, order:"PRODUCT_KIND" },
            function(result){
                res.send(result);
            });
    });

    dir_products_bata.getProductBataGroupsIDs= function(params,resultCallback){
        if (!params||!params.prodData) {
            resultCallback({error: "Failed get product bata groups id's! Reason: no product bata groups data!"});
            return;
        }
        var resultData={};
        var prodGenderCode=params.prodData["GENDER_CODE"],prodGenderName=params.prodData["GENDER"];
        var findProdGenderConditions={};
        if(prodGenderCode) findProdGenderConditions["CODE="]=prodGenderCode;
        if(prodGenderName) findProdGenderConditions["NAME="]=prodGenderName;
        if(!prodGenderCode&&!prodGenderName) findProdGenderConditions["CODE is NULL"]=null;
        dir_products_genders.getDataItem({fields:["ID"],conditions:findProdGenderConditions},
            function(result) {
                if (result.error) {
                    resultCallback({error: "Failed find product gender! Reason:" + result.error});
                    return;
                }
                if (!result.item){
                    resultCallback({error: "Failed find product gender! Reason: no find result!"});
                    return;
                }
                resultData["GENDER_ID"]=result.item["ID"];
                var prodCategoryCode=params.prodData["CATEGORY_CODE"],prodCategoryName=params.prodData["CATEGORY"];
                var findProdCategoryConditions={};
                if(prodCategoryCode) findProdCategoryConditions["CODE="]=prodCategoryCode;
                if(prodCategoryName) findProdCategoryConditions["NAME="]=prodCategoryName;
                if(!prodCategoryName&&!prodCategoryName) findProdCategoryConditions["CODE is NULL"]=null;
                dir_products_categories.getDataItem({fields:["ID"],conditions:findProdCategoryConditions},
                    function(result) {
                        if (result.error) {
                            resultCallback({error: "Failed find product category! Reason:" + result.error});
                            return;
                        }
                        if (!result.item) {
                            resultCallback({error: "Failed find product category! Reason: no find result!"});
                            return;
                        }
                        resultData["CATEGORY_ID"] = result.item["ID"];
                        var prodSubcategoryCode=params.prodData["SUBCATEGORY_CODE"],prodSubcategoryName=params.prodData["SUBCATEGORY"];
                        var findProdSubcategoryConditions={};
                        if(prodSubcategoryCode) findProdSubcategoryConditions["CODE="]=prodSubcategoryCode;
                        if(prodSubcategoryName) findProdSubcategoryConditions["NAME="]=prodSubcategoryName;
                        if(!prodSubcategoryCode&&!prodSubcategoryName) findProdSubcategoryConditions["CODE is NULL"]=null;
                        dir_products_subcategories.getDataItem({fields:["ID"],conditions:findProdSubcategoryConditions},
                            function(result) {
                                if (result.error) {
                                    resultCallback({error: "Failed find product subcategory! Reason:" + result.error});
                                    return;
                                }
                                if (!result.item) {
                                    resultCallback({error: "Failed find product subcategory! Reason: no find result!"});
                                    return;
                                }
                                resultData["SUBCATEGORY_ID"] = result.item["ID"];
                                resultCallback({resultItem: resultData});
                            })
                    })
            })
    };
    dir_products_bata.findOrCreateProdAttributes= function(params,resultCallback){
        if (!params||!params.prodData) {
            resultCallback({error: "Failed find/create product attributes! Reason: no product attributes data!"});
            return;
        }
        var prodData=params.prodData, resultData={};
        dir_products_collections.getDataItem({fields:["ID"],conditions:{"NAME=":prodData["COLLECTION"]}},
            function(result) {
                if (result.error) {
                    resultCallback({error: "Failed find product collection! Reason:" + result.error});
                    return;
                }
                if (!result.item) {
                    resultCallback({error: "Failed find product collection! Reason: no result!"});
                    return;
                }
                resultData["COLLECTION_ID"]=result.item["ID"];
                //dir_products_types.getDataItem({fields:["ID"],conditions:{"NAME=":fieldsValues["PRODUCT_TYPE"]}},
                //    function(result) {
                //        if (result.error) {
                //            resultCallback({error: "Failed find product type! Reason:" + result.error});
                //            return;
                //        }
                //        if (!result.item) {
                //            resultCallback({error: "Failed find product type! Reason: no result!"});
                //            return;
                //        }
                //        fieldsValues["PRODUCT_TYPE_ID"] = result.item["ID"];
                //    });
                if (!prodData["ARTICLE"]) {
                    resultCallback({error: "Failed create product! Reason: no product article!"});
                    return;
                }
                dir_products_articles.findDataItemByOrCreateNew({resultFields:["ID"], findByFields:["VALUE"],
                        idFieldName:"ID", fieldsValues:{"VALUE":prodData["ARTICLE"]}},
                    function(result){
                        if (result.error) {
                            resultCallback({ error:"Failed find/create product article! Reason:"+result.error});
                            return;
                        }
                        if (!result.resultItem) {
                            resultCallback({ error:"Failed find/create product article! Reason: no result!"});
                            return;
                        }
                        resultData["ARTICLE_ID"]=result.resultItem["ID"];
                        dir_products_kinds.findDataItemByOrCreateNew({resultFields:["ID"], findByFields:["NAME"],
                                idFieldName:"ID", fieldsValues:{"NAME":prodData["KIND"]}},
                            function(result){
                                if (result.error) {
                                    resultCallback({ error:"Failed find/create product kind! Reason:"+result.error});
                                    return;
                                }
                                if (!result.resultItem) {
                                    resultCallback({ error:"Failed find/create product kind! Reason: no result!"});
                                    return;
                                }
                                resultData["KIND_ID"]=result.resultItem["ID"];
                                dir_products_compositions.findDataItemByOrCreateNew({resultFields:["ID"],
                                        findByFields:["VALUE"],
                                        idFieldName:"ID", fieldsValues:{"VALUE":prodData["COMPOSITION"]}},
                                    function(result){
                                        if (result.error) {
                                            resultCallback({ error:"Failed find/create product composition! Reason:"+result.error});
                                            return;
                                        }
                                        if (!result.resultItem) {
                                            resultCallback({ error:"Failed find/create product composition! Reason: no result!"});
                                            return;
                                        }
                                        resultData["COMPOSITION_ID"]=result.resultItem["ID"];
                                        dir_products_sizes.findDataItemByOrCreateNew({resultFields:["ID"],
                                                findByFields:["VALUE"],
                                                idFieldName:"ID", fieldsValues:{"VALUE":prodData["SIZE"]}},
                                            function(result){
                                                if (result.error) {
                                                    resultCallback({ error:"Failed find/create product size! Reason:"+result.error});
                                                    return;
                                                }
                                                if (!result.resultItem) {
                                                    resultCallback({ error:"Failed find/create product size! Reason: no result!"});
                                                    return;
                                                }
                                                resultData["SIZE_ID"]=result.resultItem["ID"];
                                                resultCallback({resultItem:resultData});
                                            });
                                    });
                            });
                    });
            });
    };
    dir_products_bata.findDataItemByOrCreateNew= function(params,resultCallback){
        if (!params) {                                                                                      log.error("FAILED dir_products_bata.findDataItemByOrCreateNew! Reason: no parameters!");//test
            resultCallback({ error:"Failed find/create product! Reason:no function parameters!"});
            return;
        }
        if (!params.resultFields||!params.resultFields.length) {                                            log.error("FAILED dir_products_bata.findDataItemByOrCreateNew! Reason: no result fields!");//test
            resultCallback({ error:"Failed find/create product! Reason:no result fields!"});
            return;
        }
        if (!params.idFieldName) {                                                                          log.error("FAILED dir_products_bata.findDataItemByOrCreateNew! Reason: no id field!");//test
            resultCallback({ error:"Failed find/create product! Reason:no id field!"});
            return;
        }
        if (!params.fieldsValues) {                                                                         log.error("FAILED dir_products_bata.findDataItemByOrCreateNew! Reason: no new data!");//test
            resultCallback({ error:"Failed find/create product! Reason:no new data!"});
            return;
        }
        var thisInstance=this, fieldsValues=params.fieldsValues, insProdData={};
        var findCondition;
        for(var ind=0;ind<params.findByFields.length;ind++) {
            var fieldName=params.findByFields[ind];
            if(!findCondition)findCondition={};
            findCondition[fieldName+"="]=params.fieldsValues[fieldName];
        }
        if(!findCondition) findCondition={"1=0":null};
        this.getDataItem({fields:params.resultFields,conditions:findCondition},
            function(result) {
                if (result.error) {
                    resultCallback({ error:"Failed find product! Reason:"+result.error});
                    return;
                }
                if (result.item) {
                    resultCallback({ resultItem:result.item});
                    return;
                }
                insProdData["NAME"]=fieldsValues["NAME"];
                if(fieldsValues["CODE"])insProdData["CODE"]=fieldsValues["CODE"];
                if(fieldsValues["UM"])insProdData["UM"]=fieldsValues["UM"];
                if(fieldsValues["PBARCODE"])insProdData["PBARCODE"]=fieldsValues["PBARCODE"];
                dir_products_bata.findOrCreateProdAttributes({prodData:fieldsValues},
                    function(result){
                        if (result.error) {
                            resultCallback({ error:"Failed find/create product! Reason:"+result.error});
                            return;
                        }
                        for(var resultItemName in result.resultItem) insProdData[resultItemName]=result.resultItem[resultItemName];
                        thisInstance.getProductBataGroupsIDs({prodData:fieldsValues},
                            function(result){
                                if (result.error) {
                                    resultCallback({ error:"Failed find/create product! Reason:"+result.error});
                                    return;
                                }
                                for(var resultItemName in result.resultItem) insProdData[resultItemName]=result.resultItem[resultItemName];
                                thisInstance.getDataItem({fields:["MAXCODE"],fieldsFunctions:{"MAXCODE":{function:"maxPlus1", sourceField:"CODE"}},
                                        conditions:{"1=1":null}},
                                    function(result) {
                                        var newCode = (result && result.item) ? result.item["MAXCODE"] : "";
                                        insProdData["CODE"]=newCode;
                                        var barcode=Math.pow(10,10)*23+newCode;
                                        insProdData["PBARCODE"]=barcode;
                                        thisInstance.insDataItemWithNewID({idFieldName:params.idFieldName,insData:insProdData},
                                            function(result){
                                                var resultFindCreateProduct={};
                                                resultFindCreateProduct.resultItem=fieldsValues;
                                                if(result.error) resultFindCreateProduct.error=result.error;
                                                if(result.resultItem&&!result.error) {
                                                    var insProdID=result.resultItem["ID"],insProdBarcode=result.resultItem["PBARCODE"];
                                                    resultFindCreateProduct.resultItem["ID"]=insProdID;
                                                    resultFindCreateProduct.resultItem["CODE"]=result.resultItem["CODE"];
                                                    resultFindCreateProduct.resultItem["NAME"]=result.resultItem["CODE"];
                                                    resultFindCreateProduct.resultItem["PRINT_NAME"]=result.resultItem["PRINT_NAME"];
                                                    resultFindCreateProduct.resultItem["UM"]=result.resultItem["UM"];
                                                    resultFindCreateProduct.resultItem["PBARCODE"]=result.resultItem["PBARCODE"];
                                                    dir_products_barcodes.insDataItem({insData:{"PRODUCT_ID":insProdID,"BARCODE":insProdBarcode}},
                                                        function(result){
                                                            if(result.error) resultFindCreateProduct.error=result.error;
                                                            resultCallback(resultFindCreateProduct);
                                                        });
                                                    return;
                                                }
                                                resultCallback(resultFindCreateProduct);
                                            });
                                    });
                            });
                    });
            });
    }
};
