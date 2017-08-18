var changeLog=[
    { "changeID":"dir_products_categories__1", "changeDatetime": "2016-08-31T18:15:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "CREATE TABLE dir_products_categories(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8" },
    { "changeID":"dir_products_categories__2", "changeDatetime": "2016-08-31T18:16:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN CODE INTEGER NOT NULL" },
    { "changeID":"dir_products_categories__3", "changeDatetime": "2016-08-31T18:17:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN NAME VARCHAR(255) NOT NULL" },
    { "changeID":"dir_products_categories__4", "changeDatetime": "2016-08-31T18:18:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD CONSTRAINT DIR_PRODUCTS_CATEGORIES_CODE_NAME_UNIQUE UNIQUE(CODE,NAME)" },
    { "changeID":"dir_products_categories__5", "changeDatetime": "2016-09-01T13:21:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN CONSTANT SMALLINT NOT NULL" },
    { "changeID":"dir_products_categories__6", "changeDatetime": "2016-09-11T20:01:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN GENDER_ID BIGINT UNSIGNED NOT NULL" },
    { "changeID":"dir_products_categories__7", "changeDatetime": "2016-09-11T20:02:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD CONSTRAINT DIR_PRODUCTS_CATEGORIES_GENDER_ID_FK FOREIGN KEY (GENDER_ID) REFERENCES dir_products_genders(ID)" }
];
module.exports.changeLog=changeLog;

var tableName="dir_products_categories", tableFields=["ID","CODE","NAME","CONSTANT","GENDER_ID"], idField=tableFields[0];

module.exports.validateData= {tableName:tableName, fields:tableFields, idField:idField};

var tableColumns=[
    {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
    {"data": "GENDER_CODE", "name": "Код группы", "width": 90, "type": "combobox"},
    {"data": "GENDER_NAME", "name": "Наименование группы", "width": 200, "type": "combobox"},
    {"data": "CODE", "name": "Код категории", "width": 100, "type": "text"},
    {"data": "NAME", "name": "Наименование категории", "width": 200, "type": "text"},
    {"data": "CONSTANT", "name": "Постоянная категория", "width": 150, "type": "checkbox"}
];

var dm=this;
module.exports.getNewDataForProductsCategoriesTable= function(resultCallback){
    dm.setDataItemForTable({tableColumns:tableColumns,
        values:[null,"","","","Новая категория","0"]}, resultCallback);
};

module.exports.storeProductsCategoriesTableData= function(storeTableData, resultCallback){

    dm.storeTableDataItem({tableName:tableName, idFieldName:idField, storeTableData:storeTableData}, resultCallback);
};
module.exports.deleteProductsCategoriesTableData= function(delTableData, resultCallback){
    dm.delTableDataItem({tableName:tableName, idFieldName:idField, delTableData:delTableData}, resultCallback);
};
