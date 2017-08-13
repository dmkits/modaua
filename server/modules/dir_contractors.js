module.exports.dataModels1 = ["dir_contractors"];

module.exports.modulePageURL = "/dir/contractors";
module.exports.modulePagePath = "dir/contractors.html";

var dataModel=require('../datamodel');
var dirContractors= require(appDataModelPath+"dir_contractors");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_contractors":dirContractors}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.init = function(app){

};