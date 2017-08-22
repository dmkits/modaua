var server= require("../server"), log= server.log, instauUID = require('instauuid');

var dataModelChanges= [];
module.exports.getModelChanges=function(){ return dataModelChanges; };
module.exports.resetModelChanges=function(){ dataModelChanges=[]; };

var database= require("../database");
/**
 * created for data model fields: sourceType, source, fields, idField, fieldsMetadata
 * created data model functions
 */
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
                        tableFields[fieldName]={name:fieldName};
                        tableFieldsList.push(fieldName);
                    }
                }
            } else if(changeLogItem.field){
                if(!tableFields[changeLogItem.field]){
                    tableFields[changeLogItem.field]={name:changeLogItem.field};
                    tableFieldsList.push(changeLogItem.field);
                }
                if(changeLogItem.source){
                    tableFields[changeLogItem.field].source=changeLogItem.source;
                    tableFields[changeLogItem.field].linkField=changeLogItem.linkField;
                }
            }
            if(changeLogItem.id&&!idFieldName) idFieldName=changeLogItem.id;
        }
    } else if(dataModel.modelData) {
        //
    }

    dataModel.getDataItems= _getDataItems;
    dataModel.getDataItemsForSelect= _getDataItemsForSelect;
    dataModel.getDataItem= _getDataItem;
    dataModel.setDataItem= _setDataItem;
    dataModel.getDataForTable= _getDataForTable;
    dataModel.setDataItemForTable= _setDataItemForTable;
    dataModel.insDataItem= _insDataItem;
    dataModel.updDataItem= _updDataItem;
    dataModel.delDataItem= _delDataItem;
    dataModel.insTableDataItem= _insTableDataItem;
    dataModel.updTableDataItem= _updTableDataItem;
    dataModel.storeTableDataItem= _storeTableDataItem;
    dataModel.delTableDataItem= _delTableDataItem;

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
    dataModel.fieldsMetadata=tableFields;                                                               log.debug('Init data model '+dataModel.sourceType+":"+dataModel.source+" fields metadata:",dataModel.fieldsMetadata,{});//test
    if(!dataModel.idField)                                                                              log.warn('NO id filed name in data model '+dataModel.sourceType+":"+dataModel.source+"! Model cannot used functions insert/update/delete!");//test

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
 *      fields = [ <tableFieldName> or <functionFieldName>, ... ],
 *      fieldsFunctions = { <functionFieldName>:{ function:<function>, source:<functionSource>, sourceField:<functionSourceField> }, ... },
 *      joinedSources = { source, conditions = { <linkCondition>:null or <linkCondition>:<value>, ... } },
 *      conditions={ <condition>:<conditionValue>, ... },
 *      order = "<orderFieldsList>"
 * }
 * fieldsFunctions[].function: "maxPlus1"
 * resultCallback = function(err, recordset)
 */
