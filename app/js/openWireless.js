function setSSID() {
  //TODO: auth token sent over plain text
  //TODO: hard coded ip address
    var uciUrl = "uci?auth="+authorizationToken;
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
