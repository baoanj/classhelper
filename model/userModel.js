var debug = require('debug')('classhelper:models:userModel');
var bcrypt = require('bcrypt');

module.exports = function(db) {
  var validator = require('./validator');

  var collection = db.collection('users');

  return {
    insertUser: function(user) {
      return bcrypt.hash(user.password, 10).then(function(hash) {
        user.password = hash;
        delete user.repeatpass;
        return collection.insert(user).then(function(result) {
          debug(user.username + ' registed successfully!');
          return Promise.resolve(user);
        });
      });
    },

    findUser: function(username, password) {
      return collection.findOne({ username: username }).then(function(user) {
        if (user) {
          return bcrypt.compare(password, user.password).then(function(res) {
            if (res) {
              return Promise.resolve(user);
            } else {
              return Promise.reject({ password: '密码错误' });
            }
          });
        } else {
          return Promise.reject({ username: '用户名不存在' });
        }
      });
    },

    findUserByField: function(field, value) {
      var target = {};
      target[field] = value;
      return collection.findOne(target).then(function(user) {
        if (user) {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      });
    },

    findAllUser: function() {
      return collection.find({}).toArray().then(function(docs) {
        var users = {};
        for (var i = 0; i < docs.length; i++) {
          users[docs[i].username] = docs[i];
        }
        return Promise.resolve(users);
      });
    },

    isAttrValueUnique: function(registry, field, value) {
      for (var i in registry) {
        if (registry[i][field] == value) return false;
      }
      return true;
    },

    isUsernameExisted: function(user, username) {
      return users.hasOwnProperty(username);
    },

    checkSignupUser: function(user) {
      var that = this;
      return this.findAllUser().then(function(users) {
        var err_messages = {};
        if (!validator.isUsernameValid(user['username'])) {
          err_messages['username'] = validator.getErrorMessage1('username');
        }
        if (!that.isAttrValueUnique(users, 'username', user['username'])) {
          err_messages['username'] = validator.getErrorMessage2('username');
        }
        if (!validator.isEmailValid(user['email'])) {
          err_messages['email'] = validator.getErrorMessage1('email');
        }
        if (!that.isAttrValueUnique(users, 'email', user['email'])) {
          err_messages['email'] = validator.getErrorMessage2('email');
        }
        if (!validator.isPasswordValid(user['password'])) {
          err_messages['password'] = validator.getErrorMessage1('password');
        }
        if (user['password'] != user['repeatpass']) {
          err_messages['repeatpass'] = validator.getErrorMessage1('repeatpass');
        }
        if (Object.keys(err_messages).length > 0) {
          return Promise.reject(err_messages);
        } else {
          return Promise.resolve(user);
        }
      });
    }
  };
};
