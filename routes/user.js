var express = require('express');
var router = express.Router();
var debug = require('debug')('classhelper:routes:user');

module.exports = function(db) {
  var userManager = require('../model/userModel')(db);

  router.post('/signup', function(req, res, next) {
    var user = req.body;
    userManager.checkSignupUser(user)
      .then(userManager.insertUser)
      .then(function(user) {
        req.session.user = user;
        res.redirect('/');
      })
      .catch(function(error) {
        res.render('index', {
          title: '用户注册',
          exist: false,
          user: user,
          register_error: error,
          login_error: {}
        });
      });
  });

  router.post('/signin', function(req, res, next) {
    var user = req.body;
    userManager.findUser(user.username, user.password)
      .then(function(user) {
        req.session.user = user;
        res.redirect('/');
      })
      .catch(function(error) {
        res.render('index', {
          title: '用户登录',
          exist: false,
          user: user,
          register_error: {},
          login_error: error
        });
      });
  });

  router.post('/validate-unique', function(req, res, next) {
    var user = req.body;
    userManager.findUserByField(user.field, user.value)
      .then(function() {
        res.send({ isUnique: true });
      })
      .catch(function() {
        res.send({ isUnique: false });
      });
  });

  router.post('/validate-username', function(req, res, next) {
    var user = req.body;
    userManager.findUserByField('username', user.username)
      .then(function() {
        res.send({ isExisted: true });
      })
      .catch(function() {
        res.send({ isExisted: false });
      });
  });

  router.get('/signout', function(req, res, next) {
    req.session.destroy(function(err) {
      res.redirect('/');
    });
  });

  // catch 404 and forward to error handler
  router.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  router.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  return router;
};