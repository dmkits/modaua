//module.exports.dataModels = ["dir_units"];

module.exports.modulePageURL = "/dir/units";
module.exports.modulePagePath = "dir/units.html";

var dataModel=require('../datamodel');
var dirUnits= require(appDataModelPath+"dir_units");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_units":dirUnits}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.init = function(app){



};