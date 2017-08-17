var server= require("../server"), log= server.log, appParams= server.getAppStartupParams(), appConfig= server.getConfig();

var database= require("../database");

module.exports.validateModule = function(errs, nextValidateModuleCallback){

    nextValidateModuleCallback();
};

function getUserMenuByUserRole(userRole, usersRoleMenu, appMenu){
    var userMenu=[];
    if(!userRole) return userMenu;
    var userRoleMenuItems=usersRoleMenu[userRole];
    if (userRoleMenuItems==undefined) return appMenu;
    for(var i in userRoleMenuItems) {
        var userRoleMenuItemName = userRoleMenuItems[i];
        for (var j in appMenu) {
            var appMenuItem = appMenu[j];
            if (userRoleMenuItemName == appMenuItem.menuItemName) {
                var userItem = {};
                for(var item in appMenuItem) userItem[item]=appMenuItem[item];
                if(userItem.popupMenu) userItem.popupMenu=null;
                userMenu.push(userItem);
                break;
            }
            var mainPopupMenu = appMenuItem.popupMenu;
            if (mainPopupMenu){
                for (var k in mainPopupMenu) {
                    var popupMenuItem = mainPopupMenu[k];
                    if (userRoleMenuItemName == popupMenuItem.menuItemName) {
                        for (var l in userMenu) {
                            var userMenuItem = userMenu[l];
                            if (userMenuItem.menuItemName == appMenuItem.menuItemName) {
                                if (!userMenuItem.popupMenu) userMenuItem.popupMenu= [];
                                userMenuItem.popupMenu.push(popupMenuItem);
                            }
                        }
                    }
                }
            }
        }
    }
    return userMenu;
};

module.exports.modulePageURL = "/";
module.exports.modulePagePath = "main.html";
module.exports.init= function(app){

    app.get("/main/getMainData", function (req, res) {
        var outData= {};
        outData.mode= appParams.mode;
        outData.mode_str= appParams.mode;
        outData.title=appConfig.title;
        outData.icon32x32=appConfig.icon32x32;
        outData.imageSmall=appConfig.imageSmall;
        outData.imageMain=appConfig.imageMain;

        outData.appUserName= (req.mduUser)?req.mduUser:"unknown";

        var userRole=req.mduUserRole;
        outData.menuBar=getUserMenuByUserRole(userRole, appConfig.usersRoleMenu, appConfig.appMenu);
        outData.autorun=appConfig.usersRoleAutorun[userRole];

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
        res.send(outData);                              console.log("getMainData",outData);
    });
 };