var tableColumns=[
    {"data": "ID", "name": "changeID", "width": 100, "type": "text"}
    , {"data": "CHANGE_DATETIME", "name": "changeDatetime", "width": 180, "type": "text"}
    , {"data": "CHANGE_OBJ", "name": "changeObj", "width": 120, "type": "text"}
    , {"data": "CHANGE_VAL", "name": "changeVal", "width": 300, "type": "text"}
    , {"data": "APPLIED_DATETIME", "name": "appliedDatetime", "width": 300, "type": "text"}

];

var database = require("./dataBase");

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