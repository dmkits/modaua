var changeLog = [
{ 'changeID':'sys_sync_incoming_data_details__1', 'changeDatetime':'2016-09-26T14:21:00.000+0300', 'changeObj':'model.sys_sync_incoming_data_details',
    'changeVal':'CREATE TABLE sys_sync_incoming_data_details(ID BIGINT NOT NULL PRIMARY KEY) CHARACTER SET utf8',
    "tableName":"sys_sync_incoming_data_details", "field":"ID"},
{ 'changeID':'sys_sync_incoming_data_details__2', 'changeDatetime':'2016-09-26T14:22:00.000+0300', 'changeObj':'model.sys_sync_incoming_data_details',
    'changeVal':'ALTER TABLE sys_sync_incoming_data_details ADD COLUMN SYNC_INCOMING_DATA_ID BIGINT NOT NULL',
    "field":"SYNC_INCOMING_DATA_ID"},
{ 'changeID':'sys_sync_incoming_data_details__3', 'changeDatetime':'2016-09-26T14:23:00.000+0300', 'changeObj':'model.sys_sync_incoming_data_details',
    'changeVal':'ALTER TABLE sys_sync_incoming_data_details ADD CONSTRAINT SYS_SYNC_INCOMING_DATA_DETAILS_SYNC_INCOMING_DATA_ID_FK FOREIGN KEY (SYNC_INCOMING_DATA_ID) REFERENCES sys_sync_incoming_data(ID)' },
{ 'changeID':'sys_sync_incoming_data_details__4', 'changeDatetime':'2016-09-26T14:24:00.000+0300', 'changeObj':'model.sys_sync_incoming_data_details',
    'changeVal':'ALTER TABLE sys_sync_incoming_data_details ADD COLUMN NAME VARCHAR(255) NOT NULL',
    "field":"NAME"},
{ 'changeID':'sys_sync_incoming_data_details__5', 'changeDatetime':'2016-09-26T14:25:00.000+0300', 'changeObj':'model.sys_sync_incoming_data_details',
    'changeVal':'ALTER TABLE sys_sync_incoming_data_details ADD COLUMN VALUE VARCHAR(255) NOT NULL',
    "field":"VALUE"}
];
module.exports.changeLog=changeLog;