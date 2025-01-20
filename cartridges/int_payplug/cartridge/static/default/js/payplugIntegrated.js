/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./cartridges/int_payplug/cartridge/js/payplugIntegrated.js":
/*!******************************************************************!*\
  !*** ./cartridges/int_payplug/cartridge/js/payplugIntegrated.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports) {

eval("exports.init = function () {\n  if (!$('.payplugIntegrated').length) {\n    return;\n  }\n  const integratedPayment = new Payplug.IntegratedPayment();\n  if (!$('.payplugIntegrated').data('pp-is-live')) {\n    integratedPayment.secureDomain = \"https://secure-qa.payplug.com\";\n  }\n  const props = {\n    inputStyles: {\n      default: {\n        color: '#2B343D',\n        fontFamily: 'Poppins, sans-serif',\n        fontSize: '14px',\n        textAlign: 'left',\n        '::placeholder': {\n          color: '#969a9f'\n        },\n        ':focus': {\n          color: '#2B343D'\n        }\n      }\n    }\n  };\n\n  // Add scheme\n  const schemeElement = document.getElementById('scheme');\n  const schemes = integratedPayment.getSupportedSchemes();\n  schemes.forEach((scheme, id) => {\n    const radio = document.createElement('input');\n    radio.type = 'radio';\n    radio.name = 'scheme';\n    radio.id = scheme.name;\n    radio.value = scheme.id;\n    if (scheme.id === 0) radio.checked = true;\n    schemeElement.appendChild(radio);\n\n    //Add logo scheme or text\n    const elmt = document.createElement('img');\n    elmt.src = scheme.iconUrl;\n    elmt.style.width = '26px';\n    elmt.style.height = '21px';\n    elmt.title = scheme.name;\n    elmt.alt = scheme.name;\n    schemeElement.appendChild(elmt);\n  });\n\n  // Add card holder field\n  integratedPayment.cardHolder(document.getElementById('cardholder-input-container'), {\n    default: props.inputStyles.default\n  });\n\n  // Add each payments fields\n  integratedPayment.cardNumber(document.getElementById('pan-input-container'), {\n    default: props.inputStyles.default\n  });\n  integratedPayment.cvv(document.getElementById('cvv-input-container'), {\n    default: props.inputStyles.default\n  });\n  integratedPayment.expiration(document.getElementById('exp-input-container'), {\n    default: props.inputStyles.default\n  });\n\n  // Handle your form submission\n  [].forEach.call(document.querySelectorAll(\"#payplugIntegratedPayment\"), function (el) {\n    el.addEventListener('click', function (event) {\n      // Cancel default form submission\n      event.preventDefault();\n      event.stopPropagation();\n      integratedPayment.validateForm();\n    });\n  });\n\n  // Listen to the validateForm Event\n  integratedPayment.onValidateForm(({\n    isFormValid\n  }) => {\n    // Form is valid, you can proceed with transaction\n    if (isFormValid) {\n      // Create payment object on your back-end\n      createPaymentOnBackEnd(payplug_id => {\n        integratedPayment.pay(payplug_id, 0, {\n          save_card: $('input[name=\"pp-integrated-savecard\"]').is(':checked')\n        });\n      });\n    }\n  });\n\n  // Implement your own retrieve function from back end\n  integratedPayment.onCompleted(event => {\n    if (event.error) {\n      console.error(event);\n    } else {\n      window.location.href = $('#payplugIntegratedPayment').data('pp-validationurl');\n    }\n  });\n};\nfunction createPaymentOnBackEnd(callback) {\n  const payplugUrl = $('#payplugIntegratedPayment').data('pp-url');\n  if (!payplugUrl) {\n    console.error(\"Payplug URL not found\");\n    return;\n  }\n  $.ajax({\n    url: payplugUrl,\n    type: 'get',\n    dataType: 'html',\n    async: true,\n    success: function (data) {\n      const payplug_id = JSON.parse(data).payplug_id;\n\n      // Appeler le callback une fois que le payplug_id est récupéré\n      if (callback && typeof callback === 'function') {\n        callback(payplug_id);\n      }\n    },\n    error: function (error) {\n      console.error(\"Failed to create payment on backend:\", error);\n    }\n  });\n}\n\n//# sourceURL=webpack://int_payplug/./cartridges/int_payplug/cartridge/js/payplugIntegrated.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./cartridges/int_payplug/cartridge/js/payplugIntegrated.js"](0, __webpack_exports__);
/******/ 	
/******/ })()
;