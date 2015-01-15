var server = require("./server");
var router = require("./router");
var connect = require('connect');
var serveStatic = require('serve-static');

connect().use(serveStatic(__dirname)).listen(8080);
server.start(router.route);