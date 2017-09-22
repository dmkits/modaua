var changeLog=[
  { "changeID": "dir_products_types__1", "changeDatetime": "2017-09-22 12:00:00", "changeObj": "dir_products_types",
    "changeVal": "CREATE TABLE dir_products_types(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
    "tableName":"dir_products_types", "field":"ID", "id":"ID" },
  { "changeID": "dir_products_types__2", "changeDatetime": "2017-09-22 12:01:00", "changeObj": "dir_products_types",
    "changeVal": "ALTER TABLE dir_products_types ADD COLUMN NAME VARCHAR(255) NOT NULL",
    "field":"NAME" },
  { "changeID": "dir_products_types__3", "changeDatetime": "2017-09-22 12:02:00", "changeObj": "dir_products_types",
    "changeVal": "ALTER TABLE dir_products_types ADD CONSTRAINT DIR_PRODUCTS_TYPES_NAME_UNIQUE UNIQUE(NAME)" }
];
module.exports.changeLog=changeLog;
