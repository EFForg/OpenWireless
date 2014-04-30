describe("Change password page", function() {
  var newPassword, retypePassword 
  beforeEach(function() {
    affix('#test input#newPassword+input#retypePassword');
    newPassword = $("#newPassword");
    retypePassword = $("#retypePassword");
    spyOn($, "ajax");
  });

  it("should return true when new password field is empty", function() {
    newPassword.val(" ");
    retypePassword.val("asdfghjkl12P");
    expect(checkForm()).toBeTruthy();
  });

  it("should return true when retype password field is an empty string", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("");
    expect(checkForm()).toBeTruthy();
  });

  it("should return false when both passwords match", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    expect(checkForm()).toBeFalsy();
  });

  it("should submit AJAX request with proper data", function() {
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    var changePasswordData = "{\"jsonrpc\":\"2.0\",\"method\":\"user.setpasswd\",\"params\":[\"root\",\"asdfghjkl12P\"],\"id\":1}";

    expect(checkForm()).toBeFalsy();
    expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(changePasswordData);
  });

  it("should submit AJAX request to proper URL", function() {
    authorizationToken = "abcdef123456";
    newPassword.val("asdfghjkl12P");
    retypePassword.val("asdfghjkl12P");
    checkForm();
    expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+authorizationToken);
  });
});

