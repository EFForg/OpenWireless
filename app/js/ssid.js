var uciUrl, newSsid;
function setSSID() {
  var ssidform = $('form');  

  ssidform.submit(function(event){
    //TODO: sending info over plain http
    //TODO: hard coded ip address
    uciUrl   = "http://192.168.1.1/cgi-bin/luci/rpc/uci?auth="+authorizationToken;
    newSsid  = $('#ssid').val();
    event.preventDefault();
    //TODO: First validate the input before hiding
    $('.formDiv').hide();
    $('#restarting').show();

    var ssidRequest = { "jsonrpc": "2.0", "method": "set", "params": ["wireless.@wifi-iface[0].ssid="+newSsid], "id": 1 };

    requestModule.submitRequest({url: uciUrl, successCallback: commitSsid, errorCallback: errorHandler, data: ssidRequest});
  });
}

function errorHandler(request, errorType, errorMessage) {
  console.log('Error: ' + errorType + ': Message : ' + errorMessage);
}

function commitSsid() {
  var commitRequest = { "jsonrpc": "2.0", "method": "commit", "params": ["wireless"], "id": 1 };

  requestModule.submitRequest({url: uciUrl, successCallback: getSSID, errorCallback: errorHandler, data: commitRequest});
}

function getSSID(response){
  var getRequest = { "jsonrpc": "2.0", "method": "get", "params": ["wireless.@wifi-iface[0].ssid"], "id": 1 };
  requestModule.submitRequest({url: uciUrl, successCallback: getSSIDSuccess, errorCallback: errorHandler, data: getRequest});
}

function getSSIDSuccess(response) {
  setTimeout(function() {
    $('#restarting').hide();
    $("#restartSuccess").html("<h1>Restart Successful</h1><p>SSID updated to <b>" + response.result + "</b>.<br>Please connect to this network now.</p>");
    $('#restartSuccess').show();
  }, 3000);
}

//TODO: make sure this cookie is secure
var authorizationToken = getSysauthFromCookie(document.cookie);

//TODO: dry this up
function getSysauthFromCookie(cookieString) {
  var sysauthPairs = cookieString.split(";");
  var lastCookieValue = sysauthPairs[sysauthPairs.length - 1].split("=");
  return lastCookieValue[1];
}

function redirectTo(url) { window.location.href = url; };

$(function() {
  setSSID();
});
