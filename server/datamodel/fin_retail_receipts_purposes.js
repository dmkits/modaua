var changeLog = [
{ 'changeID':'fin_retail_receipts_purposes__1', 'changeDatetime':'2017-06-26T16:55:00.000+0300', 'changeObj':'model.fin_retail_receipts_purposes',
    'changeVal':'CREATE TABLE fin_retail_receipts_purposes(RETAIL_RECEIPT_ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
    "tableName":"fin_retail_receipts_purposes", "field":"ID"},
{ 'changeID':'fin_retail_receipts_purposes__2', 'changeDatetime':'2017-06-26T16:56:00.000+0300', 'changeObj':'model.fin_retail_receipts_purposes',
    'changeVal':'ALTER TABLE fin_retail_receipts_purposes ADD COLUMN RETAIL_RECEIPT_PURPOSE_ID INTEGER NOT NULL',
    "field":"RETAIL_RECEIPT_PURPOSE_ID"},
{ 'changeID':'fin_retail_receipts_purposes__3', 'changeDatetime':'2017-06-26T16:57:00.000+0300', 'changeObj':'model.fin_retail_receipts_purposes',
    'changeVal':'ALTER TABLE fin_retail_receipts_purposes ADD CONSTRAINT FIN_RETAIL_RECEIPTS_PURPOSES_R_R_PURPOSE_ID_FK FOREIGN KEY (RETAIL_RECEIPT_PURPOSE_ID) REFERENCES dir_retail_receipt_purposes(ID)' },
{ 'changeID':'fin_retail_receipts_purposes__4', 'changeDatetime':'2017-06-26T16:58:00.000+0300', 'changeObj':'model.fin_retail_receipts_purposes',
    'changeVal':'ALTER TABLE fin_retail_receipts_purposes ADD COLUMN NOTE VARCHAR(255) NOT NULL',
    "field":"NOTE"}
];
module.exports.changeLog=changeLog;
