/* ****************************************************************************
 * File: 		init.js
 *
 * Purpose: 	I provide functionality for both development and produciton
 *				environments on application initialization.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */
var init = function( cb ) {
	
	// Add uncaught-exception handler in prod-like environments
	if ( geddy.config.environment != 'development' ) {
		
		process.addListener('uncaughtException', function (err) {
			var msg = err.message;
			
			if (err.stack) {
				msg += '\n' + err.stack;
			}

			if (!msg) {
				msg = JSON.stringify(err);
			}

			geddy.log.error(msg);
		});
	}

	cb();
};
exports.init = init;