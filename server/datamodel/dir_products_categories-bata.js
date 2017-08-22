var changeLog=[
    { "changeID":"dir_products_categories__1", "changeDatetime": "2016-08-31T18:15:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "CREATE TABLE dir_products_categories(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        "tableName":"dir_products_categories", "field":"ID", "id":"ID" },
    { "changeID":"dir_products_categories__2", "changeDatetime": "2016-08-31T18:16:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN CODE INTEGER NOT NULL",
        "field":"CODE" },
    { "changeID":"dir_products_categories__3", "changeDatetime": "2016-08-31T18:17:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN NAME VARCHAR(255) NOT NULL",
        "field":"NAME" },
    { "changeID":"dir_products_categories__4", "changeDatetime": "2016-08-31T18:18:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD CONSTRAINT DIR_PRODUCTS_CATEGORIES_CODE_NAME_UNIQUE UNIQUE(CODE,NAME)" },
    { "changeID":"dir_products_categories__5", "changeDatetime": "2016-09-01T13:21:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN CONSTANT SMALLINT NOT NULL",
        "field":"CONSTANT" },
    { "changeID":"dir_products_categories__6", "changeDatetime": "2016-09-11T20:01:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD COLUMN GENDER_ID BIGINT UNSIGNED NOT NULL",
        "field":"GENDER_ID" },
    { "changeID":"dir_products_categories__7", "changeDatetime": "2016-09-11T20:02:00.000+0300", "changeObj": "dir_products_categories",
        "changeVal": "ALTER TABLE dir_products_categories ADD CONSTRAINT DIR_PRODUCTS_CATEGORIES_GENDER_ID_FK"
        +" FOREIGN KEY (GENDER_ID) REFERENCES dir_products_genders(ID)" }
];
module.exports.changeLog=changeLog;
