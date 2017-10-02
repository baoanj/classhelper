'use strict';

var bcrypt = require('bcrypt');
var Mongo = require('mongodb');

module.exports = function(db) {
  var collection = db.collection('classes');

  return {
    insertClass: function(classpwd, teacher, classmsg) {
      return collection.insert({ classpwd: classpwd, teacher: teacher, classmsg: classmsg })
        .then(function(result) {
          return Promise.resolve();
        });
    },

    findClassById: function(id) {
      try {
        var tc = Mongo.ObjectId(id);
      } catch(err) {
        return Promise.reject(err);
      }

      return collection.findOne({ _id: Mongo.ObjectId(id) }).then(function(doc) {
        return Promise.resolve(doc);
      });
    },

    findClassByIdAndPwd: function(id, pwd) {
      try {
        var tc = Mongo.ObjectId(id);
      } catch(err) {
        return Promise.reject(err);
      }
      
      return collection.findOne({ _id: Mongo.ObjectId(id)})
        .then(function(doc) {
          if (doc.classpwd === pwd) return Promise.resolve(doc);
          return Promise.reject();
        })
        .catch(function(error) {
          return Promise.reject(error);
        });
    },

    findClassesByTeacherName: function(name) {
      return collection.find({ teacher: name }).toArray().then(function(docs) {
        return Promise.resolve(docs);
      });
    }
  };
};