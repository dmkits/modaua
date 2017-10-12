var dataModel=require('../datamodel');

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    nextValidateModuleCallback();
};
/**
 * params.linkSource
 * params.visibleColumns = { columnsItem.data:true/false }
 */
module.exports.addProductColumnsTo= function(columnsData, ind, params){
    var result=[];
    if(!params) params={};
    if(!params.visibleColumns) params.visibleColumns={};
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(cInd==ind){
            var prodColData={ "data": "PRODUCT_CODE", "name": "Код товара", "width": 55, "type": "text", align:"center",
                visible:params.visibleColumns["CODE"],
                dataSource:"dir_products", sourceField:"CODE"};
            if(params.linkSource) prodColData.linkCondition="dir_products.ID="+params.linkSource+".PRODUCT_ID";
            result.push(prodColData);
            result.push({ "data": "PRODUCT_NAME", "name": "Наименование товара", "width": 220, "type": "text",
                visible:params.visibleColumns["NAME"],
                dataSource:"dir_products", sourceField:"NAME"});
            result.push({ "data": "PRODUCT_UM", "name": "Ед. изм.", "width": 55, "type": "text", align:"center",
                visible:params.visibleColumns["UM"],
                dataSource:"dir_products", sourceField:"UM"});
            result.push({ "data": "PRODUCT_PRINT_NAME", "name": "Печатное наименование товара", "width": 220, "type": "text",
                visible:params.visibleColumns["PRINT_NAME"],
                dataSource:"dir_products", sourceField:"PRINT_NAME"});
            result.push({ "data": "PRODUCT_PBARCODE", "name": "Осн.штрихкод", "width": 100, "type": "text", align:"center",
                visible:params.visibleColumns["PBARCODE"],
                dataSource:"dir_products", sourceField:"PBARCODE"});
        }
        result.push(columnsData[cInd]);
    }
    return result;
};
/**
 * params.linkSource
 * params.visibleColumns = { columnsItem.data:true/false }
 * params.excludeColumns = { columnsItem.data:true/false }
 */
module.exports.addProductAttrsColumnsTo= function(columnsData, ind, params){
    var result=[];
    if(!params) params={};
    if(!params.linkSource) params.linkSource="dir_products";
    if(!params.visibleColumns) params.visibleColumns={};
    if(!params.excludeColumns) params.excludeColumns={};
    var hasSource=false;
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(!columnsData) continue;
        if(columnsData.dataSource==params.linkSource){
            hasSource=true; break;
        } else if(columnsData.linkCondition&&columnsData.linkCondition.indexOf(params.linkSource+".")>=0){
            hasSource=true; break;
        }
    }
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(cInd==ind){
            if(!hasSource) result.push({dataSource:params.linkSource});
            if(!params.excludeColumns["COLLECTION_CODE"])
                result.push({"data": "PRODUCT_COLLECTION_CODE", "name": "Код коллекции товара", "width": 100, "type": "text", align:"center",
                    visible:params.visibleColumns["COLLECTION_CODE"],
                    dataSource:"dir_products_collections", sourceField:"CODE", linkCondition:"dir_products_collections.ID="+params.linkSource+".COLLECTION_ID" });
            if(!params.excludeColumns["COLLECTION"])
                result.push({"data": "PRODUCT_COLLECTION", "name": "Коллекция товара", "width": 150, "type": "text",
                    visible:params.visibleColumns["COLLECTION"],
                    dataSource:"dir_products_collections", sourceField:"NAME", linkCondition:"dir_products_collections.ID="+params.linkSource+".COLLECTION_ID" });
            if(!params.excludeColumns["ARTICLE"])
                result.push({"data": "PRODUCT_ARTICLE", "name": "Артикул товара", "width": 80, "type": "text", align:"center",
                    visible:params.visibleColumns["ARTICLE"],
                    dataSource:"dir_products_articles", sourceField:"VALUE", linkCondition:"dir_products_articles.ID="+params.linkSource+".ARTICLE_ID" });
            if(!params.excludeColumns["KIND"])
                result.push({"data": "PRODUCT_KIND", "name": "Вид товара", "width": 150, "type": "text",
                    visible:params.visibleColumns["KIND"],
                    dataSource:"dir_products_kinds", sourceField:"NAME", linkCondition:"dir_products_kinds.ID="+params.linkSource+".KIND_ID" });
            if(!params.excludeColumns["COMPOSITION"])
                result.push({"data": "PRODUCT_COMPOSITION", "name": "Состав товара", "width": 150, "type": "text",
                    visible:params.visibleColumns["COMPOSITION"],
                    dataSource:"dir_products_compositions", sourceField:"VALUE", linkCondition:"dir_products_compositions.ID="+params.linkSource+".COMPOSITION_ID" });

            //result.push({ "data": "PRODUCT_PRINT_NAME", "name": "Печатное наименование товара", "width": 220, "type": "text",
            //    visible:params.visibleColumns["PRINT_NAME"],
            //    dataSource:"dir_products", sourceField:"PRINT_NAME"});
            //result.push({ "data": "PRODUCT_PBARCODE", "name": "Осн.штрихкод", "width": 100, "type": "text", align:"center",
            //    visible:params.visibleColumns["PBARCODE"],
            //    dataSource:"dir_products", sourceField:"PBARCODE"});
        }
        result.push(columnsData[cInd]);
    }
    return result;
};