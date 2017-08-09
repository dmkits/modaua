var server= require("./server"), log= server.log, config= server.getConfig();

module.exports= function(app){

    app.use(function (req, res, next) {                                                     log.info("ACCESS CONTROLLER for check user access:",req.url,req.method," body:",req.body);
        if(req.originalUrl=="/login" && req.method=="POST"){
            var userName=req.body.user, userPswrd=req.body.pswrd;
            res.cookie("mduUser", userName);
            res.cookie("mduPswrd", userPswrd);
            res.send({result:"success"});
            return;
        }
        var user= req.cookies.mduUser, pswrd = req.cookies.mduPswrd;
        var userAccess= false, sysadminAccess= false;
        if (config && config.users && user && pswrd){
            var configUsers= config.users;
            for(var i in configUsers){
                var configUser=configUsers[i];
                if(user==configUser.userLogin && pswrd==configUser.pswrd){
                    userAccess= true;
                    if(configUser.userRole=="admin") sysadminAccess=true;
                    break;
                }
            }
        }
        if(!userAccess){
            res.sendFile(appViewsPath +'login.html');
            return;
        }
        if(req.originalUrl.indexOf("/sysadmin")>-1 && sysadminAccess!=true){
            res.redirect("/");
            return;
        }
        next();
    });
};