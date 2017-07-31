
var startTime = new Date().getTime();

function startupParams() {
    var app_params = {};
    if (process.argv.length == 0) {
        app_params.mode = 'production';
        app_params.port = 8080;
        return app_params;
    }
    for (var i = 2; i < process.argv.length; i++) {
        if (process.argv[i].indexOf('-p:') == 0) {
            var port = process.argv[i].replace("-p:", "");
            if (port > 0 && port < 65536) {
                app_params.port = port;
            }
        } else if (process.argv[i].charAt(0).toUpperCase() > 'A' && process.argv[i].charAt(0).toUpperCase() < 'Z') {
            app_params.mode = process.argv[i];
        } else if (process.argv[i].indexOf('-log:') == 0) {
            var logParam = process.argv[i].replace("-log:", "");
            if (logParam.toLowerCase() == "console") {
                app_params.logToConsole = true;
            }
        }
    }
    if (!app_params.port)app_params.port = 8080;
    if (!app_params.mode)app_params.mode = 'production';
    return app_params;
}

var app_params = startupParams();

var log = require('winston');

if (!app_params.logToConsole) {
    log.add(log.transports.File, {filename: 'history.log', level: 'debug', timestamp: true});
    log.remove(log.transports.Console);
}

module.exports.startupMode = app_params.mode;

var fs = require('fs');
log.info('fs...', new Date().getTime() - startTime);//test
var express = require('express');
log.info('express...', new Date().getTime() - startTime);//test

//var app = require('express').createServer();
var port = app_params.port;
var path = require('path');
log.info('path...', new Date().getTime() - startTime);//test
var bodyParser = require('body-parser');
log.info('body-parser...', new Date().getTime() - startTime);//test

var app = express();
var server = require('http').Server(app);
log.info('http...', new Date().getTime() - startTime);//test
var io = require('socket.io')(server);
log.info('socket.io...', new Date().getTime() - startTime);//test

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/', express.static('public'));
var database = require('./datamodel/dataBase');
log.info('./dataBase...', new Date().getTime() - startTime);//test
var ConfigurationError, DBConnectError;

tryLoadConfiguration();
function tryLoadConfiguration() {
    log.info('tryLoadConfiguration...', new Date().getTime() - startTime);//test
    try {
        database.loadConfig();
        ConfigurationError = null;
    } catch (e) {
        ConfigurationError = "Failed to load configuration! Reason:" + e;
    }
}
if (!ConfigurationError) tryDBConnect();
function tryDBConnect(postaction) {
    log.info('tryDBConnect...', new Date().getTime() - startTime);//test
    database.databaseConnection(function (err) {
        DBConnectError = null;
        if (err) {
            DBConnectError = "Failed to connect to database! Reason:" + err;
        }
        if (postaction)postaction(err);
        log.info('tryDBConnect DBConnectError=', DBConnectError);//test
    });
}

app.get("/", function (req, res) {
    log.info('URL: /');
    res.sendFile(path.join(__dirname, '/views', 'main.html'));
});
app.get("/sysadmin", function (req, res) {
    log.info('URL: /sysadmin');
    res.sendFile(path.join(__dirname, '/views', 'sysadmin.html'));
});
app.get("/main/get_data", function (req, res) {
    log.info('URL: /main/get_data');
    var outData= {};
    outData.title= 'moda.ua';
    outData.mode= app_params.mode;
    outData.mode_str= app_params.mode;
    //outData.port=port;
    outData.user="";
    if (ConfigurationError) {
        outData.error= ConfigurationError;
        res.send(outData);
        return;
    }
    //outData.configuration= database.getDBConfig();
    if (DBConnectError) {
        outData.dbConnection= DBConnectError;
        res.send(outData);
        return;
    }
    outData.dbConnection='Connected';
    outData.menuBar = [];
    outData.menuBar.push({ itemname:"menuBarItemMainPage", itemtitle:"Главная страница", action:"open", id:"mainPage", title:"Главная страница", content:"/main/mainpage", closable:false});
    outData.menuBar.push({ itemname:"menuBarPopupMenuDirs", itemtitle:"Справочники", menuPopup:[]});
    outData.menuBar[outData.menuBar.length-1].menuPopup.push(
        { itemname:"menuBarDirsItemUnits", itemtitle:"Подразделения", action:"open", id:"mainDirUnits", title:"Подразделения", content:"/dir/units", closable:true});
    outData.menuBar[outData.menuBar.length-1].menuPopup.push({ itemname:"separator_dir1"});
    outData.menuBar[outData.menuBar.length-1].menuPopup.push(
        { itemname:"menuBarDirsItemContractors", itemtitle:"Контрагенты", action:"open", id:"mainDirContractors", title:"Контрагенты", content:"/dir/contractors", closable:true});
    outData.menuBar.push({ itemname:"menuBarItemClose", itemtitle:"Выход", action:"close"});
    outData.menuBar.push({ itemname:"menuBarItemHelpAbout", itemtitle:"О программе", action:"help_about"});

    outData.autorun = [];
    outData.autorun.push({menuitem:"menuBarItemMainPage"});
    //outData.autorun.push({menuitem:"menuBarDirsItemUnits"});
    //outData.autorun.push({menuitem:"menuBarDirsItemContractors"});
    res.send(outData);
});

