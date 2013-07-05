var flash = require('connect-flash')
  , crypto = require('crypto')
  , User = require('../models/user.js');

//路由规划
// /: 首页
// /u/[user]:用户的主页
// /post: 发表信息
// /reg: 用户注册
// /login: 用户登陆
// /logout: 用户
module.exports = function(app) {
app.get('/', function(req, res) {
  res.render('index', {
    title: '首页',
  });
});

app.get('/login', checkNotLogin);
app.get('/login', function(req, res) {
  res.render('login', {
    title: '用户登入',
  });
});

app.post('/login', checkNotLogin);
app.post('/login', function(req, res) {
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.get(req.body.username, function(err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if (user.password != password) {
      // console.log('password is ' + user.password + 'true password is ' + password);
      req.flash('error', '用户口令错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登入成功');
    res.redirect('/');
    });
});

app.get('/logout', checkLogin);
app.get('/logout', function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功');
  res.redirect('/');
});

app.get('/reg', checkNotLogin);
app.get('/reg', function(req, res) {
  res.render('reg', {
    title: '用户注册',
  });
});

app.post('/reg', checkNotLogin);
app.post('/reg', function(req, res) {
  //检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '两次输入的口令不一致');
    return res.redirect('/reg');
  }
    //生成口令的散列值
    var md5 = crypto.createHash('md5')
    var password = md5.update(req.body.password).digest('base64')
    console.log('password is ' + req.body['password'] + 'true password is' + password);

    var newUser = new User({
      name: req.body.username,
      password: password,
    })

    //Check the username exist or not
    User.get(newUser.name, function(err, user) {
      if(user) {
        err = 'Username already exists.'
      }
      if(err) {
        req.flash('error', err)
        return res.redirect('/reg')
      }
      //if user is not exist then add new one
      newUser.save(function(err) {
        if(err) {
          req.flash('error', err)
          return res.redirect('/reg')
        }
        req.session.user = newUser
        req.flash('success', '注册成功')
        res.redirect('/')
      })
    });
});
};//module.exports

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next();
}
