var server= require("../server"), log= server.log, instauUID = require('instauuid');

var dataModelChanges= [];
module.exports.getModelChanges=function(){ return dataModelChanges; };
module.exports.resetModelChanges=function(){ dataModelChanges=[]; };

var database= require("../database");
//function initDataModel
function initValidateDataModel(dataModelName, dataModel, errs, nextValidateDataModelCallback){              log.info('InitValidateDataModel: dataModel:'+dataModelName+"...");//test
    if(!dataModel.changeLog&&!dataModel.modelData){
        errs[dataModelName+"_initError"]="Failed init dataModel:"+dataModelName
            +"! Reason: no model data and no change log!";                                                  log.error('FAILED init dataModel:'+dataModelName+"! Reason: no model data and no change log!");//test
        nextValidateDataModelCallback();
        return;
    }
    var tableName, tableFieldsList=[],tableFields={}, idFieldName;
    if(dataModel.changeLog){
        dataModelChanges= dataModelChanges.concat(dataModel.changeLog);
        for(var i=0;i<dataModel.changeLog.length;i++){
            var changeLogItem=dataModel.changeLog[i];
            if(changeLogItem.tableName&&!tableName) tableName=changeLogItem.tableName;
            if(changeLogItem.fields){
                for(var fieldIndex in changeLogItem.fields){
                    var fieldName=changeLogItem.fields[fieldIndex];
                    if(!tableFields[fieldName]){
                        tableFields[fieldName]=true;tableFieldsList.push(fieldName);
                    }
                }
            } else if(changeLogItem.field){
                if(!tableFields[changeLogItem.field]){
                    tableFields[changeLogItem.field]=true;tableFieldsList.push(changeLogItem.field);
                }
            }
            if(changeLogItem.id&&!idFieldName) idFieldName=changeLogItem.id;
        }
    } else if(dataModel.modelData) {
        //
    }
    if(!tableName) {
        errs[dataModelName+"_initError"]="Failed init dataModel:"+dataModelName
            +"! Reason: no model table name!";                                                          log.error('FAILED init dataModel:'+dataModelName+"! Reason: no model table name!");//test
        nextValidateDataModelCallback();
        return;
    }
    if(tableFieldsList.length==0) {
        errs[dataModelName+"_initError"]="Failed init dataModel:"+dataModelName
            +"! Reason: no model fields!";                                                              log.error('FAILED init dataModel:'+dataModelName+"! Reason: no model fields!");//test
        nextValidateDataModelCallback();
        return;
    }
    dataModel.sourceType="table"; dataModel.source=tableName;
    dataModel.fields=tableFieldsList; dataModel.idField=idFieldName;                                    log.info('Init data model '+dataModel.sourceType+":"+dataModel.source+" fields:",dataModel.fields," idField:"+dataModel.idField);//test
    if(!dataModel.idField)                                                                              log.warn('NO id filed name in data model '+dataModel.sourceType+":"+dataModel.source+"! Model cannot used functions insert/update/delete!");//test
    if(dataModel.sourceType=="table"){
        dataModel.getDataItems= _getDataItems;
        dataModel.getDataItem= _getDataItem;
        dataModel.getDataForTable= _getDataForTable;
        dataModel.setDataItemForTable= _setDataItemForTable;
        if(dataModel.idField){
            dataModel.insDataItem= _insDataItem;
            dataModel.updDataItem= _updDataItem;
            dataModel.delDataItem= _delDataItem;
            dataModel.insTableDataItem= _insTableDataItem;
            dataModel.updTableDataItem= _updTableDataItem;
            dataModel.storeTableDataItem= _storeTableDataItem;
            dataModel.delTableDataItem= _delTableDataItem;
        }
    }

    dataModel.getDataItems({conditions:{"ID is NULL":null}},function(result){
        if(result.error) {                                                                              log.error('FAILED validate data model:'+dataModelName+"! Reason:"+result.error+"!");//test
            errs[dataModelName+"_validateError"]="Failed validate dataModel:"+dataModelName+"! Reason:"+result.error;
        }
        nextValidateDataModelCallback();
    });
}

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
 * params = { source,
 *      fields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      conditions={ conditionName:<condition>,
 *      order = "<orderFieldsList>"
 * }
 * resultCallback = function(err, recordset)
 */
function _getSelectItems(params, resultCallback){
    var queryFields="";
    for(var fieldNameIndex in params.fields) {
        if (queryFields!="") queryFields+= ",";
        queryFields+= params.fields[fieldNameIndex];
    }
    var selectQuery="select "+queryFields+" from "+params.source;
    var conditionQuery, coditionValues=[];
    if (params.conditions) {
        for(var conditionItem in params.conditions) {
            var conditionItemValue= (params.conditions[conditionItem]==null)?conditionItem:conditionItem+"?";
            conditionQuery= (!conditionQuery)?conditionItemValue:" and "+conditionItemValue;
            if (params.conditions[conditionItem]!=null) coditionValues.push(params.conditions[conditionItem]);
        }
        selectQuery+=" where "+conditionQuery;
    }
    if (params.order) selectQuery+=" order by "+params.order;
    if (coditionValues.length==0)
        database.selectQuery(selectQuery,function(err, recordset, count, fields){
            if(err) resultCallback(err); else resultCallback(null,recordset);
        });
    else
        database.selectParamsQuery(selectQuery,coditionValues, function(err, recordset, count, fields){
            if(err) resultCallback(err); else resultCallback(null,recordset);
        });
}
/**
 * params = {
 *      fields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      conditions={ conditionName:<condition> }
 * }
 * resultCallback = function(result = { items:[ {<tableFieldName>:<value>,...}, ... ], error, errorCode } )
 */
function _getDataItems(params, resultCallback){
    if(!params) params={};
    params.source= this.source;
    if(!params.fields) params.fields=this.fields;
    _getSelectItems(params,function(err,recordset){
        var selectResult={};
        if(err) {
            selectResult.error="Failed get table data items! Reason:"+err.message;
            selectResult.errorCode=err.code;
        }
        if (recordset) selectResult.items= recordset;
        resultCallback(selectResult);                                                                   log.info('_getDataItems: _getSelectItems:',selectResult,{});//test
    });
}
/**
 * params = {
 *      fields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      conditions={ conditionName:<condition> }
 * }
 * resultCallback = function(result = { item:{<tableFieldName>:<value>,...}, error, errorCode } )
 */
function _getDataItem(params, resultCallback){
    if(!params) params={};
    params.source= this.source;
    if(!params.fields) params.fields=this.fields;
    _getSelectItems(params,function(err,recordset){
        var selectResult={};
        if(err) {
            selectResult.error="Failed get data item! Reason:"+err.message;
            selectResult.errorCode=err.code;
        }
        if (recordset&&recordset.length>0) selectResult.item= recordset[0];
        resultCallback(selectResult);                                                                   log.info('_getDataItem: selectParamsQuery:',selectResult,{});//test
    });
}

/**
 *
 * tableColumns = [
 *      {data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false},
 *      {data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false},
 *      {data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false},
 *       ...
 * ]
 * tableColumns: -<dataType> = text / html_text / text_date / text_datetime / date / numeric / numeric2 / checkbox
 *                              / combobox sourceURL
 * OR tableColumns: -<dataType> = text / text & dateFormat:"DD.MM.YY HH:mm:ss" / html_text / date /
 *              numeric format:"#,###,###,##0.00[#######]" language:"ru-RU" /
 *              checkbox checkedTemplate:1 uncheckedTemplate:0 /
 *              autocomplete strict allowInvalid sourceURL
 */
function _fillDataTypeForTableColumns(tableColumns){
    if (!tableColumns) return tableColumns;
    for(var col=0;col<tableColumns.length;col++){
        var tableColData=tableColumns[col];
        if(!tableColData) continue;
        if (tableColData.type=="text_date"){
            tableColData.type="text";
            if(!tableColData.dateFormat) tableColData.dateFormat="DD.MM.YY";
        } else if (tableColData.type=="text_datetime"){
            tableColData.type="text";
            if(!tableColData.dateFormat) tableColData.dateFormat="DD.MM.YY HH:mm:ss";
        } else if(tableColData.type=="numeric"){
            if(!tableColData.format) tableColData.format="#,###,###,##0.[#########]";
            if(!tableColData.language) tableColData.language="ru-RU";
        } else if(tableColData.type=="numeric2"){
            tableColData.type="numeric";
            if(!tableColData.format) tableColData.format="#,###,###,##0.00[#######]";
            if(!tableColData.language) tableColData.language="ru-RU";
        } else if(tableColData.type=="checkbox"){
            if(!tableColData.checkedTemplate) tableColData.checkedTemplate="1";
            if(!tableColData.uncheckedTemplate) tableColData.uncheckedTemplate="0";
        } else if(tableColData.type=="combobox") {
            tableColData.type="autocomplete";
            if (!tableColData.strict) tableColData.strict =true;
            if (!tableColData.allowInvalid) tableColData.allowInvalid = false;
        }
    }
    return tableColumns;
}
/**
 * params = (tableName,
 *      tableColumns = [
 *          {data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false},
 *          {data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false},
 *          {data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false},
 *          ...
 *      ],
 *      identifier= <tableIDFieldName>,
 *      conditions={ conditionName:<condition> },
 *      order = "<orderFieldsList>"
 * )
 * tableColumns: -<dataType> = text / html_text / text_date / text_datetime / date / numeric / numeric2 / checkbox
 * OR tableColumns: -<dataType> = text / text & dateFormat:"DD.MM.YY HH:mm:ss" / html_text / date /
 *              numeric format:"#,###,###,##0.00[#######]" language:"ru-RU" /
 *              checkbox checkedTemplate:1 uncheckedTemplate:0 /
 *              autocomplete strict allowInvalid sourceURL
 * tableColumns: -readOnly default false, visible default true
 * resultCallback = function(
 *      tableData = { columns:tableColumns, identifier:identifier,
 *      items:[ {<tableFieldName>:<value>,...}, {}, {}, ...],
 *      error:errorMessage } )
 */
function _getDataForTable(params, resultCallback){
    var tableData={ columns:_fillDataTypeForTableColumns(params.tableColumns), identifier:params.identifier};
    var queryFields="";
    for(var i in params.tableColumns) {
        if (queryFields!="") queryFields+= ",";
        queryFields+= params.tableColumns[i].data;
    }
    var selectQuery="select "+queryFields+" from "+params.tableName;
    var conditionQuery, conditionValues=[];
    if (params.conditions) {
        for(var conditionItem in params.conditions) {
            conditionQuery= (!conditionQuery)?conditionItem.replace("~","=")+"?":conditionQuery+" and "+conditionItem.replace("~","=")+"?";
            conditionValues.push(params.conditions[conditionItem]);
        }
        if (conditionQuery) selectQuery+=" where "+conditionQuery;
    }
    if (!conditionQuery) {
        resultCallback(tableData);
        return;
    }
    if (params.order) selectQuery+=" order by "+params.order;
    if (conditionValues.length==0)
        database.selectQuery(selectQuery,function(err, recordset, count, fields){
            if(err) tableData.error="Failed get data for table! Reason:"+err.message;
            tableData.items= recordset;
            resultCallback(tableData);
        });
    else
        database.selectParamsQuery(selectQuery,conditionValues,function(err, recordset, count, fields){
            if(err) tableData.error="Failed get data for table! Reason:"+err.message;
            tableData.items= recordset;
            resultCallback(tableData);
        });
}

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
        var fieldName= params.tableColumns[columnIndex].data, value=params.values[columnIndex];
        if (value!=undefined) itemData[fieldName]=value;
    }
    resultCallback({item:itemData});
}

