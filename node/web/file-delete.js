var fs = require('fs');

fs.realpath('a.txt', function(err, realpath) {
	if(err) {
		console.log(err);
	} else {
		console.log('The realpath is ' + realpath);
;	}
});
