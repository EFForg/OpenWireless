describe("Login Module", function() {
  var root, password, showPassword, loginForm, redirect, passwordError, genericError;

  beforeEach(function() {
    root = $("<div/>");
    $('body').append(root);
    loginModule.init(root);
    loginForm = $('form', root);
    password = $('#password', root);
    showPassword = $('#showPassword', root);
    passwordError = $("#passwordError", root);
    genericError = $("#genericError", root);
    helperModule.redirectTo = function(url) { redirect = url; }
  });

  afterEach(function() {
    root.remove();
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
    expect(requestModule.submitRequest).toHaveBeenCalledWith({'data':loginData, 'url': "/cgi-bin/routerapi/login", 'successCallback': jasmine.any(Function)});
  });

  it("should redirect to dashboard page on", function() {
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
    expect(genericError.text()).toEqual("Server Error: Bad password");
  });

  it("should allow showing the password", function() {
    showPassword.prop('checked', true).change();
    expect(password.attr('type')).toEqual("text");
  });

  it("should allow hiding the password", function() {
    showPassword.prop('checked', true).change();
    expect(password.attr('type')).toEqual("text");
    showPassword.prop('checked', false).change();
    expect(password.attr('type')).toEqual("password");
  });
});
