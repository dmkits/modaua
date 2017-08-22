var changeLog = [
{ 'changeID':'sys_sync_databases__1', 'changeDatetime':'2016-09-26T10:01:00.000+0300', 'changeObj':'model.sys_sync_databases',
    'changeVal':'CREATE TABLE sys_sync_databases(ID BIGINT NOT NULL PRIMARY KEY) CHARACTER SET utf8',
    "tableName":"sys_sync_databases", "field":"ID"},
{ 'changeID':'sys_sync_databases__2', 'changeDatetime':'2016-09-26T10:02:00.000+0300', 'changeObj':'model.sys_sync_databases',
    'changeVal':'ALTER TABLE sys_sync_databases ADD COLUMN DATABASE_NAME VARCHAR(255) NOT NULL',
    "field":"DATABASE_NAME"},
{ 'changeID':'sys_sync_databases__3', 'changeDatetime':'2016-09-26T10:03:00.000+0300', 'changeObj':'model.sys_sync_databases',
    'changeVal':'ALTER TABLE sys_sync_databases ADD COLUMN POS_NAME VARCHAR(255) NOT NULL',
    "field":"POS_NAME"},
{ 'changeID':'sys_sync_databases__4', 'changeDatetime':'2016-09-26T10:04:00.000+0300', 'changeObj':'model.sys_sync_databases',
    'changeVal':'ALTER TABLE sys_sync_databases ADD COLUMN STOCK_NAME VARCHAR(255) NOT NULL',
    "field":"STOCK_NAME"},
{ 'changeID':'sys_sync_databases__5', 'changeDatetime':'2016-09-26T10:05:00.000+0300', 'changeObj':'model.sys_sync_databases',
    'changeVal':'INSERT INTO sys_sync_databases(ID,DATABASE_NAME,POS_NAME,STOCK_NAME) values(1,\'ShopBata1POS1\',\'ShopBata1POS1\',\'Bata1Shop\')' },
{ 'changeID':'sys_sync_databases__6', 'changeDatetime':'2016-09-26T10:06:00.000+0300', 'changeObj':'model.sys_sync_databases',
    'changeVal':'INSERT INTO sys_sync_databases(ID,DATABASE_NAME,POS_NAME,STOCK_NAME) values(2,\'Bata1\',\'Bata1 POS1\',\'Stock Bata1\')' }
];
module.exports.changeLog=changeLog;