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
function createJsonRequest(method, parameters) {
  return {
    "jsonrpc": "2.0",
    "method": method,
    "params": parameters,
    "id": 1
  }
}

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
