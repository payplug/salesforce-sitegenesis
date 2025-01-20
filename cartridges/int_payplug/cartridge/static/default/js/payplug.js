/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cartridges/int_payplug/cartridge/js/payplug.js":
/*!********************************************************!*\
  !*** ./cartridges/int_payplug/cartridge/js/payplug.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("\n\nformPrepare = __webpack_require__(Object(function webpackMissingModule() { var e = new Error(\"Cannot find module './formPrepare'\"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));\ndocument.addEventListener('DOMContentLoaded', function () {\n  console.log('init');\n  $('#dwfrm_billing').on('submit', function (e) {\n    $('form[id$=\"billing\"]').validate();\n  });\n  [].forEach.call(document.querySelectorAll(\".payplugLightbox\"), function (el) {\n    el.addEventListener('click', function (event) {\n      event.preventDefault();\n      $.ajax({\n        url: el.getAttribute('data-pp-lightbox-url'),\n        type: 'get',\n        context: this,\n        dataType: 'html',\n        async: true,\n        success: async function (data) {\n          try {\n            var payplug_url = JSON.parse(data).payplug_url;\n            await loadAndEncapsulateScript(el.getAttribute('data-pp-lightbox-lib'));\n            if (typeof Payplug !== 'undefined' && Payplug.showPayment) {\n              Payplug.showPayment(payplug_url);\n            } else {\n              console.error('Payplug.showPayment is not defined');\n            }\n          } catch (error) {\n            console.error('Erreur dans le traitement du script Payplug:', error);\n          }\n        },\n        error: function (data) {\n          el.insertAdjacentText('afterend', JSON.parse(data.responseText).message);\n        }\n      });\n    });\n  });\n});\n\n//# sourceURL=webpack://int_payplug/./cartridges/int_payplug/cartridge/js/payplug.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./cartridges/int_payplug/cartridge/js/payplug.js");
/******/ 	
/******/ })()
;