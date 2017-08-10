var server= require("../server"), log= server.log;

//appModulesPath
var sysadmin= require("../modules/sysadmin");//console.log("sysadmin=",sysadmin);


//module.exports.storeTableRow=function(dbQuery, outData, callback){
//
//};
//module.exports.deleteTableRow=function(dbQuery, outData, callback){
//
//};

//var dmChangeLog = require("./change_log");
//var dmUnits = require("./dir_units");
//var dmContractors = require("./dir_contractors");


function getModelChanges(){
    var modules= server.getConfigModules();
    if (!modules) return null;
    var fullChangeLog=[];
    for(var i=0; i<modules.length; i++){
        var moduleName=modules[i];                                                          //log.info('getModelChanges '+moduleName+"...");//test
        var moduleDataModels= require(appModulesPath+moduleName).dataModels;
        if (moduleDataModels) {                                                             //log.info('getModelChanges dataModels:',moduleDataModels);//test
            for(var dmi=0; dmi<moduleDataModels.length; dmi++){
                var dataModelName=moduleDataModels[dmi];
                var changeLog= require(appDataModelPath+dataModelName).changeLog;             //log.info('getModelChanges dataModelName:',dataModelName,changeLog,{});//test
                if(changeLog) fullChangeLog=fullChangeLog.concat(changeLog);
            }
        }
    }                                                                                       log.info('getModelChanges fullChangeLog=',fullChangeLog,{});//test
    return fullChangeLog;
}
module.exports.getModelChanges=getModelChanges;

//module.exports.getDBModel= getDBModel;

module.exports.init=function(app){
    //dmChangeLog.init(app);
    //dmUnits.init(app);
    //dmContractors.init(app);
};