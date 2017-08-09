var server= require("../server"), log= server.log, appParams= server.getAppParams(), appConfig= server.getConfig();

var database= require("../database");

module.exports.init= function(app){
    app.get("/", function (req, res) {
        res.sendFile(appViewsPath+ 'main.html');
    });

    app.get("/main/get_data", function (req, res) {
        var outData= {};
        outData.mode= appParams.mode;
        outData.mode_str= appParams.mode;
        outData.title=appConfig.title;
        outData.menuBar=appConfig.userMenu;
        outData.autorun=appConfig.userAutorun;
        outData.user="";
        if (!appConfig||appConfig.error) {
            outData.error= "Failed load application configuration!"+(appConfig&&appConfig.error)?" Reason:"+appConfig.error:"";
            res.send(outData);
            return;
        }
        if (database.getDBConnectError()) {
            outData.dbConnection= database.getDBConnectError();
            res.send(outData);
            return;
        }
        outData.dbConnection='Connected';
        res.send(outData);
    });

    app.get("/mainOpenPage/*", function (req, res) {
        var file=req.originalUrl.replace("/mainOpenPage","");
        res.sendFile(appViewsPath+file+'.html');
    });

 };