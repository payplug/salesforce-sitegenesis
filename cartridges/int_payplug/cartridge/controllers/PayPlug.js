'use strict';

/* API Modules */
const Site = require('dw/system/Site');
const Money = require('dw/value/Money');
const URLUtils = require('dw/web/URLUtils');
const BasketMgr = require('dw/order/BasketMgr');
const PaymentMgr = require('dw/order/PaymentMgr');

/* Script Modules */
var app = require('*/cartridge/scripts/app');
var guard = require('*/cartridge/scripts/guard');
let r = require('*/cartridge/scripts/util/Response');
const PayPlugUtils = require('~/cartridge/scripts/util/PayPlugUtils');
const PayPlugPaymentModel = require('~/cartridge/models/PayPlugPaymentModel');
const OneyPaymentMethodHelper = require('~/cartridge/scripts/helpers/OneyPaymentMethodHelper');

function getForm() {
	const paymentMethod = PaymentMgr.getPaymentMethod(request.getHttpParameterMap().get('paymentMethodID').getStringValue());
	const PayPlugPayment = new PayPlugPaymentModel();
	const PaymentResponse = PayPlugPayment.createPayment(paymentMethod, app.getForm('billing').object.payplugCreditCard.value);

	session.getCustom()['payplugPaymentID'] = PaymentResponse.getPaymentID();

	r.renderJSON({
		payplug_url: PaymentResponse.getPaymentURL(),
		payplug_id: PaymentResponse.getPaymentID()
	});
}

function placeOrderLightbox() {
	if (!PayPlugUtils.checkPayPlugPayment()) {
		response.redirect(URLUtils.url('Cart-Show', 'PayPlugError', true));
		return;
	}
	var placeOrderResult = app.getController('COPlaceOrder').Start();
	if (placeOrderResult.error) {
		app.getController('COSummary').Start({
			PlaceOrderError: placeOrderResult.PlaceOrderError
		});
	} else if (placeOrderResult.order_created) {
		app.getController('COSummary').ShowConfirmation(placeOrderResult.Order);
	}
}

function returnURL() {
	if (!PayPlugUtils.checkPayPlugPayment()) {
		response.redirect(URLUtils.url('Cart-Show', 'PayPlugError', true));
		return;
	}
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
	const paymentMethod = PaymentMgr.getPaymentMethod(request.getHttpParameterMap().get('paymentMethodID').getStringValue());
	const ppPaymentMethod = paymentMethod.getCustom()['PP_paymentMethod'].getValue() || 'credit_card';
	const integrationMode = PayPlugUtils.getIntegrationMode(ppPaymentMethod);

	if (integrationMode === 'HPP') {
		app.getView().render('payplug/redirectContent');
	} else {
		app.getView('PayPlugLightbox').render('payplug/lightboxContent');
	}
}

function oneySimulation() {
	app.getView('PayPlugOneySimulation').render('payplug/oneysimulation');
}

function cancelURL() {
	response.redirect(URLUtils.url('Cart-Show', 'PayPlugError', true));
}

function UpdateSimulation() {
	const currentBasket = BasketMgr.getCurrentBasket();
	const PayPlug = new PayPlugPaymentModel();
	const currencyCode = session.getCurrency().getCurrencyCode()

	if (request.getHttpParameterMap().isParameterSubmitted('price')) {
		const productPrice = parseFloat(request.getHttpParameterMap().get('price').getStringValue());
		const priceSimulation = PayPlug.oneySimulation(productPrice * 100);
		app.getView({
			oneySimulationAmount: new Money(productPrice, currencyCode),
			oneySimulation: priceSimulation ? priceSimulation.getSimulation() : [],
			isOneyAvailable: OneyPaymentMethodHelper.isOneyAvailable(),
			oneySimulationDisplay: true
		}).render('payplug/oneysimulation');
	}
}

exports.GetForm = guard.ensure(['get'], getForm);
exports.PlaceOrderLightbox = guard.ensure(['get'], placeOrderLightbox);
exports.ReturnURL = guard.ensure(['get'], returnURL);
exports.Notification = guard.ensure(['post'], notification);
exports.PaymentComponent = guard.ensure(['get'], paymentComponent);
exports.OneySimulation = guard.ensure(['get'], oneySimulation);
exports.CancelURL = guard.ensure(['get'], cancelURL);
exports.UpdateSimulation = guard.ensure(['get'], UpdateSimulation);