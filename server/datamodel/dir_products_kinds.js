var changeLog=[
  { "changeID": "dir_products_kinds__1", "changeDatetime": "2016-09-09T16:01:00+03:00", "changeObj": "dir_products_kinds",
  "changeVal": "CREATE TABLE dir_products_kinds(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8" },
  { "changeID": "dir_products_kinds__2", "changeDatetime": "2016-09-09T16:02:00+03:00", "changeObj": "dir_products_kinds",
    "changeVal": "ALTER TABLE dir_products_kinds ADD COLUMN NAME VARCHAR(255) NOT NULL" },
  { "changeID": "dir_products_kinds__3", "changeDatetime": "2016-09-09T16:03:00+03:00", "changeObj": "dir_products_kinds",
    "changeVal": "ALTER TABLE dir_products_kinds ADD CONSTRAINT DIR_PRODUCTS_KINDS_NAME_UNIQUE UNIQUE(NAME)" }
];
module.exports.changeLog=changeLog;

var tableName="dir_products_kinds", tableFields=["ID","NAME"], idField=tableFields[0];

module.exports.modelData= {tableName:tableName, fields:tableFields, idField:idField};