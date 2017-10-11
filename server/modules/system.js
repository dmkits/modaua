var path=require('path'), XLSX=require('xlsx'),fs=require('fs');
var dataModel=require('../datamodel'), util=require('../util');
var sys_currency= require(appDataModelPath+"sys_currency"),
    sys_docstates= require(appDataModelPath+"sys_docstates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([sys_currency,sys_docstates], errs,
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
            res.sendStatus(500);   console.log("Impossible to parse data! Reason:"+e);
            return;
        }
        var uniqueFileName = util.getUIDNumber();
        var fname = path.join(__dirname, '../../XLSX_temp/' + uniqueFileName + '.xlsx');
        try {fs.writeFileSync(fname);
        } catch (e) {                              console.log("e=",e);
            res.sendStatus(500);
            return;
        }
        try {
            var wb = XLSX.readFileSync(fname);
        }catch(e){                                    console.log("e=",e);
            res.sendStatus(500);
            return;
        }
        wb.SheetNames = [];
        wb.SheetNames.push('Sheet1');

        fillTable(wb,columns,rows);

        XLSX.writeFileAsync(fname, wb, {bookType: "xlsx", cellStyles: true}, function(err){
            if (err) {
                res.sendStatus(500);    console.log("send xlsx file err=", err);
                return;
            }
            var options = {headers: {'Content-Disposition': 'attachment; filename =out.xlsx'}};
            res.sendFile(fname, options, function (err) {
                if (err) {
                    res.sendStatus(500); console.log("send xlsx file err=", err);
                }
                fs.unlinkSync(fname);
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
            var cellType=getCellType(columns[i]);
            var columnDataID = columns[i].data;
            var displayValue = rowData[columnDataID];
            var currentCell = XLSX.utils.encode_cell({c: i, r: lineNum});
            lastCellInRaw=currentCell;
            wb.Sheets['Sheet1'][currentCell] = {
                t: cellType,
                v: displayValue
            };
            wb.Sheets['Sheet1']['!ref']='A1:'+lastCellInRaw;
        }
    }
    function getCellType(columnData){
        if(!columnData.type) return's';
        if(columnData.type=="numeric") return'n';
        else return's';
    }
};