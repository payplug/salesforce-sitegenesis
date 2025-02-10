'use strict';

const Site = require('dw/system/Site');
const URLRedirectMgr = require('dw/web/URLRedirectMgr');

/* Script Modules */
const app = require('*/cartridge/scripts/app');
const guard = require('*/cartridge/scripts/guard');

/** Override Controller */
const RedirectURL = module.exports = require('app_storefront_controllers/cartridge/controllers/RedirectURL');

/**
 * Gets the redirect. Renders the template for a redirect (util/redirectpermanent template). If no redirect can be found,
 * renders an error page (util/redirecterrorutil/redirecterror template).
 */
function start() {
	var origin = URLRedirectMgr.getRedirectOrigin();
	if (origin.match('/.well-known/apple-developer-merchantid-domain-association')) {
		response.getWriter().print(Site.getCurrent().getCustomPreferenceValue('PP_ApplePayDomainCertificate'));
		return null;
	}

	var redirect = URLRedirectMgr.getRedirect(),
		location = redirect ? redirect.getLocation() : null;


	if (!location) {
		response.setStatus(410);
		app.getView().render('util/redirecterrorutil/redirecterror');
	} else {
		app.getView({
			Location: location
		}).render('util/redirectpermanent');
	}
}

/** Gets a redirect and renders it.
 * @see module:controllers/RedirectURL~start */
module.exports.Start = guard.ensure([], start);