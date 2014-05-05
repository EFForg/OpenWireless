describe("Change password page", function() {
  var newPassword, retypePassword, passwordForm, alert_msg;

  beforeEach(function() {
    alert_msg = null;
    affix('form input#newPassword+input#retypePassword');
    passwordForm   = $('form');
    newPassword    = $("#newPassword");
    retypePassword = $("#retypePassword");
    window.alert = function(msg){alert_msg = msg;};
    window.redirectTo = function(url) { redirect = url; }
    checkForm();
  });

  it("should alert the user if the password field is empty", function() {
    newPassword.val(" ");
    retypePassword.val("asdfghjkl12P");
    passwordForm.trigger('submit');
    expect(alert_msg).toEqual("Please enter a password!");
  });

  it("should alert the user if the password verification field is empty", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("");
    passwordForm.trigger('submit');
    expect(alert_msg).toEqual("Please re-enter your password");
  });

  it("should raise alert when both passwords match", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("badPassword");
    passwordForm.trigger('submit');
    expect(alert_msg).toEqual("The passwords do not match!");
  });

  it("should not raise alert when both passwords match", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    passwordForm.trigger('submit');
    expect(alert_msg).toEqual(null);
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

