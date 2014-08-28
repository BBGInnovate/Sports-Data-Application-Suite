/* ****************************************************************************
 * File: 		router.js
 * Purpose: 	I am the router. I define where incoming URL's should be routed
 				to.
 *
 * Author: 		John Allen
 * Company: 	Fig Leaf Software
 *************************************************************************** */
var router = new geddy.RegExpRouter();

// default index
router.get('/').to('Main.index');

// match routes
router.match('/matches').to({controller: 'matches', action: 'index'});
router.match('/matches/buildmatchfile').to({controller: 'matches', action: 'buildmatchfile'});
router.match('/matches/setuprun').to({controller: 'matches', action: 'setuprun'});
router.match('/matches/runmatch').to({controller: 'matches', action: 'runmatch'});

exports.router = router;