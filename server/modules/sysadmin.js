var path = require('path');

var fs = require('fs');
var server=require('../server');
var log = server.log;
var appParams=server.getAppStartupParams(), getServerConfig=server.getServerConfig, setAppConfig=server.setAppConfig;
var getConfig=server.getConfig;
var loadServerConfiguration=server.loadServerConfiguration;

var util=require('../util'), database=require('../database');
var appModules=require(appModulesPath), getValidateError=appModules.getValidateError;
var dateFormat = require('dateformat'), cron = require('node-cron'), moment = require('moment');

var dataModel=require('../datamodel');
var changeLog= require(appDataModelPath+"change_log");
var sys_currency= require(appDataModelPath+"sys_currency"),
    sys_docstates= require(appDataModelPath+"sys_docstates"),
    sys_sync_databases= require(appDataModelPath+"sys_sync_databases"),
    sys_sync_errors_log= require(appDataModelPath+"sys_sync_errors_log"),
    sys_sync_incoming_data=require(appDataModelPath+"sys_sync_incoming_data"),
    sys_sync_incoming_data_details=require(appDataModelPath+"sys_sync_incoming_data_details"),
    sys_sync_output_data=require(appDataModelPath+"sys_sync_output_data"),
    sys_sync_output_data_details=require(appDataModelPath+"sys_sync_output_data_details");

module.exports.validateModule = function(errs, nextValidateModuleCallback){
    dataModel.initValidateDataModels([changeLog, sys_docstates,sys_currency,
            sys_sync_databases, sys_sync_errors_log,
            sys_sync_incoming_data, sys_sync_incoming_data_details,
            sys_sync_output_data, sys_sync_output_data_details], errs,
        function(){
            nextValidateModuleCallback();
        });
};

module.exports.modulePageURL = "/sysadmin";
module.exports.modulePagePath = "sysadmin.html";
var thisInstance=this;

/**
 *logBackUp={logDate, DBName, fileName, schedule:false/true, error, info}
 * @param logBackUp
 */
function writeToBackUpLog(logBackUp) {

    var logBackupFile=path.join(__dirname+ "/../../backups/log_backup.json");
    createLogBackupFileIfNotExistss(logBackupFile);
    var srt=fs.readFileSync(logBackupFile, "utf8");
    var logData = srt ? JSON.parse(srt):[];
    var newBackup = {};
    if(logBackUp.invalidCrone){
        newBackup.logDate=moment().format("DD.MM.YYYY HH:m:ss");
        newBackup.INVALIDE_CRONE_ERROR="Invalide CRONE format";
        logData.push(newBackup);
        fs.writeFileSync(logBackupFile, JSON.stringify(logData),"utf8");
        return;
    }
    if(logBackUp.error)newBackup.ERROR=logBackUp.error;
    if(logBackUp.info)newBackup.info=logBackUp.info;
    newBackup.logDate=logBackUp.logDate;
    newBackup.DBName=logBackUp.DBName;
    newBackup.fileName=logBackUp.fileName;
    newBackup.schedule=logBackUp.schedule;
    logData.push(newBackup);
    fs.writeFileSync(logBackupFile, JSON.stringify(logData),"utf8");
}
function createLogBackupFileIfNotExistss(fileName){
    try{
        var stat=fs.existsSync(fileName);
        if(stat==false) {
            var backupDir=__dirname+'/../../backups/';
            if (!fs.existsSync(backupDir)){
                    fs.mkdirSync(backupDir);
            }
                fs.writeFileSync(fileName, "");
        }
    }catch (e){
        log.error('Failed create log DB backup file! Reason:',e);
    }
}

var scheduleBackup;
function startBackupBySchedule(){                                                                                       log.debug("startBackupBySchedule");
    var serverConfig=getServerConfig();
    if(!serverConfig.backupSchedule) return;
    var valid = cron.validate(serverConfig.backupSchedule);
    if(valid==false){                                                                                                   log.error("CRON format for startBackupBySchedule is not valid.");
        writeToBackUpLog({invalidCrone:true});
        return;
    }
    if(scheduleBackup)scheduleBackup.destroy();
    scheduleBackup =cron.schedule(getServerConfig().backupSchedule, function(){
        makeScheduleBackup(serverConfig);
    });
    scheduleBackup.start();
}
startBackupBySchedule();

