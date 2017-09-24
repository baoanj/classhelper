var validator = {
  password: "",
  
  form: {
    username: {
      status: false,
      errorMessage1: '用户名格式有误',
      errorMessage2: '用户名已存在'
    },
    password: {
      status: false,
      errorMessage1: '密码格式有误',
      errorMessage2: '密码格式有误'
    },
    repeatpass: {
      status: false,
      errorMessage1: '两次密码不一致',
      errorMessage2: '两次密码不一致'
    },
    email: {
      status: false,
      errorMessage1: '邮箱格式有误',
      errorMessage2: '邮箱已存在'
    }
  },

  isUsernameValid: function(username) {
    return this.form.username.status = /^[a-zA-Z][a-zA-Z0-9_]{5,18}$/.test(username);
  },

  isPasswordValid: function(password) {
    this.password = password;
    return this.form.password.status = /^[0-9a-zA-Z_-]{6,12}$/.test(password);
  },

  isEmailValid: function(email) {
    return this.form.email.status = /^[0-9a-zA-Z_]+@([0-9a-zA-Z]+\.)+[a-zA-Z]{2,4}$/.test(email);
  },

  isRepeatpassValid: function(repeatpass) {
    return this.form.repeatpass.status = repeatpass == this.password && repeatpass != '';
  },

  isFieldValid: function(fieldname, value) {
    var CapFiledname = fieldname[0].toUpperCase() + fieldname.slice(1);
    return this["is" + CapFiledname + 'Valid'](value);
  },

  isFormValid: function() {
    return this.form.username.status && this.form.password.status && this.form.repeatpass.status && this.form.email.status;
  },

  getErrorMessage1: function(fieldname) {
    return this.form[fieldname].errorMessage1;
  },

  getErrorMessage2: function(fieldname) {
    return this.form[fieldname].errorMessage2;
  }
};
