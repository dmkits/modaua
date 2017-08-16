var dataModel=require('../datamodel');
var wrhOrdersBata= require(appDataModelPath+"wrh_orders_bata");
var wrhOrdersBataView= require(appDataModelPath+"wrh_orders_bata_view");
var wrhOrderBataDetails= require(appDataModelPath+"wrh_order_bata_details");
var wrhOrderBataDetailsView= require(appDataModelPath+"wrh_order_bata_details_view");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"wrh_orders_bata":wrhOrdersBata,"wrh_orders_bata_view":wrhOrdersBataView,
            "wrh_orders_bata_details":wrhOrderBataDetails,"wrh_orders_bata_details_view":wrhOrderBataDetailsView},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/wrh/orders-bata";
module.exports.modulePagePath = "wrh/orders-bata.html";
module.exports.init = function(app){
    app.get("/wrh/ordersBata/getDataForWrhOrdersBataListTable", function(req, res){
        wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
            res.send(result);
        });
    });

    app.get("/wrh/ordersBata/getOrderBataData", function(req, res){
        res.send({});
        //wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
        //    res.send(result);
        //});
    });
    app.get("/wrh/ordersBata/getNewOrderBataData", function(req, res){
        res.send({});
        //wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
        //    res.send(result);
        //});
    });
    app.post("/wrh/ordersBata/storeOrderBataData", function(req, res){
        res.send({});
        //wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
        //    res.send(result);
        //});
    });
    app.post("/wrh/ordersBata/deleteOrderBataData", function(req, res){
        res.send({});
        //wrhOrdersBataView.getDataForWrhOrdersBataListTable(req.query, function(result){
        //    res.send(result);
        //});
    });

    app.get("/wrh/ordersBata/getDataForWrhOrdersBataDetailsTable", function(req, res){
        wrhOrderBataDetailsView.getDataForWrhOrdersBataDetailsTable(req.body, function(result){
            res.send(result);
        });
    });
    //app.get("/dir/contractors/newDataForDirContractorsTable", function(req, res){
    //    dirProducts.getNewDataForDirContractorsTable(function(result){
    //        res.send(result);
    //    });
    //});
    app.post("/dir/products/storeDirProductsTableData", function(req, res){
        wrhOrderBataDetailsView.getDataForWrhOrdersBataDetailsTable(req.body, function(result){
            res.send(result);
        });
    });
    //app.post("/dir/contractors/deleteDirContractorsTableData", function(req, res){
    //    dirProducts.deleteDirContractorsTableData(req.body, function(result){
    //        res.send(result);
    //    });
    //});
};