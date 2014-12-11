/* ****************************************************************************
 * File: 		router.js
 *
 * Purpose: 	I am the router. I define where incoming URL's should be routed
 *				to.
 *
 * Author: 		John Allen ( jallen@figleaf.com )
 *
 * Company: 	Fig Leaf Software
 *************************************************************************** */
var router = new geddy.RegExpRouter();

// default router
router.get('/').to('Main.index');

// soccer routes
router.match('/soccer').to({controller: 'soccer', action: 'index'});
router.match('/soccer/').to({controller: 'soccer', action: 'index'});

router.match('/soccer/game').to({controller: 'soccer', action: 'game'});
router.match('/soccer/game/').to({controller: 'soccer', action: 'game'});

router.match('/soccer/squad').to({controller: 'soccer', action: 'squad'});
router.match('/soccer/squad/').to({controller: 'soccer', action: 'squad'});

router.match('/soccer/squads').to({controller: 'soccer', action: 'squads'});
router.match('/soccer/squads/').to({controller: 'soccer', action: 'squads'});

router.match('/soccer/player').to({controller: 'soccer', action: 'player'});
router.match('/soccer/player/').to({controller: 'soccer', action: 'player'});

router.match('/soccer/schedule').to({controller: 'soccer', action: 'schedule'});
router.match('/soccer/schedule/').to({controller: 'soccer', action: 'schedule'});

router.match('/soccer/currentgame').to({controller: 'soccer', action: 'currentgame'});
router.match('/soccer/currentgame/').to({controller: 'soccer', action: 'currentgame'});

exports.router = router;
