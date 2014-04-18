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
  var uciUrl = "http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken;
	var newSsid = $('#ssid').val();

	var ssidRequest = {
		"jsonrpc": "2.0",
    "method": "set",
    "params": ["wireless.@wifi-iface[0].ssid="+newSsid],
    "id": 1
	}

  var commitRequest = {
		"jsonrpc": "2.0",
    "method": "commit",
    "params": ["wireless"],
    "id": 1
	}

	var getRequest = {
		"jsonrpc": "2.0",
    "method": "get",
    "params": ["wireless.@wifi-iface[0].ssid"],
    "id": 1
	}

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