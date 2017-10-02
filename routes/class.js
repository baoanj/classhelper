'use strict';

var express = require('express');
var router = express.Router();

module.exports = function(db) {

	var classManager = require('../model/classModel')(db);
	var hwManager = require('../model/hwModel')(db);
	var scManager = require('../model/stuclassModel')(db);

	router.all('*', function(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/');
		}
	});

	router.get('/*', function(req, res, next) {
		var classId = req.path.slice(1);
		hwManager.findClassById(classId)
			.then(function(hwdoc) {
				// findOne找不到会返回null，find找不到会返回空数组[]，
				// 所以find不需要检测，findOne需要检测是否为null
				if (!hwdoc) {
					res.send('班级不存在');
					return;
				}

				var theclass = {
					classid: classId,
					classmsg: hwdoc.classmsg
				};

				if (req.session.user.role === 'teacher') {
					if (hwdoc.teacher !== req.session.user.username) {
						res.send('你没有权限访问这个班级');
						return;
					}
					classManager.findTeaHwsByClassId(classId).then(function(docs) {
							docs.forEach(function(val) {
								val.fmdate = formatDate(new Date(val.date));
							});
							var user = {
								username: req.session.user.username,
								role: req.session.user.role
							};
							res.render('teaclass', { exist: true, user: user, title: '我的班级', theclass: theclass, teahws: docs });
						})
						.catch(function(error) {
							console.log(error);
						});
				} else if (req.session.user.role === 'student') {
					scManager.findStuclassesByNameAndClassId(req.session.user.username, classId)
						.then(function(doc) {
							if (!doc) {
								res.send('你没有权限访问这个班级');
								return;
							}

							classManager.findTeaHwsByClassId(classId).then(function(docs) {
									docs.forEach(function(val) {
										val.fmdate = formatDate(new Date(val.date));
									});
									var user = {
										username: req.session.user.username,
										role: req.session.user.role
									};
									res.render('stuclass', { exist: true, user: user, title: '我的班级', theclass: theclass, stuhws: docs });
								})
								.catch(function(error) {
									console.log(error);
								});
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			})
			.catch(function(error) {
				console.log(error);
				next();
			});
	});

	router.post('/createhw', function(req, res, next) {
		if (req.body.hwmsg === '') {
			res.redirect('/hw/class/' + req.query.classid);
			return;
		}
		hwManager.findClassById(req.query.classid)
			.then(function(doc) {
				if (!doc || doc.teacher !== req.session.user.username) {
					res.redirect('/hw/class/' + req.query.classid);
				} else {
					classManager.insertHw(req.query.classid, Date.now(), req.body.hwmsg)
						.then(function() {
							res.redirect('/hw/class/' + req.query.classid);
						});
				}
			})
			.catch(function(error) {
				console.log(error);
				res.redirect('/hw/class/' + req.query.classid);
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

function formatDate(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	return '' + year + '年' + month + '月' + day + '日 ' + hour + ':' + min + ':' + sec;
}