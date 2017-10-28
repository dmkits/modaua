module.exports.id=module.id;
var changeLog = [
    { changeID:"sys_sync_errors_log__1", changeDatetime:"2016-11-26 14:01:00", changeObj:"sys_sync_errors_log",
        changeVal:"CREATE TABLE sys_sync_errors_log(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        tableName:"sys_sync_errors_log", field:"ID"},
    { changeID:"sys_sync_errors_log__2", changeDatetime:"2016-11-26 14:02:00", changeObj:"sys_sync_errors_log",
        changeVal:"ALTER TABLE sys_sync_errors_log ADD COLUMN ERROR_MSG VARCHAR(1024) NOT NULL",
        field:"ERROR_MSG"},
    { changeID:"sys_sync_errors_log__3", changeDatetime:"2016-11-26 14:03:00", changeObj:"sys_sync_errors_log",
        changeVal:"ALTER TABLE sys_sync_errors_log ADD COLUMN CREATE_DATE DATETIME NOT NULL",
        field:"CREATE_DATE"},
    { changeID:"sys_sync_errors_log__4", changeDatetime:"2016-11-26 14:04:00", changeObj:"sys_sync_errors_log",
        changeVal:"ALTER TABLE sys_sync_errors_log ALTER COLUMN CREATE_DATE  DROP DEFAULT" },
    { changeID:"sys_sync_errors_log__5", changeDatetime:"2016-11-26 14:05:00", changeObj:"sys_sync_errors_log",
        changeVal:"ALTER TABLE sys_sync_errors_log ADD COLUMN HEADER VARCHAR(255)",
        field:"HEADER"},
    { changeID:"sys_sync_errors_log__6", changeDatetime:"2016-11-26 14:06:00", changeObj:"sys_sync_errors_log",
        changeVal:"ALTER TABLE sys_sync_errors_log ADD COLUMN CLIENT_POS_NAME VARCHAR(255)",
        field:"CLIENT_POS_NAME"},
    { changeID:"sys_sync_errors_log__7", changeDatetime:"2016-11-26 14:07:00", changeObj:"sys_sync_errors_log",
        changeVal:"ALTER TABLE sys_sync_errors_log ADD COLUMN CLIENT_POS_HOST_NAME VARCHAR(255)",
        field:"CLIENT_POS_HOST_NAME"},
    { changeID:"sys_sync_errors_log__8", changeDatetime:"2016-11-26 14:08:00", changeObj:"sys_sync_errors_log",
        changeVal:"ALTER TABLE sys_sync_errors_log ADD COLUMN CLIENT_DATA VARCHAR(1000) NULL",
        field:"CLIENT_DATA"}
];
module.exports.changeLog=changeLog;