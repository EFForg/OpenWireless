var loginModule = (function() {
  var username;
  var form;
  var password;
  var usernameError;
  var passwordError;
  var genericError;

  var init = function(){
    initializeFields();
    initializeForm();
  };

  var initializeFields = function(){
    username = $('#username');
    form = $('form');
    password = $('#password');
    usernameError = $("#usernameError");
    passwordError = $("#passwordError");
    genericError =  $('#genericError');
  };

  var initializeForm = function(){
    form.submit(function(event) {
      event.preventDefault();
      usernameError.hide();
      passwordError.hide();
      genericError.hide();
      username.removeClass('error');
      password.removeClass('error');

      if(helperModule.checkEmptyField(username, usernameError, "username")){
        return;
      }

      if(helperModule.checkEmptyField(password, passwordError, "password")){
        return;
      }

      var data =  { "jsonrpc": "2.0", "method": "login", "params": [username.val(), password.val()], "id": 1 }
      var successCallback = function(data, textStatus, jqXHR) {
        // Only redirect the user to change their password if the one they
        // entered was the default.
        if (password == "asdf1234") {
          helperModule.redirectTo("changePassword.html");
        } else {
          helperModule.redirectTo("dashboard.html");
        }
      };

      var errorCallback = function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.responseJSON && jqXHR.responseJSON.error) {
          genericError.text('Error: ' + jqXHR.responseJSON.error);
        } else {
          genericError.text('Error');
        }
        genericError.show();
      };

      var request = { 'data': data, url: '/cgi-bin/routerapi/login', 'successCallback': successCallback, 'errorCallback': errorCallback };
      requestModule.submitRequest(request);
    });
  };

  return {
    init: init
  };

})();

$(document).ready(function() {
  loginModule.init();
});

