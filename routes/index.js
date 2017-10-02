'use strict';

var express = require('express');
var router = express.Router();
var debug = require('debug')('classhelper:routes:index');
module.exports = function(db) {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    var username = '', role = '';
    var exist = false;
    if (req.session.user) {
      username = req.session.user.username;
      role = req.session.user.role;
      exist = true;
    }
    var user = {
      username: username,
      role: role
    };
    res.render('index', {
      title: '课堂助手',
      exist: exist,
      user: user,
      register_error: {},
      login_error: {}
    });
  });

  return router;
};