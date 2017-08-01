var database = require("./dataBase");
/**
 * params = { tableName, dataURL, getDataForTable:true/false,
 * newDataForTable:true/false,
 * storeTableData:true/false, deleteTableData:true/false }
 */
module.exports=function(params){
    this.tableName= params.tableName;
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
                    function (outData) {
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
                    //var tableNamesToInsertData=Object.getOwnPropertyNames(req.body);

                    //var newId=result[0].ID+1;
                    query = "INSERT into " + thisInstance.tableName + " (ID " ;
                    for (var i = 0; i < tableNamesToInsertData.length; i++) query += ", " + tableNamesToInsertData[i]; // + " = '" + req.body[thisInstance.tableColumns[i].data]+"'";
                    query += ") VALUES ("+newId+"" ;
                    for (var j = 0; j< tableNamesToInsertData.length; j++) query += ", '"  + req.body[tableNamesToInsertData[j]]+"'";
                    query +=")";
                    console.log("query=",query);

                    database.executeQuery(query,function(err, changedRows){
                        if (err) {
                            outData.error= err.message;
                            res.send(outData);
                            return;
                        }
                        outData.count=changedRows;                      console.log("changedRows=",changedRows);

                        if(outData.updateCount>0) {
                            database.getDataForTable("select * from " + thisInstance.tableName + " WHERE ID="+newId, outData, function (outData) {
                                res.send(outData);
                            });
                        }
                    });

                    database.selectQuery("SELECT ID FROM "+thisInstance.tableName+" ORDER BY id DESC LIMIT 1", function(err, result){  console.log("result=",result);
                        if(err) {
                            console.log("selectQuery err=",selectQuery);

                        }
                        console.log("result.ID=",result.ID);

                    });

                    return;
                }
                //key value exists - update
                query = "UPDATE " + thisInstance.tableName;
                var updatedFields=null, updatedField;
                for (var fieldName in req.body) {
                    if (fieldName==="ID") continue;
                    updatedField= fieldName+"='"+req.body[fieldName]+"'";
                    updatedFields = (updatedFields==null)?updatedField:updatedFields+","+updatedField;
                }
                if (updatedFields!=null) query+= " SET "+updatedFields;
                query += " WHERE ID=" + req.body.ID;
                var outData = {};
                database.executeQuery(query,function(err, changedRows){
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