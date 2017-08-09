var startDateTime=new Date(), startTime=startDateTime.getTime();                                   console.log('STARTING at ',startDateTime );//test
var dateformat =require('dateformat'), log = require('winston');
var util=require('./util'), app_params = util.getStartupParams();
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
module.exports.log=log;                                                     log.info('STARTING at', startDateTime );//test
log.info('dateformat, winston util loaded' );//test
module.exports.appParams = app_params;                                      log.info('started with app params:',  app_params);//test

var fs = require('fs');                                                     log.info('fs loaded on ', new Date().getTime()-startTime );//test
var path = require('path');                                                 log.info('path loaded on ', new Date().getTime()-startTime );//test
var express = require('express');                                           log.info('express loaded on ', new Date().getTime()-startTime );//test
var app = express();
var bodyParser = require('body-parser');                                    log.info('body-parser loaded on ', new Date().getTime()-startTime );//test
var cookieParser = require('cookie-parser');                                log.info('cookie-parser loaded on ', new Date().getTime()-startTime );//test

var appConfig=null;
global.appConfigPath= path.join(__dirname,'/../','');
function loadAppConfiguration(){
    try {
        appConfig= util.loadConfig(app_params.mode + '.cfg');
    } catch (e) {
        appConfig= {"error":"Failed to load configuration! Reason:" + e};
    }
};
loadAppConfiguration();                                                     log.info('load app configuration loaded on ', new Date().getTime()-startTime);//test
module.exports.loadAppConfiguration= loadAppConfiguration;                  log.info('app mode:'+app_params.mode,' app configuration:', appConfig);//test
module.exports.getAppConfig= function(){ return appConfig };
module.exports.setAppConfig= function(newAppConfig){ appConfig=newAppConfig; };

var database = require('./database');                                       log.info('dataBase loaded on ', new Date().getTime()-startTime);//test

var configFileName=appConfig.configName || 'config.json';
var config=JSON.parse(util.getJSONWithoutComments(fs.readFileSync('./'+configFileName,'utf-8')));
module.exports.getConfig=function(){ return config; }

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use('/', express.static('public'));

global.appViewsPath= path.join(__dirname,'/../views/','');

require("./access")(app);//check user access

require("./appObjects/sysadmin")(app);

app.get("/", function (req, res) {                                          log.info('URL: /');
    res.sendFile(appViewsPath+ 'main.html');
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

var dataModel = require("./datamodel");
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
    console.log("server runs on port " + app_params.port+" on "+(new Date().getTime()-startTime));
    log.info("server runs on port " + app_params.port+" on "+(new Date().getTime()-startTime));
});                                                                                                log.info("end app");
