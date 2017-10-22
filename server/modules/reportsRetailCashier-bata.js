var dataModel=require('../datamodel');
var fin_retail_tickets_payments_v= require(appDataModelPath+"fin_retail_tickets_payments_v"),
    fin_retail_receipts_payments_v= require(appDataModelPath+"fin_retail_receipts_payments_v"),
    dir_products=require(appDataModelPath+'dir_products-bata');

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([fin_retail_tickets_payments_v, fin_retail_receipts_payments_v], errs,
        function(){ nextValidateModuleCallback(); });
};

module.exports.modulePageURL = "/reports/retailCashier";
module.exports.modulePagePath = "reports/retailCashier-bata.html";
module.exports.init = function(app) {
    var repRetailCashReportTableColumns=[
        {data: "DOCDATE", name: "Дата чека", sourceField:"DOCDATE" },
        {data: "DOCNUMBER", name: "Номер чека", sourceField:"NUMBER" },
        {data: "POS", name: "Позиция", visible:false },
        {data: "SALE_PRICE", name: "Цена"  },
        {data: "DISCOUNT_PERCENT", name: "Скидка ", width: 65, align:"center", dataFunction:"DISCOUNT*100" },
        {data: "PRICE", name: "Цена со ск." },
        {data: "QTY", name: "Кол-во" },
        {data: "SALE_QTY", name: "Кол-во продаж", visible:false },
        {data: "RET_SALE_QTY", name: "Кол-во возвратов", visible:false },
        {data: "POSSUM", name: "Сумма" },
        {data: "SALE_POSSUM", name: "Сумма продаж", visible:false },
        {data: "RET_SALE_POSSUM", name: "Сумма возвратов", visible:false },
        {data: "SEP1", name: " ", width: 5, type: "text", useFilter:false },
        {data: "CASH_SUM", name: "Сумма нал."  },
        {data: "CARD_SUM", name: "Сумма плат.карт." },
        {data: "SALE_CASH_SUM", name: "Сумма продаж нал.", visible:false },
        {data: "SALE_CARD_SUM", name: "Сумма продаж плат.карт.", visible:false },
        {data: "RET_SALE_CASH_SUM", name: "Сумма возвратов нал", visible:false },
        {data: "RET_SALE_CARD_SUM", name: "Сумма возвратов плат.карт.", visible:false }
    ];
    repRetailCashReportTableColumns=
        dir_products.addProductColumnsTo(repRetailCashReportTableColumns,3,{linkSource:"fin_retail_tickets_payments_v",
            visibleColumns:{"PRINT_NAME":false,"PBARCODE":false}});
    app.get("/reports/retailCashier/getCashReport", function (req, res) {
        fin_retail_tickets_payments_v.getDataForDocTable({tableColumns:repRetailCashReportTableColumns,
                identifier:repRetailCashReportTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","DOCNUMBER","POS","PRODUCT_NAME","PRICE"]},
            function(result){
                res.send(result);
            });
    });
    var repRetailCashBalanceTableColumns=[
        {data: "DOCDATE", name: "Дата", type: "dateAsText", sourceField:"DOCDATE" },
        {data: "DOCNUMBER", name: "Номер", type: "numeric", sourceField:"NUMBER" },
        {data: "SUM_BEGIN_BALANCE", name: "Начальный остаток", width: 90 },
        {data: "SUM_CASH_IN", name: "Сумма вноса", sourceField:"CASH_IN" },
        {data: "SUM_CASH_OUT", name: "Сумма выноса", sourceField:"CASH_OUT" },
        {data: "CASH_IN_OUT_PURPOSE", name: "Причина вноса/выноса", width:150 },
        {data: "PURPOSE_NOTE", name: "Примечание вноса/выноса", width:150 },
        {data: "TICKET_DOCNUMBER", name: "Номер чека", width: 65, type: "numeric", sourceField:"TICKET_NUMBER" },
        {data: "SUM_CASH_SALE", name: "Сумма чека", sourceField:"CASH_SALE" },
        {data: "SUM_CASH_RET_SALE", name: "Сумма возврата", sourceField:"CASH_RET_SALE" },
        {data: "SUM_END_BALANCE", name: "Конечный остаток", width: 90 }
    ];
    app.get("/reports/retailCashier/getRetailCashBalance", function (req, res) {
        fin_retail_receipts_payments_v.getDataForDocTable({tableColumns:repRetailCashBalanceTableColumns,
                identifier:repRetailCashBalanceTableColumns[0].data,
                conditions:req.query,
                order:["DOCDATE","NUMBER","TICKET_NUMBER"]},
            function(result){
                if(result.error){ res.send(result); return; }
                var outData=result;
                if(outData.items===undefined) { res.send(outData); return; }
                fin_retail_receipts_payments_v.getDataItem({fields:["BEGIN_BALANCE"],fieldsFunctions:{"BEGIN_BALANCE":{function:"SUM(DOCSUM)"}},
                        conditions:{"DOCDATE<":req.query["DOCDATE>~"]} },
                    function(result){
                        if(result.error){ res.send(result); return; }
                        var beginBalance=result.item["BEGIN_BALANCE"]+0;
                        if(outData.items&&outData.items.length>0) outData.items[0]["SUM_BEGIN_BALANCE"]=beginBalance;
                        else outData.items.push({"SUM_BEGIN_BALANCE":beginBalance});
                        fin_retail_receipts_payments_v.getDataItem({fields:["SUM_CASH_IN","SUM_CASH_OUT","SUM_CASH_SALE","SUM_CASH_RET_SALE"],
                                fieldsFunctions:{"SUM_CASH_IN":{function:"SUM(SUM_CASH_IN)"},"SUM_CASH_OUT":{function:"SUM(SUM_CASH_OUT)"},
                                    "SUM_CASH_SALE":{function:"SUM(SUM_CASH_SALE)"},"SUM_CASH_RET_SALE":{function:"SUM(SUM_CASH_RET_SALE)"}},
                                conditions:req.query },
                            function(result){
                                if(result.error){ res.send(result); return; }
                                var endBalance=
                                    beginBalance+result.item["SUM_CASH_IN"]-result.item["SUM_CASH_OUT"]
                                        +result.item["SUM_CASH_SALE"]-result.item["SUM_CASH_RET_SALE"];
                                if(outData.items&&outData.items.length>0) outData.items[outData.items.length-1]["SUM_END_BALANCE"]=endBalance;
                                else  outData.items.push({"SUM_END_BALANCE":endBalance});
                                res.send(outData);
                            });
                    });
            });
    });
};