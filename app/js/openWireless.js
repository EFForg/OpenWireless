var authorizationToken = getSysauthFromCookie(document.cookie);	

function login() {
  var form = $('form');
  var username = $('#username');
  var password = $('#password');


  form.on('submit', function(event){
    event.preventDefault();
    if(isEmpty(username.val())) {
      alert("Please enter a username!");
      username.focus();
    }
    if(isEmpty(password.val())){
      alert("Please enter a password!");
      password.focus();
    }

    var authRequest = createJsonRequest("login", [username.val(), password.val()])
    createAjaxRequest("http://192.168.1.1/cgi-bin/luci/rpc/auth", authRequest, redirectTo("changePassword.html"));
  });
};

function redirectTo(url) { window.location.href = url; }
function isEmpty(value) { return !value || value.length === 0 || value == " " }
function createAjaxRequest(url, requestData, successFunction) {
  console.log('here');
  console.log(successFunction);
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

function setSSID() {
  var uciUrl = "http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken;
  var newSsid = $('#ssid').val();

  var ssidRequest = createJsonRequest("set", ["wireless.@wifi-iface[0].ssid="+newSsid]);
  var commitRequest = createJsonRequest("commit", ["wireless"]);
  var getRequest = createJsonRequest("get", ["wireless.@wifi-iface[0].ssid"]);

  function getSSID(response){
    createAjaxRequest(uciUrl, getRequest, function(response){ 
      $("#updatedSSID").html("SSID updated to " + response.result);
      $('#ssid').val("");
    });
  }

  function commitSsid() {
    createAjaxRequest(uciUrl, commitRequest, getSSID);
  }

  createAjaxRequest(uciUrl, ssidRequest, commitSsid);
  return false;
}
