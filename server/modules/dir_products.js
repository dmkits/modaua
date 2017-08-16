var dataModel=require('../datamodel');
var dirProducts= require(appDataModelPath+"dir_products");
var dirProductsArticles= require(appDataModelPath+"dir_products_articles");
var dirProductsKinds= require(appDataModelPath+"dir_products_kinds");
var dirProductsCompositions= require(appDataModelPath+"dir_products_compositions");
var dirProductsSizes= require(appDataModelPath+"dir_products_sizes");
var dirProductsCollections= require(appDataModelPath+"dir_products_collections");
//var dirProductsBarcodes= require(appDataModelPath+"dir_products_barcodes");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_products":dirProducts,
            "dir_products_articles":dirProductsArticles,
            "dir_products_kinds":dirProductsKinds, "dir_products_compositions":dirProductsCompositions, "dir_products_sizes":dirProductsSizes,
            "dir_products_collections":dirProductsCollections},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/products";
module.exports.modulePagePath = "dir/products.html";
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
};