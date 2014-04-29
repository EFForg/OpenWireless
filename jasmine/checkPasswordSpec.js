describe("Change password page", function() {
	beforeEach(function() {
		$('body').append("<div id='test'><input type='password' id='newPassword'></input><input type='password' id='retypePassword'></input></div>");
	});

	afterEach(function() {
		$('#newPassword').val("asdfghjkl12P");
		$('#retypePassword').val("asdfghjkl12P");
	});

	it("should return false when new password field is empty", function() {
        var newPassword = $("#newPassword");
		spyOn(newPassword, "val").andReturn("");
		expect(checkForm()).toBeFalsy();
        $('#test').remove();
	});

	it("should return false when retype password field is an empty string", function() {
        var retypePassword = $("#retypePassword");
		spyOn(retypePassword, "val").andReturn(" ");
		expect(checkForm()).toBeFalsy();
	});

	it("should submit AJAX request with proper data", function() {
		authorizationToken = "abcdef123456";
		var changePasswordData = "{\"jsonrpc\":\"2.0\",\"method\":\"user.setpasswd\",\"params\":[\"root\",\"asdfghjkl12P\"],\"id\":1}";
		var newPassword = $("#newPassword");
		var retypePassword = $("#retypePassword");
		spyOn($, "ajax");
		expect(checkForm()).toBeTruthy();
		expect($.ajax.mostRecentCall.args[0]["data"]).toEqual(changePasswordData);
        $('#test').remove();
	});
});