function makeScheduleBackup(serverConfig) {

    var now = moment().format("YYYYMMDD_HHm");
    var backupFileName = serverConfig.database + "_" + now + "_data";
    var DBName = serverConfig.database;
    var logData={};
    logData.logDate=moment().format("DD.MM.YYYY HH:m:ss");
    logData.DBName=serverConfig.database;
    logData.fileName=backupFileName;
    logData.schedule=true;

    var backupParam = {
        host: serverConfig.host,
        user: serverConfig.user,
        password: serverConfig.password,
        database: serverConfig.database,
        fileName: backupFileName,
        onlyData: true
    };
    database.checkIfDBExists(DBName, function (err, result) {
        if (err) {                                                                                                      log.error("makeScheduleBackup err=", err);
            logData.error=err;
            writeToBackUpLog(logData);
            return;
        }
        if (result.length == 0) {                                                                                       log.error("Impossible to back up DB! Database " + DBName + " is not exists!", err);
            logData.error="Database not found!";
            writeToBackUpLog(logData);
            return;
        }
        database.backupDB(backupParam, function (err) {
            if (err) {                                                                                                  log.error("makeScheduleBackup err=", err);
                logData.error=err;
                writeToBackUpLog(logData);
                return;
            }
            writeToBackUpLog(logData);                                                                                  log.info("DB backup saved successfully to the file "+backupFileName);
        })
    });
}

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
        if(validateError) outData.dbValidation=validateError; else outData.dbValidation = "success";
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
            database.getDatabasesForUser(serverConfig.user,serverConfig.password,function(err,dbList,user){
                if(err){
                    serverConfig.dbListError=err;
                    res.send(serverConfig);
                    return;
                }
                serverConfig.dbList=dbList;
                serverConfig.dbListUser=user;
                res.send(serverConfig);
             });
    });

    app.get("/sysadmin/server/loadServerConfig", function (req, res) {
        loadServerConfiguration();
        var serverConfig=getServerConfig();                         log.info("serverConfig=",serverConfig);
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
                if (err){
                    outData.error = err;
                    res.send(outData);
                }
                database.tryDBConnect(/*postaction*/function (err) {
                    var dbConnectError= database.getDBConnectError();                                                   log.info("database.tryDBConnect dbConnectError",dbConnectError);
                    if (dbConnectError) {
                        outData.DBConnectError = dbConnectError;
                        database.getDatabasesForUser(newDBConfig.user,newDBConfig.password,function(err,dbList,user) {
                            if (err) {
                                outData.dbListError = err;
                                res.send(outData);
                                return;
                            }
                            outData.dbList = dbList;
                            outData.dbListUser=user;
                            res.send(outData);
                        });
                        return;
                    }
                    appModules.validateModules(function(errs, errMessage){
                        if(errMessage) outData.dbValidation = errMessage;
                        database.getDatabasesForUser(newDBConfig.user,newDBConfig.password,function(err,dbList,user){
                            if (err) {
                                outData.dbListError = err;
                                res.send(outData);
                                return
                            }
                            outData.dbList=dbList;
                            outData.dbListUser=user;
                            res.send(outData);
                            startBackupBySchedule();
                        });
                    });
                });
            }
        );
    });

    app.post("/sysadmin/getDBListForUser", function (req, res) {
        database.getDatabasesForUser(req.body.user, req.body.pswd,function (err, dbList, user) {
            var  outData={};
            if (err) {
                outData.dbListError = err;
                res.send(outData);
                return;
            }
            outData.dbList=dbList;
            outData.dbListUser=user;
            res.send(outData);
        });
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
            if (err) {                                                                                                  log.error("mySQLAdminConnection err=", err);
                outData.error=err.message;
                res.send(outData);
                return;
            }
            database.checkIfDBExists(newDBName, function(err, result){
                if (err) {                                                                                              log.error("checkIfDBExists err=", err);
                    outData.error=err.message;
                    res.send(outData);
                    return;
                }if(result.length>0){
                    outData.error="Impossible to create DB! Database "+newDBName+" is already exists!";
                    res.send(outData);
                    return;
                }
                database.createNewDB(newDBName,function(err, ok){
                    if(err){                                                                                            log.error("createNewDB err=", err);
                        outData.error=err.message;
                        res.send(outData);
                        return;
                    }
                    outData.DBCreated=ok;
                    database.checkIfUserExists(newUserName,function(err,result){
                        if(err){                                                                                        log.error("checkIfUserExists err=", err);
                            outData.error=err.message;
                            res.send(outData);
                            return;
                        }
                        if(result.length>0){
                            outData.userExists="User "+newUserName+" is already exists!";
                            database.grantUserAccess(host,newUserName,newDBName, function(err, ok){
                                if(err){                                                                                log.error("createNewUser err=", err);
                                    outData.error=err.message;
                                    res.send(outData);
                                    return;
                                }
                                outData.accessAdded=ok;
                                res.send(outData);
                            })
                        }else{
                            database.createNewUser(host,newUserName,newUserPassword, function(err, ok){
                                if(err){                                                                                log.error("createNewUser err=", err);
                                    outData.error=err.message;
                                    res.send(outData);
                                    return;
                                }
                                outData.userCreated=ok;
                                database.grantUserAccess(host,newUserName,newDBName, function(err, ok){
                                    if(err){                                                                            log.error("createNewUser err=", err);
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
            if (err) {                                                                                                  log.error("mySQLAdminConnection err=", err);
                outData.error = err.message;
                res.send(outData);
                return;
            }
            database.checkIfDBExists(DBName, function (err, result) {
                if (err) {                                                                                              log.error("checkIfDBExists err=", err);
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
                    if (err) {                                                                                          log.error("checkIfDBExists err=", err);
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
            if (err) {                                                                                                  log.error("mySQLAdminConnection err=", err);
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
        var onlyData=req.body.onlyDataBackup;
        var host = req.body.host;
        var DBName = req.body.database;
        var adminUser = req.body.adminName;
        var adminPassword = req.body.adminPassword;
        var backupFileName = req.body.backupFilename + '.sql';

        var logData={};
        logData.logDate=moment().format("DD.MM.YYYY HH:m:ss");
        logData.fileName=backupFileName;
        logData.schedule=false;
        logData.DBName=DBName;

        var backupParam = {
            host: host,
            user: adminUser,
            password: adminPassword,
            database: DBName,
            fileName: backupFileName,
            onlyData:onlyData
        };
        var outData = {};

        database.checkIfDBExists(DBName, function (err, result) {
            if (err) {                                                                                                  log.error("checkIfDBExists err=", err);
                outData.error = err.message;
                logData.error = err.message;
                writeToBackUpLog(logData);
                res.send(outData);
                return;
            }
            if (result.length == 0) {
                outData.error = "Impossible to back up DB! Database " + DBName + " is not exists!";
                logData.error = "Impossible to back up DB! Database " + DBName + " is not exists!";
                writeToBackUpLog(logData);
                res.send(outData);
                return;
            }
            if (req.body.rewrite) {
                database.backupDB(backupParam, function (err, ok) {
                    if (err) {                                                                                          log.error("checkIfDBExists err=", err);
                        logData.error = err.message;
                        writeToBackUpLog(logData);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    logData.info = "file update";
                    writeToBackUpLog(logData);
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
                        if (err) {                                                                                      log.error("checkIfDBExists err=", err);
                            outData.error = err.message;
                            logData.error = err.message;
                            writeToBackUpLog(logData);
                            res.send(outData);
                            return;
                        }
                        writeToBackUpLog(logData);
                        outData.backup = ok;
                        res.send(outData);
                    })
                });
            }
        });
    });

    app.post("/sysadmin/restore_db", function (req, res) {       log.info("/sysadmin/restore_db");
        var host = req.body.host;
        var DBName = req.body.database;
        var adminUser = req.body.adminName;
        var adminPassword = req.body.adminPassword;
        var restoreFileName = req.body.restoreFilename + '.sql';
        var restoreParams = {
            host: host,
            user: adminUser,
            password: adminPassword,
            database: DBName,
            fileName: restoreFileName
        };
        var connParams = {
            host: host,
            user: adminUser,
            password: adminPassword,
            database: DBName
        };
        var outData = {};
        database.mySQLAdminConnection(connParams, function () {
            database.checkIfDBExists(DBName, function (err, result) {
                if (err) {
                    log.error("checkIfDBExists err=", err);
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
                database.restoreDB(restoreParams, function (err, ok) {
                    if (err) {
                        log.error("restoreDB err=", err);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    outData.restore = ok;
                    res.send(outData);
                })
            });
        });
    });

    app.post("/sysadmin/restore_db_from_bata1_db", function (req, res) {
        log.info("/sysadmin/restore_db_from_bata1_db");
        var host = req.body.host;
        var DBName = req.body.database;
        var adminUser = req.body.adminName;
        var adminPassword = req.body.adminPassword;
        var restoreFileName = req.body.restoreFilename + '.sql';
        var restoreParams = {host: host, user: adminUser, password: adminPassword, database: DBName};
        var connParams = {host: host, user: adminUser, password: adminPassword, database: DBName};
        var outData = {};
        database.mySQLAdminConnection(connParams, function () {
            database.checkIfDBExists(DBName, function (err, result) {
                if (err) {
                    log.error("checkIfDBExists err=", err);
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
                fs.readFile(path.join(__dirname, "/../../backups/" + restoreFileName), "utf-8", function (err, result) {
                    var newBackUpStr = result.replace(/wrh_order_bata_details/g, 'wrh_orders_bata_details');
                    newBackUpStr = newBackUpStr.replace(/wrh_pinv_products/g, 'wrh_pinvs_products');
                    newBackUpStr = newBackUpStr.replace(/wrh_inv_products/g, 'wrh_invs_products');
                    newBackUpStr = newBackUpStr.replace(/wrh_inv_products_wob/g, 'wrh_invs_products_wob');
                    newBackUpStr = newBackUpStr.replace(/wrh_retail_ticket_products/g, 'wrh_retail_tickets_products');
                    newBackUpStr = newBackUpStr.replace(/wrh_retail_ticket_products_wob/g, 'wrh_retail_tickets_products_wob');
                    newBackUpStr = newBackUpStr.replace(/wrh_ret_inv_products/g, 'wrh_ret_invs_products');
                    newBackUpStr = newBackUpStr.replace(/wrh_ret_inv_products_wob/g, 'wrh_ret_invs_products_wob');
                    newBackUpStr = newBackUpStr.replace(/`sys_sync_incoming_data` VALUES /g, "`sys_sync_incoming_data`" +
                        '(ID,SYNC_DATABASE_ID,CLIENT_DATA_ID,CLIENT_CREATE_DATE,OPERATION_TYPE,CLIENT_TABLE_NAME,CLIENT_TABLE_KEY1_NAME,CLIENT_TABLE_KEY1_VALUE,' +
                        'CREATE_DATE,APPLIED_DATE,STATE,LAST_UPDATE_DATE,MSG,DEST_TABLE_CODE,DEST_TABLE_DATA_ID) VALUES');
                    newBackUpStr = newBackUpStr.replace(/`sys_sync_output_data` VALUES /g, "`sys_sync_output_data`" +
                        '(ID,SYNC_DATABASE_ID,TABLE_NAME,KEY_DATA_NAME,KEY_DATA_VALUE,CREATE_DATE,LAST_UPDATE_DATE,STATE,CLIENT_SYNC_DATA_ID,' +
                        'APPLIED_DATE,CLIENT_MESSAGE) VALUES');
                    fs.writeFile(path.join(__dirname, "/../../backups/copy_" + restoreFileName), newBackUpStr, "utf-8", function (err) {
                        if (err) {
                            log.error("restoreDB err=", err);
                            outData.error = err.message;
                            res.send(outData);
                            return;
                        }
                        restoreParams.fileName = "copy_" + restoreFileName;
                        var dataModels = dataModel.getValidatedDataModels();
                        var tablesNames = [];
                        for (var dataModelName in dataModels) {
                            var dataModelInstance=dataModels[dataModelName];
                            if(dataModelInstance.sourceType=="table") tablesNames.unshift(dataModelInstance.source);
                        }
                        deleteDataFromTAbles(tablesNames, 0, function () {
                            database.restoreDB(restoreParams, function (err, ok) {
                                if (err) {
                                    log.error("restoreDB err=", err);
                                    outData.error = err.message;
                                    res.send(outData);
                                    return;
                                }
                                outData.restore = ok;
                                res.send(outData);
                            })
                        });
                    })
                });
            });
        });
    });

    function deleteDataFromTAbles(tablesNames, index, callback){
        if(!tablesNames[index]){
            callback();
            return;
        }
            if(tablesNames[index] =="change_log"){
                deleteDataFromTAbles(tablesNames, index+1, callback);
                return;
            }
            database.executeQuery("DELETE FROM "+tablesNames[index], function(){
                deleteDataFromTAbles(tablesNames, index+1, callback)
            });
    };

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
        getChangeLogItemByID(changeData.changeID, function (result) {                                                   log.info("getChangeLogItemByID changeID="+changeData.changeID+" result=",result);
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
        , {"data": "changeDatetime", "name": "changeDatetime", "width": 120, "type":"text", "datetimeFormat":"YYYY-MM-DD HH:mm:ss"}
        , {"data": "changeObj", "name": "changeObj", "width": 200, "type": "text"}
        , {"data": "changeVal", "name": "changeVal", "width": 450, "type": "text"}
        , {"data": "type", "name": "type", "width": 100, "type": "text"}
        , {"data": "message", "name": "message", "width": 200, "type": "text"}
    ];

    app.get("/sysadmin/database/getCurrentChanges", function (req, res) {
        var outData = { columns:changesTableColumns, identifier:changesTableColumns[0].data, items:[] };
        checkIfChangeLogExists(function(tableData) {
            if (tableData.error&& (tableData.errorCode=="ER_NO_SUCH_TABLE")) {                                          log.info("checkIfChangeLogExists resultCallback errorCode=='ER_NO_SUCH_TABLE' tableData.error:",tableData.error);
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
            if (tableData.error) {                                                                                      log.error("checkIfChangeLogExists resultCallback tableData.error:",tableData.error);
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
        , {"data": "CHANGE_DATETIME", "name": "changeDatetime", "width": 120, "type": "datetimeAsText"}
        , {"data": "CHANGE_OBJ", "name": "changeObj", "width": 200, "type": "text"}
        , {"data": "CHANGE_VAL", "name": "changeVal", "width": 450, "type": "text"}
        , {"data": "APPLIED_DATETIME", "name": "appliedDatetime", "width": 120, "type": "datetimeAsText"}
    ];
    /**
     * resultCallback = function(result = { updateCount, resultItem:{<tableFieldName>:<value>,...}, error } )
     */
    var insertToChangeLog= function(itemData, resultCallback) {
        changeLog.insTableDataItem({tableColumns:changeLogTableColumns,idFieldName:"ID", insTableData:itemData}, resultCallback);
    };
    app.post("/sysadmin/database/applyChange", function (req, res) {
        var outData={};
        var ID=req.body.CHANGE_ID, appliedDatetime=req.body.appliedDatetime;
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
                            "CHANGE_DATETIME":modelChange.changeDatetime, "CHANGE_OBJ":modelChange.changeObj,
                            "CHANGE_VAL":modelChange.changeVal, "APPLIED_DATETIME":appliedDatetime},
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
                database.executeQuery(CHANGE_VAL, function (err) {
                    if (err) {
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    insertToChangeLog({"ID":modelChange.changeID,
                            "CHANGE_DATETIME":modelChange.changeDatetime, "CHANGE_OBJ":modelChange.changeObj,
                            "CHANGE_VAL":modelChange.changeVal, "APPLIED_DATETIME":appliedDatetime},
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
        changeLog.getDataForTable({tableColumns:changeLogTableColumns, identifier:changeLogTableColumns[0].data,
            conditions:req.query,
            order:"CHANGE_DATETIME, CHANGE_OBJ, ID"}, function(result){
            res.send(result);
        });
    });
    var importDataModelsTableColumns=[
        {"data": "PRIORITY", "name": "Priority", "width": 65, "type": "numeric"}
        , {"data": "DATA_TABLE_NAME", "name": "Data table name", "width": 220, "type": "text"}
        , {"data": "IMPORT_DATA_TABLE_NAME", "name": "import data table name", "width": 220, "type": "text"}
        , {"data": "CUR_ROW_COUNT", "name": " current row count", "width": 100, "type": "numeric"}
        , {"data": "IMPORT_ROW_COUNT", "name": "import row count", "width": 100, "type": "numeric"}
        , {"data": "RESULT", "name": "result", "width": 450, "type": "text"}
    ];
    app.get("/sysadmin/database/getDataModelsForImportData", function (req, res) {
        dataModel.getDataModelsForImportFormBata1DB(function(dataModelsListForImport){
            res.send({columns:importDataModelsTableColumns,identifier:importDataModelsTableColumns[0].data,
                items:dataModelsListForImport
            });
        })
    });
    app.post("/sysadmin/database/connectToBata1DB", function (req, res) {
        var adminUser=req.body.adminUser;
        var adminPassword=req.body.adminPassword;
        var connParams = {
            host: getServerConfig().host,
            user: adminUser,
            password: adminPassword
        };
        database.mySQLBata1AdminConnection(connParams, function (err) {
            if (err) {
                res.send({error:err.message});
                return;
            }
            var outData= {success:"authorized"};
            res.send(outData);
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
        sys_currency.getDataForTable({tableColumns:sysCurrencyTableColumns, identifier:sysCurrencyTableColumns[0].data,
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
        sys_docstates.getDataForTable({tableColumns:sysDocsStatesTableColumns, identifier:sysCurrencyTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });

    app.get("/sysadmin/synchronization", function (req, res) {
        res.sendFile(appViewsPath+'sysadmin/synchronization.html');
    });
    var sysSyncDatabasesTableColumns=[
        {"data": "ID", "name": "DatabaseID", "width": 90, "type": "text"}
        , {"data": "POS_NAME", "name": "POSName", "width": 200, "type": "text"}
        , {"data": "DATABASE_NAME", "name": "DatabaseName", "width": 200, "type": "text"}
        , {"data": "STOCK_NAME", "name": "UnitName", "width": 200, "type": "text"}

    ];
    app.get('/sysadmin/synchronization/getDatabasesDataForTable', function(req, res){
        sys_sync_databases.getDataForTable({tableColumns:sysSyncDatabasesTableColumns, identifier:sysSyncDatabasesTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });

    var sysSyncErrorsLogTableColumns=[
          {"data": "CREATE_DATE", "name": "Log date", "width": 70, "type": "text"}
        , {"data": "ERROR_MSG", "name": "Error msg", "width": 350, "type": "text"}
        , {"data": "HEADER", "name": "SOAP Message Header", "width": 250, "type": "text"}
        , {"data": "CLIENT_POS_NAME", "name": "Client POS Name", "width": 100, "type": "text"}
        , {"data": "CLIENT_CREATE_DATE", "name": "Client create date", "width": 70, "type": "text"}
        , {"data": "CLIENT_SYNC_DATA_ID", "name": "Client ID", "width": 70, "type": "text"}

    ];
    app.get('/sysadmin/synchronization/getErrorLogDataForTable', function(req, res){
        sys_sync_errors_log.getDataForTable({tableColumns:sysSyncErrorsLogTableColumns, identifier:sysSyncErrorsLogTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });

    var sysSyncIncomingDataTableColumns=[
          {"data": "CREATE_DATE", "name": "Create date", "width": 70, "type": "text"}
        , {"data": "SYNC_DATABASE_ID", "name": "Sync database ID", "width": 90, "type": "text"}
        , {"data": "CLIENT_DATA_ID", "name": "Client data ID", "width": 70, "type": "text"}
        , {"data": "CLIENT_CREATE_DATE", "name": "Client create date", "width": 80, "type": "text"}
        , {"data": "OPERATION_TYPE", "name": "Operation type", "width": 60, "type": "text"}
        , {"data": "CLIENT_TABLE_NAME", "name": "Client table name", "width": 160, "type": "text"}
        , {"data": "CLIENT_TABLE_KEY1_NAME", "name": "Client table key1 name", "width": 100, "type": "text"}
        , {"data": "CLIENT_TABLE_KEY1_VALUE", "name": "Client table key1 value", "width": 160, "type": "text"}
        , {"data": "LAST_UPDATE_DATE", "name": "Last update date", "width": 70, "type": "text"}
        , {"data": "STATE", "name": "State", "width": 40, "type": "text"}
        , {"data": "MSG", "name": "Message", "width": 70, "type": "text"}
        , {"data": "APPLIED_DATE", "name": "Applied date", "width": 60, "type": "text"}
        , {"data": "DEST_TABLE_CODE", "name": "Dest.t code", "width": 60, "type": "text"}
        , {"data": "DEST_TABLE_DATA_ID", "name": "Dest.t ID", "width": 130, "type": "text"}

    ];
    app.get('/sysadmin/synchronization/getIncomingDataForTable', function(req, res){
        sys_sync_incoming_data.getDataForTable({tableColumns:sysSyncIncomingDataTableColumns, identifier:sysSyncIncomingDataTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });

    var sysSyncOutputDataTableColumns=[
          {"data": "CREATE_DATE", "name": "CreateDate", "width": 75, "type": "text"}
        , {"data": "SYNC_DATABASE_ID", "name": "SyncDatabaseID", "width": 90, "type": "text"}
        , {"data": "TABLE_NAME", "name": "TableName", "width": 250, "type": "text"}
        , {"data": "KEY_DATA_NAME", "name": "KeyName", "width": 150, "type": "text"}
        , {"data": "KEY_DATA_VALUE", "name": "KeyValue", "width": 150, "type": "text"}
        , {"data": "LAST_UPDATE_DATE", "name": "LastUpdateDate", "width": 90, "type": "text"}
        , {"data": "STATE", "name": "State", "width": 60, "type": "text"}
        , {"data": "CLIENT_SYNC_DATA_ID", "name": "ClientDataID", "width": 80, "type": "text"}
        , {"data": "APPLIED_DATE", "name": "AppliedDate", "width": 80, "type": "text"}
        , {"data": "CLIENT_MESSAGE", "name": "ClientMessage", "width": 250, "type": "text"}
    ];
    app.get('/sysadmin/synchronization/getOutputDataForTable', function(req, res){
        sys_sync_output_data.getDataForTable({tableColumns:sysSyncOutputDataTableColumns, identifier:sysSyncOutputDataTableColumns[0].data,
            order:"ID", conditions:req.query}, function(result){
            res.send(result);
        });
    });

    app.get("/sysadmin/logs", function (req, res) {
        res.sendFile(appViewsPath+'sysadmin/logs.html');
    });

    var sysLogsTableColumns=[
          {"data": "level", "name": "Level", "width": 100, "type": "text"}
        , {"data": "message", "name": "Message", "width": 700, "type": "text"}
        , {"data": "timestamp", "name": "Timestamp", "width": 220, "type": "text", datetimeFormat:"DD.MM.YY HH:mm:ss"}
    ];
    app.get('/sysadmin/logs/getDataForTable', function (req, res) {
        var fileDate = req.query.DATE;
        var outData = {};
        outData.columns = sysLogsTableColumns;
        if (!fileDate) {
            res.send(outData);
            return;
        }
        outData.items = [];
        var logFile = path.join(__dirname + "/../../logs/log_file.log." + fileDate);
        try {
            fs.existsSync(logFile);
            var fileDataStr = fs.readFileSync(logFile, "utf8");
        } catch (e) {
            log.error("Impossible to read logs! Reason:", e);
            outData.error = "Impossible to read logs! Reason:" + e;
            res.send(outData);
            return;
        }
        var target = '{"level"';
        var pos = 0;
        var strObj;
        var jsonObj;
        while (true) {
            var foundPos = fileDataStr.indexOf(target, pos);
            if (foundPos < 0)break;
            strObj = fileDataStr.substring(foundPos, fileDataStr.indexOf('"}', foundPos) + 2);
            pos = foundPos + 1;
            jsonObj = JSON.parse(strObj);
            if (jsonObj.timestamp) {
                jsonObj.timestamp = moment(new Date(jsonObj.timestamp));
            }
            outData.items.push(jsonObj);
        }
        res.send(outData);
    });
};

