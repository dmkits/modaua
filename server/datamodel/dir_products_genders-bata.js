var changeLog=[
  { "changeID":"dir_products_genders__1", "changeDatetime": "2016-08-31T18:01:00.000+0300", "changeObj": "dir_products_genders",
    "changeVal": "CREATE TABLE dir_products_genders(ID BIGINT NOT NULL PRIMARY KEY) CHARACTER SET utf8" },
  { "changeID":"dir_products_genders__2", "changeDatetime": "2016-08-31T18:02:00.000+0300", "changeObj": "dir_products_genders",
    "changeVal": "ALTER TABLE dir_products_genders ADD COLUMN CODE VARCHAR(1) NOT NULL" },
  { "changeID":"dir_products_genders__3", "changeDatetime": "2016-08-31T18:03:00.000+0300", "changeObj": "dir_products_genders",
    "changeVal": "ALTER TABLE dir_products_genders ADD COLUMN NAME VARCHAR(255) NOT NULL" },
  { "changeID":"dir_products_genders__4", "changeDatetime": "2016-08-31T18:04:00.000+0300", "changeObj": "dir_products_genders",
    "changeVal": "ALTER TABLE dir_products_genders ADD CONSTRAINT DIR_PRODUCTS_GENDERS_CODE_UNIQUE UNIQUE(CODE)" },
  { "changeID":"dir_products_genders__5", "changeDatetime": "2016-08-31T18:05:00.000+0300", "changeObj": "dir_products_genders",
    "changeVal": "ALTER TABLE dir_products_genders ADD CONSTRAINT DIR_PRODUCTS_GENDERS_NAME_UNIQUE UNIQUE(NAME)" },
  { "changeID":"dir_products_genders__6", "changeDatetime": "2016-09-01T13:06:00.000+0300", "changeObj": "dir_products_genders",
    "changeVal": "ALTER TABLE dir_products_genders ADD COLUMN CONSTANT SMALLINT NOT NULL" }
];
module.exports.changeLog=changeLog;

var tableName="dir_products_genders", tableFields=["ID","CODE","NAME","CONSTANT"], idField=tableFields[0];

module.exports.validateData= {tableName:tableName, fields:tableFields, idField:idField};

var tableColumns=[
  {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
  {"data": "CODE", "name": "Код группы", "width": 90, "type": "text"},
  {"data": "NAME", "name": "Наименование группы", "width": 200, "type": "text"},
  {"data": "CONSTANT", "name": "Постоянная группа", "width": 130, "type": "checkbox"}
];

var dm=this;
/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForDirProductsGendersTable= function(conditions, resultCallback){
  dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField, conditions:conditions}, resultCallback);
};
module.exports.getNewDataForProductsGendersTable= function(resultCallback){
  dm.setDataItemForTable({tableColumns:tableColumns,
    values:[null,"","Новая группа","0"]}, resultCallback);
};
module.exports.storeProductsGendersTableData= function(storeTableData, resultCallback){
  dm.storeTableDataItem({tableName:tableName, idFieldName:idField, storeTableData:storeTableData}, resultCallback);
};
module.exports.deleteProductsGendersTableData= function(delTableData, resultCallback){
  dm.delTableDataItem({tableName:tableName, idFieldName:idField, delTableData:delTableData}, resultCallback);
};