var dataModel=require('../datamodel');
var sysCurrency= require(appDataModelPath+"sys_currency"),
    sysDocStates= require(appDataModelPath+"sys_docstates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"sys_currency":sysCurrency,"sys_docstates":sysDocStates}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.init = function(app) {
    app.get("/sys/currency/getCurrencyForSelect", function (req, res) {
        sysCurrency.getDataItemsForSelect({ valueField:"CODE",labelField:"CODENAME", order: "CODE",
                fieldsFunctions:{ "CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"] } } },
            function (result) {
                res.send(result);
            });
    });
}