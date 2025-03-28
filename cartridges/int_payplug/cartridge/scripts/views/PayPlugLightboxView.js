'use strict';

/** API Includes */
const Site = require('dw/system/Site');
const System = require('dw/system/System');
const PaymentMgr = require('dw/order/PaymentMgr');

/** Script Modules */
const app = require('*/cartridge/scripts/app');

const View = require('*/cartridge/scripts/views/View');

var PayPlugLightboxView = View.extend({
	init: function (params) {
		this._super(params);

		this.initializeView();

		return this;
	},

	render: function (params) {
		return this._super(params);
	},

	initializeView: function () {
		this.paymentOptionID = request.getHttpParameterMap().get('paymentMethodID').getStringValue();
		this.PPpaymentMethod = PaymentMgr.getPaymentMethod(this.paymentOptionID).getCustom()['PP_paymentMethod'].getValue();
		this.isOneClickEnabled = Site.getCurrent().getCustomPreferenceValue('PP_oneClickPayment');
		this.PPIntegrationMode = Site.getCurrent().getCustomPreferenceValue('PP_integrationMode').getValue();
		this.isProduction = System.getInstanceType() == System.PRODUCTION_SYSTEM;
		this.isCreditCard = empty(this.PPpaymentMethod) || this.PPpaymentMethod === 'credit_card';
		this.PP_libraryUrl = Site.getCurrent().getCustomPreferenceValue('PP_libraryUrl');
		this.isApplePay = this.PPpaymentMethod === 'apple_pay';
		this.hideLightBoxSavedCard = customer.getProfile().getWallet().getPaymentInstruments('PAYPLUG_ONECLICK').isEmpty() &&
			(this.PPIntegrationMode === 'lightbox' || this.PPIntegrationMode === 'HPP') && this.isOneClickEnabled;
	}
});

module.exports = PayPlugLightboxView;