


//module.exports.storeTableRow=function(dbQuery, outData, callback){
//
//};
//module.exports.deleteTableRow=function(dbQuery, outData, callback){
//
//};

var dmChangeLog = require("./change_log");
var dmUnits = require("./dir_units");
var dmContractors = require("./dir_contractors");


function getDBModel(){
    var outData=[];
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
    return outData;
}
module.exports.getDBModel= getDBModel;

module.exports.init=function(app){
    //dmChangeLog.init(app);
    //dmUnits.init(app);
    //dmContractors.init(app);
};