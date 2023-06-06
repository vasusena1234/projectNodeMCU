sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("notification.app.controller.View1", {
            onInit: function () {
               var data={
                 "sales": [
                  {
                    "SensorID": 101,
                    "SalesOrg": "SAP",
                    "SalesOrder": "Sales_order_1",
                    "OrderOverallStatus": "out_for_delivery",
                    "DeliveryStatus":"on_the_road",
                    "Rejection":"Not_rejected",
                    "Date":"2023-05-26",
                    "Time":"2023-06-22"
                  }
                ]}; 
                var oModel = new JSONModel(data);
               this.getView().setModel(oModel,"notification");
                this.fetchData();
            },
            onPress : function (oEvent) {
              var oRow = oEvent.getSource();
              var oBindingContext = oRow.getBindingContext("notification");
              var sSensorId = oBindingContext.getProperty("SensorID");

              this.openDialog(sSensorId);
             },
            openDialog: function(sSensorId) {
              var oView = this.getView();
              var oDialog = sap.ui.xmlfragment(oView.getId(), "notification.app.view.Dialog", this);
               var oDialogModel = new sap.ui.model.json.JSONModel({ SensorID: sSensorId });
              oDialog.setModel(oDialogModel, "dialog");
              //oDialog.getModel("notification").setProperty("/SensorID", sSensorId);
              var oCloseButton = new sap.m.Button({
                text: "Close",
                press: function() {
                  oDialog.close();
                }
              });
              oDialog.setEndButton(oCloseButton);
            
              oDialog.attachAfterClose(function() {
                oDialog.destroy();
              });
              oDialog.open();
              
            },

            fetchData: function() {
                var that = this;
                jQuery.ajax({
                  url: "https://port5000-workspaces-ws-2h5xc.us10.trial.applicationstudio.cloud.sap/salesData",
                  //headers: {'Access-Control-Allow-Origin': "*"},
                  method: "GET",
                  dataType: "json",
                  //contentType: "application/json",
                  success: function(data) {
                    //that.getView().getModel().setData(data);
                    var oModel = that.getView().getModel("notification");
                      oModel.setData(data);
                  },
                  error: function(errorData) {
                    console.log(errorData)
                    MessageToast.show("Failed to fetch data from the API.");
                  }
                });
            } 
        });
    });
