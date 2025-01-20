'use strict';

/* API Includes */
var Cart = require('*/cartridge/scripts/models/CartModel');
var PaymentMgr = require('dw/order/PaymentMgr');
var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');
var OrderMgr = require('dw/order/OrderMgr');

/**
 * This is where additional PayPlug integration would go. The current implementation simply creates a PaymentInstrument and
 * returns 'success'.
 */
function Handle(args) {
    var cart = Cart.get(args.Basket);
    const currentBasket = BasketMgr.getCurrentBasket();
    var paymentMethodId = args.PaymentMethodID;

    Transaction.wrap(function () {
		cart.removeAllPaymentInstruments();
        cart.createPaymentInstrument(paymentMethodId, cart.getNonGiftCertificateAmount());
    });

    return {success: true};
}

function Authorize(args) {
    var orderNo = args.OrderNo;
    var paymentInstrument = args.PaymentInstrument;
    var paymentProcessor = PaymentMgr.getPaymentMethod(paymentInstrument.getPaymentMethod()).getPaymentProcessor();

    Transaction.wrap(function () {
        paymentInstrument.paymentTransaction.setTransactionID(orderNo);
		paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
    });

    return {authorized: true};
}

exports.Handle = Handle;
exports.Authorize = Authorize;
