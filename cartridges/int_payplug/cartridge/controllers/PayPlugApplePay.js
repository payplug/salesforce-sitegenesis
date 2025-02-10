'use strict';


const Site = require('dw/system/Site');
const Encoding = require('dw/crypto/Encoding');
const BasketMgr = require('dw/order/BasketMgr');
const PaymentManager = require('dw/order/PaymentMgr');

const guard = require('*/cartridge/scripts/guard');
const r = require('*/cartridge/scripts/util/Response');
const PayPlugUtils = require('~/cartridge/scripts/util/PayPlugUtils');
const LocaleHelper = require('~/cartridge/scripts/helpers/LocaleHelper');
const PayPlugPaymentModel = require('~/cartridge/models/PayPlugPaymentModel');

function ApplePayRequest() {
	const domain = Site.getCurrent().getCustomPreferenceValue('PP_ApplePayDomain');
	const bytes = new dw.util.Bytes(JSON.stringify({ 'apple_pay_domain': domain }), 'UTF-8');
	const cart = BasketMgr.getCurrentBasket();
	const payload = {
		countryCode: LocaleHelper.getCountryCode(),
		currencyCode: 'EUR',
		supportedNetworks: ['visa', 'masterCard'],
		merchantCapabilities: ['supports3DS'],
		total: { label: domain, amount: cart.getTotalGrossPrice().getValue().toString() },
		applicationData: Encoding.toBase64(bytes)
	};

	r.renderJSON(payload);
}

function ValidateMerchant() {
	const paymentMethod = PayPlugUtils.getApplePayMethod();
	const PayPlugPayment = new PayPlugPaymentModel();
	const PaymentResponse = PayPlugPayment.createPayment(paymentMethod, null);

	session.getCustom()['payplugPaymentID'] = PaymentResponse.getPaymentID();

	r.renderJSON({
		merchant_session: PaymentResponse ? PaymentResponse.response.payment_method.merchant_session : null,
		paymentId: PaymentResponse ? PaymentResponse.getPaymentID() : null
	});
}

function UpdatePayment() {
	const PayPlugPayment = new PayPlugPaymentModel();
	const httpParamters = request.getHttpParameterMap();
	const paymentID = httpParamters.get('paymentID').getStringValue();
	const aborted = httpParamters.isParameterSubmitted('aborted');
	if (aborted) {
		PayPlugPayment.cancelPayment(paymentID);
		r.renderJSON({});
		return;
	}
	const paymentToken = JSON.parse(httpParamters.get('paymenttoken').getStringValue());
	const UpdateResponse = PayPlugPayment.updatePayment(paymentToken, paymentID);
	r.renderJSON(UpdateResponse.response);
}

exports.ApplePayRequest = guard.ensure(['get'], ApplePayRequest);
exports.ValidateMerchant = guard.ensure(['get'], ValidateMerchant);
exports.UpdatePayment = guard.ensure(['post'], UpdatePayment);