var fs = require('fs');

fs.unlink('a.txt', function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log('The file is deleted')
;	}
});
