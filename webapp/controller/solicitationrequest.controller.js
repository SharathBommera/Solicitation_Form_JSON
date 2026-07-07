sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("solireq.solicitationreq.controller.solicitationrequest", {

        onInit: function () {
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
        }
    });
});