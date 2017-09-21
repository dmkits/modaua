
var dataModel=require('../datamodel');
var dir_units= require(appDataModelPath+"dir_units"),
    dir_pricelists=require(appDataModelPath+"dir_pricelists");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_units":dir_units, "dir_pricelists":dir_pricelists}, errs,
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
        dir_units.getDataForTable({tableColumns:dirUnitsTableColumns, identifier:dirUnitsTableColumns[0].data, conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/units/newDataForDirUnitsTable", function(req, res){
        dir_units.setDataItemForTable({tableColumns:dirUnitsTableColumns,
            values:[null,"Новое подразделение","Новое подразделение","Новое подразделение","Днепр","-","0"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/units/storeDirUnitsTableData", function(req, res){
        dir_units.storeTableDataItem({tableColumns:dirUnitsTableColumns, idFieldName:dirUnitsTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/units/deleteDirUnitsTableData", function(req, res){
        dir_units.delTableDataItem({idFieldName:dirUnitsTableColumns[0].data, delTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/units/getDirUnitsForSelect", function(req, res){
        dir_units.getDataItemsForSelect({valueField:"NAME",labelField:"NAME", conditions:{"NOT_USED=":0}, order: "NAME" },
            function (result) {
                res.send(result);
            });
    });
};