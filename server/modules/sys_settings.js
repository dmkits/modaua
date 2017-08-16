var dataModel=require('../datamodel');
var sysDocStates= require(appDataModelPath+"sys_docstates");
var sysCurrency= require(appDataModelPath+"sys_currency");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"sys_docstates":sysDocStates,"sys_currency":sysCurrency},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/sys/docStates";
module.exports.modulePagePath = "sys/docStates.html";
module.exports.init = function(app){
    app.get("/wrh/orderBata/getDataForDirProductsTable", function(req, res){
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