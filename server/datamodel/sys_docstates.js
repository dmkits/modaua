var changeLog= [
    { "changeID":"sys_docstates__1", "changeDatetime":"2016-08-30T09:01:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"CREATE TABLE sys_docstates(ID INTEGER NOT NULL PRIMARY KEY) CHARACTER SET utf8",
        "tableName":"sys_docstates", "field":"ID", "id":"ID" },
    { "changeID":"sys_docstates__2", "changeDatetime":"2016-08-30T09:02:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"ALTER TABLE sys_docstates ADD COLUMN ALIAS VARCHAR(50) NOT NULL",
        "field":"ALIAS" },
    { "changeID":"sys_docstates__3", "changeDatetime":"2016-08-30T09:03:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"ALTER TABLE sys_docstates ADD CONSTRAINT SYS_DOCSTATES_ALIAS_UNIQUE UNIQUE(ALIAS)"},
    { "changeID":"sys_docstates__4", "changeDatetime":"2016-08-30T09:04:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"ALTER TABLE sys_docstates ADD COLUMN NAME VARCHAR(50) NOT NULL",
        "field":"NAME" },
    { "changeID":"sys_docstates__5", "changeDatetime":"2016-08-30T09:05:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"ALTER TABLE sys_docstates ADD CONSTRAINT SYS_DOCSTATES_NAME_UNIQUE UNIQUE(NAME)"},
    { "changeID":"sys_docstates__6", "changeDatetime":"2016-08-30T09:06:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"ALTER TABLE sys_docstates ADD COLUMN NOTE VARCHAR(255) NOT NULL",
        "field":"NOTE" },
    { "changeID":"sys_docstates__7", "changeDatetime":"2016-08-30T09:07:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":
            "INSERT INTO sys_docstates(ID,ALIAS,NAME,NOTE)" +
                " values(0,'saved','Документ сохранен','Документ сохранен')"},
    { "changeID":"sys_docstates__8", "changeDatetime":"2016-08-30T09:08:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":
            "INSERT INTO sys_docstates(ID,ALIAS,NAME,NOTE)" +
                " values(-255,'deleted','Документ удален','Документ удален (помечен на удаление)')"},
    { "changeID":"sys_docstates__9", "changeDatetime":"2016-08-30T09:09:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"INSERT INTO sys_docstates(ID,ALIAS,NAME,NOTE)" +
            " values(1,'conducted','Документ проведен','Документ проведен')"},
    { "changeID":"sys_docstates_10", "changeDatetime":"2016-08-30T09:10:00.000+0300", "changeObj":"sys_docstates",
        "changeVal":"INSERT INTO sys_docstates(ID,ALIAS,NAME,NOTE)" +
            " values(-1,'not_conducted','Документ не проведен (ошибка)','Документ не проведен (ошибка проведения)')"}
];
module.exports.changeLog=changeLog;

