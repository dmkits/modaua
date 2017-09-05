
var dataModel=require('../datamodel');
var dirUnits= require(appDataModelPath+"dir_units");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_units":dirUnits}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/units";
module.exports.modulePagePath = "dir/units.html";
module.exports.init = function(app){
    var dirUnitsTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "NAME", "name": "Наименование", "width": 120, "type": "text"},
        {"data": "FULL_NAME", "name": "Полное наименование", "width": 250, "type": "text"},
        {"data": "NOTE", "name": "Примечание", "width": 200, "type": "text"},
        {"data": "CITY", "name": "Город", "width": 120, "type": "text"},
        {"data": "ADDRESS", "name": "Адрес", "width": 200, "type": "text"},
        {"data": "NOT_USED", "name": "Не используется", "width": 120, "type": "checkbox", visible:true}
    ];
    app.get("/dir/units/getDataForDirUnitsTable", function(req, res){
        dirUnits.getDataForTable({tableColumns:dirUnitsTableColumns, identifier:dirUnitsTableColumns[0].data, conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/units/newDataForDirUnitsTable", function(req, res){
        dirUnits.setDataItemForTable({tableColumns:dirUnitsTableColumns,
            values:[null,"Новое подразделение","Новое подразделение","Новое подразделение","Днепр","-","0"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/units/storeDirUnitsTableData", function(req, res){
        dirUnits.storeTableDataItem({tableColumns:dirUnitsTableColumns, idFieldName:dirUnitsTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/units/deleteDirUnitsTableData", function(req, res){
        dirUnits.delTableDataItem({idFieldName:dirUnitsTableColumns[0].data, delTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/units/getDirUnitsForSelect", function(req, res){
        dirUnits.getDataItemsForSelect({valueField:"NAME",labelField:"NAME", conditions:{"NOT_USED=":0}, order: "NAME" },
            function (result) {
                res.send(result);
            });
    });
};