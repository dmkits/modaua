var changeLog=[
    { "changeID": "dir_units__1", "changeDatetime": "2016-08-29T11:41:00+03:00", "changeObj": "dir_units",
        "changeVal": "CREATE TABLE dir_units(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8" },
    { "changeID": "dir_units__2", "changeDatetime": "2016-08-29T11:42:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN NAME VARCHAR(200) NOT NULL" },
    { "changeID": "dir_units__3", "changeDatetime": "2016-08-29T11:43:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD CONSTRAINT DIR_UNITS_NAME_UNIQUE UNIQUE(NAME)" },
    { "changeID": "dir_units__4", "changeDatetime": "2016-08-29T11:44:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN FULL_NAME VARCHAR(500) NOT NULL" },
    { "changeID": "dir_units__5", "changeDatetime": "2016-08-29T11:45:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN NOTE VARCHAR(500)" },
    { "changeID": "dir_units__6", "changeDatetime": "2016-08-29T11:46:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN CITY VARCHAR(100)" },
    { "changeID": "dir_units__7", "changeDatetime": "2016-08-29T11:47:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN ADDRESS VARCHAR(255)" },
    { "changeID": "dir_units__8", "changeDatetime": "2016-08-29T11:48:00+03:00", "changeObj": "dir_units",
        "changeVal": "ALTER TABLE dir_units ADD COLUMN NOT_USED SMALLINT NOT NULL" },
    { "changeID": "dir_units__9", "changeDatetime": "2016-08-29T11:49:00+03:00", "changeObj": "dir_units",
        "changeVal": "INSERT INTO dir_units(ID,NAME,FULL_NAME,NOTE,CITY,ADDRESS,NOT_USED) values (0,'Гл.офис','офис','офис','Днипро','Днипро',0)" },
    { "changeID": "dir_units_10", "changeDatetime": "2016-08-29T11:50:00+03:00", "changeObj": "dir_units",
        "changeVal": "INSERT INTO dir_units(ID,NAME,FULL_NAME,NOTE,CITY,ADDRESS,NOT_USED) values (1,'Магазин 1','Магазин 1','Магазин 1','Днипро','Днипро',0);" }
];
module.exports.changeLog=changeLog;

var tableColumns=[
    {"data": "ID", "name": "ID", "width": 100, "type": "text", readOnly:true, visible:false},
    {"data": "NAME", "name": "NAME", "width": 200, "type": "text"},
    {"data": "FULL_NAME", "name": "FULL_NAME", "width": 200, "type": "text"},
    {"data": "NOTE", "name": "NOTE", "width": 200, "type": "text"},
    {"data": "CITY", "name": "CITY", "width": 200, "type": "text"},
    {"data": "ADDRESS", "name": "ADDRESS", "width": 200, "type": "text"}
];
module.exports.tableColumns=tableColumns;

module.exports.validateData= {tableName:"dir_units", tableColumns:tableColumns, idField:tableColumns[0].data};

//module.exports.validateQuery= "select ID,NAME,FULL_NAME,NOTE,CITY,ADDRESS,NOT_USED from dir_units where ID is NULL";

//var dmBase = require("./dataModelBase");

//module.exports=  new dmBase({
//    tableName:"dir_units", tableKeyField:"ID",
//    dataURL:"/dir/units", getDataForTable:true, tableColumns:tableColumns,
//    newDataForTable:{"NAME":"новое подразделение", "FULL_NAME":"новое подразделение", "NOTE":"новое подразделение", "CITY":"-", "ADDRESS":"-"},
//    storeTableData:true, deleteTableData:true
//});


//function baseClass(){
//
//    this.fieldA='123';
//    this.fieldB=123456;
//
//    this.func1= function(params){
//
//    };
//
//};
//var baseClassA= new baseClass();
//baseClassA.fieldA='234';
////baseClassA.prototype.fieldA==='123';
//baseClassA.func1=function(params){
//
//};
//
//var baseClassO= {
//    fieldA:'123',
//    fieldB:123456,
//    func1: function(params){
//
//    }
//};