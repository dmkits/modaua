var dataModel=require('../datamodel');
var dir_products= require(appDataModelPath+"dir_products"),
    dir_products_barcodes= require(appDataModelPath+"dir_products_barcodes");
var dir_products_articles= require(appDataModelPath+"dir_products_articles"),
    dir_products_kinds= require(appDataModelPath+"dir_products_kinds"),
    dir_products_compositions= require(appDataModelPath+"dir_products_compositions"),
    dir_products_sizes= require(appDataModelPath+"dir_products_sizes"),
    dir_products_collections= require(appDataModelPath+"dir_products_collections"),
    dir_products_types= require(appDataModelPath+"dir_products_types"),
    dir_products_lines= require(appDataModelPath+"dir_products_lines"),
    dir_products_descriptions= require(appDataModelPath+"dir_products_descriptions");
//var dir_products_barcodes= require(appDataModelPath+"dir_products_barcodes");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"dir_products":dir_products,
            "dir_products_barcodes":dir_products_barcodes,
            "dir_products_articles":dir_products_articles,
            "dir_products_kinds":dir_products_kinds, "dir_products_compositions":dir_products_compositions, "dir_products_sizes":dir_products_sizes,
            "dir_products_collections":dir_products_collections,
            "dir_products_types":dir_products_types,
            "dir_products_lines":dir_products_lines,
            "dir_products_descriptions":dir_products_descriptions
        },
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
        dir_products.getDataForTable({tableColumns:dirProductsTableColumns, identifier:dirProductsTableColumns[0].data,
            conditions:req.query},
            function(result){
                res.send(result);
            });
    });
    app.post("/dir/products/storeDirProductsTableData", function(req, res){
        dir_products.storeTableDataItem({idFieldName:dirProductsTableColumns[0].data, storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    app.get("/dir/products/getProductsCollectionsForSelect", function (req, res) {
        dir_products_collections.getDataItemsForSelect({ valueField:"NAME",labelField:"NAME", order: "NAME" },
            function (result) {
                res.send(result);
            });
    });};