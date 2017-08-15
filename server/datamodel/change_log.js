var changeLog= [
    { "changeID":"chl__1", "changeDatetime":"2016-08-29T09:01:00+03:00",  "changeObj":"change_log",
        "changeVal":"CREATE TABLE change_log( ID VARCHAR(64) NOT NULL PRIMARY KEY, APPLIED_DATETIME TIMESTAMP NOT NULL, CHANGE_DATETIME TIMESTAMP NULL, CHANGE_OBJ VARCHAR(255) NOT NULL, CHANGE_VAL VARCHAR(20000) NOT NULL) CHARACTER SET utf8"},
    { "changeID":"chl__2", "changeDatetime":"2016-08-29T09:02:00+03:00",  "changeObj":"change_log",
        "changeVal":"ALTER TABLE change_log ALTER COLUMN CHANGE_DATETIME DROP DEFAULT"}
];
module.exports.changeLog=changeLog;

var tableName="change_log", tableColumns=[
      {"data": "ID", "name": "changeID", "width": 200, "type": "text"}
    , {"data": "CHANGE_DATETIME", "name": "changeDatetime", "width": 120, "type": "text", "dateFormat":"YYYY-MM-DD HH:mm:ss"}
    , {"data": "CHANGE_OBJ", "name": "changeObj", "width": 200, "type": "text"}
    , {"data": "CHANGE_VAL", "name": "changeVal", "width": 450, "type": "text"}
    , {"data": "APPLIED_DATETIME", "name": "appliedDatetime", "width": 120, "type": "text", "dateFormat":"YYYY-MM-DD HH:mm:ss"}
], idField=tableColumns[0].data;
module.exports.tableColumns=tableColumns;

module.exports.validateData= {tableName:tableName, tableColumns:tableColumns, idField:idField};

var dm=this;
/**
 * resultCallback = function(result={ item, error, errorCode })
 */
module.exports.checkIfChangeLogExists= function(resultCallback) {
    dm.getDataItem({tableName:tableName, tableFields:["ID"], conditions:{"ID IS NULL":null}}, resultCallback);
};

/**
 * resultCallback = function(result={ item, error, errorCode })
 */
module.exports.getChangeLogItemByID= function(id, resultCallback) {
    dm.getDataItem({tableName:tableName,
        tableFields:["ID","CHANGE_DATETIME","CHANGE_OBJ","CHANGE_VAL","APPLIED_DATETIME"],
        conditions:{"ID=":id}}, resultCallback);
};

/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForChangeLogTable= function(conditions, resultCallback){
    dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField, conditions:conditions}, resultCallback);
};

/**
 * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error } )
 */
module.exports.insertToChangeLog= function(itemData, resultCallback) {
    dm.insTableDataItem({tableName:tableName, idFieldName:"ID", insTableData:itemData}, resultCallback);
};
