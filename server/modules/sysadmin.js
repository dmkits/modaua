var path = require('path');

var fs = require('fs');
var server=require('../server');
var log = server.log;
var appParams=server.getAppStartupParams(), getServerConfig=server.getServerConfig, setAppConfig=server.setAppConfig;
var getConfig=server.getConfig;
var loadServerConfiguration=server.loadServerConfiguration;

var util=require('../util');
var database=require('../database');
var appModules=require(appModulesPath), getValidateError=appModules.getValidateError;
var dateFormat = require('dateformat');

var dataModel=require('../datamodel');
var changeLog= require(appDataModelPath+"change_log");
var sysCurrency= require(appDataModelPath+"sys_currency");
var sysDocStates= require(appDataModelPath+"sys_docstates");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels({"change_log":changeLog,
            "sys_docstates":sysDocStates,"sys_currency":sysCurrency}, errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/sysadmin";
module.exports.modulePagePath = "sysadmin.html";
var thisInstance=this;
module.exports.init = function(app){

    app.get("/sysadmin/serverState", function(req, res){
        var revalidateModules= false;
        if (req.query&&req.query["REVALIDATE"]) revalidateModules= true;
        var outData= {};
        outData.mode= appParams.mode;
        outData.port=appParams.port;
        var serverConfig=getServerConfig();
        outData.appUserName= (req.mduUser)?req.mduUser:"unknown";
        if (!serverConfig||serverConfig.error) {
            outData.error= (serverConfig&&serverConfig.error)?serverConfig.error:"unknown";
            res.send(outData);
            return;
        }
        outData.configuration= serverConfig;
        var dbConnectError= database.getDBConnectError();
        if (dbConnectError) {
            outData.dbConnection= dbConnectError;
            res.send(outData);
            return
        }
        outData.dbConnection = 'Connected';
        if (revalidateModules) {
            appModules.validateModules(function(errs, errMessage){
                if(errMessage) outData.dbValidation = errMessage; else outData.dbValidation = "success";
                res.send(outData);
            });
            return;
        }
        outData.config=getConfig();
        var validateError=getValidateError();
        if(validateError) outData.dbValidation=validateError; else outData.dbValidation = "success";        console.log("/sysadmin/serverState outData=",outData );
        res.send(outData);
    });

    app.get("/sysadmin/serverConfig", function (req, res) {
        res.sendFile(appViewsPath+'sysadmin/serverConfig.html');
    });

    app.get("/sysadmin/server/getServerConfig", function (req, res) {
        var serverConfig=getServerConfig();
        if (!serverConfig||serverConfig.error) {
            res.send({error:(serverConfig&&serverConfig.error)?serverConfig.error:"unknown"});
            return;
        }
        res.send(serverConfig);
    });
    app.get("/sysadmin/server/loadServerConfig", function (req, res) {
        loadServerConfiguration();
        var serverConfig=getServerConfig();
        if (!serverConfig||serverConfig.error) {
            res.send({error: (serverConfig&&serverConfig.error)?serverConfig.error:"unknown"});
            return;
        }
        res.send(serverConfig);
    });
    app.post("/sysadmin/serverConfig/storeServerConfigAndReconnect", function (req, res) {
        var newDBConfig = req.body;
        setAppConfig(newDBConfig);
        util.saveConfig(appParams.mode+".cfg", newDBConfig,
            function (err) {
                var outData = {};
                if (err) outData.error = err;
                database.tryDBConnect(/*postaction*/function (err) {
                    var dbConnectError= database.getDBConnectError();                                           log.info("database.tryDBConnect dbConnectError",dbConnectError);
                    if (dbConnectError) {
                        outData.DBConnectError = dbConnectError;
                        res.send(outData);
                        return;
                    }
                    appModules.validateModules(function(errs, errMessage){
                        if(errMessage) outData.dbValidation = errMessage;
                        res.send(outData);
                    });
                });
            }
        );
    });

    app.post("/sysadmin/create_new_db", function (req, res) {
        var host=req.body.host;
        var newDBName=req.body.newDatabase;
        var newUserName=req.body.newUser;
        var newUserPassword=req.body.newPassword;

        var connParams={
            host: host,
            user: req.body.adminName,
            password: req.body.adminPassword
        };
        var outData={};

        database.mySQLAdminConnection(connParams,function(err){
            if (err) {                                                                    log.error("mySQLAdminConnection err=", err);
                outData.error=err.message;
                res.send(outData);
                return;
            }
            database.checkIfDBExists(newDBName, function(err, result){
                if (err) {                                                                log.error("checkIfDBExists err=", err);
                    outData.error=err.message;
                    res.send(outData);
                    return;
                }if(result.length>0){
                    outData.error="Impossible to create DB! Database "+newDBName+" is already exists!";
                    res.send(outData);
                    return;
                }
                database.createNewDB(newDBName,function(err, ok){
                    if(err){                                                                        console.log("createNewDB err=", err);
                        outData.error=err.message;
                        res.send(outData);
                        return;
                    }
                    outData.DBCreated=ok;
                    database.checkIfUserExists(newUserName,function(err,result){
                        if(err){                                                                     log.error("checkIfUserExists err=", err);
                            outData.error=err.message;
                            res.send(outData);
                            return;
                        }
                        if(result.length>0){
                            outData.userExists="User "+newUserName+" is already exists!";
                            database.grantUserAccess(host,newUserName,newDBName, function(err, ok){
                                if(err){                                                              log.error("createNewUser err=", err);
                                    outData.error=err.message;
                                    res.send(outData);
                                    return;
                                }
                                outData.accessAdded=ok;
                                res.send(outData);
                            })
                        }else{
                            database.createNewUser(host,newUserName,newUserPassword, function(err, ok){
                                if(err){                                                            console.log("createNewUser err=", err);
                                    outData.error=err.message;
                                    res.send(outData);
                                    return;
                                }
                                outData.userCreated=ok;
                                database.grantUserAccess(host,newUserName,newDBName, function(err, ok){
                                    if(err){                                                        console.log("createNewUser err=", err);
                                        outData.error=err.message;
                                        res.send(outData);
                                        return;
                                    }
                                    outData.accessAdded=ok;
                                    res.send(outData);
                                })
                            });
                        }
                    });
                });
            });
        });
    });

    app.post("/sysadmin/drop_db", function (req, res) {
        log.info("/sysadmin/drop_db");
        var host = req.body.host;
        var DBName = req.body.database;

        var connParams = {
            host: host,
            user: req.body.adminName,
            password: req.body.adminPassword
        };
        var outData = {};

        database.mySQLAdminConnection(connParams, function (err) {
            if (err) {                                                                      log.error("mySQLAdminConnection err=", err);
                outData.error = err.message;
                res.send(outData);
                return;
            }
            database.checkIfDBExists(DBName, function (err, result) {
                if (err) {                                                                  log.error("checkIfDBExists err=", err);
                    outData.error = err.message;
                    res.send(outData);
                    return;
                }
                if (result.length == 0) {
                    outData.error = "Impossible to drop DB! Database " + DBName + " is not exists!";
                    res.send(outData);
                    return;
                }
                database.dropDB(DBName,function(err,ok){
                    if (err) {                                                               log.error("checkIfDBExists err=", err);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    outData.dropped=ok;
                    res.send(outData);
                })
            });
        });
    });

    app.post("/sysadmin/auth_as_sysadmin", function (req, res) {
        log.info("/sysadmin/auth_as_sysadmin");
        var host = req.body.host;
        var adminUser=req.body.adminName;
        var adminPassword=req.body.adminPassword;
        var connParams = {
            host: host,
            user: adminUser,
            password: adminPassword
        };
        var outData = {};
        database.mySQLAdminConnection(connParams, function (err) {
            if (err) {                                                                   log.error("mySQLAdminConnection err=", err);
                outData.error = err.message;
                res.send(outData);
                return;
            }
            outData.success="authorized";
            res.send(outData);
        });
    });

    app.post("/sysadmin/backup_db", function (req, res) {
        log.info("/sysadmin/backup_db");
        var host = req.body.host;
        var DBName = req.body.database;
        var adminUser = req.body.adminName;
        var adminPassword = req.body.adminPassword;
        var backupFileName = req.body.backupFilename + '.sql';
        var backupParam = {
            host: host,
            user: adminUser,
            password: adminPassword,
            database: DBName,
            fileName: backupFileName
        };
        var outData = {};

        database.checkIfDBExists(DBName, function (err, result) {
            if (err) {                                                                  log.error("checkIfDBExists err=", err);
                outData.error = err.message;
                res.send(outData);
                return;
            }
            if (result.length == 0) {
                outData.error = "Impossible to back up DB! Database " + DBName + " is not exists!";
                res.send(outData);
                return;
            }
            if (req.body.rewrite) {
                database.backupDB(backupParam, function (err, ok) {
                    if (err) {                                                      log.error("checkIfDBExists err=", err);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    outData.backup = ok;
                    res.send(outData);
                })
            } else {
                fs.readdir('./backups/', function (err, files) {
                    for (var i in files) {
                        if (files[i] == backupFileName) {
                            outData.fileExists = true;
                            res.send(outData);
                            return;
                        }
                    }
                    database.backupDB(backupParam, function (err, ok) {
                        if (err) {                                                      log.error("checkIfDBExists err=", err);
                            outData.error = err.message;
                            res.send(outData);
                            return;
                        }
                        outData.backup = ok;
                        res.send(outData);
                    })
                });
            }
        });
    });

    app.post("/sysadmin/restore_db", function (req, res) {
        log.info("/sysadmin/restore_db");
        var host = req.body.host;
        var DBName = req.body.database;
        var adminUser = req.body.adminName;
        var adminPassword = req.body.adminPassword;
        var restoreFileName = req.body.restoreFilename + '.sql';
        var userName = req.body.user;
        var userPassword = req.body.password;
        var restoreParams = {
            host: host,
            user: adminUser,
            password: adminPassword,
            database: DBName,
            fileName: restoreFileName
        };
        var outData = {};
        database.checkIfDBExists(DBName, function (err, result) {
            if (err) {                                                                       log.error("checkIfDBExists err=", err);
                outData.error = err.message;
                res.send(outData);
                return;
            }
            if (result.length == 0) {
                outData.error = "Impossible to restore! Database " + DBName + " is not exists!";
                res.send(outData);
                return;
            }
            var fileToRestore;
            var files = fs.readdirSync('./backups/');
            for (var i in files) {
                if (files[i] == restoreFileName) {
                    fileToRestore = files[i];
                }
            }
            if (!fileToRestore) {
                outData.error = "Impossible to restore! File " + restoreFileName + " is not found!";
                res.send(outData);
                return;
            }

            if (req.body.rewrite) {
                database.dropDB(DBName, function (err, ok) {
                    if (err) {                                                                          console.log("checkIfDBExists err=", err);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    outData.DBdropped = ok;
                    database.createNewDB(DBName, function (err, ok) {
                        if (err) {                                                                      console.log("createNewDB err=", err);
                            outData.error = err.message;
                            res.send(outData);
                            return;
                        }
                        outData.DBCreated = ok;
                        database.checkIfUserExists(userName, function (err, result) {
                            if (err) {                                                                  console.log("checkIfUserExists err=", err);
                                outData.error = err.message;
                                res.send(outData);
                                return;
                            }
                            if (result.length > 0) {
                                outData.userExists = "User " + userName + " is already exists!";
                                database.grantUserAccess(host, userName, DBName, function (err, ok) {
                                    if (err) {                                                          console.log("createNewUser err=", err);
                                        outData.error = err.message;
                                        res.send(outData);
                                        return;
                                    }
                                    outData.accessAdded = ok;
                                    database.restoreDB(restoreParams, function (err, ok) {
                                        if (err) {                                                      console.log("restoreDB err=", err);
                                            outData.error = err.message;
                                            res.send(outData);
                                            return;
                                        }
                                        outData.restore = ok;
                                        res.send(outData);
                                    })
                                })
                            } else {
                                database.createNewUser(host, userName, userPassword, function (err, ok) {
                                    if (err) {                                                          console.log("createNewUser err=", err);
                                        outData.error = err.message;
                                        res.send(outData);
                                        return;
                                    }
                                    outData.userCreated = ok;
                                    database.grantUserAccess(host, userName, DBName, function (err, ok) {
                                        if (err) {                                                      console.log("grantUserAccess err=", err);
                                            outData.error = err.message;
                                            res.send(outData);
                                            return;
                                        }
                                        outData.accessAdded = ok;
                                        database.restoreDB(restoreParams, function (err, ok) {
                                            if (err) {                                                  console.log("restoreDB err=", err);
                                                outData.error = err.message;
                                                res.send(outData);
                                                return;
                                            }
                                            outData.restore = ok;
                                            res.send(outData);
                                        })
                                    })
                                });
                            }
                        });
                    });
                })
            } else {
                database.isDBEmpty(DBName, function (err, recodrset) {                                  console.log("isDBEmpty recodrset =", recodrset);
                    if (err) {                                                                          console.log("restoreDB err=", err);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    if (!recodrset) {
                        database.restoreDB(restoreParams, function (err, ok) {
                            if (err) {                                                                  console.log("restoreDB err=", err);
                                outData.error = err.message;
                                res.send(outData);
                                return;
                            }
                            outData.restore = ok;
                            res.send(outData);
                        })
                    } else {
                        outData.dropDBConfirm = "dropDBConfirm";
                        res.send(outData);
                    }
                });
            }
        });
    });

    app.get("/sysadmin/database", function (req, res) {
        res.sendFile(appViewsPath+'sysadmin/database.html');
    });

    /**
     * resultCallback = function(result={ item, error, errorCode })
     */
    var getChangeLogItemByID= function(id, resultCallback) {
        changeLog.getDataItem({ conditions:{"ID=":id} }, resultCallback);
    };
    /**
     * result = true/false
     */
    var matchChangeLogFields= function(changeData, logData) {
        if (logData["ID"]!=changeData.changeID) return false;
        if (logData["CHANGE_DATETIME"]!= new Date(changeData.changeDatetime).toString()) return false;
        if (logData["CHANGE_VAL"]!=changeData.changeVal) return false;
        if (logData["CHANGE_OBJ"]!=changeData.changeObj) return false;
        return true;
    };
    var matchLogData=function(changesData, outData, ind, callback){
        var changeData = changesData?changesData[ind]:null;
        if (!changeData) {
            callback(outData);
            return;
        }
        getChangeLogItemByID(changeData.changeID, function (result) {                                       log.info("getChangeLogItemByID changeID="+changeData.changeID+" result=",result);
            if (result.error) {
                outData.error = "ERROR FOR ID:"+changeData.changeID+" Error msg: "+result.error;
                matchLogData(null, outData, ind+1, callback);
                return;
            }
            if (!result.item) {
                changeData.type = "new";
                changeData.message = "not applied";
                outData.items.push(changeData);
                matchLogData(changesData, outData, ind+1,callback);
                return;
            }
            if (!matchChangeLogFields(changeData,result.item)){
                changeData.type = "warning";
                changeData.message = "Current update has not identical fields in change_log!";
                outData.items.push(changeData);
                matchLogData(changesData, outData, ind+1,callback);
            } else {
                matchLogData(changesData, outData, ind+1,callback);
            }
        });
    };

    var changesTableColumns=[
        {"data": "changeID", "name": "changeID", "width": 200, "type": "text"}
        , {"data": "changeDatetime", "name": "changeDatetime", "width": 120, "type": "text", "dateFormat":"YYYY-MM-DD HH:mm:ss"}
        , {"data": "changeObj", "name": "changeObj", "width": 200, "type": "text"}
        , {"data": "changeVal", "name": "changeVal", "width": 450, "type": "text"}
        , {"data": "type", "name": "type", "width": 100, "type": "text"}
        , {"data": "message", "name": "message", "width": 200, "type": "text"}
    ];

    app.get("/sysadmin/database/getCurrentChanges", function (req, res) {
        var outData = { columns:changesTableColumns, identifier:changesTableColumns[0].data, items:[] };
        checkIfChangeLogExists(function(tableData) {
            if (tableData.error&& (tableData.errorCode=="ER_NO_SUCH_TABLE")) {                              log.info("checkIfChangeLogExists resultCallback errorCode=='ER_NO_SUCH_TABLE' tableData.error:",tableData.error);
                outData.noTable = true;
                var arr=dataModel.getModelChanges();
                var items=util.sortArray(arr);
                for(var i in items){
                    var item=items[i];
                    item.type="new";
                    item.message="not applied";
                }
                outData.items=items;
                res.send(outData);
                return;
            }
            if (tableData.error) {                                                                          log.error("checkIfChangeLogExists resultCallback tableData.error:",tableData.error);
                outData.error = tableData.error;
                res.send(outData);
                return;
            }
            var arr=dataModel.getModelChanges();
            var logsData= util.sortArray(arr);
            matchLogData(logsData, outData, 0, function(outData){
                res.send(outData);
            });
        });
    });
    /**
     * resultCallback = function(result={ item, error, errorCode })
     */
    var checkIfChangeLogExists= function(resultCallback) {
        changeLog.getDataItems({conditions:{"ID IS NULL":null}}, resultCallback);
    };

    var changeLogTableColumns=[
        {"data": "ID", "name": "changeID", "width": 200, "type": "text"}
        , {"data": "CHANGE_DATETIME", "name": "changeDatetime", "width": 120, "type": "text", "dateFormat":"YYYY-MM-DD HH:mm:ss"}
        , {"data": "CHANGE_OBJ", "name": "changeObj", "width": 200, "type": "text"}
        , {"data": "CHANGE_VAL", "name": "changeVal", "width": 450, "type": "text"}
        , {"data": "APPLIED_DATETIME", "name": "appliedDatetime", "width": 120, "type": "text", "dateFormat":"YYYY-MM-DD HH:mm:ss"}
    ];
    /**
     * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error } )
     */
    var insertToChangeLog= function(itemData, resultCallback) {
        changeLog.insTableDataItem({tableColumns:changeLogTableColumns,idFieldName:"ID", insTableData:itemData}, resultCallback);
    };
    app.post("/sysadmin/database/applyChange", function (req, res) {
        var outData={};
        var ID=req.body.CHANGE_ID;
        var CHANGE_VAL;
        var fullModelChanges=dataModel.getModelChanges();
        var rowData;
        for (var i in fullModelChanges){
            var modelChange=fullModelChanges[i];
            if  (modelChange.changeID==ID){
                rowData=modelChange;
                CHANGE_VAL=modelChange.changeVal;
                break;
            }
        }
        checkIfChangeLogExists(function(result) {
            if (result.error && (result.errorCode == "ER_NO_SUCH_TABLE")) {
                database.executeQuery(CHANGE_VAL, function (err) {
                    if (err) {
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    insertToChangeLog({"ID":modelChange.changeID,
                            "CHANGE_DATETIME":dateFormat(new Date(modelChange.changeDatetime),"yyyy-mm-dd HH:MM:ss"), ///2016-09-04T18:15:00.000
                            "CHANGE_OBJ":modelChange.changeObj,"CHANGE_VAL":modelChange.changeVal, "APPLIED_DATETIME":null},    //
                        function (result) {
                            if (result.error) {
                                outData.error = result.error;
                                res.send(outData);
                                return;
                            }
                            outData.resultItem = result.resultItem;
                            outData.updateCount = result.updateCount;
                            outData.resultItem.CHANGE_MSG='applied';
                            res.send(outData);
                        })
                });
                return;
            }
            if (result.error) {
                outData.error = result.error;
                res.send(outData);
                return;
            }
            getChangeLogItemByID(ID, function (result) {
                if (result.error) {
                    outData.error = result.error;
                    res.send(outData);
                    return;
                }
                if (result.item) {
                    outData.error = "Change log with ID is already exists";
                    res.send(outData);
                    return;
                }
                database.executeQuery(CHANGE_VAL, function (err) {                          //console.log("executeQuery err=",err.message);
                    if (err) {
                        outData.error = err.message;
                        res.send(outData);                                                  //console.log("executeQuery outData=",outData);
                        return;
                    }
                    insertToChangeLog({"ID":modelChange.changeID,
                            "CHANGE_DATETIME":dateFormat(new Date(modelChange.changeDatetime),"yyyy-mm-dd HH:MM:ss"),
                            "CHANGE_OBJ":modelChange.changeObj,"CHANGE_VAL":modelChange.changeVal, "APPLIED_DATETIME":null},
                        function (result) {
                            if (result.error) {
                                outData.error = result.error;
                                res.send(outData);
                                return;
                            }
                            outData.updateCount = result.updateCount;
                            outData.resultItem = result.resultItem;
                            outData.resultItem.CHANGE_MSG='applied';
                            res.send(outData);
                        })
                })
            })
        });
    });
    app.get("/sysadmin/database/getChangeLog", function (req, res) {
        changeLog.getDataForTable({tableColumns:changeLogTableColumns, identifier:changeLogTableColumns[0].data, conditions:req.query,
            order:"CHANGE_DATETIME, CHANGE_OBJ, ID"}, function(result){
            res.send(result);
        });
    });

    app.get("/sysadmin/appModelSettings", function (req, res) {
        res.sendFile(appViewsPath+'sysadmin/appModelSettings.html');
    });
    var sysCurrencyTableColumns=[
        {"data": "ID", "name": "ID", "width": 50, "type": "text", visible:true}
        , {"data": "CODE", "name": "CODE", "width": 120, "type": "text"}
        , {"data": "NAME", "name": "NAME", "width": 200, "type": "text"}
        , {"data": "NOTE", "name": "NOTE", "width": 450, "type": "text"}
    ];
    app.get("/sysadmin/appModelSettings/getSysCurrencyDataForTable", function(req, res){
        sysCurrency.getDataForTable({tableColumns:sysCurrencyTableColumns, identifier:sysCurrencyTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });
    var sysDocsStatesTableColumns=[
        {"data": "ID", "name": "ID", "width": 200, "type": "text", visible:false}
        , {"data": "ALIAS", "name": "ALIAS", "width": 120, "type": "text"}
        , {"data": "NAME", "name": "NAME", "width": 200, "type": "text"}
        , {"data": "NOTE", "name": "NOTE", "width": 450, "type": "text"}
    ];
    app.get("/sysadmin/appModelSettings/getSysDocumentsStatesDataForTable", function(req, res){
        sysDocStates.getDataForTable({tableColumns:sysDocsStatesTableColumns, identifier:sysCurrencyTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });
};

