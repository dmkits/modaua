var changeLog = [
{ 'changeID':'wrh_products_operations_01', 'changeDatetime':'2017-06-13 13:20:00', 'changeObj':'model.wrh_products_operations',
    'changeVal':'CREATE VIEW wrh_products_operations(PRODUCT_ID, UNIT_ID, DOCCODE, DOCDATE, DOCNUMBER, DOCPOSIND, DOCOPERID, DOCQTY, BATCH_NUMBER, BATCH_QTY) '+
+'AS '+
+'SELECT wpip.PRODUCT_ID, wpi.UNIT_ID, 10 as DOCCODE, wpi.DOCDATE, wpi.NUMBER, wpip.POSIND, wpip.ID, wpip.QTY, wpip.BATCH_NUMBER, wpip.QTY '+
+'FROM wrh_pinv_products wpip '+
+'INNER JOIN wrh_pinvs wpi ON wpi.ID=wpip.PINV_ID '+
+'INNER JOIN dir_products_batches dpb ON dpb.PRODUCT_ID=wpip.PRODUCT_ID AND dpb.BATCH_NUMBER=wpip.BATCH_NUMBER '+
+'UNION ALL '+
+'SELECT wip.PRODUCT_ID, wi.UNIT_ID, 80 as DOCCODE, wi.DOCDATE, wi.NUMBER, wip.POSIND, wip.ID, wip.QTY, '+
    +'CASE When wipb.BATCH_NUMBER is NULL Then SIGN(0) Else wipb.BATCH_NUMBER END, '+
    +'CASE When wipb.BATCH_NUMBER is NULL Then -wip.QTY Else -wipb.BATCH_QTY END '+
+'FROM wrh_inv_products wip '+
+'INNER JOIN wrh_invs wi ON wi.ID=wip.INV_ID '+
+'LEFT JOIN wrh_inv_products_wob wipb ON wipb.INV_PRODUCTS_ID=wip.ID '+
+'LEFT JOIN dir_products_batches dpb ON dpb.PRODUCT_ID=wip.PRODUCT_ID AND dpb.BATCH_NUMBER=wipb.BATCH_NUMBER '+
+'UNION ALL '+
+'SELECT wrip.PRODUCT_ID, wri.UNIT_ID, 20 as DOCCODE, wri.DOCDATE, wri.NUMBER, wrip.POSIND, wrip.ID, wrip.QTY, '+
    +'CASE When wripb.BATCH_NUMBER is NULL Then SIGN(0) Else wripb.BATCH_NUMBER END, '+
    +'CASE When wripb.BATCH_NUMBER is NULL Then wrip.QTY Else wripb.BATCH_QTY END '+
+'FROM wrh_ret_inv_products wrip '+
+'INNER JOIN wrh_ret_invs wri ON wri.ID=wrip.RET_INV_ID '+
+'LEFT JOIN wrh_ret_inv_products_wob wripb ON wripb.RET_INV_PRODUCTS_ID=wrip.ID '+
+'LEFT JOIN dir_products_batches dpb ON dpb.PRODUCT_ID=wrip.PRODUCT_ID AND dpb.BATCH_NUMBER=wripb.BATCH_NUMBER '+
+'UNION ALL '+
+'SELECT wrtp.PRODUCT_ID, wrt.UNIT_ID, 90 as DOCCODE, wrt.DOCDATE, wrt.NUMBER, wrtp.POS+1, wrtp.ID, wrtp.QTY, '+
    +'CASE When dpb.BATCH_NUMBER is NULL Then SIGN(0) Else wrtpw.BATCH_NUMBER END, '+
    +'CASE When dpb.BATCH_NUMBER is NULL Then -wrtp.QTY Else 0 -wrtpw.BATCH_QTY END '+
+'FROM wrh_retail_ticket_products wrtp '+
+'INNER JOIN wrh_retail_tickets wrt ON wrt.ID=wrtp.RETAIL_TICKET_ID '+
+'LEFT JOIN wrh_retail_ticket_products_wob wrtpw ON wrtpw.RETAIL_TICKET_PRODUCTS_ID=wrtp.ID '+
+'LEFT JOIN dir_products_batches dpb ON dpb.PRODUCT_ID=wrtp.PRODUCT_ID AND dpb.BATCH_NUMBER=wrtpw.BATCH_NUMBER '+
+'WHERE wrtp.QTY>=0 '+
+'UNION ALL '+
+'SELECT wrtp.PRODUCT_ID, wrt.UNIT_ID, 40 as DOCCODE, wrt.DOCDATE, wrt.NUMBER, wrtp.POS+1, wrtp.ID, wrtp.QTY, '+
    +'CASE When dpb.BATCH_NUMBER is NULL Then SIGN(0) Else wrtpw.BATCH_NUMBER END, '+
    +'CASE When dpb.BATCH_NUMBER is NULL Then -wrtp.QTY Else -wrtpw.BATCH_QTY END '+
+'FROM wrh_retail_ticket_products wrtp '+
+'INNER JOIN wrh_retail_tickets wrt ON wrt.ID=wrtp.RETAIL_TICKET_ID '+
+'LEFT JOIN wrh_retail_ticket_products_wob wrtpw ON wrtpw.RETAIL_TICKET_PRODUCTS_ID=wrtp.ID '+
+'LEFT JOIN dir_products_batches dpb ON dpb.PRODUCT_ID=wrtp.PRODUCT_ID AND dpb.BATCH_NUMBER=wrtpw.BATCH_NUMBER '+
+'WHERE wrtp.QTY<0 '},
{ 'changeID':'wrh_products_operations_02', 'changeDatetime':'2017-06-13 14:01:00', 'changeObj':'model.wrh_products_operations',
    'changeVal':'CREATE VIEW wrh_products_inc_batches(PRODUCT_ID, UNIT_ID, DOCCODE, DOCDATE, DOCNUMBER, DOCPOSIND, DOCOPERID, BATCH_NUMBER, INC_BATCH_QTY, INC_PRICE, CURRENCY_ID, INC_CURRENCY_RATE) '+
+'AS '+
+'SELECT wpip.PRODUCT_ID, wpi.UNIT_ID, 10 as DOCCODE, wpi.DOCDATE, wpi.NUMBER, wpip.POSIND, wpip.ID, wpip.BATCH_NUMBER, wpip.QTY, wpip.PRICE, '+
   +'wpi.CURRENCY_ID, wpi.RATE '+
+'FROM wrh_pinv_products wpip '+
+'INNER JOIN wrh_pinvs wpi ON wpi.ID=wpip.PINV_ID '+
+'INNER JOIN dir_products_batches dpb ON dpb.PRODUCT_ID=wpip.PRODUCT_ID AND dpb.BATCH_NUMBER=wpip.BATCH_NUMBER '}
];
module.exports.changeLog=changeLog;
