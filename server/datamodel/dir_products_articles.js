var changeLog=[
  { "changeID": "dir_products_articles__1", "changeDatetime": "2016-09-04T18:15:00+03:00", "changeObj": "dir_products_articles",
    "changeVal": "CREATE TABLE dir_products_articles(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8" },
  { "changeID": "dir_products_articles__2", "changeDatetime": "2016-09-04T18:16:00+03:00", "changeObj": "dir_products_articles",
    "changeVal": "ALTER TABLE dir_products_articles ADD COLUMN VALUE VARCHAR(255) NOT NULL" },
  { "changeID": "dir_products_articles__3", "changeDatetime": "2016-09-04T18:17:00+03:00", "changeObj": "dir_products_articles",
    "changeVal": "ALTER TABLE dir_products_articles ADD CONSTRAINT DIR_PRODUCTS_ARTICLES_VALUE_UNIQUE UNIQUE(VALUE)" }
];
module.exports.changeLog=changeLog;

var tableName="dir_products_articles", tableFields=["ID","VALUE"], idField=tableFields[0];

module.exports.validateData= {tableName:tableName, fields:tableFields, idField:idField};