var tableColumns=[
    {"data": "ID", "name": "ID", "width": 100, "type": "text", readOnly:true, visible:false},
    {"data": "NAME", "name": "NAME", "width": 200, "type": "text"},
    {"data": "FULL_NAME", "name": "FULL_NAME", "width": 200, "type": "text"},
    {"data": "NOTE", "name": "NOTE", "width": 200, "type": "text"},
    {"data": "CITY", "name": "CITY", "width": 200, "type": "text"},
    {"data": "ADDRESS", "name": "ADDRESS", "width": 200, "type": "text"}

];

var database = require("./dataBase");

module.exports.init=function(app){
    app.get("/dir/units/get_units", function (req, res) {
        var outData= { columns:tableColumns, identifier:tableColumns[0].data };
        database.getDataForTable("select * from dir_units", outData,
            function(outData){
                res.send(outData);
            });
    });



};