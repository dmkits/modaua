var changeLog=[
    { "changeID":"dir_products_categories_v__1", "changeDatetime": "2017-08-16T16:20:00.000+0300", "changeObj": "dir_products_categories_v",
        "changeVal": "CREATE VIEW dir_products_categories_v(ID, CODE, NAME, CONSTANT, GENDER_CODE, GENDER_NAME)AS "
        +"SELECT dpc.ID,dpc.CODE,dpc.NAME,dpc.CONSTANT,dpg.CODE as GENDER_CODE, dpg.NAME as GENDER_NAME "
        +"FROM dir_products_categories dpc INNER JOIN dir_products_genders dpg ON dpc.GENDER_ID=dpg.ID" }
];
module.exports.changeLog=changeLog;

var viewName="dir_products_categories_v", tableFields=["ID","GENDER_CODE","GENDER_NAME","CODE","NAME","CONSTANT"], idField=tableFields[0];

module.exports.validateData= {tableName:viewName, fields:tableFields, idField:idField};

var tableColumns=[
    {"data": "ID", "name": "ID", "width": 80, "type": "text", readOnly:true, visible:false},
    {"data": "GENDER_CODE", "name": "Код группы", "width": 90, "type": "combobox"},
    {"data": "GENDER_NAME", "name": "Наименование группы", "width": 200, "type": "combobox"},
    {"data": "CODE", "name": "Код категории", "width": 100, "type": "text"},
    {"data": "NAME", "name": "Наименование категории", "width": 200, "type": "text"},
    {"data": "CONSTANT", "name": "Постоянная категория", "width": 150, "type": "checkbox"}
];

var dm=this;
/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForDirProductsCategoriesTable= function(conditions, resultCallback){
    dm.getDataForTable({tableName:viewName,
        tableColumns:tableColumns,
        identifier:idField, conditions:conditions}, resultCallback);
};
