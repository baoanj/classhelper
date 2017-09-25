'use strict';

$(function() {
	$('#generqr').click(function() {
		$.get('/qr?classmsg=' + $('#qrmsg').val(), function(data) {
			$('#myModalLabel').html($('#qrmsg').val());
			$('#qrmsg').val('');
			$('#qrsvg').html(data);
		});
	});
});