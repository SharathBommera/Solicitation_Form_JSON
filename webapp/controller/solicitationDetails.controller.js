sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/m/MessageToast",
    "sap/m/Link",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

], (Controller, JSONModel, MessagePopover, MessageItem, MessageToast, Link, Fragment, Filter, FilterOperator) => {
    "use strict";

    var oMessagePopover;

    return Controller.extend("solireq.solicitationreq.controller.solicitationDetails", {
        onInit() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Routesolicitationrequestdetail").attachPatternMatched(this.onObjectMatched, this);

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

            var oViewModel = new JSONModel({
                visibleEdit: true,
                enableButton1: false,
                enableButton2: false,
                editMode: false,
                manMeet: false,
                roomRes: false,
                speCon: false,
                limSpeClass: false,
                licenseOther: false,
                buyAmericaAct: false,
                soliCatOther: false,
                jobWalkReq: false,
                fundOther: false,
                contractorReq: false,
                budgetApprNo: false,
                regNERC: false,
                regExec: false,
                regSenate: false,
                currentId: "",
                currentRow: {},
                originalRow: {}
            });
            this.getView().setModel(oViewModel, "solireq");
        },

        onObjectMatched(oEvent) {
            var sId = oEvent.getParameter("arguments").entryName;
            var oViewModel = this.getView().getModel("solireq");

            oViewModel.setProperty("/currentId", sId);
            this.getView().getModel("messageModel").setData([]);

            if (sId !== "new") {
                oViewModel.setProperty("/visibleEdit", true);
                oViewModel.setProperty("/enableButton1", true);
                oViewModel.setProperty("/enableButton2", false);
                oViewModel.setProperty("/editMode", false);
                this.fetchExpandedOData(sId);
            } else {
                oViewModel.setProperty("/currentRow", {
                    outTitle: "", outDate: null, outType: "", outNumber: "", outDueDate: null, outFrom: "", outDepartment: "",
                    outMeetId: "", outCatId: "", outLicId: "", outProjId: "", outFundId: "", outRegId: "",
                    outMandatoryMeeting: 0, outWebex: false, outInPerson: false, outRoomReserved: 0, outLocation1: "", outDate1: null, outTime1: null, outZone: "", outJobsiteWalk: 0, outDate2: null, outTime2: null, outLocation2: "", outPpeRequired: 0, outSpecialInstr: "",
                    outCatEng: false, outCatIT: false, outCatMat: false, outCatConst: false, outCatProf: false, outCatOther: false, outCatOtherTxt: "",
                    outContractorReq: 0, outLicenseA: false, outLicenseB: false, outLicenseC: false, outLicenseCTxt: "", outLicenseC61: false, outLicenseC61Txt: "", outLicenseOther: false, outLicenseOtherTxt: "",
                    outBegin: null, outPrevailingWages: 0, outBidBond: 0, outEstValue: "", outEnd: null,
                    outBudgetAppr: 0, outBudgetApprNo: "", outFundIID: false, outFundFed: false, outBuyAmerica: 0, outFundState: false, outFundOther: false, outFundOtherTxt: "",
                    outRegNERC: 0, outRegNERCTxt: "", outRegExec: 0, outRegExecTxt: "", outRegSenate: 0, outRegSenateTxt: "", outRegOther: "",
                    ToSrContacts: this._normalizeContacts([]),
                    ToSrApproval: []
                });
                oViewModel.setProperty("/originalRow", {});

                oViewModel.setProperty("/manMeet", false);
                oViewModel.setProperty("/roomRes", false);
                oViewModel.setProperty("/speCon", false);
                oViewModel.setProperty("/limSpeClass", false);
                oViewModel.setProperty("/licenseOther", false);
                oViewModel.setProperty("/jobWalkReq", false);
                oViewModel.setProperty("/contractorReq", false);
                oViewModel.setProperty("/buyAmericaAct", false);
                oViewModel.setProperty("/fundOther", false);
                oViewModel.setProperty("/budgetApprNo", false);
                oViewModel.setProperty("/regNERC", false);
                oViewModel.setProperty("/regExec", false);
                oViewModel.setProperty("/regSenate", false);
                oViewModel.setProperty("/soliCatOther", false);

                oViewModel.setProperty("/visibleEdit", false);
                oViewModel.setProperty("/enableButton1", false);
                oViewModel.setProperty("/enableButton2", true);
                oViewModel.setProperty("/editMode", true);
            }
        },

        fetchExpandedOData(sId) {
            var oODataModel = this.getOwnerComponent().getModel("srODataModel");
            var sPath = `/srbasicSet('${sId}')`;

            var oViewModel = this.getView().getModel("solireq");

            oODataModel.read(sPath, {
                urlParameters: {
                    "$expand": "ToSrMeet,ToSrType,ToSrDept,ToSrCategory,ToSrLicense,ToSrProjectdet,ToSrFund,ToSrRegulatory,ToSrContacts,ToSrApproval"
                },
                success: function (oData) {
                    var oMappedData = {
                        outTitle: oData.SBTitle,
                        outDate: oData.SBDate,
                        outType: oData.SBTypeId || "",
                        outNumber: oData.SBNumber,
                        outDueDate: oData.SBProposedduedate,
                        outFrom: oData.SBFromId,
                        outDepartment: oData.SBDeptId || "",

                        outMeetId: oData.ToSrMeet ? oData.ToSrMeet.SMmId : "",
                        outCatId: oData.ToSrCategory ? oData.ToSrCategory.SCategoryId : "",
                        outLicId: oData.ToSrLicense ? oData.ToSrLicense.SClId : "",
                        outProjId: oData.ToSrProjectdet ? oData.ToSrProjectdet.SPdId : "",
                        outFundId: oData.ToSrFund ? oData.ToSrFund.SFsId : "",
                        outRegId: oData.ToSrRegulatory ? oData.ToSrRegulatory.SRId : "",

                        outMandatoryMeeting: oData.ToSrMeet && oData.ToSrMeet.SMandatorymeeting === "Y" ? 1 : 0,
                        outWebex: oData.ToSrMeet ? oData.ToSrMeet.SMmWebex === "Y" : false,
                        outInPerson: oData.ToSrMeet ? oData.ToSrMeet.SMmInperson === "Y" : false,
                        outRoomReserved: oData.ToSrMeet && oData.ToSrMeet.SMmRoomreserved === "Y" ? 1 : 0,
                        outLocation1: oData.ToSrMeet ? oData.ToSrMeet.SMmRoomlocation : "",
                        outDate1: oData.ToSrMeet ? oData.ToSrMeet.SMmProposeddate : null,
                        outTime1: oData.ToSrMeet ? oData.ToSrMeet.SMmTime : null,
                        outZone: oData.ToSrMeet ? oData.ToSrMeet.SMmZone : "",
                        outJobsiteWalk: oData.ToSrMeet && oData.ToSrMeet.SMmJobsitewalk === "Y" ? 1 : 0,
                        outDate2: oData.ToSrMeet ? oData.ToSrMeet.SMmJwProposeddate : null,
                        outTime2: oData.ToSrMeet ? oData.ToSrMeet.SMmJwTime : null,
                        outLocation2: oData.ToSrMeet ? oData.ToSrMeet.SMmJwLocation : "",
                        outPpeRequired: oData.ToSrMeet && oData.ToSrMeet.SMmPpe === "Y" ? 1 : 0,
                        outSpecialInstr: oData.ToSrMeet ? oData.ToSrMeet.SMmSpecialinstructions : "",

                        outCatEng: oData.ToSrCategory ? oData.ToSrCategory.SCEngineeringservices === "Y" : false,
                        outCatIT: oData.ToSrCategory ? oData.ToSrCategory.SCItOt === "Y" : false,
                        outCatMat: oData.ToSrCategory ? oData.ToSrCategory.SCMaterials === "Y" : false,
                        outCatConst: oData.ToSrCategory ? oData.ToSrCategory.SCConstruction === "Y" : false,
                        outCatProf: oData.ToSrCategory ? oData.ToSrCategory.SCProfessional === "Y" : false,
                        outCatOther: oData.ToSrCategory ? oData.ToSrCategory.SCOther === "Y" : false,
                        outCatOtherTxt: oData.ToSrCategory ? oData.ToSrCategory.SCOtherDescription : "",

                        outContractorReq: oData.ToSrLicense && oData.ToSrLicense.SClRequired === "Y" ? 1 : 0,
                        outLicenseA: oData.ToSrLicense ? oData.ToSrLicense.SClAGec === "Y" : false,
                        outLicenseB: oData.ToSrLicense ? oData.ToSrLicense.SClBGbc === "Y" : false,
                        outLicenseC: oData.ToSrLicense ? oData.ToSrLicense.SClCSc === "Y" : false,
                        outLicenseCTxt: oData.ToSrLicense ? oData.ToSrLicense.SClCScNumber : "",
                        outLicenseC61: oData.ToSrLicense ? oData.ToSrLicense.SClC61Lsc === "Y" : false,
                        outLicenseC61Txt: oData.ToSrLicense ? oData.ToSrLicense.SClC61LscNumber : "",
                        outLicenseOther: oData.ToSrLicense ? oData.ToSrLicense.SClOther === "Y" : false,
                        outLicenseOtherTxt: oData.ToSrLicense ? oData.ToSrLicense.SClOtherDescription : "",

                        outBegin: oData.ToSrProjectdet ? oData.ToSrProjectdet.SPdBegindate : null,
                        outPrevailingWages: oData.ToSrProjectdet && oData.ToSrProjectdet.SPdWages === "Y" ? 1 : 0,
                        outBidBond: oData.ToSrProjectdet && oData.ToSrProjectdet.SPdBidbond === "Y" ? 1 : 0,
                        outEstValue: oData.ToSrProjectdet ? oData.ToSrProjectdet.SPdContractvalue : "0.00",
                        outEnd: oData.ToSrProjectdet ? oData.ToSrProjectdet.SPdEnddate : null,

                        outBudgetAppr: oData.ToSrFund && oData.ToSrFund.SFsApproved === "Y" ? 1 : 0,
                        outBudgetApprNo: oData.ToSrFund ? oData.ToSrFund.SFsNoClarify : "",
                        outFundIID: oData.ToSrFund ? oData.ToSrFund.SFsIid === "Y" : false,
                        outFundFed: oData.ToSrFund ? oData.ToSrFund.SFsFederal === "Y" : false,
                        outBuyAmerica: oData.ToSrFund && oData.ToSrFund.SFsBuyamericaact === "Y" ? 1 : 0,
                        outFundState: oData.ToSrFund ? oData.ToSrFund.SFsStatecalifornia === "Y" : false,
                        outFundOther: oData.ToSrFund ? oData.ToSrFund.SFsOthersources === "Y" : false,
                        outFundOtherTxt: oData.ToSrFund ? oData.ToSrFund.SFsOtherDescription : "",

                        outRegNERC: oData.ToSrRegulatory && oData.ToSrRegulatory.SRNerc === "Y" ? 1 : 0,
                        outRegNERCTxt: oData.ToSrRegulatory ? oData.ToSrRegulatory.SRNercCertnumber : "",
                        outRegExec: oData.ToSrRegulatory && oData.ToSrRegulatory.SRExeorder === "Y" ? 1 : 0,
                        outRegExecTxt: oData.ToSrRegulatory ? oData.ToSrRegulatory.SRExeorderNumber : "",
                        outRegSenate: oData.ToSrRegulatory && oData.ToSrRegulatory.SRSenatebill === "Y" ? 1 : 0,
                        outRegSenateTxt: oData.ToSrRegulatory ? oData.ToSrRegulatory.SRSenatebillNumber : "",
                        outRegOther: oData.ToSrRegulatory ? oData.ToSrRegulatory.SRSpecialreq : "",

                        ToSrContacts: (oData.ToSrContacts && oData.ToSrContacts.results) ? oData.ToSrContacts.results : [],
                        ToSrApproval: (oData.ToSrApproval && oData.ToSrApproval.results) ? oData.ToSrApproval.results : []
                    };

                    oViewModel.setProperty("/currentRow", oMappedData);
                    oViewModel.setProperty("/originalRow", JSON.parse(JSON.stringify(oMappedData)));

                    oViewModel.setProperty("/manMeet", oMappedData.outMandatoryMeeting === 1);
                    oViewModel.setProperty("/roomRes", oMappedData.outRoomReserved === 1);
                    oViewModel.setProperty("/jobWalkReq", oMappedData.outJobsiteWalk === 1);
                    oViewModel.setProperty("/contractorReq", oMappedData.outContractorReq === 1);
                    oViewModel.setProperty("/speCon", oMappedData.outLicenseC);
                    oViewModel.setProperty("/limSpeClass", oMappedData.outLicenseC61);
                    oViewModel.setProperty("/licenseOther", oMappedData.outLicenseOther);
                    oViewModel.setProperty("/soliCatOther", oMappedData.outCatOther);
                    oViewModel.setProperty("/budgetApprNo", oMappedData.outBudgetAppr === 0);
                    oViewModel.setProperty("/buyAmericaAct", oMappedData.outFundFed);
                    oViewModel.setProperty("/fundOther", oMappedData.outFundOther);
                    oViewModel.setProperty("/regNERC", oMappedData.outRegNERC === 1);
                    oViewModel.setProperty("/regExec", oMappedData.outRegExec === 1);
                    oViewModel.setProperty("/regSenate", oMappedData.outRegSenate === 1);
                },
                error: function (err) {
                    MessageToast.show("Failed to retrieve data.");
                }
            });
        },

        onEdit() {
            var oViewModel = this.getView().getModel("solireq");
            oViewModel.setProperty("/editMode", true);
            oViewModel.setProperty("/visibleEdit", false);
            oViewModel.setProperty("/enableButton1", false);
            oViewModel.setProperty("/enableButton2", true);
        },

        onCancel() {
            var oViewModel = this.getView().getModel("solireq");
            var sId = oViewModel.getProperty("/currentId");
            this.getView().getModel("messageModel").setData([]);

            if (sId === "new") {
                this.getOwnerComponent().getRouter().navTo("Routesolicitationrequest");
            } else {
                var oOriginalRow = oViewModel.getProperty("/originalRow");
                oViewModel.setProperty("/currentRow", JSON.parse(JSON.stringify(oOriginalRow)));

                oViewModel.setProperty("/editMode", false);
                oViewModel.setProperty("/visibleEdit", true);
                oViewModel.setProperty("/enableButton1", true);
                oViewModel.setProperty("/enableButton2", false);
            }
        },

        onSave() {
            var oViewModel = this.getView().getModel("solireq");
            var oCurrentRow = oViewModel.getProperty("/currentRow");
            var sId = oViewModel.getProperty("/currentId");
            var oODataModel = this.getOwnerComponent().getModel("srODataModel");
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

            if (oViewModel.getProperty("/roomRes") && !oCurrentRow.outLocation1) {
                aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Location.', subtitle: 'Location' });
            }

            if (oViewModel.getProperty("/jobWalkReq")) {
                if (!oCurrentRow.outLocation2) aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Job Walk Location.', subtitle: 'Location' });
                if (!oCurrentRow.outDate2) aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Job Walk Date.', subtitle: 'Date' });
                if (!oCurrentRow.outTime2) aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Job Walk Time.', subtitle: 'Time' });
            }

            if (oViewModel.getProperty("/soliCatOther") && !oCurrentRow.outCatOtherTxt) {
                aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Other Category.', subtitle: 'Other Category' });
            }

            if (oViewModel.getProperty("/manMeet") && !oCurrentRow.outWebex && !oCurrentRow.outInPerson) {
                aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please select at least one option for Webex or In-Person.', subtitle: 'Mandatory Meeting' });
            }

            if (oViewModel.getProperty("/speCon") && !oCurrentRow.outLicenseCTxt) {
                aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for License C.', subtitle: 'License C' });
            }

            if (oViewModel.getProperty("/limSpeClass") && !oCurrentRow.outLicenseC61Txt) {
                aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Limited Speciality Classification.', subtitle: 'Limited Speciality Classification' });
            }

            if (oViewModel.getProperty("/licenseOther") && !oCurrentRow.outLicenseOtherTxt) {
                aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Other License.', subtitle: 'Other License' });
            }

            if (oViewModel.getProperty("/fundOther") && !oCurrentRow.outFundOtherTxt) {
                aMessages.push({ type: 'Error', title: 'Missing Required Field', description: 'Please provide a value for Other Funding Sources.', subtitle: 'Other Funding Sources' });
            }

            var oMessageModel = this.getView().getModel("messageModel");
            oMessageModel.setData(aMessages);

            if (aMessages.length > 0) {
                oMessagePopover.openBy(this.byId("messagePopoverBtn"));
                return;
            }

            var oPayload = {
                SId: sId === "new" ? "new" : sId,
                SBTitle: oCurrentRow.outTitle || "",
                SBDate: oCurrentRow.outDate || null,
                SBTypeId: oCurrentRow.outType || "",
                SBNumber: oCurrentRow.outNumber || "",
                SBProposedduedate: oCurrentRow.outDueDate || null,
                SBFromId: oCurrentRow.outFrom || "",
                SBDeptId: oCurrentRow.outDepartment || "",
                ToSrMeet: {
                    SMmId: oCurrentRow.outMeetId || "",
                    SMandatorymeeting: oCurrentRow.outMandatoryMeeting === 1 ? "Y" : "N",
                    SMmWebex: oCurrentRow.outWebex ? "Y" : "N",
                    SMmInperson: oCurrentRow.outInPerson ? "Y" : "N",
                    SMmRoomreserved: oCurrentRow.outRoomReserved === 1 ? "Y" : "N",
                    SMmRoomlocation: oCurrentRow.outLocation1 || "",
                    SMmJobsitewalk: oCurrentRow.outJobsiteWalk === 1 ? "Y" : "N",
                    SMmJwProposeddate: oCurrentRow.outDate2 || null,
                    SMmJwTime: oCurrentRow.outTime2 || null,
                    SMmJwLocation: oCurrentRow.outLocation2 || "",
                    SMmProposeddate: oCurrentRow.outDate1 || null,
                    SMmTime: oCurrentRow.outTime1 || null,
                    SMmZone: oCurrentRow.outZone || "",
                    SMmPpe: oCurrentRow.outPpeRequired === 1 ? "Y" : "N",
                    SMmSpecialinstructions: oCurrentRow.outSpecialInstr || ""
                },
                ToSrCategory: {
                    SCategoryId: oCurrentRow.outCatId || "",
                    SCEngineeringservices: oCurrentRow.outCatEng ? "Y" : "N",
                    SCItOt: oCurrentRow.outCatIT ? "Y" : "N",
                    SCMaterials: oCurrentRow.outCatMat ? "Y" : "N",
                    SCConstruction: oCurrentRow.outCatConst ? "Y" : "N",
                    SCProfessional: oCurrentRow.outCatProf ? "Y" : "N",
                    SCOther: oCurrentRow.outCatOther ? "Y" : "N",
                    SCOtherDescription: oCurrentRow.outCatOtherTxt || ""
                },
                ToSrLicense: {
                    SClId: oCurrentRow.outLicId || "",
                    SClRequired: oCurrentRow.outContractorReq === 1 ? "Y" : "N",
                    SClAGec: oCurrentRow.outLicenseA ? "Y" : "N",
                    SClBGbc: oCurrentRow.outLicenseB ? "Y" : "N",
                    SClCSc: oCurrentRow.outLicenseC ? "Y" : "N",
                    SClC61Lsc: oCurrentRow.outLicenseC61 ? "Y" : "N",
                    SClOther: oCurrentRow.outLicenseOther ? "Y" : "N",
                    SClCScNumber: oCurrentRow.outLicenseCTxt || "",
                    SClC61LscNumber: oCurrentRow.outLicenseC61Txt || "",
                    SClOtherDescription: oCurrentRow.outLicenseOtherTxt || ""
                },
                ToSrProjectdet: {
                    SPdId: oCurrentRow.outProjId || "",
                    SPdBegindate: oCurrentRow.outBegin || null,
                    SPdWages: oCurrentRow.outPrevailingWages === 1 ? "Y" : "N",
                    SPdBidbond: oCurrentRow.outBidBond === 1 ? "Y" : "N",
                    SPdContractvalue: oCurrentRow.outEstValue ? oCurrentRow.outEstValue.toString() : "0.00",
                    SPdEnddate: oCurrentRow.outEnd || null
                },
                ToSrFund: {
                    SFsId: oCurrentRow.outFundId || "",
                    SFsApproved: oCurrentRow.outBudgetAppr === 1 ? "Y" : "N",
                    SFsNoClarify: oCurrentRow.outBudgetApprNo || "",
                    SFsIid: oCurrentRow.outFundIID ? "Y" : "N",
                    SFsFederal: oCurrentRow.outFundFed ? "Y" : "N",
                    SFsStatecalifornia: oCurrentRow.outFundState ? "Y" : "N",
                    SFsOthersources: oCurrentRow.outFundOther ? "Y" : "N",
                    SFsBuyamericaact: oCurrentRow.outBuyAmerica === 1 ? "Y" : "N",
                    SFsOtherDescription: oCurrentRow.outFundOtherTxt || ""
                },
                ToSrRegulatory: {
                    SRId: oCurrentRow.outRegId || "",
                    SRNerc: oCurrentRow.outRegNERC === 1 ? "Y" : "N",
                    SRExeorder: oCurrentRow.outRegExec === 1 ? "Y" : "N",
                    SRSenatebill: oCurrentRow.outRegSenate === 1 ? "Y" : "N",
                    SRSpecialreq: oCurrentRow.outRegOther || "",
                    SRNercCertnumber: oCurrentRow.outRegNERCTxt || "",
                    SRExeorderNumber: oCurrentRow.outRegExecTxt || "",
                    SRSenatebillNumber: oCurrentRow.outRegSenateTxt || ""
                },
                ToSrContacts: oCurrentRow.ToSrContacts || [],
                ToSrApproval: oCurrentRow.ToSrApproval || []
            };

            var that = this;

            if (sId === "new") {

                oODataModel.create("/srbasicSet", oPayload, {
                    success: function (oData) {
                        MessageToast.show("Data saved successfully.");
                        oODataModel.refresh(true);
                        that.getOwnerComponent().getRouter().navTo("Routesolicitationrequest");
                    },
                    error: function (oError) {
                        MessageToast.show("Failed to save entry.");
                    }
                });

            }

            else {
                var sCleanId = String(sId).trim();
                var sPath = "/srbasicSet('" + sCleanId + "')";

                var oHeaderPayload = {
                    SId: sId,
                    SBTitle: oCurrentRow.outTitle || "",
                    SBDate: oCurrentRow.outDate || null,
                    SBTypeId: oCurrentRow.outType || "",
                    SBNumber: oCurrentRow.outNumber || "",
                    SBProposedduedate: oCurrentRow.outDueDate || null,
                    SBFromId: oCurrentRow.outFrom || "",
                    SBDeptId: oCurrentRow.outDepartment || ""
                };

                oODataModel.setDeferredGroups(["saveGroup"]);
                oODataModel.update(sPath, oHeaderPayload, { groupId: "saveGroup" });
                oODataModel.update("/srmeetSet('" + oPayload.ToSrMeet.SMmId + "')", oPayload.ToSrMeet, { groupId: "saveGroup" });
                oODataModel.update("/srcategorySet('" + oPayload.ToSrCategory.SCategoryId + "')", oPayload.ToSrCategory, { groupId: "saveGroup" });
                oODataModel.update("/srlicenseSet('" + oPayload.ToSrLicense.SClId + "')", oPayload.ToSrLicense, { groupId: "saveGroup" });
                oODataModel.update("/srprojectdetSet('" + oPayload.ToSrProjectdet.SPdId + "')", oPayload.ToSrProjectdet, { groupId: "saveGroup" });
                oODataModel.update("/srfundSet('" + oPayload.ToSrFund.SFsId + "')", oPayload.ToSrFund, { groupId: "saveGroup" });
                oODataModel.update("/srregulatorySet('" + oPayload.ToSrRegulatory.SRId + "')", oPayload.ToSrRegulatory, { groupId: "saveGroup" });

                oODataModel.submitChanges({
                    groupId: "saveGroup",
                    success: function () {
                        MessageToast.show("Data updated successfully.");
                        oODataModel.refresh(true);
                        oViewModel.setProperty("/originalRow", JSON.parse(JSON.stringify(oCurrentRow)));
                        oViewModel.setProperty("/editMode", false);
                        oViewModel.setProperty("/visibleEdit", true);
                        oViewModel.setProperty("/enableButton1", true);
                        oViewModel.setProperty("/enableButton2", false);
                        that.that.getOwnerComponent().getRouter().navTo("Routesolicitationrequest");
                    },
                    error: function () {
                        MessageToast.show("Failed to update entry.");
                    }
                });
            }
        },

        handleMessagePopoverPress: function (oEvent) {
            oMessagePopover.toggle(oEvent.getSource());
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
            }, 0).toString();
        },

        onMandatoryMeetingSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/manMeet", oEvent.getParameter("selectedIndex") === 1);
        },

        onRoomReservedSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/roomRes", oEvent.getParameter("selectedIndex") === 1);
        },

        onJobsiteWalkSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/jobWalkReq", oEvent.getParameter("selectedIndex") === 1);
        },

        onSoliCatOtherSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/soliCatOther", oEvent.getParameter("selected"));
        },

        onContractorSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/contractorReq", oEvent.getParameter("selectedIndex") === 1);
        },

        onSpecialityContractorSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/speCon", oEvent.getParameter("selected"));
        },

        onLimitedSpecialityClassificationSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/limSpeClass", oEvent.getParameter("selected"));
        },

        onOtherLicenseSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/licenseOther", oEvent.getParameter("selected"));
        },

        onBudgetApprSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/budgetApprNo", oEvent.getParameter("selectedIndex") === 0);
        },

        onFundFedSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/buyAmericaAct", oEvent.getParameter("selected"));
        },

        onFundOtherSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/fundOther", oEvent.getParameter("selected"));
        },

        onNercSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/regNERC", oEvent.getParameter("selectedIndex") === 1);
        },

        onExecSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/regExec", oEvent.getParameter("selectedIndex") === 1);
        },

        onSenateSelect(oEvent) {
            this.getView().getModel("solireq").setProperty("/regSenate", oEvent.getParameter("selectedIndex") === 1);
        },

        handleValueHelp1: function (oEvent) {
            var oView = this.getView();
            if (!this._oFromValueHelpDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "solireq.solicitationreq.view.FromValueHelp",
                    controller: this
                }).then(function (oDialog) {
                    this._oFromValueHelpDialog = oDialog;
                    oView.addDependent(this._oFromValueHelpDialog);
                    this._oFromValueHelpDialog.open();
                }.bind(this));
            } else {
                this._oFromValueHelpDialog.open();
            }
        },

        onFromValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("SBFromName", FilterOperator.Contains, sValue);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        onFromValueHelpConfirm: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var sFromId = oSelectedItem.getBindingContext("srODataModel").getProperty("SBFromId");
                this.getView().getModel("solireq").setProperty("/currentRow/outFrom", sFromId);
            }
        },

        formatFullName: function (sFname, sLname) {
            return [sFname, sLname].filter(Boolean).join(" ");
        },

        onContactValueHelp: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("solireq");
            this._sContactValueHelpPath = oContext.getPath();
            var oView = this.getView();
            if (!this._oContactValueHelpDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "solireq.solicitationreq.view.ContactValueHelp",
                    controller: this
                }).then(function (oDialog) {
                    this._oContactValueHelpDialog = oDialog;
                    oView.addDependent(this._oContactValueHelpDialog);
                    this._oContactValueHelpDialog.open();
                }.bind(this));
            } else {
                this._oContactValueHelpDialog.open();
            }
        },

        onContactValueHelpSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var aFilters = sValue ? [
                new Filter({
                    filters: [
                        new Filter("SRcFname", FilterOperator.Contains, sValue),
                        new Filter("SRcLname", FilterOperator.Contains, sValue),
                        new Filter("SRcEmpid", FilterOperator.Contains, sValue)
                    ],
                    and: false
                })
            ] : [];
            oEvent.getSource().getBinding("items").filter(aFilters);
        },

        onContactValueHelpConfirm: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (!oSelectedItem || !this._sContactValueHelpPath) { return; }

            var oConModel = oSelectedItem.getBindingContext("srODataModel");
            var oViewModel = this.getView().getModel("solireq");
            var sBasePath = this._sContactValueHelpPath;

            oViewModel.setProperty(sBasePath + "/SRcEmpid", oConModel.getProperty("SRcEmpid"));
            oViewModel.setProperty(sBasePath + "/SRcFname", oConModel.getProperty("SRcFname"));
            oViewModel.setProperty(sBasePath + "/SRcLname", oConModel.getProperty("SRcLname"));
            oViewModel.setProperty(sBasePath + "/SRcEmail", oConModel.getProperty("SRcEmail"));
            oViewModel.setProperty(sBasePath + "/SRcTeleno", oConModel.getProperty("SRcTeleno"));
        },

        onAddApprover() {
            var oViewModel = this.getView().getModel("solireq");
            var aApprovals = oViewModel.getProperty("/currentRow/ToSrApproval") || [];
            aApprovals.push({
                SAoApprovertitle: "", SAoApproverusername: "", SAoApprover: "",
                SAoApproverby: "", SAoDatereceived: null, SAoDateapproved: null, SAoComments: "", SAoStatus: ""
            });
            oViewModel.setProperty("/currentRow/ToSrApproval", aApprovals);
        },

        onRemoveApprover() {
            var oTable = this.byId("approvalTable");
            var oContext = oTable.getSelectedItem() && oTable.getSelectedItem().getBindingContext("solireq");
            var oViewModel = this.getView().getModel("solireq");
            var aApprovals = oViewModel.getProperty("/currentRow/ToSrApproval") || [];
            var iIndex = parseInt(oContext.getPath().split("/").pop(), 10);
            aApprovals.splice(iIndex, 1);
            oViewModel.setProperty("/currentRow/ToSrApproval", aApprovals);
        },

        _normalizeContacts: function (aContacts) {
            var aFixedTitles = ["Owner", "Project Manager", "Technical", "Other"];
            aContacts = aContacts || [];
            return aFixedTitles.map(function (sTitle) {
                var oExisting = aContacts.find(function (c) { return c.SRcTitle === sTitle; });
                return oExisting || {
                    SRcTitle: sTitle, SRcEmpid: "", SRcFname: "",
                    SRcLname: "", SRcEmail: "", SRcTeleno: ""
                };
            });
        }

    });
});
