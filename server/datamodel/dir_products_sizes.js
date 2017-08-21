var changeLog=[
  { "changeID": "dir_products_sizes__1", "changeDatetime": "2016-09-10T20:01:00+03:00", "changeObj": "dir_products_sizes",
  "changeVal": "CREATE TABLE dir_products_sizes(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
    "tableName":"dir_products_sizes", "field":["ID"], "id":"ID" },
  { "changeID": "dir_products_sizes__2", "changeDatetime": "2016-09-10T20:02:00+03:00", "changeObj": "dir_products_sizes",
    "changeVal": "ALTER TABLE dir_products_sizes ADD COLUMN VALUE VARCHAR(255) NOT NULL",
    "field":["VALUE"] },
  { "changeID": "dir_products_sizes__3", "changeDatetime": "2016-09-10T20:03:00+03:00", "changeObj": "dir_products_sizes",
    "changeVal": "ALTER TABLE dir_products_sizes ADD CONSTRAINT DIR_DIR_PRODUCTS_SIZES_VALUE_UNIQUE UNIQUE(VALUE)" }
];
module.exports.changeLog=changeLog;

var tableName="dir_products_sizes", tableFields=["ID","VALUE"], idField=tableFields[0];

module.exports.modelData= {tableName:tableName, fields:tableFields, idField:idField};