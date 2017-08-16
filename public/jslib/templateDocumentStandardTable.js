/**
 * Created by dmkits on 16.02.17.
 */
define(["dojo/_base/declare", "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
        "dijit/form/DateTextBox", "dijit/form/TextBox", "dijit/form/NumberTextBox", "dijit/form/Select", "dojox/layout/ContentPane",
        "app", "templateDocumentBase", "contentController", "hTableEditable", "dialogs"],
    function(declare, BorderContainer, ContentPane, DateTextBox, TextBox, NumberTextBox, Select, XContentPane,
             APP, DocumentBase, ContentController, HTable, Dialogs) {
        return declare("TemplateDocumentStandardTable", [BorderContainer, DocumentBase], {
            /*
             * args: {titleText, dataURL, condition:{...}, buttonUpdate, buttonPrint, printFormats={ ... } }
             * default:
             * buttonUpdate=true, buttonPrint=true,
             * printFormats={ numericFormat:"0,000,000.[00]", dateFormat:"DD.MM.YY", currencyFormat:"0,000,000.[00]" }
             */
            constructor: function (args, parentName) {
                this.srcNodeRef = document.getElementById(parentName);
                this.idListContainer=null;
                this.idDetailContainer=null;
                this.idDetailHeader=null;
                this.idDetailTable=null;
                this.idDetailTotal=null;
                this.idRightContainer=null;
                declare.safeMixin(this, args);
                this.listTable = null;
                this.listBDate = null;
                this.listEDate = null;
                this.detailContainer= null;
                this.rightContainer= null;
                //if (this.buttonUpdate === undefined) this.buttonUpdate = true;
                //if (this.buttonPrint === undefined) this.buttonPrint = true;
                //if (this.detailContentErrorMsg === undefined) this.detailContentErrorMsg = "Failed get data!";
            },

            postCreate: function () {
                if(this.idListContainer){
                    this.listContainer= this.setContainer({region:'left',splitter:true}, this.idListContainer);
                    this.listPeriodContent= this.setChildContentPaneTo(this.listContainer, {region:'top',style:"width:100%;height:auto;padding:0;margin:0;"});
                }
                if(this.idDetailContainer){
                    this.detailContainer= this.setContainer({region:'center'}, this.idDetailContainer);
                }
                if(this.idDetailContainer&&this.idDetailHeader){
                    this.detailHeader= new ContentController({region:'top', dataIDName:null, style:"margin:0;padding:0;"},this.idDetailHeader);
                    this.detailContainer.addChild(this.detailHeader);
                }
                if(this.idDetailContainer&&this.idDetailTable){
                    this.detailTable=
                        new HTable({region:'center',style:"margin:5px;padding:0;", wordWrap:true, readOnly:false, useFilters:true, allowFillHandle:true}, this.idDetailTable);
                    this.setBorderedStyleFor(this.detailTable.domNode);
                    this.detailContainer.addChild(this.detailTable);
                }
                if(this.idDetailContainer&&this.idDetailTotal){
                    this.detailTotal= this.setContentPane({region:'bottom'}, this.idDetailTotal);
                }
                if(this.idRightContainer){
                    this.rightContainer= this.setContentPane({region:'right'}, this.idRightContainer);
                    return this;
                }
            },

            /*
            * params: {header, bdateCondition,bdatelabelText, edateCondition,edatelabelText}
            */
            setListDatesContent: function(params){
                if (params.header) {
                    var listHeaderTable = this.addTableTo(this.listPeriodContent.containerNode);
                    var listHeaderRow = this.addRowToTable(listHeaderTable, 25);
                    this.addHeaderCellToTableRow(listHeaderRow, 0, "width:100%;", params.header);
                }
                if (!params.bdateCondition&&!params.edateCondition) return this;
                var listPeriodTable = this.addTableTo(this.listPeriodContent.containerNode);
                this.listPeriodTableRow = this.addRowToTable(listPeriodTable);
                var instance = this;
                if (params.bdateCondition) {
                    this.listBDate = this.addTableCellDateBoxTo(this.listPeriodTableRow,
                        {labelText:params.bdatelabelText, labelStyle:"margin-left:5px;", cellWidth:110, cellStyle:"text-align:right;",
                            inputParams:{conditionName:params.bdateCondition}, initValueDate:APP.curMonthBDate()});
                    this.listBDate.onChange = function(){
                        instance.loadListTableContentFromServer();
                    }
                }
                if (params.edateCondition) {
                    this.listEDate = this.addTableCellDateBoxTo(this.listPeriodTableRow,
                        {labelText:params.edatelabelText, labelStyle:"margin-left:5px;", cellWidth:110, cellStyle:"text-align:right;",
                            inputParams:{conditionName:params.edateCondition}, initValueDate:APP.today()});
                    this.listEDate.onChange = function(){
                        instance.loadListTableContentFromServer();
                    }
                }
                return this;
            },
            /*
             * params: { getDataUrl:"/...", getDataCondition: {param:paramValue, ...} }
             */
            setListTable: function(params){
                this.listTable =
                    new HTable({region:'center',style:"margin:5px;padding:0;", wordWrap:true, readOnly:true, useFilters:true, allowFillHandle:false});
                this.setBorderedStyleFor(this.listTable.domNode);

                this.listTable.getDataUrl= (params)?params.getDataUrl:null; this.listTable.getDataCondition= (params)?params.getDataCondition:null;
                this.listContainer.addChild(this.listTable);
                var thisInstance= this;
                this.listTable.onUpdateContent= function() {                                    console.log("TemplateDocumentStandardTable.listTable.onUpdateContent ",this.getSelectedRow()," selectedRowDataIDForSet=",this.selectedRowDataIDForSet);
                    if(this.selectedRowDataIDForSet!==undefined) {
                        this.setSelectedRowByItemValue(this.getRowIDName(), this.selectedRowDataIDForSet);
                        return
                    }
                    var selectedRowData = this.getSelectedRow();
                    if (!selectedRowData && this.getContent().length > 0) {
                        this.setSelectedRow(0);
                        return;
                    }
                    thisInstance.setDetailHeaderContentByListSelectedRow(selectedRowData);
                };
                this.listTable.onSelect = function (firstSelectedRowData, selection) {                                  console.log("TemplateDocumentStandardTable.listTable.onSelect ",firstSelectedRowData);
                    if ( (thisInstance.detailHeader&&thisInstance.detailHeader.isContentChanged())
                            || (thisInstance.detailTable&&thisInstance.detailTable.isExistsEditableRows()) ){
                        var listTableSelRowDataID= firstSelectedRowData[thisInstance.detailHeader.dataIDName];
                        if(listTableSelRowDataID===thisInstance.detailHeader.getContentDataIDValue()) return;
                        Dialogs.doDialogMsg({title:"Действия с изменениями в документе",
                                content:"<b>Вы пытаетесь перейти в другой документ не сохранив изменения<br> в текущем документе.<br></b>"
                                    +"<br>Нажмите <b>Вернуться</b>, чтобы вернуться в текущий документ<br> и продолжить работу с ним, <br>"
                                    +"<br>или нажмите <b>Не сохранять</b> чтобы не сохранять изменения<br>"
                                    +" в текущем документе и перейти к выбранному в списке документу.",
                                btnOkLabel:"Вернуться", btnCancelLabel:"Не сохранять"
                            },function(dlgWin){
                                dlgWin.hide();
                            },function(dlgWin){
                                dlgWin.hide();
                                thisInstance.listTable.setSelection(firstSelectedRowData, selection);
                                thisInstance.setDetailHeaderContentByListSelectedRow(firstSelectedRowData);
                            }
                        );
                        return;
                    }
                    this.setSelection(firstSelectedRowData, selection);
                    thisInstance.setDetailHeaderContentByListSelectedRow(firstSelectedRowData);
                };
                return this;
            },
            loadListTableContentFromServer: function(selectedRowDataID){
                var condition = this.listTable.getDataCondition;
                if (!condition) condition={};
                if (this.listBDate) condition[this.listBDate.conditionName] =
                    this.listBDate.format(this.listBDate.get("value"),{selector:"date",datePattern:"yyyy-MM-dd"});
                if (this.listEDate) condition[this.listEDate.conditionName] =
                    this.listEDate.format(this.listEDate.get("value"),{selector:"date",datePattern:"yyyy-MM-dd"});
                var thisListTable=this.listTable;
                thisListTable.selectedRowDataIDForSet=selectedRowDataID;
                this.listTable.setContentFromUrl({url:this.listTable.getDataUrl,condition:condition});
            },

            /*
             * parameters= { dataIDName, getDataUrl }
             */
            setDetailHeaderParameters: function(parameters){
                if (parameters.dataIDName) this.detailHeader.setDataIDName(parameters.dataIDName);
                if (parameters.getDataUrl) this.detailHeader.getDataUrl=parameters.getDataUrl;
                if (parameters.getDataForNewUrl) this.detailHeader.getDataForNewUrl=parameters.getDataForNewUrl;
                if (parameters.postDataUrl) this.detailHeader.postDataUrl=parameters.postDataUrl;
                if (parameters.postForDeleteDataUrl) this.detailHeader.postForDeleteDataUrl=parameters.postForDeleteDataUrl;
                var thisInstance=this;
                this.detailHeader.onContentUpdated= function(contentData, sourceparams, idIsChanged){                   console.log("TemplateDocumentStandardTable.detailHeader.onContentUpdated ",contentData," ",sourceparams,idIsChanged);
                    if(sourceparams.source.indexOf("Values")<0) this.lastContentData=contentData;
                    if (this.setTitleContent) this.setTitleContent();
                    if(sourceparams.source.indexOf("postContentFromUrl")>=0 || sourceparams.source.indexOf("postForDeleteContentFromUrl")>=0) {
                        if(sourceparams.error||sourceparams.resultError) {
                            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            return;
                        }
                        thisInstance.loadListTableContentFromServer(thisInstance.detailHeader.getContentDataIDValue());
                    }
                    if (idIsChanged===true) thisInstance.loadDetailTableContentDataFromServer();
                    else {
                        if (!contentData||contentData.length==0) thisInstance.setDetailSubtotalContent({disabled:true, clearValue:true});
                        thisInstance.setToolPanesActions();
                    }
                };
                this.detailHeader.onContentChanged= function(isContentChanged){                                     //console.log("TemplateDocumentStandardTable.detailHeader.onContentChanged ",isContentChanged,this.getContentData());
                    //thisInstance.detailTableSetDisabled(isContentChanged);
                    thisInstance.setToolPanesActions();
                };
                return this;
            },
            setDetailHeaderContentByListSelectedRow: function(listSelectedFirstRowData, reloadData, clearBeforeLoad){   //console.log("TemplateDocumentStandardTable.setDetailHeaderContentByListSelectedRow ",listSelectedFirstRowData);
                if (!this.detailHeader) {
                    this.setToolPanesActions();
                    return;
                }
                if (!this.detailHeader.getDataUrl||!listSelectedFirstRowData){
                    this.detailHeader.setContentData(null);
                    this.detailHeader.lastContentData=this.detailHeader.getContentData();
                    return;
                }
                var newID= listSelectedFirstRowData[this.detailHeader.dataIDName];                          //console.log("TemplateDocumentStandardTable.setDetailHeaderContentByListSelectedRow newID=",newID);
                if (newID===null||newID===undefined) {
                    this.detailHeader.setContentData(null);
                    this.detailHeader.lastContentData=this.detailHeader.getContentData();
                    return;
                }
                if(this.detailHeader.getContentDataIDValue()===newID&&reloadData!==true) return;
                if(clearBeforeLoad===true) this.detailHeader.clearData();
                var detailHeaderGetDataCondition={};
                detailHeaderGetDataCondition[this.detailHeader.dataIDName]=newID;                           //console.log("TemplateDocumentStandardTable.setDetailHeaderContentByListSelectedRow this.detailHeader.loadDataFromUrl");
                this.detailHeader.loadDataFromUrl({ url:this.detailHeader.getDataUrl, condition:detailHeaderGetDataCondition });
            },
            reloadDetailHeaderContentFromServer: function(){
                this.setDetailHeaderContentByListSelectedRow(this.detailHeader.lastContentData, true);
            },
            reloadDetailContentFromServer: function(){
                this.setDetailHeaderContentByListSelectedRow(this.detailHeader.lastContentData, true, true);
            },
            loadDetailHeaderContentValuesFromServer: function(){
                if (!this.detailHeader.getDataForNewUrl) return;
                this.detailHeader.lastContentData=this.detailHeader.getContentData();
                this.detailHeader.loadDataFromUrl({ url:this.detailHeader.getDataForNewUrl, condition:null, setOnlyControlElementsValues:true});
            },
            storeDetailHeaderContentValues: function(){
                if (!this.detailHeader.postDataUrl) return;
                this.detailHeader.postDataToUrl({url:this.detailHeader.postDataUrl, condition:null});
            },
            deleteDetailHeaderContent: function(){
                if (!this.detailHeader.postForDeleteDataUrl) return;
                this.detailHeader.postForDeleteDataToUrl({url:this.detailHeader.postForDeleteDataUrl, condition:null});
            },
            addDetailHeaderElement: function(newRow,obj){
                if(!this.detailHeaderElements) this.detailHeaderElements=[];
                if(this.detailHeaderElements.length==0||newRow) this.detailHeaderElements.push([]);
                if(obj) this.detailHeaderElements[this.detailHeaderElements.length-1].push(obj);
            },
            addDetailHeaderRow: function(height, createNewTable){
                if (!height) height=25;
                if (!this.detailHeaderTable || (this.detailHeaderTable&&createNewTable) )
                    this.detailHeaderTable= this.addTableTo(this.detailHeader.containerNode, "margin:0;border-collapse:separate;border-spacing:10px 0;");
                this.addRowToTable(this.detailHeaderTable, height);
                this.addDetailHeaderElement(true);
                return this;
            },
            /*
             * params: {title, titleForNew, titleForNothing, titleForFailedLoad, numberDataItemName, dateDataItemName, titleDatePrefix}
             */
            addDetailHeaderTitle: function(detailHeaderTitleParams,height){
                if (!detailHeaderTitleParams.titleDatePrefix) detailHeaderTitleParams.titleDatePrefix=" ";
                this.detailHeaderTable= this.addTableTo(this.detailHeader.containerNode, "padding:0;margin:0px;");
                this.addRowToTable(this.detailHeaderTable, height);
                this.detailHeader.titleCell= this.addHeaderCellToTableRow(this.detailHeaderTable.lastChild);
                this.addDetailHeaderElement(true,this.detailHeader.titleCell);
                this.detailHeader.setTitleContent= function(){
                    if (!this.titleCell) return;
                    if (this.getContentData()===undefined){
                        this.titleCell.innerHTML= "<span>"+detailHeaderTitleParams.titleForFailedLoad+"</span>";
                        return;
                    }
                    if (this.getContentData()===null){
                        this.titleCell.innerHTML= "<span>"+detailHeaderTitleParams.titleForNothing+"</span>";
                        return;
                    }
                    if (this.getContentData()&& (this.getContentDataIDValue()==undefined||this.getContentDataIDValue()==null)){
                        this.titleCell.innerHTML= "<span style='color:red;'>"+detailHeaderTitleParams.titleForNew+"</span>";
                        return;
                    }
                    this.titleCell.innerHTML= detailHeaderTitleParams.title;
                    if (detailHeaderTitleParams.numberDataItemName)
                        this.titleCell.innerHTML= this.titleCell.innerHTML
                            +" № "+this.getContentDataItem(detailHeaderTitleParams.numberDataItemName);
                    if (detailHeaderTitleParams.dateDataItemName)
                        this.titleCell.innerHTML= this.titleCell.innerHTML
                            +" "+detailHeaderTitleParams.titleDatePrefix
                            +" "+moment(this.getContentDataItem(detailHeaderTitleParams.dateDataItemName)).format("DD.MM.YYYY");
                };
                this.addDetailHeaderBtnUpdate();
                this.addDetailHeaderBtnPrint();
                return this;
            },
            addDetailHeaderBtnUpdate: function(width, labelText){
                if (width===undefined) width=200;
                if (!labelText) labelText="Обновить";
                this.detailHeader.btnUpdate= this.addTableHeaderButtonTo(this.detailHeaderTable.lastChild, {labelText:labelText, cellWidth:width, cellStyle:"text-align:right;"});
                var instance= this;
                this.detailHeader.btnUpdate.onClick = function(){
                    instance.reloadDetailContentFromServer();
                };
                return this;
            },
            addDetailHeaderBtnPrint: function(width, labelText, printFormats){
                if (width===undefined) width=100;
                if (!this.detailHeader.btnUpdate) this.addBtnUpdate(width);
                if (!labelText) labelText="Печатать";
                this.detailHeader.btnPrint= this.addTableHeaderButtonTo(this.detailHeaderTable.lastChild, {labelText:labelText, cellWidth:1, cellStyle:"text-align:right;"});
                var instance = this;
                this.detailHeader.btnPrint.onClick = function(){
                    instance.doPrint();
                };
                return this;
            },
            /*
             * params={ style, inputStyle }
             */
            addDetailHeaderTextBox: function(itemName, label, cellWidth, params){
                if (!params) params={};
                if (!params.inputStyle) params.inputStyle="";
                if (!params.style) params.style="";
                var textBox= this.addTableCellTextBoxTo(this.detailHeaderTable.lastChild,
                    {cellWidth:cellWidth, labelText:label, labelStyle:params.style, inputStyle:params.style+params.inputStyle,
                        inputParams:{/*it's for print*/cellWidth:cellWidth, labelText:label, printStyle:params.style, inputStyle:params.inputStyle } });


                //var totalNumberTextBox= this.addTableCellNumberTextBoxTo(this.totalTableRow,
                //    {cellWidth:width, cellStyle:"text-align:right;",
                //        labelText:labelText, labelStyle:style, inputStyle:"text-align:right;"+style+inputStyle,
                //        inputParams:{constraints:{pattern:pattern}, readOnly:true,
                //            /*it's for print*/cellWidth:width, labelText:labelText, printStyle:style, inputStyle:inputStyle, typeFormat:pattern } });


                this.detailHeader.addControlElementObject(textBox, itemName);
                this.addDetailHeaderElement(false,textBox);
                return this;

                //this.addPrintDataSubItemTo(printData, "header", {width:detHElem.cellWidth+5, style:detHElem.printStyle,
                //    contentStyle:"margin-top:3px;", label:detHElem.labelText, value:detHElem.value, type:"text", valueStyle:"text-align:right;"+detHElem.inputStyle});
            },
            /*
             * params={ style, inputStyle }
             */
            addDetailHeaderDateTextBox: function(itemName, label, cellWidth, params){
                if (!params) params={};
                if (!params.inputStyle) params.inputStyle="";
                if (!params.style) params.style="";
                var dateBox= this.addTableCellDateBoxTo(this.detailHeaderTable.lastChild,
                    {cellWidth:cellWidth, labelText:label, labelStyle:params.style, inputStyle:params.style+params.inputStyle,
                        inputParams:{/*it's for print*/cellWidth:cellWidth, labelText:label, printStyle:params.style, inputStyle:params.inputStyle } });
                this.detailHeader.addControlElementObject(dateBox, itemName);
                this.addDetailHeaderElement(false,dateBox);
                return this;
            },
            /*
             * params={ style, inputStyle, pattern }
             */
            addDetailHeaderNumberTextBox: function(itemName, label, cellWidth, params){
                if (!params) params={};
                if (!params.inputStyle) params.inputStyle="";
                if (!params.style) params.style="";
                if (!params.pattern||params.pattern.length==0) params.pattern="########0.00";
                var numberTextBox= this.addTableCellNumberTextBoxTo(this.detailHeaderTable.lastChild,
                    { labelText:label, labelStyle:params.style, inputStyle:params.style+"text-align:right;"+params.inputStyle, cellWidth:cellWidth,
                        inputParams:{constraints:{pattern:params.pattern},
                        /*it's for print*/cellWidth:cellWidth, labelText:label, printStyle:params.style, inputStyle:"text-align:right;"+params.inputStyle} });
                this.detailHeader.addControlElementObject(numberTextBox, itemName);
                this.addDetailHeaderElement(false,numberTextBox);
                return this;
            },
            /*
             * params={ style, inputStyle, labelDataItem, loadDropDownURL }
             */
            addDetailHeaderSelect: function(itemName, label, cellWidth, params){
                if (!params) params={};
                if (!params.inputStyle) params.inputStyle="";
                if (!params.style) params.style="";
                var cell= this.addLeftCellToTableRow(this.detailHeaderTable.lastChild, cellWidth);
                var input= this.createInputTo(cell, label, params.style);
                var select= APP.instanceFor(input, Select,
                    {style:params.inputStyle+params.style, labelDataItem:params.labelDataItem,loadDropDownURL:params.loadDropDownURL,
                        /*it's for print*/cellWidth:cellWidth, labelText:label, printStyle:params.style, inputStyle:params.inputStyle });
                this.detailHeader.addControlElementObject(select, itemName);
                this.addDetailHeaderElement(false,select);
                return this;
            },

            /*
             * parameters: { conditionIDName, getDataUrl, getCondition, storeDataUrl, deleteDataUrl }
             */
            setDetailTableParameters: function(parameters){
                if (parameters.conditionIDName) this.detailTable.conditionIDName= parameters.conditionIDName;
                if (parameters.getDataUrl) this.detailTable.getDataUrl=parameters.getDataUrl;
                if (parameters.getCondition) this.detailTable.getDataURLCondition=parameters.getCondition;
                if (parameters.storeDataUrl) this.detailTable.storeDataUrl=parameters.storeDataUrl;
                if (parameters.deleteDataUrl) this.detailTable.deleteDataUrl=parameters.deleteDataUrl;
                var thisInstance= this;
                this.detailTable.onUpdateContent = function(params){                                                console.log("TemplateDocumentStandardTable.detailTable.onUpdateContent ",params);
                    if(params&&(params.changedRows||params.deletedRows)) {
                        thisInstance.reloadDetailHeaderContentFromServer();
                        thisInstance.loadListTableContentFromServer();
                    }
                    var selectedRowData = this.getSelectedRow();
                    if ( !selectedRowData && this.getContent().length>0) {
                        thisInstance.setDetailSubtotalContent();
                        this.setSelectedRow(0);
                        return;
                    }
                    var disableDetailSubtotalContent=false, headerIDValue= thisInstance.detailHeader.getContentDataIDValue();
                    if (headerIDValue===undefined||headerIDValue===null) disableDetailSubtotalContent=true;
                    thisInstance.setDetailSubtotalContent({disabled:disableDetailSubtotalContent,clearValue:disableDetailSubtotalContent});
                    thisInstance.setToolPanesActions();
                };
                this.detailTable.onSelect = function(firstSelectedRowData, selection){                  console.log("TemplateDocumentStandardTable.detailTable.onSelect ",firstSelectedRowData/*,selection*/);
                    this.setSelection(firstSelectedRowData, selection);                                 //console.log("TemplateDocumentStandardTable.detailTable.onSelect ",this.getSelectedRowIndex());
                    thisInstance.setToolPanesActions();
                    //wrh_order_bata_monitor.setProductInfoContent(rowDataValues);
                };
                this.detailTable.onChangeRowData= function(changedRowData,changedRowIndex){                     console.log("TemplateDocumentStandardTable.detailTable.onChangeRowData ",changedRowData);
                    thisInstance.setDetailSubtotalContent();
                };
                this.addDetailTableRowChangeCallback(function(changedRowData, detailTable, thisInstance, nextCallback){                       //console.log("TemplateDocumentStandardTable detailTableRowChangeCallback 1",changedRowData);
                    changedRowData.item(thisInstance.detailTable.conditionIDName).setValue(thisInstance.detailHeader.getContentDataIDValue());
                    nextCallback();
                });
                return this;
            },
            loadDetailTableContentDataFromServer: function(){
                if (!this.detailTable.getDataUrl) {
                    this.setDetailSubtotalContent({disabled:true, clearValue:true});
                    this.setToolPanesActions();
                    return;
                }
                //this.setDetailSubtotalContent({clearValue:true});//clearing before setDetailSubtotalContent on this.detailTable.onUpdateContent
                var condition = this.detailTable.getDataURLCondition, conditionIDValue= this.detailHeader.getContentDataIDValue();
                if (!condition) condition={};
                if (conditionIDValue!==null&&conditionIDValue!==undefined&&this.detailTable.conditionIDName)
                    condition[this.detailTable.conditionIDName]=conditionIDValue;
                this.detailTable.setContentFromUrl({url:this.detailTable.getDataUrl, condition:condition});
            },
            storeDetailTableSelectedRowValuesToServer: function(){
                this.detailTable.storeSelectedRowDataByURL({url:this.detailTable.storeDataUrl, condition:null});
            },
            storeDetailTableRowsDataToServer: function(rowsData){
                if (!rowsData) return;
                this.detailTable.storeRowsDataByURL({url: this.detailTable.storeDataUrl, condition: null, rowsData: rowsData});
            },
            deleteDetailTableSelectedRowFromServer: function(){
                this.detailTable.deleteSelectedRowDataByURL({url:this.detailTable.deleteDataUrl, condition:null});
            },
            /*
             * callback(changedRowData, thisInstance.detailTable, thisInstance)
             */
            addDetailTableRowChangeCallback: function(callback){
                if (!this.detailTable.rowChangeCallbacks) {
                    this.detailTable.rowChangeCallbacks=[];
                    var thisInstance=this, thisInstanceDetailTable=this.detailTable;

                    this.detailTable.onChangeRowsData= function(changedRowsData) {                                      //console.log("TemplateDocumentStandardTable this.detailTable.onChangeRowData",changedRowData);

                        var rowCallback= function(i, changedRowData, callUpdateContent, nextCallback){                  //console.log("TemplateDocumentStandardTable this.detailTable.onChangeRowsData rowCallback",i,changedRowData/*,nextCallback*/);
                            var rowNextCallback=thisInstance.detailTable.rowChangeCallbacks[i];
                            if(rowNextCallback) {
                                rowNextCallback(changedRowData, thisInstance.detailTable, thisInstance,
                                    function(callUpdateContentNext){
                                        callUpdateContentNext= (callUpdateContentNext===undefined)? false : callUpdateContentNext;      //console.log("TemplateDocumentStandardTable this.detailTable.onChangeRowData callback NEXT",changedRowData,callUpdateContentNext,callUpdateContent);
                                        rowCallback(i+1, changedRowData, callUpdateContent||callUpdateContentNext, nextCallback);
                                    });
                                return;
                            }
                            //if (callUpdateContent===true) thisInstanceDetailTable.handsonTable.render();//render after end row callbacks
                            nextCallback();
                        };

                        var rowsCallback= function(i, changedRowsData, callUpdateContent) {                             //console.log("TemplateDocumentStandardTable this.detailTable.onChangeRowData callback",changedRowData);
                            var changedRowData=changedRowsData[i];
                            if (changedRowData) {
                                setTimeout(function(){
                                    rowCallback(0,changedRowData,callUpdateContent,
                                        /**/function(){
                                            setTimeout(function(){
                                                rowsCallback(i+1, changedRowsData, callUpdateContent);
                                            },1);
                                        });
                                },1);
                                return;
                            }
                            thisInstanceDetailTable.handsonTable.render();
                            thisInstanceDetailTable.onUpdateContent({changedRows:changedRowsData});
                        };
                        rowsCallback(0,changedRowsData,false);
                        thisInstanceDetailTable.handsonTable.render();
                    };
                }
                this.detailTable.rowChangeCallbacks.push(callback);
                return this;
            },

            //setDetailHeaderStateContentFor: function(stateElementID){
            //    this.detailHeader.stateElementID= stateElementID;
            //
            //    return this;
            //},

            addDetailTotalElement: function(newRow,obj){
                if(!this.detailTotalElements) this.detailTotalElements=[];
                if(this.detailTotalElements.length==0||newRow) this.detailTotalElements.push([]);
                if(obj) this.detailTotalElements[this.detailTotalElements.length-1].push(obj);
            },
            addDetailTotalRow: function(createNewTable){
               if (!this.detailTotalTable || createNewTable) this.detailTotalTable=this.addTableTo(this.detailTotal.domNode);
                this.addRowToTable(this.detailTotalTable);
                this.addDetailTotalElement(true);
                return this;
            },
            addDetailTotalEmpty: function(cellWidth){
                this.addLeftCellToTableRow(this.detailTotalTable.lastChild, cellWidth);
                return this;
            },
            /*
             * params { inputStyle, style, print:true/false }
             * default print!=false
             */
            addDetailTotalTextBox: function(label, cellWidth, itemName, params){
                var inputStyle="", style="";
                if (params&&params.inputStyle) inputStyle=params.inputStyle;
                if (params&&params.style) style=params.style;
                inputStyle= "font-weight:bold;"+inputStyle;
                var textBox= this.addTableCellTextBoxTo(this.detailTotalTable.lastChild,
                    {cellWidth:cellWidth, cellStyle:"text-align:right;", labelText:label, labelStyle:style, inputStyle:style+inputStyle,
                        inputParams:{readOnly:true,
                        /*it's for print*/cellWidth:cellWidth, labelText:label, printStyle:params.style, inputStyle:params.inputStyle, print:params.print} });
                this.detailHeader.addControlElementObject(textBox, itemName);
                this.addDetailTotalElement(false,textBox);
                return this;
            },
            /*
             * params { style, inputStyle, pattern, print:true/false, printLabel }
             * default pattern="########0.#########"
             * default print!=false
             */
            addDetailTotalNumberTextBox: function(label, cellWidth, itemName, params){
                var inputStyle="", style="", pattern="########0.#########", printLabel=label;
                if (params&&params.inputStyle) inputStyle=params.inputStyle;
                if (params&&params.style) style=params.style;
                if (params&&params.pattern) pattern=params.pattern;
                if (params&&params.printLabel) printLabel=params.printLabel;
                var numberTextBox= this.addTableCellNumberTextBoxTo(this.detailTotalTable.lastChild,
                    {cellWidth:cellWidth, cellStyle:"text-align:right;", labelText:label, labelStyle:style, inputStyle:"text-align:right;"+style+inputStyle,
                        inputParams:{constraints:{pattern:pattern}, readOnly:true,
                            /*it's for print*/cellWidth:cellWidth, labelText:printLabel, printStyle:params.style, inputStyle:"text-align:right;"+params.inputStyle,
                                print:params.print} });
                this.detailHeader.addControlElementObject(numberTextBox, itemName);
                this.addDetailTotalElement(false,numberTextBox);
                return this;
            },
            /*
             * params { style, inputStyle }
             */
            addDetailSubTotalCountNumberTextBox: function(label, cellWidth, params){
                var inputStyle="", style="";
                if (params&&params.inputStyle) inputStyle=params.inputStyle;
                if (params&&params.style) style=params.style;
                var numberTextBox= this.addTableCellNumberTextBoxTo(this.detailTotalTable.lastChild,
                    {cellWidth:cellWidth, cellStyle:"text-align:right;",
                        labelText:label, labelStyle:style, inputStyle:"text-align:right;"+style+inputStyle,
                        inputParams:{constraints:{pattern:"########0.#########"}, readOnly:true} });
                var thisInstance=this;
                numberTextBox.updateValue = function(params){
                    if (params&&params.disabled){
                        this.set("value", null);
                        this.set("disabled", true);
                        return;
                    }
                    if (params&&params.clearValue){
                        this.set("value", null);
                        return;
                    }
                    this.set("disabled", false);
                    this.set("value", thisInstance.detailTable.getContent().length);
                };
                if (!this.subTotals) this.subTotals=[];
                this.subTotals[this.subTotals.length]=numberTextBox;
                return this;
            },
            getDetailTableItemSum: function(tableItemName){
                return this.detailTable.getContentItemSum(tableItemName);
            },
            /*
             * params { style, inputStyle, pattern }
             * default pattern="###,###,##0.#########"
             */
            addDetailSubtotalNumberTextBox: function(label, cellWidth, itemName, params){
                var inputStyle="", style="", pattern="###,###,##0.#########";
                if (params&&params.inputStyle) inputStyle=params.inputStyle;
                if (params&&params.style) style=params.style;
                if (params&&params.pattern) pattern=params.pattern;
                var numberTextBox= this.addTableCellNumberTextBoxTo(this.detailTotalTable.lastChild,
                    {cellWidth:cellWidth, cellStyle:"text-align:right;",
                        labelText:label, labelStyle:style, inputStyle:"text-align:right;"+style+inputStyle,
                        inputParams:{constraints:{pattern:pattern}, readOnly:true} });
                var thisInstance=this;
                numberTextBox.updateValue = function(params){
                    if (params&&params.disabled){
                        this.set("value", null);
                        this.set("disabled", true);
                        return;
                    }
                    if (params&&params.clearValue){
                        this.set("value", null);
                        return;
                    }
                    this.set("disabled", false);
                    this.set("value", thisInstance.getDetailTableItemSum(itemName));
                };
                if (!this.subTotals) this.subTotals=[];
                this.subTotals[this.subTotals.length]=numberTextBox;
                return this;
            },
            /*
             * params { disabled:true/false, clearValue:true/false }
             */
            setDetailSubtotalContent: function(params){                                                             //console.log("TemplateDocumentStandardTable setDetailSubtotalContent ",params);
                if (!this.subTotals) return;
                var disabled= false, clearValue=false;
                if (params&&params.disabled) disabled=params.disabled;
                if (params&&params.clearValue) clearValue=params.clearValue;
                for(var subtotalIndex in this.subTotals) this.subTotals[subtotalIndex].updateValue({clearValue:clearValue, disabled:disabled});
            },

            /*
             * contentAction= function(toolPane, this.detailHeader,this.detailTable,this)
             * contentAction calls on this.detailTable updated or changed selected row
             */
            addToolPane: function(title, contentAction){
                if (!this.toolPanes) this.toolPanes= [];
                var actionsTitlePane= this.addChildTitlePaneTo(this.rightContainer,{title:title});
                if(contentAction) actionsTitlePane.contentAction= contentAction;
                this.toolPanes.push(actionsTitlePane);
                this.addTableTo(actionsTitlePane.containerNode);
                return this;
            },
            addToolXPane: function(title, contentAction){
                if (!this.toolPanes) this.toolPanes= [];
                var actionsTitlePane= this.addChildTitlePaneTo(this.rightContainer,{title:title});
                if(contentAction) actionsTitlePane.contentAction= contentAction;
                this.toolPanes.push(actionsTitlePane);
                actionsTitlePane.xContentPane= new XContentPane({style:"margin:0;padding:0;"});
                actionsTitlePane.addChild(actionsTitlePane.xContentPane);
                return this;
            },
            setToolPanesContent: function(){
                if(!this.toolPanes) return;
                for(var tpInd=0;tpInd<this.toolPanes.length;tpInd++) {
                    var toolPane= this.toolPanes[tpInd], tpContentAction=toolPane.contentAction;
                    var tpInstance= (toolPane.xContentPane)?toolPane.xContentPane:toolPane;
                    if (tpContentAction) tpContentAction(tpInstance,this.detailHeader,this.detailTable,this);
                }
            },
            addToolPaneBR: function(){
                var row= this.addRowToTable(this.toolPanes[this.toolPanes.length-1].containerNode.lastChild);
                this.addLeftCellToTableRow(row).innerHTML="<br>";
                return this;
            },
            /*
             * actionParams: {action:"loadHeaderNewValues"/"storeHeaderValues"/"loadHeaderLastValues"/"deleteHeader"
             *       / "insertDetailTableRow"/"insertDetailTableCopySelectedRow"/"allowEditDetailTableSelectedRow"/"storeDetailTableSelectedRow"/"deleteDetailTableSelectedRow",
             *    rowPosName, rowPosIndexName}
             * actionFunction = function()
             */
            addToolPaneActionButton: function(label, actionParams, btnStyle, btnParams, actionFunction){
                if (!this.toolPanes||this.toolPanes.length==0) this.addToolPane("");
                var actionsTableRow= this.addRowToTable(this.toolPanes[this.toolPanes.length-1].containerNode.lastChild);
                var actionButton= this.addTableCellButtonTo(actionsTableRow, {labelText:label, cellWidth:0, btnStyle:btnStyle, btnParameters:btnParams});
                if (!this.toolPanesActionButtons) this.toolPanesActionButtons={};
                this.toolPanesActionButtons[actionParams.action]= actionButton;
                if(actionFunction) {
                    actionButton.onClick=actionFunction;
                    actionButton.detailTable= this.detailTable;
                } else {
                    actionButton.onClick= this.getOnClickAction(actionParams);
                    actionButton.setState= this.getSetStateAction(actionParams.action);
                }
                return this;
            },
            /*
             * action: loadHeaderNewValues
             */
            getOnClickAction: function(actionParams){
                var thisInstance=this;
                if (actionParams.action==="loadHeaderNewValues"){
                    return function(){
                        thisInstance.loadDetailHeaderContentValuesFromServer();
                    }
                } else if (actionParams.action==="storeHeaderValues"){
                    return function(){
                        thisInstance.storeDetailHeaderContentValues();
                    }
                } else if (actionParams.action==="loadHeaderLastValues"){
                    return function(){
                        thisInstance.detailHeader.setContentData(thisInstance.detailHeader.lastContentData);
                    }
                } else if (actionParams.action==="deleteHeader"){
                    return function(){
                        thisInstance.deleteDetailHeaderContent();
                    }
                } else if (actionParams.action==="insertDetailTableRow"){
                    return function(){
                        thisInstance.detailTable.insertRowAfterSelected();
                    }
                } else if (actionParams.action==="insertDetailTableCopySelectedRow"){
                    return function(){
                        thisInstance.detailTable.insertRowAfterSelected(thisInstance.detailTable.getSelectedRow());
                    }
                } else if (actionParams.action==="allowEditDetailTableSelectedRow"){
                    return function(){
                        thisInstance.detailTable.allowEditSelectedRow();
                    }
                } else if (actionParams.action==="storeDetailTableSelectedRow"){
                    return function(){
                        thisInstance.storeDetailTableSelectedRowValuesToServer();
                    }
                } else if (actionParams.action==="deleteDetailTableSelectedRow"){
                    return function(){
                        thisInstance.deleteDetailTableSelectedRowFromServer();
                    }
                } else return function(){};
            },
            getSetStateAction: function(action){
                var thisInstance=this;
                if (action==="storeHeaderValues"){
                    return function(){
                        if (thisInstance.detailHeader.getContentData()&&thisInstance.detailHeader.isContentChanged()) this.setDisabled(false);
                        else this.setDisabled(true);
                    }
                } else if (action==="loadHeaderLastValues"){
                    return function(){
                        if (thisInstance.detailHeader.getContentData()&&thisInstance.detailHeader.isContentChanged()) this.setDisabled(false);
                        else this.setDisabled(true);
                    }
                } else if (action==="deleteHeader"){
                    return function(){
                        if ( thisInstance.detailHeader.getContentData()
                            && !(thisInstance.detailTable.getData()&&thisInstance.detailTable.getData().length>0) ) this.setDisabled(false);
                        else this.setDisabled(true);
                    }
                } else if (action==="insertDetailTableRow"||action==="insertDetailTableCopySelectedRow"){
                    return function(){
                        if (thisInstance.detailHeader.getContentData()&&!thisInstance.detailHeader.isContentChanged()) this.setDisabled(false);
                        else this.setDisabled(true);
                    }
                } else if (action==="allowEditDetailTableSelectedRow"){
                    return function(){
                        if (thisInstance.detailHeader.getContentData()&&!thisInstance.detailHeader.isContentChanged()
                            &&thisInstance.detailTable.getSelectedRow()&&!thisInstance.detailTable.isSelectedRowEditable()) this.setDisabled(false);
                        else this.setDisabled(true);
                    }
                } else if (action==="storeDetailTableSelectedRow"){
                    return function(){
                        if (thisInstance.detailHeader.getContentData()&&!thisInstance.detailHeader.isContentChanged()
                            &&thisInstance.detailTable.isSelectedRowEditable()) this.setDisabled(false);
                        else this.setDisabled(true);
                    }
                } else if (action==="deleteDetailTableSelectedRow"){
                    return function(){
                        if (thisInstance.detailHeader.getContentData()&&!thisInstance.detailHeader.isContentChanged()
                            &&thisInstance.detailTable.getSelectedRow()) this.setDisabled(false);
                        else this.setDisabled(true);
                    }
                }
            },
            setToolPanesActionButtonsState: function(){
                for(var btnAction in this.toolPanesActionButtons) {
                    var actionBtn=this.toolPanesActionButtons[btnAction];
                    if (actionBtn.setState) actionBtn.setState();
                }
            },
            setToolPanesActions: function(){
                this.setToolPanesContent();
                this.setToolPanesActionButtonsState();
            },

            /*
             * actionParams: {action, rowPosName, rowPosIndexName}
             */
            addDetailTableMenuItemAction: function(itemName, actionParams, menuItemCallback){
                if (!itemName||!actionParams) return this;
                var menuItemCallback, thisInstance=this;
                if (actionParams.action==="insertDetailTableRowsAfterSelected"){
                    menuItemCallback= function(selRowsData){
                        var count=0;
                        if(selRowsData.length>0) {
                            for (var rowIndex in selRowsData) count++;
                            thisInstance.detailTable.insertRowsAfterSelected(count);//, actionParams.rowPosName,actionParams.rowPosIndexName
                        } else
                            thisInstance.detailTable.insertRowAfterSelected();

                    }
                } else if (actionParams.action==="allowEditDetailTableSelectedRows"){
                    menuItemCallback= function(selRowsData){
                        thisInstance.detailTable.allowEditRows(selRowsData);
                    }
                } else if (actionParams.action==="storeDetailTableSelectedRows"){
                    menuItemCallback= function(selRowsData){
                        thisInstance.storeDetailTableRowsDataToServer(selRowsData);
                    }
                }
                if (menuItemCallback)
                    this.detailTable.setMenuItem(this.id+"_menuItemFor_"+actionParams.action, itemName, null, menuItemCallback);
                return this;
            },

            startUp: function(){
                if(this.detailContainer)this.detailContainer.startup();
                if (this.listTable) this.loadListTableContentFromServer();
                return this;
            },

            doPrint: function(){                                                                                        //console.log("TemplateDocumentStandardTable.doPrint ",this);
                var printData = {};
                var headerTextStyle="font-size:14px;";
                if(this.detailHeaderElements){
                    for(var ri=0;ri<this.detailHeaderElements.length;ri++){
                        var detHRow=this.detailHeaderElements[ri];
                        this.addPrintDataItemTo(printData, "header", {newTable:true, style:headerTextStyle});
                        for(var ci=0;ci<detHRow.length;ci++){
                            var detHElem=detHRow[ci];                                                                   //console.log("TemplateDocumentStandardTable.doPrint ",ri,ci,detHElem);
                            if(detHElem.tagName&&detHElem.tagName==="TH")
                                this.addPrintDataSubItemTo(printData, "header",
                                    {label:detHElem.innerHTML, width:0, align:"center",style:"width:100%;font-size:14px;font-weight:bold;text-align:center;",
                                        contentStyle:"margin-top:5px;margin-bottom:3px;"});
                            else {
                                value=null;
                                if (detHElem.textbox) value=detHElem.textbox.value;
                                else if(detHElem.textDirNode) value=detHElem.textDirNode.textContent;//if element Select
                                this.addPrintDataSubItemTo(printData, "header", {width:detHElem.cellWidth+5, style:detHElem.printStyle,
                                    contentStyle:"margin-bottom:3px;", label:detHElem.labelText, value:value, type:"text", valueStyle:detHElem.inputStyle});
                            }
                        }
                        this.addPrintDataSubItemTo(printData, "header");
                    }
                }
                printData.columns = this.detailTable.getVisibleColumns();
                printData.data = this.detailTable.getData();
                var totalStyle="font-size:12px;";
                if(this.detailTotalElements){
                    for(var ri=0;ri<this.detailTotalElements.length;ri++){
                        var detTRow=this.detailTotalElements[ri];
                        this.addPrintDataItemTo(printData, "total", {newTable:true, style:totalStyle});
                        this.addPrintDataSubItemTo(printData, "total");
                        for(var ci=0;ci<detTRow.length;ci++){
                            var detTElem=detTRow[ci], value=null;                                                       //console.log("TemplateDocumentStandardTable.doPrint ",ri,ci,detTElem);
                            if (detTElem.print===false) continue;
                            if (detTElem.textbox) value=detTElem.textbox.value;
                            else if(detTElem.textDirNode) value=detTElem.textDirNode.textContent;//if element Select
                            this.addPrintDataSubItemTo(printData, "total", {width:detTElem.cellWidth+5, style:detTElem.printStyle, align:"right",
                                    contentStyle:"margin-top:3px;", label:detTElem.labelText, value:value, type:"text", valueStyle:detTElem.inputStyle});
                        }
                    }
                }
                this.setPrintDataFormats(printData, this.printFormats);
                var printWindow= window.open("/print/printSimpleDocument");                                             //console.log("doPrint printWindow printData=",printData);
                printWindow["printTableContentData"]= printData;

            }
        })
    });