'use strict';

var bcrypt = require('bcrypt');

module.exports = function(db) {
  var collection = db.collection('stuclass');

  return {
    insertStudentClassLink: function(student, classId) {
      return collection.insert({ student: student, classId: classId })
        .then(function(result) {
          return Promise.resolve();
        });
    },

    findStuclassesByStudentName: function(name) {
      return collection.find({ student: name }).toArray().then(function(docs) {
        return Promise.resolve(docs);
      });
    },

    findStuclassesByClassId: function(id) {
      return collection.find({ classId: id }).toArray().then(function(docs) {
        return Promise.resolve(docs);
      }).catch(function(err) {
        return Promise.reject();
      });
    },

    findStuclassesByNameAndClassId: function(name, id) {
      return collection.findOne({ student: name, classId: id }).then(function(doc) {
        return Promise.resolve(doc);
      }).catch(function(err) {
        return Promise.reject();
      });
    }
  };
};