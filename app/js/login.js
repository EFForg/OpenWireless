var authorizationToken = getSysauthFromCookie(document.cookie);

function login() {
  var username = $('#username');
  var password = $('#password');

    if(isEmpty(username.val())) {
      alert("Please enter a username!");
      username.focus();
    }
    if(isEmpty(password.val())){
      alert("Please enter a password!");
      password.focus();
    }

    var authRequest = createJsonRequest("login", [username.val(), password.val()]);
    createAjaxRequest("http://192.168.1.1/cgi-bin/luci/rpc/auth", authRequest, loginSuccess);

    function loginSuccess() {
        var validateCredentialsUrl = "http://192.168.1.1/cgi-bin/luci/rpc/sys?auth="+getSysauthFromCookie(document.cookie);
        var checkValidity = createJsonRequest("user.checkpasswd", [username.val(), password.val()]);
        createAjaxRequest(validateCredentialsUrl, checkValidity, validCredentialsSuccess);
        function validCredentialsSuccess(response) {
            if(response.result){
                redirectTo("changePassword.html");
            } else {
                alert("Username/password is incorrect");
                $("#username").focus();
                return true;
            }
        }
    }
    return false;
};

function createAjaxRequest(url, requestData, successFunction) {
	$.ajax({
		type: "POST",
		url: url,
		contentType: "application/json",
	    dataType: "json",
		data: JSON.stringify(requestData),
        success: successFunction,
        error: function(request, errorType, errorMessage) {
            console.log('Error: ' + errorType + ': Message : ' + errorMessage);
        }
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

function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
};

function redirectTo(url) { window.location.href = url; }
function isEmpty(value) { return !value || value.length === 0 || value == " " }
