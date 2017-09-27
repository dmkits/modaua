module.exports.id=module.id;
var changeLog = [
    { 'changeID':'fin_retail_payments__1', 'changeDatetime':'2016-09-26 21:31:00', 'changeObj':'fin_retail_payments',
        'changeVal':'CREATE TABLE fin_retail_payments(ID BIGINT UNSIGNED NOT NULL PRIMARY KEY) CHARACTER SET utf8',
        "tableName":"fin_retail_payments", "field":"ID"},
    { 'changeID':'fin_retail_payments__2', 'changeDatetime':'2016-09-26 21:32:00', 'changeObj':'fin_retail_payments',
        'changeVal':'ALTER TABLE fin_retail_payments ADD COLUMN RETAIL_RECEIPT_ID BIGINT UNSIGNED NOT NULL',
        "field":"RETAIL_RECEIPT_ID"},
    { 'changeID':'fin_retail_payments__3', 'changeDatetime':'2016-09-26 21:33:00', 'changeObj':'fin_retail_payments',
        'changeVal':'ALTER TABLE fin_retail_payments ADD CONSTRAINT FIN_RETAIL_PAYMENTS_RETAIL_RECEIPT_ID_FK ' +
            'FOREIGN KEY (RETAIL_RECEIPT_ID) REFERENCES fin_retail_receipts(ID)'},
    { 'changeID':'fin_retail_payments__4', 'changeDatetime':'2016-09-26 21:34:00', 'changeObj':'fin_retail_payments',
        'changeVal':'ALTER TABLE fin_retail_payments ADD COLUMN DOCSUM DECIMAL(12,2) NOT NULL',
        "field":"DOCSUM"},
    { 'changeID':'fin_retail_payments__5', 'changeDatetime':'2016-09-26 21:35:00', 'changeObj':'fin_retail_payments',
        'changeVal':'ALTER TABLE fin_retail_payments ADD COLUMN PAYMENT_FORM_CODE INTEGER UNSIGNED NOT NULL',
        "field":"PAYMENT_FORM_CODE"},
    { 'changeID':'fin_retail_payments__6', 'changeDatetime':'2017-06-27 08:15:00', 'changeObj':'fin_retail_receipts_payments',
        'changeVal':'CREATE VIEW fin_retail_receipts_payments' +
            '(RETAIL_RECEIPT_ID, UNIT_ID, NUMBER, DOCDATE, BUYER_ID, CURRENCY_ID, RATE, DOCSTATE_ID, '+
            'PAYMENT_FORM_CODE, DOCSUM, TICKETNUMBER, TICKETDATE) AS '+
            'SELECT frr.ID, frr.UNIT_ID, frr.NUMBER, frr.DOCDATE, frr.BUYER_ID, frr.CURRENCY_ID, frr.RATE, frr.DOCSTATE_ID, '+
            'frp.PAYMENT_FORM_CODE, SUM(frp.DOCSUM) as DOCSUM, wrt.NUMBER as TICKETNUMBER, wrt.DOCDATE as TICKETDATE '+
            'FROM fin_retail_receipts frr '+
            'INNER JOIN fin_retail_payments frp ON frp.RETAIL_RECEIPT_ID=frr.ID '+
            'LEFT JOIN wrh_retail_tickets wrt ON wrt.RETAIL_RECEIPT_ID=frr.ID '+
            'GROUP BY frr.ID, frr.UNIT_ID, frr.NUMBER, frr.DOCDATE, frr.BUYER_ID, frr.CURRENCY_ID, frr.RATE, frr.DOCSTATE_ID, '+
            'frp.PAYMENT_FORM_CODE, wrt.NUMBER, wrt.DOCDATE ',
        "viewName":"fin_retail_receipts_payments" },
    { 'changeID':'fin_retail_payments__7', 'changeDatetime':'2017-06-27 12:50:00', 'changeObj':'fin_retail_receipts_payments_wt',
        'changeVal':'CREATE VIEW fin_retail_receipts_payments_wt' +
            '(RETAIL_RECEIPT_ID, UNIT_ID, NUMBER, DOCDATE, BUYER_ID, CURRENCY_ID, RATE, DOCSTATE_ID, '+
            'PAYMENT_FORM_CODE, DOCSUM, TICKETNUMBER, TICKETDATE, TICKETSUM) AS '+
            'SELECT frrp.RETAIL_RECEIPT_ID, frrp.UNIT_ID, frrp.NUMBER, frrp.DOCDATE, frrp.BUYER_ID, frrp.CURRENCY_ID, frrp.RATE, frrp.DOCSTATE_ID, '+
            'frrp.PAYMENT_FORM_CODE, frrp.DOCSUM, frrp.TICKETNUMBER, frrp.TICKETDATE, SUM(wrtp.POSSUM) as TICKETSUM '+
            'FROM fin_retail_receipts_payments frrp '+
            'LEFT JOIN wrh_retail_tickets wrt ON wrt.RETAIL_RECEIPT_ID=frrp.RETAIL_RECEIPT_ID '+
            'LEFT JOIN wrh_retail_tickets_products wrtp ON wrtp.RETAIL_TICKET_ID=wrt.ID '+
            'GROUP BY frrp.RETAIL_RECEIPT_ID, frrp.UNIT_ID, frrp.NUMBER, frrp.DOCDATE, frrp.BUYER_ID, frrp.CURRENCY_ID, frrp.RATE, frrp.DOCSTATE_ID, '+
            'frrp.PAYMENT_FORM_CODE, frrp.DOCSUM, frrp.TICKETNUMBER, frrp.TICKETDATE',
        "viewName":"fin_retail_receipts_payments_wt" }
];
module.exports.changeLog=changeLog;