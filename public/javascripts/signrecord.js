$(function() {
	$('p.sign-record-date').click(function() {
		if ($(this).siblings().css('display') === 'none') {
			$(this).siblings().css('display', 'inline-block');
		} else {
			$(this).siblings().css('display', 'none');
		}
	});
});