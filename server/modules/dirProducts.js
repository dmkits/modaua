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
    dataModel.initValidateDataModels([dir_products, dir_products_barcodes,
            dir_products_articles, dir_products_collections,
            dir_products_kinds, dir_products_compositions, dir_products_sizes,
            dir_products_types, dir_products_lines, dir_products_descriptions], errs,
        function(){
            nextValidateModuleCallback();
        });
};
module.exports.modulePageURL = "/dir/products";
module.exports.modulePagePath = "dir/products.html";
module.exports.init = function(app){
    var dirProductsTableColumns=[
        {data: "ID", name: "ID", width: 80, type: "text", readOnly:true, visible:false},
        {data: "CODE", name: "Код", width: 100, type: "text"},
        {data: "NAME", name: "Наименование", width: 200, type: "text"},
        {data: "PRINT_NAME", name: "Печатное наименование", width: 200, type: "text"},
        {data: "UM", name: "Ед.изм.", width: 80, type: "text"},
        {data: "PBARCODE", name: "Штрихкод", width: 120, type: "text"},
        {data: "ARTICLE_ID", name: "ARTICLE_ID", width: 80, type: "text"},
        {data: "KIND_ID", name: "KIND_ID", width: 80, type: "text"},
        {data: "COMPOSITION_ID", name: "COMPOSITION_ID", width: 80, type: "text"},
        {data: "SIZE_ID", name: "SIZE_ID", width: 80, type: "text"},
        {data: "COLLECTION_ID", name: "COLLECTION_ID", width: 80, type: "text"}
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
    });

    var dirProductsTypesTableColumns=[
        {data: "ID", name: "ID", width: 80, type: "text", readOnly:true, visible:false},
        {data: "NAME", name: "Типы номенклатур", width: 350, type: "text"}
    ];
    app.get("/dir/products/getDataForProductsTypesTable", function(req, res){
        dir_products_types.getDataForTable({tableColumns:dirProductsTypesTableColumns,
                identifier:dirProductsTypesTableColumns[0].data,
                conditions:req.query, order:"ID"},
            function(result){
                res.send(result);
            });
    });

    app.get("/dir/products/newDataForProductsTypesTable", function(req, res){
        dir_products_types.setDataItemForTable({tableColumns:dirProductsTypesTableColumns,
                values:[null,"","Новая группа","0"]},
            function(result){
                res.send(result);
            });
    });

    app.post("/dir/products/storeProductsTypesTableData", function(req, res){
        dir_products_types.storeTableDataItem({tableColumns:dirProductsTypesTableColumns,
                idFieldName:dirProductsTypesTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    app.post("/dir/products/deleteProductsTypesTableData", function(req, res){
        dir_products_types.delTableDataItem({idFieldName:dirProductsTypesTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    var dirProductsKindsTableColumns=[
        {data: "ID", name: "ID", width: 80, type: "text", readOnly:true, visible:false},
        {data: "NAME", name: "Виды номенклатур", width: 350, type: "text"}
    ];
    app.get("/dir/products/getDataForProductsKindsTable", function(req, res){
        dir_products_types.getDataForTable({tableColumns:dirProductsKindsTableColumns,
                identifier:dirProductsTypesTableColumns[0].data,
                conditions:req.query, order:"ID"},
            function(result){
                res.send(result);
            });
    });

    app.get("/dir/products/newDataForProductsKindsTable", function(req, res){
        dir_products_types.setDataItemForTable({tableColumns:dirProductsKindsTableColumns,
                values:[null,"","Новая группа","0"]},
            function(result){
                res.send(result);
            });
    });

    app.post("/dir/products/storeProductsKindsTableData", function(req, res){
        dir_products_types.storeTableDataItem({tableColumns:dirProductsKindsTableColumns,
                idFieldName:dirProductsTypesTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    app.post("/dir/products/deleteProductsKindsTableData", function(req, res){
        dir_products_types.delTableDataItem({idFieldName:dirProductsKindsTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    var dirProductsLinesTableColumns=[
        {data: "ID", name: "ID", width: 80, type: "text", readOnly:true, visible:false},
        {data: "NAME", name: "Линии номенклатур", width: 350, type: "text"}
    ];
    app.get("/dir/products/getDataForProductsLinesTable", function(req, res){
        dir_products_types.getDataForTable({tableColumns:dirProductsLinesTableColumns,
                identifier:dirProductsTypesTableColumns[0].data,
                conditions:req.query, order:"ID"},
            function(result){
                res.send(result);
            });
    });

    app.get("/dir/products/newDataForProductsLinesTable", function(req, res){
        dir_products_types.setDataItemForTable({tableColumns:dirProductsLinesTableColumns,
                values:[null,"","Новая группа","0"]},
            function(result){
                res.send(result);
            });
    });

    app.post("/dir/products/storeProductsLinesTableData", function(req, res){
        dir_products_types.storeTableDataItem({tableColumns:dirProductsLinesTableColumns,
                idFieldName:dirProductsTypesTableColumns[0].data,
                storeTableData:req.body},
            function(result){
                res.send(result);
            });
    });

    app.post("/dir/products/deleteProductsLinesTableData", function(req, res){
        dir_products_types.delTableDataItem({idFieldName:dirProductsLinesTableColumns[0].data,
                delTableData:req.body},
            function(result){
                res.send(result);
            });
    });
};