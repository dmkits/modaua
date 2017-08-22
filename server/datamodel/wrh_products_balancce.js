var changeLog = [
    { 'changeID':'wrh_products_balance_01', 'changeDatetime':'2017-06-13T16:10:00.000+0300', 'changeObj':'model.wrh_products_balance',
'changeVal':'CREATE VIEW wrh_products_batches_balance(PRODUCT_ID, UNIT_ID, BATCH_NUMBER, BATCH_BALANCE) AS SELECT PRODUCT_ID, UNIT_ID, BATCH_NUMBER, SUM(BATCH_QTY) as BATCH_BALANCE FROM wrh_products_operations GR UP BY PRODUCT_ID, UNIT_ID, BATCH_NUMBER HAVING SUM(BATCH_QTY)<>0 ' }
];
module.exports.changeLog=changeLog;
