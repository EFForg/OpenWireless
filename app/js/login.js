var authorizationToken = getSysauthFromCookie(document.cookie);

function login() {
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

     if(isEmpty(username.val())) {
      username.addClass("error");
      usernameError.html("Please enter a username!");
      usernameError.show();
      username.focus();
      return;
    }

    if(isEmpty(password.val())){
      password.addClass("error");
      passwordError.html("Please enter a password!");
      passwordError.show();
      password.focus();
      return;
    }
    
    //TODO: sending passwords over plain text
    //TODO: Is there a timing attack in password validation?
    //TODO: hardcoded IP address
    var data =  { "jsonrpc": "2.0", "method": "login", "params": [username.val(), password.val()], "id": 1 }
    $.ajax({
      type: "POST",
      url: "http://192.168.1.1/cgi-bin/luci/rpc/auth",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
      success: function(response) {
        if(response.result == null){
           genericError.html("Username/password is incorrect");
           genericError.show();
           return;
        }
        //TODO: we redirect to change password every time?
        redirectTo("changePassword.html");
      },
      //TODO: what type of errors do we get here? is it possible to leverage error message to produce XSS
      error: function(errorType, errorMessage) {
        genericError.html('Error: ' + errorType + ': Message : ' + errorMessage);
        genericError.show();
      }
    });
  });
};

//TODO: don't we have one of these in the password reset code? DRY this up.
function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};

//TODO: don't we have one of these in the password reset code? DRY this up.
function redirectTo(url) { window.location.href = url; }
function isEmpty(value) { return !value || value.length === 0 || value == " " }


$(function() {
  login();
});
