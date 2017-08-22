var dataModel=require('../datamodel');
var dirProducts= require(appDataModelPath+"dir_products-bata");
var dirProductsArticles= require(appDataModelPath+"dir_products_articles");
var dirProductsKinds= require(appDataModelPath+"dir_products_kinds");
var dirProductsCompositions= require(appDataModelPath+"dir_products_compositions");
var dirProductsSizes= require(appDataModelPath+"dir_products_sizes");
var dirProductsCollections= require(appDataModelPath+"dir_products_collections");
//var dirProductsBarcodes= require(appDataModelPath+"dir_products_barcodes");

var dirProductsGendersBata= require(appDataModelPath+"dir_products_genders-bata");
var dirProductsCategoriesBata= require(appDataModelPath+"dir_products_categories-bata");
var dirProductsCategoriesVBata= require(appDataModelPath+"dir_products_categories_view-bata");
var dirProductsSubCategoriesBata= require(appDataModelPath+"dir_products_subcategories-bata");
var dirProductsCategoriesSubCatsBata= require(appDataModelPath+"dir_products_categories_subcats-bata");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_products-bata":dirProducts,
            "dir_products_articles":dirProductsArticles,
            "dir_products_kinds":dirProductsKinds,
            "dir_products_compositions":dirProductsCompositions,
            "dir_products_sizes":dirProductsSizes,
            "dir_products_collections":dirProductsCollections,
            "dir_products_genders-bata":dirProductsGendersBata,
            "dir_products_categories-bata":dirProductsCategoriesBata, //"dir_products_categories_view-bata":dirProductsCategoriesVBata,
            "dir_products_subcategories-bata":dirProductsSubCategoriesBata,
            "dir_products_categories_subcategories-bata":dirProductsCategoriesSubCatsBata},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/products";
module.exports.modulePagePath = "dir/products-bata.html";
module.exports.init = function(app){
    app.get("/dir/products/getDataForDirProductsTable", function(req, res){
        dirProducts.getDataForDirProductsTable(req.query, function(result){
            res.send(result);
        });
    });
    //app.get("/dir/contractors/newDataForDirContractorsTable", function(req, res){
    //    dirProducts.getNewDataForDirContractorsTable(function(result){
    //        res.send(result);
    //    });
    //});
    app.post("/dir/products/storeDirProductsTableData", function(req, res){
        dirProducts.updDirProductsTableData(req.body, function(result){
            res.send(result);
        });
    });
    //app.post("/dir/contractors/deleteDirContractorsTableData", function(req, res){
    //    dirProducts.deleteDirContractorsTableData(req.body, function(result){
    //        res.send(result);
    //    });
    //});

    var dirProductsGendersBataTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "CODE", "name": "Код группы", "width": 90, "type": "text"},
        {"data": "NAME", "name": "Наименование группы", "width": 200, "type": "text"},
        {"data": "CONSTANT", "name": "Постоянная группа", "width": 130, "type": "checkbox"}
    ];
    app.get("/dir/products/getDataForDirProductsGendersTable", function(req, res){
        dirProductsGendersBata.getDataForTable({tableColumns:dirProductsGendersBataTableColumns,
                identifier:dirProductsGendersBataTableColumns[0].data,
                conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForDirProductsGendersTable", function(req, res){
        dirProductsGendersBata.setDataItemForTable({tableColumns:dirProductsGendersBataTableColumns,
                values:[null,"","Новая группа","0"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsGendersTableData", function(req, res){
        dirProductsGendersBata.storeTableDataItem({idFieldName:dirProductsGendersBataTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/deleteProductsGendersTableData", function(req, res){
        dirProductsGendersBata.delTableDataItem({idFieldName:dirProductsGendersBataTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    var dirProductsCategoriesBataTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "GENDER_CODE", "name": "Код группы", "width": 90, "type": "combobox"},
        {"data": "GENDER_NAME", "name": "Наименование группы", "width": 200, "type": "combobox"},
        {"data": "CODE", "name": "Код категории", "width": 100, "type": "text"},
        {"data": "NAME", "name": "Наименование категории", "width": 200, "type": "text"},
        {"data": "CONSTANT", "name": "Постоянная категория", "width": 150, "type": "checkbox"}
    ];
    app.get("/dir/products/getDataForDirProductsCategoriesTable", function(req, res){
        dirProductsCategoriesVBata.getDataForDirProductsCategoriesTable(req.query, function(result){
            res.send(result);
        });
    });
    app.get("/dir/products/newDataForDirProductsCategoriesTable", function(req, res){
        dirProductsCategoriesBata.setDataItemForTable({tableColumns:dirProductsCategoriesBataTableColumns,
                values:[null,"","","","Новая категория","0"]},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsGendersCombobox/genderCode", function(req, res){
        dirProductsGendersBata.getDataItems({tableFields:["CODE as GENDER_CODE"], order:"CODE"},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/getDataForProductsGendersCombobox/gender", function(req, res){
        dirProductsGendersBata.getDataItems({tableFields:["NAME as GENDER"], order:"NAME"},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsCategoriesTableData", function(req, res){
        dirProductsCategoriesBata.storeTableDataItem({idFieldName:dirProductsCategoriesBataTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/deleteProductsCategoriesTableData", function(req, res){
        dirProductsCategoriesBata.delTableDataItem({idFieldName:dirProductsCategoriesBataTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    var dirProductsSubcategoriesBataTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "CATEGORY_CODE", "name": "Код категории", "width": 100, "type": "text"},
        {"data": "CATEGORY_NAME", "name": "Наименование категории", "width": 200, "type": "text"},
        {"data": "CATEGORY_CONSTANT", "name": "Постоянная категория", "width": 150, "type": "checkbox"},
        {"data": "SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 120, "type": "text"},
        {"data": "SUBCATEGORY_NAME", "name": "Наименование подкатегории", "width": 200, "type": "text"},
        {"data": "SUBCATEGORY_CONSTANT", "name": "Постоянная подкатегория", "width": 160, "type": "checkbox"}
    ];
    app.get("/dir/products/getDataForDirProductsSubCategoriesTable", function(req, res){
        dirProductsSubCategoriesBata.getDataForTable({tableColumns:dirProductsSubcategoriesBataTableColumns,
                identifier:dirProductsSubcategoriesBataTableColumns[0].data,
                conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/products/newDataForDirProductsSubCategoriesTable", function(req, res){
        dirProductsSubCategoriesBata.setDataItemForTable({tableColumns:dirProductsSubcategoriesBataTableColumns,
            values:[null,"Новое подразделение","Новое подразделение","Новое подразделение","Днепр","-","0"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeProductsSubCategoriesTableData", function(req, res){
        dirProductsSubCategoriesBata.storeTableDataItem({idFieldName:dirProductsSubcategoriesBataTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/deleteProductsSubCategoriesTableData", function(req, res){
        dirProductsSubCategoriesBata.delTableDataItem({idFieldName:dirProductsSubcategoriesBataTableColumns[0].data,
            delTableData:req.body},
            function(result){
                res.send(result);
            });
    });
};