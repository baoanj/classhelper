'use strict';

var fs = require('fs');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'data/' });

module.exports = function(db) {

	var classManager = require('../model/classModel')(db);
	var hwManager = require('../model/hwModel')(db);
	var scManager = require('../model/stuclassModel')(db);
	var hwfileManager = require('../model/hwfileModel')(db);

	router.all('*', function(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/');
		}
	});

	router.get('/score', function(req, res, next) {
		hwfileManager.findHwfileByFilename(req.query.filename)
			.then(function(doc) {
				if (!doc) {
					res.send('出错');
					return;
				}
				res.send(doc.score);
			})
			.catch(function(error) {
				console.log(error);
				res.send('出错');
			})
	});

	router.get('/submits', function(req, res, next) {
		hwfileManager.findHwfilesByStudentAndClassIdAndHwDate(req.session.user.username,
				req.query.classid, req.query.date)
			.then(function(docs) {
				var results = [];
				docs.forEach(function(val) {
					var date = formatDate(new Date(+val.fileDate));
					results.push({
						filename: val.filename,
						originalFilename: val.originalFilename,
						fileDate: date,
						score: val.score
					});
				});
				res.send(results);
			})
			.catch(function(error) {
				console.log(error);
				res.send('出错');
			})
	});

	router.get('/detail', function(req, res, next) {
		if (req.session.user.role === 'teacher') {
			hwfileManager.findHwfilesByClassIdAndHwDate(req.query.classid, req.query.date)
				.then(function(docs) {
					var user = {
						username: req.session.user.username,
						role: req.session.user.role
					};

					var date = formatDate(new Date(+req.query.date));

					var hwFiles = [];
					docs.forEach(function(val) {
						hwFiles.push({
							filename: val.filename,
							originalFilename: val.originalFilename,
							fileDate: formatDate(new Date(+val.fileDate))
						});
					});

					res.render('hwdetail', { exist: true, user: user, title: '学生作业', theHw: { date: date }, hwFiles: hwFiles })
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	});

	router.get('/download', function(req, res, next) {
		hwfileManager.findHwfileByFilename(req.query.filename)
			.then(function(doc) {
				if (!doc) {
					res.send('找不到文件');
					return;
				}
				if (req.session.user.role === 'student' && doc.student === req.session.user.username) {
					res.download('data/' + req.query.filename, doc.originalFilename);
				} else if (req.session.user.role === 'teacher') {
					hwManager.findClassById(doc.classId)
						.then(function(cls) {
							if (!cls || cls.teacher !== req.session.user.username) {
								res.send('无法下载');
								return;
							}

							res.download('data/' + req.query.filename, doc.originalFilename);
						})
						.catch(function(error) {
							console.log(error);
							res.send('出错');
						});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
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

	router.post('/submithw', upload.single('submithw'), function(req, res, next) {
		var filename = req.file.filename + getMimeName(req.file.originalname);
		fs.renameSync('data/' + req.file.filename, 'data/' + filename);
		hwfileManager.insertHwfile(req.session.user.username, req.query.classid, req.query.date, Date.now(), filename, req.file.originalname, '--')
		res.send('上传成功');
	});

	router.post('/updatescore', function(req, res, next) {
		hwfileManager.updateHwScore(req.body.filename, req.body.score)
			.then(function(doc) {
				res.send('打分成功');
			})
			.catch(function(error) {
				console.log(error);
				res.send('打分失败');
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

function getMimeName(filename) {
	return filename.slice(filename.lastIndexOf('.'));
}