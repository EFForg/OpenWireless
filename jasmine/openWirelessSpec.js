describe("All pages", function() {
	it("should get the last sysauth cookie", function() {
		var cookie="sysauth=8f098ad358d003; sysauth=a1b2c3d456ef7890";
		expect(getSysauthFromCookie(cookie)).toEqual("a1b2c3d456ef7890");
	});
});

describe("Login page", function() {
	beforeEach(function() {
		$("body").append("<div id='test'><input type='text' id='username'></input><input type='text' id='password'></input></div>");
  });

	it("should submit AJAX request to proper URL", function() {
		spyOn($, "ajax");
		login();
		expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/auth");
	});

	it("should submit AJAX request with proper data", function() {
		var loginData = "{\"jsonrpc\":\"2.0\",\"method\":\"login\",\"params\":[\"root\",\"asdf1234\"],\"id\":1}";
		$('#username').val("root");
		$('#password').val("asdf1234");
		spyOn($, "ajax");
		login();
		expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(loginData);
	});

	afterEach(function() {
		$('#test').remove();
	})
});
