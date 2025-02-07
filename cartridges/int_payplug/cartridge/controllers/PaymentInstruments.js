'use strict';

/* API Modules */
const Transaction = require('dw/system/Transaction');

/* Script Modules */
const app = require('*/cartridge/scripts/app');
const guard = require('*/cartridge/scripts/guard');
const PayPlugPaymentModel = require('~/cartridge/models/PayPlugPaymentModel');

const PaymentInstrumentsController = module.exports = require('app_storefront_controllers/cartridge/controllers/PaymentInstruments');

/**
 * Form handler for the paymentinstruments form. Handles the following actions:
 * - __remove__ - uses the form and action supplied by the FormModel to remove a customer payment instrument
 * in a transaction.
 * - __error__ - does nothing.
 *
 * In either case, redirects to the {@link module:controllers/PaymentInstruments~list|List} function.
 * @transaction
 * @TODO Should be moved into handlePaymentForm
 * @FIXME Inner method should be lowercase.error action should do something
 */
function Delete() {
	var paymentForm = app.getForm('paymentinstruments');
	paymentForm.handleAction({
		remove: function (formGroup, action) {
			if (!empty(action.object.getCreditCardToken())) {
				const PayPlugPayment = new PayPlugPaymentModel();
				PayPlugPayment.removeCustomerCardFromWallet(action.object.getCreditCardToken());
			}
			Transaction.wrap(function () {
				var wallet = customer.getProfile().getWallet();
				wallet.removePaymentInstrument(action.object);
			});

		},
		error: function () {
			// @TODO When could this happen
		}
	});

	response.redirect(URLUtils.https('PaymentInstruments-List'));
}

/** Deletes a saved credit card payment instrument.
 * @see module:controllers/PaymentInstruments~Delete */
 module.exports.Delete = guard.ensure(['https', 'loggedIn'], Delete);