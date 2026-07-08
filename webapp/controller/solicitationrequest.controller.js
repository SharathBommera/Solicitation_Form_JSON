sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("solireq.solicitationreq.controller.solicitationrequest", {

        onInit: function () {
            var oViewModel = new JSONModel({ deleteEnabled: false });
            this.getView().setModel(oViewModel, "oreqData");

            var oTable = this.byId("dataTable");
            var oSelectedItem = oTable.getSelectedItem();
            if (oSelectedItem) {
                this.getView().getModel("oreqData").setProperty("/deleteEnabled", true);
            }
        },

        onRowPress: function (oEvent) {
            var oContext = oEvent.getParameter("listItem").getBindingContext("srODataModel");
            var sId = oContext.getProperty("SId").trim();

            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequestdetail", {
                entryName: sId
            });
        },

        onAddNewEntry: function () {
            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequestdetail", {
                entryName: "new"
            });
        },

        onSelectionChange: function (oEvent) {
            var oTable = oEvent.getSource();
            var oSelectedItem = oTable.getSelectedItem();
            if (oSelectedItem) {
                this.getView().getModel("oreqData").setProperty("/deleteEnabled", true);
            } else {
                this.getView().getModel("oreqData").setProperty("/deleteEnabled", false);
            }
        },

        onDeleteEntry: function () {
            var oTable = this.byId("dataTable");
            var oSelectedItem = oTable.getSelectedItem();
            var oContext = oSelectedItem.getBindingContext("srODataModel");
            var sId = oContext.getProperty("SId").trim();
            var sPath = "/srbasicSet('" + sId + "')";
            var that = this;

            oContext.getModel().remove(sPath, {
                success: function () {
                    sap.m.MessageToast.show("Entry deleted successfully.");
                    oTable.removeItem(oSelectedItem);
                    that.getView().getModel("oreqData").setProperty("/deleteEnabled", false);
                },
                error: function () {
                    sap.m.MessageToast.show("Failed to delete entry.");
                }
            });
        }
    });
});