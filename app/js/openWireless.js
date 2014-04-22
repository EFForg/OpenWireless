var authorizationToken = getSysauthFromCookie(document.cookie);	

function getSysauthFromCookie(cookieString) {
	var sysauthPairs = cookieString.split(";");
	var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
	return lastCookieValue[1];
};
	
function login() {
	var username = $('#username').val();
	var password = $('#password').val();

	var authRequest = createJsonRequest("login", [username, password])

	function loginSuccess(response) {
		window.location.href = "changePassword.html";
	}

	createAjaxRequest("http://192.168.1.1/cgi-bin/luci/rpc/auth", authRequest, loginSuccess);
	return false;
};

function setSSID() {
  var uciUrl = "http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken;
	var newSsid = $('#ssid').val();

	var ssidRequest = createJsonRequest("set", ["wireless.@wifi-iface[0].ssid="+newSsid]);
	var commitRequest = createJsonRequest("commit", ["wireless"]);
	var getRequest = createJsonRequest("get", ["wireless.@wifi-iface[0].ssid"]);

	function getSSID(response){
		createAjaxRequest(uciUrl, getRequest, function(response){ $("#updatedSSID").val(response.result); });
	}
  
	function commitSsid() {
		createAjaxRequest(uciUrl, commitRequest, getSSID);
	}

	createAjaxRequest(uciUrl, ssidRequest, commitSsid);
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

function createJsonRequest(method, parameters) {
	return {
		"jsonrpc": "2.0",
    "method": method,
    "params": parameters,
    "id": 1
	}
}

