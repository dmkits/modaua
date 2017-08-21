var changeLog=[
    { "changeID":"dir_products_categories_subcategories__1", "changeDatetime": "2016-09-11T14:21:00.000+0300", "changeObj": "dir_products_categories_subcategories",
        "changeVal": "CREATE TABLE dir_products_categories_subcategories(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        "tableName":"dir_products_categories_subcategories", "field":["ID"], "id":"ID" },
    { "changeID":"dir_products_categories_subcategories__2", "changeDatetime": "2016-09-11T14:22:00.000+0300", "changeObj": "dir_products_categories_subcategories",
        "changeVal": "ALTER TABLE dir_products_categories_subcategories ADD COLUMN CATEGORY_ID BIGINT UNSIGNED NOT NULL",
        "field":["CATEGORY_ID"] },
    { "changeID":"dir_products_categories_subcategories__3", "changeDatetime": "2016-09-11T14:23:00.000+0300", "changeObj": "dir_products_categories_subcategories",
        "changeVal": "ALTER TABLE dir_products_categories_subcategories ADD CONSTRAINT DIR_PRODUCTS_CATEGORIES_SUBCATEGORIES_CATEGORY_ID_FK"
        +" FOREIGN KEY (CATEGORY_ID) REFERENCES dir_products_categories(ID)" },
    { "changeID":"dir_products_categories_subcategories__4", "changeDatetime": "2016-09-11T14:24:00.000+0300", "changeObj": "dir_products_categories_subcategories",
        "changeVal": "ALTER TABLE dir_products_categories_subcategories ADD COLUMN SUBCATEGORY_ID BIGINT UNSIGNED NOT NULL",
        "field":["SUBCATEGORY_ID"] },
    { "changeID":"dir_products_categories_subcategories__5", "changeDatetime": "2016-09-11T14:25:00.000+0300", "changeObj": "dir_products_categories_subcategories",
        "changeVal": "ALTER TABLE dir_products_categories_subcategories ADD CONSTRAINT DIR_PRODUCTS_CATEGORIES_SUBCATEGORIES_SUBCATEGORY_ID_FK"
        +" FOREIGN KEY (SUBCATEGORY_ID) REFERENCES dir_products_subcategories(ID)" },
    { "changeID":"dir_products_categories_subcategories__6", "changeDatetime": "2016-09-11T14:26:00.000+0300", "changeObj": "dir_products_categories_subcategories",
        "changeVal": "ALTER TABLE dir_products_categories_subcategories ADD CONSTRAINT DIR_PRODUCTS_CATS_SUBCATS_CATEGORY_ID_SUBCATEGORY_ID_UNIQUE"
        +" UNIQUE(CATEGORY_ID,SUBCATEGORY_ID)" }
];
module.exports.changeLog=changeLog;

var tableName="dir_products_categories_subcategories", tableFields=["ID","CATEGORY_ID","SUBCATEGORY_ID"], idField=tableFields[0];

module.exports.validateData= {tableName:tableName, fields:tableFields, idField:idField};
