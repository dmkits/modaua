module.exports.id=module.id;
var changeLog=[
    { "changeID":"dir_products_batches_v__1", "changeDatetime": "2017-10-18 19:00:00", "changeObj": "dir_products_batches_v",
        "changeVal": "CREATE VIEW dir_products_batches_v(PRODUCT_ID, BATCH_NUMBER, R_DOCUMENT_ID, QTY, PRICE, " +
                "UNIT_ID, DOCDATE, DOCNUMBER, SUPPLIER_ID, CURRENCY_ID, RATE) AS\n"+
            "SELECT m.PRODUCT_ID, m.BATCH_NUMBER, rdpb.R_DOCUMENT_ID, wpip.QTY, wpip.PRICE, " +
                "wpi.UNIT_ID, wpi.DOCDATE, wpi.NUMBER as DOCNUMBER, wpi.SUPPLIER_ID, wpi.CURRENCY_ID, wpi.RATE\n"+
            "FROM dir_products_batches m\n"+
            "LEFT JOIN wrh_r_documents_products_batches rdpb ON rdpb.PRODUCT_ID=m.PRODUCT_ID AND rdpb.BATCH_NUMBER=m.BATCH_NUMBER\n"+
            "LEFT JOIN wrh_pinvs_products wpip ON wpip.PINV_ID=rdpb.R_DOCUMENT_ID AND wpip.PRODUCT_ID=m.PRODUCT_ID AND wpip.BATCH_NUMBER=m.BATCH_NUMBER\n"+
            "LEFT JOIN wrh_pinvs wpi ON wpi.ID=wpip.PINV_ID\n",
        viewName:"dir_products_batches_v",
        fields:["PRODUCT_ID", "BATCH_NUMBER", "R_DOCUMENT_ID", "QTY", "PRICE", "UNIT_ID", "DOCDATE", "DOCNUMBER", "SUPPLIER_ID", "CURRENCY_ID", "RATE"] }
];
module.exports.changeLog=changeLog;