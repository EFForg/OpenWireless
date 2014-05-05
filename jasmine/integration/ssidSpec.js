describe("Set SSID page", function() {
  var username, password, loginForm, ssid, alert_msg, redirect ;

  beforeEach(function() {
    alert_msg = null;
    affix('form input#username+input#password+input#ssid');
    ssidForm = $('form');
    username = $('#username');
    password = $('#password');
    ssid     = $('#ssid');
    window.alert = function(msg){alert_msg = msg;};
    window.redirectTo = function(url) { redirect = url; }
    spyOn($, 'ajax');
    setSSID();
  });

  it("should get the last sysauth cookie", function() {
    var cookie="sysauth=8f098ad358d003; sysauth=a1b2c3d456ef7890";
    expect(getSysauthFromCookie(cookie)).toEqual("a1b2c3d456ef7890");
  });


  it("should submit AJAX request to proper URL", function() {
    authorizationToken = "abcdef123456";
    ssidForm.trigger('submit');
    expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken);
  });

  it("should submit AJAX request with proper data", function() {
    var ssidData = "{\"jsonrpc\":\"2.0\",\"method\":\"set\",\"params\":[\"wireless.@wifi-iface[0].ssid=myPrivateNetwork\"],\"id\":1}";
    ssid.val("myPrivateNetwork");
    ssidForm.trigger('submit');
    expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(ssidData);
  });
});
