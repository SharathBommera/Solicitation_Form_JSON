sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/m/MessageToast",
    "sap/m/Link"
], function (Controller, JSONModel, MessagePopover, MessageItem, MessageToast, Link) {
    "use strict";

    var oMessagePopover;

    return Controller.extend("solireq.solicitationreq.controller.solicitationDetails", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Routesolicitationrequestdetail").attachPatternMatched(this.onRouteMatched, this);

            var oLink = new Link({
                text: "Show more information",
                href: "http://sap.com",
                target: "_blank"
            });

            var oMessageTemplate = new MessageItem({
                type: '{messageModel>type}',
                title: '{messageModel>title}',
                activeTitle: "{messageModel>active}",
                description: '{messageModel>description}',
                subtitle: '{messageModel>subtitle}',
                counter: '{messageModel>counter}',
                link: oLink
            });

            oMessagePopover = new MessagePopover({
                items: {
                    path: 'messageModel>/',
                    template: oMessageTemplate
                },
                activeTitlePress: function () {
                    MessageToast.show('Active title is pressed');
                }
            });

            var oMessageModel = new JSONModel([]);
            this.getView().setModel(oMessageModel, "messageModel");
            this.byId("messagePopoverBtn").addDependent(oMessagePopover);
        },

        onRouteMatched: function (oEvent) {
            var sEntry = oEvent.getParameter("arguments").entryName;
            var oCompModel = this.getOwnerComponent().getModel("solireq");

            oCompModel.setProperty("/currentIndex", sEntry);

            if (sEntry === "new") {
                oCompModel.setProperty("/currentRow", {
                    outTitle: "", outDate: "", outType: "1", outNumber: "", outDueDate: "", outFrom: "", outDepartment: "DEV",
                    outMandatoryMeeting: 0, outWebex: false, outInPerson: false, outRoomReserved: 0, outLocation1: "", outDate1: "", outTime1: "", outZone: "PST/PDT", outJobsiteWalk: 0, outDate2: "", outTime2: "", outLocation2: "", outPpeRequired: 0, outSpecialInstr: "",
                    outCatEng: false, outCatIT: false, outCatMat: false, outCatConst: false, outCatProf: false, outCatOther: false, outCatOtherTxt: "",
                    outContractorReq: 0, outLicenseA: false, outLicenseB: false, outLicenseC: false, outLicenseCTxt: "", outLicenseC61: false, outLicenseC61Txt: "", outLicenseOther: false, outLicenseOtherTxt: "",
                    outBegin: "", outPrevailingWages: 0, outBidBond: 0, outEstValue: "0.00", outEnd: "",
                    outBudgetAppr: 0, outBudgetApprNo: "", outFundIID: false, outFundFed: false, outBuyAmerica: 0, outFundState: false, outFundOther: false, outFundOtherTxt: "",
                    outRegNERC: 0, outRegNERCTxt: "", outRegExec: 0, outRegExecTxt: "", outRegSenate: 0, outRegSenateTxt: "", outRegOther: ""
                });
                oCompModel.setProperty("/visibleEdit", false);
                oCompModel.setProperty("/enableButton1", false);
                oCompModel.setProperty("/enableButton2", true);
                oCompModel.setProperty("/editMode", true);
                
                oCompModel.setProperty("/manMeet", false);
                oCompModel.setProperty("/roomRes", false);
                oCompModel.setProperty("/speCon", false);
                oCompModel.setProperty("/limSpeClass", false);
                oCompModel.setProperty("/licenseOther", false);
                oCompModel.setProperty("/jobWalkReq", false);
                oCompModel.setProperty("/soliCatOther", false);
                oCompModel.setProperty("/contractorReq", false);
                oCompModel.setProperty("/fundOther", false);
                oCompModel.setProperty("/buyAmericaAct", false);
                oCompModel.setProperty("/budgetApprNo", true);
                oCompModel.setProperty("/regNERC", false);
                oCompModel.setProperty("/regExec", false);
                oCompModel.setProperty("/regSenate", false);
            } else {
                var aTable = oCompModel.getProperty("/Table");
                var oRow = aTable[parseInt(sEntry, 10)];
                oCompModel.setProperty("/currentRow", Object.assign({}, oRow));
                oCompModel.setProperty("/visibleEdit", true);
                oCompModel.setProperty("/enableButton1", true);
                oCompModel.setProperty("/enableButton2", false);
                oCompModel.setProperty("/editMode", false);

                oCompModel.setProperty("/manMeet", oRow.outMandatoryMeeting === 1);
                oCompModel.setProperty("/roomRes", oRow.outRoomReserved === 1);
                oCompModel.setProperty("/speCon", oRow.outLicenseC === 1);
                oCompModel.setProperty("/limSpeClass", oRow.outLicenseC61 === 1);
                oCompModel.setProperty("/licenseOther", oRow.outLicenseOther === 1);
                oCompModel.setProperty("/jobWalkReq", oRow.outJobsiteWalk === 1);
                oCompModel.setProperty("/contractorReq", oRow.outContractorReq === 1);
                oCompModel.setProperty("/buyAmericaAct", oRow.outBuyAmerica === 1);
                oCompModel.setProperty("/fundOther", oRow.outFundOther === 1);
                oCompModel.setProperty("/budgetApprNo", oRow.outBudgetAppr === 0);
                oCompModel.setProperty("/regNERC", oRow.outRegNERC === 1);
                oCompModel.setProperty("/regExec", oRow.outRegExec === 1);
                oCompModel.setProperty("/regSenate", oRow.outRegSenate === 1);
            }
            this.getView().getModel("messageModel").setData([]);
        },

        onEdit: function () {
            var oModel = this.getOwnerComponent().getModel("solireq");
            oModel.setProperty("/visibleEdit", false);
            oModel.setProperty("/enableButton1", false);
            oModel.setProperty("/enableButton2", true);
            oModel.setProperty("/editMode", true);
        },

        onSave: function () {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var oCurrentRow = oModel.getProperty("/currentRow");
            var aMessages = [];

            var aRequiredFields = [
                { field: "outTitle", name: "Solicitation Title" },
                { field: "outDate", name: "Date" },
                { field: "outType", name: "Solicitation Type" },
                { field: "outNumber", name: "Solicitation Number" },
                { field: "outDueDate", name: "Proposed Due Date" },
                { field: "outFrom", name: "From" },
                { field: "outDepartment", name: "Department" },
                { field: "outBegin", name: "Begin Date" },
                { field: "outEstValue", name: "Estimated Value" },
                { field: "outEnd", name: "End Date" }
            ];

            aRequiredFields.forEach(function (oReq) {
                if (!oCurrentRow[oReq.field]) {
                    aMessages.push({
                        type: 'Error',
                        title: 'Missing Required Field',
                        active: false,
                        description: 'Please provide a value for ' + oReq.name + '.',
                        subtitle: oReq.name,
                        counter: 1
                    });
                }
            });

            if (oModel.getProperty("/roomRes") && oModel.getProperty("/editMode") && !oCurrentRow.outLocation1) {
                aMessages.push({
                    type: 'Error',
                    title: 'Missing Required Field',
                    active: false,
                    description: 'Please provide a value for Location.',
                    subtitle: 'Location',
                    counter: 1
                });
            }

            if (oModel.getProperty("/jobWalkReq") && oModel.getProperty("/editMode") && !oCurrentRow.outLocation2) {
                aMessages.push({
                    type: 'Error',
                    title: 'Missing Required Field',
                    active: false,
                    description: 'Please provide a value for Location.',
                    subtitle: 'Location',
                    counter: 1
                });
            }

            if (oModel.getProperty("/jobWalkReq") && oModel.getProperty("/editMode") && !oCurrentRow.outDate2) {
                aMessages.push({
                    type: 'Error',
                    title: 'Missing Required Field',
                    active: false,
                    description: 'Please provide a value for Date.',
                    subtitle: 'Date',
                    counter: 1
                });
            }

            if (oModel.getProperty("/jobWalkReq") && oModel.getProperty("/editMode") && !oCurrentRow.outTime2) {
                aMessages.push({
                    type: 'Error',
                    title: 'Missing Required Field',
                    active: false,
                    description: 'Please provide a value for Time.',
                    subtitle: 'Time',
                    counter: 1
                });
            }

            if (oModel.getProperty("/soliCatOther") && oModel.getProperty("/editMode") && !oCurrentRow.outCatOtherTxt) {
                aMessages.push({
                    type: 'Error',
                    title: 'Missing Required Field',
                    active: false,
                    description: 'Please provide a value for Other Category.',
                    subtitle: 'Other Category',
                    counter: 1
                });
            }

            if(oModel.getProperty("/manMeet") && oModel.getProperty("/editMode") && oModel.getProperty("/currentRow/outMandatoryMeeting") === 1) {
                if (oCurrentRow.outWebex === false){
                        if(oCurrentRow.outInPerson === false){
                    aMessages.push({
                        type: 'Error',
                        title: 'Missing Required Field',
                        active: false,
                        description: 'Please select at least one option for Webex or In-Person.',
                        subtitle: 'Mandatory Meeting',
                        counter: 1
                    });
                }
                }
            }

            if(oModel.getProperty("/speCon") && oModel.getProperty("/editMode") && oModel.getProperty("/currentRow/outLicenseC") === true) {
                if (!oCurrentRow.outLicenseCTxt) {
                    aMessages.push({
                        type: 'Error',
                        title: 'Missing Required Field',
                        active: false,
                        description: 'Please provide a value for License C.',
                        subtitle: 'License C',
                        counter: 1
                    });
                }
            }

            if(oModel.getProperty("/limSpeClass") && oModel.getProperty("/editMode") && oModel.getProperty("/currentRow/outLicenseC61") === true) {
                if (!oCurrentRow.outLicenseC61Txt) {
                    aMessages.push({
                        type: 'Error',
                        title: 'Missing Required Field',
                        active: false,
                        description: 'Please provide a value for Limited Speciality Classification.',
                        subtitle: 'Limited Speciality Classification',
                        counter: 1
                    });
                }
            }

            if(oModel.getProperty("/licenseOther") && oModel.getProperty("/editMode") && oModel.getProperty("/currentRow/outLicenseOther") === true) {
                if (!oCurrentRow.outLicenseOtherTxt) {
                    aMessages.push({
                        type: 'Error',
                        title: 'Missing Required Field',
                        active: false,
                        description: 'Please provide a value for Other License.',
                        subtitle: 'Other License',
                        counter: 1
                    });
                }
            }

            if(oModel.getProperty("/buyAmericaAct") && oModel.getProperty("/editMode") && oModel.getProperty("/currentRow/outBuyAmericaAct") === true) {
                if (!oCurrentRow.outBuyAmericaActTxt) {
                    aMessages.push({
                        type: 'Error',
                        title: 'Missing Required Field',
                        active: false,
                        description: 'Please choose whether the Federal FUnding fall under the Buy America Act.',
                        subtitle: 'Buy America Act',
                        counter: 1
                    });
                }
            }

            if(oModel.getProperty("/fundOther") && oModel.getProperty("/editMode") && oModel.getProperty("/currentRow/outFundOther") === true) {
                if (!oCurrentRow.outFundOtherTxt) {
                    aMessages.push({
                        type: 'Error',
                        title: 'Missing Required Field',
                        active: false,
                        description: 'Please provide a value for Other Funding Sources.',
                        subtitle: 'Other Funding Sources',
                        counter: 1
                    });
                }
            }

            var oMessageModel = this.getView().getModel("messageModel");
            oMessageModel.setData(aMessages);

            if (aMessages.length > 0) {
                oMessagePopover.openBy(this.byId("messagePopoverBtn"));
                return;
            }

            var aTable = oModel.getProperty("/Table");
            var sIndex = oModel.getProperty("/currentIndex");
            var oSavedData = Object.assign({}, oCurrentRow);
            if (sIndex === "new") {
                aTable.push(oSavedData);
            } else {
                aTable[parseInt(sIndex, 10)] = oSavedData;
            }
            oModel.setProperty("/Table", aTable);
            oModel.setProperty("/visibleEdit", false);
            oModel.setProperty("/enableButton1", false);
            oModel.setProperty("/enableButton2", false);
            oModel.setProperty("/editMode", false);
            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequest");
        },

        onCancel: function () {
            var oModel = this.getOwnerComponent().getModel("solireq");
            oModel.setProperty("/editMode", false);
            this.getView().getModel("messageModel").setData([]);
            this.getOwnerComponent().getRouter().navTo("Routesolicitationrequest");
        },

        buttonTypeFormatter: function (aMessages) {
            aMessages = aMessages || [];
            var sHighestSeverityIcon;

            aMessages.forEach(function (oMessage) {
                switch (oMessage.type) {
                    case "Error":
                        sHighestSeverityIcon = "Negative";
                        break;
                    case "Warning":
                        sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" ? "Critical" : sHighestSeverityIcon;
                        break;
                    case "Success":
                        sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" && sHighestSeverityIcon !== "Critical" ? "Success" : sHighestSeverityIcon;
                        break;
                    default:
                        sHighestSeverityIcon = !sHighestSeverityIcon ? "Neutral" : sHighestSeverityIcon;
                        break;
                }
            });

            return sHighestSeverityIcon;
        },

        highestSeverityMessages: function (aMessages) {
            aMessages = aMessages || [];
            var sHighestSeverityIconType = this.buttonTypeFormatter(aMessages);
            var sHighestSeverityMessageType;

            switch (sHighestSeverityIconType) {
                case "Negative":
                    sHighestSeverityMessageType = "Error";
                    break;
                case "Critical":
                    sHighestSeverityMessageType = "Warning";
                    break;
                case "Success":
                    sHighestSeverityMessageType = "Success";
                    break;
                default:
                    sHighestSeverityMessageType = !sHighestSeverityMessageType ? "Information" : sHighestSeverityMessageType;
                    break;
            }

            return aMessages.reduce(function (iNumberOfMessages, oMessageItem) {
                return oMessageItem.type === sHighestSeverityMessageType ? ++iNumberOfMessages : iNumberOfMessages;
            }, 0);
        },

        buttonIconFormatter: function (aMessages) {
            aMessages = aMessages || [];
            var sIcon;

            aMessages.forEach(function (oMessage) {
                switch (oMessage.type) {
                    case "Error":
                        sIcon = "sap-icon://error";
                        break;
                    case "Warning":
                        sIcon = sIcon !== "sap-icon://error" ? "sap-icon://alert" : sIcon;
                        break;
                    case "Success":
                        sIcon = sIcon !== "sap-icon://error" && sIcon !== "sap-icon://alert" ? "sap-icon://sys-enter-2" : sIcon;
                        break;
                    default:
                        sIcon = !sIcon ? "sap-icon://information" : sIcon;
                        break;
                }
            });

            return sIcon;
        },

        handleMessagePopoverPress: function (oEvent) {
            oMessagePopover.toggle(oEvent.getSource());
        },

        onMandatoryMeetingSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/manMeet", iSelected === 1);
        },

        onRoomReservedSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/roomRes", iSelected === 1);
        },

        onSoliCatOtherSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var bSelected = oEvent.getParameter("selected");
            oModel.setProperty("/soliCatOther", bSelected);
        },

        onJobsiteWalkSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/jobWalkReq", iSelected === 1);
        },

        onContractorSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/contractorReq", iSelected === 1);
        },

        onSpecialityContractorSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var bSelected = oEvent.getParameter("selected");
            oModel.setProperty("/speCon", bSelected);
        },

        onLimitedSpecialityClassificationSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var bSelected = oEvent.getParameter("selected");
            oModel.setProperty("/limSpeClass", bSelected);
        },

        onBudgetApprSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/budgetApprNo", iSelected === 0);
        },

        onOtherLicenseSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var bSelected = oEvent.getParameter("selected");
            oModel.setProperty("/licenseOther", bSelected);
        },

        onNercSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/regNERC", iSelected === 1);
        },

        onExecSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/regExec", iSelected === 1);
        },
        
        onFundFedSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var bSelected = oEvent.getParameter("selected");
            oModel.setProperty("/buyAmericaAct", bSelected);
        },
        onFundOtherSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var bSelected = oEvent.getParameter("selected");
            oModel.setProperty("/fundOther", bSelected);
        },

        onSenateSelect: function (oEvent) {
            var oModel = this.getOwnerComponent().getModel("solireq");
            var iSelected = oEvent.getParameter("selectedIndex");
            oModel.setProperty("/regSenate", iSelected === 1);
        }
    });
});