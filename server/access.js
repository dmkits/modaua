var server= require("./server"), log= server.log, config= server.getConfig();

module.exports= function(app){

    app.use(function (req, res, next) {                                                     log.info("ACCESS CONTROLLER for check user access:",req.url,req.method);
        if(req.originalUrl=="/login" && req.method=="POST"){log.info("ACCESS CONTROLLER login:",req.body);
            var userName=req.body.user, userPswrd=req.body.pswrd;
            res.cookie("user", userName);
            res.cookie("pswrd", userPswrd);
            res.send({result:"success"});
            return;
        }
        var user= req.cookies.user, pswrd = req.cookies.pswrd;
        var userAccess= false;
        if (config && config.users && user && pswrd){
            var configUsers= config.users;
            for(var i in configUsers){
                var configUser=configUsers[i];
                if(user==configUser.user && pswrd==configUser.pswrd){
                    userAccess= true;
                    break;
                }
            }
        }
        if(!userAccess){
            res.sendFile(appViewsPath +'login.html');
            return;
        }
        next();
    });
};