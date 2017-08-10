
var server= require("../server"), log= server.log, database= require("../database");

var validateError= null;
module.exports.getValidateError= function(){ return validateError; };

/**
 * callback = function(err), err - validate error
 */
module.exports.validate= function(callback){

    var modules= server.getConfigModules();
    if (!modules) return;
    var modulesDataModels= [];
    for(var i=0; i<modules.length; i++){
        var moduleName=modules[i];                                                          log.info('validate module '+moduleName+"...");//test
        var moduleDataModels= require(appModulesPath+moduleName).dataModels;
        if (!moduleDataModels) continue;
        for(var dmi=0; dmi<moduleDataModels.length; dmi++){
            var dataModelName= moduleDataModels[dmi];
            var dataModelValidateQuery= require(appDataModelPath+dataModelName).validateQuery;
            if (!dataModelValidateQuery) {
                validateError="Failed validate module "+moduleName+" data model:"+dataModelName+" Reason: no validate query!";
                callback(validateError);                                                    log.info('FAILED! Reason:no validate query!');//test
                return;
            }
            modulesDataModels.push({moduleName:moduleName, dataModelName:dataModelName, validateQuery:dataModelValidateQuery});
        }
    }

    var validateDataModel= function(modulesDataModels, index){
        var item= modulesDataModels[index];
        if (!item) {
            callback();
            return;
        }                                                                                   log.info('validateDataModel: module:'+item.moduleName+" data model:"+item.dataModelName+" query:"+item.validateQuery);//test
        database.selectQuery(item.validateQuery,function(err){
            if(err){
                validateError="Failed validate module "+item.moduleName+" data model:"+item.dataModelName+" Reason: "+err.message+"!";
                callback(validateError);                                                    log.info('FAILED! Reason:'+err.message);//test
                return;
            };
            validateDataModel(modulesDataModels, index+1);
        });
    };
    validateDataModel(modulesDataModels, 0);
};

module.exports.init = function(app){
    var modules= server.getConfigModules();
    if (!modules) return;
    for(var i=0; i<modules.length; i++){
        var module=modules[i];                                                          log.info('initing module '+module+"...");//test
        require("./"+module).init(app);
    }
};

