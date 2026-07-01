sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("solireq.solicitationreq.controller.solicitationrequest", {

        onInit() {
            var oData = {
                Table: [
                    { 
                        outTitle: "Solicitation 1", outDate: new Date(1999, 8, 9), outType: "2", outNumber: "1", outDueDate: new Date(2004, 1, 6), outFrom: "PBC", outDepartment: "DEV",
                        outMandatoryMeeting: 0, outWebex: false, outInPerson: false, outRoomReserved: 0, outLocation1: "", outDate1: "", outTime1: "", outZone: "PST/PDT", outJobsiteWalk: 0, outDate2: "", outTime2: "", outLocation2: "", outPpeRequired: 0, outSpecialInstr: "",
                        outCatEng: false, outCatIT: false, outCatMat: false, outCatConst: false, outCatProf: false, outCatOther: false, outCatOtherTxt: "",
                        outContractorReq: 0, outLicenseA: false, outLicenseB: false, outLicenseC: false, outLicenseCTxt: "", outLicenseC61: false, outLicenseC61Txt: "", outLicenseOther: false, outLicenseOtherTxt: "",
                        outBegin: new Date(2024, 1, 1), outPrevailingWages: 0, outBidBond: 0, outEstValue: "0.00", outEnd: new Date(2025, 1, 1),
                        outBudgetAppr: 0, outBudgetApprNo: "", outFundIID: false, outFundFed: false, outBuyAmerica: 0, outFundState: false, outFundOther: false, outFundOtherTxt: "",
                        outRegNERC: 0, outRegNERCTxt: "", outRegExec: 0, outRegExecTxt: "", outRegSenate: 0, outRegSenateTxt: "", outRegOther: ""
                    }
                ],
                visibleEdit: false,
                enableButton1: false,
                enableButton2: false,
                editMode: false,
                manMeet: false,
                roomRes:false,
                speCon: false,
                limSpeClass: false,
                licenseOther:false,
                buyAmericaAct: false,
                soliCatOther: false,
                jobWalkReq: false,
                fundOther:false,
                contractorReq: false,
                budgetApprNo: true,
                regNERC: false,
                regExec: false,
                regSenate: false,
                currentRow: {}
            };
            var oComponent = this.getOwnerComponent();
            if (!oComponent.getModel("solireq")) {
                oComponent.setModel(new JSONModel(oData), "solireq");
            }
            else {
                var oDataModel = new sap.ui.model.odata.ODataModel('/sap/opu/odata/sap/ZGW_20398_SR_ODATA_SRV/', true);
                
            }
        },

        onRowPress(oEvent) {
            var oContext = oEvent.getParameter("listItem").getBindingContext("solireq");
            var sIndex = oContext.getPath().split("/").pop();
            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequestdetail", {
                entryName: sIndex,
                "?query": { Number: oContext.getProperty("outNumber") }
            });
        },

        onAddNewEntry() {
            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequestdetail", {
                entryName: "new",
                "?query": { Number: "new" }
            });
        }
    });
});

