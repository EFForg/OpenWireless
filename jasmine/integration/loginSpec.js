describe("Login page", function() {
  var username, password, loginForm, ssid, alert_msg, redirect;

  beforeEach(function() {
    alert_msg = null;
    affix('form input#username+input#password+input#ssid');
    loginForm =$('form');
    username = $('#username');
    password = $('#password');
    ssid     = $('#ssid');
    window.alert = function(msg){alert_msg = msg;};
    window.redirectTo = function(url) { redirect = url; }
    login();
  });

  it("should alert the user when username field is empty", function() {
    username.val(" ");
    password.val("password");
    loginForm.trigger('submit');
    expect(alert_msg).toEqual("Please enter a username!");
  });

  it("should alert the user when password field is empty", function() {
    username.val("root");
    password.val(" ");
    loginForm.trigger('submit');
    expect(alert_msg).toEqual("Please enter a password!");
  });

  it("should submit AJAX request to proper URL", function() {
    spyOn($, "ajax");
    username.val("root");
    password.val("password");
    loginForm.trigger('submit');
    expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/auth");
  });

  it("should submit AJAX request with proper data", function() {
    spyOn($, "ajax");
    var loginData = "{\"jsonrpc\":\"2.0\",\"method\":\"login\",\"params\":[\"root\",\"asdf1234\"],\"id\":1}";
    username.val("root");
    password.val("asdf1234");
    loginForm.trigger('submit');
    expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(loginData);
  });

  it("should validate the login credentials if auth token was retrieved successfully", function() {
    document.cookie = "sysauth=abcdef123456";
    spyOn($, "ajax").andCallFake(function(params){
      params.success({});
    });
    username.val("root");
    password.val("asdfghjkl12P");
    loginForm.trigger('submit');
    expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/sys?auth=" +authorizationToken);
  });

  it("should not redirect user if login fails", function() {
    spyOn($, "ajax").andCallFake(function(params){
      params.error({});
    });
    username.val("baduser");
    password.val('basspass');
    loginForm.trigger('submit');
    expect(redirect).toEqual(null);
  });
});

