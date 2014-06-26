describe("Login Module", function() {
  var username, password, loginForm, ssid, redirect, usernameError, passwordError, genericError;

  beforeEach(function() {
    affix('form input#username+input#password+input#ssid+input#usernameError+input#passwordError+input#genericError');
    loginForm = $('form');
    username = $('#username');
    password = $('#password');
    ssid     = $('#ssid');
    usernameError = $("#usernameError");
    passwordError = $("#passwordError");
    genericError = $("#genericError");
    helperModule.redirectTo = function(url) { redirect = url; }
    loginModule.init();
  });

  it("should show the user an error if username field is empty", function() {
    username.val(" ");
    password.val("password");
    loginForm.submit();
    expect(usernameError.text()).toEqual("Please enter a username!");
  });

  it("should show the user an error if password field is empty", function() {
    username.val("root");
    password.val(" ");
    loginForm.submit();
    expect(passwordError.text()).toEqual("Please enter a password!");
  });

  it("should submit AJAX request to proper URL", function() {
    spyOn(requestModule, "submitRequest");
    username.val("root");
    password.val("password");
    loginForm.submit();
    expect(requestModule.submitRequest).toHaveBeenCalled();
  });

  it("should submit AJAX request with proper data", function() {
    spyOn(requestModule, "submitRequest");
    var loginData = {jsonrpc:"2.0",method: "login", params:["root","asdf1234"],id:1};
    username.val("root");
    password.val("asdf1234");
    loginForm.submit();
    expect(requestModule.submitRequest).toHaveBeenCalledWith({'data':loginData, 'url': "/cgi-bin/luci/rpc/auth", 'successCallback': jasmine.any(Function), 'errorCallback': jasmine.any(Function)});
  });

  it("should redirect to changePassword page if auth token was retrieved successfully", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.success({result: "document.cookie"});
    });
    username.val("root");
    password.val("asdfghjkl12P");
    loginForm.submit();
    expect(redirect).toEqual("changePassword.html");
  });

  it("should show error if username/password do not match auth token was not retrieved successfully", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.success({});
    });
    username.val("root");
    password.val("asdf");
    loginForm.submit();
    expect(genericError.text()).toEqual("Username/password is incorrect");
  });

  it("should not redirect user if login fails", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.error("Error", "Forbidden");
    });
    username.val("baduser");
    password.val('badpass');
    loginForm.submit();
    expect(genericError.text()).toEqual("Error: Error: Message : Forbidden");
  });
});
