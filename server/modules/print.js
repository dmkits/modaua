var server= require("../server"), config= server.getConfig();
module.exports.init = function(app){
    app.get("/print/printSimpleDocument", function (req, res) {
        var icon32x32=config['icon32x32'] ||  "/icons/modaua32x32.ico";
        res.render(appViewsPath+"print/printSimpleDocument.ejs",{icon:icon32x32});
    });
};
