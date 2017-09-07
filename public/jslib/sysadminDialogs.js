/**
 * Created by dmkits on 30.12.16.
 */
define([ "dijit/ConfirmDialog", "dojo/keys", "dojo/on", "dojo/domReady!"],
    function (ConfirmDialog, keys, on) {
        return {

            /**
             * IANAGEZ 2017-09-07
             * @param params
             * params = {ConfirmDialog params}
             */
            makeDialog: function (params) {
                var myDialog = new ConfirmDialog();
                for (var paramName in params) {
                    console.log("paramName=", paramName, params[paramName]);
                    myDialog.set(paramName, params[paramName]);
                }
                myDialog.on("keypress", function (event) {
                    if (event.keyCode == keys.ENTER) {
                        myDialog.onExecute();
                    }
                });
                return myDialog;
            },
            adminAuthDialog: function () {
               return this.makeDialog({
                    autofocus: false,
                    id: "adminAuthDialog",
                    content: '<table id="auth_admin_dialog_table">' +
                    '<tr>' +
                    '<td><label for="admin_name">Name:</label></td>' +
                    '<td><input type="text" name="admin_name" id="admin_name" value="root"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td><label for="admin_password">Password:</label></td>' +
                    '<td><input type="password" name="admin_password" id="admin_password"></td>' +
                    '</tr>' +
                    '</table>',
                    title: "Admin authorisation",
                    buttonOk: "Login",
                    buttonCancel: "Cancel"
                });
            },

            backupDialog:function(){
               return this.makeDialog({
                    id: "backupDialog",
                    content: '<table id="backup_fileName_dialog_table">' +
                    '<tr>' +
                    '<td><label for="backup_fileName">file name:</label></td>' +
                    '<td><input type="text" name="backup_fileName" id="backup_fileName">.sql</td>' +
                    '</tr>' +
                    '</table>',
                    title: "Save backup as",
                    buttonOk:"Save",
                    buttonCancel:"Cancel",
                    onShow:function(){
                        var DBName= document.getElementById('db.name').value;
                        var now=moment().format("YYYYMMDD_HHm");
                        var defaultFileName =DBName+"_"+now;
                        if(this.onlyDataBackup)defaultFileName=defaultFileName+"_data";
                        document.getElementById('backup_fileName').value=defaultFileName;
                    }
                });
            },

            rewriteBackupDialog:function(){
                return this.makeDialog({
                    id: "rewriteBackupDialog",
                    content: "File exists!\n Rewrite file?",
                    title: "Rewrite file",
                    buttonOk:"Rewrite",
                    buttonCancel:"Cancel"
                });
            },
            restoreDialog:function(){
                return this.makeDialog({
                    id: "restoreDialog",
                    content: '<table id="restore_fileName_dialog_table">' +
                    '<tr>' +
                    '<td><label for="restore_fileName">file name:</label></td>' +
                    '<td><input type="text" name="restore_fileName" id="restore_fileName">.sql</td>' +
                    '</tr>' +
                    '</table>',
                    title: "Restore from file",
                    buttonOk:"Restore",
                    buttonCancel:"Cancel"
                });
            },
            dbListForUserDialog:function(){
                return this.makeDialog({
                    autofocus:false,
                    id: "dbForUserDialog",
                    content: '<table id="auth_admin_dialog_table">'+
                    '<tr>'+
                    '<td><label for="db_user_name">Name:</label></td>'+
                    '<td><input type="text" name="db_user_name" id="db_user_name"></td>'+
                    '</tr>'+
                    '<tr>'+
                    '<td><label for="db_user_password">Password:</label></td>'+
                    '<td><input type="password" name="db_user_password" id="db_user_password"></td>'+
                    '</tr>'+
                    '</table>',
                    title: "Please, enter user name",
                    buttonOk:"Get list",
                    buttonCancel:"Cancel"
                });
            }
        }
    });