var changeUsernameAndPassword = (function(authToken) {
  var authToken = authToken;
  var form = $('form');
  var newPassword = $('#newPassword');
  var retypePassword = $('#retypePassword');
  var newPasswordError= $("#newPasswordError");
  var retypePasswordError= $("#retypePasswordError");
  var changePasswordUrl = "/cgi-bin/luci/rpc/sys?auth="+authToken;

  form.submit(function(event){
    event.preventDefault();
    newPasswordError.hide();
    retypePasswordError.hide();
    newPassword.removeClass("error");
    retypePassword.removeClass("error");
    var changePasswordRequest = { "jsonrpc": "2.0", "method": "user.setpasswd", "params": ["root", newPassword.val()], "id": 1 };

    if(helperModule.checkEmptyField(newPassword, newPasswordError, "password")) {
      return;
    }

    if(!helperModule.checkPassword(newPassword.val())) {
      newPassword.addClass("error");
      //TODO: Is this really the best password scheme to enfore on people?
      newPasswordError.html("Password must contain at least 12 characters, including UPPER/lowercase and numbers.");
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
    
    //TODO: we are seding the root password over http!
    
    var successCallback = function(response) {
        helperModule.redirectTo("settings.html");
    };

    var errorCallback = function(request, errorType, errorMessage) {
        console.log('Error: ' + errorType + ': Message : ' + errorMessage);
        helperModule.redirectTo("changeUsernameAndPassword.html");
      }

    var request = { 'data': changePasswordRequest, 'url': changePasswordUrl, 'successCallback': successCallback, 'errorCallback': errorCallback };
    requestModule.submitRequest(request);

  });
});

$(function() {
  var authToken = securityModule.getAuthToken();
  changeUsernameAndPassword(authToken);
});
