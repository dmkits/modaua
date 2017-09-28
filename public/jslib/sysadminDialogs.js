/**
 * Created by dmkits on 30.12.16.
 */
define([ "dijit/ConfirmDialog", "dojo/keys", "dojo/on", "dijit/registry", "dojo/domReady!"],
    function (ConfirmDialog, keys, on, registry) {
        return {

            /**
             * IANAGEZ 2017-09-07
             * @param params
             * params = {ConfirmDialog params}
             */
            makeDialog: function (params) {
                var myDialog = new ConfirmDialog();
                for (var paramName in params) {
                    myDialog.set(paramName, params[paramName]);
                }
                myDialog.on("keypress", function (event) {
                    if (event.keyCode == keys.ENTER) {
                        myDialog.onExecute();
                    }
                });
                myDialog.startup();
                return myDialog;
            },
            /** doAdminAuthDialog
             * params = { dialogTitle,
             *      okButtonLabel, cancelButtonLabel
             * }
             * resultCallback = function(result = { result=true/false } )
             */
            showAdminAuthDialog: function (params,resultCallback) {
                var adminAuthDialog = registry.byId('adminAuthDialog');
                if(adminAuthDialog)return adminAuthDialog.show();
                var table = document.createElement('table');
                var trForName = document.createElement('tr');
                var trForPswd = document.createElement('tr');
                table.appendChild(trForName);
                table.appendChild(trForPswd);
                var tdNameLabel = document.createElement('td');
                var tdNameInput = document.createElement('td');
                var labelForName=document.createElement('label');
                labelForName.htmlFor = 'auth_dialog_admin_name';
                labelForName.innerText="Name:";
                var inputForName=document.createElement('input');
                inputForName.setAttribute('id','auth_dialog_admin_name');
                inputForName.setAttribute('type','text');

                tdNameLabel.appendChild(labelForName);
                tdNameInput.appendChild(inputForName);

                trForName.appendChild(tdNameLabel);
                trForName.appendChild(tdNameInput);

                var tdPswdLabel = document.createElement('td');
                var tdPswdInput = document.createElement('td');
                var labelForPswd=document.createElement('label');
                labelForPswd.htmlFor = 'auth_dialog_admin_password';
                labelForPswd.innerText="Password:";
                var inputForPswd=document.createElement('input');
                inputForPswd.setAttribute('id','auth_dialog_admin_password');
                inputForPswd.setAttribute('type','password');
                tdPswdLabel.appendChild(labelForPswd);
                tdPswdInput.appendChild(inputForPswd);
                trForPswd.appendChild(tdPswdLabel);
                trForPswd.appendChild(tdPswdInput);

                adminAuthDialog= this.makeDialog({
                    autofocus: false,
                    id: "adminAuthDialog",
                    content: table,
                    title: "Admin authorisation",
                    buttonOk: "Login",
                    buttonCancel: "Cancel"
                });
                adminAuthDialog.onShow=function(){
                    inputForName.setAttribute('value','root');
                    inputForPswd.setAttribute('value','');
                    inputForPswd.focus();
                };

                if(resultCallback) {
                    adminAuthDialog.onExecute= function(){
                        this.hide();
                        var result={result:true};
                        result.admin_name=inputForName.value;
                        result.admin_password=inputForPswd.value;
                        resultCallback(result);
                    };
                }
                return adminAuthDialog.show();
            },
            /**
             *
             * @param params {onlyDataBackup:true/false}
             * @param resultCallback
             * @returns {*}
             */
            showBackupDialog: function (params, resultCallback) {
                var backupDialog = registry.byId('backupDialog');
                if (backupDialog)  return backupDialog.show();

                var table = document.createElement('table');
                var tr=document.createElement('tr');
                var tdForLabel=document.createElement('td');
                var tdForInput=document.createElement('td');
                var label=document.createElement('label');
                label.htmlFor = 'backup_fileName_in_backup_dialog';
                label.innerText="file name:";
                var inputBackupFileName=document.createElement('input');
                inputBackupFileName.setAttribute("id","backup_fileName_in_backup_dialog" );
                var td = document.createElement('td');
                td.innerText=".sql";
                table.appendChild(tr);
                tr.appendChild(tdForLabel);
                tr.appendChild(tdForInput);
                tr.appendChild(td);
                tdForLabel.appendChild(label);
                tdForInput.appendChild(inputBackupFileName);

                backupDialog = this.makeDialog({
                    id: "backupDialog",
                    content: table,
                    title: "Save backup",
                    buttonOk: "Save",
                    buttonCancel: "Cancel"
                });
                backupDialog.onShow = function () {
                    var DBName = document.getElementById('db.name').value;
                    var now = moment().format("YYYYMMDD_HHm");
                    var defaultFileName = DBName + "_" + now;
                    if(params.onlyDataBackup=="true")defaultFileName=defaultFileName+"_data";
                    inputBackupFileName.setAttribute('value',defaultFileName);
                    console.log("backupFileName.value=",inputBackupFileName.value);
                };
                if (resultCallback) {
                    backupDialog.onExecute = function () {
                        this.hide();
                        var result = {result: true};
                        result.backup_fileName=inputBackupFileName.value;
                        resultCallback(result);
                    };
                }
                return backupDialog.show();
            },
            /**
             * @param
             * @param resultCallback
             * @returns {*}
             */
            showRewriteBackupDialog:function(resultCallback){

                var rewriteBackupDialog=registry.byId('rewriteBackupDialog');
                if (rewriteBackupDialog)  return rewriteBackupDialog.show();

                rewriteBackupDialog= this.makeDialog({
                    id: "rewriteBackupDialog",
                    content: "File exists!\n Rewrite file?",
                    title: "Rewrite file",
                    buttonOk:"Rewrite",
                    buttonCancel:"Cancel"
                });
                if (resultCallback) {
                    rewriteBackupDialog.onExecute = function () {
                        this.hide();
                        var result = {rewrite: true};
                        resultCallback(result);
                    };
                }

                return rewriteBackupDialog.show();
            },

            showRestoreDialog:function(resultCallback){
                var restoreDialog=registry.byId('restoreDialog');
                if(restoreDialog) return restoreDialog.show();

                var table = document.createElement('table');
                var tr=document.createElement('tr');
                var tdForLabel=document.createElement('td');
                var tdForInput=document.createElement('td');
                var label=document.createElement('label');
                label.htmlFor = 'restore_fileName_in_restore_dialog';
                label.innerText="file name:";
                var inputRestoreFileName=document.createElement('input');
                inputRestoreFileName.setAttribute("id","restore_fileName_in_restore_dialog" );
                var td = document.createElement('td');
                td.innerText=".sql";
                table.appendChild(tr);
                tr.appendChild(tdForLabel);
                tr.appendChild(tdForInput);
                tr.appendChild(td);
                tdForLabel.appendChild(label);
                tdForInput.appendChild(inputRestoreFileName);

                restoreDialog = this.makeDialog({
                    id: "restoreDialog",
                    content:table,
                    title: "Restore from file",
                    buttonOk:"Restore",
                    buttonCancel:"Cancel"
                });
                if (resultCallback) {
                    restoreDialog.onExecute = function () {
                        this.hide();
                        var result = {result: true};
                        result.restore_fileName=inputRestoreFileName.value;
                        resultCallback(result);
                    };
                }
                return restoreDialog.show();
            },
            dbListForUserDialog:function(){
                return this.makeDialog({
                    autofocus:false,
                    id: "dbForUserDialog",
                    content: '<table id="db_for_user_dialog_table">'+
                    '<tr>'+
                    '<td><label for="server_db_user_name">Name:</label></td>'+
                    '<td><input type="text" name="server_db_user_name" id="server_db_user_name"></td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td><label for="server_db_user_password">Password:</label></td>'+
                    '<td><input type="password" name="server_db_user_password" id="server_db_user_password"></td>'+
                    '</tr>'+
                    '</table>',
                    title: "Please, enter user name",
                    buttonOk:"Get list",
                    buttonCancel:"Cancel"
                });
            }
        }
    });