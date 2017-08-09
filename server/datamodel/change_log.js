var change_log= [
    { "changeID":"chl__1", "changeDatetime":"2016-08-29T09:01:00.000",  "changeObj":"change_log", "changeVal":"CREATE TABLE change_log( ID VARCHAR(64) NOT NULL PRIMARY KEY, CHANGE_DATETIME TIMESTAMP NOT NULL, CHANGE_OBJ VARCHAR(255) NOT NULL, CHANGE_VAL VARCHAR(20000) NOT NULL, APPLIED_DATETIME TIMESTAMP NULL) CHARACTER SET utf8"},
    { "changeID":"chl__2", "changeDatetime":"2016-08-29T09:02:00.000",  "changeObj":"change_log", "changeVal":"ALTER TABLE change_log ALTER COLUMN CHANGE_DATETIME  DROP DEFAULT"},
    { "changeID":"chl__3", "changeDatetime":"2016-08-29T09:03:00.000",  "changeObj":"change_log", "changeVal":"ALTER TABLE change_log ALTER COLUMN APPLIED_DATETIME  DROP DEFAULT"}
];

var tableColumns=[
    {"data": "ID", "name": "changeID", "width": 100, "type": "text"}
    , {"data": "CHANGE_DATETIME", "name": "changeDatetime", "width": 180, "type": "text"}
    , {"data": "CHANGE_OBJ", "name": "changeObj", "width": 120, "type": "text"}
    , {"data": "CHANGE_VAL", "name": "changeVal", "width": 300, "type": "text"}
    , {"data": "APPLIED_DATETIME", "name": "appliedDatetime", "width": 300, "type": "text"}

];

var database = require("../database");

module.exports.init=function(app){
    app.get("/sysadmin/database/change_log", function (req, res) {
        //log.info("/sysadmin/database/change_log", req.params, " ", JSON.stringify(req.query));

        var outData= { columns:tableColumns, identifier:tableColumns[0].data };
        database.checkIfChangeLogExists(function (err, exist) {
            if (err && (err.code == "ER_NO_SUCH_TABLE")) {
                outData.message = "Change Log doesn't exists";
                res.send(outData);
                return;
            } else if (err) {
                outData.error = err.message;
                res.send(outData);
                return;
            }
            database.getDataForTable("select * from change_log", outData,
                function(outData){
                    res.send(outData);
                });
        });
    });
};