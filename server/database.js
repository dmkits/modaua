var fs = require('fs');
//var sql = require('mssql');
var mysqlDump = require('mysqldump');
var MysqlTools= require('mysql-tools');
var mysql      = require('mysql');
var server = require('./server');
var log =server.log;

function getDBConfig(){
    var appConfig= server.getAppConfig();
    return { host:appConfig.host, database:appConfig.database, user:appConfig.user, password:appConfig.password };
}

var connection=null, dbConnectError=null;

function databaseConnection(callback){                                                      log.info("databaseConnection dbConfig:", getDBConfig());
    if(!connection) {
        connection = mysql.createConnection(getDBConfig());
        connection.connect(function (err) {
            if (err) {                                                                      log.error("databaseConnection connect err=", err);
                callback(err.message);
                return;
            }
            callback(null, "connected");
        });
        return;
    }
        connection.destroy();
        connection = mysql.createConnection(getDBConfig());
        connection.connect(function (err) {
            if (err) {                                                                      log.error("connect error:",err);
                callback(err.message);
                return;
            }
            callback(null, "connected");
        });
};
module.exports.databaseConnection=databaseConnection;

function tryDBConnect(postaction) {                                                         log.info('tryDBConnect...');//test
    databaseConnection(function (err) {
        dbConnectError = null;
        if (err) {
            dbConnectError = "Failed to connect to database! Reason:" + err;                log.info('tryDBConnect DBConnectError=', dbConnectError);//test
        }
        if (postaction)postaction(err);
    });
}
module.exports.tryDBConnect=tryDBConnect;
if (getDBConfig()) tryDBConnect();
module.exports.getDBConnectError= function(){ return dbConnectError; };

module.exports.mySQLAdminConnection = function (connParams, callback) {                     log.info("mySQLAdminConnection");
    if (connection) {
            connection.destroy();
            connection = mysql.createConnection(connParams);
            connection.connect(function (err) {
                if (err) {              log.error(" mySQLAdminConnection createConnection err=",err);
                    callback(err);
                    return;
                }
                callback(null, "connected");
            });
        return;
    }
    connection = mysql.createConnection(connParams);
    connection.connect(function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, "connected");

    });
};

module.exports.checkIfDBExists= function(DBName,callback) {
    connection.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '"+DBName+"'",
        function (err, recordset) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,recordset);
        }
    );
};

module.exports.createNewDB= function(DBName,callback) {
    connection.query('CREATE SCHEMA '+DBName,
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, DBName+" Database created!");
        }
    );
};

module.exports.checkIfUserExists= function(newUserName,callback) {
    connection.query("select * from mysql.user where user='"+newUserName+"'",
        function (err, recordset) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,recordset);
        }
    );
};

module.exports.createNewUser= function(host,newUserName,newUserPassword,callback) {
    connection.query("CREATE USER '"+newUserName+"'@'"+host+"' IDENTIFIED BY '"+newUserPassword+"'",
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,"User "+ newUserName+" created!");
        }
    );
};

module.exports.grantUserAccess= function(host,userName,newDBName,callback) {
    var strQuery="GRANT ALL PRIVILEGES ON "+newDBName+".* TO '"+userName+"'@'"+host+"' WITH GRANT OPTION";
    connection.query(strQuery,
        function (err ) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,userName+" granted privileges!");
        }
    );
};

module.exports.dropDB= function(DBName,callback) {
    connection.query("DROP DATABASE "+ DBName,
        function (err ) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,DBName+" dropped!");
        }
    );
};


module.exports.isDBEmpty= function(DBName,callback) {

    connection.query("SELECT table_name FROM information_schema.tables where table_schema='"+DBName+"'",
        function (err,recordset ) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,recordset[0]);
        }
    );
};

module.exports.backupDB= function(backupParam,callback) {
    mysqlDump({
        host: backupParam.host,
        user: backupParam.user,
        password: backupParam.password,
        database: backupParam.database,
        dest:'./backups/'+backupParam.fileName
    },function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,"Database "+backupParam.database+" backup saved to "+backupParam.fileName);
        });
};

module.exports.restoreDB= function(restoreParams,callback) {
    var tool = new MysqlTools();
    tool.restoreDatabase({
        host: restoreParams.host
        , user: restoreParams.user
        , password: restoreParams.password
        , sqlFilePath: './backups/' + restoreParams.fileName
        , database: restoreParams.database
       // ,dropTable:true
    }, function (error, output, message) {
        if (error) {
            console.log("restoreDatabase error=",error);
            callback(error);
        } else {
            callback(null,message);
        }
    });
};


module.exports.getChangeLog= function(callback) {
    connection.query("select * from change_log;",
        function (err, recordset) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,recordset);
        }
    );
};

module.exports.checkIfChangeLogExists= function(callback) {     console.log("checkIfChangeLogExists");

    connection.query("select * from change_log where ID=null",
        function (err, recordset) {
            if (err) {                    log.error("checkIfChangeLogExists err=",err);
                callback(err);
                return;
            }
            if(recordset.length==0){
                callback(null,false);
            }else{
                callback(null,true);
            }
        }
    );
};