var dataModel = require("./datamodel/datamodel");
dataModel.init(app);

app.get("/mainOpenPage/*", function (req, res) {
    log.info('URL: '+req.originalUrl);                          console.log("req.originalUrl=",req.originalUrl);console.log("req.path=",req.path);
    var file=req.originalUrl.replace("/mainOpenPage","");
    res.sendFile(path.join(__dirname, '/views', file+'.html'));
});


app.get("/sysadmin/app_state", function(req, res){                                     log.info("app.get /sysadmin/app_state");
    var outData= {};
    outData.mode= app_params.mode;
    outData.port=port;
    outData.connUserName=database.getDBConfig().user;
    if (ConfigurationError) {
        outData.error= ConfigurationError;
        res.send(outData);
        return;
    }
    outData.configuration= database.getDBConfig();
    if (DBConnectError)
        outData.dbConnection= DBConnectError;
    else
        outData.dbConnection='Connected';
    res.send(outData);
});

app.get("/sysadmin/startup_parameters", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters');
    res.sendFile(path.join(__dirname, '/views/sysadmin', 'startup_parameters.html'));
});

app.get("/sysadmin/startup_parameters/get_app_config", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters/get_app_config');
    if (ConfigurationError) {
        res.send({error:ConfigurationError});
        return;
    }
    res.send(database.getDBConfig());
});
app.get("/sysadmin/startup_parameters/load_app_config", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters/load_app_config');
    tryLoadConfiguration();
    if (ConfigurationError) {
        res.send({error: ConfigurationError});
        return;
    }
    res.send(database.getDBConfig());
});
app.post("/sysadmin/startup_parameters/store_app_config_and_reconnect", function (req, res) {
    log.info('URL: /sysadmin/startup_parameters/store_app_config_and_reconnect', 'newDBConfigString =', req.body);
    var newDBConfigString = req.body;
    database.setDBConfig(newDBConfigString);
    database.saveConfig(
        function (err) {
            var outData = {};
            if (err) outData.error = err;
            tryDBConnect(/*postaction*/function (err) {
                if (DBConnectError) outData.DBConnectError = DBConnectError;
                res.send(outData);
            });
        }
    );
});

