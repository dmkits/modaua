var dataModel=require('../datamodel');
var dirContractors= require(appDataModelPath+"dir_contractors");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_contractors":dirContractors}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/contractors";
module.exports.modulePagePath = "dir/contractors.html";
module.exports.init = function(app){
    app.get("/dir/contractors/getDataForDirContractorsTable", function(req, res){
        dirContractors.getDataForDirContractorsTable(req.query, function(result){
            res.send(result);
        });
    });
    app.get("/dir/contractors/newDataForDirContractorsTable", function(req, res){
        dirContractors.getNewDataForDirContractorsTable(function(result){
            res.send(result);
        });
    });
    app.post("/dir/contractors/storeDirContractorsTableData", function(req, res){
        dirContractors.storeDirContractorsTableData(req.body, function(result){
            res.send(result);
        });
    });
    app.post("/dir/contractors/deleteDirContractorsTableData", function(req, res){
        dirContractors.deleteDirContractorsTableData(req.body, function(result){
            res.send(result);
        });
    });
};