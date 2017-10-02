'use strict';

$(function() {
	$('#createclass').click(function(e) {
		if ($('#classmsg').val() === '' || $('#classpwd').val() === '') {
			notify('不能为空', 'danger', 'fa fa-exclamation-triangle fa-fw');
			return false;
		}
		return true;
	});

	$('#addclass').click(function(e) {
		if ($('#classid').val() === '' || $('#classpwd').val() === '') {
			notify('不能为空', 'danger', 'fa fa-exclamation-triangle fa-fw');
			return false;
		}
		return true;
	});

	function notify(message, type, icon) {
    $.notify({
      // options
      message: message,
      icon: icon
    }, {
      // settings
      type: type,
      allow_dismiss: false,
      placement: {
        from: 'top',
        align: 'right'
      },
      animate: {
        enter: 'animated fadeInRight',
        exit: 'animated fadeOutRight'
      },
      offset: {
        x: 0,
        y: 10
      }
    });
  }
});