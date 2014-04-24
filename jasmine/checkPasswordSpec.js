describe("Change password page", function() {
	beforeEach(function() {
		$('body').append("<div id='test'><input type='password' id='newPassword'></input><input type='password' id='retypePassword'></input></div>");
	});

	afterEach(function() {
		$('#newPassword').val("qwerty");
	});

	it("should return false when new password field is empty", function() {
        var newPassword = $("#newPassword");
		spyOn(newPassword, "val").andReturn("");
        checkForm();
		expect(checkForm()).toBeFalsy();
	});

	it("should return false when new password field is an empty string", function() {
        var newPassword = $("#newPassword");
		spyOn(newPassword, "val").andReturn(" ");
        checkForm();
		expect(checkForm()).toBeFalsy();
	});

	it("should submit AJAX request with proper data", function() {
		authorizationToken = "abcdef123456";
		var changePasswordData = "{\"jsonrpc\":\"2.0\",\"method\":\"user.setpasswd\",\"params\":[\"root\",\"qwerty\"],\"id\":1}";
		var newPassword = $("#newPassword");
		var retypePassword = $("#retypePassword");
		spyOn(newPassword, "val").andReturn("qwerty");
		spyOn(retypePassword, "val").andReturn("qwerty");
		console.log(newPassword.val());
		console.log(retypePassword.val());
		spyOn($, "ajax");
		checkForm();
		expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(changePasswordData);
	});
});

//describe("SSID page", function() {
//	beforeEach(function() {
//		$("body").append("<div id='test'><input type='text' id='ssid'></input></div>");
//  });
//
//	it("should submit AJAX request to proper URL", function() {
//		authorizationToken = "abcdef123456";
//		spyOn($, "ajax");
//		setSSID();
//		expect($.ajax.mostRecentCall.args[0]["url"]).toEqual("http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken);
//	});
//
//	it("should submit AJAX request with proper data", function() {
//		var ssidData = "{\"jsonrpc\":\"2.0\",\"method\":\"set\",\"params\":[\"wireless.@wifi-iface[0].ssid=myPrivateNetwork\"],\"id\":1}";
//		$('#ssid').val("myPrivateNetwork");
//		spyOn($, "ajax");
//		setSSID();
//		expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(ssidData);
//	});
//
//	afterEach(function() {
//		$('#test').remove();
//	});
//});
