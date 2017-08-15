var dataModel=require('../datamodel');
var dirProducts= require(appDataModelPath+"dir_products");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_products":dirProducts}, errs,
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