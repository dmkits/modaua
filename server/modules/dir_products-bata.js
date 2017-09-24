var dataModel=require('../datamodel');
var dir_products= require(appDataModelPath+"dir_products-bata");
var dir_products_barcodes= require(appDataModelPath+"dir_products_barcodes");
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

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_products-bata":dir_products,
            "dir_products_barcodes":dir_products_barcodes,
            "dir_products_articles":dir_products_articles,
            "dir_products_types":dir_products_types,
            "dir_products_kinds":dir_products_kinds,
            "dir_products_compositions":dir_products_compositions,
            "dir_products_sizes":dir_products_sizes,
            "dir_products_collections":dir_products_collections,
            "dir_products_genders-bata":dir_products_genders,
            "dir_products_categories-bata":dir_products_categories,
            "dir_products_subcategories-bata":dir_products_subcategories,
            "dir_products_categories_subcategories-bata":dir_products_categories_subcategories},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/products";
module.exports.modulePagePath = "dir/products-bata.html";
module.exports.init = function(app){
    var dirProductsTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "CODE", "name": "Код", "width": 100, "type": "text"},
        {"data": "NAME", "name": "Наименование", "width": 200, "type": "text"},
        {"data": "PRINT_NAME", "name": "Печатное наименование", "width": 200, "type": "text"},
        {"data": "UM", "name": "Ед.изм.", "width": 80, "type": "text"},
        {"data": "PBARCODE", "name": "Штрихкод", "width": 120, "type": "text"},
        {"data": "ARTICLE_ID", "name": "ARTICLE_ID", "width": 80, "type": "text"},
        {"data": "KIND_ID", "name": "KIND_ID", "width": 80, "type": "text"},
        {"data": "COMPOSITION_ID", "name": "COMPOSITION_ID", "width": 80, "type": "text"},
        {"data": "SIZE_ID", "name": "SIZE_ID", "width": 80, "type": "text"},
        {"data": "COLLECTION_ID", "name": "COLLECTION_ID", "width": 80, "type": "text"}
    ];
    app.get("/dir/products/getDataForDirProductsTable", function(req, res){
        dir_products.getDataForTable({tableColumns:dirProductsTableColumns, identifier:dirProductsTableColumns[0].data,
                conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    //app.get("/dir/contractors/newDataForDirContractorsTable", function(req, res){
    //    dir_products.getNewDataForDirContractorsTable(function(result){
    //        res.send(result);
    //    });
    //});
    app.post("/dir/products/storeDirProductsTableData", function(req, res){
        dir_products.storeTableDataItem({tableName:tableName, idFieldName:idField, storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    //app.post("/dir/contractors/deleteDirContractorsTableData", function(req, res){
    //    dir_products.deleteDirContractorsTableData(req.body, function(result){
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
                conditions:req.query, order:"CODE"},
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
        {"data": "GENDER_CODE", "name": "Код группы", "width": 65,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/genderCode",
            dataSource:"dir_products_genders", dataField:"CODE"},
        {"data": "GENDER", "name": "Группа", "width": 150,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/gender",
            dataSource:"dir_products_genders", dataField:"NAME"},
        {"data": "CODE", "name": "Код категории", "width": 80, "type": "text", dataSource:"dir_products_categories"},
        {"data": "NAME", "name": "Категория", "width": 200, "type": "text", dataSource:"dir_products_categories"},
        {"data": "CONSTANT", "name": "Постоянная категория", "width": 90, "type": "checkbox", dataSource:"dir_products_categories"}
    ];
    app.get("/dir/products/getDataForProductsCategoriesTable", function(req, res){
        dir_products_categories.getDataForTable({tableColumns:dirProductsCategoriesBataTableColumns,
                identifier:dirProductsCategoriesBataTableColumns[0].data,
                conditions:req.query, order:"dir_products_categories.CODE"},
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
        //    dataSource:"dir_products_genders", dataField:"CODE"},
        //{"data": "GENDER", "name": "Группа", "width": 150,
        //    "type": "combobox", "sourceURL":"/dir/products/getDataForProductsGendersCombobox/gender",
        //    dataSource:"dir_products_genders", dataField:"NAME"},
        {"data": "CATEGORY_CODE", "name": "Код категории", "width": 80,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsCategoryCombobox/CategoryCode",
            dataSource:"dir_products_categories", dataField:"CODE"},
        {"data": "CATEGORY", "name": "Категория", "width": 200,
            "type": "combobox", "sourceURL":"/dir/products/getDataForProductsCategoryCombobox/category",
            dataSource:"dir_products_categories", dataField:"NAME"},
        {"data": "SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 100,
            "type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/SubcategoryCode",
            dataSource:"dir_products_subcategories", dataField:"CODE"},
        {"data": "SUBCATEGORY", "name": "Подкатегория", "width": 200,
            "type": "comboboxWN", "sourceURL":"/dir/products/getDataForProductsSubcategoryCombobox/subcategory",
            dataSource:"dir_products_subcategories", dataField:"NAME"},
        {"data": "SUBCATEGORY_CONSTANT", "name": "Постоянная подкатегория", "width": 100, "type": "checkbox",
            dataSource:"dir_products_subcategories", dataField:"CONSTANT"}
    ];
    app.get("/dir/products/getDataForDirProductsSubCategoriesTable", function(req, res){
        dir_products_categories_subcategories.getDataForTable({tableColumns:dirProductsSubcategoriesBataTableColumns,
                identifier:dirProductsSubcategoriesBataTableColumns[0].data,
                conditions:req.query},
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
                values:[null,"","Новая коллекция"]},
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
        {"data": "NAME", "name": "Тип", "width": 330, "type": "text"}
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
};