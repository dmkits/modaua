var server= require("../server"), log= server.log;

//appModulesPath
var sysadmin= require("../modules/sysadmin");//console.log("sysadmin=",sysadmin);


//module.exports.storeTableRow=function(dbQuery, outData, callback){
//
//};
//module.exports.deleteTableRow=function(dbQuery, outData, callback){
//
//};

var dmChangeLog = require("./change_log");
var dmUnits = require("./dir_units");
var dmContractors = require("./dir_contractors");


function getModelChanges(){
    var modules= server.getConfigModules();
    if (!modules) return null;
    var result=[];
    for(var i=0; i<modules.length; i++){
        var moduleName=modules[i];                                                          log.info('getModelChanges '+moduleName+"...");//test
        var module= require(appModulesPath+moduleName);
        if (module.dataModels) {                                                            log.info('getModelChanges dataModels:',module.dataModels);//test
            //var datamodelName=
            result=result.concat(module.dataModels);
        }
    }                                                   log.info('getModelChanges result=',result);//test
    return result;



    //var outData=[];
    //var logFilesStr=fs.readFileSync('./dbConfig/dbModel.json', 'utf-8');
    //var logFilesArr = JSON.parse(util.getJSONWithoutComments(logFilesStr));
    //for (var i in logFilesArr) {
    //    var fileContentString = fs.readFileSync('./dbConfig/' + logFilesArr[i] + '.json', 'utf-8');
    //    var jsonFile=JSON.parse(util.getJSONWithoutComments(fileContentString));
    //    for (var j in jsonFile) {
    //        jsonFile[j].type = "new";
    //        jsonFile[j].message = "not applied";
    //        outData.push(jsonFile[j]);
    //    }
    //}
    //return outData;
}

getModelChanges();

//module.exports.getDBModel= getDBModel;

module.exports.init=function(app){
    //dmChangeLog.init(app);
    //dmUnits.init(app);
    //dmContractors.init(app);
};