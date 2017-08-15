var fs = require('fs');
//var sql = require('mssql');
var mysqlDump = require('mysqldump');
var MysqlTools= require('mysql-tools');
var mysql      = require('mysql');
var server = require('./server');
var log =server.log;

function getDBConfig(){
    var serverConfig= server.getServerConfig();
    return { host:serverConfig.host, database:serverConfig.database, user:serverConfig.user, password:serverConfig.password,
        supportBigNumbers:true };
}

var connection=null, dbConnectError=null;

function databaseConnection(callback){                                                                      log.info("database databaseConnection dbConfig:", getDBConfig());
    if(!connection) {
        connection = mysql.createConnection(getDBConfig());
        connection.connect(function (err) {
            if (err) {                                                                                      log.error("database databaseConnection connect err=", err.message);
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
        if (err) {                                                                                          log.error("database connect error:",err.message);
            callback(err.message);
            return;
        }
        callback(null, "connected");
    });
};
module.exports.databaseConnection=databaseConnection;

function tryDBConnect(postaction) {                                                                         log.info('database tryDBConnect...');//test
    databaseConnection(function (err) {
        dbConnectError = null;
        if (err) {
            dbConnectError = "Failed to connect to database! Reason:" + err;                                log.info('database tryDBConnect DBConnectError=', dbConnectError);//test
        }
        if (postaction)postaction(err);
    });
}
module.exports.tryDBConnect=tryDBConnect;
if (getDBConfig()) tryDBConnect();
module.exports.getDBConnectError= function(){ return dbConnectError; };

module.exports.mySQLAdminConnection = function (connParams, callback) {                                     log.info("database mySQLAdminConnection");
    if (connection) {
            connection.destroy();
            connection = mysql.createConnection(connParams);
            connection.connect(function (err) {
                if (err) {
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
        });
};

module.exports.createNewDB= function(DBName,callback) {
    connection.query('CREATE SCHEMA '+DBName,
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, DBName+" Database created!");
        });
};

module.exports.checkIfUserExists= function(newUserName,callback) {
    connection.query("select * from mysql.user where user='"+newUserName+"'",
        function (err, recordset) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,recordset);
        });
};

module.exports.createNewUser= function(host,newUserName,newUserPassword,callback) {
    connection.query("CREATE USER '"+newUserName+"'@'"+host+"' IDENTIFIED BY '"+newUserPassword+"'",
        function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,"User "+ newUserName+" created!");
        });
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
        });
};

module.exports.dropDB= function(DBName,callback) {
    connection.query("DROP DATABASE "+ DBName,
        function (err ) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,DBName+" dropped!");
        });
};


module.exports.isDBEmpty= function(DBName,callback) {
    connection.query("SELECT table_name FROM information_schema.tables where table_schema='"+DBName+"'",
        function (err,recordset ) {
            if (err) {
                callback(err);
                return;
            }
            callback(null,recordset[0]);
        });
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

/**
 * for database query insert/update/delete
 * callback = function(err, updateCount)
 */
module.exports.executeQuery= function(query, callback) {                                                    log.info("database executeQuery:",query);
    connection.query(query,
        function (err, recordset, fields) {
            if (err) {                                                                                      log.error("database executeQuery err=",err.message);
                callback(err);
                return;
            }
            callback(null, recordset.affectedRows);
        });
};
/**
 * for database query insert/update/delete
 * parameters = [ <value1>, <value2>, ...] - values for replace '?' in query
 * callback = function(err, updateCount)
 */
module.exports.executeParamsQuery= function(query, parameters, callback) {                                  log.info("database executeParamsQuery:",query,parameters);
    connection.query(query, parameters,
        function (err, recordset, fields) {
            if (err) {                                                                                      log.error("database executeParamsQuery err=",err.message);
                callback(err);
                return;
            }
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
 * for database query select
 * parameters = [ <value1>, <value2>, ...] - values for replace '?' in query
 * callback = function(err, recordset, count, fields)
 */
module.exports.selectParamsQuery= function(query, parameters, callback) {                                   log.info("database selectParamsQuery:",query,parameters);
    connection.query(query, parameters,
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
        if (err) {                                                                                          log.error("database getDataItemsFromDatabase selectQuery err=",err.message);
            outData.error= err.message;
            callback(outData);
            return;
        }
        outData[resultItemName]= recordset;
        callback(outData);
    })
};
module.exports.getDataItemsFromDatabase=getDataItemsFromDatabase;

/**
 * callback = function(outData)
 */
function getDataItemFromDatabase(dbQuery, outData, resultItemName, callback){
    exports.selectQuery(dbQuery,function(err, recordset){
        if (err) {                                                                                          log.error("database getDataItemFromDatabase selectQuery err=",err.message);
            outData.error= err.message;
            callback(outData);
            return;
        }
        outData[resultItemName]= recordset[0];
        callback(outData);
    })
};
module.exports.getDataItemFromDatabase=getDataItemFromDatabase;