app.post("/sysadmin/create_new_db", function (req, res) {
    log.info('sysadmin/create_new_db');
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
            if (err) {                  console.log("mySQLAdminConnection err=", err);
                outData.error=err.message;
                res.send(outData);
                return;
            }
        database.checkIfDBExists(newDBName, function(err, result){
            if (err) {                  console.log("checkIfDBExists err=", err);
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
                    if(err){                console.log("checkIfUserExists err=", err);
                        outData.error=err.message;
                        res.send(outData);
                        return;
                    }
                    if(result.length>0){
                    outData.userExists="User "+newUserName+" is already exists!";
                        database.grantUserAccess(host,newUserName,newDBName, function(err, ok){
                            if(err){                console.log("createNewUser err=", err);
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
        if (err) {                                                                      console.log("mySQLAdminConnection err=", err);
            outData.error = err.message;
            res.send(outData);
            return;
        }
        database.checkIfDBExists(DBName, function (err, result) {
            if (err) {                                                                  console.log("checkIfDBExists err=", err);
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
                if (err) {                                                               console.log("checkIfDBExists err=", err);
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
        if (err) {                                                                   console.log("mySQLAdminConnection err=", err);
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
        if (err) {                                                                  console.log("checkIfDBExists err=", err);
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
                if (err) {                                                      console.log("checkIfDBExists err=", err);
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
                    if (err) {                                                  console.log("checkIfDBExists err=", err);
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
        if (err) {                      console.log("checkIfDBExists err=", err);
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
                console.log("isDBEmpty recodrset 564=", recodrset);
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
    res.sendFile(path.join(__dirname, '/views/sysadmin', 'database.html'));
});


function getDBModel(){
    var outData=[];
    var logFilesStr=fs.readFileSync('./dbConfig/dbModel.json', 'utf-8');
    var logFilesArr = JSON.parse(getJSONWithoutComments(logFilesStr));
    for (var i in logFilesArr) {
        var fileContentString = fs.readFileSync('./dbConfig/' + logFilesArr[i] + '.json', 'utf-8');
        var jsonFile=JSON.parse(getJSONWithoutComments(fileContentString));
        for (var j in jsonFile) {
            jsonFile[j].type = "new";
            jsonFile[j].message = "not applied";
            outData.push(jsonFile[j]);
        }
    }
    return outData;
}
function sortArray(arr){

    function compareBychangeDatetime(a, b) {
        if (a.changeDatetime > b.changeDatetime) return 1;
        if (a.changeDatetime < b.changeDatetime) return -1;
    }

    arr.sort(compareBychangeDatetime);
    return arr;
}
app.get("/sysadmin/database/current_changes", function (req, res) {
    log.info("/sysadmin/database/current_changes", req.params, " ", JSON.stringify(req.query));

    var outData = {};
    outData.columns = [];
    outData.items = [];
    outData.columns.push(
          {"data": "changeID", "name": "changeID", "width": 185, "type": "text"}
        , {"data": "changeDatetime", "name": "changeDatetime", "width": 200, "type": "text"}
        , {"data": "changeObj", "name": "changeObj", "width": 100, "type": "text"}
        , {"data": "changeVal", "name": "changeVal", "width": 300, "type": "text"}
        , {"data": "type", "name": "type", "width": 100, "type": "text"}
        , {"data": "message", "name": "message", "width": 200, "type": "text"}
    );
    database.checkIfChangeLogExists(function(err, existsBool) {
        if (err&& (err.code=="ER_NO_SUCH_TABLE")) {     console.log("err.code=ER_NO_SUCH_TABLE");
            outData.noTable = true;
          //  outData.items=getDBModel();
            var arr=getDBModel();
           // var sortArr=sortArray(arr);
            outData.items=sortArray(arr);
            res.send(outData);
        }
        else if (err) {                                console.log("checkIfChangeLogExists err 595=", err);
            outData.error = err.message;
            res.send(outData);
        }else {                                 console.log("current_changes exists ChangeLog");
            //var logFilesArr = JSON.parse(fs.readFileSync('./dbConfig/dbModel.json', 'utf-8'));
            //matchLogFilesArray(logFilesArr, outData, 0, function (outData) {
            //    res.send(outData);
                //var  logsData= getDBModel();
            var arr=getDBModel();
            var  logsData= sortArray(arr);
            matchLogData(logsData, outData, 0, function(outData){
                res.send(outData);
            });
            //});
        }
    });
});

//function matchLogFilesArray(logFilesArr,outData,ind,callback){
//    var file = logFilesArr[ind];
//    if (!file) {
//        callback(outData);
//        return;
//    }
//    var jsonFile = JSON.parse(fs.readFileSync('./dbConfig/' + file + '.json', 'utf-8'));
//    matchLogData(jsonFile, outData, 0, function(data){
//        matchLogFilesArray(logFilesArr,data,ind+1,callback)
//    });
//}

function matchLogData(logsData, outData, ind, callback){
    var logData = logsData?logsData[ind]:null;
    if (!logData) {                console.log("!logData ");
        callback(outData);
        return;
    }
    database.checkIfChangeLogIDExists(logData.changeID, function (err, existsBool) {            console.log("checkIfChangeLogIDExists logData.changeID=",logData.changeID);
        if (err) {                                                                              console.log("checkIfChangeLogIDExists err=",err);
            outData.error = "ERROR FOR ID:"+logData.changeID+" Error msg: "+err.message;
            matchLogData(null, outData, ind+1, callback);
            return;
        }
        if (!existsBool) {
            logData.type = "new";
            logData.message = "not applied";
            outData.items.push(logData);
            matchLogData(logsData, outData, ind+1,callback);
          //  return;
        } else {
            database.matchChangeLogFields(logData,function(err, identicalBool){
                if (err) {
                    outData.error = err.message;                                         console.log("matchChangeLogFields err 646=",err);
                    matchLogData(null, outData, ind+1, callback);
                    return;
                }
                if(!identicalBool){
                    logData.type = "warning";
                    logData.message = "Current update has not identical fields!";
                    outData.items.push(logData);
                    matchLogData(logsData, outData, ind+1,callback);
                   // return;
                }else{
                    matchLogData(logsData, outData, ind+1,callback);
                  //  return;
                }
            })
        }
    });
}
///sysadmin/database/applyChange

app.post("/sysadmin/database/applyChange", function (req, res) {
    log.info('/sysadmin/database/applyChange');
    var outData={};
    outData.resultItem={};
    var ID=req.body.CHANGE_ID;

    var CHANGE_VAL;
    var dbModelData=getDBModel();
    var rowData;
    for (var i in dbModelData){
        if  (dbModelData[i].changeID==ID){
            rowData=dbModelData[i];
            CHANGE_VAL=dbModelData[i].changeVal;
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

server.listen(port, function (err) {
    if(err){
        console.log("listen port err= ", err);
        return;
    }
    console.log("server runs on port " + port);
    log.info("server runs on port " + port, new Date().getTime() - startTime);
});
function getJSONWithoutComments(text){
    var target = "/*";
    var pos = 0;
    while (true) {
        var foundPos = text.indexOf(target, pos);
        if (foundPos < 0)break;
        var comment = text.substring(foundPos, text.indexOf("*/", foundPos)+2);
        text=text.replace(comment,"");
        pos = foundPos + 1;
    }
    return text;
}

log.info("end app", new Date().getTime() - startTime);
