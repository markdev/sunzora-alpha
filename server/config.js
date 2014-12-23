var path 		= require('path')
  , rootPath 	= path.normalize(__dirname + '/../../')
  , os 			= require('os')
  ;

if (os.hostname() == 'Marks-MacBook-Pro-11.local') {
	module.exports = {
		db: 'mongodb://127.0.0.1/sunzora',
		redis: {
			host: '127.0.0.1',
			port: '6379'
		},
		rootDir: '/Users/markkaravan/sunzora/sunzora0.6/sunzora/',
		port: process.env.PORT || 2345
	}
} else if (os.hostname() == 'li60-94') {
	module.exports = {
		db: 'mongodb://127.0.0.1/sunzora',
		redis: {
			host: '127.0.0.1',
			port: '6379'
		},
		rootDir: '/var/www/sunzora-proto/',
    	port: process.env.PORT || 2345
	}	
}