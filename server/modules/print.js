
module.exports.init = function(app){

    app.get("/print/printSimpleDocument", function (req, res) {
        res.sendFile(appViewsPath+"print/printSimpleDocument.html");
    });
};
