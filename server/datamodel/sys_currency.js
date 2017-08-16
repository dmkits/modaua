var changeLog= [

    { "changeID":"sys_currency__1", "changeDatetime":"2016-08-30T09:41:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"CREATE TABLE sys_currency(ID INTEGER NOT NULL PRIMARY KEY) CHARACTER SET utf8"},
    { "changeID":"sys_currency__2", "changeDatetime":"2016-08-30T09:42:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"ALTER TABLE sys_currency ADD COLUMN CODE VARCHAR(3) NOT NULL"},
    { "changeID":"sys_currency__3", "changeDatetime":"2016-08-30T09:43:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"ALTER TABLE sys_currency ADD CONSTRAINT SYS_CURRENCY_ALIAS_UNIQUE UNIQUE(CODE)"},
    { "changeID":"sys_currency__4", "changeDatetime":"2016-08-30T09:44:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"ALTER TABLE sys_currency ADD COLUMN NAME VARCHAR(50) NOT NULL"},
    { "changeID":"sys_currency__5", "changeDatetime":"2016-08-30T09:45:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"ALTER TABLE sys_currency ADD CONSTRAINT SYS_CURRENCY_NAME_UNIQUE UNIQUE(NAME)"},
    { "changeID":"sys_currency__6", "changeDatetime":"2016-08-30T09:46:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"ALTER TABLE sys_currency ADD COLUMN NOTE VARCHAR(255) NOT NULL"},
    { "changeID":"sys_currency__7", "changeDatetime":"2016-08-30T09:51:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"INSERT INTO sys_currency(ID,CODE,NAME,NOTE) values(0,'UAH','Украинская гривна','Украинская гривна')"},
    { "changeID":"sys_currency__8", "changeDatetime":"2016-08-30T09:52:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"INSERT INTO sys_currency(ID,CODE,NAME,NOTE) values(1,'USD','Американский доллар','Американский доллар')"},
    { "changeID":"sys_currency__9", "changeDatetime":"2016-08-30T09:53:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"INSERT INTO sys_currency(ID,CODE,NAME,NOTE) values(2,'EUR','Евро','Евро')"},
    { "changeID":"sys_currency_10", "changeDatetime":"2016-08-30T09:54:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"INSERT INTO sys_currency(ID,CODE,NAME,NOTE) values(3,'RUB','Российский рубль','Российский рубль')"},
    { "changeID":"sys_currency_11", "changeDatetime":"2016-08-30T09:55:00.000+0300", "changeObj":"sys_currency",
        "changeVal":"INSERT INTO sys_currency(ID,CODE,NAME,NOTE) values(4,'GBR','Английский фунт стерлингов','Английский фунт стерлингов')"}
];
module.exports.changeLog=changeLog;

var tableName="sys_currency", tableFields=["ID","CODE","NAME","NOTE"], idField=tableFields[0];

module.exports.validateData= {tableName:tableName, fields:tableFields, idField:idField};

var tableColumns=[
    {"data": "ID", "name": "ID", "width": 50, "type": "text", visible:true}
    , {"data": "CODE", "name": "CODE", "width": 120, "type": "text"}
    , {"data": "NAME", "name": "NAME", "width": 200, "type": "text"}
    , {"data": "NOTE", "name": "NOTE", "width": 450, "type": "text"}
];

module.exports.validateData= {tableName:tableName, tableColumns:tableColumns, idField:idField};

var dm=this;
/**
 * resultCallback = function(tableData={ columns, identifier, items, error })
 */
module.exports.getDataForSysCurrencyTable= function(conditions, resultCallback){
    dm.getDataForTable({tableName:tableName, tableColumns:tableColumns, identifier:idField,
        order:"ID", conditions:conditions}, resultCallback);
};
