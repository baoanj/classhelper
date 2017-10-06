'use strict';

module.exports = function(db) {
  var collection = db.collection('hwfiles');

  return {
    insertHwfile: function(student, classId, hwDate, fileDate, filename, originalFilename, score) {
      return collection.insert({
          student: student,
          classId: classId,
          hwDate: hwDate,
          fileDate: fileDate,
          filename: filename,
          originalFilename: originalFilename,
          score: score
        })
        .then(function(result) {
          return Promise.resolve();
        });
    },

    updateHwScore: function(filename, score) {
      return collection.updateOne({ filename: filename }, { $set: { score: score } })
        .then(function(result) {
          return Promise.resolve();
        })
        .catch(function(error) {
          return Promise.reject(error);
        });
    },

    findHwfileByFilename: function(filename) {
      return collection.findOne({ filename: filename }).then(function(doc) {
        return Promise.resolve(doc);
      });
    },

    findHwfilesByClassIdAndHwDate: function(classId, hwDate) {
      return collection.find({ classId: classId, hwDate: hwDate }).toArray()
        .then(function(docs) {
          return Promise.resolve(docs);
        });
    },

    findHwfilesByStudentAndClassIdAndHwDate: function(student, classId, hwDate) {
      return collection.find({ student: student, classId: classId, hwDate: hwDate }).toArray()
        .then(function(docs) {
          return Promise.resolve(docs);
        });
    }
  };
};