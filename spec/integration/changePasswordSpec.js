describe("Change password page", function() {
  var newPassword, retypePassword, passwordForm, newPasswordError, retypePasswordError, root, initTest;

  beforeEach(function() {
    root = $('<div />');
    $('body').append(root);

    spyOn(helperModule, "redirectTo").andCallFake(function(url) {
      redirect = url;
    });

    initTest = function() {
      changePassword(root);
      passwordForm   = $('form', root);
      oldPassword = $("#oldPassword", root);
      newPassword    = $("#newPassword", root);
      retypePassword = $("#retypePassword", root);
      newPasswordError = $("#newPasswordError", root);
      retypePasswordError = $("#retypePasswordError", root);
      genericError = $("#genericError", root);
    }
    initTest();
  });

  afterEach(function() {
    root.remove();
  });

  it("should show the user an error if the password field is empty", function() {
    newPassword.val(" ");
    retypePassword.val("asdfghjkl12P");
    passwordForm.submit();
    expect(newPasswordError.text()).toEqual("Please enter a password!");
  });

  it("should show the user an error if the password verification field is empty", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("");
    passwordForm.submit();
    expect(retypePasswordError.text()).toEqual("Please enter a password again!");
  });

  it("should show the user an error if the password is invalid", function() {
    newPassword.val("myPass");
    retypePassword.val("");
    passwordForm.submit();
    expect(newPasswordError.text()).toEqual("Password must be at least 8 characters long.");
  });

  it("should show the user an error when both passwords match", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("badPassword");
    passwordForm.submit();
    expect(retypePasswordError.text()).toEqual("Passwords must match.");
  });

  it("should not show an error when both passwords match", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    passwordForm.submit();
    expect(newPasswordError.is(":visible")).toEqual(false);
    expect(retypePasswordError.is(":visible")).toEqual(false);
  });

  it("should submit AJAX request with proper data", function() {
    spyOn($, 'ajax');
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    oldPassword.val("1234");
    var changePasswordData = "{\"jsonrpc\":\"2.0\",\"method\":\"user.setpasswd\",\"params\":[\"root\",\"asdfghjkl12P\",\"1234\"],\"id\":1}";

    passwordForm.submit();
    expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(changePasswordData);
  });

  it("should submit AJAX request to proper URL", function() {

    spyOn($, 'ajax');

    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    passwordForm.submit();
    expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("/cgi-bin/routerapi/change_password");
  });

  it("should redirect to setSSID page on first time change", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.success({});
    });
    spyOn(helperModule, "url").andReturn("https://gw.home.lan/changePassword.html?first_time=true");
    initTest();

    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    passwordForm.submit();
    expect(redirect).toEqual("setSSID.html");
  });

  it("should redirect to settings page on change that's not the first time", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.success({});
    });
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    oldPassword.val("asdf1234");
    passwordForm.submit();
    expect(redirect).toEqual("settings.html");
  });

  it("should stay on page and display error if old password was incorrect", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.error({responseJSON: {'error': 'Bad password'}});
    });
    oldPassword.val("badpass");
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    passwordForm.submit();
    expect(genericError.text()).toEqual("Server Error: Bad password");
  });
});

