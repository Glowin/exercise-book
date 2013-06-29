var flash = require('connect-flash')
  , crypto = require('crypto');
  User = require('../models/user.js');

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

app.get('/reg', function(req, res) {
  res.render('reg', {
    title: '用户注册',
  });
});

app.post('/reg', function(req, res) {
  //检验用户两次输入的口令是否一致
  if (req.body['password-repeat'] != req.body['password']) {
    req.flash('error', '两次输入的口令不一致');
    return res.redirect('/reg');
  }
    //生成口令的散列值
    var md5 = crypto.createHash('md5')
    var password = md5.update(req.body.password).digest('base64')

    var newUser = new User({
      name: req.body.username,
      password: req.body.password,
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
