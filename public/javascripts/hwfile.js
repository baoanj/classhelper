'use strict';

$(function() {
	var inputs = $('input.hw-score');
	for (var i = 0; i < inputs.length; i++) {
		(function(i) {
			$.get('/hw/class/score', { filename: $(inputs[i]).attr('filename') })
				.done(function(data, status) {
					if (status === 'success') {
						$(inputs[i]).val(data);
					}
				})
				.fail(function() {
					notify("服务器走丢了");
				});
		})(i);
	}

	$('button.hw').click(function(e) {
		$.post('/hw/class/updatescore', {
				filename: $(e.target).parent().prev().find('input.hw-score').attr('filename'),
				score: $(e.target).parent().prev().find('input.hw-score').val()
			})
			.done(function(data, status) {
				if (status === 'success') {
					$(notify(data));
				}
			})
			.fail(function() {
				notify("服务器走丢了");
			});
	});

	(function($) {
		$.fn.extend({
			notify: function(msg, options) {
				var defaluts = {
					position: 'absolute',
					top: '0',
					right: '10px',
					backgroundColor: '#218D69',
					color: 'white',
					padding: '10px',
					boxShadow: '0px 2px 10px #333333',
					opacity: 0,
					duration: 300,
					easing: 'linear',
					delay: 2000
				}
				var settings = $.extend({}, defaluts, options);
				var template = $('<div></div>');
				template.text(msg);
				template.css(settings);
				template.animate({
					opacity: 1,
					top: "+=10"
				}, settings.duration, settings.easing, function() {
					setTimeout(function() {
						template.animate({
							opacity: 0,
							top: "-=10"
						}, settings.duration, settings.easing, function() {
							template.remove();
						});
					}, settings.delay);
				});
				this.append(template);

				return this;
			}
		});
	})(window.jQuery);

	function notify(msg) {
		$('body').notify(msg, {});
	}
});