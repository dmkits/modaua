var changeLog = [
{ 'changeID':'sys_sync_incoming_data__1', 'changeDatetime':'2016-09-26 10:21:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'CREATE TABLE sys_sync_incoming_data(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
    "tableName":"sys_sync_incoming_data", "field":"ID"},
{ 'changeID':'sys_sync_incoming_data__2', 'changeDatetime':'2016-09-26 10:22:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN CREATE_DATE DATETIME NULL',
    "field":"CREATE_DATE"},
{ 'changeID':'sys_sync_incoming_data__3', 'changeDatetime':'2016-09-26 10:23:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ALTER COLUMN CREATE_DATE DROP DEFAULT' },
{ 'changeID':'sys_sync_incoming_data__4', 'changeDatetime':'2016-09-26 10:24:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN SYNC_DATABASE_ID BIGINT UNSIGNED NOT NULL',
    "field":"SYNC_DATABASE_ID"},
{ 'changeID':'sys_sync_incoming_data__5', 'changeDatetime':'2016-09-26 10:25:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD CONSTRAINT SYS_SYNC_INCOMING_DATA_SYNC_DATABASE_ID_FK ' +
        'FOREIGN KEY (SYNC_DATABASE_ID) REFERENCES sys_sync_databases(ID)' },
{ 'changeID':'sys_sync_incoming_data__6', 'changeDatetime':'2016-09-26 10:26:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN CLIENT_DATA_ID BIGINT UNSIGNED NOT NULL',
    "field":"CLIENT_DATA_ID"},
{ 'changeID':'sys_sync_incoming_data__7', 'changeDatetime':'2016-09-26 10:27:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD CONSTRAINT SYS_SYNC_INCOMING_DATA_SYNC_DATABASE_ID_CLIENT_DATA_ID_UNIQUE UNIQUE(SYNC_DATABASE_ID,CLIENT_DATA_ID)' },
{ 'changeID':'sys_sync_incoming_data__8', 'changeDatetime':'2016-09-26 10:28:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN CLIENT_CREATE_DATE DATETIME NOT NULL',
    "field":"CLIENT_CREATE_DATE"},
{ 'changeID':'sys_sync_incoming_data__9', 'changeDatetime':'2016-09-26 10:29:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ALTER COLUMN CLIENT_CREATE_DATE  DROP DEFAULT' },
{ 'changeID':'sys_sync_incoming_data_10', 'changeDatetime':'2016-09-26 10:30:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN OPERATION_TYPE VARCHAR(1) NOT NULL',
    "field":"OPERATION_TYPE"},
{ 'changeID':'sys_sync_incoming_data_11', 'changeDatetime':'2016-09-26 10:31:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN CLIENT_TABLE_NAME VARCHAR(255) NOT NULL',
    "field":"CLIENT_TABLE_NAME"},
{ 'changeID':'sys_sync_incoming_data_12', 'changeDatetime':'2016-09-26 10:32:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN CLIENT_TABLE_KEY1_NAME VARCHAR(255) NOT NULL',
    "field":"CLIENT_TABLE_KEY1_NAME"},
{ 'changeID':'sys_sync_incoming_data_13', 'changeDatetime':'2016-09-26 10:33:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN CLIENT_TABLE_KEY1_VALUE VARCHAR(255) NOT NULL',
    "field":"CLIENT_TABLE_KEY1_VALUE"},
{ 'changeID':'sys_sync_incoming_data_14', 'changeDatetime':'2016-09-26 10:34:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN LAST_UPDATE_DATE DATETIME NULL',
    "field":"LAST_UPDATE_DATE"},
{ 'changeID':'sys_sync_incoming_data_15', 'changeDatetime':'2016-09-26 10:35:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ALTER COLUMN LAST_UPDATE_DATE  DROP DEFAULT' },
{ 'changeID':'sys_sync_incoming_data_16', 'changeDatetime':'2016-09-26 10:36:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN STATE INTEGER NOT NULL',
    "field":"STATE"},
{ 'changeID':'sys_sync_incoming_data_17', 'changeDatetime':'2016-09-26 16:37:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN APPLIED_DATE DATETIME NULL',
    "field":"APPLIED_DATE"},
{ 'changeID':'sys_sync_incoming_data_18', 'changeDatetime':'2016-09-26 16:38:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ALTER COLUMN APPLIED_DATE  DROP DEFAULT' },
{ 'changeID':'sys_sync_incoming_data_19', 'changeDatetime':'2016-11-25 15:39:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN MSG VARCHAR(255) NOT NULL',
    "field":"MSG"},
{ 'changeID':'sys_sync_incoming_data_20', 'changeDatetime':'2016-11-25 15:40:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN DEST_TABLE_CODE INTEGER',
    "field":"DEST_TABLE_CODE"},
{ 'changeID':'sys_sync_incoming_data_21', 'changeDatetime':'2016-11-25 15:41:00', 'changeObj':'sys_sync_incoming_data',
    'changeVal':'ALTER TABLE sys_sync_incoming_data ADD COLUMN DEST_TABLE_DATA_ID BIGINT UNSIGNED',
    "field":"DEST_TABLE_DATA_ID"}
];
module.exports.changeLog=changeLog;