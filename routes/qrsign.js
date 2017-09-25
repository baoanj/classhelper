'use strict';

var express = require('express');
var router = express.Router();
var qr = require('qr-image');

module.exports = function(db) {
	var signManager = require('../model/signModel')(db);

	router.get('/', function(req, res, next) {
		var id = req.session.user.username;
		var date = Date.now();
		var svg_string = qr.imageSync('http://172.18.68.101:3000/qr/sign?id=' + id +
			'&date=' + date + '&classmsg=' + req.query.classmsg, { type: 'svg' });
		res.send(svg_string);
	});

	router.get('/sign', function(req, res, next) {
		res.render('qrsign', { id: req.query.id, date: req.query.date, classmsg: req.query.classmsg });
	});

	router.get('/record', function(req, res, next) {
		signManager.findAllSignRecords(req.session.user.username).then(function(result) {
			var records = [];
			result.forEach(function(val) {
				records.push(val.content);
			});
			res.render('signrecord', { records: records });
		});
	});

	router.post('/sign', function(req, res, next) {
		var username = req.query.id;
		var date = formatDate(new Date(+req.query.date));
		signManager.insertSignRecord(username, date, req.body.signmsg)
		res.send('签到成功');
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