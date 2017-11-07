var server= require("../server"), log= server.log;
var dataModel=require('../datamodel');
var moment=require('moment');
var sys_sync_POSes= require(appDataModelPath+"sys_sync_POSes"),
    sys_sync_errors_log= require(appDataModelPath+"sys_sync_errors_log"),
    sys_sync_incoming_data= require(appDataModelPath+"sys_sync_incoming_data"),
    sys_sync_incoming_data_details= require(appDataModelPath+"sys_sync_incoming_data_details"),
    sys_sync_output_data= require(appDataModelPath+"sys_sync_output_data");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([sys_sync_POSes, sys_sync_errors_log,
            sys_sync_incoming_data,sys_sync_output_data, sys_sync_incoming_data_details], errs,
        function(){
            nextValidateModuleCallback();
        });
};

//module.exports.modulePageURL = "/syncService";

module.exports.init = function(app){
    var insertSysSyncErrorsLog= function(dataItem,resultCallback){
        dataItem["CREATE_DATE"]= new Date();
        sys_sync_errors_log.insDataItemWithNewID({idFieldName:"ID",insData:dataItem},
            function(result){
                if(result.error){                                                                           log.info("Failed to insert sys sync errors log! Reason:"+result.error.message);
                    if(resultCallback) resultCallback({error:"Failed to insert sys sync errors log! Reason:"+result.error.message});
                    return;
                }
                if(resultCallback) resultCallback();
            });
    };
    var insertClientDataItemValues=function(ind,clientDataItemValuesArray ,callback){
        if(!clientDataItemValuesArray[ind]){
            callback();
            return;
        }
        sys_sync_incoming_data_details.insDataItemWithNewID({idFieldName:"ID",insData:clientDataItemValuesArray[ind]},
            function(result){
                if(result.error){
                    callback({error:"Failed store client data values in server sync incoming data details! Reason:"+result.error.message});
                    return;
                }
                insertClientDataItemValues(ind+1,clientDataItemValuesArray, callback);
            });
    };
    var insNewClientSyncOutData= function(clientSyncDataOut, clientSyncDataOutValues, resultCallback){    console.log("clientSyncDataOutValues 45=",clientSyncDataOutValues);            console.log("clientSyncDataOut 45=",clientSyncDataOut);
        sys_sync_incoming_data.insDataItemWithNewID({idFieldName:"ID",
                insData:{"CREATE_DATE":new Date(),"SYNC_POS_ID":clientSyncDataOut["syncPOSID"], "CLIENT_SYNC_DATA_OUT_ID":clientSyncDataOut["ID"],
                    "CLIENT_CREATE_DATE":clientSyncDataOut["CRDATE"],"OPERATION_TYPE":clientSyncDataOut["OTYPE"],
                    "CLIENT_TABLE_NAME":clientSyncDataOut["TABLENAME"],
                    "CLIENT_TABLE_KEY1_NAME":clientSyncDataOut["TABLEKEY1IDNAME"],"CLIENT_TABLE_KEY1_VALUE":clientSyncDataOut["TABLEKEY1IDVAL"],
                    "STATE":"0","MSG":"client sync data out stored"}
            },
            function(result){           console.log("insNewClientSyncOutData result 53=",result);
                if(result.error){
                    if(resultCallback) resultCallback({error:"Failed insert client data in server sync incoming data! Reason:"+result.error.message});
                    return;
                }
                var storeSyncIncDataResult= result.resultItem, sysSyncIncDataID=storeSyncIncDataResult["ID"], clientDataItemValuesArray=[];
                for (var item in clientSyncDataOutValues)
                    clientDataItemValuesArray.push({"SYNC_INCOMING_DATA_ID":sysSyncIncDataID, "NAME":item,"VALUE":clientSyncDataOutValues[item]});
                insertClientDataItemValues(0,clientDataItemValuesArray,
                    function(result){
                        if(resultCallback&&result&&result.error)
                            resultCallback({error:result.error});
                        else if(resultCallback)
                            resultCallback({resultItem:{"STATE":storeSyncIncDataResult["STATE"],"MSG":storeSyncIncDataResult["MSG"]}});
                    });
            });
    };
    var updateClientSyncOutData= function(sysSyncDataIncID, clientSyncDataOut,clientSyncDataOutValues, resultCallback){
        var syncDataIncState = "0", syncDataIncMsg= "client sync data out stored";
        sys_sync_incoming_data.updDataItem({updData:{"CREATE_DATE":new Date(),
                "CLIENT_CREATE_DATE":clientSyncDataOut["CRDATE"],"OPERATION_TYPE":clientSyncDataOut["OTYPE"],
                "CLIENT_TABLE_NAME":clientSyncDataOut["TABLENAME"],
                "CLIENT_TABLE_KEY1_NAME":clientSyncDataOut["TABLEKEY1IDNAME"],"CLIENT_TABLE_KEY1_VALUE":clientSyncDataOut["TABLEKEY1IDVAL"],
                "STATE":syncDataIncState,"MSG":syncDataIncMsg},
                conditions:{"ID=":sysSyncDataIncID} },
            function(result){                                                        console.log("result 77=",result);
                if(result.error){
                    if(resultCallback) resultCallback({error:"Failed insert client data in server sync incoming data! Reason:"+result.error.message});
                    return;
                }

                var clientDataItemValuesArray=[];
                for (var item in clientSyncDataOutValues)
                    clientDataItemValuesArray.push({"SYNC_INCOMING_DATA_ID":sysSyncDataIncID, "NAME":item,"VALUE":clientSyncDataOutValues[item]});
                sys_sync_incoming_data_details.delDataItem({conditions:{"SYNC_INCOMING_DATA_ID=":sysSyncDataIncID}},
                    function(updateCount,err){
                        if(err){
                            if(resultCallback) resultCallback({error:"Failed delete from sys_sync_incoming_data_details! Reason:"+result.error.message});
                            return;
                        }
                        insertClientDataItemValues(0,clientDataItemValuesArray,
                            function(result){
                                if(resultCallback&&result&&result.error)
                                    resultCallback({error:result.error});
                                else if(resultCallback)
                                    resultCallback({resultItem:{"STATE":syncDataIncState,"MSG":syncDataIncMsg}});
                            });
                    })
            });
    };
    /**
     * params = { syncPOSID, unitID, clientDataItem, clientDataItemValues }
     */
    var storeClientSyncOutData= function(params, resultCallback){
        var clientSyncDataOut=params.clientDataItem, clientSyncDataOutValues=params.clientDataItemValues;
        clientSyncDataOut.syncPOSID=params.syncPOSID;
        sys_sync_incoming_data.getDataItem({ fields:["ID","STATE","MSG", "APPLIED_DATE"],
                conditions:{"SYNC_POS_ID=":params.syncPOSID, "CLIENT_SYNC_DATA_OUT_ID=":clientSyncDataOut["ID"]}},
            function(result){
                if(result.error){
                    if(resultCallback) resultCallback({error:"Failed find client data in server sync incoming data! Reason:"+result.error.message});
                    return;
                }
                if(!result.item){
                    insNewClientSyncOutData(clientSyncDataOut,clientSyncDataOutValues,
                        function(result){
                            resultCallback(result);
                        });
                    return;
                }
                if(result.item["STATE"]==0){
                    updateClientSyncOutData(result.item["ID"], clientSyncDataOut,clientSyncDataOutValues,
                        function(result){
                            resultCallback(result);
                        });
                    return;
                }
                if(resultCallback){
                    result.item["APPLIED_DATE"]=moment(result.item["APPLIED_DATE"]).format("YYYY-MM-DD HH:mm:ss.SSS");
                    resultCallback({resultItem:{"STATE":result.item["STATE"].toString(),"MSG":result.item["MSG"],"APPLIED_DATE":result.item["APPLIED_DATE"]}});
                }
            });
    };
    app.post("/syncService", function(req, res){
        var clientHeader=(req.headers)?req.headers["sync-service-client"]:null;
        var reqData= req.body,
            sPOSName= (reqData)?reqData["POS_Name"]:null,
            sPOSHostName= (reqData)?reqData["POS_HOST_Name"]:null,
            syncServiceClientRequestType= (reqData)?reqData["syncServiceClientRequestType"]:null;                        console.log("reqData=",reqData);
        var errorMsg;
        if(!clientHeader||clientHeader!="derbySyncClient_1.7") errorMsg="Header sync-service-client non correct!";
        else if(!req.body) errorMsg="No request data!";
        else if(!sPOSName||!sPOSHostName) errorMsg="No POS_Name and/or POS_HOST_Name!";
        else if(!syncServiceClientRequestType) errorMsg="No syncServiceClientRequestType!";
        if(errorMsg){                                                                                       log.info("Failed syncService request! Reason: "+errorMsg);
            insertSysSyncErrorsLog({"ERROR_MSG":errorMsg, "HEADER":clientHeader,
                    "CLIENT_POS_NAME":sPOSName,"CLIENT_POS_HOST_NAME":sPOSHostName,
                    "CLIENT_REQUEST_TYPE":syncServiceClientRequestType, "CLIENT_DATA":JSON.stringify(reqData)},
                function(){
                    res.send({error:errorMsg});
                });
            return;
        }
        sys_sync_POSes.getDataItem({fields:["ID","UNIT_ID"],conditions:{"NAME=":sPOSName,"HOST_NAME=":sPOSHostName}},
            function(result){
                if(result.error){                                                                           log.info("Failed syncService request! Reason: failed finded sync POS by name and host name! Reason: ",result.error);
                    var errorMsg="Failed syncClient request! Reason: failed finded sync POS by name and host name!";
                    insertSysSyncErrorsLog({"ERROR_MSG":errorMsg, "HEADER":clientHeader,
                            "CLIENT_POS_NAME":sPOSName,"CLIENT_POS_HOST_NAME":sPOSHostName,
                            "CLIENT_REQUEST_TYPE":syncServiceClientRequestType, "CLIENT_DATA":JSON.stringify(reqData)},
                        function(){
                            res.send({error:errorMsg});
                        });
                    return;
                }
                if(!result.item){                                                                           log.info("Failed syncService request! Reason: not finded sync POS by name and host name! Reason: no result!");
                    var errorMsg="Failed syncClient request! Reason: not finded sync POS by name and host name!";
                    insertSysSyncErrorsLog({"ERROR_MSG":errorMsg, "HEADER":clientHeader,
                            "CLIENT_POS_NAME":sPOSName,"CLIENT_POS_HOST_NAME":sPOSHostName,
                            "CLIENT_REQUEST_TYPE":syncServiceClientRequestType, "CLIENT_DATA":JSON.stringify(reqData)},
                        function(){
                            res.send({error:errorMsg});
                        });
                    return;
                }
                var sSyncPOSID=result.item["ID"],sUnitID=result.item["UNIT_ID"];
                if(syncServiceClientRequestType=="getSyncIncData"){
                    res.send({ error:"!!!getSyncIncData!!!" });
                    return;
                } else if(syncServiceClientRequestType=="storeSyncOutData"){
                    var clientSyncOutData=(reqData)?reqData["SyncDataOut"]:null,
                        clientSyncOutDataValues=(reqData)?reqData["SyncDataOutValues"]:null;
                    storeClientSyncOutData({ unitID:sUnitID, syncPOSID:sSyncPOSID,
                            clientDataItem:clientSyncOutData, clientDataItemValues:clientSyncOutDataValues },
                        function(result){
                            res.send(result);
                        });
                    return;
                } else if(syncServiceClientRequestType=="applySyncOutData"){
                    sys_sync_incoming_data.getDataItem({
                            fields:["ID","OPERATION_TYPE","CLIENT_TABLE_NAME","CLIENT_TABLE_KEY1_VALUE","STATE",
                                "MSG","APPLIED_DATE"],
                            conditions:{"CLIENT_SYNC_DATA_OUT_ID=":reqData.SyncDataOut["ID"]}},
                        function(syncIncDataRes){      console.log("syncIncDataRes 196=",syncIncDataRes);
                            if(syncIncDataRes.error){
                                res.send({error:syncIncDataRes.error});
                                return;
                            } else if(syncIncDataRes.item&&syncIncDataRes.item["STATE"]==1){
                                syncIncDataRes.item["APPLIED_DATE"]=moment(syncIncDataRes.item["APPLIED_DATE"]).format("YYYY-MM-DD HH:mm:ss.SSS");
                                res.send({resultItem:{"STATE":syncIncDataRes.item["STATE"].toString(), "MSG":syncIncDataRes.item["MSG"],
                                    "APPLIED_DATE":syncIncDataRes.item["APPLIED_DATE"]}});
                                return;
                            }
                            syncIncDataRes.item["UNIT_ID"]=result.item["UNIT_ID"];                              console.log("SyncIncDataRes 194=",syncIncDataRes);
                            sys_sync_incoming_data.applyDataItem(syncIncDataRes.item,
                                function(syncAppliedDataRes){             console.log("syncAppliedDataRes 203=",syncAppliedDataRes);
                                    if(syncAppliedDataRes.updStateError){
                                        res.send({error:syncAppliedDataRes.error});
                                        return;
                                    }
                                    syncAppliedDataRes.resultItem["STATE"]=syncAppliedDataRes.resultItem["STATE"].toString();
                                    syncAppliedDataRes.resultItem["APPLIED_DATE"]=moment(syncAppliedDataRes.resultItem["APPLIED_DATE"]).format("YYYY-MM-DD HH:mm:ss.SSS");
                                    res.send({resultItem:{"STATE":syncAppliedDataRes.resultItem["STATE"].toString(), "MSG":syncAppliedDataRes.resultItem["MSG"],
                                        "APPLIED_DATE":syncAppliedDataRes.resultItem["APPLIED_DATE"]}});
                                });
                    });
                } else {                                                                                    log.info("Failed syncService request body! Reason: incorrect syncServiceClientRequestType!");
                    res.send({error:"Failed syncClient request body! Reason: no incorrect request type!"});
                }
            });
    })
};