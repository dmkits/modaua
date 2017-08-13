
var server= require("../server"), log= server.log, database= require("../database");
var loadedModules= {};
var validateError= null;
module.exports.getValidateError= function(){ return validateError; };

/**
 * resultCallback = function(errs, errMessage), errs - object of validate errors
 */
module.exports.validateModules= function(resultCallback){
    var modules= server.getConfigModules();
    if (!modules) return;
    var errs={};
    var validateModuleCallback= function(modules, index, errs){
        var moduleName= modules[index];
        if (!moduleName) {
            var errMsg;
            for(var errItem in errs) errMsg= (!errMsg)?errs[errItem]:"\n"+errs[errItem];
            resultCallback(errs,errMsg);
            validateError=errMsg;
            return;
        }
        var module=require("./"+moduleName);                                                log.info('validateModule: module:'+moduleName+"...");//test
        module.validateModule(errs, function(){
            validateModuleCallback(modules, index+1, errs);
        });
    };
    validateModuleCallback(modules, 0, errs);
};

function fillMainMenuItemModuleData(menuItem){
    if (!menuItem.module) return;
    var moduleName=menuItem.module;
    if (!loadedModules[moduleName]) return;
    menuItem.pageId= moduleName;
    menuItem.action= "open";
    menuItem.contentHref = require("./"+moduleName).modulePageURL;
};
function fillMainMenuModuleData(appMenu){
    for(var mainMenuItemIndex in appMenu) {
        var mainMenuItem= appMenu[mainMenuItemIndex];
        fillMainMenuItemModuleData(mainMenuItem);
        if (mainMenuItem.popupMenu){
            for(var popupMenuItemIndex in mainMenuItem.popupMenu) {
                var popupMenuItem= mainMenuItem.popupMenu[popupMenuItemIndex];
                fillMainMenuItemModuleData(popupMenuItem)
            }
        }
    }
};

module.exports.init = function(app){
    var modules= server.getConfigModules();
    if (!modules) return;
    for(var i=0; i<modules.length; i++){
        var moduleName=modules[i], module=require("./"+moduleName);                                                     log.info('initing module '+moduleName+"...");//test
        if (module.modulePageURL&&module.modulePagePath) {
            (function(){
                var modulePagePath=module.modulePagePath;
                app.get(module.modulePageURL, function (req, res) {
                    res.sendFile(appViewsPath+modulePagePath);
                });
            })();
        }
        module.init(app);
        loadedModules[moduleName]= true;
    }
    fillMainMenuModuleData(server.getConfigAppMenu());
};

