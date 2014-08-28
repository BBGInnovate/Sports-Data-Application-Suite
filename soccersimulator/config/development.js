var config = {
	appName: 'Soccer Simulation (development)', 
	detailedErrors: true, 
	debug: true,
	hostname: null,
	port: 4001, 
	model: {
		defaultAdapter: 'filesystem'
	},
	sessions: {
		store: 'filesystem',
		filename: '_session_store.json',
		key: 'sid',
		expiry: 14 * 24 * 60 * 60
	},
	ftpPushDetail: {
		ftpEnabled: false,
		nonFTPPushPath : '/Users/lbacker/Documents/nodeapps/sportsdataapplication/sportsdataprovider/FTP',
		server: '54.83.49.250',
		userName: 'opta-user',
		password: '0Pt@W0rldCup',
		directory: '/var/www/FTP/', 
		protocol: 'SFTP',
	},

};

module.exports = config;