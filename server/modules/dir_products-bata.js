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
            "dir_products_kinds":dirProductsKinds, "dir_products_compositions":dirProductsCompositions, "dir_products_sizes":dirProductsSizes,
            "dir_products_collections":dirProductsCollections,
            "dir_products_genders-bata":dirProductsGendersBata,
            "dir_products_categories-bata":dirProductsCategoriesBata, "dir_products_categories_view-bata":dirProductsCategoriesVBata,
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

    app.get("/dir/products/getDataForDirProductsGendersTable", function(req, res){
        dirProductsGendersBata.getDataForDirProductsGendersTable(req.query, function(result){
            res.send(result);
        });
    });
    app.get("/dir/products/newDataForDirProductsGendersTable", function(req, res){
        dirProductsGendersBata.getNewDataForProductsGendersTable(function(result){
            res.send(result);
        });
    });
    app.post("/dir/products/storeProductsGendersTableData", function(req, res){
        dirProductsGendersBata.storeProductsGendersTableData(req.body, function(result){
            res.send(result);
        });
    });
    app.post("/dir/products/deleteProductsGendersTableData", function(req, res){
        dirProductsGendersBata.deleteProductsGendersTableData(req.body, function(result){
            res.send(result);
        });
    });

    app.get("/dir/products/getDataForDirProductsCategoriesTable", function(req, res){
        dirProductsCategoriesVBata.getDataForDirProductsCategoriesTable(req.query, function(result){
            res.send(result);
        });
    });
    app.get("/dir/products/newDataForDirProductsCategoriesTable", function(req, res){
        dirProductsCategoriesBata.getNewDataForProductsCategoriesTable(function(result){
            res.send(result);
        });
    });
    app.post("/dir/products/storeProductsCategoriesTableData", function(req, res){
        dirProductsCategoriesBata.storeProductsCategoriesTableData(req.body, function(result){
            res.send(result);
        });
    });
    app.post("/dir/products/deleteProductsCategoriesTableData", function(req, res){
        dirProductsCategoriesBata.deleteProductsCategoriesTableData(req.body, function(result){
            res.send(result);
        });
    });

    app.get("/dir/products/getDataForDirProductsSubCategoriesTable", function(req, res){
        dirProductsSubCategoriesBata.getDataForDirProductsSubCategoriesTable(req.query, function(result){
            res.send(result);
        });
    });
    app.get("/dir/products/newDataForDirProductsSubCategoriesTable", function(req, res){
        dirProductsSubCategoriesBata.getNewDataForProductsSubCategoriesTable(function(result){
            res.send(result);
        });
    });
    app.post("/dir/products/storeProductsSubCategoriesTableData", function(req, res){
        dirProductsSubCategoriesBata.storeProductsSubCategoriesTableData(req.body, function(result){
            res.send(result);
        });
    });
    app.post("/dir/products/deleteProductsSubCategoriesTableData", function(req, res){
        dirProductsSubCategoriesBata.deleteProductsSubCategoriesTableData(req.body, function(result){
            res.send(result);
        });
    });
};