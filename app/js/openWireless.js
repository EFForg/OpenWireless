var authorizationToken = getSysauthFromCookie(document.cookie);	

function getSysauthFromCookie(cookieString) {
	var sysauthPairs = cookieString.split(";");
	var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
	return lastCookieValue[1];
};
	
function login() {
	var username = $('#username').val();
	var password = $('#password').val();

    if($("#username").val() == " ") {
        alert("Please enter a username!");
        $("#username").focus();
        return true;
    }

    if($("#password").val() == " ") {
        alert("Please enter a password!");
        $("#password").focus();
        return true;
    }

    var authRequest = createJsonRequest("login", [username, password]);
    createAjaxRequest("http://192.168.1.1/cgi-bin/luci/rpc/auth", authRequest, loginSuccess);

    function loginSuccess() {
        var validateCredentialsUrl = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+getSysauthFromCookie(document.cookie);
        var checkValidity = createJsonRequest("user.checkpasswd", [username, password]);
        createAjaxRequest(validateCredentialsUrl, checkValidity, validCredentialsSuccess);
        function validCredentialsSuccess(response) {
            if(response.result){
                window.location.href = "changePassword.html";
            } else {
                alert("Username/password is incorrect");
                $("#username").focus();
                return true;
            }
        }
    }
	return false;
};

function setSSID() {
    var uciUrl = "http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken;
	var newSsid = $('#ssid').val();
	//TODO: First validate the input before hiding
	$('.formDiv').hide();
	$('#restarting').show();

	var ssidRequest = createJsonRequest("set", ["wireless.@wifi-iface[0].ssid="+newSsid]);
	var commitRequest = createJsonRequest("commit", ["wireless"]);
	var getRequest = createJsonRequest("get", ["wireless.@wifi-iface[0].ssid"]);

	function getSSID(response){
		createAjaxRequest(uciUrl, getRequest, function(response){ 
			setTimeout(function() {
				$('#restarting').hide();
				$("#restartSuccess").html("<h1>Restart Successful</h1><p>SSID updated to <b>" + response.result + "</b>.<br>Please connect to this network now.</p>");
				$('#restartSuccess').show();
			}, 3000);
		});
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

