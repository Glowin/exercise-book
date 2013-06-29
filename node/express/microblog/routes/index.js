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
};
