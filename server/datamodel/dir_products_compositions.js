var changeLog=[
  { "changeID": "dir_products_compositions__1", "changeDatetime": "2016-09-09T16:21:00+03:00", "changeObj": "dir_products_compositions",
    "changeVal": "CREATE TABLE dir_products_compositions(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8" },
  { "changeID": "dir_products_compositions__2", "changeDatetime": "2016-09-09T16:22:00+03:00", "changeObj": "dir_products_compositions",
    "changeVal": "ALTER TABLE dir_products_compositions ADD COLUMN VALUE VARCHAR(255) NOT NULL" },
  { "changeID": "dir_products_compositions__3", "changeDatetime": "2016-09-09T16:23:00+03:00", "changeObj": "dir_products_compositions",
    "changeVal": "ALTER TABLE dir_products_compositions ADD CONSTRAINT DIR_PRODUCTS_COMPOSITIONS_VALUE_UNIQUE UNIQUE(VALUE)" }

];
module.exports.changeLog=changeLog;

var tableName="dir_products_compositions", tableFields=["ID","VALUE"], idField=tableFields[0];

module.exports.validateData= {tableName:tableName, fields:tableFields, idField:idField};