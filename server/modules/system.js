var path=require('path'), XLSX=require('xlsx'),fs=require('fs');
var dataModel=require('../datamodel'), util=require('../util');
var server=require('../server'), log=server.log, tempExcelRepDir=server.tempExcelRepDir;
var database = require('../database');
var sys_currency= require(appDataModelPath+"sys_currency"),
    sys_docstates= require(appDataModelPath+"sys_docstates"),
    sys_operations= require(appDataModelPath+"sys_operations"),
    dir_products_bata= require(appDataModelPath+"dir_products-bata");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([sys_currency,sys_docstates,sys_operations,dir_products_bata], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.init = function(app) {
    app.get("/sys/currency/getCurrencyForSelect", function (req, res) {
        sys_currency.getDataItemsForSelect({ valueField:"CODE",labelField:"CODENAME", order: "CODE",
                fieldsFunctions:{ "CODENAME":{function:"concat",fields:["CODE","' ('","NAME","')'"] } } },
            function (result) {
                res.send(result);
            });
    });

    app.post("/sys/getExcelFile", function(req, res){
        try {
            var body = JSON.parse(req.body), columns=body.columns, rows=body.rows;
        }catch(e){
            res.sendStatus(500);                                                    log.error("Impossible to parse data! Reason:"+e);
            return;
        }
        if(!columns) {
            res.sendStatus(500);                                                    log.error("Error: No columns data to create excel file.");
            return;
        }
        if(!rows) {
            res.sendStatus(500);                                                    log.error("Error: No table data to create excel file.");
            return;
        }
        var uniqueFileName = util.getUIDNumber();
        var fname = path.join(tempExcelRepDir, uniqueFileName + '.xlsx');
        try {fs.writeFileSync(fname);
        } catch (e) {                                                               log.error("Impossible to write file! Reason:",e);
            res.sendStatus(500);
            return;
        }
        try {
            var wb = XLSX.readFileSync(fname);
        }catch(e){                                                                  log.error("Impossible to create workbook! Reason:",e);
            res.sendStatus(500);
            return;
        }
        wb.SheetNames = [];
        wb.SheetNames.push('Sheet1');

        fillTable(wb,columns,rows);

        XLSX.writeFileAsync(fname, wb, {bookType: "xlsx", /*cellStyles: true,*/ cellDates:true}, function(err){
            if (err) {
                res.sendStatus(500);                                                 log.error("send xls file err=", err);
                return;
            }
            var options = {headers: {'Content-Disposition': 'attachment; filename =out.xlsx'}};
            res.sendFile(fname, options, function (err) {
                if (err) {
                    res.sendStatus(500);                                             log.error("send xls file err=", err);
                }
                fs.unlink(fname,function(err){
                    if (err) {
                        res.sendStatus(500);                                          log.error("unlink xls file err=", err);
                    }
                });
            })
        });
    });

    function fillTable(wb,columns,rows){
        fillHeaders(wb,columns);
        var lineNum=1;
        for (var i in rows){
            fillRowData(wb,rows[i],columns,lineNum);
            lineNum++;
        }
    }
    function fillHeaders(wb,columns){
        var worksheetColumns = [];
        wb.Sheets['Sheet1'] = {
            '!cols': worksheetColumns
        };
        for (var j = 0; j < columns.length; j++) {
            worksheetColumns.push({wpx: columns[j].width});
            var currentHeader = XLSX.utils.encode_cell({c: j, r: 0});
            wb.Sheets['Sheet1'][currentHeader] = {t: "s", v: columns[j].name, s: {font: {bold: true}}};
        }
    }

    function fillRowData(wb,rowData,columns, lineNum){
        var lastCellInRaw;
        for (var i = 0; i < columns.length; i++) {
            var column=columns[i];
            var columnDataID = column.data;

            var cellType=getCellType(column);
            var displayValue =  rowData[columnDataID] || "";
            var currentCell = XLSX.utils.encode_cell({c: i, r: lineNum});

            lastCellInRaw=currentCell;
            wb.Sheets['Sheet1'][currentCell]={};
            var wbCell=wb.Sheets['Sheet1'][currentCell];
            wbCell.t=cellType;
            wbCell.v=displayValue;
            if(wbCell.t=="d"){
                wbCell.z=column.datetimeFormat || "DD.MM.YYYY";
            }
            if(wbCell.t=="n"){
                if(column.format.indexOf("0.00")>0 )wbCell.z= '#,###,##0.00';
                if(column.format.indexOf("0.[")>0 )wbCell.z= '#,###,##0';
            }
            wb.Sheets['Sheet1']['!ref']='A1:'+lastCellInRaw;
        }
    }

    function getCellType(columnData){
        if(!columnData.type) return's';
        if(columnData.type=="numeric") return'n';
        if(columnData.type=="text" && columnData.datetimeFormat) return'd';
        else return's';
    }

    dir_products_bata.deleteUnusedProducts=function(callback){
        database.executeQuery(
            "delete dpb "+
            "from dir_products_barcodes dpb "+
            "inner JOIN dir_products dp on dpb.PRODUCT_ID=dp.ID "+
            "left JOIN wrh_products_operations_v wpov on wpov.PRODUCT_ID=dp.ID "+
            "where wpov.PRODUCT_ID is null; "
            ,function(error){
                if(error){
                    callback({error:error});
                    return;
                }
                database.executeQuery(
                    "delete dpbat "+
                    "from dir_products_batches dpbat "+
                    "inner JOIN dir_products dp  on dpbat.PRODUCT_ID=dp.ID "+
                    "left JOIN wrh_products_operations_v wpov on wpov.PRODUCT_ID=dp.ID "+
                    "where wpov.PRODUCT_ID is null; "
                    ,function(error){
                        if(error){
                            callback({error:error});
                            return;
                        }
                        database.executeQuery(
                            "delete dp "+
                            "from dir_products dp "+
                            "left JOIN wrh_products_operations_v wpov on wpov.PRODUCT_ID=dp.ID "+
                            "where wpov.PRODUCT_ID is null; "
                            ,function(error, affectedRows){
                                if(error){
                                    callback({error:error});
                                    return;
                                }
                                callback({affectedRows:affectedRows});
                            })
                    })
        })
    };
    dir_products_bata.deleteUnusedArticles=function(callback){
        database.executeQuery("delete dpa "+
        "from dir_products_articles dpa "+
        "LEFT JOIN  dir_products dp on dp.ARTICLE_ID=dpa.ID "+
        "LEFT JOIN  wrh_orders_bata_details wobd on wobd.PRODUCT_ARTICLE_ID=dpa.ID "+
        "where wobd.PRODUCT_ARTICLE_ID is null AND dp.ARTICLE_ID is null; "
            ,function(error, affectedRows){
                if(error){
                    callback({error:error});
                    return;
                }
                callback({affectedRows:affectedRows});
            })
    };

    dir_products_bata.deleteUnusedKinds=function(callback){
        database.executeQuery(''
            ,function(error, affectedRows){
                if(error){
                    callback({error:error});
                    return;
                }
                callback({affectedRows:affectedRows});
            })
    };
    dir_products_bata.deleteUnusedComposition=function(callback){
        database.executeQuery(''
            ,function(error, affectedRows){
                if(error){
                    callback({error:error});
                    return;
                }
                callback({affectedRows:affectedRows});
            })
    };
    dir_products_bata.deleteUnusedSizes=function(callback){
        database.executeQuery(''
            ,function(error, affectedRows){
                if(error){
                    callback({error:error});
                    return;
                }
                callback({affectedRows:affectedRows});
            })
    }
};