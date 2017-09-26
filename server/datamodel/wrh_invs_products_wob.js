module.exports.id=module.id;
var changeLog = [
    { 'changeID':'wrh_inv_products_wob__1', 'changeDatetime':'2017-06-09 14:01:00', 'changeObj':'model.wrh_inv_products_wob',
        'changeVal':'CREATE TABLE wrh_inv_products_wob(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
        "tableName":"wrh_inv_products_wob", "field":"ID"},
    { 'changeID':'wrh_inv_products_wob__2', 'changeDatetime':'2017-06-09 14:02:00', 'changeObj':'model.wrh_inv_products_wob',
        'changeVal':'ALTER TABLE wrh_inv_products_wob ADD COLUMN INV_PRODUCTS_ID BIGINT UNSIGNED NOT NULL',
        'field':'INV_PRODUCTS_ID'},
    { 'changeID':'wrh_inv_products_wob__3', 'changeDatetime':'2017-06-09 14:03:00', 'changeObj':'model.wrh_inv_products_wob',
        'changeVal':'ALTER TABLE wrh_inv_products_wob ADD CONSTRAINT WRH_INV_PRODUCTS_WOB_INV_PRODUCTS_ID_FK FOREIGN KEY (INV_PRODUCTS_ID) REFERENCES wrh_inv_products(ID)' },
    { 'changeID':'wrh_inv_products_wob__4', 'changeDatetime':'2017-06-09 14:04:00', 'changeObj':'model.wrh_inv_products_wob',
        'changeVal':'ALTER TABLE wrh_inv_products_wob ADD COLUMN BATCH_NUMBER INTEGER NOT NULL',
        'field':'BATCH_NUMBER'},
    { 'changeID':'wrh_inv_products_wob__5', 'changeDatetime':'2017-06-09 14:05:00', 'changeObj':'model.wrh_inv_products_wob',
        'changeVal':'ALTER TABLE wrh_inv_products_wob ADD COLUMN BATCH_QTY DECIMAL(12,3) NOT NULL',
        'field':'BATCH_QTY'}
];
module.exports.changeLog=changeLog;
