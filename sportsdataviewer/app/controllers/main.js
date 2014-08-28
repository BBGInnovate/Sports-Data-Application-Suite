/* ****************************************************************************
 * File: 		main.js
 *
 * Purpose: 	I am the default/main view controller.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */

 /* *************************** Required Classes *************************** */
 
 /* ************************** Controller Methods ************************** */
 var Main = function () {
	this.index = function (req, resp, params) {
		this.respond({params: params}, {
		format: 'html'
		, template: 'app/views/main/index'
		});
	};
};

exports.Main = Main;
/* *************************** Private Methods ***************************** */