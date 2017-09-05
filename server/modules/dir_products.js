var dataModel=require('../datamodel');
var dirProducts= require(appDataModelPath+"dir_products"),
    dirProductsBarcodes= require(appDataModelPath+"dir_products_barcodes");
var dirProductsArticles= require(appDataModelPath+"dir_products_articles"),
    dirProductsKinds= require(appDataModelPath+"dir_products_kinds"),
    dirProductsCompositions= require(appDataModelPath+"dir_products_compositions"),
    dirProductsSizes= require(appDataModelPath+"dir_products_sizes"),
    dirProductsCollections= require(appDataModelPath+"dir_products_collections");
//var dirProductsBarcodes= require(appDataModelPath+"dir_products_barcodes");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_products":dirProducts,
            "dir_products_barcodes":dirProductsBarcodes,
            "dir_products_articles":dirProductsArticles,
            "dir_products_kinds":dirProductsKinds, "dir_products_compositions":dirProductsCompositions, "dir_products_sizes":dirProductsSizes,
            "dir_products_collections":dirProductsCollections},
        errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/dir/products";
module.exports.modulePagePath = "dir/products.html";
module.exports.init = function(app){
    var dirProductsTableColumns=[
        {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
        {"data": "CODE", "name": "Код", "width": 100, "type": "text"},
        {"data": "NAME", "name": "Наименование", "width": 200, "type": "text"},
        {"data": "PRINT_NAME", "name": "Печатное наименование", "width": 200, "type": "text"},
        {"data": "UM", "name": "Ед.изм.", "width": 80, "type": "text"},
        {"data": "PBARCODE", "name": "Штрихкод", "width": 120, "type": "text"},
        {"data": "ARTICLE_ID", "name": "ARTICLE_ID", "width": 80, "type": "text"},
        {"data": "KIND_ID", "name": "KIND_ID", "width": 80, "type": "text"},
        {"data": "COMPOSITION_ID", "name": "COMPOSITION_ID", "width": 80, "type": "text"},
        {"data": "SIZE_ID", "name": "SIZE_ID", "width": 80, "type": "text"},
        {"data": "COLLECTION_ID", "name": "COLLECTION_ID", "width": 80, "type": "text"}
    ];
    app.get("/dir/products/getDataForDirProductsTable", function(req, res){
        dirProducts.getDataForTable({tableColumns:dirProductsTableColumns, identifier:dirProductsTableColumns[0].data,
            conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeDirProductsTableData", function(req, res){
        dirProducts.storeTableDataItem({idFieldName:dirProductsTableColumns[0].data, storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    app.get("/dir/products/getProductsCollectionsForSelect", function (req, res) {
        dirProductsCollections.getDataItemsForSelect({ valueField:"NAME",labelField:"NAME", order: "NAME" },
            function (result) {
                res.send(result);
            });
    });};