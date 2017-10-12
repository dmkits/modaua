var dataModel=require('../datamodel');

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    nextValidateModuleCallback();
};
/**
 * params.linkSource
 * params.visibleColumns = { columnsItem.data:true/false }
 * params.excludeColumns = { columnsItem.data:true/false }
 * params.editableValues = true/false
 *
 */
module.exports.addProductBataAttrsColumnsTo= function(columnsData, ind, params){
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
    var editableWidth=(params.editableValues)?15:0;
    for(var cInd=0; cInd<columnsData.length;cInd++){
        if(cInd==ind){
            if(!hasSource) result.push({dataSource:params.linkSource});
            if(!params.excludeColumns["GENDER_CODE"])
                result.push({"data": "PRODUCT_GENDER_CODE", "name": "Код группы товара", "width": 65+editableWidth, "type": "text", align:"center",
                    visible:params.visibleColumns["GENDER_CODE"],
                    dataSource:"dir_products_genders", sourceField:"CODE", linkCondition:"dir_products_genders.ID="+params.linkSource+".GENDER_ID" });
            if(!params.excludeColumns["GENDER"])
                result.push({"data": "PRODUCT_GENDER", "name": "Группа товара", "width": 150+editableWidth, "type": "text",
                    visible:params.visibleColumns["GENDER"],
                    dataSource:"dir_products_genders", sourceField:"NAME", linkCondition:"dir_products_genders.ID=dir_products.GENDER_ID" });
            if(!params.excludeColumns["CATEGORY_CODE"])
                result.push({"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории товара", "width": 80+editableWidth, "type": "text", align:"center",
                    visible:params.visibleColumns["CATEGORY_CODE"],
                    dataSource:"dir_products_categories", sourceField:"CODE", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" });
            if(!params.excludeColumns["CATEGORY"])
                result.push({"data": "PRODUCT_CATEGORY", "name": "Категория товара", "width": 200+editableWidth, "type": "text",
                    visible:params.visibleColumns["CATEGORY"],
                    dataSource:"dir_products_categories", sourceField:"NAME", linkCondition:"dir_products_categories.ID=dir_products.CATEGORY_ID" });
            if(!params.excludeColumns["SUBCATEGORY_CODE"])
                result.push({"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории товара", "width": 100+editableWidth, "type": "text", align:"center",
                    visible:params.visibleColumns["SUBCATEGORY_CODE"],
                    dataSource:"dir_products_subcategories", sourceField:"CODE", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" });
            if(!params.excludeColumns["SUBCATEGORY"])
                result.push({"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория товара", "width": 200+editableWidth, "type": "text",
                    visible:params.visibleColumns["SUBCATEGORY"],
                    dataSource:"dir_products_subcategories", sourceField:"NAME", linkCondition:"dir_products_subcategories.ID=dir_products.SUBCATEGORY_ID" });
        }
        result.push(columnsData[cInd]);
    }
    return result;
};