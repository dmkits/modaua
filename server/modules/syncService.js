var server= require("../server"), log= server.log;
var dataModel=require('../datamodel');
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
    /**
     * params = { syncPOSID, unitID, clientDataItem, clientDataItemValues }
     */
    var storeClientSyncOutData= function(params, resultCallback){
        var clientSyncDataOut=params.clientDataItem, clientDataItemValues=params.clientDataItemValues;
        sys_sync_incoming_data.getDataItem({ fields:["ID","STATE","MSG"],  //fields:["ID"], !!!
                conditions:{"SYNC_POS_ID=":params.syncPOSID, "CLIENT_SYNC_DATA_OUT_ID=":clientSyncDataOut["ID"]}},
            function(result){
                if(result.error){
                    if(resultCallback) resultCallback({error:"Failed find client data in server sync incoming data! Reason:"+result.error.message});
                    return;
                }
                if(result.item){
                    var sysSyncDataInID=result.item["ID"];

                    //update
                    result.resultItem=result.item;

                    if(resultCallback) resultCallback({resultItem:{"STATE":result.resultItem["STATE"].toString(),"MSG":result.resultItem["MSG"]}});
                    return;
                }
                sys_sync_incoming_data.insDataItemWithNewID({idFieldName:"ID",
                        insData:{"CREATE_DATE":new Date(),"SYNC_POS_ID":params.syncPOSID, "CLIENT_SYNC_DATA_OUT_ID":clientSyncDataOut["ID"],
                            "CLIENT_CREATE_DATE":clientSyncDataOut["CRDATE"],"OPERATION_TYPE":clientSyncDataOut["OTYPE"],
                            "CLIENT_TABLE_NAME":clientSyncDataOut["TABLENAME"],
                            "CLIENT_TABLE_KEY1_NAME":clientSyncDataOut["TABLEKEY1IDNAME"],"CLIENT_TABLE_KEY1_VALUE":clientSyncDataOut["TABLEKEY1IDVAL"],
                            "STATE":"0","MSG":"client sync data out stored"}
                    },
                    function(result){
                        if(result.error){
                            if(resultCallback) resultCallback({error:"Failed insert client data in server sync incoming data! Reason:"+result.error.message});
                            return;
                        }
                        var storeSyncIncDataResult= result.resultItem, sysSyncIncDataID=storeSyncIncDataResult["ID"], clientDataItemValuesArray=[];
                        for (var item in clientDataItemValues)
                            clientDataItemValuesArray.push({"SYNC_INCOMING_DATA_ID":sysSyncIncDataID, "NAME":item,"VALUE":clientDataItemValues[item]});
                                                                                                                                console.log("clientDataItemValuesArray=",clientDataItemValuesArray);
                        insertClientDataItemValues(0,clientDataItemValuesArray,
                            function(result){
                                if(resultCallback&&result&&result.error)
                                    resultCallback({error:result.error});
                                else if(resultCallback)
                                    resultCallback({resultItem:{"STATE":storeSyncIncDataResult["STATE"],"MSG":storeSyncIncDataResult["MSG"]}});
                            });
                    });
            });
    };
    var insertSysSyncErrorsLog= function(dataItem,resultCallback){
        sys_sync_errors_log.insDataItemWithNewID({idFieldName:"ID",insData:dataItem},
            function(result){
                if(result.error){                                                                           log.info("Failed to insert sys sync errors log! Reason:"+result.error.message);
                    if(resultCallback) resultCallback({error:"Failed to insert sys sync errors log! Reason:"+result.error.message});
                    return;
                }
                if(resultCallback) resultCallback();
            });
    };
    app.post("/syncService", function(req, res){
        if(req.headers&&
            (!req.headers["sync-service-client"]
                ||req.headers["sync-service-client"]!="derbySyncClient_1.7")){                              log.info("Failed syncService request! Reason: header sync-service-client non correct!");
            res.send({error:"Failed check syncClient request header!"});
            return;
        }
        if(!req.body){                                                                                      log.info("Failed syncService request body! Reason: no body!");
            res.send({error:"Failed syncClient request body!"});
            return;
        }
        var syncServiceClientRequestType=req.body["syncServiceClientRequestType"];
        if(!syncServiceClientRequestType){                                                                  log.info("Failed syncService request body! Reason: no syncServiceClientRequestType!");
            res.send({error:"Failed syncClient request body! Reason: no syncServiceClientRequestType!"});
            return;
        }
        var sPOSName=req.body["POS_Name"],sPOSHostName=req.body["POS_HOST_Name"];
        if(!sPOSName||!sPOSHostName){                                                                       log.info("Failed syncService request body! Reason: no POS_Name POS_HOST_Name!");
            insertSysSyncErrorsLog({},
                function(){
                    res.send({error:"Failed syncClient request body! Reason: no POS name POS HOST Name!"});
                });
            return;
        }

        sys_sync_POSes.getDataItem({fields:["ID","UNIT_ID"],conditions:{"NAME=":sPOSName,"HOST_NAME=":sPOSHostName}},
            function(result){
                if(result.error){                                                                           log.info("Failed syncService request! Reason: failed finded sync POS by name and host name! Reason: ",result.error);
                    res.send({error:"Failed syncClient request! Reason: failed finded sync POS by name and host name!"});
                    return;
                }
                if(!result.item){                                                                           log.info("Failed syncService request! Reason: not finded sync POS by name and host name! Reason: no result!");
                    res.send({error:"Failed syncClient request! Reason: not finded sync POS by name and host name!"});
                    return;
                }
                var sSyncPOSID=result.item["ID"],sUnitID=result.item["UNIT_ID"];
                if(syncServiceClientRequestType=="getSyncIncData"){
                    res.send({ resultItem:null });
                    return;
                } else if(syncServiceClientRequestType=="storeSyncOutData"){
                    storeClientSyncOutData({ unitID:sUnitID, syncPOSID:sSyncPOSID,
                            clientDataItem:req.body.dataItem, clientDataItemValues:req.body.dataItemValues },
                        function(result){
                            res.send(result);                                              //console.log("syncService sendOutData",req.body,{});
                        });
                    return;
                } else if(syncServiceClientRequestType=="applySyncOutData"){
                    res.send({error:"!"});
                    return;
                } else {                                                                                    log.info("Failed syncService request body! Reason: incorrect syncServiceClientRequestType!");
                    res.send({error:"Failed syncClient request body! Reason: no incorrect request type!"});
                }
            });
    })
};