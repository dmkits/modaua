
var server= require("../server"), log= server.log, database= require("../database");
var loadedModules= {};
var validateError= null;
module.exports.getValidateError= function(){ return validateError; };

/**
 * callback = function(err), err - validate error
 */
module.exports.validate= function(callback){

    var modules= server.getConfigModules();
    if (!modules) return;
    var modulesDataModels= [];
    for(var i=0; i<modules.length; i++){
        var moduleName=modules[i];                                                          log.info('validate module '+moduleName+"...");//test
        var moduleDataModels= require(appModulesPath+moduleName).dataModels;
        if (!moduleDataModels) continue;
        for(var dmi=0; dmi<moduleDataModels.length; dmi++){
            var dataModelName= moduleDataModels[dmi];
            var dataModelValidateQuery= require(appDataModelPath+dataModelName).validateQuery;
            if (!dataModelValidateQuery) {
                validateError="Failed validate module "+moduleName+" data model:"+dataModelName+" Reason: no validate query!";
                callback(validateError);                                                    log.info('FAILED! Reason:no validate query!');//test
                return;
            }
            modulesDataModels.push({moduleName:moduleName, dataModelName:dataModelName, validateQuery:dataModelValidateQuery});
        }
    }

    var validateDataModel= function(modulesDataModels, index){
        var item= modulesDataModels[index];
        if (!item) {
            callback();
            return;
        }                                                                                   log.info('validateDataModel: module:'+item.moduleName+" data model:"+item.dataModelName+" query:"+item.validateQuery);//test
        database.selectQuery(item.validateQuery,function(err){
            if(err){
                validateError="Failed validate module "+item.moduleName+" data model:"+item.dataModelName+" Reason: "+err.message+"!";
                callback(validateError);                                                    log.info('FAILED! Reason:'+err.message);//test
                return;
            };
            validateDataModel(modulesDataModels, index+1);
        });
    };
    validateDataModel(modulesDataModels, 0);
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

