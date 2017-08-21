var dataModel=require('../datamodel');
var dirContractors= require(appDataModelPath+"dir_contractors");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_contractors":dirContractors}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/contractors";
module.exports.modulePagePath = "dir/contractors.html";
module.exports.init = function(app){
    var dirContractorsTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "NAME", "name": "Наименование", "width": 120, "type": "text"},
        {"data": "FULL_NAME", "name": "Полное наименование", "width": 250, "type": "text"},
        {"data": "NOTE", "name": "Примечание", "width": 200, "type": "text"},
        {"data": "COUNTRY", "name": "Страна", "width": 100, "type": "text"},
        {"data": "CITY", "name": "Город", "width": 120, "type": "text"},
        {"data": "ADDRESS", "name": "Адрес", "width": 200, "type": "text"},
        {"data": "IS_SUPPLIER", "name": "Поставщик", "width": 120, "type": "checkbox"},
        {"data": "IS_BUYER", "name": "Покупатель", "width": 120, "type": "checkbox"}
    ];
    app.get("/dir/contractors/getDataForDirContractorsTable", function(req, res){
        dirContractors.getDataForTable({tableColumns:dirContractorsTableColumns, identifier:dirContractorsTableColumns[0].data,
                conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.get("/dir/contractors/newDataForDirContractorsTable", function(req, res){
        dirContractors.setDataItemForTable({tableColumns:dirContractorsTableColumns,
                values:[null,"Новый контрагент","Новый контрагент","Новый контрагент","Украина","Днепр","-","0","0"]},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/contractors/storeDirContractorsTableData", function(req, res){
        dirContractors.storeTableDataItem({idFieldName:dirContractorsTableColumns[0].data, storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/contractors/deleteDirContractorsTableData", function(req, res){
        dirContractors.delTableDataItem({idFieldName:dirContractorsTableColumns[0].data, delTableData:req.body},
            function(result){
                res.send(result);
            });
    });
};