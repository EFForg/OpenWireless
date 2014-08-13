var loginModule = (function() {
  var form;
  var password;
  var showPassword;
  var passwordError;
  var genericError;

  var init = function(){
    initializeFields();
    initializeEvents();
    initializeForm();
  };

  var initializeFields = function(){
    form = $('form');
    password = $('#password');
    showPassword = $('#showPassword');
    passwordError = $("#passwordError");
    genericError =  $('#genericError');
  };

  var initializeEvents = function(){
    showPassword.change(function(){
      var type = showPassword.prop('checked') ? 'text' : 'password';
      password.attr('type', type);
    });
  };

  var initializeForm = function(){
    form.submit(function(event) {
      event.preventDefault();
      passwordError.hide();
      genericError.hide();
      password.removeClass('error');

      var redirect = 'dashboard.html';
      var match = helperModule.url().match(/[?&]redirect_after_login=([^&]*)/);
      if (match && match[1]) {
        var candidate = decodeURIComponent(match[1]);
        // Filter for sane URLs to prevent redirect to javascript: or data:
        // URLs, or to evil.com. Only relative paths allowed.
        if (candidate.match(/^(?![\/]{2,})[\/A-Za-z0-9.-]*$/)) {
          redirect = candidate;
        }
      }

      if(helperModule.checkEmptyField(password, passwordError, "password")){
        return;
      }

      var data =  { "jsonrpc": "2.0", "method": "login", "params": ["root", password.val()], "id": 1 }
      var successCallback = function(data, textStatus, jqXHR) {
        helperModule.redirectTo(redirect);
      };

      var request = {
        data: data,
        url: '/cgi-bin/routerapi/login',
        successCallback: successCallback
      };
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

