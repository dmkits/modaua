var changeLog=[
    { "changeID": "dir_units__1", "changeDatetime": "2016-08-29T11:41:00+03:00", "changeObj": "dir_units",
        "changeVal": "CREATE TABLE dir_units(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8" },
    { "changeID": "dir_units__2", "changeDatetime": "2016-08-29T11:42:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN NAME VARCHAR(200) NOT NULL" },
    { "changeID": "dir_units__3", "changeDatetime": "2016-08-29T11:43:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD CONSTRAINT DIR_UNITS_NAME_UNIQUE UNIQUE(NAME)" },
    { "changeID": "dir_units__4", "changeDatetime": "2016-08-29T11:44:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN FULL_NAME VARCHAR(500) NOT NULL" },
    { "changeID": "dir_units__5", "changeDatetime": "2016-08-29T11:45:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN NOTE VARCHAR(500)" },
    { "changeID": "dir_units__6", "changeDatetime": "2016-08-29T11:46:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN CITY VARCHAR(100)" },
    { "changeID": "dir_units__7", "changeDatetime": "2016-08-29T11:47:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN ADDRESS VARCHAR(255)" },
    { "changeID": "dir_units__8", "changeDatetime": "2016-08-29T11:48:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN NOT_USED SMALLINT NOT NULL" },
    { "changeID": "dir_units__9", "changeDatetime": "2016-08-29T11:49:00+03:00", "changeObj": "dir_units",
        "changeVal": "INSERT INTO dir_units(ID,NAME,FULL_NAME,NOTE,CITY,ADDRESS,NOT_USED) values (0,'Гл.офис','офис','офис','Днипро','Днипро',0)" },
    { "changeID": "dir_units_10", "changeDatetime": "2016-08-29T11:50:00+03:00", "changeObj": "dir_units",
        "changeVal": "INSERT INTO dir_units(ID,NAME,FULL_NAME,NOTE,CITY,ADDRESS,NOT_USED) values (1,'Магазин 1','Магазин 1','Магазин 1','Днипро','Днипро',0);" }
];
module.exports.changeLog=changeLog;

var tableName="dir_units", tableColumns=[
    {"data": "ID", "name": "ID", "width": 100, "type": "text", readOnly:true, visible:false},
    {"data": "NAME", "name": "NAME", "width": 200, "type": "text"},
    {"data": "FULL_NAME", "name": "FULL_NAME", "width": 200, "type": "text"},
    {"data": "NOTE", "name": "NOTE", "width": 200, "type": "text"},
    {"data": "CITY", "name": "CITY", "width": 200, "type": "text"},
    {"data": "ADDRESS", "name": "ADDRESS", "width": 200, "type": "text"}
], idField=tableColumns[0].data;
module.exports.tableColumns=tableColumns;

module.exports.validateData= {tableName:tableName, tableColumns:tableColumns, idField:idField};

var dm=this;
/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForDirUnitsTable= function(resultCallback){
    dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField}, resultCallback);
};
module.exports.getNewDataForDirUnitsTable= function(resultCallback){
    //resultCallback({});
    dm.setDataItemForTable({tableColumns:tableColumns,
        values:[null,"Новое подразделение","Новое подразделение","Новое подразделение","Днепр","-"]}, resultCallback);
};
module.exports.storeDirUnitsTableData= function(resultCallback){
    resultCallback({});
    //dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField}, resultCallback);
};
module.exports.deleteDirUnitsTableData= function(resultCallback){
    resultCallback({});
    //dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField}, resultCallback);
};