module.exports.checkIfChangeLogIDExists= function(id, callback) {

    connection.query("select * FROM change_log where ID = '"+id+"'",
        function (err, recordset) {
            if (err) {                                                                                  log.error("checkIfChangeLogIDExists err=",err);
                callback(err);
                return;
            }
            if(recordset.length==0){
                callback(null,false);
            }else{
                callback(null,true);
            }
        }
    );
};

module.exports.matchChangeLogFields= function(data, callback) {
var ID=data.changeID;
    var CHANGE_DATETIME=data.changeDatetime;
    var CHANGE_VAL=data.changeVal.replace(/'/g, "''");
    var CHANGE_OBJ=data.changeObj;
    connection.query("select * FROM change_log where ID = '"+ID+"' AND CHANGE_DATETIME='"+CHANGE_DATETIME+"' AND CHANGE_VAL='"+CHANGE_VAL+"' AND CHANGE_OBJ='"+CHANGE_OBJ+"'",
        function (err, recordset) {
            if (err) {
                callback(err);
                return;
            }
            if(recordset.length==0){
                callback(null,false);
            }else{
                callback(null,true);
            }
        }
    );
};

/**
 * for database query insert/update/delete
 * callback = function(err, updateCount)
 */
module.exports.executeQuery= function(query, callback) {                                            log.info("executeQuery: ",query);
    connection.query(query,
        function (err, recordset, fields) {
            if (err) {                                                                              log.error("executeQuery err=",err);
                callback(err);
                return;
            }
            callback(null, recordset.affectedRows);
        });
};
module.exports.executeParamsQuery= function(query, parameters, callback) {                          log.info("executeParamsQuery: ",query,parameters);
    connection.query(query, parameters,
        function (err, recordset, fields) {
            if (err) {                                                                              log.error("executeParamsQuery err=",err);
                callback(err);
                return;
            }
            console.log("executeParamsQuery recordset=",recordset);
            callback(null, recordset.affectedRows);
        });
};
/**
 * for database query select
 * callback = function(err, recordset, count, fields)
 */
module.exports.selectQuery= function(query, callback) {
    connection.query(query,
        function (err, recordset, fields) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, recordset, recordset.affectedRows, fields);
        });
};
/**
 * callback = function(outData)
 */
function getDataItemsFromDatabase(dbQuery, outData, resultItemName, callback){
    exports.selectQuery(dbQuery,function(err, recordset){
        if (err) {                                                                                                      log.error("selectQuery err=",err);
            outData.error= err.message;
            callback(outData);
            return;
        }
        outData[resultItemName]= recordset;
        callback(outData);
    })
};
module.exports.getDataForTable=function(dbQuery, outData, callback){
    getDataItemsFromDatabase(dbQuery, outData, "items", callback)
};
function getDataItemFromDatabase(dbQuery, outData, resultItemName, callback){
    exports.selectQuery(dbQuery,function(err, recordset){
        if (err) {                                                                                                      log.error("selectQuery err=",err);
            outData.error= err.message;
            callback(outData);
            return;
        }
        outData[resultItemName]= recordset[0];
        callback(outData);
    })
};
module.exports.getResultDataItem=function(dbQuery, outData, callback){
    getDataItemFromDatabase(dbQuery, outData, "resultItem", callback)
};

module.exports.writeToChangeLog= function(data, callback) {
    var ID=data.changeID;
    var CHANGE_DATETIME=data.changeDatetime;
    var CHANGE_OBJ=data.changeObj;
    var CHANGE_VAL=data.changeVal.replace(/'/g, "''");
    connection.query( "INSERT INTO change_log (ID, CHANGE_DATETIME, CHANGE_OBJ, CHANGE_VAL, APPLIED_DATETIME) VALUES ('"+ID+"','"+CHANGE_DATETIME+"','"+CHANGE_OBJ+"','"+CHANGE_VAL+"', NOW() );",
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,"ok");
        });
};
module.exports.matchLogData=function(logsData, outData, ind, callback){

    var logData = logsData?logsData[ind]:null;
    if (!logData) {                //log.error("!logData ");
        callback(outData);
        return;
    }
    exports.checkIfChangeLogIDExists(logData.changeID, function (err, existsBool) {                         log.info("checkIfChangeLogIDExists logData.changeID=",logData.changeID);
        if (err) {                                                                                          log.error("checkIfChangeLogIDExists err=",err);
            outData.error = "ERROR FOR ID:"+logData.changeID+" Error msg: "+err.message;
            exports.matchLogData(null, outData, ind+1, callback);
            return;
        }
        if (!existsBool) {
            logData.type = "new";
            logData.message = "not applied";
            outData.items.push(logData);
            exports.matchLogData(logsData, outData, ind+1,callback);
              return;
        }
      // else {
            exports.matchChangeLogFields(logData,function(err, identicalBool){
                if (err) {
                    outData.error = err.message;                                         log.error("matchChangeLogFields err =",err);
                    exports.matchLogData(null, outData, ind+1, callback);
                    return;
                }
                if(!identicalBool){
                    logData.type = "warning";
                    logData.message = "Current update has not identical fields!";
                    outData.items.push(logData);
                    exports.matchLogData(logsData, outData, ind+1,callback);
                    // return;
                }else{
                    exports.matchLogData(logsData, outData, ind+1,callback);
                    //  return;
                }
            });
       // }
    });
}
