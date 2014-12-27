var path 		= require('path')
  , rootPath 	= path.normalize(__dirname + '/../../')
  , os 			= require('os')
  ;

if (os.hostname() == 'Marks-MacBook-Pro-11.local') {
	module.exports = {
		preconString: "postgres://postgres:irdlhajbis@localhost:5432/postgres",
		postconString: "postgres://postgres:irdlhajbis@localhost:5432/sunzora",
		redis: {
			host: '127.0.0.1',
			port: '6379'
		},
		rootDir: '/Users/markkaravan/sunzora/sunzora0.6/sunzora-alpha/',
		port: process.env.PORT || 2345
	}
} else if (os.hostname() == 'li60-94') {
	module.exports = {
		preconString: "postgres://postgres:irdlhajbis@localhost:5432/postgres",
		postconString: "postgres://postgres:irdlhajbis@localhost:5432/sunzora",
		redis: {
			host: '127.0.0.1',
			port: '6379'
		},
		rootDir: '/var/www/sunzora-alpha/',
    	port: process.env.PORT || 2345
	}	
} else if (os.hostname() == 'Thomass-MacBook-Pro.local') {
	module.exports = {
		preconString: "postgres://postgres:irdlhajbis@localhost:5432/postgres",
		postconString: "postgres://postgres:irdlhajbis@localhost:5432/sunzora",
		redis: {
			host: '127.0.0.1',
			port: '6379'
		},
		rootDir: '/Users/thomaslebeda/Documents/sunzora-alpha/',
    	port: process.env.PORT || 2345
	}	
}