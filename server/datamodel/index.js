var server= require("../server"), log= server.log;
var dateFormat = require('dateformat'), path=require('path');
var util=require("../util");

var dataModelChanges= [], validatedDataModels={};
module.exports.getModelChanges=function(){ return dataModelChanges; };
module.exports.resetModelChanges=function(){ dataModelChanges=[]; };
module.exports.getValidatedDataModels=function(){ return validatedDataModels; };
module.exports.resetValidatedDataModels=function(){ validatedDataModels={}; };

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
    if(validatedDataModels[dataModelName]){
        nextValidateDataModelCallback();
        return;
    }
    validatedDataModels[dataModelName]=dataModel;//dataModel.source dataModel.sourceType=="table" //restore DB data from bata1 DB
    if(dataModel.changeLog)
        dataModelChanges= dataModelChanges.concat(dataModel.changeLog);
    if(dataModel.doValidate){//if data model only inited
        dataModel.doValidate(errs, nextValidateDataModelCallback);
        return;
    }
    var tableName, viewName, tableFieldsList=[],tableFields={}, idFieldName, joinedSources={};
    if(dataModel.changeLog){
        for(var i=0;i<dataModel.changeLog.length;i++){
            var changeLogItem=dataModel.changeLog[i];
            if(changeLogItem.tableName&&!tableName&&!viewName) tableName=changeLogItem.tableName;
            if(changeLogItem.viewName&&!viewName&&!tableName) viewName=changeLogItem.viewName;
            if(changeLogItem.id&&!idFieldName) idFieldName=changeLogItem.id;
            if(changeLogItem.fields){
                for(var fieldIndex in changeLogItem.fields){
                    var fieldName=changeLogItem.fields[fieldIndex];
                    if(!tableFields[fieldName]){
                        tableFields[fieldName]=true;
                        tableFieldsList.push(fieldName);
                    }
                }
            } else if(changeLogItem.field){
                if(!tableFields[changeLogItem.field]){
                    tableFields[changeLogItem.field]=true;
                    tableFieldsList.push(changeLogItem.field);
                }
                if(changeLogItem.source){
                    var joinedSourceLinkConditions=joinedSources[changeLogItem.source];
                    if(!joinedSourceLinkConditions){
                        joinedSourceLinkConditions={};
                        joinedSources[changeLogItem.source]=joinedSourceLinkConditions;
                    }
                    if(changeLogItem.linkField)
                        joinedSourceLinkConditions[tableName+"."+changeLogItem.field+"="+changeLogItem.source+"."+changeLogItem.linkField]=null;
                }
            }
        }
    } else if(dataModel.modelData) {
        //
    }
    dataModel.getDataItems= _getDataItems;
    dataModel.getDataItemsForSelect= _getDataItemsForSelect;
    dataModel.getDataItemsForTableCombobox= _getDataItemsForTableCombobox;
    dataModel.getDataItem= _getDataItem;
    dataModel.setDataItem= _setDataItem;
    dataModel.getDataItemsForTable= _getDataItemsForTable;
    dataModel.getDataItemForTable= _getDataItemForTable;
    dataModel.getDataForTable= _getDataForTable;
    dataModel.getDataForDocTable= _getDataForDocTable;
    dataModel.setDataItemForTable= _setDataItemForTable;
    dataModel.insDataItem= _insDataItem;
    dataModel.insDataItemWithNewID= _insDataItemWithNewID;
    dataModel.updDataItem= _updDataItem;
    dataModel.storeDataItem= _storeDataItem;
    dataModel.delDataItem= _delDataItem;
    dataModel.findDataItemByOrCreateNew= _findDataItemByOrCreateNew;
    dataModel.insTableDataItem= _insTableDataItem;
    dataModel.updTableDataItem= _updTableDataItem;
    dataModel.storeTableDataItem= _storeTableDataItem;
    dataModel.delTableDataItem= _delTableDataItem;
    if(!tableName&&!viewName) {
        errs[dataModelName+"_initError"]="Failed init dataModel:"+dataModelName
            +"! Reason: no model table or view name!";                                                  log.error('FAILED init dataModel:'+dataModelName+"! Reason: no model table or view name!");//test
        nextValidateDataModelCallback();
        return;
    }
    if(tableFieldsList.length==0) {
        errs[dataModelName+"_initError"]="Failed init dataModel:"+dataModelName
            +"! Reason: no model fields!";                                                              log.error('FAILED init dataModel:'+dataModelName+"! Reason: no model fields!");//test
        nextValidateDataModelCallback();
        return;
    }
    if(tableName) {
        dataModel.sourceType="table"; dataModel.source=tableName;
    } else if(viewName) {
        dataModel.sourceType="view"; dataModel.source=viewName;
    }
    dataModel.fields=tableFieldsList; dataModel.idField=idFieldName;                                    log.debug('Init data model '+dataModel.sourceType+":"+dataModel.source+" fields:",dataModel.fields," idField:"+dataModel.idField);//test
    dataModel.fieldsMetadata=tableFields;
    dataModel.joinedSources=joinedSources;                                                              log.debug('Init data model '+dataModel.sourceType+":"+dataModel.source+" joined sources:",dataModel.joinedSources,{});//test
    if(!dataModel.idField)                                                                              log.warn('NO id filed name in data model '+dataModel.sourceType+":"+dataModel.source+"! Model cannot used functions insert/update/delete!");//test
    var idIsNullCondition=tableFieldsList[0]+" is NULL";
    var validateCondition={}; validateCondition[idIsNullCondition]=null;
    dataModel.doValidate= function(errs, resultCallback){
        dataModel.getDataItems({conditions:validateCondition},function(result){
            if(result.error) {                                                                          log.error('FAILED validate data model:'+dataModelName+"! Reason:"+result.error+"!");//test
                errs[dataModelName+"_validateError"]="Failed validate dataModel:"+dataModelName+"! Reason:"+result.error;
            }
            resultCallback();
        });
    };
    dataModel.doValidate(errs, nextValidateDataModelCallback);
}

