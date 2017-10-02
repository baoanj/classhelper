'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(db) {

	var hwManager = require('../model/hwModel')(db);
	var scManager = require('../model/stuclassModel')(db);

	var theClass = require('./class')(db);

	router.all('*', function(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/');
		}
	});

	router.post('/createclass', function(req, res, next) {
		var theClass = req.body;
		if (theClass.classpwd === '' || theClass.classmsg === '') {
			res.redirect('/');
			return;
		}
		hwManager.insertClass(theClass.classpwd, req.session.user.username, theClass.classmsg)
			.then(function() {
				res.redirect('/hw/classes');
			});
	});

	router.post('/addclass', function(req, res, next) {
		var theClass = req.body;
		hwManager.findClassByIdAndPwd(theClass.classid, theClass.classpwd)
			.then(function(doc) {
				scManager.insertStudentClassLink(req.session.user.username, theClass.classid)
					.then(function() {
						res.redirect('/hw/classes');
					});
			})
			.catch(function(error) {
				res.redirect('/');
			});
	});

	router.post('/classstus', function(req, res, next) {
		scManager.findStuclassesByClassId(req.body.id)
			.then(function(docs) {
				res.send({ length: docs.length });
			})
			.catch(function(error) {
				res.send({ error: '获取出错' });
			});
	});

	router.get('/classes', function(req, res, next) {
		if (req.session.user.role === 'teacher') {
			hwManager.findClassesByTeacherName(req.session.user.username).then(function(docs) {
				var user = {
					username: req.session.user.username,
					role: req.session.user.role
				};
				res.render('classes', { exist: true, user: user, classes: docs.reverse(), title: '我的班级' });
			});
		} else if (req.session.user.role === 'student') {
			scManager.findStuclassesByStudentName(req.session.user.username).then(function(docs) {
				var user = {
					username: req.session.user.username,
					role: req.session.user.role
				};
				findClassById(hwManager, docs, res, [], user);
			});
		}
	});

	router.use('/class', theClass);

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

function findClassById(hwManager, ids, res, classes, user) {
	var stuclass = ids.pop();
	if (stuclass) {
		hwManager.findClassById(stuclass.classId).then(function(doc) {
			classes.push(doc);
			findClassById(hwManager, ids, res, classes, user);
		});
	} else {
		res.render('classes', { exist: true, user: user, classes: classes, title: '我的班级' });
	}
}