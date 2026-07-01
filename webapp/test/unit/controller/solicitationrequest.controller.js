/*global QUnit*/

sap.ui.define([
	"solireq/solicitationreq/controller/solicitationrequest.controller"
], function (Controller) {
	"use strict";

	QUnit.module("solicitationrequest Controller");

	QUnit.test("I should test the solicitationrequest controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
