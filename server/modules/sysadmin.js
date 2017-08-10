var path = require('path');

var fs = require('fs');
var server=require('../server');
var log = server.log;
var appParams=server.getAppParams(), getAppConfig=server.getAppConfig, setAppConfig=server.setAppConfig;
var loadAppConfiguration=server.loadAppConfiguration;

var util=require('../util');
var database=require('../database');
var dataModel=require('../datamodel');
var changeLog=require(appDataModelPath+'change_log');

module.exports.dataModels = ["change_log"];

var changesTableColumns=[
    {"data": "changeID", "name": "changeID", "width": 200, "type": "text"}
    , {"data": "changeDatetime", "name": "changeDatetime", "width": 120, "type": "text", "dateFormat":"YYYY-MM-DD HH:mm:ss"}
    , {"data": "changeObj", "name": "changeObj", "width": 200, "type": "text"}
    , {"data": "changeVal", "name": "changeVal", "width": 450, "type": "text"}
    , {"data": "type", "name": "type", "width": 100, "type": "text"}
    , {"data": "message", "name": "message", "width": 200, "type": "text"}
];

module.exports.init = function(app){
    app.get("/sysadmin", function (req, res) {
        res.sendFile(appViewsPath+'sysadmin.html');
    });

    app.get("/sysadmin/app_state", function(req, res){
        var outData= {};
        outData.mode= appParams.mode;
        outData.port=appParams.port;
        var appConfig=getAppConfig();
        outData.appUserName= (req.mduUser)?req.mduUser:"unknown";
        if (!appConfig||appConfig.error) {
            outData.error= (appConfig&&appConfig.error)?appConfig.error:"unknown";
            res.send(outData);
            return;
        }
        outData.configuration= appConfig;
        var dbConnectError= database.getDBConnectError();
        if (dbConnectError)
            outData.dbConnection= dbConnectError;
        else
            outData.dbConnection='Connected';
        res.send(outData);
    });

    app.get("/sysadmin/startup_parameters", function (req, res) {
        log.info('URL: /sysadmin/startup_parameters');
        res.sendFile(appViewsPath+'sysadmin/startup_parameters.html');
    });

    app.get("/sysadmin/startup_parameters/get_app_config", function (req, res) {
        log.info('URL: /sysadmin/startup_parameters/get_app_config');
        var appConfig=getAppConfig();
        if (!appConfig||appConfig.error) {
            res.send({error:(appConfig&&appConfig.error)?appConfig.error:"unknown"});
            return;
        }
        res.send(appConfig);
    });
    app.get("/sysadmin/startup_parameters/load_app_config", function (req, res) {
        log.info('URL: /sysadmin/startup_parameters/load_app_config');
        loadAppConfiguration();
        var appConfig=getAppConfig();
        if (!appConfig||appConfig.error) {
            res.send({error: (appConfig&&appConfig.error)?appConfig.error:"unknown"});
            return;
        }
        res.send(appConfig);
    });
    app.post("/sysadmin/startup_parameters/store_app_config_and_reconnect", function (req, res) {
        log.info('URL: /sysadmin/startup_parameters/store_app_config_and_reconnect', 'newDBConfig =', req.body,{});
        var newDBConfig = req.body;
        setAppConfig(newDBConfig);
        util.saveConfig(appParams.mode+".cfg", newDBConfig,
            function (err) {
                var outData = {};
                if (err) outData.error = err;
                database.tryDBConnect(/*postaction*/function (err) {                                    log.info("database.tryDBConnect database.dbConnectError",database.dbConnectError);
                    var dbConnectError= database.getDBConnectError();
                    if (dbConnectError) outData.DBConnectError = dbConnectError;
                    res.send(outData);
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
                    if(err){                console.log("createNewDB err=", err);
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
                                if(err){                console.log("createNewUser err=", err);
                                    outData.error=err.message;
                                    res.send(outData);
                                    return;
                                }
                                outData.userCreated=ok;
                                database.grantUserAccess(host,newUserName,newDBName, function(err, ok){
                                    if(err){                console.log("createNewUser err=", err);
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
                        if (err) {                                                  clog.error("checkIfDBExists err=", err);
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
                    if (err) {
                        console.log("checkIfDBExists err=", err);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    outData.DBdropped = ok;
                    database.createNewDB(DBName, function (err, ok) {
                        if (err) {
                            console.log("createNewDB err=", err);
                            outData.error = err.message;
                            res.send(outData);
                            return;
                        }
                        outData.DBCreated = ok;
                        database.checkIfUserExists(userName, function (err, result) {
                            if (err) {
                                console.log("checkIfUserExists err=", err);
                                outData.error = err.message;
                                res.send(outData);
                                return;
                            }
                            if (result.length > 0) {
                                outData.userExists = "User " + userName + " is already exists!";
                                database.grantUserAccess(host, userName, DBName, function (err, ok) {
                                    if (err) {
                                        console.log("createNewUser err=", err);
                                        outData.error = err.message;
                                        res.send(outData);
                                        return;
                                    }
                                    outData.accessAdded = ok;
                                    database.restoreDB(restoreParams, function (err, ok) {
                                        if (err) {
                                            console.log("restoreDB err=", err);
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
                                    if (err) {
                                        console.log("createNewUser err=", err);
                                        outData.error = err.message;
                                        res.send(outData);
                                        return;
                                    }
                                    outData.userCreated = ok;
                                    database.grantUserAccess(host, userName, DBName, function (err, ok) {
                                        if (err) {
                                            console.log("grantUserAccess err=", err);
                                            outData.error = err.message;
                                            res.send(outData);
                                            return;
                                        }
                                        outData.accessAdded = ok;
                                        database.restoreDB(restoreParams, function (err, ok) {
                                            if (err) {
                                                console.log("restoreDB err=", err);
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
                database.isDBEmpty(DBName, function (err, recodrset) {
                    console.log("isDBEmpty recodrset =", recodrset);
                    if (err) {
                        console.log("restoreDB err=", err);
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    if (!recodrset) {
                        database.restoreDB(restoreParams, function (err, ok) {
                            if (err) {
                                console.log("restoreDB err=", err);
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
        log.info("URL: /sysadmin/database");
        res.sendFile(appViewsPath+'sysadmin/database.html');
    });

    app.get("/sysadmin/database/current_changes", function (req, res) {
        var outData = { columns:changesTableColumns, identifier:changesTableColumns[0].data, items:[] };
        database.checkIfChangeLogExists(function(err, existsBool) {
            if (err&& (err.code=="ER_NO_SUCH_TABLE")) {                                           log.info("err.code=ER_NO_SUCH_TABLE");
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
            } else if (err) {
                outData.error = err.message;
                res.send(outData);
                return;
            }
            var arr=dataModel.getModelChanges();
            var  logsData= util.sortArray(arr);
            database.matchLogData(logsData, outData, 0, function(outData){
                res.send(outData);
            });
        });
    });

    app.post("/sysadmin/database/applyChange", function (req, res) {
        log.info('/sysadmin/database/applyChange');
        var outData={};
        outData.resultItem={};
        var ID=req.body.CHANGE_ID;

        var CHANGE_VAL;
        var fullModelChanges=dataModel.getModelChanges();
        var rowData;
        for (var i in fullModelChanges){
            var modelChange=fullModelChanges[i];
            if  (modelChange.changeID==ID){
                rowData=modelChange;
                CHANGE_VAL=modelChange.changeVal;
            }
        }
        outData.resultItem.CHANGE_ID=ID;
        database.checkIfChangeLogExists(function(err, existsBool) {
            if (err && (err.code == "ER_NO_SUCH_TABLE")) {

                database.executeQuery(CHANGE_VAL, function (err) {
                    if (err) {
                        outData.error = err.message;
                        res.send(outData);
                        return;
                    }
                    database.writeToChangeLog(rowData, function (err) {
                        if (err) {
                            outData.error = err.message;
                            res.send(outData);
                            return;
                        }
                        outData.resultItem.CHANGE_MSG='applied';
                        res.send(outData);
                    })
                });
                return;

            } else if (err) {
                outData.error = err.message;
                res.send(outData);
                return;
            }
            database.checkIfChangeLogIDExists(ID, function (err, existsBool) {
                if (err) {
                    outData.error = err.message;
                    res.send(outData);
                    return;
                }
                if (existsBool) {
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
                    database.writeToChangeLog(rowData, function (err) {
                        if (err) {
                            outData.error = err.message;
                            res.send(outData);
                            return;
                        }
                        outData.resultItem.CHANGE_MSG='applied';
                        res.send(outData);
                    })
                })
            })
        });
    });

    app.get("/sysadmin/database/change_log", function (req, res) {
        var outData= { columns:changeLog.tableColumns, identifier:changeLog.tableColumns[0].data };
        database.checkIfChangeLogExists(function (err, exist) {
            if (err && (err.code == "ER_NO_SUCH_TABLE")) {
                outData.message = "Change Log doesn't exists";
                res.send(outData);
                return;
            } else if (err) {
                outData.error = err.message;
                res.send(outData);
                return;
            }
            database.getDataForTable(changeLog.tableDataQuery, outData,
                function(outData){
                    res.send(outData);
                });
        });
    });
};