function _getSelectItems(params, resultCallback){
    if(!params){                                                                                        log.error("FAILED _getSelectItems! Reason: no function parameters!");//test
        resultCallback("FAILED _getSelectItems! Reason: no function parameters!");
        return;
    }
    if(!params.source){                                                                                 log.error("FAILED _getSelectItems! Reason: no source!");//test
        resultCallback("FAILED _getSelectItems! Reason: no source!");
        return;
    }
    if(!params.fields){                                                                                 log.error("FAILED _getSelectItems from source:"+params.source+"! Reason:! no source fields");//test
        resultCallback("FAILED _getSelectItems from source:"+params.source+"! Reason:! no source fields");
        return;
    }
    var queryFields="";
    for(var fieldNameIndex in params.fields) {
        if (queryFields!="") queryFields+= ",";
        var fieldName=params.fields[fieldNameIndex], fieldFunction=null;
        if(params.fieldsFunctions&&params.fieldsFunctions[fieldName]){
            var fieldFunctionData= params.fieldsFunctions[fieldName];
            if(fieldFunctionData.function=="maxPlus1")
                fieldFunction="COALESCE(MAX("+((fieldFunctionData.source)?fieldFunctionData.source+".":"")+fieldFunctionData.sourceField+")+1,1)";
        }
        queryFields+= ((fieldFunction)?fieldFunction+" as ":"") + fieldName;
    }
    var selectQuery="select "+queryFields+" from "+params.source;
    var conditionQuery, coditionValues=[];
    if (params.conditions) {
        for(var conditionItem in params.conditions) {
            var conditionItemValue= (params.conditions[conditionItem]==null)?conditionItem:conditionItem+"?";
            conditionItemValue= conditionItemValue.replace("~","=");
            conditionQuery= (!conditionQuery)?conditionItemValue:conditionQuery+" and "+conditionItemValue;
            if (params.conditions[conditionItem]!=null) coditionValues.push(params.conditions[conditionItem]);
        }
        selectQuery+=" where "+conditionQuery;
    }
    if (params.order) selectQuery+=" order by "+params.order;
    if (coditionValues.length==0)
        database.selectQuery(selectQuery,function(err, recordset, count, fields){
            if(err) {                                                                                       log.error("FAILED _getSelectItems selectQuery! Reason:",err.message,"!");//test
                resultCallback(err);
            } else
                resultCallback(null,recordset);
        });
    else
        database.selectParamsQuery(selectQuery,coditionValues, function(err, recordset, count, fields){
            if(err) {                                                                                       log.error("FAILED _getSelectItems selectParamsQuery! Reason:",err.message,"!");//test
                resultCallback(err);
            } else
                resultCallback(null,recordset);
        });
}
/**
 * params = { source,
 *      fields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      conditions={ <condition>:<conditionValue>, ... },
  *     order = "<orderFieldsList>"
 * }
 * resultCallback = function(result = { items:[ {<tableFieldName>:<value>,...}, ... ], error, errorCode } )
 */
function _getDataItems(params, resultCallback){
    if(!params) params={};
    if(!params.source) params.source= this.source;
    if(!params.fields) params.fields=this.fields;
    _getSelectItems(params,function(err,recordset){
        var selectResult={};
        if(err) {
            selectResult.error="Failed get data items! Reason:"+err.message;
            selectResult.errorCode=err.code;
        }
        if (recordset) selectResult.items= recordset;
        resultCallback(selectResult);                                                                   //log.info('_getDataItems: _getSelectItems:',selectResult,{});//test
    });
}
/**
 * params = { source, valueField, labelField,
 *      conditions={ <condition>:<conditionValue>, ... },
  *     order = "<orderFieldsList>"
 * }
 * resultCallback = function(result = { items:[ {value:<valueOfValueField>,label:<valueOfLabelField>}, ... ], error, errorCode } )
 *      if no labelField label=<valueOfValueField>
 */
function _getDataItemsForSelect(params, resultCallback){
    if(!params) {                                                                                       log.error("FAILED _getDataItemsForSelect! Reason: no function parameters!");//test
        resultCallback("FAILED _getDataItemsForSelect! Reason: no function parameters!");
        return;
    }
    if(!params.valueField) {                                                                            log.error("FAILED _getDataItemsForSelect! Reason: no value field!");//test
        resultCallback("FAILED _getDataItemsForSelect! Reason: no value field!");
        return;
    }
    if(!params.source) params.source=this.source;
    params.fields=[params.valueField];
    if(params.labelField&&params.labelField!=params.valueField) params.fields.push(params.labelField);
    _getDataItems(params,function(result){
        if(result.items){
            var resultItems=result.items;
            result.items=[];
            for(var i in resultItems){
                var resultItem=resultItems[i];
                var selectItem={value:resultItem[params.valueField]};
                if(params.labelField&&params.labelField!=params.valueField) selectItem.label=resultItem[params.labelField];
                else selectItem.label=resultItem[params.valueField];
                result.items.push(selectItem);
            }
        }
        resultCallback(result);
    });
}
/**
 * params = { source,
 *      fields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      fieldFunction = { name:<fieldName>, function:<function>, sourceField:<function field name> },
 *      conditions={ <condition>:<conditionValue>, ... },
 * }
 * fieldFunction: "maxPlus1"
 * resultCallback = function(result = { item:{<tableFieldName>:<value>,...}, error, errorCode } )
 */
