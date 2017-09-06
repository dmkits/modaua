/**
 * Created by dmkits on 12.07.17.
 */
define(["dojo/_base/declare", "app", "templateDocumentSimpleTable", "hTableEditable"],
    function(declare, APP, TDocumentSimpleTable, HTableEditable) {
        return declare("TemplateDocumentSimpleTableEditable", [TDocumentSimpleTable], {
            /*
             * added args: { dataNewURL, dataStoreURL, dataDeleteURL }
             */
            constructor: function(args,parentName){
                this.dataNewURL= null;
                this.dataStoreURL= null;
                this.dataDeleteURL= null;
                declare.safeMixin(this,args);
            },
            postCreate: function(){
                this.createTopContent();
                this.createContentTable(HTableEditable, {readOnly:false,allowFillHandle:true});
                this.createRightContent();
            },

            /*
             * callback(changedRowData, contentTableInstance, params, nextCallback)
             */
            addContentTableRowChangeCallback: function(callback){
                this.contentTable.addRowChangeCallback(callback);
                return this;
            },

            /*
             * actionParams: { action:"insertTableRow"/"allowEditTableSelectedRow"/"storeTableSelectedRow"/"deleteTableSelectedRow" }
             * actionFunction = function()
             */
            addToolPaneTableActionButton: function(label, actionParams, btnStyle, btnParams, actionFunction){
                if(!this.rightContainer) {
                    console.log("WARNING! Failed addToolPaneTableActionButton! Reason: no rightContainer!");
                    return this;
                }
                if (!this.toolPanes||this.toolPanes.length==0) this.addToolPane("");
                var actionsTableRow= this.addRowToTable(this.toolPanes[this.toolPanes.length-1].containerNode.lastChild);
                var actionButton= this.addTableCellButtonTo(actionsTableRow, {labelText:label, cellWidth:0, btnStyle:btnStyle, btnParameters:btnParams});
                if (!this.toolPanesActionButtons) this.toolPanesActionButtons={};
                this.toolPanesActionButtons[actionParams.action]= actionButton;
                if(actionFunction) {
                    actionButton.onClick=actionFunction;
                    actionButton.contentTable= this.contentTable;
                } else {
                    actionButton.onClick= this.getOnClickButtonTableAction(actionParams);
                //    actionButton.setState= this.getSetStateAction(actionParams.action);
                }
                return this;
            },
            getOnClickButtonTableAction: function(actionParams){
                var actionFunction, thisInstance=this;
                if (actionParams&&actionParams.action=="insertTableRow"){
                    actionFunction= function(){
                        thisInstance.contentTable.insertRowAfterSelected();
                        if (thisInstance.dataNewURL)
                            thisInstance.contentTable.getRowDataFromURL({url:thisInstance.dataNewURL, condition:null,
                                rowData:thisInstance.contentTable.getSelectedRow(), consoleLog:true, callUpdateContent:false});
                    };
                } else if (actionParams&&actionParams.action=="allowEditTableSelectedRow"){
                    actionFunction= function(){
                        thisInstance.contentTable.allowEditSelectedRow();
                    };
                } else if (actionParams&&actionParams.action=="storeTableSelectedRow"){
                    actionFunction= function(){
                        thisInstance.contentTable.storeSelectedRowDataByURL({url:thisInstance.dataStoreURL, condition:null});
                    };
                } else if (actionParams&&actionParams.action=="deleteTableSelectedRow"){
                    actionFunction= function(){
                        thisInstance.contentTable.deleteSelectedRowDataByURL({url:thisInstance.dataDeleteURL, condition:null});
                    };
                }
                return actionFunction;
            },

            /*
             * actionParams = { action: "insertTableRowsAfterSelected" / "allowEditTableSelectedRows" / "storeTableSelectedRows" }
             *
             */
            addContentTablePopupMenuItemAction: function(itemName, actionParams){
                var menuItemCallback, thisInstance=this;
                if (actionParams.action==="insertTableRowsAfterSelected"){
                    menuItemCallback= function(selRowsData){
                        var count=0;
                        if(selRowsData.length>0) {
                            for (var rowIndex in selRowsData) count++;
                            thisInstance.contentTable.insertRowsAfterSelected(count);
                        } else
                            thisInstance.contentTable.insertRowAfterSelected();
                    }
                } else if (actionParams.action==="allowEditTableSelectedRows"){
                    menuItemCallback= function(selRowsData){
                        thisInstance.contentTable.allowEditRows(selRowsData);
                    }
                } else if (actionParams.action==="storeTableSelectedRows"){
                    menuItemCallback= function(selRowsData){
                        thisInstance.contentTable.storeRowsDataByURL({url:thisInstance.dataStoreURL, rowsData:selRowsData, condition:null});
                    }
                }
                if (menuItemCallback)
                    this.contentTable.setMenuItem(this.id+actionParams.action, itemName, {}, menuItemCallback);
                return this;
            }
        });
    });