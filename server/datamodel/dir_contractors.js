var changeLog = [
  { "changeID": "dir_contractors__1", "changeDatetime": "2016-08-30T08:41:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "CREATE TABLE dir_contractors(ID BIGINT UNSIGNED PRIMARY KEY NOT NULL) CHARACTER SET utf8" },
  { "changeID": "dir_contractors__2", "changeDatetime": "2016-08-30T08:42:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN NAME VARCHAR(200) NOT NULL" },
  { "changeID": "dir_contractors__3", "changeDatetime": "2016-08-30T08:43:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD CONSTRAINT DIR_CONTRACTORS_NAME_UNIQUE UNIQUE(NAME)" },
  { "changeID": "dir_contractors__4", "changeDatetime": "2016-08-30T08:44:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN FULL_NAME VARCHAR(500) NOT NULL" },
  { "changeID": "dir_contractors__5", "changeDatetime": "2016-08-30T08:45:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN NOTE VARCHAR(500)" },
  { "changeID": "dir_contractors__6", "changeDatetime": "2016-08-30T08:46:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN CITY VARCHAR(100)" },
  { "changeID": "dir_contractors__7", "changeDatetime": "2016-08-30T08:47:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN ADDRESS VARCHAR(255)" },
  { "changeID": "dir_contractors__8", "changeDatetime": "2016-08-30T08:48:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN IS_SUPPLIER SMALLINT NOT NULL" },
  { "changeID": "dir_contractors__9", "changeDatetime": "2016-08-30T08:49:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN IS_BUYER SMALLINT NOT NULL" },
  { "changeID": "dir_contractors_10", "changeDatetime": "2016-09-12T00:05:00+03:00", "changeObj": "dir_contractors",
    "changeVal": "ALTER TABLE dir_contractors ADD COLUMN COUNTRY VARCHAR(100) NOT NULL" },
  { "changeID": "dir_contractors_11", "changeDatetime": "2016-09-12T00:06:00+03:00", "changeObj": "dir_contractors",
    "changeVal":
        "INSERT INTO dir_contractors (ID,NAME,FULL_NAME,NOTE,COUNTRY,CITY,ADDRESS,IS_SUPPLIER,IS_BUYER) "
        +"values (0,'Розничный покупатель','Розничный покупатель','Розничный покупатель','Украина','Днепр','-',0,1)" },
  { "changeID": "dir_contractors_12", "changeDatetime": "2016-09-12T00:07:00+03:00", "changeObj": "dir_contractors",
    "changeVal":
        "INSERT INTO dir_contractors (ID,NAME,FULL_NAME,NOTE,COUNTRY,CITY,ADDRESS,IS_SUPPLIER,IS_BUYER) "
        +"values (1,'Поставщик 1','Поставщик 1','Поставщик 1','Украина','Днепр','-',1,0)" }
];
module.exports.changeLog=changeLog;

var tableName="dir_contractors", tableColumns=[
  {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
  {"data": "NAME", "name": "Наименование", "width": 120, "type": "text"},
  {"data": "FULL_NAME", "name": "Полное наименование", "width": 250, "type": "text"},
  {"data": "NOTE", "name": "Примечание", "width": 200, "type": "text"},
  {"data": "COUNTRY", "name": "Страна", "width": 100, "type": "text"},
  {"data": "CITY", "name": "Город", "width": 120, "type": "text"},
  {"data": "ADDRESS", "name": "Адрес", "width": 200, "type": "text"},
  {"data": "IS_SUPPLIER", "name": "Поставщик", "width": 120, "type": "checkbox"},
  {"data": "IS_BUYER", "name": "Покупатель", "width": 120, "type": "checkbox"}
], idField=tableColumns[0].data;

module.exports.validateData= {tableName:tableName, tableColumns:tableColumns, idField:idField};

var dm=this;
/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForDirContractorsTable= function(conditions, resultCallback){
  dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField, conditions:conditions}, resultCallback);
};
module.exports.getNewDataForDirContractorsTable= function(resultCallback){
  dm.setDataItemForTable({tableColumns:tableColumns,
    values:[null,"Новый контрагент","Новый контрагент","Новый контрагент","Украина","Днепр","-","0","0"]}, resultCallback);
};
module.exports.storeDirContractorsTableData= function(storeTableData, resultCallback){
  dm.storeTableDataItem({tableName:tableName, idFieldName:idField, storeTableData:storeTableData}, resultCallback);
};
module.exports.deleteDirContractorsTableData= function(delTableData, resultCallback){
  dm.delTableDataItem({tableName:tableName, idFieldName:idField, delTableData:delTableData}, resultCallback);
};
