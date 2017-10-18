module.exports.id=module.id;
var changeLog = [
    { 'changeID':'wrh_r_documents_products_batches__1', 'changeDatetime':'2017-06-09 11:10:00', 'changeObj':'wrh_r_documents_products_batches',
        'changeVal':'CREATE TABLE wrh_r_documents_products_batches(R_DOCUMENT_ID BIGINT UNSIGNED NOT NULL) CHARACTER SET utf8',
        "tableName":"wrh_r_documents_products_batches", "field":"R_DOCUMENT_ID"},
    { 'changeID':'wrh_r_documents_products_batches__2', 'changeDatetime':'2017-06-09 11:11:00', 'changeObj':'wrh_r_documents_products_batches',
        'changeVal':'ALTER TABLE wrh_r_documents_products_batches ADD CONSTRAINT WRH_RDPB_R_DOCUMENT_ID_FK ' +
        'FOREIGN KEY (R_DOCUMENT_ID) REFERENCES wrh_r_documents(ID)' },
    { "changeID": "wrh_r_documents_products_batches__3","changeDatetime":"2017-06-09 11:12:00", "changeObj": "wrh_r_documents_products_batches",
        "changeVal": "ALTER TABLE wrh_r_documents_products_batches ADD COLUMN PRODUCT_ID BIGINT UNSIGNED NOT NULL",
        "field":"PRODUCT_ID" },
    { "changeID": "wrh_r_documents_products_batches__4","changeDatetime":"2017-06-09 11:13:00", "changeObj": "wrh_r_documents_products_batches",
        "changeVal": "ALTER TABLE wrh_r_documents_products_batches ADD COLUMN BATCH_NUMBER INTEGER UNSIGNED NOT NULL",
        "field":"BATCH_NUMBER" },
    { 'changeID':'wrh_r_documents_products_batches__5', 'changeDatetime':'2017-06-09 11:14:00', 'changeObj':'wrh_r_documents_products_batches',
        'changeVal':'ALTER TABLE wrh_r_documents_products_batches ADD CONSTRAINT WRH_RDPB_PRODUCT_ID_BATCH_NUMBER_UNIQUE' +
            ' UNIQUE(PRODUCT_ID,BATCH_NUMBER)' },
    { 'changeID': 'wrh_r_documents_products_batches__6', 'changeDatetime':'2017-06-09 11:15:00', 'changeObj':'wrh_r_documents_products_batches',
        'changeVal':'ALTER TABLE wrh_r_documents_products_batches ADD CONSTRAINT WRH_R_DOCS_PRODS_BATCHES_PRODUCT_ID_BATCH_NUMBER_FK ' +
        'FOREIGN KEY (BATCH_NUMBER,PRODUCT_ID) REFERENCES dir_products_batches(BATCH_NUMBER,PRODUCT_ID)' },
    { "changeID": "wrh_r_documents_products_batches__7","changeDatetime":"2017-06-09 11:16:00", "changeObj": "wrh_r_documents_products_batches",
        "changeVal": "ALTER TABLE wrh_r_documents_products_batches ADD PRIMARY KEY (R_DOCUMENT_ID, PRODUCT_ID, BATCH_NUMBER)"}
];
module.exports.changeLog=changeLog;