module.exports.initValidateDataModels=function(dataModelsList, errs, resultCallback){
    var validateDataModelCallback= function(dataModelsList, index, errs){
        var dataModelInstance= dataModelsList[index];
        if (!dataModelInstance) {
            resultCallback(errs);
            return;
        }
        if(!dataModelInstance.id){                                                                      log.error('FAILED validate data model without id! Data model instance:',dataModelInstance,{});//test
            resultCallback(errs);
            return;
        }
        var dataModelName=path.basename(dataModelInstance.id).replace('.js','');
        initValidateDataModel(dataModelName, dataModelInstance, errs, function(){
            validateDataModelCallback(dataModelsList, index+1, errs);
        });
    };
    validateDataModelCallback(dataModelsList, 0, errs);
};

/**
 * params = { source,
 *      fields = [ <fieldName> or <functionFieldName>, ... ],
 *      fieldsSources = { <fieldName>:<sourceName>.<sourceFieldName>, ... },
 *      fieldsFunctions = {
 *          <fieldName>:
 *              "<function>" OR
 *              { function:<function>, source:<functionSource>, sourceField:<functionSourceField>, fields:[ <functionBodySourceFieldName> ] },
 *      ... },
 *      joinedSources = { <sourceName>:<linkConditions> = { <linkCondition>:null or <linkCondition>:<value>, ... } },
 *      leftJoinedSources = { <sourceName>:<linkConditions> = { <linkCondition>:null or <linkCondition>:<value>, ... } },
 *      groupedFields = [ <fieldName>, ... ],
 *      conditions={ <condition>:<conditionValue>, ... } OR conditions=[ { fieldName:"...", condition:"...", value:"..." }, ... ],
 *      order = "<fieldName>" OR "<fieldName>,<fieldName>,..." OR [ <fieldName>, ... ]
 * }
 * fieldsFunctions[].function: "maxPlus1" / "concat"
 * resultCallback = function(err, recordset)
 */
