sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("solireq.solicitationreq.controller.solicitationrequest", {
        // Initially loaded function
        onInit: function () {
            // Data Object - deleteEnabled is used to enable/disable the delete button based on selection
            // Create a JSON model to hold the deleteEnabled property, initially set to false
            var oViewModel = new JSONModel({ deleteEnabled: false });
            // Set the JSON model to the current view with the name "oreqData"
            this.getView().setModel(oViewModel, "oreqData");

            // oTable is the reference by Id to the data table in the current view.
            var oTable = this.byId("dataTable");
            // Get the selected item from the table
            var oSelectedItem = oTable.getSelectedItem();
            // If and only if an item is selected, set the deleteEnabled property to true in the oreqData model
            if (oSelectedItem) {
                this.getView().getModel("oreqData").setProperty("/deleteEnabled", true);
            }
        },

        // Event handler for the row press event of the SR table.
        // oEvent is the event object that contains information about the row that was pressed.
        onRowPress: function (oEvent) {
            // oContext contains the path(sPath:"/Table/0") for the listItem is the row that was pressed, and getBindingContext("srODataModel") gets the binding context of that row in the "srODataModel" model.
            //c var oContext = oEvent.getParameter("listItem").getBindingContext("srODataModel");
            // From the binding context, get the property "SId"(primary key of the Z20398_T_SRBASIC table) and since the type is string trim the trailing and leading spaces and store it in the variable sId.
            //c var sId = oContext.getProperty("SId").trim(); //SId = "1"
            // From the owner component, get the router and navigate to the "Routesolicitationrequestdetail" route which is the details view of that particular row and pass the SId as a parameter to the route.
            var sId = oEvent.getParameter("listItem").getBindingContext("srODataModel").sPath.split("('").pop().split("'")[0];
            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequestdetail", {
                entryName: sId
            });
        },
        // Post event triggered path sDeepPath: "/srbasicSet('1')" sPath: "/srbasicSet('1')"

        // Event handler for the "Add New Entry" button press event.
        onAddNewEntry: function (oEvent) {
            // From the owner component, get the  router and navigate to the "Routesolicitationrequestdetail" route which is the details view of the "new" entry, which is an empty form.
            // Both the "onRowPress" and "onAddNewEntry" functions navigate to the same route, but with different parameters. 
            // Based on the parameters passed, the details view(form page) will handle the display.
            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequestdetail", {
                entryName: "new"
            });
        },
        // Post event triggered path sDeepPath: "/srbasicSet('new')" sPath: "/srbasicSet('new')"

        // Event handler for the selection change of the SR table. (mode - SingleSelectLeft)
        // oEvent is the event object that contains information about the selection change in the table.
        onSelectionChange: function (oEvent) {
            // oTable is the reference to the table that triggered the selection change event.
            //c var oTable = oEvent.getSource(); // _aSelectedPaths: ["/srbasicSet('1')"]
            // oSelectedItem is the currently selected item in the table after the selection change event.
            //c var oSelectedItem = oTable.getSelectedItem();
            var oSelectedItem = oEvent.oSource._oSelectedItem;
            // If an item is selected, enable the delete button.
            if (oSelectedItem) {
                this.getView().getModel("oreqData").setProperty("/deleteEnabled", true);
            } else {
                this.getView().getModel("oreqData").setProperty("/deleteEnabled", false);
            }

            // On reselecting selected radio button, it should get unselected and delete button should get disabled. 
            // If the selected item is the same as the previously selected item, deselect it and disable the delete button.
        },

        // Event handler for the "Delete Entry" button press event.
        onDeleteEntry: function () {
            // oTable is the reference by Id to the data table("dataTable") in the current view.
            var oTable = this.byId("dataTable");
            // oSelectedItem is the currently selected item in the table that is to be deleted.
            var oSelectedItem = oTable.getSelectedItem(); // _aSelectedPaths: ["/srbasicSet('2')"]
            // oContext is the binding context of the selected item in the "srODataModel" model.
            var oContext = oSelectedItem.getBindingContext("srODataModel");
            // From the binding context, get the property "SId"(primary key of the Z20398_T_SRBASIC table) and since the type is string trim the trailing and leading spaces and store it in the variable sId.
            var sId = oContext.getProperty("SId").trim(); //SId = "2"
            // Construct the path to the entry yo be deleted in the OData model using the SId. 
            var sPath = "/srbasicSet('" + sId + "')"; //sPath:"/srbasicSet('2')"
            // Store the reference to the "current controller instance" in the variable "that" to be used inside the success and error callback functions.
            var that = this;

            // Calling remove method with parameters path, success scenario and error scenario.
            oContext.getModel().remove(sPath, { // sPath: "/srbasicSet('2')"
                // Success: 
                success: function () {
                    MessageToast.show("Entry deleted successfully.");
                    // Remove the selected item from the table.
                    oTable.removeItem(oSelectedItem);
                    // Disable the delete button after successful deletion.
                    that.getView().getModel("oreqData").setProperty("/deleteEnabled", false);
                },
                // Error: If deletion fails then enter this block.
                error: function () {
                    MessageToast.show("Failed to delete entry.");
                }
            });
        }
    });
});