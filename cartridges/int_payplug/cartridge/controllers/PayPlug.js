'use strict';

/* API Modules */
var PaymentMgr = require('dw/order/PaymentMgr');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
let r = require('*/cartridge/scripts/util/Response');
const PayPlugUtils = require('~/cartridge/scripts/util/PayPlugUtils');
const PayPlugPaymentModel = require('~/cartridge/models/PayPlugPaymentModel');

function getForm() {
	const paymentMethod = PaymentMgr.getPaymentMethod(request.getHttpParameterMap().get('paymentMethodID').getStringValue());
	const PayPlugPayment = new PayPlugPaymentModel();
	const PaymentResponse = PayPlugPayment.createPayment(paymentMethod, app.getForm('billing').object.payplugCreditCard.value);

	r.renderJSON({
		payplug_url: PaymentResponse.getPaymentURL(),
		payplug_id: PaymentResponse.getPaymentID()
	});
}

function placeOrderLightbox() {
	var placeOrderResult = app.getController('COPlaceOrder').Start();
	if (placeOrderResult.error) {
		app.getController('COSummary').Start({
			PlaceOrderError: placeOrderResult.PlaceOrderError
		});
	} else if (placeOrderResult.order_created) {
		app.getController('COSummary').ShowConfirmation(placeOrderResult.Order);
	}
}

function notification() {
	PayPlugUtils.createNotificationCustomObject(JSON.parse(request.getHttpParameterMap().getRequestBodyAsString()));
}

function paymentComponent() {
	var test = app;
	app.getView('PayPlugLightbox').render('payplug/lightboxContent');
}

exports.GetForm = guard.ensure(['get'], getForm);
exports.PlaceOrderLightbox = guard.ensure(['get'], placeOrderLightbox);
exports.Notification = guard.ensure(['post'], notification);
exports.PaymentComponent = guard.ensure(['get'], paymentComponent);