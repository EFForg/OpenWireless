var authorizationToken = getSysauthFromCookie(document.cookie);	

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

	function loginSuccess(response) {
		window.location.href = "changePassword.html";
	}

	createAjaxRequest("http://192.168.1.1/cgi-bin/luci/rpc/auth", authRequest, loginSuccess);
	return false;
};

function setSSID() {
	var ssid = $('#ssid').val();

	var ssidRequest = {
		"jsonrpc": "2.0",
    "method": "set",
    "params": ["wireless.@wifi-iface[0].ssid="+ssid],
    "id": 1
	}

	createAjaxRequest("http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken, ssidRequest, function() { alert("It worked!"); });
	return false;
}

function createAjaxRequest(url, requestData, successFunction) {
	$.ajax({
		type: "POST",
		url: url,
		contentType: "application/json",
	  dataType: "json",
		data: JSON.stringify(requestData),
		success: successFunction
	});
}