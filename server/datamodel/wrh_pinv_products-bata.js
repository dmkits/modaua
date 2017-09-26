module.exports.id=module.id;
var changeLog = [
    { 'changeID':'wrh_pinv_products__1', 'changeDatetime':'2016-09-08 11:31:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'CREATE TABLE wrh_pinv_products(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
        "tableName":"wrh_pinv_products", "field":"ID"},
    { 'changeID':'wrh_pinv_products__2', 'changeDatetime':'2016-09-08 11:32:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN PINV_ID BIGINT UNSIGNED NOT NULL',
        "field":"PINV_ID"},
    { 'changeID':'wrh_pinv_products__3', 'changeDatetime':'2016-09-08 11:33:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD CONSTRAINT WRH_PINV_PRODUCTS_PINV_ID_FK' +
        ' FOREIGN KEY (PINV_ID) REFERENCES wrh_pinvs(ID)' },
    { 'changeID':'wrh_pinv_products__4', 'changeDatetime':'2016-09-08 11:34:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN POSIND FLOAT NOT NULL',
        "field":"POSIND"},
    { 'changeID':'wrh_pinv_products__5', 'changeDatetime':'2016-09-08 11:35:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN PRODUCT_ID BIGINT UNSIGNED NOT NULL',
        "field":"PRODUCT_ID"},
    { 'changeID':'wrh_pinv_products__6', 'changeDatetime':'2016-09-08 11:36:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD CONSTRAINT WRH_PINV_PRODUCTS_PRODUCT_ID_FK' +
        ' FOREIGN KEY (PRODUCT_ID) REFERENCES dir_products(ID)' },
    { 'changeID':'wrh_pinv_products__7', 'changeDatetime':'2016-09-08 11:37:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN QTY DECIMAL(12,3) NOT NULL',
        "field":"QTY"},
    { 'changeID':'wrh_pinv_products__8', 'changeDatetime':'2016-09-08 11:38:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN PRICE DECIMAL(12,4) NOT NULL',
        "field":"PRICE"},
    { 'changeID':'wrh_pinv_products__9', 'changeDatetime':'2016-09-08 11:39:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN POSSUM DECIMAL(12,2) NOT NULL',
        "field":"POSSUM"},
    { 'changeID':'wrh_pinv_products_10', 'changeDatetime':'2016-09-08 11:40:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN SALE_PRICE DECIMAL(12,2) NOT NULL',
        "field":"SALE_PRICE"},
    { 'changeID':'wrh_pinv_products_11', 'changeDatetime':'2016-09-08 11:41:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN BARCODE BIGINT UNSIGNED NOT NULL',
        "field":"BARCODE"},
    { 'changeID':'wrh_pinv_products_12', 'changeDatetime':'2016-09-08 11:42:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD CONSTRAINT WRH_PINV_PRODUCTS_BARCODE_PRODUCT_ID_FK' +
        ' FOREIGN KEY (BARCODE,PRODUCT_ID) REFERENCES dir_products_barcodes(BARCODE,PRODUCT_ID)' },
    { 'changeID':'wrh_pinv_products_13', 'changeDatetime':'2016-09-08 11:43:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN FACTOR DECIMAL(10,2) NOT NULL',
        "field":"FACTOR"},
    { 'changeID':'wrh_pinv_products_14', 'changeDatetime':'2016-09-08 11:44:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD CONSTRAINT PINV_ID_POSIND_UNIQUE' +
        ' UNIQUE(PINV_ID,POSIND)' },
    { 'changeID':'wrh_pinv_products_15', 'changeDatetime':'2017-06-09 11:11:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD COLUMN BATCH_NUMBER INTEGER UNSIGNED NOT NULL',
        "field":"BATCH_NUMBER"},
    { 'changeID':'wrh_pinv_products_16', 'changeDatetime':'2017-06-09 11:12:00', 'changeObj':'wrh_pinv_products',
        'changeVal':'ALTER TABLE wrh_pinv_products ADD CONSTRAINT WRH_PINV_PRODUCTS_PRODUCT_BATCH_NUMBER_PRODUCT_ID_FK' +
        ' FOREIGN KEY (BATCH_NUMBER,PRODUCT_ID) REFERENCES dir_products_batches(BATCH_NUMBER,PRODUCT_ID)' }
];
module.exports.changeLog=changeLog;
