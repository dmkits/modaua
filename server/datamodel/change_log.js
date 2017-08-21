var changeLog= [
    { "changeID":"chl__1", "changeDatetime":"2016-08-29T09:01:00+03:00",  "changeObj":"change_log",
        "changeVal":"CREATE TABLE change_log("
        +" ID VARCHAR(64) NOT NULL PRIMARY KEY, APPLIED_DATETIME TIMESTAMP NOT NULL,"
        +" CHANGE_DATETIME TIMESTAMP NULL, CHANGE_OBJ VARCHAR(255) NOT NULL,"
        +" CHANGE_VAL VARCHAR(20000) NOT NULL) CHARACTER SET utf8",
        "tableName":"change_log", "fields":["ID","APPLIED_DATETIME","CHANGE_DATETIME", "CHANGE_OBJ", "CHANGE_VAL"] , "id":"ID"},
    { "changeID":"chl__2", "changeDatetime":"2016-08-29T09:02:00+03:00",  "changeObj":"change_log",
        "changeVal":"ALTER TABLE change_log ALTER COLUMN CHANGE_DATETIME DROP DEFAULT" }
];
module.exports.changeLog=changeLog;
