describe("Login Module", function() {
  var password, loginForm, ssid, redirect, passwordError, genericError;

  beforeEach(function() {
    affix('form input#password+input#ssid+input#passwordError+div#genericError');
    loginForm = $('form');
    password = $('#password');
    ssid     = $('#ssid');
    passwordError = $("#passwordError");
    genericError = $("#genericError");
    helperModule.redirectTo = function(url) { redirect = url; }
    loginModule.init();
  });

  it("should show the user an error if password field is empty", function() {
    password.val(" ");
    loginForm.submit();
    expect(passwordError.text()).toEqual("Please enter a password!");
  });

  it("should submit AJAX request to proper URL", function() {
    spyOn(requestModule, "submitRequest");
    password.val("password");
    loginForm.submit();
    expect(requestModule.submitRequest).toHaveBeenCalled();
  });

  it("should submit AJAX request with proper data", function() {
    spyOn(requestModule, "submitRequest");
    var loginData = {jsonrpc:"2.0",method: "login", params:["root","asdf1234"],id:1};
    password.val("asdf1234");
    loginForm.submit();
    expect(requestModule.submitRequest).toHaveBeenCalledWith({'data':loginData, 'url': "/cgi-bin/routerapi/login", 'successCallback': jasmine.any(Function), 'errorCallback': jasmine.any(Function)});
  });

  it("should redirect to changePassword page on first login", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.success({result: "document.cookie"});
    });
    password.val("asdf1234");
    loginForm.submit();
    expect(redirect).toEqual("changePassword.html");
  });

  it("should redirect to dashboard page on subsequent logins", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.success({result: "document.cookie"});
    });
    password.val("some non default password");
    loginForm.submit();
    expect(redirect).toEqual("dashboard.html");
  });

  it("should not redirect user if login fails", function() {
    spyOn($, "ajax").andCallFake(function(params){
        params.error({responseJSON: {'error': 'Bad password'}});
    });
    password.val('badpass');
    loginForm.submit();
    expect(genericError.text()).toEqual("Error: Bad password");
  });
});
