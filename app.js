
var util=require('./util');
var dateformat =require('dateformat');

var app_params = util.getStartupParams();
module.exports.appParams = app_params;

var log = require('winston');
if (!app_params.logToConsole) {
    log.add(log.transports.File, {filename: 'history.log', level: 'debug', timestamp: function() {
        return dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss");
    }});
    log.remove(log.transports.Console);
} else {
    log.configure({
        transports: [
            new (log.transports.Console)({ timestamp: function() {
                return dateformat(Date.now(), "yyyy-mm-dd HH:MM:ss");
            } })
        ]
    });
}
module.exports.log=log;

var fs = require('fs');                                                     log.info('fs...', new Date().getTime() );//test
var path = require('path');                                                 log.info('path...', new Date().getTime() );//test
var express = require('express');                                           log.info('express...', new Date().getTime() );//test
var app = express();
var bodyParser = require('body-parser');                                    log.info('body-parser...', new Date().getTime() );//test

var appConfig=null;
function loadAppConfiguration(){
    try {                                                                   log.info('load app configuration...');//test
        appConfig= util.loadConfig(app_params.mode + '.cfg');
    } catch (e) {
        appConfig= {"error":"Failed to load configuration! Reason:" + e};
    }                                                                       log.info('app mode:'+app_params.mode,' app configuration:', appConfig);//test
};
module.exports.loadAppConfiguration= loadAppConfiguration;
loadAppConfiguration();
module.exports.getAppConfig= function(){ return appConfig };
module.exports.setAppConfig= function(newAppConfig){ appConfig=newAppConfig; };

var database = require('./datamodel/database');                             log.info('./dataBase...');//test

var configFileName=appConfig.configName || 'config.json';
var config=JSON.parse(util.getJSONWithoutComments(fs.readFileSync('./'+configFileName,'utf-8')));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/', express.static('public'));

require("./appObjects/sysadmin")(app);

app.get("/", function (req, res) {                                          log.info('URL: /');
    res.sendFile(path.join(__dirname, '/views', 'main.html'));
});

app.get("/main/get_data", function (req, res) {                             log.info('URL: /main/get_data');
    var outData= {};
    outData.title=config.title;
    outData.menuBar=config.userMenu;
    outData.autorun=config.userAutorun;
    outData.mode= app_params.mode;
    outData.mode_str= app_params.mode;
    outData.user="";
    if (!appConfig||appConfig.error) {
        outData.error= "Failed load application configuration!"+(appConfig&&appConfig.error)?" Reason:"+appConfig.error:"";
        res.send(outData);
        return;
    }
    if (DBConnectError) {
        outData.dbConnection= DBConnectError;
        res.send(outData);
        return;
    }
    outData.dbConnection='Connected';
    res.send(outData);
});

var dataModel = require("./datamodel/datamodel");
dataModel.init(app);

app.get("/mainOpenPage/*", function (req, res) {                                                log.info('URL: '+req.originalUrl);
    var file=req.originalUrl.replace("/mainOpenPage","");
    res.sendFile(path.join(__dirname, '/views', file+'.html'));
});

app.listen(app_params.port, function (err) {
    if(err){
        console.log("listen port err= ", err);
        return;
    }
    console.log("server runs on port " + app_params.port);
    log.info("server runs on port " + app_params.port);
});                                                                                                log.info("end app");
