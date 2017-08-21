var changeLog=[
    { "changeID":"wrh_order_bata_details_v__1", "changeDatetime": "2017-08-16T16:50:00.000+0300", "changeObj": "wrh_order_bata_details_v",
        "changeVal": "CREATE VIEW wrh_order_bata_details_v(ID, ORDER_BATA_ID, POS, PRODUCT_GENDER_CODE,PRODUCT_GENDER, PRODUCT_CATEGORY_CODE,PRODUCT_CATEGORY,"
        +" PRODUCT_SUBCATEGORY_CODE,PRODUCT_SUBCATEGORY, PRODUCT_ARTICLE, QTY, RETAIL_PRICE, PRICE, POSSUM)AS"
        +" SELECT wobd.ID,wobd.ORDER_BATA_ID,wobd.POS,"
        +" dpg.CODE as PRODUCT_GENDER_CODE, dpg.NAME as PRODUCT_GENDER,dpc.CODE as PRODUCT_CATEGORY_CODE, dpc.NAME as PRODUCT_CATEGORY,"
        +" dpsc.CODE as PRODUCT_SUBCATEGORY_CODE, dpsc.NAME as PRODUCT_SUBCATEGORY, dpa.VALUE as PRODUCT_ARTICLE,"
        +" wobd.QTY, wobd.RETAIL_PRICE, wobd.PRICE, wobd.POSSUM"
        +" FROM wrh_order_bata_details wobd"
        +" INNER JOIN dir_products_genders dpg ON wobd.PRODUCT_GENDER_ID=dpg.ID"
        +" INNER JOIN dir_products_categories dpc ON wobd.PRODUCT_CATEGORY_ID=dpc.ID"
        +" INNER JOIN dir_products_subcategories dpsc ON wobd.PRODUCT_SUBCATEGORY_ID=dpsc.ID"
        +" INNER JOIN dir_products_articles dpa ON wobd.PRODUCT_ARTICLE_ID=dpa.ID" }
];
module.exports.changeLog=changeLog;

//var viewName="wrh_order_bata_details_v", tableColumns=[
//    {"data": "ID", "name": "ID", "width": 50, "type": "text", readOnly:true, visible:false},
//    {"data": "ORDER_BATA_ID", "name": "ORDER_BATA_ID", "width": 50, "type": "text", readOnly:true, visible:false},
//    {"data": "POS", "name": "Номер п/п", "width": 45, "type": "text"},
//    {"data": "PRODUCT_GENDER_CODE", "name": "Код группы", "width": 50, "type": "text"},
//    {"data": "PRODUCT_GENDER", "name": "Группа", "width": 90, "type": "text"},
//    {"data": "PRODUCT_CATEGORY_CODE", "name": "Код категории", "width": 60, "type": "text"},
//    {"data": "PRODUCT_CATEGORY", "name": "Категория", "width": 170, "type": "text"},
//    {"data": "PRODUCT_SUBCATEGORY_CODE", "name": "Код подкатегории", "width": 75, "type": "text"},
//    {"data": "PRODUCT_SUBCATEGORY", "name": "Подкатегория", "width": 130, "type": "text"},
//    {"data": "PRODUCT_ARTICLE", "name": "Артикул", "width": 80, "type": "text"},
//    {"data": "QTY", "name": "Кол-во", "width": 50, "type": "numeric"},
//    {"data": "RETAIL_PRICE", "name": "Цена Retail", "width": 60, "type": "numeric2"},
//    {"data": "PRICE", "name": "Цена", "width": 60, "type": "numeric2"},
//    {"data": "POSSUM", "name": "Сумма", "width": 80, "type": "numeric2"}
//], idField=tableColumns[0].data;
//
//module.exports.validateData= {tableName:viewName, tableColumns:tableColumns, idField:idField};
//
//var dm=this;
///**
// * resultCallback = function(tableData={ columns, identifier, items, error })
// */
//module.exports.getDataForWrhOrdersBataDetailsTable= function(conditions, resultCallback){
//    dm.getDataForTable({tableName:viewName,
//        tableColumns:tableColumns,
//        identifier:idField, conditions:conditions}, resultCallback);
//};