function _getDataItem(params, resultCallback){
    if(!params) params={};
    if(!params.source) params.source= this.source;
    if(!params.fields) params.fields=this.fields;
    if(params.fieldFunction) {
        params.fields=[params.fieldFunction.name];
        params.fieldsFunctions = {};
        params.fieldsFunctions[params.fieldFunction.name]={ function:params.fieldFunction.function, sourceField:params.fieldFunction.sourceField };
    }
    _getSelectItems(params,function(err,recordset){
        var selectResult={};
        if(err) {
            selectResult.error="Failed get data item! Reason:"+err.message;
            selectResult.errorCode=err.code;
        }
        if (recordset&&recordset.length>0) selectResult.item= recordset[0];
        resultCallback(selectResult);                                                                   log.info('_getDataItem: _getSelectItems:',selectResult,{});//test
    });
}
/**
 * params = (
 *      fields = [<tableField1Name>,...],
 *      values=[ <valueField1>,<valueField2>,<valueField3>,...]
 * resultCallback = function( itemData = { item:{<tableFieldName>:<value>,...} } )
 */
function _setDataItem(params, resultCallback){
    var itemData={};
    for(var index=0; index<params.fields.length; index++){
        var fieldName= params.fields[index], value=params.values[index];
        if (value!=undefined) itemData[fieldName]=value;
    }
    resultCallback({item:itemData});
}

/**
 *
 * tableColumns = [
 *      { data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false },
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
 * params = { tableName,
 *      tableColumns = [
 *          {data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false,
 *                dataSource:<sourceName>, sourceField:<sourceFieldName> },
 *          ...
 *      ],
 *      identifier= <tableIDFieldName>,
 *      conditions={ <condition>:<conditionValue>, ... },
 *      order = "<orderFieldsList>"
 * }
 * tableColumns: -<dataType> = text / html_text / text_date / text_datetime / date / numeric / numeric2 / checkbox
 * OR tableColumns: -<dataType> = text / text & dateFormat:"DD.MM.YY HH:mm:ss" / html_text / date /
 *              numeric format:"#,###,###,##0.00[#######]" language:"ru-RU" /
 *              checkbox checkedTemplate:1 uncheckedTemplate:0 /
 *              autocomplete strict allowInvalid sourceURL
 * tableColumns: -readOnly default false, visible default true
 * resultCallback = function( tableData = { columns:tableColumns, identifier:identifier, items:[ {<tableFieldName>:<value>,...}, {}, {}, ...],
 *      error:errorMessage } )
 */
function _getDataForTable(params, resultCallback){
    var tableData={};
    if(!params){                                                                                        log.error("FAILED _getDataForTable! Reason: no function parameters!");//test
        tableData.error="FAILED _getDataForTable! Reason: no function parameters!";
        resultCallback(tableData);
        return;
    }
    if(!params.tableColumns){                                                                           log.error("FAILED _getDataForTable! Reason: no table columns!");//test
        tableData.error="FAILED _getDataForTable! Reason: no table columns!";
        resultCallback(tableData);
        return;
    }
    tableData.columns= _fillDataTypeForTableColumns(params.tableColumns);
    if(!params.source&&this.source) params.source=this.source;
    tableData.identifier=params.identifier;
    var fieldsList=[];
    for(var i in params.tableColumns) {
        var tableColumnData=params.tableColumns[i], fieldName=tableColumnData.data, fieldSource=null;

        if(tableColumnData.dataSource&&tableColumnData.sourceField) fieldSource=tableColumnData.dataSource+"."+tableColumnData.sourceField;
        else if(tableColumnData.dataSource) fieldSource=tableColumnData.dataSource+"."+tableColumnData.fieldName;

        //params.joinedSources = { source, conditions = { <linkCondition>:null or <linkCondition>:<value>, ... } },

        var selectField= (fieldSource)?fieldSource+" as "+fieldName:fieldName;
        if(!fieldSource&&this.fieldsMetadata&&this.fieldsMetadata[fieldName]) fieldsList.push(selectField);
        else if(fieldSource||!this.fieldsMetadata) fieldsList.push(selectField);
    }
    params.fields=fieldsList;
    if (!params.conditions) {
        resultCallback(tableData);
        return;
    }
    var hasConditions=false;
    for(var conditionItem in params.conditions){
        hasConditions=true; break;
    }
    if (!hasConditions) {
        resultCallback(tableData);
        return;
    }
    _getSelectItems(params, function(err, recordset){
        if(err) tableData.error="Failed get data for table! Reason:"+err.message;
        tableData.items= recordset;
        resultCallback(tableData);
    });
}

