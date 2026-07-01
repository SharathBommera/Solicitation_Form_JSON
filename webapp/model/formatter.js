sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    return {

        formatDate: function (oDate) {
            if (!oDate) {
                return "";
            }
            var oDateTimeInstance = DateFormat.getDateInstance({
                pattern: "MM/dd/yyyy"
            });
            return oDateTimeInstance.format(new Date(oDate));
        }
    };
});