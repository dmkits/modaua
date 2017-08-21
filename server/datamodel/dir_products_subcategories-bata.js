var changeLog=[
    { "changeID":"dir_products_subcategories__1", "changeDatetime": "2016-09-11T14:11:00.000+0300", "changeObj": "dir_products_subcategories",
        "changeVal": "CREATE TABLE dir_products_subcategories(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        "tableName":"dir_products_subcategories", "field":["ID"], "id":"ID" },
    { "changeID":"dir_products_subcategories__2", "changeDatetime": "2016-09-11T14:12:00.000+0300", "changeObj": "dir_products_subcategories",
        "changeVal": "ALTER TABLE dir_products_subcategories ADD COLUMN CODE INTEGER NOT NULL",
        "field":["CODE"] },
    { "changeID":"dir_products_subcategories__3", "changeDatetime": "2016-09-11T14:13:00.000+0300", "changeObj": "dir_products_subcategories",
        "changeVal": "ALTER TABLE dir_products_subcategories ADD COLUMN NAME VARCHAR(255) NOT NULL",
        "field":["NAME"] },
    { "changeID":"dir_products_subcategories__4", "changeDatetime": "2016-09-11T14:14:00.000+0300", "changeObj": "dir_products_subcategories",
        "changeVal": "ALTER TABLE dir_products_subcategories ADD CONSTRAINT DIR_DIR_PRODUCTS_SUBCATEGORIES_CODE_NAME_UNIQUE UNIQUE(CODE,NAME)" },
    { "changeID":"dir_products_subcategories__5", "changeDatetime": "2016-09-11T14:15:00.000+0300", "changeObj": "dir_products_subcategories",
        "changeVal": "ALTER TABLE dir_products_subcategories ADD COLUMN CONSTANT SMALLINT NOT NULL",
        "field":["CONSTANT"] }
];
module.exports.changeLog=changeLog;

var tableName="dir_products_subcategories", tableFields=["ID","CODE","NAME","CONSTANT"], idField=tableFields[0];

module.exports.validateData= {tableName:tableName, fields:tableFields, idField:idField};

var tableColumns=[
    {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
    {"data": "CATEGORY_CODE", "name": "Код категории", "width": 100, "type": "text"},
    {"data": "CATEGORY_NAME", "name": "Наименование категории", "width": 200, "type": "text"},
    {"data": "CATEGORY_CONSTANT", "name": "Постоянная категория", "width": 150, "type": "checkbox"},
    {"data": "SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 120, "type": "text"},
    {"data": "SUBCATEGORY_NAME", "name": "Наименование подкатегории", "width": 200, "type": "text"},
    {"data": "SUBCATEGORY_CONSTANT", "name": "Постоянная подкатегория", "width": 160, "type": "checkbox"}
];

var dm=this;
/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForDirProductsSubCategoriesTable= function(conditions, resultCallback){
    dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField, conditions:conditions}, resultCallback);
};
module.exports.getNewDataForProductsSubCategoriesTable= function(resultCallback){
    dm.setDataItemForTable({tableColumns:tableColumns,
        values:[null,"Новое подразделение","Новое подразделение","Новое подразделение","Днепр","-","0"]}, resultCallback);
};
module.exports.storeProductsSubCategoriesTableData= function(storeTableData, resultCallback){
    dm.storeTableDataItem({tableName:tableName, idFieldName:idField, storeTableData:storeTableData}, resultCallback);
};
module.exports.deleteProductsSubCategoriesTableData= function(delTableData, resultCallback){
    dm.delTableDataItem({tableName:tableName, idFieldName:idField, delTableData:delTableData}, resultCallback);
};