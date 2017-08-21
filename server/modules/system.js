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
        sysCurrency.getDataItemsForSelect({ addFields:[{}],
                valueField:"CODE",labelField:"NAME", order: "CODE" },
            function (result) {
                res.send(result);
            });
    });
}