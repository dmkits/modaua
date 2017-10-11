module.exports.id=module.id;
var changeLog=[
    { "changeID":"fin_retail_tickets_payments_v__1", "changeDatetime": "2017-10-09 14:30:00", "changeObj": "fin_retail_tickets_payments_v",
        "changeVal": "CREATE VIEW fin_retail_tickets_payments_v" +
        "(ID, RETAIL_TICKET_ID, RETAIL_RECEIPT_ID, DOCDATE, NUMBER, POS, PRODUCT_ID, QTY, SALE_PRICE, DISCOUNT, PRICE, POSSUM,"+
        "SALE_QTY, RET_SALE_QTY, SALE_POSSUM, RET_SALE_POSSUM, DOCSUM, PAYSUM, " +
        "PAYMENT_FORM_CODE, CASH_SUM, CARD_SUM, SALE_CASH_SUM,SALE_CARD_SUM,RET_SALE_CASH_SUM,RET_SALE_CARD_SUM)AS "+
        "SELECT m.ID, m.RETAIL_TICKET_ID, wrtv.RETAIL_RECEIPT_ID, wrtv.DOCDATE, wrtv.NUMBER, m.POS, m.PRODUCT_ID, m.QTY, m.SALE_PRICE, m.DISCOUNT, m.PRICE, m.POSSUM,"+
        "CASE WHEN m.QTY>0 THEN m.QTY ELSE 0 END as SALE_QTY, CASE WHEN m.QTY<0 THEN -m.QTY ELSE 0 END as RET_SALE_QTY,"+
        "CASE WHEN m.QTY>0 THEN m.POSSUM ELSE 0 END as SALE_POSSUM, CASE WHEN m.QTY<0 THEN -m.POSSUM ELSE 0 END as RET_SALE_POSSUM,"+
        "wrtv.DOCSUM, " +
        "frtp.PAYSUM, frp.PAYMENT_FORM_CODE,"+
        "CASE WHEN frp.PAYMENT_FORM_CODE=1 AND wrtv.DOCSUM<>0 THEN COALESCE(SUM(frp.DOCSUM),0)*m.POSSUM/wrtv.DOCSUM END as CASH_SUM,"+
        "CASE WHEN frp.PAYMENT_FORM_CODE=2 AND wrtv.DOCSUM<>0 THEN COALESCE(SUM(frp.DOCSUM),0)*m.POSSUM/wrtv.DOCSUM END as CARD_SUM, "+
        "CASE WHEN m.QTY>0 AND frp.PAYMENT_FORM_CODE=1 AND wrtv.DOCSUM<>0 THEN COALESCE(SUM(frp.DOCSUM),0)*m.POSSUM/wrtv.DOCSUM ELSE 0 END as SALE_CASH_SUM,"+
        "CASE WHEN m.QTY>0 AND frp.PAYMENT_FORM_CODE=2 AND wrtv.DOCSUM<>0 THEN COALESCE(SUM(frp.DOCSUM),0)*m.POSSUM/wrtv.DOCSUM ELSE 0 END as SALE_CARD_SUM,"+
        "CASE WHEN m.QTY<0 AND frp.PAYMENT_FORM_CODE=1 AND wrtv.DOCSUM<>0 THEN COALESCE(SUM(-frp.DOCSUM),0)*m.POSSUM/wrtv.DOCSUM ELSE 0 END as RET_SALE_CASH_SUM,"+
        "CASE WHEN m.QTY<0 AND frp.PAYMENT_FORM_CODE=2 AND wrtv.DOCSUM<>0 THEN COALESCE(SUM(-frp.DOCSUM),0)*m.POSSUM/wrtv.DOCSUM ELSE 0 END as RET_SALE_CARD_SUM "+
        "FROM wrh_retail_tickets_products m "+
        "INNER JOIN wrh_retail_tickets_v wrtv ON wrtv.ID=m.RETAIL_TICKET_ID "+
        "INNER JOIN fin_retail_tickets_v frtp ON frtp.ID=m.RETAIL_TICKET_ID "+
        "LEFT JOIN fin_retail_payments frp ON frp.RETAIL_RECEIPT_ID=frtp.RETAIL_RECEIPT_ID "+
        "GROUP BY m.ID, m.RETAIL_TICKET_ID, wrtv.RETAIL_RECEIPT_ID, wrtv.DOCDATE, wrtv.NUMBER, " +
        "m.POS, m.PRODUCT_ID, m.QTY, m.SALE_PRICE, m.DISCOUNT, m.PRICE, m.POSSUM,"+
        "wrtv.DOCSUM, frtp.PAYSUM, frp.PAYMENT_FORM_CODE "+
        "ORDER BY wrtv.DOCDATE, wrtv.NUMBER, m.POS",
        viewName:"fin_retail_tickets_payments_v",
        fields:["ID", "RETAIL_TICKET_ID", "RETAIL_RECEIPT_ID", "DOCDATE", "NUMBER",
            "POS", "PRODUCT_ID", "QTY", "SALE_PRICE", "DISCOUNT", "PRICE", "POSSUM", "SALE_QTY", "RET_SALE_QTY", "SALE_POSSUM", "RET_SALE_POSSUM",
            "DOCSUM", "PAYSUM", "PAYMENT_FORM_CODE", "CASH_SUM", "CARD_SUM", "SALE_CASH_SUM","SALE_CARD_SUM","RET_SALE_CASH_SUM","RET_SALE_CARD_SUM"] }
];
module.exports.changeLog=changeLog;