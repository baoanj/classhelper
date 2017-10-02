'use strict';

$(function() {
  var boxes = $('.classbox');
  for (var i = 0; i < boxes.length; i++) {
    (function(i) {
      $.post('/hw/classstus', { id: $(boxes[i]).find('tr:first-of-type td:nth-of-type(2)').text() },
        function(data, status) {
          if (status === 'success') {
            $(boxes[i]).find('tr:last-of-type td:nth-of-type(2)').text(data.length);
          }
        }).error(function() {
        notify("服务器走丢了");
      });
    })(i);
  }

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