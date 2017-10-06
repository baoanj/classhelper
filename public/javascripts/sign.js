'use strict';

$(function() {
  $('#signup-tab').click(function(e) {
    $('#signup').css('display', 'block');
    $('#signin').css('display', 'none');
  });

  $('#signin-tab').click(function(e) {
    $('#signin').css('display', 'block');
    $('#signup').css('display', 'none');
  });

  var inputs = $("#login_form input");
  for (let i = 0; i < inputs.length; i++) {
    var field = inputs.get(i).id;
    field = field.slice(field.indexOf('_') + 1);
    if ($("#login_err_" + field).text() !== "") {
      $(inputs.get(i)).addClass('inputError');
      notify($("#login_err_" + field).text(), 'danger', 'fa fa-exclamation-triangle fa-fw');
    }
  }

  var inputs = $("#register_form input");
  for (let i = 0; i < inputs.length; i++) {
    var field = inputs.get(i).id;
    field = field.slice(field.indexOf('_') + 1);
    if ($("#register_err_" + field).text() !== "") {
      $(inputs.get(i)).addClass('inputError');
      notify($("#register_err_" + field).text(), 'danger', 'fa fa-exclamation-triangle fa-fw');
    }
  }

  // -----------------------------------------
  // 登录
  // -----------------------------------------

  var usernameFlag = false,
    passwordFlag = false;
  $("#login_form input").blur(function() {
    var self = this;
    switch (this.id) {
      case "login_username":
        if ($(this).val() === "") {
          $(this).removeClass('inputError').removeClass('inputRigth');
          usernameFlag = false;
        } else {
          $.post('/user/validate-username', { username: $(this).val() })
            .done(function(data, status) {
              if (status === 'success') {
                if (data.isExisted) {
                  $(self).addClass('inputRigth');
                  usernameFlag = true;
                } else {
                  $(self).addClass('inputError');
                  notify("用户名不存在", 'danger', 'fa fa-exclamation-triangle fa-fw');
                  usernameFlag = false;
                }
              }
            })
            .fail(function() {
              notify("服务器走丢了", 'danger', 'fa fa-exclamation-triangle fa-fw');
              usernameFlag = false;
            });
        }
        break;
      case "login_password":
        if ($(this).val() === "") {
          $(this).removeClass('inputError').removeClass('inputRigth');
          passwordFlag = false;
        } else {
          $(this).addClass('inputRigth');
          passwordFlag = true;
        }
        break;
      default:
    }
  });

  $("#login_form input").focus(function() {
    $(this).removeClass('inputError').removeClass('inputRigth');
  });

  $("#login_reset").click(function() {
    $("#login_form input").val("").removeClass('inputError').removeClass('inputRigth');
  });

  $("#login").click(function() {
    $("#login_form input").blur();
    var inputs = $("#login_form input");
    for (let i = 0; i < inputs.length; i++) {
      if ($(inputs.get(i)).val() === "") {
        $(inputs.get(i)).addClass('inputError');
        notify(inputs.get(i).placeholder + '不能为空', 'danger', 'fa fa-exclamation-triangle fa-fw');
      }
    }
    return usernameFlag && passwordFlag;
  });


  // -----------------------------------------
  // 注册
  // -----------------------------------------

  $("#register_form input").blur(function() {
    var self = this;
    switch (this.id) {
      case "register_username":
      case "register_email":
        var field = this.id;
        field = field.slice(field.indexOf('_') + 1);
        if (validator.isFieldValid(field, $(this).val())) {
          $.post('/user/validate-unique', { field: field, value: $(this).val() })
            .done(function(data, status) {
              if (status === 'success') {
                if (!data.isUnique) {
                  $(self).addClass('inputRigth');
                } else {
                  $(self).addClass('inputError');
                  var field = self.id;
                  field = field.slice(field.indexOf('_') + 1);
                  notify(validator.getErrorMessage2(field), 'danger', 'fa fa-exclamation-triangle fa-fw');
                }
              }
            })
            .fail(function() {
              notify('服务器走丢了', 'danger', 'fa fa-exclamation-triangle fa-fw');
            });
        } else if ($(this).val() === '') {
          $(this).removeClass('inputError').removeClass('inputRigth');
        } else {
          $(this).addClass('inputError');
        }
        break;
      case "register_password":
      case "register_repeatpass":
        var field = this.id;
        field = field.slice(field.indexOf('_') + 1);
        if (validator.isFieldValid(field, $(this).val())) {
          $(this).addClass('inputRigth');
        } else if ($(this).val() === '') {
          $(this).removeClass('inputError').removeClass('inputRigth');
        } else {
          $(this).addClass('inputError');
        }
        break;
      default:
    }
  });

  $("#register_form input").focus(function() {
    $(this).removeClass('inputError').removeClass('inputRigth');
  });

  $("#register_reset").click(function() {
    $("#register_form input").val("").removeClass('inputError').removeClass('inputRigth');
  });

  $("#register").click(function() {
    $("#register_form input").blur();
    var inputs = $("#register_form input");
    for (let i = 0; i < inputs.length; i++) {
      var field = inputs.get(i).id;
      field = field.slice(field.indexOf('_') + 1);
      if ($(inputs.get(i)).val() === "") {
        $(inputs.get(i)).addClass('inputError');
        notify(inputs.get(i).placeholder + '不能为空', 'danger', 'fa fa-exclamation-triangle fa-fw');
      } else if (!validator.isFieldValid(field, $(inputs.get(i)).val())) {
        notify(inputs.get(i).placeholder + '格式有误', 'danger', 'fa fa-exclamation-triangle fa-fw');
      }
    }
    return validator.isFormValid();
  });

  $('[data-toggle="tooltip-input"]').tooltip();

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