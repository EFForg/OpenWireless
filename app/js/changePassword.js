var changePassword = (function() {
  var form = $('form');
  var oldPassword = $('#oldPassword');
  var newPassword = $('#newPassword');
  var retypePassword = $('#retypePassword');
  var newPasswordError= $("#newPasswordError");
  var retypePasswordError= $("#retypePasswordError");
  var genericError =  $('#genericError');
  var changePasswordUrl = "/cgi-bin/routerapi/change_password";


  var firstTime = helperModule.url().match(/[?&]first_time=true/);
  if (firstTime) {
    $(".changePassword").hide();
    $(".setPassword").show();
    changePasswordUrl = "/cgi-bin/routerapi/change_password_first_time";
  } else {
    $(".changePassword").show();
    $(".setPassword").hide();
  }

  form.submit(function(event){
    event.preventDefault();
    newPasswordError.hide();
    retypePasswordError.hide();
    newPassword.removeClass("error");
    retypePassword.removeClass("error");
    var changePasswordRequest = { "jsonrpc": "2.0", "method": "user.setpasswd", "params": ["root", newPassword.val(), oldPassword.val()], "id": 1 };

    if(helperModule.checkEmptyField(newPassword, newPasswordError, "password")) {
      return;
    }

    if(newPassword.val().length < 8) {
      newPassword.addClass("error");
      newPasswordError.html("Password must be at least 8 characters long.");
      newPasswordError.show();
      newPassword.focus();
      return;
    };

    if(helperModule.checkEmptyField(retypePassword, retypePasswordError, "password again")) {
      return;
    }

    if(newPassword.val() != retypePassword.val()) {
      retypePassword.addClass("error");
      retypePasswordError.html("Passwords must match.");
      retypePasswordError.show();
      retypePassword.focus();
      return;
    };

    var successCallback = function(response) {
      // Only redirect the user to change their SSID if the one they
      // entered was the default.
      if (firstTime) {
        helperModule.redirectTo("setSSID.html");
      } else {
        helperModule.redirectTo("settings.html");
      }
    };

    var request = {
      'data': changePasswordRequest,
      'url': changePasswordUrl,
      'successCallback': successCallback,
    };

    requestModule.submitRequest(request);
  });
});

$(function() {
  changePassword();
});
