var authorizationToken = getSysauthFromCookie(document.cookie);

function login() {
  var username = $('#username');
  var form =     $('form');
  var password = $('#password');

  form.on('submit', function(event) {
    event.preventDefault();
    if(isEmpty(username.val())) {
      alert("Please enter a username!");
      username.focus();
    }
    if(isEmpty(password.val())){
      alert("Please enter a password!");
      password.focus();
    }

    var data =  { "jsonrpc": "2.0", "method": "login", "params": [username.val(), password.val()], "id": 1 }
    $.ajax({
      type: "POST",
      url: "http://192.168.1.1/cgi-bin/luci/rpc/auth",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(data),
      success: function(response) {
        loginSuccess(response);
      },
      error: function(request, errorType, errorMessage) {
        console.log('Error: ' + errorType + ': Message : ' + errorMessage);
      }
    });
  });
};

function loginSuccess(response) {
  var username = $('#username');
  var password = $('#password');
  var validateCredentialsUrl = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+getSysauthFromCookie(document.cookie);
  var checkValidity =  { "jsonrpc": "2.0", "method": "user.checkpasswd", "params": [username.val(), password.val()], "id": 1 }
  $.ajax({
    type: "POST",
    url: validateCredentialsUrl,
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(checkValidity),
    success: function(response) {
      validCredentialsSuccess(response);
    },
    error: function(request, errorType, errorMessage) {
      console.log('Error: ' + errorType + ': Message : ' + errorMessage);
    }
  });
};

function validCredentialsSuccess(response) {
  if(response.result){
    redirectTo("changePassword.html");
  } else {
    alert("Username/password is incorrect");
    $("#username").focus();
  }
};


function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};

function redirectTo(url) { window.location.href = url; }
function isEmpty(value) { return !value || value.length === 0 || value == " " }


$(function() {
  login();
});
