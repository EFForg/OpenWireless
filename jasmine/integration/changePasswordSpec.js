describe("Change password page", function() {
  var newPassword, retypePassword, passwordForm, newPasswordError, retypePasswordError;

  beforeEach(function() {
    affix('form input#newPassword+input#retypePassword+input#newPasswordError+input#retypePasswordError');
    passwordForm   = $('form');
    newPassword    = $("#newPassword");
    retypePassword = $("#retypePassword");
    newPasswordError = $("#newPasswordError");
    retypePasswordError = $("#retypePasswordError");
    window.redirectTo = function(url) { redirect = url; }
    checkForm();
  });

  it("should show the user an error if the password field is empty", function() {
    newPassword.val(" ");
    retypePassword.val("asdfghjkl12P");
    passwordForm.trigger('submit');
    expect(newPasswordError.text()).toEqual("Please enter a password.");
  });

  it("should show the user an error if the password verification field is empty", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("");
    passwordForm.trigger('submit');
    expect(retypePasswordError.text()).toEqual("Please re-enter your password.");
  });

  it("should show the user an error if the password is invalid", function() {
    newPassword.val("myPass");
    retypePassword.val("");
    passwordForm.trigger('submit');
    expect(newPasswordError.text()).toEqual("Password must contain at least 12 characters, including UPPER/lowercase and numbers.");
  });

  it("should show the user an error when both passwords match", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("badPassword");
    passwordForm.trigger('submit');
    expect(retypePasswordError.text()).toEqual("Passwords must match.");
  });

  it("should not show an error when both passwords match", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    passwordForm.trigger('submit');
    expect(newPasswordError.is(":visible")).toEqual(false);
    expect(retypePasswordError.is(":visible")).toEqual(false);
  });

  it("should submit AJAX request with proper data", function() {
    spyOn($, 'ajax');
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    var changePasswordData = "{\"jsonrpc\":\"2.0\",\"method\":\"user.setpasswd\",\"params\":[\"root\",\"asdfghjkl12P\"],\"id\":1}";

    passwordForm.trigger('submit');
    expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(changePasswordData);
  });

  it("should submit AJAX request to proper URL", function() {
    spyOn($, 'ajax');
    authorizationToken = "abcdef123456";
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    passwordForm.trigger('submit');
    expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken);
  });
});