/**
 * params = {
 *      tableColumns = [{data:<tableField1Name>},{data:<tableField2Name>},{data:<tableField3Name>},...],
 *      values=[ <valueField1>,<valueField2>,<valueField3>,...]
 * }
 * resultCallback = function( itemData = { item:{<tableFieldName>:<value>,...} } )
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
 * params = { tableName,
 *      insData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { updateCount, error }
 */
function _insDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _insDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed insert data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) {                                                                            log.error("FAILED _insDataItem! Reason: no table name!");//test
        resultCallback({ error:"Failed insert data item! Reason:no table name for insert!"});
        return;
    }
    if (!params.insData) {                                                                              log.error("FAILED _insDataItem into "+params.tableName+"! Reason: no data for insert!");//test
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
 * params = { tableName,
 *      updData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...},
 *      conditions = { <tableFieldNameCondition>:<value>, ... }
 * }
 * resultCallback = function(result = { updateCount, error })
 */
function _updDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _updDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed update data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) {                                                                            log.error("FAILED _updDataItem! Reason: no table name!");//test
        resultCallback({ error:"Failed update data item! Reason:no table name for update!"});
        return;
    }
    if (!params.updData) {                                                                              log.error("FAILED _updDataItem "+params.tableName+"! Reason: no data for update!");//test
        resultCallback({ error:"Failed update data item! Reason:no data for update!"});
        return;
    }
    if (!params.conditions) {                                                                           log.error("FAILED _updDataItem "+params.tableName+"! Reason: no conditions!");//test
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
 * params = { tableName,
 *      conditions = { <tableFieldNameCondition>:<value>, ... }
 * }
 * resultCallback = function(result = { updateCount, error })
 */
function _delDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _delDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed delete data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) {                                                                            log.error("FAILED _delDataItem! Reason: no table name!");//test
        resultCallback({ error:"Failed delete data item! Reason:no table name for delete!"});
        return;
    }
    if (!params.conditions) {                                                                           log.error("FAILED _delDataItem "+params.tableName+"! Reason: no conditions!");//test
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
 * params = { tableName, idFieldName
 *      insTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error })
 */
