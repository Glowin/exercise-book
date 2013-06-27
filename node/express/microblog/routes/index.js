
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.hello = function(req, res) {
  var nowTime = 'The time is ' + new Date().toString();
  res.render('hello', {
    title: 'hello world',
    time: nowTime,
    layout: 'layout'
});
};