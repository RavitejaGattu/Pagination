sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sap.btp.sapui5.controller.View1", {
            onInit: function () {
                var top = 10, skip = 0;
                this.oDataModel = this.getOwnerComponent().getModel("Northwind");
                // this.oCAPMModel = new sap.ui.model.odata.v2.ODataModel("/v2/service/Books"); 
                // this.oCAPMModel = this.getOwnerComponent().getModel("CAPM");
                this.getData(top, skip);
            },
            getData: function(top, skip){
                var oView = this.getView();
                oView.setBusy(true);
                this.oDataModel.read("/Products", {
                    urlParameters: "$top=" + top + "&$skip=" + skip + "&$inlinecount=allpages",
                    success: function(oData){
                        oView.setBusy(false);
                        let iTotalCount = oData.__count;
                        let iSubstr = iTotalCount.length - 1;
                        this.skip = skip;
                        if(skip === 0){
                            oView.byId("idPrevious").setEnabled(false);
                        } else {
                            oView.byId("idPrevious").setEnabled(true);
                        }
                        if(skip.toString().substr(0, iSubstr) === iTotalCount.substr(0, iSubstr)){
                            oView.byId("idNext").setEnabled(false);
                        } else {
                            oView.byId("idNext").setEnabled(true);
                        }
                        var oModel = new sap.ui.model.json.JSONModel([]);
                        oModel.setData(oData.results);
                        this.getOwnerComponent().setModel(oModel, "NorthwindModel");
                    }.bind(this),
                    error: function(oError){
                        oView.setBusy(false);
                        console.log(oError);
                    }.bind(this)
                });
                /*  var aData = jQuery.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/V2/Northwind/Northwind.svc/Products?$top="+top+"&$skip="+skip+"&$inlinecount=allpages",
                    // data: {
                    //   $top: top,
                    //   $skip: skip
                    // },
                    dataType: "json",
                    async: false,
                    success: function(data, textStatus, jqXHR) {
                        oView.setBusy(false);
                        let iTotalCount = data.d.__count;
                        let iSubstr = iTotalCount.length - 1;
                        this.skip = skip;
                        if(skip === 0){
                            oView.byId("idPrevious").setEnabled(false);
                        } else {
                            oView.byId("idPrevious").setEnabled(true);
                        }
                        if(skip.toString().substr(0, iSubstr) === iTotalCount.substr(0, iSubstr)){
                            oView.byId("idNext").setEnabled(false);
                        } else {
                            oView.byId("idNext").setEnabled(true);
                        }
                        var oModel = new sap.ui.model.json.JSONModel([]);
                        oModel.setData(data.d.results);
                        this.getOwnerComponent().setModel(oModel, "NorthwindModel");
                    }.bind(this),
                    error: function(error){
                        oView.setBusy(false);
                        console.log(error);
                    }.bind(this)
                 });*/
            },
            onReload:function(){
                this.getData(10, 0);
            },
            handleListItemPress: function(oEvent){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // var sSelectedProductID = oEvent.getSource().getBindingContext("NorthwindModel").getProperty("ProductID");
                var sSelectedProductPath = oEvent.getSource().getBindingContext("NorthwindModel").getPath().substr("1");
                oRouter.navTo("detail",{
                    path: sSelectedProductPath
                });
            },
            handleSearch: function(oEvent){
                var sProductName = oEvent;
            },
            onPrevious: function(){
                this.skip -= 10;
                this.getData(10, this.skip);
            },
            onNext: function(){
                this.skip += 10;
                this.getData(10, this.skip);
            }
        });
    });
