


//module.exports.storeTableRow=function(dbQuery, outData, callback){
//
//};
//module.exports.deleteTableRow=function(dbQuery, outData, callback){
//
//};

var dmChangeLog = require("./change_log");
var dmUnits = require("./dir_units");
var dmContractors = require("./dir_contractors");

module.exports.init=function(app){
    dmChangeLog.init(app);
    dmUnits.init(app);
    dmContractors.init(app);
};