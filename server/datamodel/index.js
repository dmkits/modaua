var server= require("../server"), log= server.log;

var dataModelChanges= [];
module.exports.getModelChanges=function(){ return dataModelChanges; };
module.exports.resetModelChanges=function(){ dataModelChanges=[]; };

var database= require("../database");
function initValidateDataModel(dataModelName, dataModel, errs, nextValidateDataModelCallback){          log.info('initValidateDataModel: dataModel:',dataModelName,"...");//test
    if(dataModel.changeLog) dataModelChanges= dataModelChanges.concat(dataModel.changeLog);

    dataModel.getDataForTable= _getDataForTable;
    dataModel.setDataItemForTable= _setDataItemForTable;
    dataModel.getDataItem= _getDataItem;
    dataModel.insDataItem= _insDataItem;

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
 * params = (tableName,
 *      tableColumns = [{data:<tableFieldName>},{data:<tableFieldName>},{data:<tableFieldName>},...],
 *      identifier= <tableIDFieldName>,
 *      conditions={ conditionName:<condition> } )
 * resultCallback = function(
 *      tableData = { columns:tableColumns, identifier:identifier,
 *      items:[ {<tableFieldName>:<value>,...}, {}, {}, ...],
 *      error:errorMessage } )
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
        if(err) tableData.error="Failed get data for table! Reason:"+err.message;
        tableData.items= recordset;
        resultCallback(tableData);
    });
};

/**
 * params = (
 *      tableColumns = [{data:<tableField1Name>},{data:<tableField2Name>},{data:<tableField3Name>},...],
 *      values=[ <valueField1>,<valueField2>,<valueField3>,...]
 * resultCallback = function(
 *      itemData = { item:{<tableFieldName>:<value>,...} } )
 */
function _setDataItemForTable(params, resultCallback){
    var itemData={};
    for(var columnIndex=0; columnIndex<params.tableColumns.length; columnIndex++){
        var fieldName= params.tableColumns[columnIndex].data;
        itemData[fieldName]=params.values[columnIndex];
    }
    resultCallback({item:itemData});
};

/**
 * params = (tableName,
 *      tableFields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      conditions={ conditionName:<condition> }
 * resultCallback = function(result = { item:{<tableFieldName>:<value>,...}, error, errorCode } )
 */
function _getDataItem(params, resultCallback){
    var queryFields="";
    for(var fieldNameIndex in params.tableFields) {
        if (queryFields!="") queryFields+= ",";
        queryFields+= params.tableFields[fieldNameIndex];
    }
    var selectQuery="select "+queryFields+" from "+params.tableName;
    var conditionQuery, coditionValues=[];
    if (params.conditions) {
        for(var conditionItem in params.conditions) {
            var conditionItemValue= (params.conditions[conditionItem]==null)?conditionItem:conditionItem+"?";
            conditionQuery= (!conditionQuery)?conditionItemValue:" and "+conditionItemValue;
            if (params.conditions[conditionItem]!=null) coditionValues.push(params.conditions[conditionItem]);
        }
        selectQuery+=" where "+conditionQuery;
    }
    if (coditionValues.length==0)
        database.selectQuery(selectQuery,function(err, recordset, count, fields){
            var selectResult={};
            if(err) {
                selectResult.error="Failed get data item! Reason:"+err.message;
                selectResult.errorCode=err.code;
            }
            if (recordset&&recordset.length>0) selectResult.item= recordset[0];
            resultCallback(selectResult);                                                                   log.info('_getDataItem: selectQuery: selectResult',selectResult,{});//test
        });
    else
        database.selectParamsQuery(selectQuery,coditionValues, function(err, recordset, count, fields){
            var selectResult={};
            if(err) {
                selectResult.error="Failed get data item! Reason:"+err.message;
                selectResult.errorCode=err.code;
            }
            if (recordset&&recordset.length>0) selectResult.item= recordset[0];
            resultCallback(selectResult);                                                                   log.info('_getDataItem: selectParamsQuery:',selectResult,{});//test
        });
};

/**
 * params = (tableName, idFieldName
 *      insTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error } )
 */
function _insDataItem(params, resultCallback) {
    var queryFields="", queryFieldsValues="", fieldsValues=[], resultFields=[];
    for(var fieldName in params.insTableData) {
        if (queryFields!="") queryFields+= ",";
        if (queryFieldsValues!="") queryFieldsValues+= ",";
        queryFields+= fieldName;
        queryFieldsValues+= "?";
        fieldsValues.push(params.insTableData[fieldName]);
        resultFields.push(fieldName);
    }
    var insQuery="insert into "+params.tableName+"("+queryFields+") values("+queryFieldsValues+")";
    database.executeParamsQuery(insQuery,fieldsValues,function(err, updateCount){
        var insResult={};
        if(err) {
            insResult.error="Failed insert data item! Reason:"+err.message;
            resultCallback(insResult);
            return;
        }
        insResult.updateCount= updateCount;
        var idFieldCondition=params.idFieldName+"=", idFieldValue=params.insTableData[params.idFieldName];
        var getResultConditions={};
        getResultConditions[idFieldCondition]=idFieldValue;
        _getDataItem({tableName:params.tableName, tableFields:resultFields, conditions:getResultConditions},
            function(result){
                if(result.error) insResult.error="Failed get result inserted data item! Reason:"+result.error;
                if (result.item) insResult.resultItem= result.item;
                resultCallback(insResult);
            });
    });
};