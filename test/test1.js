/**
 * DMKITS NODEJS TEST code
 */
var o1;
var f1=function(pf1){
    var cpf1=pf1;
    console.log("f1"); pf1();
    if(!o1){
        o1={};
        o1.pf1=pf1;
        o1.f1=function(){
            console.log("exec o1.f1"); pf1(); cpf1(); o1.pf1();
            setTimeout(function(){
                console.log("exec callback"); pf1(); o1.pf1();
            },0);
        }
    } else
        o1.pf1=pf1;
    o1.f1();
};

f1(function(){ console.log("exec 1 f1"); });
f1(function(){ console.log("exec 2 f1"); });