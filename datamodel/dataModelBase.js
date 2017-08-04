var database = require("./dataBase");
var instauuid = require('instauuid');
instauuid('decimal');
/**
 * params = { tableName, tableKeyField, dataURL, getDataForTable:true/false,
 * newDataForTable:true/false,
 * storeTableData:true/false, deleteTableData:true/false }
 */
module.exports=function(params){
    this.tableName= params.tableName; this.tableKeyField=params.tableKeyField;
    this.dataURL= params.dataURL;
    this.getDataForTable= params.getDataForTable;
    this.tableColumns= params.tableColumns;
    this.newDataForTable= params.newDataForTable;
    this.storeTableData= params.storeTableData;
    this.deleteTableData= params.deleteTableData;

    var thisInstance= this;
    this.init= function(app) {

        if (thisInstance.dataURL && thisInstance.getDataForTable && thisInstance.tableName)
            app.get(thisInstance.dataURL+"/getDataForTable", function (req, res) {                                      console.log(req.url + " params:", req.query);
                var outData = {columns: thisInstance.tableColumns, identifier: thisInstance.tableColumns[0].data};
                var getDataQuery = "select " + thisInstance.tableColumns[0].data;
                for (var i = 1; i < thisInstance.tableColumns.length; i++) getDataQuery += ", " + thisInstance.tableColumns[i].data;
                getDataQuery += " from " + thisInstance.tableName;
                if (req.query){
                    var getDataQueryWhereConditions=null, getDataQueryWhereCondition;
                    for(var queryItemName in req.query) {
                        getDataQueryWhereCondition= queryItemName+"="+req.query[queryItemName];
                        getDataQueryWhereConditions = (getDataQueryWhereConditions==null)?getDataQueryWhereCondition:" and "+getDataQueryWhereCondition;
                    }
                    if (getDataQueryWhereConditions!=null) getDataQuery+= " where "+getDataQueryWhereConditions;
                }
                database.getDataForTable(getDataQuery, outData,
                    function (outData) {                                       console.log("getDataForTable getDataQuery=",getDataQuery);console.log("getDataForTable outData=",outData);
                        if (outData&&outData.items){
                            for(var ri=0;ri<outData.items.length;ri++){
                                var dataItem=outData.items[ri];
                                if (dataItem&&thisInstance.tableKeyField&&dataItem[thisInstance.tableKeyField]!==undefined)
                                    dataItem[thisInstance.tableKeyField]=dataItem[thisInstance.tableKeyField].toString();
                            }
                        }
                        res.send(outData);
                    });
            });

        if (thisInstance.dataURL && thisInstance.newDataForTable  && thisInstance.tableName)
            app.get(thisInstance.dataURL+"/newDataForTable", function (req, res) {                                      console.log(req.url + " params:", req.query);
                var outData = { item:thisInstance.newDataForTable };
                res.send(outData);
            });

        if (thisInstance.dataURL && thisInstance.storeTableData  && thisInstance.tableName)
            app.post(thisInstance.dataURL+"/storeTableData", function (req, res) {     /*update || insert*/             console.log(req.url + " params:", req.body);
                var query = '';
                if (req.body && (req.body.ID===undefined||req.body.ID===null)) { //insert

                    var outData = {};
                    var dataToInsert=req.body;
                    var sValues, values=[];
                    var newId =instauuid('decimal'); console.log("newId=",newId);
                  //  var newIdmysql=mysql.format(instauuid('decimal');
                    query = "INSERT into "+thisInstance.tableName+"(ID" ;
                    sValues="?";
                    values.push(newId);
                    for (var fieldName in dataToInsert) {
                        query += ", "+fieldName;
                        sValues+=", ?";
                        values.push(dataToInsert[fieldName]);
                    }
                    query += ") VALUES ("+sValues+")" ;

                    database.executeParamsQuery(query,values,function(err, changedRows) {
                        if (err) {
                            outData.error= err.message;
                            res.send(outData);
                            return;
                        }
                        outData.updateCount=changedRows;
                        if(outData.updateCount==0) {
                            outData.error= "Failed to insert data! Reason:no insert count!";
                            res.send(outData);
                            return;
                        }
                        database.getResultDataItem("select * from " + thisInstance.tableName + " WHERE ID=" + newId, outData,
                            function (outData) {                 console.log("outData=",outData);
                                res.send(outData);
                            });
                    });
                    return;
                }
                //key value exists - update

                query = "UPDATE " + thisInstance.tableName;
                var updatedFields=null, updatedField;
                var values=[];
                for (var fieldName in req.body) {
                    if (fieldName==="ID") continue;
                    updatedField= fieldName+" = ?";
                    updatedFields = (updatedFields==null)?updatedField:updatedFields+", "+updatedField;
                    values.push(req.body[fieldName]);
                }
                if (updatedFields!=null) query+= " SET "+updatedFields;
                query += " WHERE ID = ?";
                values.push(req.body.ID);
                var outData = {};

                 //query = "UPDATE " + thisInstance.tableName;
                 //var updatedFields=null, updatedField;
                 //for (var fieldName in req.body) {
                 //    if (fieldName==="ID") continue;
                 //    updatedField= fieldName+"='"+req.body[fieldName]+"'";
                 //    updatedFields = (updatedFields==null)?updatedField:updatedFields+","+updatedField;
                 //}
                 //if (updatedFields!=null) query+= " SET "+updatedFields;
                 //query += " WHERE ID=" + req.body.ID;
                 // var outData = {};
                 //----
                database.executeParamsQuery(query,values,function(err, changedRows){
                    if (err) {
                        outData.error= err.message;
                        res.send(outData);
                        return;
                    }
                    outData.updateCount=changedRows;
                    if(outData.updateCount==0) {
                        outData.error= "Failed data update! Reason:no update count!";
                        res.send(outData);
                        return;
                    }
                    database.getResultDataItem("select * from " + thisInstance.tableName + " WHERE ID=" + req.body.ID, outData,
                        function (outData) {
                            res.send(outData);
                        });
                });
            });

        if (thisInstance.dataURL && thisInstance.deleteTableData  && thisInstance.tableName)
            app.post(thisInstance.dataURL+"/deleteTableData", function (req, res) {                                     console.log(req.url+" params:",req.body);
                var outData = {updateCount:0};
            });
    }
};