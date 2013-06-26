var http = require('http');
var querystring = require('querystring');
var util = require('util');

http.creatServer(function(req, res) {
	var post = '';

	req.on('data', function(chunk) {
		post += chunk;
	});

	req.on('end', function() {
		post = querystring.parse(post);
		res.end(util.inspect(post));
	});
}).listen(1337);