function _getSelectItems(params, resultCallback){                                                       log.debug("_getSelectItems params:",params,{});//test
    if(!params){                                                                                        log.error("FAILED _getSelectItems! Reason: no function parameters!");//test
        resultCallback("FAILED _getSelectItems! Reason: no function parameters!");
        return;
    }
    if(!params.source){                                                                                 log.error("FAILED _getSelectItems! Reason: no source!");//test
        resultCallback("FAILED _getSelectItems! Reason: no source!");
        return;
    }
    if(!params.fields){                                                                                 log.error("FAILED _getSelectItems from source:"+params.source+"! Reason: no source fields!");//test
        resultCallback("FAILED _getSelectItems from source:"+params.source+"! Reason: no source fields!");
        return;
    }
    var queryFields="";
    for(var fieldNameIndex in params.fields) {
        if (queryFields!="") queryFields+= ",";
        var fieldName=params.fields[fieldNameIndex], fieldFunction=null;
        if(params.fieldsSources&&params.fieldsSources[fieldName]){
            fieldName= params.fieldsSources[fieldName]+" as "+fieldName;
        } else if(params.fieldsFunctions&&params.fieldsFunctions[fieldName]){
            var fieldFunctionData= params.fieldsFunctions[fieldName];
            if(typeof(fieldFunctionData)=="string") fieldFunction= fieldFunctionData;
            else if(typeof(fieldFunctionData)=="object") {
                if(fieldFunctionData.function=="maxPlus1")
                    fieldFunction="COALESCE(MAX("+((fieldFunctionData.source)?fieldFunctionData.source+".":"")+fieldFunctionData.sourceField+")+1,1)";
                else if(fieldFunctionData.function=="sumIsNull")
                    fieldFunction="COALESCE(SUM("+((fieldFunctionData.source)?fieldFunctionData.source+".":"")+fieldFunctionData.sourceField+"),0)";
                else if(fieldFunctionData.function=="rowsCountIsNull")
                    fieldFunction= "COALESCE(SUM(CASE When "+
                        ((fieldFunctionData.source)?fieldFunctionData.source+".":"")+fieldFunctionData.sourceField+
                        " is NULL Then 0 Else 1 END),0)";
                else if(fieldFunctionData.function=="concat"&&fieldFunctionData.fields) {
                    for(var ind in fieldFunctionData.fields){
                        fieldFunction= (!fieldFunction)?fieldFunctionData.fields[ind]:fieldFunction+","+fieldFunctionData.fields[ind];
                    }
                    fieldFunction="CONCAT("+fieldFunction+")";
                } else if(fieldFunctionData.function&&fieldFunctionData.sourceField){
                    fieldFunction=fieldFunctionData.function+"("+((fieldFunctionData.source)?fieldFunctionData.source+".":"")+fieldFunctionData.sourceField+")";
                } else if(fieldFunctionData.function)
                    fieldFunction=fieldFunctionData.function;
            }
        }
        queryFields+= ((fieldFunction)?fieldFunction+" as ":"") + fieldName;
    }
    var selectQuery="select "+queryFields+" from "+params.source;
    var joins="";
    if(params.joinedSources){
        for(var joinSourceName in params.joinedSources) {
            var joinedSourceConditions=params.joinedSources[joinSourceName], joinedSourceOnCondition=null;
            for(var linkCondition in joinedSourceConditions)
                joinedSourceOnCondition= (!joinedSourceOnCondition)?linkCondition:joinedSourceOnCondition+" and "+linkCondition;
            joins += " inner join " + joinSourceName + " on "+joinedSourceOnCondition;
        }
    }
    if(params.leftJoinedSources){
        for(var leftJoinSourceName in params.leftJoinedSources) {
            var leftJoinedSourceConditions=params.leftJoinedSources[leftJoinSourceName], leftJoinedSourceOnCondition;
            for(var leftJoinLinkCondition in leftJoinedSourceConditions)
                leftJoinedSourceOnCondition= (!leftJoinedSourceOnCondition)?leftJoinLinkCondition:leftJoinedSourceOnCondition+" and "+leftJoinLinkCondition;
            joins += " left join " + leftJoinSourceName + " on "+leftJoinedSourceOnCondition;
        }
    }
    selectQuery+=joins;
    var conditionQuery, coditionValues=[];
    if (params.conditions&&typeof(params.conditions)=="object") {
        for(var conditionItem in params.conditions) {
            var conditionItemValue=params.conditions[conditionItem];
            var conditionItemValueQuery= (conditionItemValue===null)?conditionItem:conditionItem+"?";
            conditionItemValueQuery= conditionItemValueQuery.replace("~","=");
            conditionQuery= (!conditionQuery)?conditionItemValueQuery:conditionQuery+" and "+conditionItemValueQuery;
            if (conditionItemValue!==null) coditionValues.push(conditionItemValue);
        }
    } else if (params.conditions) {
        for(var ind in params.conditions) {
            var conditionItem= params.conditions[ind];
            var conditionFieldName=conditionItem.fieldName;
            if(params.fieldsSources&&params.fieldsSources[conditionFieldName])
                conditionFieldName= params.fieldsSources[conditionFieldName];
            var conditionItemValueQuery=
                (conditionItem.value===null)?conditionFieldName+conditionItem.condition:conditionFieldName+conditionItem.condition+"?";
            conditionQuery= (!conditionQuery)?conditionItemValueQuery:conditionQuery+" and "+conditionItemValueQuery;
            if (conditionItem.value!==null) coditionValues.push(conditionItem.value);
        }
    }
    if(conditionQuery)selectQuery+=" where "+conditionQuery;
    if (params.groupedFields) {
        var queryGroupedFields = "";
        for (var groupedFieldNameIndex in params.groupedFields) {
            if (queryGroupedFields != "") queryGroupedFields += ",";
            var groupedFieldName = params.groupedFields[groupedFieldNameIndex];
            if (params.fieldsSources && params.fieldsSources[groupedFieldName]) {
                groupedFieldName = params.fieldsSources[groupedFieldName];
            }
            queryGroupedFields += groupedFieldName;
        }
        selectQuery+=" group by "+queryGroupedFields;
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
module.exports.getSelectItems=_getSelectItems;
/**
 * params = { source,
 *      fields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      conditions={ <condition>:<conditionValue>, ... },
 *      order = "<orderFieldsList>"
 * }
 * resultCallback = function(result = { items:[ {<tableFieldName>:<value>,...}, ... ], error, errorCode } )
 */
function _getDataItems(params, resultCallback){                                                             //log.debug('_getDataItems: params:',params,{});//test
    if(!params) params={};
    if(!params.source) params.source= this.source;
    if(!params.fields) params.fields=this.fields;
    if(!params.conditions){                                                                                 log.error("FAILED _getDataItems from source:"+params.source+"! Reason: no conditions!");//test
        resultCallback({error:"FAILED _getDataItems from source:"+params.source+"! Reason: no conditions!"});
        return;
    }
    var condition={}, hasCondition=false;
    for(var condItem in params.conditions){
        var condValue=params.conditions[condItem];
        if(condValue!==undefined) {
            condition[condItem]=condValue;
            hasCondition= true;
        }
    }
    if(!hasCondition){                                                                                 log.error("FAILED _getDataItems from source:"+params.source+"! Reason: no data conditions!");//test
        resultCallback({error:"FAILED _getDataItems from source:"+params.source+"! Reason: no data conditions!"});
        return;
    }
    _getSelectItems(params,function(err,recordset){
        var selectResult={};
        if(err) {
            selectResult.error="Failed get data items! Reason:"+err.message;
            selectResult.errorCode=err.code;
        }
        if (recordset) selectResult.items= recordset;                                                       //log.debug('_getDataItems: _getSelectItems: result:',selectResult,{});//test
        resultCallback(selectResult);
    });
}
/**
 * params = { source,
 *      fields = [<tableFieldName>,<tableFieldName>,<tableFieldName>,...],
 *      fieldsFunctions = {
 *          <fieldName>:
 *              "<function>" OR
 *              { function:<function>, source:<functionSource>, sourceField:<functionSourceField>, fields:[ <functionBodySourceFieldName> ] },
 *      ... },conditions={ <condition>:<conditionValue>, ... },
 * }
 *      <function>: "maxPlus1"
 * resultCallback = function(result = { item:{<tableFieldName>:<value>,...}, error, errorCode } )
 */
function _getDataItem(params, resultCallback){
    if(!params) params={};
    if(!params.source) params.source= this.source;
    if(!params.fields) params.fields=this.fields;
    _getDataItems(params, function(result){                                                                 log.debug('_getDataItem: _getDataItems: result:',result,{});//test
        var getDataItemResult={};
        if(result.error) getDataItemResult.error=result.error;
        if(result.errorCode!=undefined) getDataItemResult.errorCode=result.errorCode;
        if(result.items) getDataItemResult.item=result.items[0];
        resultCallback(getDataItemResult);
    });
}

/**
 * params = { source, valueField, labelField,
 *      conditions={ <condition>:<conditionValue>, ... },
  *     order = "<orderFieldsList>"
 * }
 * if !params.conditions returns all items
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
    if(!params.conditions) params.conditions={"1=1":null};
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
 * params = { source, comboboxFields = { <tableComboboxFieldName>:<sourceFieldName>, ... },
 *      joinedDMSources=[ <joinedSourceName>, ... ]
 *      conditions={ <condition>:<conditionValue>, ... },
 *      order = "<orderFieldsList>"
 * }
 * if !params.conditions returns all items
 * resultCallback = function(result = { items:[ {<tableComboboxFieldName>:<value>, ... }, ... ], error, errorCode } )
 */
function _getDataItemsForTableCombobox(params, resultCallback){
    if(!params) {                                                                                       log.error("FAILED _getDataItemsForTableCombobox! Reason: no function parameters!");//test
        resultCallback("FAILED _getDataItemsForTableCombobox! Reason: no function parameters!");
        return;
    }
    if(!params.comboboxFields) {                                                                        log.error("FAILED _getDataItemsForTableCombobox! Reason: no comboboxFields!");//test
        resultCallback("FAILED _getDataItemsForTableCombobox! Reason: no comboboxFields!");
        return;
    }
    if(!params.source) params.source=this.source;
    if(!params.conditions) params.conditions={"1=1":null};
    params.fields=[];
    var joinedSources;
    for(var cFieldName in params.comboboxFields){
        var cFieldData=params.comboboxFields[cFieldName];
        if(cFieldData&&typeof(cFieldData)=="object"&&cFieldData.source) {
            if (!joinedSources) joinedSources={};
            if(!joinedSources[cFieldData.source]) joinedSources[cFieldData.source]=true;
        }

    }
    for(var cFieldName in params.comboboxFields){
        var cFieldData=params.comboboxFields[cFieldName];
        params.fields.push(cFieldName);
        if(typeof(cFieldData)=="string") {
            var mainSourceName=(params.source)?params.source:this.source;
            if(!params.fieldsSources) params.fieldsSources={};
            if(joinedSources&&mainSourceName)
                params.fieldsSources[cFieldName]=mainSourceName+"."+cFieldData;
            else
                params.fieldsSources[cFieldName]=cFieldData;
        } else if(cFieldData&&typeof(cFieldData)=="object"&&cFieldData.field) {
            if(cFieldData.source){
                if(!params.fieldsSources) params.fieldsSources={};
                params.fieldsSources[cFieldName]=cFieldData.source+"."+cFieldData.field;
            }
        }
    }
    if(joinedSources&&this.joinedSources){
        params.joinedSources={};
        for(var joinedSourceName in joinedSources){
            var joinedSourceMetadata=this.joinedSources[joinedSourceName];
            if(joinedSourceMetadata) params.joinedSources[joinedSourceName]=joinedSourceMetadata;
        }
    }
    _getDataItems(params,function(result){
        if(result.items){
            for(var i in result.items){
                var resultItemData=result.items[i];
                for(var rItemName in resultItemData){
                    var rItemDataValue=resultItemData[rItemName];
                    if(rItemDataValue==null) continue;
                    if(typeof(rItemDataValue)!=="string") resultItemData[rItemName]=rItemDataValue.toString();
                }
            }
        }
        resultCallback(result);
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
 * params = { source,
 *      tableColumns = [
 *          {data:<dataFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false,
 *              sourceField:<sourceFieldName>
 *             OR dataSource:<sourceName>, sourceField:<sourceFieldName>
 *             OR dataSource:<sourceName>, sourceField:<sourceFieldName>, linkCondition:<dataSource join link condition>
 *             OR childDataSource:<childSourceName>, childLinkField:<childSourceLinkFieldName>, parentDataSource, parentLinkField:<parentSourceLinkFieldName> },
 *          ...
 *      ],
 *      conditions={ <condition>:<conditionValue>, ... },
 *      order = "<orderFieldsList>",
 *      tableData = { columns:tableColumns, identifier:identifier }
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
function _getDataItemsForTable(params, resultCallback){
    var tableData={};
    if(!params){                                                                                        log.error("FAILED _getDataItemsForTable! Reason: no function parameters!");//test
        tableData.error="FAILED _getDataItemsForTable! Reason: no function parameters!";
        resultCallback(tableData);
        return;
    }
    if(params.tableData) tableData=params.tableData;
    if(!params.tableColumns){                                                                           log.error("FAILED _getDataItemsForTable! Reason: no table columns!");//test
        tableData.error="FAILED _getDataItemsForTable! Reason: no table columns!";
        resultCallback(tableData);
        return;
    }
    if(!params.source&&this.source) params.source=this.source;
    var hasSources=false, hasAFunctions=false;
    for(var i in params.tableColumns) {
        var tableColumnData=params.tableColumns[i];
        if(tableColumnData.dataSource) hasSources=true;
        if(tableColumnData.dataFunction
                && (tableColumnData.dataFunction.function=="sumIsNull"||tableColumnData.dataFunction.function=="rowsCountIsNull") )
            hasAFunctions=true;
        if(hasSources&&hasAFunctions) break;
    }
    var fieldsList=[], fieldsSources={}, fieldsFunctions, groupedFieldsList=[], addJoinedSources;
    for(var i in params.tableColumns) {
        var tableColumnData=params.tableColumns[i], fieldName=tableColumnData.data;

        if(this.fieldsMetadata&&this.fieldsMetadata[fieldName]) {
            if(tableColumnData.name) fieldsList.push(fieldName);
            if(tableColumnData.name&&hasAFunctions)groupedFieldsList.push(fieldName);
            if(tableColumnData.dataSource&&tableColumnData.sourceField)
                fieldsSources[fieldName]=tableColumnData.dataSource+"."+tableColumnData.sourceField;
            else if(tableColumnData.dataSource)
                fieldsSources[fieldName]=tableColumnData.dataSource+"."+fieldName;
            else if(hasSources&&(params.source||this.source))
                fieldsSources[fieldName]=((params.source)?params.source:this.source)+"."+fieldName;
        } else if(tableColumnData.sourceField){
            if(tableColumnData.name) fieldsList.push(fieldName);
            if(tableColumnData.name&&hasAFunctions)groupedFieldsList.push(fieldName);
            if(tableColumnData.dataSource&&tableColumnData.sourceField)
                fieldsSources[fieldName]=tableColumnData.dataSource+"."+tableColumnData.sourceField;
            else if(tableColumnData.dataSource)
                fieldsSources[fieldName]=tableColumnData.dataSource+"."+fieldName;
            else if(tableColumnData.sourceField)
                fieldsSources[fieldName]=tableColumnData.sourceField;
        } else if(tableColumnData.dataFunction){
            if(tableColumnData.name) fieldsList.push(fieldName);
            if(hasAFunctions&&tableColumnData.name&&!tableColumnData.dataFunction
                    &&tableColumnData.dataFunction.function!="sumIsNull"&&tableColumnData.dataFunction.function!="rowsCountIsNull")
                groupedFieldsList.push(fieldName);
            if(!fieldsFunctions)fieldsFunctions={};
            fieldsFunctions[fieldName]= tableColumnData.dataFunction;
        } else if(!this.fieldsMetadata) {
            if(tableColumnData.name) fieldsList.push(fieldName);
            if(tableColumnData.name&&hasAFunctions)groupedFieldsList.push(fieldName);
        }
        if(tableColumnData.dataSource && this.joinedSources&&this.joinedSources[tableColumnData.dataSource]){
            if(!params.joinedSources) params.joinedSources={};
            params.joinedSources[tableColumnData.dataSource]=this.joinedSources[tableColumnData.dataSource];
        }else if(tableColumnData.dataSource&&tableColumnData.linkCondition){
            if(!addJoinedSources) addJoinedSources={};
            if(!addJoinedSources[tableColumnData.dataSource]){
                var joinedSourceLinkConditions={};
                joinedSourceLinkConditions[tableColumnData.linkCondition]=null;
                addJoinedSources[tableColumnData.dataSource]=joinedSourceLinkConditions;
            }
        }
        if(tableColumnData.childDataSource&& (!params.leftJoinedSources||!params.leftJoinedSources[tableColumnData.childDataSource]) ){
            if(!params.leftJoinedSources) params.leftJoinedSources={};
            var childLinkConditions={};
            var parentDataSource=tableColumnData.parentDataSource;
            if(!parentDataSource&&params.source) parentDataSource=params.source;
            if(!parentDataSource&&this.source) parentDataSource=this.source;
            childLinkConditions[tableColumnData.childDataSource+"."+tableColumnData.childLinkField+"="+parentDataSource+"."+tableColumnData.parentLinkField]=null;
            params.leftJoinedSources[tableColumnData.childDataSource]=childLinkConditions;
        }
    }
    params.fields=fieldsList;
    params.fieldsSources=fieldsSources;
    if(addJoinedSources){
        if(!params.joinedSources) params.joinedSources={};
        for(var sourceName in addJoinedSources) params.joinedSources[sourceName]=addJoinedSources[sourceName];
    }
    params.fieldsFunctions=fieldsFunctions;
    if(groupedFieldsList.length>0)params.groupedFields=groupedFieldsList;
    _getSelectItems(params, function(err, recordset){
        if(err) tableData.error="Failed get data for table! Reason:"+err.message;
        tableData.items= recordset;
        resultCallback(tableData);
    });
}
function _getDataItemForTable(params, resultCallback){
    this.getDataItemsForTable(params,function(tableData){
        var tableDataItem={};
        for(var itemName in tableData){
            if(itemName!="items"){
                tableDataItem[itemName]=tableData[itemName];
                continue;
            }
            var tableDataItems=tableData.items;
            if(tableDataItems&&tableDataItems.length>1){
                tableDataItem.error="Failed get data item for table! Reason: result contains more that one items!";
                continue;
            } else if(!tableDataItems||tableDataItems.length==0){
                continue;
            }
            tableDataItem.item=tableDataItems[0];
        }
        resultCallback(tableDataItem);
    });
}
/**
 * tableColumns = [
 *      { data:<tableFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, align:"left"/"center"/"right",
 *          useFilter:true/false default:true, readOnly:true/false, default:false, visible:true/false default:true },
 *       ...
 * ]
 * tableColumns: -<dataType> = text / html_text / text_date / text_datetime / date / numeric / numeric2 / checkbox
 *                              / combobox,sourceURL / comboboxWN,sourceURL
 * OR tableColumns: -<dataType> = text / text & dateFormat:"DD.MM.YY HH:mm:ss" / html_text / date /
 *              numeric format:"#,###,###,##0.00[#######]" language:"ru-RU" /
 *              checkbox, checkedTemplate:1, uncheckedTemplate:0 /
 *              autocomplete, strict, allowInvalid, sourceURL
 */
function _getTableColumnsDataForHTable(tableColumns){
    if (!tableColumns) return tableColumns;
    var tableColumnsDataForHTable=[];
    for(var col=0;col<tableColumns.length;col++){
        var tableColData=tableColumns[col];
        if(!tableColData||!tableColData.data||!tableColData.name) continue;
        var tableColumnsDataItemForHTable= { data:tableColData.data };
        if(tableColData.name!==undefined) tableColumnsDataItemForHTable.name=tableColData.name;
        if(tableColData.width!==undefined) tableColumnsDataItemForHTable.width=tableColData.width;
        if(tableColData.type!==undefined) tableColumnsDataItemForHTable.type=tableColData.type;
        if(tableColData.align!==undefined) tableColumnsDataItemForHTable.align=tableColData.align;
        if(tableColData.useFilter!==undefined) tableColumnsDataItemForHTable.useFilter=tableColData.useFilter;
        if(tableColData.readOnly!==undefined) tableColumnsDataItemForHTable.readOnly=tableColData.readOnly;
        if(tableColData.visible!==undefined) tableColumnsDataItemForHTable.visible=tableColData.visible;
        if(tableColData.format!==undefined) tableColumnsDataItemForHTable.format=tableColData.format;
        if(tableColData.datetimeFormat!==undefined) tableColumnsDataItemForHTable.datetimeFormat=tableColData.datetimeFormat;
        if(tableColData.format!==undefined) tableColumnsDataItemForHTable.format=tableColData.format;
        if(tableColData.language!==undefined) tableColumnsDataItemForHTable.language=tableColData.language;
        if(tableColData.checkedTemplate!==undefined) tableColumnsDataItemForHTable.checkedTemplate=tableColData.checkedTemplate;
        if(tableColData.uncheckedTemplate!==undefined) tableColumnsDataItemForHTable.uncheckedTemplate=tableColData.uncheckedTemplate;
        if(tableColData.strict!==undefined) tableColumnsDataItemForHTable.strict=tableColData.strict;
        if(tableColData.allowInvalid!==undefined) tableColumnsDataItemForHTable.allowInvalid=tableColData.allowInvalid;
        if(tableColData.sourceURL!==undefined) tableColumnsDataItemForHTable.sourceURL=tableColData.sourceURL;
        tableColumnsDataForHTable.push(tableColumnsDataItemForHTable);
        if (tableColumnsDataItemForHTable.type=="dateAsText"){
            tableColumnsDataItemForHTable.type="text";
            //if(!tableColumnsDataItemForHTable.dateFormat) tableColumnsDataItemForHTable.dateFormat="DD.MM.YY";
            if(!tableColumnsDataItemForHTable.datetimeFormat) tableColumnsDataItemForHTable.datetimeFormat="DD.MM.YY";
        } else if (tableColumnsDataItemForHTable.type=="datetimeAsText"){
            tableColumnsDataItemForHTable.type="text";
            //if(!tableColumnsDataItemForHTable.dateFormat) tableColumnsDataItemForHTable.dateFormat="DD.MM.YY HH:mm:ss";
            if(!tableColumnsDataItemForHTable.datetimeFormat) tableColumnsDataItemForHTable.datetimeFormat="DD.MM.YY HH:mm:ss";
        } else if(tableColumnsDataItemForHTable.type=="numeric"){
            if(!tableColumnsDataItemForHTable.format) tableColumnsDataItemForHTable.format="#,###,###,##0.[#########]";
            if(!tableColumnsDataItemForHTable.language) tableColumnsDataItemForHTable.language="ru-RU";
        } else if(tableColumnsDataItemForHTable.type=="numeric2"){
            tableColumnsDataItemForHTable.type="numeric";
            if(!tableColumnsDataItemForHTable.format) tableColumnsDataItemForHTable.format="#,###,###,##0.00[#######]";
            if(!tableColumnsDataItemForHTable.language) tableColumnsDataItemForHTable.language="ru-RU";
        } else if(tableColumnsDataItemForHTable.type=="checkbox"){
            if(!tableColumnsDataItemForHTable.checkedTemplate) tableColumnsDataItemForHTable.checkedTemplate="1";
            if(!tableColumnsDataItemForHTable.uncheckedTemplate) tableColumnsDataItemForHTable.uncheckedTemplate="0";
        } else if(tableColumnsDataItemForHTable.type=="combobox"||tableColumnsDataItemForHTable.type=="comboboxWN") {
            if (!tableColumnsDataItemForHTable.strict)
                if(tableColumnsDataItemForHTable.type=="combobox") tableColumnsDataItemForHTable.strict =true;
                else tableColumnsDataItemForHTable.strict= false;
            if (!tableColumnsDataItemForHTable.allowInvalid) tableColumnsDataItemForHTable.allowInvalid= false;
            tableColumnsDataItemForHTable.type="autocomplete";
        } else if(!tableColumnsDataItemForHTable.type) tableColumnsDataItemForHTable.type="text";
    }
    return tableColumnsDataForHTable;
}
/**
 * params = { source,
 *      tableColumns = [
 *          {data:<sourceFieldName>, name:<tableColumnHeader>, width:<tableColumnWidth>, type:<dataType>, readOnly:true/false, visible:true/false,
 *                dataSource:<sourceName>, sourceField:<sourceFieldName> },
 *          ...
 *      ],
 *      identifier= <sourceIDFieldName>,
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
    tableData.columns= _getTableColumnsDataForHTable(params.tableColumns);
    tableData.identifier=params.identifier;
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
    params.tableData=tableData;
    this.getDataItemsForTable(params, resultCallback);
}
/**
 * set column width and type for tableColumnItem.data containing "QTY"/"PRICE"/"SUM"/"NUMBER"/"DATE"
 */
function _getTableColumnsDataForDocHTable(tableColumns){
    if (!tableColumns) return tableColumns;
    for(var col=0;col<tableColumns.length;col++){
        var tableColData=tableColumns[col];
        if(!tableColData||!tableColData.data) continue;
        if(tableColData.width===undefined){
            if(tableColData.data.indexOf("QTY")>=0) tableColData.width=50;
            else if(tableColData.data.indexOf("PRICE")>=0) tableColData.width=65;
            else if(tableColData.data.indexOf("SUM")>=0) tableColData.width=80;
            else if(tableColData.data.indexOf("NUMBER")>=0||tableColData.data.indexOf("POS")>=0) tableColData.width=65;
            else if(tableColData.data.indexOf("DATE")>=0) tableColData.width=55;
        }
        if(tableColData.type===undefined){
            if(tableColData.data.indexOf("QTY")>=0) tableColData.type="numeric";
            else if(tableColData.data.indexOf("PRICE")>=0) tableColData.type="numeric2";
            else if(tableColData.data.indexOf("SUM")>=0) tableColData.type="numeric2";
            else if(tableColData.data.indexOf("NUMBER")>=0||tableColData.data.indexOf("POS")>=0) tableColData.type="numeric";
            else if(tableColData.data.indexOf("DATE")>=0) tableColData.type="dateAsText";
        }
    }
    return tableColumns;
}
function _getDataForDocTable(params, resultCallback){
    var tableData={};
    if(!params){                                                                                        log.error("FAILED _getDataForDocTable! Reason: no function parameters!");//test
        tableData.error="FAILED _getDataForDocTable! Reason: no function parameters!";
        resultCallback(tableData);
        return;
    }
    if(!params.tableColumns){                                                                           log.error("FAILED _getDataForDocTable! Reason: no table columns!");//test
        tableData.error="FAILED _getDataForDocTable! Reason: no table columns!";
        resultCallback(tableData);
        return;
    }
    tableData.columns= _getTableColumnsDataForHTable(_getTableColumnsDataForDocHTable(params.tableColumns));
    tableData.identifier=params.identifier;
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
    params.tableData=tableData;
    this.getDataItemsForTable(params, resultCallback);
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
 * <value> instanceof Date converted to sting by format yyyy-mm-dd HH:MM:ss !!!
 * resultCallback = function(result = { updateCount, error }
 */
function _insDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _insDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed insert data item! Reason:no function parameters!"});
        return;
    }
    if(!params.tableName&&this.source) params.tableName=this.source;
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
        var insDataItemValue=params.insData[fieldName];
        if(insDataItemValue&&(insDataItemValue instanceof Date)) {
            insDataItemValue=dateFormat(insDataItemValue,"yyyy-mm-dd HH:MM:ss");
        }
        fieldsValues.push(insDataItemValue);
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
 * params = { tableName, idFieldName,
 *      insData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { updateCount, error, resultItem }
 */
function _insDataItemWithNewID(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _insDataItemWithNewID! Reason: no parameters!");//test
        resultCallback({ error:"Failed insert data item with new ID! Reason:no function parameters!"});
        return;
    }
    var idFieldName= params.idFieldName;
    if (!idFieldName) {                                                                                 log.error("FAILED _insDataItemWithNewID "+params.tableName+"! Reason: no id field!");//test
        resultCallback({ error:"Failed insert data item with new ID! Reason:no id field name!"});
        return;
    }
    params.insData[idFieldName]=util.getUIDNumber();
    this.insDataItem({idFieldName:idFieldName, insData:params.insData}, function(result){
        if(result&&result.updateCount>0)result.resultItem=params.insData;
        resultCallback(result);
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
    if(!params.tableName&&this.source) params.tableName=this.source;
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
        var updDataItemValue=params.updData[fieldName];
        if(updDataItemValue&&(updDataItemValue instanceof Date)) {
            updDataItemValue=dateFormat(updDataItemValue,"yyyy-mm-dd HH:MM:ss");
        }
        fieldsValues.push(updDataItemValue);
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
 * params = { tableName, idFieldName,
 *      storeData = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { updateCount, resultItem, error } )
 */
function _storeDataItem(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _storeDataItem! Reason: no parameters!");//test
        resultCallback({ error:"Failed store data item! Reason:no function parameters!"});
        return;
    }
    if (!params.tableName) params.tableName=this.source;
    if (!params.tableName) {                                                                            log.error("FAILED _storeDataItem! Reason: no table name!");//test
        resultCallback({ error:"Failed store data item! Reason:no table name for store!"});
        return;
    }
    if (!params.storeData) {                                                                            log.error("FAILED _storeDataItem "+params.tableName+"! Reason: no data for store!");//test
        resultCallback({ error:"Failed store data item! Reason:no data for store!"});
        return;
    }

    var idFieldName= params.idFieldName;
    if (!idFieldName) {                                                                                 log.error("FAILED _storeDataItem "+params.tableName+"! Reason: no id field!");//test
        resultCallback({ error:"Failed store data item! Reason:no id field name!"});
        return;
    }
    var idValue=params.storeData[idFieldName];
    if (idValue===undefined||idValue===null){//insert
        this.insDataItemWithNewID({idFieldName:idFieldName, insData:params.storeData}, resultCallback);
        return;
    }
    //update
    var updCondition={}; updCondition[idFieldName]=params.storeData[idFieldName];
    var updData={};
    for(var storeItemName in params.storeData)
        if(storeItemName!=idFieldName) updData[storeItemName]= params.storeData[storeItemName];
    this.updDataItem({idFieldName:idFieldName, updData:updData, conditions:updCondition}, function(result){
        if(result&&result.updateCount>0)result.resultItem=params.storeData;
        resultCallback(result);
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
    if(!params.tableName&&this.source) params.tableName=this.source;
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
 * params = { tableName, resultFields,
 *      findByFields,
 *      idFieldName, fieldsValues = {<tableFieldName>:<value>,<tableFieldName>:<value>,<tableFieldName>:<value>,...}
 * }
 * resultCallback = function(result = { resultItem, error } )
 */
function _findDataItemByOrCreateNew(params, resultCallback) {
    if (!params) {                                                                                      log.error("FAILED _findDataItemByOrCreateNew! Reason: no parameters!");//test
        resultCallback({ error:"Failed find/create data item! Reason:no function parameters!"});
        return;
    }
    if (!params.resultFields||!params.resultFields.length) {                                            log.error("FAILED _findDataItemByOrCreateNew! Reason: no result fields!");//test
        resultCallback({ error:"Failed find/create data item! Reason:no result fields!"});
        return;
    }
    if (!params.findByFields||!params.findByFields.length) {                                            log.error("FAILED _findDataItemByOrCreateNew! Reason: no fields for find condition!");//test
        resultCallback({ error:"Failed find/create data item! Reason:no fields for find condition!"});
        return;
    }
    if (!params.idFieldName) {                                                                          log.error("FAILED _findDataItemByOrCreateNew! Reason: no id field!");//test
        resultCallback({ error:"Failed find/create data item! Reason:no id field!"});
        return;
    }
    if (!params.fieldsValues) {                                                                         log.error("FAILED _findDataItemByOrCreateNew! Reason: no fields values!");//test
        resultCallback({ error:"Failed find/create data item! Reason:no fields values!"});
        return;
    }
    var thisInstance=this;
    var findCondition={};
    for(var ind=0;ind<params.findByFields.length;ind++) {
        var fieldName=params.findByFields[ind];
        findCondition[fieldName+"="]=params.fieldsValues[fieldName];
    }
    this.getDataItem({fields:params.resultFields,conditions:findCondition},
        function(result) {
            if (result.error) {
                resultCallback({ error:"Failed find/create data item! Reason:"+result.error});
                return;
            }
            if (!result.item) {
                thisInstance.insDataItemWithNewID({idFieldName:params.idFieldName,insData:params.fieldsValues}, resultCallback);
                return;
            }
            resultCallback({resultItem:result.item});
        });
}

/**
 * params = { tableName, idFieldName, tableColumns
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
    if (!params.tableColumns) {                                                                             log.error("FAILED _insTableDataItem "+params.tableName+"! Reason: no table columns!");//test
        resultCallback({ error:"Failed insert table data item! Reason:no table columns!"});
        return;
    }
    params.insData={};
    if(this.fields){
        for(var i in this.fields){
            var fieldName=this.fields[i];
            params.insData[fieldName]=(params.insTableData[fieldName]==undefined)?null:params.insTableData[fieldName];
        }
    } else params.insData=params.insTableData;
    var thisInstance=this;
    _insDataItem(params, function(insResult){
        if(insResult.error){
            resultCallback(insResult);
            return;
        }
        var resultFields=[];
        for(var fieldName in params.insTableData) resultFields.push(fieldName);
        var getResultConditions={}; getResultConditions[params.tableName+"."+idFieldName+"="]=params.insTableData[idFieldName];
        thisInstance.getDataItemForTable({source:params.tableName, tableColumns:params.tableColumns, conditions:getResultConditions},
            function(result){
                if(result.error) insResult.error="Failed get result inserted data item! Reason:"+result.error;
                if (result.item) insResult.resultItem= result.item;
                resultCallback(insResult);
            });
    });
}

/**
 * params = { tableName, idFieldName,
 *      tableColumns=[ {<tableColumnData>},... ],
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
    var thisInstance=this;
    _updDataItem(params, function(updResult){
        if(updResult.error){
            resultCallback(updResult);
            return;
        }
        var resultFields=[];
        for(var fieldName in params.updTableData) resultFields.push(fieldName);
        var getResultConditions={}; getResultConditions[params.tableName+"."+idFieldName+"="]=params.updTableData[idFieldName];
        thisInstance.getDataItemForTable({source:params.tableName, tableColumns:params.tableColumns, conditions:getResultConditions},
            function(result){
                if(result.error) updResult.error="Failed get result updated data item! Reason:"+result.error;
                if (result.item) updResult.resultItem= result.item;
                resultCallback(updResult);
            });
    });
}

/**
 * params = { tableName, idFieldName, tableColumns,
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
    if (!params.tableColumns) {                                                                         log.error("FAILED _storeTableDataItem "+params.tableName+"! Reason: no table columns!");//test
        resultCallback({ error:"Failed store table data item! Reason:no table columns!"});
        return;
    }
    var idValue=params.storeTableData[idFieldName];
    if (idValue===undefined||idValue===null){//insert
        params.storeTableData[idFieldName]=util.getUIDNumber();
        this.insTableDataItem({tableName:params.tableName, idFieldName:idFieldName, tableColumns:params.tableColumns,
            insTableData:params.storeTableData}, resultCallback);
        return;
    }
    //update
    this.updTableDataItem({tableName:params.tableName, idFieldName:idFieldName, tableColumns:params.tableColumns,
        updTableData:params.storeTableData}, resultCallback);
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
    params.conditions={}; params.conditions[params.tableName+"."+idFieldName+"="]=idFieldValue;
    _delDataItem(params, function(delResult){
        if (delResult.updateCount==1) {
            delResult.resultItem= {};
            delResult.resultItem[idFieldName]=idFieldValue;
        }
        resultCallback(delResult);
    });
}
