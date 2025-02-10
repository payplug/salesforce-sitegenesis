'use strict';

var Transaction = require('dw/system/Transaction');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
const PayPlugUtils = require('~/cartridge/scripts/util/PayPlugUtils');
const PayPlugPaymentModel = require('~/cartridge/models/PayPlugPaymentModel');

var Cart = app.getModel('Cart');

/** Override Controller */
const COSummaryController = module.exports = require('app_storefront_controllers/cartridge/controllers/COSummary');

function submit() {
	var cart = Cart.get();
	let hasPayPlugPaymentInstrument =  cart && PayPlugUtils.hasPayPlugPaymentInstrument(cart);
	if (hasPayPlugPaymentInstrument) {
		const PayPlugPayment = new PayPlugPaymentModel();
		const PaymentResponse = PayPlugPayment.createPayment(hasPayPlugPaymentInstrument, app.getForm('billing').object.payplugCreditCard.value);
		session.getCustom()['payplugPaymentID'] = PaymentResponse.getPaymentID();
		response.redirect(PaymentResponse.getPaymentURL());
		return;
	}
	// Calls the COPlaceOrder controller that does the place order action and any payment authorization.
	// COPlaceOrder returns a JSON object with an order_created key and a boolean value if the order was created successfully.
	// If the order creation failed, it returns a JSON object with an error key and a boolean value.
	var placeOrderResult = app.getController('COPlaceOrder').Start();
	if (placeOrderResult.error) {
		start({
			PlaceOrderError: placeOrderResult.PlaceOrderError
		});
	} else if (placeOrderResult.order_created) {
		showConfirmation(placeOrderResult.Order);
	}
}

module.exports.Submit = guard.ensure(['https', 'post', 'csrf'], submit);