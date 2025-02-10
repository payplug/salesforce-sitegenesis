'use strict';

function loadAndEncapsulateScript(url) {
	return new Promise(function (resolve, reject) {
		var script = document.createElement('script');
		script.src = url;
		script.type = 'text/javascript';
		script.async = true;

		script.onload = function () {
			resolve();
		};

		script.onerror = function () {
			reject(new Error(`Erreur lors du chargement du script : ${url}`));
		};

		document.head.appendChild(script);
	});
}

document.addEventListener('DOMContentLoaded', function () {
	if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
		$('div[data-pp-apple="true"]').hide();
	}
	$('#dwfrm_billing').on('submit', function (e) {
		if ($('.payplugRedirect').is(':visible')) {
			return;
		}
		e.preventDefault();
		$('form[id$="billing"]').validate();
		$.ajax({
			url: $('#dwfrm_billing').attr('action'),
			method: 'POST',
			data: $('#dwfrm_billing').serialize(),
			success: function (data) {
				if ($('.payplugIntegrated').is(':visible') && !$('input[name="dwfrm_billing_payplugCreditCard"]:checked').val()) {
					const visibleButton = $('.payplugIntegrated').filter(function () {
						// Vérifier si le bouton est visible
						return $(this).is(':visible');
					}).first();
					visibleButton.find('#payplugIntegratedPayment').trigger('click');
				} else if ($('.payplugLightboxForm').is(':visible')) {
					const visibleButton = $('.payplugLightboxForm').filter(function () {
						// Vérifier si le bouton est visible
						return $(this).is(':visible');
					}).first();
					visibleButton.find('.payplugLightbox').trigger('click');
				}
			}
		})
	});
	handleLightboxClic();

	$('[data-pp="true"]').on('click', function () {
		$.ajax({
			url: $('.payplugComponent').data('pp-component-url'),
			type: 'get',
			dataType: 'html',
			data: {
				paymentMethodID: $(this).val()
			},
			success: function (data) {
				$('.payplugComponent').html(data);
				handleLightboxClic();
				require('./payplugIntegrated').init();
				require('./payplugApplePay').init();
			}
		})
	});
});

function handleLightboxClic() {
	[].forEach.call(document.querySelectorAll(".payplugLightbox"), function (el) {
		el.addEventListener('click', function (event) {
			event.preventDefault();
			$.ajax({
				url: el.getAttribute('data-pp-lightbox-url'),
				type: 'get',
				context: this,
				dataType: 'html',
				async: true,
				success: async function (data) {
					try {
						var payplug_url = JSON.parse(data).payplug_url;

						await loadAndEncapsulateScript(el.getAttribute('data-pp-lightbox-lib'));
						if (typeof Payplug !== 'undefined' && Payplug.showPayment) {
							Payplug.showPayment(payplug_url);
						} else {
							console.error('Payplug.showPayment is not defined');
						}
					} catch (error) {
						console.error('Erreur dans le traitement du script Payplug:', error);
					}
				},
				error: function (data) {
					el.insertAdjacentText('afterend', JSON.parse(data.responseText).message);
				}
			});
		});
	});
}