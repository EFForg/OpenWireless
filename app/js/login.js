var submitLogin = (function() {
  var username = $('#username');
  var form =     $('form');
  var password = $('#password');
  var usernameError = $("#usernameError");
  var passwordError = $("#passwordError");
  var genericError =  $('#genericError');

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
    //TODO: Is there a timing attack in password validation?
    //TODO: hardcoded IP address

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

    var request = { 'data': data, url: 'http://192.168.1.1/cgi-bin/luci/rpc/auth', 'successCallback': successCallback, 'errorCallback': errorCallback };
    requestModule.submitRequest(request);
  });

});

$(function() {
  submitLogin();
});
