var changeLog = [
{ 'changeID':'wrh_ret_invs__1', 'changeDatetime':'2017-08-11T09:01:00.000+0300', 'changeObj':'model.wrh_ret_invs',
    'changeVal':'CREATE TABLE wrh_ret_invs(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
    "tableName":"wrh_ret_invs", "field":"ID"},
{ 'changeID':'wrh_ret_invs__2', 'changeDatetime':'2017-08-11T09:02:00.000+0300', 'changeObj':'model.wrh_ret_invs',
    'changeVal':'ALTER TABLE wrh_ret_invs ADD COLUMN NUMBER INTEGER NOT NULL',
    "field":"NUMBER"},
{ 'changeID':'wrh_ret_invs__3', 'changeDatetime':'2017-08-11T09:03:00.000+0300', 'changeObj':'model.wrh_ret_invs',
    'changeVal':'ALTER TABLE wrh_ret_invs ADD COLUMN DOCDATE DATE NOT NULL',
    "field":"DOCDATE"},
{ 'changeID':'wrh_ret_invs__4', 'changeDatetime':'2017-08-11T09:04:00.000+0300', 'changeObj':'model.wrh_ret_invs',
    'changeVal':'ALTER TABLE wrh_ret_invs ADD COLUMN UNIT_ID BIGINT UNSIGNED NOT NULL',
    "field":"UNIT_ID"},
{ 'changeID':'wrh_ret_invs__5', 'changeDatetime':'2017-08-11T09:05:00.000+0300', 'changeObj':'model.wrh_ret_invs',
    'changeVal':'ALTER TABLE wrh_ret_invs ADD CONSTRAINT WRH_RET_INVS_UNIT_ID_FK FOREIGN KEY (UNIT_ID) REFERENCES dir_units(ID)' },
{ 'changeID':'wrh_ret_invs__6', 'changeDatetime':'2017-08-11T09:06:00.000+0300', 'changeObj':'model.wrh_ret_invs',
    'changeVal':'ALTER TABLE wrh_ret_invs ADD COLUMN BUYER_ID BIGINT UNSIGNED NOT NULL',
    "field":"BUYER_ID"},
{ 'changeID':'wrh_ret_invs__7', 'changeDatetime':'2017-08-11T09:07:00.000+0300', 'changeObj':'model.wrh_ret_invs',
    'changeVal':'ALTER TABLE wrh_ret_invs ADD CONSTRAINT WRH_RET_INVS_BUYER_ID_FK FOREIGN KEY (BUYER_ID) REFERENCES dir_contractors(ID)' }
];
module.exports.changeLog=changeLog;