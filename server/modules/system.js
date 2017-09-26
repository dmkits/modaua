var dataModel=require('../datamodel');
var sys_currency= require(appDataModelPath+"sys_currency"),
    sys_docstates= require(appDataModelPath+"sys_docstates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([sys_currency,sys_docstates], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.init = function(app) {
    app.get("/sys/currency/getCurrencyForSelect", function (req, res) {
        sys_currency.getDataItemsForSelect({ valueField:"CODE",labelField:"CODENAME", order: "CODE",
                fieldsFunctions:{ "CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"] } } },
            function (result) {
                res.send(result);
            });
    });
};