var changeLog=[
  { "changeID": "dir_products__1", "changeDatetime": "2016-08-30T16:01:00+03:00", "changeObj": "dir_products",
    "changeVal": "CREATE TABLE dir_products(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
    "tableName":"dir_products", "field":["ID"], "id":"ID" },
  { "changeID": "dir_products__2", "changeDatetime": "2016-08-30T16:02:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN CODE INTEGER NOT NULL",
    "field":["CODE"] },
  { "changeID": "dir_products__3", "changeDatetime": "2016-08-30T16:03:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN NAME VARCHAR(255) NOT NULL",
    "field":["NAME"] },
  { "changeID": "dir_products__4", "changeDatetime": "2016-08-30T16:04:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN PRINT_NAME VARCHAR(255) NOT NULL",
    "field":["PRINT_NAME"] },
  { "changeID": "dir_products__5", "changeDatetime": "2016-08-30T16:05:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_CODE_UNIQUE UNIQUE(CODE)" },
  { "changeID": "dir_products__6", "changeDatetime": "2016-08-30T16:06:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_NAME_UNIQUE UNIQUE(NAME)" },
  { "changeID": "dir_products__7", "changeDatetime": "2016-08-30T16:07:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN UM VARCHAR(15) NOT NULL",
    "field":["UM"] },
  { "changeID": "dir_products__8", "changeDatetime": "2016-08-30T16:08:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN PBARCODE BIGINT UNSIGNED NOT NULL",
    "field":["PBARCODE"] },
  { "changeID": "dir_products__9", "changeDatetime": "2016-08-30T16:09:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_PBARCODE_UNIQUE UNIQUE(PBARCODE)" },
  { "changeID": "dir_products_14", "changeDatetime": "2016-09-04T18:31:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN ARTICLE_ID BIGINT UNSIGNED NOT NULL",
    "field":["ARTICLE_ID"] },
  { "changeID": "dir_products_15", "changeDatetime": "2016-09-04T18:32:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_ARTICLE_ID_FK"
    +" FOREIGN KEY (ARTICLE_ID) REFERENCES dir_products_articles(ID)" },
  { "changeID": "dir_products_16", "changeDatetime": "2016-09-09T16:11:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN KIND_ID BIGINT UNSIGNED NOT NULL",
    "field":["KIND_ID"] },
  { "changeID": "dir_products_17", "changeDatetime": "2016-09-09T16:12:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_KIND_ID_FK"
    +" FOREIGN KEY (KIND_ID) REFERENCES dir_products_kinds(ID)" },
  { "changeID": "dir_products_18", "changeDatetime": "2016-09-09T16:31:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN COMPOSITION_ID BIGINT UNSIGNED NOT NULL",
    "field":["COMPOSITION_ID"] },
  { "changeID": "dir_products_19", "changeDatetime": "2016-09-09T16:32:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_COMPOSITION_ID_FK"
    +" FOREIGN KEY (COMPOSITION_ID) REFERENCES dir_products_compositions(ID)" },
  { "changeID": "dir_products_20", "changeDatetime": "2016-09-10T20:11:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN SIZE_ID BIGINT UNSIGNED NOT NULL",
    "field":["SIZE_ID"] },
  { "changeID": "dir_products_21", "changeDatetime": "2016-09-10T20:12:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_SIZE_ID_FK"
    +" FOREIGN KEY (SIZE_ID) REFERENCES dir_products_sizes(ID)" },
  { "changeID": "dir_products_24", "changeDatetime": "2016-09-12T09:41:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD COLUMN COLLECTION_ID BIGINT UNSIGNED NOT NULL",
    "field":["COLLECTION_ID"] },
  { "changeID": "dir_products_25", "changeDatetime": "2016-09-12T09:42:00+03:00", "changeObj": "dir_products",
    "changeVal": "ALTER TABLE dir_products ADD CONSTRAINT DIR_PRODUCTS_COLLECTION_ID_FK"
    +" FOREIGN KEY (COLLECTION_ID) REFERENCES dir_products_collections(ID)" }
];
module.exports.changeLog=changeLog;

var tableName="dir_products", tableColumns=[
  {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
  {"data": "CODE", "name": "Код", "width": 100, "type": "text"},
  {"data": "NAME", "name": "Наименование", "width": 200, "type": "text"},
  {"data": "PRINT_NAME", "name": "Печатное наименование", "width": 200, "type": "text"},
  {"data": "UM", "name": "Ед.изм.", "width": 80, "type": "text"},
  {"data": "PBARCODE", "name": "Штрихкод", "width": 120, "type": "text"},
  {"data": "ARTICLE_ID", "name": "ARTICLE_ID", "width": 80, "type": "text"},
  {"data": "KIND_ID", "name": "KIND_ID", "width": 80, "type": "text"},
  {"data": "COMPOSITION_ID", "name": "COMPOSITION_ID", "width": 80, "type": "text"},
  {"data": "SIZE_ID", "name": "SIZE_ID", "width": 80, "type": "text"},
  {"data": "COLLECTION_ID", "name": "COLLECTION_ID", "width": 80, "type": "text"}
], idField=tableColumns[0].data;

module.exports.validateData= {tableName:tableName, tableColumns:tableColumns, idField:idField};

var dm=this;
/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForDirProductsTable= function(conditions, resultCallback){
  dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField, conditions:conditions}, resultCallback);
};
//module.exports.getNewDataForDirProductsTable= function(resultCallback){
//  dm.setDataItemForTable({tableColumns:tableColumns,
//    values:[null,"Новый контрагент","Новый контрагент","Новый контрагент","Украина","Днепр","-","0","0"]}, resultCallback);
//};
module.exports.updDirProductsTableData= function(storeTableData, resultCallback){                            console.log("storeDirContractorsTableData storeTableData",storeTableData);
  dm.storeTableDataItem({tableName:tableName, idFieldName:idField, storeTableData:storeTableData}, resultCallback);
};
//module.exports.deleteDirProductsTableData= function(delTableData, resultCallback){
//  dm.delTableDataItem({tableName:tableName, idFieldName:idField, delTableData:delTableData}, resultCallback);
//};