/**
 * params = (tableName,
 *      insData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...} )
 * resultCallback = function(result = { updateCount, error }
 */
function _insDataItem(params, resultCallback) {
    if (!params) {
        resultCallback({ error:"Failed insert data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) {
        resultCallback({ error:"Failed insert data item! Reason:no table name for insert!"});
        return;
    }
    if (!params.insData) {
        resultCallback({ error:"Failed insert data item! Reason:no data for insert!"});
        return;
    }
    var queryFields="", queryFieldsValues="", fieldsValues=[];
    for(var fieldName in params.insData) {
        if (queryFields!="") queryFields+= ",";
        if (queryFieldsValues!="") queryFieldsValues+= ",";
        queryFields+= fieldName;
        queryFieldsValues+= "?";
        fieldsValues.push(params.insData[fieldName]);
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
        if (updateCount==0) insResult.error="Failed insert data item! Reason: no inserted row count!";
        resultCallback(insResult);
    });
}

/**
 * params = (tableName,
 *      updData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...},
 *      conditions = { <tableFieldNameCondition>:<value>, ... } )
 * resultCallback = function(result = { updateCount, error }
 */
function _updDataItem(params, resultCallback) {
    if (!params) {
        resultCallback({ error:"Failed update data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) {
        resultCallback({ error:"Failed update data item! Reason:no table name for update!"});
        return;
    }
    if (!params.updData) {
        resultCallback({ error:"Failed update data item! Reason:no data for update!"});
        return;
    }
    if (!params.conditions) {
        resultCallback({ error:"Failed update data item! Reason:no update conditions!"});
        return;
    }
    var queryFields="", fieldsValues=[];
    for(var fieldName in params.updData) {
        if (queryFields!="") queryFields+= ",";
        queryFields+= fieldName+"=?";
        fieldsValues.push(params.updData[fieldName]);
    }
    var updQuery="update "+params.tableName+" set "+queryFields;
    var queryConditions="";
    for(var fieldNameCondition in params.conditions) {
        if (queryConditions!="") queryConditions+= " and ";
        queryConditions+= fieldNameCondition.replace("~","=")+"?";
        fieldsValues.push(params.conditions[fieldNameCondition]);
    }
    updQuery+= " where "+queryConditions;
    database.executeParamsQuery(updQuery,fieldsValues,function(err, updateCount){
        var updResult={};
        if(err) {
            updResult.error="Failed update data item! Reason:"+err.message;
            resultCallback(updResult);
            return;
        }
        updResult.updateCount= updateCount;
        if (updateCount==0) updResult.error="Failed update data item! Reason: no updated row count!";
        resultCallback(updResult);
    });
}

/**
 * params = (tableName,
 *      conditions = { <tableFieldNameCondition>:<value>, ... } )
 * resultCallback = function(result = { updateCount, error }
 */
function _delDataItem(params, resultCallback) {
    if (!params) {
        resultCallback({ error:"Failed delete data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) {
        resultCallback({ error:"Failed delete data item! Reason:no table name for delete!"});
        return;
    }
    if (!params.conditions) {
        resultCallback({ error:"Failed delete data item! Reason:no delete conditions!"});
        return;
    }
    var fieldsValues=[];
    var delQuery="delete from "+params.tableName;
    var queryConditions="";
    for(var fieldNameCondition in params.conditions) {
        if (queryConditions!="") queryConditions+= " and ";
        queryConditions+= fieldNameCondition.replace("~","=")+"?";
        fieldsValues.push(params.conditions[fieldNameCondition]);
    }
    delQuery+= " where "+queryConditions;
    database.executeParamsQuery(delQuery,fieldsValues,function(err, updateCount){
        var delResult={};
        if(err) {
            delResult.error="Failed delete data item! Reason:"+err.message;
            resultCallback(delResult);
            return;
        }
        delResult.updateCount= updateCount;
        if (updateCount==0) delResult.error="Failed delete data item! Reason: no updated row count!";
        resultCallback(delResult);
    });
}

/**
 * params = (tableName, idFieldName
 *      insTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...} )
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error }
 */
function _insTableDataItem(params, resultCallback) {
    if (!params) {
        resultCallback({ error:"Failed insert table data item! Reason:no function parameters!"});
        return;
    }
    if (!params.insTableData) {
        resultCallback({ error:"Failed insert table data item! Reason:no data for insert!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {
        resultCallback({ error:"Failed insert table data item! Reason:no id field name!"});
        return;
    }
    params.insData=params.insTableData;
    _insDataItem(params, function(insResult){
        var resultFields=[];
        for(var fieldName in params.insTableData) resultFields.push(fieldName);
        var getResultConditions={}; getResultConditions[idFieldName+"="]=params.insTableData[idFieldName];
        _getDataItem({tableName:params.tableName, tableFields:resultFields, conditions:getResultConditions},
            function(result){
                if(result.error) insResult.error="Failed get result inserted data item! Reason:"+result.error;
                if (result.item) insResult.resultItem= result.item;
                resultCallback(insResult);
            });
    });
}

/**
 * params = (tableName, idFieldName
 *      updTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...} )
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error }
 */
function _updTableDataItem(params, resultCallback) {
    if (!params) {
        resultCallback({ error:"Failed update table data item! Reason:no function parameters!"});
        return;
    }
    if (!params.updTableData) {
        resultCallback({ error:"Failed update table data item! Reason:no data for update!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {
        resultCallback({ error:"Failed update table data item! Reason:no id field name!"});
        return;
    }
    params.updData={};
    for(var updFieldName in params.updTableData) if(updFieldName!=idFieldName) params.updData[updFieldName]=params.updTableData[updFieldName];
    params.conditions={}; params.conditions[idFieldName+"="]=params.updTableData[idFieldName];
    _updDataItem(params, function(updResult){
        var resultFields=[];
        for(var fieldName in params.updTableData) resultFields.push(fieldName);
        var getResultConditions={}; getResultConditions[idFieldName+"="]=params.updTableData[idFieldName];
        _getDataItem({tableName:params.tableName, tableFields:resultFields, conditions:getResultConditions},
            function(result){
                if(result.error) updResult.error="Failed get result updated data item! Reason:"+result.error;
                if (result.item) updResult.resultItem= result.item;
                resultCallback(updResult);
            });
    });
}

/**
 * params = (tableName, idFieldName
 *      storeTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error } )
 */
function _storeTableDataItem(params, resultCallback) {
    if (!params) {
        resultCallback({ error:"Failed store table data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) {
        resultCallback({ error:"Failed store table data item! Reason:no table name for store!"});
        return;
    }
    if (!params.storeTableData) {
        resultCallback({ error:"Failed store table data item! Reason:no data for store!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {
        resultCallback({ error:"Failed store table data item! Reason:no id field name!"});
        return;
    }
    var idValue=params.storeTableData[idFieldName];
    if (idValue===undefined||idValue===null){//insert
        params.storeTableData[idFieldName]=instauUID('decimal');
        _insTableDataItem({tableName:params.tableName, idFieldName:idFieldName, insTableData:params.storeTableData}, resultCallback);
        return;
    }
    //update
    _updTableDataItem({tableName:params.tableName, idFieldName:idFieldName, updTableData:params.storeTableData}, resultCallback);
}

/**
 * params = (tableName, idFieldName
 *      delTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...} )
 * resultCallback = function(result = { updateCount, error }
 */
function _delTableDataItem(params, resultCallback) {
    if (!params) {
        resultCallback({ error:"Failed delete table data item! Reason:no function parameters!"});
        return;
    }
    if (!params.delTableData) {
        resultCallback({ error:"Failed delete table data item! Reason:no data for delete!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {
        resultCallback({ error:"Failed delete table data item! Reason:no id field name!"});
        return;
    }
    var idFieldValue=params.delTableData[idFieldName];
    params.conditions={}; params.conditions[idFieldName+"="]=idFieldValue;
    _delDataItem(params, function(delResult){
        if (delResult.updateCount==1) {
            delResult.resultItem= {}; delResult.resultItem[idFieldName]=idFieldValue;
        }
        resultCallback(delResult);
    });
}
