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

      //TODO: sending passwords over plain text
      var data =  { "jsonrpc": "2.0", "method": "login", "params": [username.val(), password.val()], "id": 1 }
      var successCallback = function(response) {
        if(response.result == null){
          genericError.html("Username/password is incorrect");
          genericError.show();
          return;
        }
        //TODO: we redirect to change password every time?
        helperModule.redirectTo("changePassword.html");

      };

      //TODO: what type of errors do we get here? is it possible to leverage error message to produce XSS
      var errorCallback = function(errorType, errorMessage) {
        genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
        genericError.show();
      };

      var request = { 'data': data, url: '/cgi-bin/luci/rpc/auth', 'successCallback': successCallback, 'errorCallback': errorCallback };
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

