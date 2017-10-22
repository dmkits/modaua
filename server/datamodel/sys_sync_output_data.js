module.exports.id=module.id;
var changeLog = [
    { changeID:"sys_sync_output_data__1", changeDatetime:"2016-10-07 12:21:00", changeObj:"sys_sync_output_data",
        changeVal:"CREATE TABLE sys_sync_output_data(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        tableName:"sys_sync_output_data", field:"ID"},
    { changeID:"sys_sync_output_data__2", changeDatetime:"2016-10-07 12:22:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN CREATE_DATE DATETIME NOT NULL",
        field:"CREATE_DATE"},
    { changeID:"sys_sync_output_data__3", changeDatetime:"2016-10-07 12:23:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ALTER COLUMN CREATE_DATE  DROP DEFAULT" },
    { changeID:"sys_sync_output_data__4", changeDatetime:"2016-10-07 12:24:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN SYNC_DATABASE_ID BIGINT UNSIGNED NOT NULL",
        field:"SYNC_DATABASE_ID"},
    { changeID:"sys_sync_output_data__5", changeDatetime:"2016-10-07 12:25:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD CONSTRAINT SYS_SYNC_OUTPUT_DATA_SYNC_DATABASE_ID_FK " +
            "FOREIGN KEY (SYNC_DATABASE_ID) REFERENCES sys_sync_databases(ID)" },
    { changeID:"sys_sync_output_data__6", changeDatetime:"2016-10-07 12:26:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN TABLE_NAME VARCHAR(255) NOT NULL",
        field:"TABLE_NAME"},
    { changeID:"sys_sync_output_data__7", changeDatetime:"2016-10-07 12:27:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN KEY_DATA_NAME VARCHAR(255) NOT NULL",
        field:"KEY_DATA_NAME"},
    { changeID:"sys_sync_output_data__8", changeDatetime:"2016-10-07 12:28:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN KEY_DATA_VALUE VARCHAR(255) NOT NULL",
        field:"KEY_DATA_VALUE"},
    { changeID:"sys_sync_output_data__9", changeDatetime:"2016-10-07 12:29:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN LAST_UPDATE_DATE DATETIME NULL",
        field:"LAST_UPDATE_DATE"},
    { changeID:"sys_sync_output_data_10", changeDatetime:"2016-10-07 12:30:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ALTER COLUMN LAST_UPDATE_DATE  DROP DEFAULT" },
    { changeID:"sys_sync_output_data_11", changeDatetime:"2016-10-07 12:31:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN STATE INTEGER",
        field:"STATE"},
    { changeID:"sys_sync_output_data_12", changeDatetime:"2016-10-07 12:32:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN CLIENT_SYNC_DATA_ID BIGINT UNSIGNED",
        field:"CLIENT_SYNC_DATA_ID"},
    { changeID:"sys_sync_output_data_13", changeDatetime:"2016-10-07 12:33:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN APPLIED_DATE DATETIME NULL",
        field:"APPLIED_DATE"},
    { changeID:"sys_sync_output_data_14", changeDatetime:"2016-10-07 12:34:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ALTER COLUMN APPLIED_DATE  DROP DEFAULT" },
    { changeID:"sys_sync_output_data_15", changeDatetime:"2016-10-07 12:35:00", changeObj:"sys_sync_output_data",
        changeVal:"ALTER TABLE sys_sync_output_data ADD COLUMN CLIENT_MESSAGE VARCHAR(255)",
        field:"CLIENT_MESSAGE"}
];
module.exports.changeLog=changeLog;