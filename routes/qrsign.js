'use strict';

var express = require('express');
var router = express.Router();
var qr = require('qr-image');

module.exports = function(db) {
	var signManager = require('../model/signModel')(db);

	router.get('/sign', function(req, res, next) {
		res.render('qrsign', { id: req.query.id, date: req.query.date, title: req.query.classmsg });
	});

	router.post('/sign', function(req, res, next) {
		var username = req.query.id;
		var date = formatDate(new Date(+req.query.date));
		signManager.insertSignRecord(username, date, req.body.signmsg)
		res.send('签到成功');
	});

	router.all('*', function(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/');
		}
	});

	router.get('/', function(req, res, next) {
		var id = req.session.user.username;
		var date = Date.now();
		var svg_string = qr.imageSync('http://172.18.68.101:3000/qr/sign?id=' + id +
			'&date=' + date + '&classmsg=' + req.query.classmsg, { type: 'svg' });
		res.send(svg_string);
	});

	router.get('/record', function(req, res, next) {
		signManager.findAllSignRecords(req.session.user.username).then(function(result) {
			var records = {};
			result.forEach(function(val) {
				if (!records[val.date]) records[val.date] = [];
				records[val.date].push(val.content);
			});
			res.render('signrecord', { exist: true, records: sortRecordsByDate(records), title: '签到记录' });
		});
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

function sortRecordsByDate(records) {
	var rcds = {};
	var keys = Object.keys(records);
	keys.reverse();
	keys.forEach(function(key) {
		rcds[key] = records[key];
	});
	return rcds;
}