var tableColumns=[
    {"data": "ID", "name": "ID", "width": 100, "type": "text", readOnly:true, visible:false},
    {"data": "NAME", "name": "NAME", "width": 200, "type": "text"},
    {"data": "FULL_NAME", "name": "FULL_NAME", "width": 200, "type": "text"},
    {"data": "NOTE", "name": "NOTE", "width": 200, "type": "text"},
    {"data": "CITY", "name": "CITY", "width": 150, "type": "text"},
    {"data": "ADDRESS", "name": "ADDRESS", "width": 200, "type": "text"},
    {"data": "IS_SUPPLIER", "name": "IS_SUPPLIER", "width": 80, "type": "text"},
    {"data": "IS_BUYER", "name": "IS_BUYER", "width": 80, "type": "text"}
];

var dmBase = require("./dataModelBase");

module.exports=  new dmBase({
    tableName:"dir_contractors", tableKeyField:"ID",
    dataURL:"/dir/contractors", getDataForTable:true, tableColumns:tableColumns,
    newDataForTable:{"NAME":"новый контрагент", "FULL_NAME":"новый контрагент", "NOTE":"новый контрагент", "CITY":"-", "ADDRESS":"-"},
    storeTableData:true, deleteTableData:true
});
