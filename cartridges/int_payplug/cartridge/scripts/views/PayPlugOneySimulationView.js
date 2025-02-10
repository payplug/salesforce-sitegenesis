'use strict';

/** API Includes */
const Site = require('dw/system/Site');
const Money = require('dw/value/Money');
const BasketMgr = require('dw/order/BasketMgr');

/** Script Modules */
const app = require('*/cartridge/scripts/app');
const PayPlugPaymentModel = require('~/cartridge/models/PayPlugPaymentModel');
const PaymentMethodHelper = require('~/cartridge/scripts/helpers/OneyPaymentMethodHelper');

const View = require('*/cartridge/scripts/views/View');

var PayPlugOneySimulationView = View.extend({
	init: function (params) {
		this._super(params);
		this.oneySimulation = [];
		this.isOneyAvailable = PaymentMethodHelper.isOneyAvailable();

		this.initializeView();

		return this;
	},

	render: function (params) {
		return this._super(params);
	},

	initializeView: function () {
		const oneyDisplay = Site.getCurrent().getCustomPreferenceValue('PP_oneyDisplay');
		const httpParameter = request.getHttpParameterMap();
		const cartTotal = BasketMgr.getCurrentBasket() && BasketMgr.getCurrentBasket().getAdjustedMerchandizeTotalPrice();

		// Vérification : si productPrice est soumis et que oneyDisplay n'est pas égal à "product", retour anticipé
		if (httpParameter.isParameterSubmitted('productPrice') && !oneyDisplay.some(item => item.value === 'PDP')) {
			return;
		} else if (!httpParameter.isParameterSubmitted('productPrice') && !oneyDisplay.some(item => item.value === 'Summary')) {
			return
		}
		const oneyAmount = httpParameter.isParameterSubmitted('productPrice')
			? httpParameter.get('productPrice').getValue()
			: (cartTotal && cartTotal.value) ? cartTotal.value : 0;

		const amount = parseFloat(oneyAmount * 100);
		if (amount < 10000) {
			return;
		}
		const PayPlug = new PayPlugPaymentModel();
		const oneySimulation = PayPlug.oneySimulation(parseFloat(oneyAmount * 100));
		this.oneySimulationAmount = new Money(oneyAmount, session.getCurrency().getCurrencyCode());
		this.oneySimulation = oneySimulation ? oneySimulation.getSimulation() : [];
	}
});

module.exports = PayPlugOneySimulationView;