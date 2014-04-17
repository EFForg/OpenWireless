var authorizationToken = "";	

function getSysauthFromCookie(cookieString) {
	var sysauthPairs = cookieString.split(";");
	var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
	return lastCookieValue[1];
};
	
function login() {
	var username = $('#username').val();
	var password = $('#password').val();

	var authRequest = {
		"jsonrpc": "2.0",
		"method": "login",
		"params": [username, password],
		"id": 1
	}

	$.ajax({
		type: "POST",
		url: "http://192.168.1.1/cgi-bin/luci/rpc/auth",
		contentType: "application/json",
	  dataType: "json",
		data: JSON.stringify(authRequest),
		success: function(response) {
			window.location.href = "changePassword.html";
		}
	});
	return false;
};

function setSSID() {
	var ssid = $('#ssid').val();

	var ssidRequest = {
		"jsonrpc": "2.0",
    "method": "set",
    "params": [ssid],
    "id": 1
	}

	$.ajax({
		type: "POST",
		url: "http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken,
		contentType: "application/json",
		dataType: "json",
		data: JSON.stringify(ssidRequest),
		success: function() {
			alert("It worked!");
		},
	});

	return false;
}
