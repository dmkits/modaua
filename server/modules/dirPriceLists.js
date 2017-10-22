var dataModel=require('../datamodel');
var dir_pricelists= require(appDataModelPath+"dir_pricelists"),
    dir_pricelist_products= require(appDataModelPath+"dir_pricelist_products");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([dir_pricelists,dir_pricelist_products], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/pricelists";
module.exports.modulePagePath = "dir/pricelists.html";
module.exports.init = function(app){
    //var dirProductsTableColumns=[
    //    {data: "ID", name: "ID", width: 80, type: "text", readOnly:true, visible:false},
    //    {data: "CODE", name: "Код", width: 100, type: "text"},
    //    {data: "NAME", name: "Наименование", width: 200, type: "text"},
    //    {data: "PRINT_NAME", name: "Печатное наименование", width: 200, type: "text"},
    //    {data: "UM", name: "Ед.изм.", width: 80, type: "text"},
    //    {data: "PBARCODE", name: "Штрихкод", width: 120, type: "text"},
    //    {data: "ARTICLE_ID", name: "ARTICLE_ID", width: 80, type: "text"},
    //    {data: "KIND_ID", name: "KIND_ID", width: 80, type: "text"},
    //    {data: "COMPOSITION_ID", name: "COMPOSITION_ID", width: 80, type: "text"},
    //    {data: "SIZE_ID", name: "SIZE_ID", width: 80, type: "text"},
    //    {data: "COLLECTION_ID", name: "COLLECTION_ID", width: 80, type: "text"}
    //];
    //app.get("/dir/products/getDataForDirProductsTable", function(req, res){
    //    dir_products.getDataForTable({tableColumns:dirProductsTableColumns, identifier:dirProductsTableColumns[0].data,
    //        conditions:req.query},
    //        function(result){
    //            res.send(result);
    //        });
    //});
    //app.post("/dir/products/storeDirProductsTableData", function(req, res){
    //    dir_products.storeTableDataItem({idFieldName:dirProductsTableColumns[0].data, storeTableData:req.body},
    //        function(result){
    //            res.send(result);
    //        });
    //});
    //
    //app.get("/dir/products/getProductsCollectionsForSelect", function (req, res) {
    //    dir_products_collections.getDataItemsForSelect({ valueField:"NAME",labelField:"NAME", order: "NAME" },
    //        function (result) {
    //            res.send(result);
    //        });
    //});
    app.get("/dir/pricelists/getDataForPriceListsCombobox", function(req, res){
        dir_pricelists.getDataItemsForTableCombobox({
                comboboxFields:{"PRICELIST_NAME":"NAME"},
                order:"PRICELIST_NAME"},
            function(result){
                res.send(result);
            });
    });
};