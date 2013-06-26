//recive the GET request from the browser
//you can visit http://localhost:1337/user?name=fuck&uid=8888
//to check the result
var http = require('http');
var url = require('url');
var util = require('util');

http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end(util.inspect(url.parse(req.url, true)));
}).listen(1337);
