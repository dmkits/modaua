var server= require("../server"), log= server.log;

var dataModelChanges= [];
module.exports.getModelChanges=function(){ console.log("getModelChanges:"+dataModelChanges); return dataModelChanges; };

var database= require("../database");
function initValidateDataModel(dataModelName, dataModel, errs, nextValidateDataModelCallback){          log.info('initValidateDataModel: dataModel:',dataModelName,"...");//test
    if(dataModel.changeLog) dataModelChanges= dataModelChanges.concat(dataModel.changeLog);

    dataModel.getDataForTable= _getDataForTable;

    if(!dataModel.validateData) {
        errs[dataModelName+"_validateError"]="Failed validate dataModel:"+dataModelName+"! Reason: data model no validate data!";
    }
    var queryFields="";
    for(var i in dataModel.validateData.tableColumns) {
        if (queryFields!="") queryFields+= ",";
        queryFields+= dataModel.validateData.tableColumns[i].data;
    }
    var query="select "+queryFields+" from "+dataModel.validateData.tableName+" where "+dataModel.validateData.idField+" is NULL";
    database.selectQuery(query,function(err){
        if(err) errs[dataModelName+"_validateError"]="Failed validate dataModel:"+dataModelName+"! Reason:"+err.message;
        nextValidateDataModelCallback();
    });
};

module.exports.initValidateDataModels=function(dataModels, errs, resultCallback){
    var dataModelsList=[];
    for(var dataModelName in dataModels) dataModelsList.push({name:dataModelName, dataModel:dataModels[dataModelName]});

    var validateDataModelCallback= function(dataModelsList, index, errs){
        var dataModelListItem= dataModelsList[index];
        if (!dataModelListItem) {
            resultCallback(errs);
            return;
        }
        var dataModelName= dataModelListItem.name, dataModel=dataModelListItem.dataModel;
        initValidateDataModel(dataModelName, dataModel, errs, function(){
            validateDataModelCallback(dataModelsList, index+1, errs);
        });
    };
    validateDataModelCallback(dataModelsList, 0, errs);
};

/**
 * params = (tableName, tableColumns, identifier, conditions)
 * resultCallback = function(tableData)
 */
function _getDataForTable(params, resultCallback){
    var tableData={ columns:params.tableColumns, identifier:params.identifier};
    var queryFields="";
    for(var i in params.tableColumns) {
        if (queryFields!="") queryFields+= ",";
        queryFields+= params.tableColumns[i].data;
    }
    var selectQuery="select "+queryFields+" from "+params.tableName;
    if (params.conditions) {
        var conditionQuery;
        for(var conditionItem in params.conditions) conditionQuery= (!conditionQuery)?params.conditions[conditionItem]:" and "+params.conditions[conditionItem];
        selectQuery+=" where "+conditionQuery;
    }
    database.selectQuery(selectQuery,function(err, recordset, count, fields){
        //if(err) errs[dataModelName+"_validateError"]="Failed validate dataModel:"+dataModelName+"! Reason:"+err.message;
        tableData.items= recordset;
        resultCallback(tableData);
    });
};