function _insTableDataItem(params, resultCallback) {
    if (!params) {                                                                                          log.error("FAILED _insTableDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed insert table data item! Reason:no parameters!"});
        return;
    }
    if(!params.tableName&&this.source) params.tableName=this.source;
    if (!params.tableName) {                                                                                log.error("FAILED _insTableDataItem! Reason: no table name!");//test
        resultCallback({ error:"Failed insert table data item! Reason:no table name!"});
        return;
    }
    if (!params.insTableData) {                                                                             log.error("FAILED _insTableDataItem "+params.tableName+"! Reason: no data for insert!");//test
        resultCallback({ error:"Failed insert table data item! Reason:no data for insert!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {                                                                                     log.error("FAILED _insTableDataItem "+params.tableName+"! Reason: no id field!");//test
        resultCallback({ error:"Failed insert table data item! Reason:no id field name!"});
        return;
    }
    params.insData={};
    if(this.fields){
        for(var i in this.fields){
            var fieldName=this.fields[i];
            params.insData[fieldName]=(params.insTableData[fieldName]==undefined)?null:params.insTableData[fieldName];
        }
    } else params.insData=params.insTableData;                                                      console.log("_insTableDataItem params.insData",params.insData);
    _insDataItem(params, function(insResult){
        if(insResult.error){
            resultCallback(insResult);
            return;
        }
        var resultFields=[];
        for(var fieldName in params.insTableData) resultFields.push(fieldName);
        var getResultConditions={}; getResultConditions[idFieldName+"="]=params.insTableData[idFieldName];
        _getDataItem({source:params.tableName, fields:resultFields, conditions:getResultConditions},
            function(result){
                if(result.error) insResult.error="Failed get result inserted data item! Reason:"+result.error;
                if (result.item) insResult.resultItem= result.item;
                resultCallback(insResult);
            });
    });
}

/**
 * params = { tableName, idFieldName
 *      updTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error })
 */
function _updTableDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _updTableDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed update table data item! Reason:no function parameters!"});
        return;
    }
    if(!params.tableName&&this.source) params.tableName=this.source;
    if (!params.tableName) {                                                                            log.error("FAILED _updTableDataItem! Reason: no table name!");//test
        resultCallback({ error:"Failed update table data item! Reason:no table name!"});
        return;
    }
    if (!params.updTableData) {                                                                         log.error("FAILED _updTableDataItem "+params.tableName+"! Reason: no data for update!");//test
        resultCallback({ error:"Failed update table data item! Reason:no data for update!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {                                                                                 log.error("FAILED _updTableDataItem "+params.tableName+"! Reason: no id field!");//test
        resultCallback({ error:"Failed update table data item! Reason:no id field name!"});
        return;
    }
    params.updData={};
    if(this.fields){
        for(var i in this.fields){
            var fieldName=this.fields[i];
            if(fieldName!=idFieldName)params.updData[fieldName]=params.updTableData[fieldName];
        }
    } else {
        for(var updFieldName in params.updTableData)
            if(updFieldName!=idFieldName) params.updData[updFieldName]=params.updTableData[updFieldName];
    }
    params.conditions={}; params.conditions[idFieldName+"="]=params.updTableData[idFieldName];
    _updDataItem(params, function(updResult){
        if(updResult.error){
            resultCallback(updResult);
            return;
        }
        var resultFields=[];
        for(var fieldName in params.updTableData) resultFields.push(fieldName);
        var getResultConditions={}; getResultConditions[idFieldName+"="]=params.updTableData[idFieldName];
        _getDataItem({source:params.tableName, fields:resultFields, conditions:getResultConditions},
            function(result){
                if(result.error) updResult.error="Failed get result updated data item! Reason:"+result.error;
                if (result.item) updResult.resultItem= result.item;
                resultCallback(updResult);
            });
    });
}

/**
 * params = { tableName, idFieldName
 *      storeTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error } )
 */
function _storeTableDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _storeTableDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed store table data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) params.tableName=this.source;
    if (!params.tableName) {                                                                            log.error("FAILED _storeTableDataItem! Reason: no table name!");//test
        resultCallback({ error:"Failed store table data item! Reason:no table name for store!"});
        return;
    }
    if (!params.storeTableData) {                                                                       log.error("FAILED _storeTableDataItem "+params.tableName+"! Reason: no data for store!");//test
        resultCallback({ error:"Failed store table data item! Reason:no data for store!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {                                                                                 log.error("FAILED _storeTableDataItem "+params.tableName+"! Reason: no id field!");//test
        resultCallback({ error:"Failed store table data item! Reason:no id field name!"});
        return;
    }
    var idValue=params.storeTableData[idFieldName];
    if (idValue===undefined||idValue===null){//insert
        params.storeTableData[idFieldName]=instauUID('decimal');
        this.insTableDataItem({tableName:params.tableName, idFieldName:idFieldName, insTableData:params.storeTableData}, resultCallback);
        return;
    }
    //update
    this.updTableDataItem({tableName:params.tableName, idFieldName:idFieldName, updTableData:params.storeTableData}, resultCallback);
}

/**
 * params = { tableName, idFieldName
 *      delTableData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { updateCount, error })
 */
function _delTableDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _delTableDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed delete table data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) params.tableName=this.source;
    if (!params.delTableData) {                                                                         log.error("FAILED _delTableDataItem "+params.tableName+"! Reason: no data for delete!");//test
        resultCallback({ error:"Failed delete table data item! Reason:no data for delete!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {                                                                                 log.error("FAILED _delTableDataItem "+params.tableName+"! Reason: no id field!");//test
        resultCallback({ error:"Failed delete table data item! Reason:no id field name!"});
        return;
    }
    var idFieldValue=params.delTableData[idFieldName];
    if(!params.tableName&&this.source) params.tableName=this.source;
    params.conditions={}; params.conditions[idFieldName+"="]=idFieldValue;
    _delDataItem(params, function(delResult){
        if (delResult.updateCount==1) {
            delResult.resultItem= {}; delResult.resultItem[idFieldName]=idFieldValue;
        }
        resultCallback(delResult);
    });

    function _delTableDataItem1(){

    }
}
