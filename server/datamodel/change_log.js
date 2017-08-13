var changeLog= [
    { "changeID":"chl__1", "changeDatetime":"2016-08-29T09:01:00.000",  "changeObj":"change_log", "changeVal":"CREATE TABLE change_log( ID VARCHAR(64) NOT NULL PRIMARY KEY, CHANGE_DATETIME TIMESTAMP NOT NULL, CHANGE_OBJ VARCHAR(255) NOT NULL, CHANGE_VAL VARCHAR(20000) NOT NULL, APPLIED_DATETIME TIMESTAMP NULL) CHARACTER SET utf8"},
    { "changeID":"chl__2", "changeDatetime":"2016-08-29T09:02:00.000",  "changeObj":"change_log", "changeVal":"ALTER TABLE change_log ALTER COLUMN CHANGE_DATETIME  DROP DEFAULT"},
    { "changeID":"chl__3", "changeDatetime":"2016-08-29T09:03:00.000",  "changeObj":"change_log", "changeVal":"ALTER TABLE change_log ALTER COLUMN APPLIED_DATETIME  DROP DEFAULT"}
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

module.exports.tableDataQuery= "select * from change_log order by CHANGE_DATETIME";

var dm=this;

/**
 * resultCallback = function(result)
 */
module.exports.getDataForChangeLogTable= function(resultCallback){
    dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField}, resultCallback);
};

module.exports.insertChangeLog= function(resultCallback){

};