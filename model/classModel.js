'use strict';

var Mongo = require('mongodb');

module.exports = function(db) {
  var teacoll = db.collection('teahws');
  var stucoll = db.collection('stuhws');

  return {
    insertHw: function(classId, date, hwmsg) {
      return teacoll.insert({ classId: classId, date: date, hwmsg: hwmsg })
        .then(function(result) {
          return Promise.resolve();
        });
    },

    findTeaHwsByClassId: function(classId) {
      return teacoll.find({ classId: classId }).toArray().then(function(docs) {
        return Promise.resolve(docs);
      });
    }
  };
};