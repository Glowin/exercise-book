
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , routes = require('./routes')
  , user = require('./routes/user')
  , crypto = require('crypto')
  , http = require('http')
  , path = require('path')
  , MongoStore = require('connect-mongo')(express)
  , flash = require('connect-flash')
  , settings = require('./settings');

//access log and error log
var accessLogfile = fs.createWriteStream('log/access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('log/error.log', {flags: 'a'});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger({stream: accessLogfile}));
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: settings.cookieSecret, 
  store: new MongoStore({ 
    db: settings.db
  })
}));

/*app.dynamicHelpers({
  user: function(req, res) {
    return req.session.user
  },
  error: function(req, res) {
    var err = req.flash('error')
    if(err.length)
      return err
    else
      return null
  },
  success: function(req, res) {
    var succ = req.flash('success')
    if(succ.length)
      return succ
    else
      return null
  },
})*/

app.use(function(req, res, next){
  var error = req.flash('error');
  var success = req.flash('success');
  res.locals.user = req.session.user;
  res.locals.error = error.length ? error : null; 
  res.locals.success = success.length ? success : null;
  next();
});


//app.set("env" , 'production');

app.configure('production', function(){
  app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLogfile.write(meta + err.stack + '\n');
    next();
  });
});

//app.use(express.router(routes));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') + ' in ' + app.settings.env + ' mode');
});
