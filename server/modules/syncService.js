var server= require("../server"), log= server.log;
var dataModel=require('../datamodel');
var sys_sync_POSes= require(appDataModelPath+"sys_sync_POSes"),
    sys_sync_incoming_data= require(appDataModelPath+"sys_sync_incoming_data"),
    sys_sync_output_data= require(appDataModelPath+"sys_sync_output_data");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([sys_sync_POSes,sys_sync_incoming_data,sys_sync_output_data], errs,
        function(){
            nextValidateModuleCallback();
        });
};

//module.exports.modulePageURL = "/syncService";

module.exports.init = function(app){
    app.post("/syncService", function(req, res){
        if(req.headers&&
            (!req.headers["sync-service-client"]||req.headers["sync-service-client"]!="derbySyncClient_1.7")){
            res.send({error:"Failed check syncClient request header!"});                                    log.info("Failed syncService request! Reason: header sync-service-client non correct!");
            return;
        }
        if(!req.body){
            res.send({error:"Failed syncClient request body!"});                                            log.info("Failed syncService request body! Reason: no body!");
            return;
        }
        var syncServiceClientRequestType=req.body["syncServiceClientRequestType"];
        if(!syncServiceClientRequestType){
            res.send({error:"Failed syncClient request body! Reason: no syncServiceClientRequestType!"});   log.info("Failed syncService request body! Reason: no syncServiceClientRequestType!");
            return;
        }
        var sPOSName=req.body["POSName"];
        if(!sPOSName){
            res.send({error:"Failed syncClient request body! Reason: no POS name!"});                       log.info("Failed syncService request body! Reason: no POSName!");
            return;
        }
        /**
         * params = { syncPOSID, unitID, clientDataItem, clientDataItemValues }
         */
        var storeClientSyncOutData= function(params, resultCallback){
            //params.clientDataItem
            //params.clientDataItemValues
            sys_sync_incoming_data.getDataItem({
                    conditions:{"SYNC_POS_ID=":params.syncPOSID, "CLIENT_SYNC_DATA_ID=":params.clientDataItem["ID"]}},
                function(result){
                    if(result.error){
                        if(resultCallback) resultCallback({error:"Failed find client data in server sync incoming data! Reason:"+result.error.message});
                        return;
                    }
                    if(resultCallback) resultCallback();
                });
        };
        sys_sync_POSes.getDataItem({fields:["ID","UNIT_ID"],conditions:{"NAME=":sPOSName}},
            function(result){
                if(result.error){
                    res.send({error:"Failed syncClient request! Reason: failed finded sync POS name!"});    log.info("Failed syncService request! Reason: failed finded sync POS name! Reason: ",result.error);
                }
                if(!result.item){
                    res.send({error:"Failed syncClient request! Reason: failed finded sync POS name!"});    log.info("Failed syncService request! Reason: failed finded sync POS name! Reason: no result!");
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
                } else  if(syncServiceClientRequestType=="applySyncOutData"){
                    res.send({error:"!"});
                    return;
                } else {
                    res.send({error:"Failed syncClient request body! Reason: no incorrect request type!"}); log.info("Failed syncService request body! Reason: incorrect syncServiceClientRequestType!");
                }
            });
    })
};