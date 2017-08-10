
var server= require("../server"), log= server.log;

module.exports.init = function(app){
    var modules= server.getConfigModules();
    if (!modules) return;
    for(var i=0; i<modules.length; i++){
        var module=modules[i];                                                          log.info('initing module '+module+"...");//test
        require("./"+module).init(app);
    }
};

