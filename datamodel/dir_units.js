var tableColumns=[
    {"data": "ID", "name": "ID", "width": 100, "type": "text", readOnly:true, visible:false},
    {"data": "NAME", "name": "NAME", "width": 200, "type": "text"},
    {"data": "FULL_NAME", "name": "FULL_NAME", "width": 200, "type": "text"},
    {"data": "NOTE", "name": "NOTE", "width": 200, "type": "text"},
    {"data": "CITY", "name": "CITY", "width": 200, "type": "text"},
    {"data": "ADDRESS", "name": "ADDRESS", "width": 200, "type": "text"}
];

var dmBase = require("./dataModelBase");

module.exports=  new dmBase({
    tableName:"dir_units",
    dataURL:"/dir/units", getDataForTable:true, tableColumns:tableColumns,
    newDataForTable:{"NAME":"новое подразделение", "FULL_NAME":"новое подразделение", "NOTE":"новое подразделение", "CITY":"-", "ADDRESS":"-"},
    storeTableData:true, deleteTableData:true
});


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