module.exports.id=module.id;
var changeLog=[
    { "changeID":"fin_retail_receipts_payments_v__1", "changeDatetime": "2017-10-09 16:30:00", "changeObj": "fin_retail_receipts_payments_v",
        "changeVal": "CREATE VIEW fin_retail_receipts_payments_v(ID, UNIT_ID, BUYER_ID, CURRENCY_ID, DOCSTATE_ID, DOCDATE, NUMBER, PAYMENT_FORM_CODE, DOCSUM,"+
        "RETAIL_TICKET_ID, TICKET_DOCDATE, TICKET_NUMBER, TICKET_SUM, TICKET_PAYSUM,"+
        "CASH_IN, CASH_OUT, CASH_SALE, CASH_RET_SALE) AS "+
        "SELECT m.ID, m.UNIT_ID, m.BUYER_ID, m.CURRENCY_ID, m.DOCSTATE_ID, m.DOCDATE, m.NUMBER, frp.PAYMENT_FORM_CODE, frp.DOCSUM,"+
        "wrtv.ID as RETAIL_TICKET_ID, wrtv.DOCDATE as TICKET_DOCDATE, wrtv.NUMBER as TICKET_NUMBER, wrtv.DOCSUM as TICKET_SUM, frtp.PAYSUM as TICKET_PAYSUM,"+
        "CASE WHEN frp.DOCSUM>0 AND wrtv.ID is NULL THEN frp.DOCSUM ELSE NULL END as CASH_IN,"+
        "CASE WHEN frp.DOCSUM<0 AND wrtv.ID is NULL THEN -frp.DOCSUM ELSE NULL END as CASH_OUT,"+
        "CASE WHEN frp.DOCSUM>0 AND NOT wrtv.ID is NULL THEN frp.DOCSUM ELSE NULL END as CASH_SALE,"+
        "CASE WHEN frp.DOCSUM<0 AND NOT wrtv.ID is NULL THEN -frp.DOCSUM ELSE NULL END as CASH_RET_SALE "+
        "FROM fin_retail_receipts m "+
        "INNER JOIN fin_retail_payments frp ON frp.RETAIL_RECEIPT_ID=m.ID AND frp.PAYMENT_FORM_CODE=1 "+
        "LEFT JOIN wrh_retail_tickets_v wrtv ON wrtv.RETAIL_RECEIPT_ID=m.ID "+
        "LEFT JOIN fin_retail_tickets_v frtp ON frtp.RETAIL_RECEIPT_ID=m.ID "+
        "ORDER BY m.DOCDATE, m.NUMBER, wrtv.NUMBER",
        viewName:"fin_retail_receipts_payments_v",
        fields:["ID", "UNIT_ID", "BUYER_ID", "CURRENCY_ID", "DOCSTATE_ID", "DOCDATE", "NUMBER", "PAYMENT_FORM_CODE", "DOCSUM",
            "RETAIL_TICKET_ID", "TICKET_DOCDATE", "TICKET_NUMBER", "TICKET_SUM","TICKET_PAYSUM",
            "CASH_IN", "CASH_OUT", "CASH_SALE", "CASH_RET_SALE"]}
];
module.exports.changeLog=changeLog;