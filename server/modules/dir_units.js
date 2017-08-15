
var dataModel=require('../datamodel');
var dirUnits= require(appDataModelPath+"dir_units");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_units":dirUnits}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/units";
module.exports.modulePagePath = "dir/units.html";
module.exports.init = function(app){

    app.get("/dir/units/getDataForDirUnitsTable", function(req, res){
        dirUnits.getDataForDirUnitsTable(req.query, function(result){
            res.send(result);
        });
    });
    app.get("/dir/units/newDataForDirUnitsTable", function(req, res){
        dirUnits.getNewDataForDirUnitsTable(function(result){
            res.send(result);
        });
    });
    app.post("/dir/units/storeDirUnitsTableData", function(req, res){
        dirUnits.storeDirUnitsTableData(function(result){
            res.send(result);
        });
    });
    app.post("/dir/units/deleteDirUnitsTableData", function(req, res){
        dirUnits.deleteDirUnitsTableData(function(result){
            res.send(result);
        });
    });
};