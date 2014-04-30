describe("All pages", function() {
  var username, password, loginForm, ssid;

  beforeEach(function() {
    affix('#test form#loginForm input#username+input#password+input#ssid');
    loginForm = $('#loginForm');
    username = $('#username');
    password = $('#password');
    ssid     = $('#ssid');
    window.alert = function(){return;};
    spyOn($, "ajax");
  });

  it("should get the last sysauth cookie", function() {
    var cookie="sysauth=8f098ad358d003; sysauth=a1b2c3d456ef7890";
    expect(getSysauthFromCookie(cookie)).toEqual("a1b2c3d456ef7890");
  });

  describe("Login page", function() {

    it("should return true when username field is empty", function() {
      username.val(" ");
      expect(login()).toBeTruthy();
    });

    it("should return true when password field is empty", function() {
      username.val("root");
      password.val(" ");
      expect(login()).toBeTruthy();
    });


    it("should submit AJAX request to proper URL", function() {
      login();
      expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/auth");
    });

    it("should submit AJAX request with proper data", function() {
      var loginData = "{\"jsonrpc\":\"2.0\",\"method\":\"login\",\"params\":[\"root\",\"asdf1234\"],\"id\":1}";
      username.val("root");
      password.val("asdf1234");
      login();

      expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(loginData);
    });
  });

  describe("SSID page", function() {
    it("should submit AJAX request to proper URL", function() {
      authorizationToken = "abcdef123456";
      setSSID();
      expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken);
    });

    it("should submit AJAX request with proper data", function() {
      var ssidData = "{\"jsonrpc\":\"2.0\",\"method\":\"set\",\"params\":[\"wireless.@wifi-iface[0].ssid=myPrivateNetwork\"],\"id\":1}";
      ssid.val("myPrivateNetwork");
      setSSID();
      expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(ssidData);
    });
  });
});
