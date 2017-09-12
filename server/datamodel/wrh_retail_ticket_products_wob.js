var changeLog = [
{ 'changeID':'wrh_retail_ticket_products_wob__1', 'changeDatetime':'2017-06-09T17:01:00.000+0300', 'changeObj':'model.wrh_retail_ticket_products_wob',
    'changeVal':'CREATE TABLE wrh_retail_ticket_products_wob(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
    "tableName":"wrh_retail_ticket_products_wob", "field":"ID"},
{ 'changeID':'wrh_retail_ticket_products_wob__2', 'changeDatetime':'2017-06-09T17:02:00.000+0300', 'changeObj':'model.wrh_retail_ticket_products_wob',
    'changeVal':'ALTER TABLE wrh_retail_ticket_products_wob ADD COLUMN RETAIL_TICKET_PRODUCTS_ID BIGINT UNSIGNED NOT NULL',
    "field":"RETAIL_TICKET_PRODUCTS_ID"},
{ 'changeID':'wrh_retail_ticket_products_wob__3', 'changeDatetime':'2017-06-09T17:03:00.000+0300', 'changeObj':'model.wrh_retail_ticket_products_wob',
    'changeVal':'ALTER TABLE wrh_retail_ticket_products_wob ADD CONSTRAINT WRH_RETAIL_TICKET_PRODUCTS_WOB_RETAIL_TICKET_PRODUCTS_ID_FK FOREIGN KEY (RETAIL_TICKET_PRODUCTS_ID) REFERENCES wrh_retail_ticket_products(ID)' },
{ 'changeID':'wrh_retail_ticket_products_wob__4', 'changeDatetime':'2017-06-09T17:04:00.000+0300', 'changeObj':'model.wrh_retail_ticket_products_wob',
    'changeVal':'ALTER TABLE wrh_retail_ticket_products_wob ADD COLUMN BATCH_NUMBER INTEGER NOT NULL',
    "field":"BATCH_NUMBER"},
{ 'changeID':'wrh_retail_ticket_products_wob__5', 'changeDatetime':'2017-06-09T17:05:00.000+0300', 'changeObj':'model.wrh_retail_ticket_products_wob',
    'changeVal':'ALTER TABLE wrh_retail_ticket_products_wob ADD COLUMN BATCH_QTY DECIMAL(12,3) NOT NULL',
    "field":"BATCH_QTY"}
];
module.exports.changeLog=changeLog;